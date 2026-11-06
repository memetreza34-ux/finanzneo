// Erzähl- und Tempo-Vertrag für YouTube-Longform (finanzneo-youtube-story-v1).
//
// Jedes Visual hängt an einem wörtlichen Skript-Satz (startCue), jede Stufe einer
// Animation an einem gesprochenen Wort (beatCues). Daraus folgt dreierlei:
// 1. Die Reihenfolge der Visuals muss der Reihenfolge im Skript entsprechen.
// 2. Kein Bild und keine Animationsstufe steht länger als YOUTUBE_MAX_STATIC_SECONDS.
// 3. Phase 3 rechnet die Cues mit echten Wort-Zeitstempeln in Frames um, ohne den
//    versiegelten Animationscode anzufassen.
import {
  YOUTUBE_CUE_MAX_WORDS,
  YOUTUBE_CUE_MIN_WORDS,
  YOUTUBE_MAX_STATIC_SECONDS,
  YOUTUBE_MOTION_FONTS,
  YOUTUBE_MOTION_PALETTE,
  YOUTUBE_WORDS_PER_SECOND,
} from './youtube-contract.mjs';
import {requiresYouTubeMotion} from './youtube-motion-contract.mjs';

// „3.000 Euro“ und „3000 Euro“ sollen gleich zählen; Satzzeichen zählen nicht.
export const tokenize = (text) => String(text ?? '')
  .toLowerCase()
  .replace(/(\d)[.,](?=\d)/g, '$1')
  .split(/[^a-z0-9äöüß€%]+/)
  .filter(Boolean);

const findTokens = (haystack, needle, from = 0) => {
  if (needle.length === 0) return -1;
  for (let index = from; index <= haystack.length - needle.length; index += 1) {
    if (needle.every((token, offset) => haystack[index + offset] === token)) return index;
  }
  return -1;
};

const seconds = (tokens) => tokens / YOUTUBE_WORDS_PER_SECOND;

const PERSON = /\b(?:woman|man|person|people|girl|boy|couple|she|he|her|his|they)\b/i;

/**
 * Prüft Cues, Reihenfolge, Tempo und Hauptfigur. Gibt eine Liste deutscher Fehlertexte zurück.
 */
export const validateYouTubeStory = ({visuals = [], scriptText = '', recurringCharacter, promptLines = []}) => {
  const errors = [];
  const script = tokenize(scriptText);
  if (script.length === 0) return ['Skript fehlt oder ist leer — ohne Skript lassen sich Cues und Tempo nicht prüfen.'];

  // 1. startCue jedes Visuals finden, streng in Visual-Reihenfolge.
  const starts = [];
  let cursor = 0;
  for (const visual of visuals) {
    const id = visual?.id ?? 'Unbekanntes Visual';
    const cue = tokenize(visual?.startCue);
    if (cue.length < YOUTUBE_CUE_MIN_WORDS || cue.length > YOUTUBE_CUE_MAX_WORDS) {
      errors.push(`${id}: startCue braucht ${YOUTUBE_CUE_MIN_WORDS}–${YOUTUBE_CUE_MAX_WORDS} wörtliche Skriptwörter, an denen das Visual beginnt.`);
      starts.push(null);
      continue;
    }
    const position = findTokens(script, cue, cursor);
    if (position === -1) {
      const anywhere = findTokens(script, cue, 0);
      errors.push(anywhere === -1
        ? `${id}: startCue „${visual.startCue}“ steht nicht wörtlich im Skript.`
        : `${id}: steht im Skript vor dem vorigen Visual — Reihenfolge der Visuals passt nicht zum Skript („${visual.startCue}“).`);
      starts.push(null);
      continue;
    }
    starts.push(position);
    cursor = position + 1;
  }

  // 2. Tempo: jede stehende Strecke (Bild, Karte, Animationsstufe) höchstens N Sekunden.
  visuals.forEach((visual, index) => {
    const start = starts[index];
    if (start === null || start === undefined) return;
    const nextStart = starts.slice(index + 1).find((value) => value !== null && value !== undefined);
    const end = nextStart ?? script.length;
    const id = visual?.id ?? 'Unbekanntes Visual';

    const anchors = [start];
    if (requiresYouTubeMotion(visual)) {
      const beats = Array.isArray(visual.beatCues) ? visual.beatCues : [];
      const expected = Array.isArray(visual.visualBeats) ? visual.visualBeats.length : 0;
      if (beats.length !== expected) {
        errors.push(`${id}: beatCues braucht genau einen gesprochenen Cue pro visualBeat (${expected}), gefunden ${beats.length}.`);
      }
      let beatCursor = start;
      for (const beatCue of beats) {
        const cue = tokenize(beatCue);
        const position = cue.length ? findTokens(script, cue, beatCursor) : -1;
        if (cue.length < 1 || cue.length > YOUTUBE_CUE_MAX_WORDS || position === -1 || position >= end) {
          errors.push(`${id}: beatCue „${beatCue}“ muss wörtlich und in Reihenfolge im Sprechtext dieses Visuals stehen.`);
          continue;
        }
        if (position > anchors[anchors.length - 1]) anchors.push(position);
        beatCursor = position + 1;
      }
    }
    anchors.push(end);
    for (let step = 0; step < anchors.length - 1; step += 1) {
      const hold = seconds(anchors[step + 1] - anchors[step]);
      if (hold > YOUTUBE_MAX_STATIC_SECONDS) {
        const what = requiresYouTubeMotion(visual) ? 'Animationsstufe' : 'Bild';
        errors.push(`${id}: ${what} steht geschätzt ${hold.toFixed(1)} s ohne neue sichtbare Information (max. ${YOUTUBE_MAX_STATIC_SECONDS} s). Abschnitt in zwei Visuals teilen oder einen weiteren Beat einbauen.`);
      }
    }
  });

  // 3. Hauptfigur: dieselbe Person sieht in jedem Bild gleich aus.
  if (typeof recurringCharacter !== 'string' || !recurringCharacter.trim() || /\[[^\]]*\]/.test(recurringCharacter)) {
    errors.push('recurringCharacter fehlt: exakte englische Beschreibung der wiederkehrenden Hauptfigur — oder „none — <Grund>“.');
  } else if (!/^none\b/i.test(recurringCharacter.trim())) {
    for (const line of promptLines) {
      if (PERSON.test(line) && !line.includes(recurringCharacter.trim())) {
        errors.push(`Bildprompt mit Person nutzt nicht die exakte Hauptfigur „${recurringCharacter.trim()}“: "${line.slice(0, 90)}"`);
      }
    }
  }
  return errors;
};

/**
 * Phase 3: rechnet Cues mit echten Wort-Zeitstempeln in Frames relativ zum Visual-Start um.
 * words: [{word, start, end}] in Sekunden. Gibt null für einen nicht gefundenen Cue zurück.
 */
export const resolveCueFrames = ({words = [], startCue, beatCues = [], fps = 30, from = 0}) => {
  // Ein Wort-Zeitstempel kann mehrere Tokens tragen („E-Mail“); jedes Token merkt sich sein Wort.
  const spoken = words.flatMap((entry, wordIndex) => tokenize(entry.word).map((token) => ({token, wordIndex})));
  const tokens = spoken.map((entry) => entry.token);
  const startAt = spoken.findIndex((entry) => entry.wordIndex >= from);
  const startToken = findTokens(tokens, tokenize(startCue), Math.max(0, startAt));
  if (startToken === -1) return {startIndex: -1, startSeconds: null, beats: beatCues.map(() => null)};
  const startIndex = spoken[startToken].wordIndex;
  const startSeconds = words[startIndex].start;
  let cursor = startToken;
  const beats = beatCues.map((cue) => {
    const position = findTokens(tokens, tokenize(cue), cursor);
    if (position === -1) return null;
    cursor = position + 1;
    return Math.max(0, Math.round((words[spoken[position].wordIndex].start - startSeconds) * fps));
  });
  return {startIndex, startSeconds, beats};
};

const toHex = (r, g, b) => `#${[r, g, b].map((value) => Number(value).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

/**
 * Einheitlicher Motion-Stil: nur Palette des Karten-Baukastens, nur Inter/Bebas Neue,
 * Stufen-Timing von außen über die Prop `beats`.
 */
export const validateYouTubeMotionSourceStyle = (source, visual = {}) => {
  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];
  const palette = new Set(YOUTUBE_MOTION_PALETTE.map((color) => color.toUpperCase()));
  for (const match of source.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    if (!palette.has(match[0].toUpperCase())) errors.push(`${id}: Farbe ${match[0]} gehört nicht zur YouTube-Motion-Palette (${YOUTUBE_MOTION_PALETTE.join(', ')}).`);
  }
  for (const match of source.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
    const hex = toHex(match[1], match[2], match[3]);
    if (!palette.has(hex)) errors.push(`${id}: Farbe ${match[0]}…) gehört nicht zur YouTube-Motion-Palette.`);
  }
  for (const match of source.matchAll(/fontFamily\s*[:=]\s*\{?\s*['"]([^'"]+)['"]/g)) {
    const family = match[1].split(',')[0].trim();
    if (!YOUTUBE_MOTION_FONTS.includes(family)) errors.push(`${id}: Schrift „${family}“ ist nicht erlaubt — nur ${YOUTUBE_MOTION_FONTS.join(' oder ')}.`);
  }
  if (!/\bbeats\b/.test(source) || !/beats\s*\?\.\s*\[|beats\s*\[/.test(source)) {
    errors.push(`${id}: Animation muss ihre Stufen über die Prop \`beats\` (Frames ab Visual-Start) steuern — fest eingetragene Zeitpunkte lassen sich nicht an die Stimme anpassen.`);
  }
  return errors;
};
