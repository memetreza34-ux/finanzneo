#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const DEFAULT_TYPES = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const args = process.argv.slice(2);
const readArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? null : args[index + 1] ?? null;
};

const targetArg = readArg('target');
const title = readArg('title') ?? 'Neues FinanzNeo-Reel';
const typeArg = readArg('types');
const types = typeArg ? typeArg.split(',').map((value) => value.trim()) : DEFAULT_TYPES;

if (!targetArg) {
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,image,animation]');
  process.exit(1);
}
if (types.length < 5 || types.length > 12 || types.some((type) => !['image', 'animation'].includes(type))) {
  console.error('Die Szenentypen müssen aus 5 bis 12 Einträgen bestehen und dürfen nur image oder animation enthalten.');
  process.exit(1);
}

const root = resolve(targetArg);
const relativeToReels = relative(resolve('reels'), root);
if (relativeToReels.startsWith('..') || relativeToReels === '' || relativeToReels.split(sep).includes('..')) {
  console.error('Das Ziel muss ein neuer Projektordner unter reels/ sein.');
  process.exit(1);
}
if (existsSync(root)) {
  console.error(`Ziel existiert bereits: ${root}`);
  process.exit(1);
}

const write = (path, content) => {
  const absolute = resolve(root, path);
  mkdirSync(resolve(absolute, '..'), {recursive: true});
  writeFileSync(absolute, content, 'utf8');
};

const WORLD_ID = 'finanzneo-connected-studio-v3';
const sceneNumber = (index) => String(index + 1).padStart(2, '0');
const sceneFileName = (index) => `Bild ${sceneNumber(index)} - [KURZER SZENENNAME].png`;

const WORLD_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nSERIES CONTINUITY LOCK:\nUse 03-szenen/bildwelt-referenz.png only as a style and environment reference. Match camera, approximately 35mm-equivalent perspective, camera height, curved charcoal studio architecture, matte floor, emerald architectural light channels, lighting, materials, depth and subject scale. Do not redesign the world.\n\nENVIRONMENT:\nOne connected premium finance-explainer studio with visible matte floor, curved charcoal back wall, emerald architectural light channels, supporting foreground, explanatory midground and quiet architectural background. No empty black background.\n\nCOMPOSITION LOCK:\nVertical 9:16. Keep the complete main action inside the central safe area. Upper and lower areas remain calm but continue the same studio environment.\n\nTEXT:\nNo headline, subtitle, sentence, number, label, logo, watermark or interface text inside the image.\n\nCONSISTENCY NEGATIVES:\nNo empty black background, no isolated floating product, no floating platform, no different camera, no different palette, no dashboard, no app UI, no advertisement, no photorealism, no cartoon, no Pixar, no clay style.\n`;

const worldReferencePrompt = `FINANZNEO WORLD REFERENCE PROMPT\n\nFINANZNEO_WORLD_ID: ${WORLD_ID}\n\nCreate the fixed visual reference for this reel: vertical 9:16, slightly isometric three-quarter camera, approximately 35mm-equivalent perspective, curved dark-charcoal back wall flowing into a matte floor, restrained emerald architectural light channels, soft key light from upper left, emerald rim light from right, premium matte materials, restrained clear glass and warm gold only for money/value. Keep visible foreground, midground and background depth. No empty black background. No text, labels, numbers, logos or watermark. Not photorealistic, not cartoon, not Pixar, not clay.\n`;

const googleFlowInstruction = (fileName) => `GOOGLE FLOW – FINALER DATEINAME:\n${fileName}\n\nWICHTIG FÜR GOOGLE FLOW:\nErzeuge anhand dieses Prompts GENAU EIN Bild. Sobald es fertig ist, benenne es SOFORT exakt wie oben, prüfe Bild und Dateiname und erzeuge ERST DANACH das nächste Bild. Der Dateiname darf niemals sichtbar im Bild erscheinen.\n`;

const imagePrompt = (id, index) => `${googleFlowInstruction(sceneFileName(index))}\n${WORLD_BLOCK}\nSCENE MESSAGE:\n[VOLLSTÄNDIGEN SPRECHSATZ FÜR ${id} EINFÜGEN]\n\nCONNECTED VISUAL STORY:\n[Ausgangspunkt] → [sichtbare Handlung] → [verständliches Ergebnis]\n\nREADABILITY:\nThe concept must be understandable within one second on a smartphone.\n`;

const coverPrompt = `${googleFlowInstruction('Bild 00 - [KURZER COVER-NAME].png')}\n${WORLD_BLOCK}\nSCENE MESSAGE:\n[VOLLSTÄNDIGE COVER-AUSSAGE EINFÜGEN]\n\nCONNECTED VISUAL STORY:\n[VOLLSTÄNDIGEN COVER-AUFBAU EINFÜGEN]\n`;

const imageSceneIds = types.flatMap((type, index) => type === 'image' ? [`scene-${sceneNumber(index)}`] : []);
const animationSceneIds = types.flatMap((type, index) => type === 'animation' ? [`scene-${sceneNumber(index)}`] : []);

write('README.md', `# ${title}\n\nEINFACHE FINANZNEO-STRUKTUR:\n\n01-script/ = nur der Fließtext fürs Voiceover\n02-audio/ = hier legt der Nutzer die fertige Audiodatei ab\n03-szenen/ = Cover, alle Bildprompts, Szenen und alle fertigen Bilder\n04-caption/ = Social Caption und Wort-Timings\n05-projektdateien/ = Animationen, Recherche, Szenenplan und technische Dateien\n\nDer Nutzer erstellt alle tatsächlichen Bilder selbst. Antigravity generiert keine Bilder.\n`);

write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT FÜR DAS VOICEOVER EINFÜGEN]\n');

write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen (.wav, .mp3, .m4a oder .aac).\n\nErst danach echte Wort-Zeitstempel erzeugen.\n');

write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', `# ALLE FERTIGEN BILDER HIER REIN\n\nDer Nutzer erstellt die Bilder selbst mit Google Flow.\n\nAblauf in Google Flow:\n1. genau ein Bild erzeugen\n2. sofort mit dem direkt am Prompt angegebenen Namen umbenennen\n3. prüfen\n4. erst dann das nächste Bild\n\nErst wenn ALLE benötigten Bilder fertig und korrekt benannt sind, alle gemeinsam hier hineinlegen.\n\nBildnummer = echte Szenennummer. Animationsszenen erhalten kein Bild und ihre Nummer bleibt reserviert.\n`);

write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldReferencePrompt);
write('03-szenen/README.md', '# SZENEN\n\nHier liegen Cover, alle Bildprompts, die einzelnen Szenen und der gemeinsame Ordner für alle fertigen Nutzerbilder.\n');

write('04-caption/caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version: 1, fps: 30, subtitleMode: 'sentence-with-audio-synced-active-word', activeWordColor: 'finance-green', sentences: []}, null, 2)}\n`);

write('05-projektdateien/animationen.md', '# ANIMATIONEN\n\n[REMOTION-ANIMATIONEN UND ABLAUF EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/technische-hinweise.md', '# TECHNISCHE HINWEISE\n\n- 1080 × 1920\n- 30 fps\n- Bilddarstellung: contain\n- aktuelles gesprochenes Wort grün\n- maximal zwei Caption-Zeilen\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
write('05-projektdateien/timeline.json', `${JSON.stringify({version: 1, title, fps: 30, timingSource: '04-caption/word-timings.json', cutRule: 'voice-sentence-start', scenes: types.map((type, index) => ({id: `scene-${sceneNumber(index)}`, type, startFrame: 0, durationFrames: 0, cutReason: 'voice-sentence-start'}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const number = sceneNumber(index);
  const id = `scene-${number}`;
  const directory = `03-szenen/EINZELNE-SZENEN/${id}`;

  write(`${directory}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Überschrift:** [EINFÜGEN]\n\n**Schwerpunktzeile:** [EINFÜGEN]\n\n**Passendes Icon:** [EINFÜGEN]\n\n**Sprechtext:** [EINFÜGEN]\n\n${type === 'image' ? `**Google-Flow-Dateiname:** ${sceneFileName(index)}\n` : `**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n`}`);

  const common = {
    id,
    type,
    startFrame: 0,
    durationFrames: 0,
    cutReason: 'voice-sentence-start',
    directory: `EINZELNE-SZENEN/${id}`,
    headline: '[EINFÜGEN]',
    accent: '[EINFÜGEN]',
    icon: '[EINFÜGEN]',
  };

  if (type === 'image') {
    write(`${directory}/bildprompt.txt`, imagePrompt(id, index));
    return {
      ...common,
      planFile: `EINZELNE-SZENEN/${id}/bildprompt.txt`,
      googleFlowFileName: sceneFileName(index),
      expectedVisual: '[EINFÜGEN]',
      promptVersion: 'finanzneo-image-world-v3',
      imagePresentation: {scale: 1.01, sourceCropTop: 0, sourceCropBottom: 0, cropSafe: true},
    };
  }

  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- sichtbare Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- relative Ablaufphasen: [EINFÜGEN]\n`);
  return {...common, planFile: `EINZELNE-SZENEN/${id}/remotion.md`};
});

const allPromptSections = types.map((type, index) => {
  const number = sceneNumber(index);
  if (type === 'animation') {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN.\nNummer ${number} bleibt reserviert.\n`;
  }
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`, index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\nGOOGLE FLOW KI-AGENT – VERBINDLICHER ABLAUF:\nImmer genau EIN Bild erzeugen → SOFORT umbenennen → prüfen → erst dann nächstes Bild.\nDie Nummer entspricht immer der echten Szenennummer. Eine Animationsszene erzeugt kein Bild, ihre Nummer bleibt aber reserviert.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allPromptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErst wenn ALLE benötigten Bilder vollständig erzeugt, korrekt benannt und geprüft sind, alle gemeinsam in:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n\nNicht auf einzelne Szenenordner verteilen.\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version: 7,
  title,
  sceneCount: scenes.length,
  imageSceneCount: imageSceneIds.length,
  animationSceneCount: animationSceneIds.length,
  sourceContract: 'exactly-one-of-bildprompt-or-remotion',
  userCreatesImages: true,
  antigravityGeneratesImages: false,
  googleFlow: {
    generationMode: 'one-image-at-a-time',
    fileNameRule: 'Bild XX - Kurzer Szenenname.png',
    numberSource: 'real-scene-number',
    animationNumbersStayReserved: true,
    finalCollectionDirectory: '03-szenen/00-ALLE-BILDER-HIER-REIN/',
    distributeToSceneFolders: false,
  },
  imageWorld: {
    id: WORLD_ID,
    referencePromptFile: '03-szenen/bildwelt.txt',
    referenceImageFile: '03-szenen/bildwelt-referenz.png',
    referenceImageRequired: true,
    legacyAssetSet: false,
    promptMarker: `FINANZNEO_WORLD_ID: ${WORLD_ID}`,
    cameraLock: 'slightly-isometric-three-quarter-35mm-equivalent',
    environmentLock: 'connected-charcoal-emerald-finance-studio',
    noEmptyBackground: true,
    backgroundFill: 'finanzneo-world-stage-v3',
  },
  timelineRules: {
    timingSource: '04-caption/word-timings.json',
    cutsFollowSentenceStarts: true,
    equalLengthScenesForbiddenByDefault: true,
  },
  audio: {targetIntegratedLufs: -16, targetTruePeakDbtp: -1, finalMeasurementRequired: true},
  headlineIconRule: 'matching-icon-centered-next-to-accent-same-visual-size',
  subtitleDisplay: {mode: 'sentence-with-audio-synced-active-word', maxLines: 2, balancedLines: true, holdDuringPauses: true, noDeadGaps: true, activeWordColor: 'finance-green'},
  layout: {headlineTop: 78, visualTop: 270, visualBottom: 1350, subtitleBottom: 320, subtitleLeft: 62, subtitleRight: 150},
  imagePresentationContract: {imageFit: 'contain', maxIntentionalImageScale: 1.04, maxSourceCropPerSide: 0.2, maxSourceCropTotal: 0.34, blurredImageBackgroundForbidden: true},
  forbiddenFiles: ['motionprompt.txt', 'alle-motionprompts.txt', 'placeholder.svg'],
  scenes,
}, null, 2)}\n`);

console.log(`✓ Einfaches Reel-Gerüst erstellt: ${root}`);
console.log('  01-script · 02-audio · 03-szenen · 04-caption · 05-projektdateien');
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log('  Bilder erstellt ausschließlich der Nutzer; Antigravity generiert keine Bilder.');
