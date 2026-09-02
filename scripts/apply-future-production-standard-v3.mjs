#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-production-standard-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-future-production-v3';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
const index = JSON.parse(read(indexPath));

// V3 ist absichtlich ein zusätzlicher Future-Layer. Bestehende Reels ohne
// diesen Marker werden von allen V3-Validatoren und Render-Schritten ignoriert.
index.futureProductionStandard = {
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  legacyReelsUntouched: true,
  timing: {
    staticImageIdealSeconds: [1.8, 3.0],
    staticImageSoftMaxSeconds: 3.6,
    staticImageHardMaxSeconds: 4.0,
    longStaticSentenceNeedsAdditionalVisualBeat: true,
    sentenceMayUseMultipleImages: true,
    newConcreteIdeaNeedsVisualChange: true,
    extraImagePreferredOverLongHold: true,
    realWordTimingsRemainFinalAuthority: true,
  },
  animationFraming: {
    mainMechanismMustFeelFrameFilling: true,
    excessiveEmptySpaceForbidden: true,
    widerContextAllowedOnlyWhenStoryNeedsIt: true,
    wideContextMustProgressToCloserMechanismState: true,
    sampleRatios: [0.2, 0.5, 0.8],
    minPeakActivePixelRatio: 0.15,
    minMedianActivePixelRatio: 0.12,
  },
  audioMastering: {
    normalizeBeforeRenderQa: true,
    targetIntegratedLufs: -16,
    integratedLufsTolerance: 1.0,
    targetTruePeakDbtp: -1,
    maxTruePeakDbtp: -0.8,
    targetLra: 11,
    audioBitrate: '320k',
    sampleRate: 48000,
  },
};

// Bestehenden V2-Beat-Vertrag für neue Reels nur verschärfen, nicht ersetzen.
// Dadurch bleiben alle V1/V2-Reels rückwärtskompatibel.
if (index.visualBeatContract?.id === 'finanzneo-visual-beats-v2') {
  index.visualBeatContract.staticImageBeatIdealSeconds = [1.8, 3.0];
  index.visualBeatContract.staticImageBeatHardMaxSeconds = 4.0;
  index.visualBeatContract.longStaticSentenceNeedsAdditionalVisualBeat = true;
  index.visualBeatContract.extraImagePreferredOverLongHold = true;
}
index.timingStandard = {
  ...(index.timingStandard ?? {}),
  imageSceneIdealSeconds: [1.8, 3.0],
  imageSceneAbsoluteMaxSeconds: 4.0,
  imageSceneSoftMaxSeconds: 3.6,
  longStaticSentenceNeedsAdditionalVisualBeat: true,
  extraImagePreferredOverLongHold: true,
};
index.audio = {
  ...(index.audio ?? {}),
  targetIntegratedLufs: -16,
  targetTruePeakDbtp: -1,
};

write(indexPath, JSON.stringify(index, null, 2));

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
const standardPath = resolve(projectDir, 'future-production-v3.md');
write(standardPath, `# Future Production V3\n\nFUTURE_PRODUCTION_STANDARD: ${CONTRACT_ID}\n\nDieser Vertrag gilt ausschließlich für neu mit dem aktuellen reel:create erzeugte Reels. Bestehende Reels werden nicht rückwirkend verändert.\n\n## Timing\n- statischer Bildbeat ideal 1,8–3,0 s\n- ab ca. 3,6 s aktiv prüfen, ob ein zweites Bild/Visual Beat die Erklärung verbessert\n- ohne neue sichtbare Information hart maximal 4,0 s\n- ein längerer Satz darf mehrere Bilder/Visual Beats bekommen\n- neuer konkreter Gedanke = neue sichtbare Information\n- echte Wort-Zeitstempel bleiben die finale Timing-Quelle\n\n## Animation Framing\n- die physische Hauptmechanik muss die Visualzone sichtbar ausfüllen\n- große leere schwarze Fläche ist kein Premium-Look, wenn die Hauptobjekte dadurch klein wirken\n- weiter Kontext ist erlaubt, wenn die Story ihn braucht; danach muss die Mechanik sichtbar näher/größer werden\n- Post-Render-QA prüft reale aktive Bildbelegung an mehreren Zeitpunkten\n- Ziel: Peak active-pixel ratio >= 0,15 und Median >= 0,12 im visuellen Kern\n\n## Audio Mastering\n- finaler Candidate wird vor der Render-QA automatisch normalisiert\n- Ziel: -16 LUFS integrated\n- Ziel True Peak: -1 dBTP; harter Maximalwert -0,8 dBTP\n- AAC 320k, 48 kHz\n- Render-QA misst das gemasterte Ergebnis; bloß vorhandener Audio-Stream reicht bei V3 nicht\n`);

const appendBlock = (relativePath, heading, body) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(`FUTURE_PRODUCTION_STANDARD: ${CONTRACT_ID}`)) return;
  write(path, `${current.trim()}\n\n## ${heading}\n\nFUTURE_PRODUCTION_STANDARD: ${CONTRACT_ID}\n\n${body}\n`);
};

appendBlock(
  '05-projektdateien/szenenplan.md',
  'Future V3 Timing',
  'Statische Visuals nicht künstlich bis zum Satzende stehen lassen. Ab ca. 3,6 s aktiv einen weiteren Visual Beat prüfen; ohne neue sichtbare Information maximal 4,0 s. Ein Satz darf mehrere Bilder bekommen.',
);
appendBlock(
  '05-projektdateien/animationen.md',
  'Future V3 Framing',
  'Die Hauptmechanik muss groß und klar lesbar sein. Weiter Kontext ist nur erlaubt, wenn die Story ihn braucht und anschließend ein näherer/größerer Mechanikzustand folgt. Post-Render-QA misst reale Visualbelegung.',
);
appendBlock(
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  'Future V3 Finalisierung',
  'Vor Post-Render-QA wird der finale Candidate automatisch auf -16 LUFS / -1 dBTP gemastert. Nicht manuell umgehen. Bei langen statischen Holds lieber zusätzliche Visual Beats nutzen. Animations-Hauptmechanik groß und bildfüllend halten; excessive empty space gilt als Qualitätsfehler.',
);

console.log(`✓ Future Production Standard gesetzt: ${CONTRACT_ID}`);
console.log('  Still-Timing: ideal 1,8–3,0 s · ab 3,6 s Split prüfen · hard max 4,0 s ohne neue sichtbare Information.');
console.log('  Animation: größere Hauptmechanik · Post-Render-Occupancy-QA statt nur Source-Regel.');
console.log('  Audio: automatisches Mastering vor QA auf -16 LUFS / -1 dBTP.');
console.log('  Bestehende Reels ohne V3-Marker bleiben vollständig rückwärtskompatibel.');
