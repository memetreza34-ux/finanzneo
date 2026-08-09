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
const WORLD_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nUSE STYLE REFERENCE:\nUse 03-szenen/bildwelt-referenz.png only as a style and environment reference. Match its camera angle, 35mm-equivalent perspective, camera height, curved charcoal studio architecture, matte floor, emerald architectural light channels, lighting, materials, depth and subject scale. Do not redesign the world.\n\nSERIES CONTINUITY LOCK:\nThe image must look like another frame from exactly the same FinanzNeo studio as every other image in this reel.\n\nENVIRONMENT:\nCreate one connected premium finance-explainer environment with a visible matte floor, a curved charcoal back wall, integrated emerald light channels and subtle architectural depth. The scene must not look like an isolated object in an empty black void. Use three depth layers: supporting foreground, explanatory midground action and quiet architectural background.\n\nCOMPOSITION LOCK:\nVertical 9:16 source image. The complete main action sits inside the central 64 percent of the image height and fills approximately 68 to 78 percent of the usable width. Keep the upper 18 percent and lower 18 percent crop-safe and low-detail, but continue the same studio wall, floor and lighting there instead of leaving blank black space.\n\nTEXT:\nNo headline, subtitle, sentence, number, label, logo, watermark or interface text inside the image. Remotion renders all typography and validated values.\n\nCONSISTENCY NEGATIVES:\nNo empty black background, no isolated floating product, no floating platform, no different camera angle, no different color palette, no blue or purple neon world, no photorealism, no cartoon, no Pixar, no clay style, no dashboard, no app UI, no advertising layout, no random particles and no decorative filler.\n`;

const worldReferencePrompt = `FINANZNEO WORLD REFERENCE PROMPT\n\nFINANZNEO_WORLD_ID: ${WORLD_ID}\n\nPURPOSE:\nCreate the style-and-environment reference image for every generated picture in this reel. Later scene images use it only as a style, camera, lighting, material, scale and environment reference.\n\nCAMERA LOCK:\nVertical 9:16, slightly isometric three-quarter camera, approximately 35mm-equivalent perspective, stable camera height and gentle downward view.\n\nENVIRONMENT LOCK:\nOne connected premium finance studio with a curved dark-charcoal back wall flowing into a matte floor, restrained emerald architectural light channels, a broad recessed central alcove, subtle floor seams and a soft green pool of light. Show visible depth and three layers. Do not create an empty black void.\n\nLIGHTING LOCK:\nSoft key light from upper left, emerald rim light from right, restrained warm gold reflections only for money, soft contact shadows and controlled highlights.\n\nMATERIAL LOCK:\nPremium matte charcoal metal, dark stone-like floor, deep-green coated surfaces, restrained clear glass and soft gold details. Not photorealistic, not cartoonish, not Pixar and not clay.\n\nCOMPOSITION LOCK:\nKeep the central action zone available. Upper and lower 18 percent remain low-detail and crop-safe while the same wall, floor and lighting continue through them.\n\nTEXT:\nNo text, labels, numbers, logos or watermark.\n`;

const imagePrompt = (id) => `${WORLD_BLOCK}\nSCENE MESSAGE:\n[VOLLSTÄNDIGEN SPRECHSATZ FÜR ${id} EINFÜGEN]\n\nCONNECTED VISUAL STORY:\n[Ausgangspunkt] → [sichtbare Handlung] → [verständliches Ergebnis]\n\nPRIMARY OBJECTS:\n1. [EINFÜGEN]\n2. [EINFÜGEN]\n3. [EINFÜGEN]\n\nREADABILITY:\nThe concept must be understandable within one second on a smartphone. The scene must not show the solution before the voiceover reaches the solution.\n`;

const imageSceneIds = types.flatMap((type, index) => type === 'image' ? [`scene-${String(index + 1).padStart(2, '0')}`] : []);
const animationSceneIds = types.flatMap((type, index) => type === 'animation' ? [`scene-${String(index + 1).padStart(2, '0')}`] : []);

const chronologicalImageNaming = types.map((type, index) => {
  const number = String(index + 1).padStart(2, '0');
  return type === 'image'
    ? `- Szene ${number} = Bildszene → \`Bild ${number}\``
    : `- Szene ${number} = Remotion-Animation → KEIN \`Bild ${number}\``;
}).join('\n');

const imageNamingBlock = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVERBINDLICHE DATEINAMEN NACH DER BILDGENERIERUNG\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nNach der Generierung müssen die fertigen Bilder nach ihrer ECHTEN chronologischen Position im Reel benannt werden. Die Nummer ist immer identisch mit der Szenennummer und NICHT mit der laufenden Anzahl der erzeugten Bilder.\n\n- Cover = \`Bild 00\`\n- Szene 01 = \`Bild 01\`\n- Szene 02 = \`Bild 02\`\n- Szene 03 = \`Bild 03\`\n- usw. bis zur letzten Szene.\n\nWICHTIG BEI REMOTION-ANIMATIONEN:\nEine Animationsszene behält ihre Szenennummer, bekommt aber KEINE Bilddatei. Die Nummer darf nicht an die nächste Bildszene weitergegeben oder neu durchgezählt werden.\n\nBeispiel:\n- Szene 01 = Bildszene → \`Bild 01.png\`\n- Szene 02 = Remotion-Animation → KEIN \`Bild 02\`\n- Szene 03 = Bildszene → \`Bild 03.png\`\n\nNIEMALS Szene 03 in diesem Beispiel als \`Bild 02\` benennen.\n\nVERBINDLICHE NUMMERIERUNG FÜR DIESES REEL:\n${chronologicalImageNaming}\n\nDie Dateiendung bleibt erhalten. Nach dem Umbenennen alle finalen Bilder gemeinsam in \`03-szenen/BILDER-EINGANG/\` legen.\n\nDie KI darf die Nummer niemals anhand der Anzahl bereits generierter Bilder erraten. Maßgeblich ist ausschließlich die echte Szenennummer in \`03-szenen/scene-index.json\`.\n\nDanach zuerst prüfen und anschließend einsortieren:\n\`npm run reel:sort-images -- <REEL-ORDNER> --dry-run\`\n\`npm run reel:sort-images -- <REEL-ORDNER>\`\n`;

write('README.md', `# ${title}\n\n- Bildszene: bildprompt.txt + szene.md + später genau ein finales Bild\n- Remotion-Szene: remotion.md + szene.md\n- Image World: ${WORLD_ID}\n- zuerst bildwelt-referenz.png erzeugen, dann alle Szenenbilder mit derselben Referenz\n- keine leeren Hintergründe, keine Bildtexte, keine zufälligen Stilwechsel\n- Szenenschnitte folgen Satzanfängen statt einem starren Zeitraster\n- ein vollständiger Satz sichtbar, aktuelles Wort grün\n- finale Bildnummer = echte Szenennummer; Animationsnummern werden nicht neu vergeben\n`);
write('00-cover/cover.txt', `${WORLD_BLOCK}\nSCENE MESSAGE:\n[VOLLSTÄNDIGE COVER-AUSSAGE EINFÜGEN]\n\nCONNECTED VISUAL STORY:\n[VOLLSTÄNDIGEN COVER-AUFBAU EINFÜGEN]\n`);
write('00-cover/README.md', '# Cover\n\nCover verwendet dieselbe Bildwelt-Referenz wie alle Szenenbilder. Das finale Cover heißt `Bild 00` und wird zusammen mit allen Szenenbildern in `03-szenen/BILDER-EINGANG/` abgelegt.\n');
write('01-voice-script/script.txt', '[VOLLSTÄNDIGES SPRECHSKRIPT EINFÜGEN]\n');
write('01-voice-script/voiceover-prompt.txt', '[VOICEOVER-REGIE EINFÜGEN]\n');
write('02-audio/README.md', '# Audio\n\nFinales Voiceover hier ablegen. Ziel: ungefähr -16 LUFS Integrated und höchstens -1 dBTP. Wortzeiten und Szenenschnitte müssen aus genau dieser finalen Datei erzeugt werden.\n');
write('03-szenen/bildwelt.txt', worldReferencePrompt);
write('03-szenen/README.md', '# Szenen\n\n1. bildwelt.txt verwenden und bildwelt-referenz.png erzeugen.\n2. Jedes Bild mit derselben Referenz generieren.\n3. Bildszene: bildprompt.txt + szene.md + genau ein finales Bild.\n4. Remotion-Szene: remotion.md + szene.md.\n5. Keine Motionprompts oder Platzhalter.\n6. Alle finalen Bilder zunächst gemeinsam in BILDER-EINGANG ablegen. Die Bildnummer entspricht immer der echten Szenennummer. Eine Animationsszene behält ihre Nummer, erzeugt aber kein Bild.\n');
write('03-szenen/BILDER-EINGANG/README.md', `# Bilder-Eingang\n\nAlle finalen Bilder gemeinsam hier ablegen.\n\n${imageNamingBlock}\n`);
write('04-caption/README.md', '# Untertitel\n\nEin vollständiger Satz sichtbar. Aktuelles Wort grün. Vorheriger Satz bleibt während kurzer Pausen stehen. Höchstens zwei Zeilen. Szenenstarts folgen den Satzanfängen.\n');
write('04-caption/word-timings.json', `${JSON.stringify({version: 1, fps: 30, subtitleMode: 'sentence-with-audio-synced-active-word', activeWordColor: 'finance-green', sentences: []}, null, 2)}\n`);
write('04-caption/social-caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('05-review/checkliste.md', '# Checkliste\n\n- [ ] Bildwelt-Referenz zuerst erzeugt\n- [ ] alle Bilder mit derselben Referenz generiert\n- [ ] Bildnummer entspricht echter Szenennummer; Animationsszenen wurden nicht neu durchgezählt\n- [ ] Kamera, Architektur, Licht, Materialien und Motivgröße im Kontaktbogen einheitlich\n- [ ] kein leerer schwarzer Hintergrund\n- [ ] keine Bildtexte oder Zahlen\n- [ ] jedes Bild erklärt exakt seinen Satz\n- [ ] Vordergrundbilder contain; Scale maximal 1.04\n- [ ] Crop pro Seite maximal 0.20, insgesamt maximal 0.34\n- [ ] keine unscharfe Bildkopie als sichtbarer Hintergrund\n- [ ] Szenenschnitte folgen Satzanfängen\n- [ ] Audio ungefähr -16 LUFS / höchstens -1 dBTP geprüft\n- [ ] finalen Render vollständig angesehen\n');
write('05-review/quellen.md', '# Quellen\n\n[QUELLEN EINFÜGEN]\n');
write('06-video/README.md', '# Finales Video\n\nFinalen freigegebenen Export hier ablegen.\n');
write('render/README.md', '# Test-Render\n');
write('timeline/README.md', '# Timeline\n\nSzenenstarts nach finalem Voiceover aus den Satzanfängen ableiten. Keine automatisch gleich langen Szenen.\n');
write('timeline/timeline.json', `${JSON.stringify({version: 1, title, fps: 30, timingSource: '04-caption/word-timings.json', cutRule: 'voice-sentence-start', scenes: types.map((type, index) => ({id: `scene-${String(index + 1).padStart(2, '0')}`, type, startFrame: 0, durationFrames: 0, cutReason: 'voice-sentence-start'}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const id = `scene-${String(index + 1).padStart(2, '0')}`;
  const directory = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${directory}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Überschrift:** [EINFÜGEN]\n\n**Schwerpunktzeile:** [EINFÜGEN]\n\n**Passendes Icon:** [EINFÜGEN]\n\n**Sprechtext:** [EINFÜGEN]\n\n**Satzstart im finalen Audio:** [FRAME EINFÜGEN]\n\n${type === 'image' ? `**Expected Visual:** [EINFÜGEN]\n\n**Image World:** ${WORLD_ID}\n\n**Bilddarstellung:** scale=1.01, sourceCropTop=0.17, sourceCropBottom=0.17, cropSafe=true\n\n**Finaler Dateiname im Bilder-Eingang:** Bild ${String(index + 1).padStart(2, '0')}\n` : `**Remotion-Komponente:** [EINFÜGEN]\n\n**Kein finales Bild:** Die Szenennummer ${String(index + 1).padStart(2, '0')} bleibt reserviert und wird nicht an eine andere Bildszene vergeben.\n`}`);

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
    write(`${directory}/bildprompt.txt`, imagePrompt(id));
    return {
      ...common,
      planFile: `EINZELNE-SZENEN/${id}/bildprompt.txt`,
      expectedVisual: '[EINFÜGEN]',
      promptVersion: 'finanzneo-image-world-v3',
      imagePresentation: {scale: 1.01, sourceCropTop: 0.17, sourceCropBottom: 0.17, cropSafe: true},
    };
  }

  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- sichtbare Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- relative Ablaufphasen: [EINFÜGEN]\n`);
  return {...common, planFile: `EINZELNE-SZENEN/${id}/remotion.md`};
});

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS\n\nWELTBLOCK\n=========\n${WORLD_BLOCK}\n\nCOVER\n=====\n[VOLLSTÄNDIGEN COVER-INHALT EINFÜGEN]\n\n${imageSceneIds.map((id) => `${id.toUpperCase()}\n${'='.repeat(id.length)}\nSCENE MESSAGE:\n[EINFÜGEN]\n\nCONNECTED VISUAL STORY:\n[EINFÜGEN]\n`).join('\n')}\n${imageNamingBlock}`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version: 5,
  title,
  sceneCount: scenes.length,
  imageSceneCount: imageSceneIds.length,
  animationSceneCount: animationSceneIds.length,
  sourceContract: 'exactly-one-of-bildprompt-or-remotion',
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

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log(`  Image World ${WORLD_ID} · Satzschnitte · keine leeren Hintergründe · textfreie Bilder`);
console.log('  Bildnummern sind 1:1 an echte Szenennummern gebunden; Animationsnummern bleiben reserviert.');
