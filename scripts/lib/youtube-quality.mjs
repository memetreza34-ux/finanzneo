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
  YOUTUBE_QUALITY_RULES_V2_ID,
  YOUTUBE_HOOK_ANNOUNCEMENT_PATTERN,
  YOUTUBE_CHARACTER_REFERENCE_MARKER,
} from './youtube-contract.mjs';

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
    for (const akzent of v.akzente ?? []) {
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

  for (const e of ergebnis) {
    if (e.type !== 'image' || e.startWort === null) continue;
    const echt = echteHaltezeiten?.get(e.id);
    if (echt != null) {
      if (echt > YOUTUBE_IMAGE_WARN_HOLD_SECONDS) fehler.push(`${e.id}: Standbild steht im fertigen Zeitplan ${echt.toFixed(1)} s ohne neue Information (max. ${YOUTUBE_IMAGE_WARN_HOLD_SECONDS} s nach echtem Audio).`);
      continue;
    }
    if (e.laengsteHaltung > YOUTUBE_IMAGE_MAX_HOLD_SECONDS) {
      fehler.push(`${e.id}: Standbild steht geschätzt ${e.laengsteHaltung.toFixed(1)} s ohne neue Information (max. ${YOUTUBE_IMAGE_MAX_HOLD_SECONDS} s). Zusätzliches Bild einplanen oder akzente[] mit cue setzen.`);
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

  if (index.qualityRules === YOUTUBE_QUALITY_RULES_V2_ID) fehler.push(...pruefeBindungV2({index, scriptText, ergebnis, woerter, ersterInhalt, bildprompt}));

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
    if (v.type === 'image' || v.type === 'hybrid') {
      if (typeof v.keyword !== 'string' || !v.keyword.trim()) fehler.push(`${v.id}: keyword fehlt (welches gesprochene Wort zeigt dieses Bild?).`);
      else if (!kommtVor(v.keyword, abschnitt)) fehler.push(`${v.id}: keyword „${v.keyword}“ fällt nicht in seinem Sprechabschnitt — Bild und Satz passen nicht zusammen.`);
    } else {
      const nachbarn = [visuals[k - 1], visuals[k + 1]].filter((n) => n && (n.type === 'image' || n.type === 'hybrid'));
      const text = (n) => [n.expectedVisual, ...(n.objectLabels ?? [])].join(' ');
      if (typeof v.bridgeObject !== 'string' || !v.bridgeObject.trim()) fehler.push(`${v.id}: bridgeObject fehlt (welches Objekt aus dem Nachbarbild trägt die Animation weiter?).`);
      else if (!nachbarn.some((n) => kommtVor(v.bridgeObject, skriptWoerter(text(n))))) fehler.push(`${v.id}: bridgeObject „${v.bridgeObject}“ kommt im Bild davor/danach nicht vor.`);
    }
  });
  return fehler;
};
