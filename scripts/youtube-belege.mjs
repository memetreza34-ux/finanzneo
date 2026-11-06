#!/usr/bin/env node
// Phase 1: echte Quellen-Screenshots für alle Beleg-Visuals eines YouTube-Projekts.
//
//   npm run youtube:belege -- youtube/<Projekt> [--nur visual-07]
//
// Öffnet jede `url` im lokalen Chrome (headless, 1440 px breit, doppelte Auflösung), entfernt
// Cookie-Banner und Overlays, sucht jede `markierungen[].text` im echten Seitentext und speichert
// pro Visual:
//   beleg.png   Seite von oben bis unter die letzte Fundstelle (2880 px breit)
//   beleg.json  Ausschnitte (Kopf, Titel, Textblock) und die exakten Positionen der Markierungen
//
// Nur Text, der wirklich auf der Seite steht, kann markiert werden — fehlt eine Markierung,
// bricht das Skript ab. Kanonische Regel: docs/YOUTUBE-BELEG-SZENEN.md

import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {VISUAL_INDEX, internWurzel} from './lib/youtube-contract.mjs';
import {findeChrome} from './lib/youtube-chrome.mjs';
import {YOUTUBE_BELEG_BILD, YOUTUBE_BELEG_STANDARD_ID, berechneBelegTeile, pruefeBelegAufnahme, pruefeBelegPlan} from './lib/youtube-beleg.mjs';

const args = process.argv.slice(2);
const nur = args.includes('--nur') ? args[args.indexOf('--nur') + 1] : null;
const projekt = args.find((a) => !a.startsWith('--') && a !== nur);
if (!projekt) {
  console.error('Aufruf: npm run youtube:belege -- youtube/<Projekt> [--nur visual-07]');
  process.exit(1);
}
const root = internWurzel(projekt);
const index = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
const belege = (index.visuals ?? []).filter((v) => v.type === 'beleg' && (!nur || v.id === nur));
if (belege.length === 0) {
  console.log(nur ? `Kein Beleg-Visual ${nur}.` : 'Keine Beleg-Visuals im Projekt.');
  process.exit(0);
}
const planFehler = belege.flatMap(pruefeBelegPlan);
if (planFehler.length) {
  console.error('Beleg-Plan unvollständig:\n' + planFehler.map((f) => `- ${f}`).join('\n'));
  process.exit(1);
}

const BREITE = 1440;
const HOEHE = 1000;
const SKALA = 2;
const MAX_SEITENHOEHE = 12000;

// ─── Chrome ──────────────────────────────────────────────────────────────────
const starteChrome = async () => {
  const pfad = findeChrome();
  if (!pfad) throw new Error('Kein Chrome gefunden. Google Chrome installieren oder FINANZNEO_CHROME=<Pfad> setzen.');
  const profil = mkdtempSync(join(tmpdir(), 'finanzneo-beleg-'));
  const headless = pfad.includes('headless-shell') ? '--headless' : '--headless=new';
  const chrome = spawn(pfad, [headless, '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--mute-audio', '--lang=de-DE', `--user-data-dir=${profil}`, '--remote-debugging-port=0', `--window-size=${BREITE},${HOEHE}`, 'about:blank'], {stdio: ['ignore', 'ignore', 'pipe']});
  const wsUrl = await new Promise((ok, fail) => {
    let puffer = '';
    const timer = setTimeout(() => fail(new Error('Chrome startet nicht (keine DevTools-Adresse nach 20 s).')), 20000);
    chrome.stderr.on('data', (d) => {
      puffer += d;
      const m = /DevTools listening on (ws:\/\/\S+)/.exec(puffer);
      if (m) {clearTimeout(timer); ok(m[1]);}
    });
    chrome.on('exit', (code) => {clearTimeout(timer); fail(new Error(`Chrome beendet (Code ${code}).`));});
  });
  const beenden = () => {
    chrome.kill();
    try {rmSync(profil, {recursive: true, force: true});} catch {/* Profil räumt das System auf */}
  };
  return {wsUrl, beenden};
};

// Minimaler DevTools-Client: Befehle mit Antwort, Ereignisse per Name.
const verbinde = async (wsUrl) => {
  const ws = new WebSocket(wsUrl);
  await new Promise((ok, fail) => {ws.onopen = ok; ws.onerror = () => fail(new Error('DevTools-Verbindung fehlgeschlagen.'));});
  let naechsteId = 0;
  const offen = new Map();
  const hoerer = new Set();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && offen.has(m.id)) {
      const {ok, fail} = offen.get(m.id);
      offen.delete(m.id);
      if (m.error) fail(new Error(m.error.message)); else ok(m.result);
    } else if (m.method) for (const h of hoerer) h(m);
  };
  const senden = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    const id = ++naechsteId;
    offen.set(id, {ok, fail});
    ws.send(JSON.stringify({id, method, params, ...(sessionId ? {sessionId} : {})}));
  });
  const warteAuf = (method, sessionId, ms) => new Promise((ok, fail) => {
    const h = (m) => {
      if (m.method === method && m.sessionId === sessionId) {clearTimeout(timer); hoerer.delete(h); ok(m.params);}
    };
    const timer = setTimeout(() => {hoerer.delete(h); fail(new Error(`Zeitüberschreitung: ${method}`));}, ms);
    hoerer.add(h);
  });
  return {senden, warteAuf, hoerer, schliessen: () => ws.close()};
};

// ─── Seitenskript: Overlays weg, Text finden, Ausschnitte messen ─────────────
// Läuft im Browser. Alle Koordinaten in Seiten-CSS-Pixeln (inkl. Scroll).
/* global document, getComputedStyle, innerWidth, innerHeight, window, NodeFilter, scrollY */
const SEITENSKRIPT = String(async (marken, entfernen) => {
  const raus = ['#usercentrics-root', '#onetrust-consent-sdk', '#CybotCookiebotDialog', '[id^="sp_message"]', 'iframe[src*="consent"]', 'iframe[id*="consent" i]', ...entfernen];
  for (const s of raus) document.querySelectorAll(s).forEach((e) => e.remove());
  for (const e of document.querySelectorAll('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i]')) {
    const st = getComputedStyle(e);
    if (st.position === 'fixed' || st.position === 'sticky') e.remove();
  }
  for (const e of document.querySelectorAll('body *')) {
    const st = getComputedStyle(e);
    if (st.position !== 'fixed' && st.position !== 'sticky') continue;
    const r = e.getBoundingClientRect();
    if (r.width * r.height > innerWidth * innerHeight * 0.2) e.remove();
    else if (st.position === 'sticky') e.style.position = 'static';
  }
  for (const e of [document.documentElement, document.body]) {e.style.overflow = 'visible'; e.style.filter = 'none';}
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));

  // Sichtbarer Seitentext mit Leerraum-Normalisierung; jedes Zeichen kennt Knoten + Offset.
  const zeichen = [];
  let voll = '';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentElement;
      // Hochgestellte Satznummern (Gesetzestexte: „1In der …“) gehören nicht zum Wortlaut.
      if (!p || p.closest('script, style, noscript, template, sup')) return NodeFilter.FILTER_REJECT;
      const st = getComputedStyle(p);
      return st.display === 'none' || st.visibility === 'hidden' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (c === '­') continue;
      if (/\s/.test(c)) {
        if (voll.endsWith(' ')) continue;
        voll += ' ';
      } else voll += c;
      zeichen.push([n, i]);
    }
  }
  const norm = (s) => s.replace(/­/g, '').replace(/\s+/g, ' ').trim();
  const box = (r) => ({x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height)});
  const BLOCK = 'p, li, td, th, blockquote, dd, dt, figcaption, h1, h2, h3, h4, h5, h6';

  const ergebnis = [];
  const bloecke = [];
  let auszug = 0;
  for (const text of marken) {
    const i = voll.indexOf(norm(text));
    if (i < 0) {ergebnis.push({text, rects: []}); continue;}
    const [startKnoten, startOffset] = zeichen[i];
    const [endKnoten, endOffset] = zeichen[i + norm(text).length - 1];
    const range = document.createRange();
    range.setStart(startKnoten, startOffset);
    range.setEnd(endKnoten, endOffset + 1);
    // Zeilenweise zusammenfassen (Inline-Elemente liefern mehrere Rechtecke pro Zeile).
    const zeilen = [];
    for (const r of [...range.getClientRects()].filter((q) => q.width > 1 && q.height > 1).map(box)) {
      const z = zeilen.find((q) => Math.abs(q.y + q.h / 2 - (r.y + r.h / 2)) < r.h / 2);
      if (z) {
        const rechts = Math.max(z.x + z.w, r.x + r.w);
        z.x = Math.min(z.x, r.x);
        z.w = rechts - z.x;
        z.y = Math.min(z.y, r.y);
        z.h = Math.max(z.h, r.h);
      } else zeilen.push({...r});
    }
    ergebnis.push({text, rects: zeilen});
    const block = startKnoten.parentElement.closest(BLOCK) ?? startKnoten.parentElement;
    const b = box(block.getBoundingClientRect());
    if (b.h <= 700) {
      if (!bloecke.some((q) => q.x === b.x && q.y === b.y)) {bloecke.push(b); auszug += norm(block.innerText).length;}
    } else {
      const oben = Math.min(...zeilen.map((z) => z.y));
      const unten = Math.max(...zeilen.map((z) => z.y + z.h));
      bloecke.push({x: b.x, y: oben - 60, w: b.w, h: unten - oben + 120});
      auszug += norm(text).length + 200;
    }
  }

  const sichtbar = (e) => {const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0;};
  const h1 = [...document.querySelectorAll('h1')].find(sichtbar);
  const header = [...document.querySelectorAll('header, [role="banner"]')].find(sichtbar);
  let kopf = header ? box(header.getBoundingClientRect()) : null;
  // Nur die Logo-Zeile zeigen, nicht das Navigationsmenü darunter.
  const logo = header && [...header.querySelectorAll('[class*="logo" i], img, svg')].find(sichtbar);
  if (kopf && logo) {
    const l = box(logo.getBoundingClientRect());
    kopf = {...kopf, h: Math.min(kopf.h, l.y + l.h + 20 - kopf.y)};
  }
  return {
    marken: ergebnis,
    bloecke,
    titel: h1 ? box(h1.getBoundingClientRect()) : null,
    kopf: kopf && kopf.y < 60 && kopf.h >= 30 && kopf.h <= 260 ? kopf : null,
    auszugZeichen: auszug,
    seitenTitel: document.title,
    seitenText: voll.slice(0, 400),
  };
});

const datum = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const nimmAuf = async (cdp, visual) => {
  const {targetId} = await cdp.senden('Target.createTarget', {url: 'about:blank'});
  const {sessionId} = await cdp.senden('Target.attachToTarget', {targetId, flatten: true});
  const s = (method, params) => cdp.senden(method, params, sessionId);
  try {
    await s('Page.enable');
    await s('Network.enable');
    const {userAgent} = await cdp.senden('Browser.getVersion');
    await s('Network.setUserAgentOverride', {userAgent: userAgent.replace('HeadlessChrome', 'Chrome'), acceptLanguage: 'de-DE,de;q=0.9'});
    await s('Emulation.setDeviceMetricsOverride', {width: BREITE, height: HOEHE, deviceScaleFactor: SKALA, mobile: false});

    let status = null;
    let endUrl = visual.url;
    const h = (m) => {
      if (m.sessionId === sessionId && m.method === 'Network.responseReceived' && m.params.type === 'Document' && status === null) {
        status = m.params.response.status;
        endUrl = m.params.response.url;
      }
    };
    cdp.hoerer.add(h);
    const geladen = cdp.warteAuf('Page.loadEventFired', sessionId, 45000);
    const nav = await s('Page.navigate', {url: visual.url});
    if (nav.errorText) throw new Error(`Seite nicht ladbar: ${nav.errorText}`);
    await geladen;
    cdp.hoerer.delete(h);
    if (status !== null && status >= 400) throw new Error(`Seite antwortet mit HTTP ${status}.`);
    await new Promise((r) => setTimeout(r, 2500));

    const {result, exceptionDetails} = await s('Runtime.evaluate', {
      expression: `(${SEITENSKRIPT})(${JSON.stringify(visual.markierungen.map((m) => m.text))}, ${JSON.stringify(visual.entfernen ?? [])})`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) throw new Error(`Seitenskript: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`);
    const seite = result.value;
    const fehlend = seite.marken.filter((m) => m.rects.length === 0).map((m) => m.text);
    if (fehlend.length) {
      throw new Error(`Markierung nicht im Seitentext gefunden: ${fehlend.map((t) => `„${t}“`).join(', ')}. Exakten Wortlaut der Seite übernehmen. Seitenanfang: „${seite.seitenText.slice(0, 160)}…“`);
    }

    const teile = berechneBelegTeile({...seite, seitenBreite: BREITE});
    const hoehe = Math.ceil(Math.max(...teile.map((t) => t.y + t.h)) + 8);
    if (hoehe > MAX_SEITENHOEHE) throw new Error(`Fundstelle liegt ${hoehe} px tief — direkteren Link (Anker/Unterseite) verwenden.`);
    const {data} = await s('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true, clip: {x: 0, y: 0, width: BREITE, height: hoehe, scale: 1}});
    const png = Buffer.from(data, 'base64');

    return {
      png,
      daten: {
        standard: YOUTUBE_BELEG_STANDARD_ID,
        url: visual.url,
        endUrl,
        quelle: visual.quelle,
        quellenArt: visual.quellenArt,
        seitenTitel: seite.seitenTitel,
        abgerufenAm: datum(),
        bild: YOUTUBE_BELEG_BILD,
        skala: SKALA,
        bildBreite: BREITE,
        bildHoehe: hoehe,
        sha256: createHash('sha256').update(png).digest('hex'),
        auszugZeichen: seite.auszugZeichen,
        teile,
        markierungen: visual.markierungen.map((m, k) => ({text: m.text, cue: m.cue, rects: seite.marken[k].rects})),
      },
    };
  } finally {
    await cdp.senden('Target.closeTarget', {targetId}).catch(() => {});
  }
};

// ─── Ablauf ──────────────────────────────────────────────────────────────────
const {wsUrl, beenden} = await starteChrome();
const fehler = [];
let cdp = null;
try {
  cdp = await verbinde(wsUrl);
  for (const visual of belege) {
    try {
      const {png, daten} = await nimmAuf(cdp, visual);
      const pruefung = pruefeBelegAufnahme(visual, daten);
      if (pruefung.length) {fehler.push(...pruefung); continue;}
      writeFileSync(resolve(root, visual.belegFile), png);
      writeFileSync(resolve(root, visual.belegDatenFile), `${JSON.stringify(daten, null, 2)}\n`);
      console.log(`✓ ${visual.id}: ${visual.quelle} · ${daten.teile.map((t) => t.art).join(' + ')} · ${daten.markierungen.length} Markierung(en)`);
    } catch (error) {
      fehler.push(`${visual.id} (${visual.url}): ${error.message}`);
    }
  }
} finally {
  cdp?.schliessen();
  beenden();
}
if (fehler.length) {
  console.error('\nBelege unvollständig:\n' + fehler.map((f) => `- ${f}`).join('\n'));
  process.exit(1);
}
console.log(`\n✓ ${belege.length} Beleg(e) aufgenommen. Danach youtube:zusammenbau --vorschau und im Remotion Studio ansehen.`);
