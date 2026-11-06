// Qualitätsregeln für YouTube-Longform (finanzneo-youtube-quality-v1).
// Phase 1 schätzt Haltezeiten aus dem Skript, weil es noch kein Audio gibt; nach dem echten
// Voiceover warnt der Zusammenbau zusätzlich anhand der realen Wortzeiten.

import {
  YOUTUBE_COMMENT_CTA_PATTERN,
  YOUTUBE_COMMENT_CTA_WINDOW,
  YOUTUBE_HOOK_MAX_SECONDS,
  YOUTUBE_IMAGE_MAX_HOLD_SECONDS,
  YOUTUBE_IMAGE_WARN_HOLD_SECONDS,
  YOUTUBE_SPEECH_WPM,
  YOUTUBE_STYLE_REFERENCE_MARKER,
  YOUTUBE_BINDUNG_RULES_IDS,
  YOUTUBE_QUALITY_RULES_V3_ID,
  YOUTUBE_V3_MAX_HOLD_SECONDS,
  YOUTUBE_V3_MAX_BILD_ANTEIL,
  YOUTUBE_HOOK_ANNOUNCEMENT_PATTERN,
  YOUTUBE_CHARACTER_REFERENCE_MARKER,
  YOUTUBE_CHANNEL_STYLE_FILE,
} from './youtube-contract.mjs';
import {youtubeBelegSoll} from './youtube-beleg.mjs';
import {folieCues, folieText} from './youtube-folie.mjs';

export const normWort = (wort) =>
  wort
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');

export const skriptWoerter = (text) =>
  text.replace(/^\s*\[[^\]]*\]\s*$/gm, '').split(/\s+/).map(normWort).filter(Boolean);

/** Erste Fundstelle einer Wortfolge ab Position `ab`, sonst -1. */
export const findeCue = (woerter, cue, ab = 0) => {
  const c = skriptWoerter(cue);
  if (c.length === 0) return -1;
  for (let i = ab; i <= woerter.length - c.length; i++) if (c.every((t, k) => woerter[i + k] === t)) return i;
  return -1;
};

const sekunden = (woerter) => (woerter * 60) / YOUTUBE_SPEECH_WPM;

/**
 * Geschätzte Startwörter und längste Haltezeit je Visual. Akzente auf einem Standbild zählen als
 * neue sichtbare Information und teilen die Haltezeit.
 */
export const schaetzeHaltezeiten = (scriptText, visuals) => {
  const woerter = skriptWoerter(scriptText);
  const fehler = [];
  const starts = [];
  let cursor = 0;
  for (const v of visuals) {
    const i = findeCue(woerter, v.startCue ?? '', cursor);
    if (i < 0) {
      fehler.push(`${v.id}: startCue „${v.startCue ?? ''}“ nicht im Skript gefunden (ab Wort ${cursor}).`);
      starts.push(null);
      continue;
    }
    starts.push(i);
    cursor = i;
  }
  const ergebnis = visuals.map((v, k) => {
    const start = starts[k];
    if (start === null) return {id: v.id, type: v.type, startWort: null, laengsteHaltung: 0};
    const naechster = starts.slice(k + 1).find((s) => s !== null) ?? woerter.length;
    const marken = [start];
    let akzentCursor = start;
    // Akzente auf Bildern, Markierungen auf Belegen und Zeilen auf Folien zeigen neue Information.
    for (const akzent of v.akzente ?? v.markierungen ?? folieCues(v.folie).map((cue) => ({cue}))) {
      const a = findeCue(woerter, akzent.cue ?? '', akzentCursor);
      if (a >= 0 && a < naechster) {marken.push(a); akzentCursor = a;}
    }
    marken.push(naechster);
    let laengste = 0;
    for (let m = 1; m < marken.length; m++) laengste = Math.max(laengste, sekunden(marken[m] - marken[m - 1]));
    return {id: v.id, type: v.type, startWort: start, laengsteHaltung: laengste};
  });
  return {woerter, ergebnis, fehler};
};

/**
 * Alle Qualitätsregeln. `prompts` = Inhalt von 2-bildprompts/bildprompts.txt, `bildprompt(id)` liefert den
 * Einzelprompt. `echteHaltezeiten` (Map id → Sekunden aus dem echten Zeitplan) ersetzt nach Phase 3 die
 * Skript-Schätzung; dann gilt die Grenze YOUTUBE_IMAGE_WARN_HOLD_SECONDS.
 */
export const pruefeYouTubeQualitaet = ({index, scriptText, prompts, bildprompt, echteHaltezeiten = null}) => {
  const fehler = [];
  const visuals = index.visuals ?? [];
  const {woerter, ergebnis, fehler: cueFehler} = schaetzeHaltezeiten(scriptText, visuals);
  fehler.push(...cueFehler);

  const maxHalten = index.qualityRules === YOUTUBE_QUALITY_RULES_V3_ID ? YOUTUBE_V3_MAX_HOLD_SECONDS : YOUTUBE_IMAGE_MAX_HOLD_SECONDS;
  for (const e of ergebnis) {
    if (!['image', 'beleg', 'folie'].includes(e.type) || e.startWort === null) continue;
    const echt = echteHaltezeiten?.get(e.id);
    if (echt != null) {
      if (echt > YOUTUBE_IMAGE_WARN_HOLD_SECONDS) fehler.push(`${e.id}: Standbild steht im fertigen Zeitplan ${echt.toFixed(1)} s ohne neue Information (max. ${YOUTUBE_IMAGE_WARN_HOLD_SECONDS} s nach echtem Audio).`);
      continue;
    }
    if (e.laengsteHaltung > maxHalten) {
      fehler.push(`${e.id}: Standbild steht geschätzt ${e.laengsteHaltung.toFixed(1)} s ohne neue Information (max. ${maxHalten} s). Zusätzliches Bild einplanen oder akzente[]/Folienzeilen mit cue setzen.`);
    }
  }

  const hookKapitel = visuals[0]?.chapter;
  const ersterInhalt = visuals.findIndex((v) => v.chapter !== hookKapitel);
  if (ersterInhalt > 0 && ergebnis[ersterInhalt]?.startWort != null) {
    const hook = sekunden(ergebnis[ersterInhalt].startWort);
    if (hook > YOUTUBE_HOOK_MAX_SECONDS) fehler.push(`Hook dauert geschätzt ${hook.toFixed(0)} s bis zum ersten Kapitel (max. ${YOUTUBE_HOOK_MAX_SECONDS} s). Intro kürzen.`);
  }

  const roh = scriptText.split(/\s+/).filter(Boolean);
  const cta = roh.findIndex((w) => YOUTUBE_COMMENT_CTA_PATTERN.test(w));
  const [von, bis] = YOUTUBE_COMMENT_CTA_WINDOW;
  if (cta < 0) fehler.push('Skript enthält keine Kommentarfrage („… schreib’s in die Kommentare“).');
  else if (cta / roh.length < von || cta / roh.length > bis) {
    fehler.push(`Kommentarfrage steht bei ${Math.round((cta / roh.length) * 100)} % des Skripts; sie gehört in den mittleren Teil (${von * 100}–${bis * 100} %), damit sie nicht übersprungen wird.`);
  }

  if (index.imageWorld?.styleMaster === 'kanal') {
    const ohne = (text) => !text.includes(YOUTUBE_STYLE_REFERENCE_MARKER) || !text.includes(YOUTUBE_CHANNEL_STYLE_FILE);
    const thumbBlock = /THUMBNAIL\n━+\n\n([\s\S]*?)(?:\n━|████)/.exec(prompts ?? '')?.[1] ?? '';
    if (ohne(thumbBlock)) fehler.push(`Thumbnail hängt die Kanal-Stilvorlage „${YOUTUBE_CHANNEL_STYLE_FILE}“ nicht als ${YOUTUBE_STYLE_REFERENCE_MARKER} an.`);
    for (const v of visuals) {
      if ((v.type === 'image' || v.type === 'hybrid') && ohne(bildprompt(v) ?? '')) fehler.push(`${v.id}: Bildprompt hängt die Kanal-Stilvorlage nicht als ${YOUTUBE_STYLE_REFERENCE_MARKER} an.`);
    }
  }
  if (index.imageWorld?.styleMaster === 'thumbnail') {
    const datei = index.thumbnail?.googleFlowFileName ?? '';
    const ersterBatch = /BATCH 1 — START ALL TOGETHER: ([^\n]+)/.exec(prompts ?? '')?.[1]?.trim();
    if (ersterBatch !== 'Thumbnail') fehler.push('Batch 1 muss allein aus dem Thumbnail bestehen (Stilvorlage zuerst).');
    for (const v of visuals) {
      if (v.type !== 'image' && v.type !== 'hybrid') continue;
      const text = bildprompt(v) ?? '';
      if (!text.includes(YOUTUBE_STYLE_REFERENCE_MARKER) || !text.includes(datei)) {
        fehler.push(`${v.id}: Bildprompt hängt das Thumbnail nicht als ${YOUTUBE_STYLE_REFERENCE_MARKER} an.`);
      }
    }
  }

  if (YOUTUBE_BINDUNG_RULES_IDS.includes(index.qualityRules)) fehler.push(...pruefeBindungV2({index, scriptText, ergebnis, woerter, ersterInhalt, bildprompt}));
  if (index.qualityRules === YOUTUBE_QUALITY_RULES_V3_ID) fehler.push(...pruefeBelegeV3({visuals, woerter}), ...pruefeBildmixV3({ergebnis, woerter}));

  return {fehler, haltezeiten: ergebnis, wortzahl: woerter.length};
};

// Wortstamm-Vergleich: „Preisvergleich“ trifft „vergleich“, „Raten“ trifft „Rate“.
const stamm = (wort) => normWort(wort).slice(0, 5);
const kommtVor = (begriff, woerter) => {
  const teile = skriptWoerter(begriff);
  if (teile.length === 0) return false;
  return teile.every((t) => woerter.some((w) => w === t || (t.length >= 4 && w.length >= 4 && (w.startsWith(stamm(t)) || t.startsWith(stamm(w)) || w.includes(t)))));
};

/**
 * V2 — Skript, Bild und Animation fest gebunden:
 * 1. Hook ohne Ankündigung („In diesem Video …“), sondern Szene/Person/Konflikt.
 * 2. story.protagonist: Hauptfigur wird im Hook genannt (oder begründet keine).
 * 3. Jedes Bild hat ein `keyword`, das in genau seinem Sprechabschnitt fällt → Bild zeigt, was gesagt wird.
 * 4. Jede Animation hat ein `bridgeObject`, das im Bild davor oder danach vorkommt → kein Weltwechsel.
 */
export const pruefeBindungV2 = ({index, scriptText, ergebnis, woerter, ersterInhalt, bildprompt = () => ''}) => {
  const fehler = [];
  const visuals = index.visuals ?? [];
  const hookEnde = ersterInhalt > 0 && ergebnis[ersterInhalt]?.startWort != null ? ergebnis[ersterInhalt].startWort : Math.min(60, woerter.length);
  const roh = scriptText.replace(/^\s*\[[^\]]*\]\s*$/gm, '').split(/\s+/).filter((w) => normWort(w));
  const hookText = roh.slice(0, hookEnde).join(' ');
  if (YOUTUBE_HOOK_ANNOUNCEMENT_PATTERN.test(hookText)) {
    fehler.push(`Hook kündigt an („${YOUTUBE_HOOK_ANNOUNCEMENT_PATTERN.exec(hookText)[0]}“) statt mit Szene, Person oder Konflikt zu starten.`);
  }

  const story = index.story ?? {};
  if (typeof story.protagonist === 'string' && story.protagonist.trim() && !story.protagonist.startsWith('[')) {
    if (!kommtVor(story.protagonist, woerter.slice(0, hookEnde))) fehler.push(`Hauptfigur „${story.protagonist}“ wird im Hook nicht genannt.`);
  } else if (story.protagonist !== null || typeof story.reason !== 'string' || !story.reason.trim() || story.reason.startsWith('[')) {
    fehler.push('story.protagonist fehlt: Hauptfigur benennen oder bewusst null mit story.reason begründen.');
  }

  const figurBild = story.protagonist ? story.figurBild : null;
  for (const [k, v] of visuals.entries()) {
    if (!v.figur || figurBild == null || figurBild === k + 1) continue;
    if (!(bildprompt(v) ?? '').includes(YOUTUBE_CHARACTER_REFERENCE_MARKER)) fehler.push(`${v.id}: zeigt ${story.protagonist}, hängt aber das Figur-Bild nicht als ${YOUTUBE_CHARACTER_REFERENCE_MARKER} an.`);
  }

  ergebnis.forEach((e, k) => {
    const v = visuals[k];
    if (!v || e.startWort === null) return;
    const ende = ergebnis.slice(k + 1).find((x) => x.startWort !== null)?.startWort ?? woerter.length;
    const abschnitt = woerter.slice(e.startWort, ende);
    if (v.type === 'beleg') {
      for (const m of v.markierungen ?? []) {
        if (typeof m?.cue === 'string' && m.cue.trim() && !kommtVor(m.cue, abschnitt)) fehler.push(`${v.id}: Markierungs-cue „${m.cue}“ fällt nicht in seinem Sprechabschnitt — Beleg und Satz passen nicht zusammen.`);
      }
    } else if (v.type === 'folie') {
      for (const cue of folieCues(v.folie)) {
        if (!kommtVor(cue, abschnitt)) fehler.push(`${v.id}: Folien-cue „${cue}“ fällt nicht in seinem Sprechabschnitt — Folie und Satz passen nicht zusammen.`);
      }
    } else if (v.type === 'image' || v.type === 'hybrid') {
      if (typeof v.keyword !== 'string' || !v.keyword.trim()) fehler.push(`${v.id}: keyword fehlt (welches gesprochene Wort zeigt dieses Bild?).`);
      else if (!kommtVor(v.keyword, abschnitt)) fehler.push(`${v.id}: keyword „${v.keyword}“ fällt nicht in seinem Sprechabschnitt — Bild und Satz passen nicht zusammen.`);
    } else {
      const nachbarn = [visuals[k - 1], visuals[k + 1]].filter((n) => n && ['image', 'hybrid', 'beleg', 'folie'].includes(n.type));
      const text = (n) => [n.expectedVisual, ...(n.objectLabels ?? []), ...(n.markierungen ?? []).map((m) => m.text), folieText(n.folie)].filter(Boolean).join(' ');
      if (typeof v.bridgeObject !== 'string' || !v.bridgeObject.trim()) fehler.push(`${v.id}: bridgeObject fehlt (welches Objekt aus dem Nachbarbild trägt die Animation weiter?).`);
      else if (!nachbarn.some((n) => kommtVor(v.bridgeObject, skriptWoerter(text(n))))) fehler.push(`${v.id}: bridgeObject „${v.bridgeObject}“ kommt im Bild davor/danach nicht vor.`);
    }
  });
  return fehler;
};

/**
 * V3 — echte Belege statt nur KI-Bildern (Arman, 30.10.2026): Zahlen, Gesetze und Aussagen Dritter
 * werden mit einem echten Quellen-Screenshot gezeigt. Einer je volle 90 s Sprechzeit, mindestens 3,
 * und der erste spätestens im ersten inhaltlichen Kapitel nach dem Hook.
 */
export const pruefeBelegeV3 = ({visuals, woerter}) => {
  const fehler = [];
  const belege = visuals.filter((v) => v.type === 'beleg');
  const soll = youtubeBelegSoll(sekunden(woerter.length));
  if (belege.length < soll) fehler.push(`Nur ${belege.length} Beleg-Szene(n) mit echtem Quellen-Screenshot; für ${Math.round(sekunden(woerter.length) / 60)} min Sprechzeit sind mindestens ${soll} Pflicht (docs/YOUTUBE-BELEG-SZENEN.md).`);
  const kapitel = [...new Set(visuals.map((v) => v.chapter))];
  const erstesInhaltsKapitel = kapitel[1];
  if (belege.length && erstesInhaltsKapitel) {
    const ersterBeleg = visuals.findIndex((v) => v.type === 'beleg');
    const kapitelEnde = visuals.findLastIndex((v) => v.chapter === erstesInhaltsKapitel);
    if (ersterBeleg > kapitelEnde) fehler.push(`Erster Beleg kommt erst nach Kapitel „${erstesInhaltsKapitel}“ — Glaubwürdigkeit früh zeigen: spätestens dort einen Beleg einplanen.`);
  }
  return fehler;
};

/**
 * V3 — Bildmix (Finanzbär-Analyse, 30.10.2026): Erfolgreiche Finanzvideos bestehen überwiegend aus
 * Folien, Zahlen und Belegen; Illustrationen sind die Würze. Gezeichnete Flow-Bilder tragen höchstens
 * 40 % der Sprechzeit (geschätzt aus dem Skript).
 */
export const pruefeBildmixV3 = ({ergebnis, woerter}) => {
  const starts = ergebnis.map((e) => e.startWort);
  let bildWoerter = 0;
  ergebnis.forEach((e, k) => {
    if (e.startWort === null || e.type !== 'image') return;
    const ende = starts.slice(k + 1).find((s) => s !== null) ?? woerter.length;
    bildWoerter += ende - e.startWort;
  });
  const anteil = woerter.length ? bildWoerter / woerter.length : 0;
  return anteil > YOUTUBE_V3_MAX_BILD_ANTEIL
    ? [`Gezeichnete Bilder tragen ${Math.round(anteil * 100)} % der Sprechzeit (max. ${Math.round(YOUTUBE_V3_MAX_BILD_ANTEIL * 100)} %). Zahlen, Aufzählungen und Regeln als folie, Quellen als beleg zeigen (docs/YOUTUBE-BILDMIX-UND-COVER.md).`]
    : [];
};
