#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const reelRoot = resolve('reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_drei-konten-system');
const sceneRoot = resolve(reelRoot, '03-szenen/EINZELNE-SZENEN');
const index = JSON.parse(readFileSync(resolve(reelRoot, '03-szenen/scene-index.json'), 'utf8'));
const timeline = JSON.parse(readFileSync(resolve(reelRoot, 'timeline/timeline.json'), 'utf8'));
const timing = JSON.parse(readFileSync(resolve(reelRoot, '04-caption/word-timings.json'), 'utf8'));
const codeRoot = resolve('src/reels/drei-konten');
const sharedCode = readFileSync(resolve(codeRoot, 'shared.tsx'), 'utf8');
const reelCode = readFileSync(resolve(codeRoot, 'DreiKontenSystem.tsx'), 'utf8');
const configCode = readFileSync(resolve(codeRoot, 'config.ts'), 'utf8');
const karaokeCode = readFileSync(resolve(codeRoot, 'KaraokeCaptions.tsx'), 'utf8');
const expectedOrder = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const expectedStarts = [0,203,384,526,714,907,1080,1272,1482,1611];
const expectedDurations = [203,181,142,188,193,173,192,210,129,189];
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const errors = [];
let missingFinalImages = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };
const requiredPromptMarkers = [
  'FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3',
  'SERIES CONTINUITY LOCK:',
  'ENVIRONMENT:',
  'COMPOSITION LOCK:',
  'TEXT:',
  'CONSISTENCY NEGATIVES:',
  'SCENE MESSAGE:',
  'CONNECTED VISUAL STORY:',
];

assert(index.version >= 12, 'scene-index muss mindestens Version 12 verwenden.');
assert(index.sceneCount === 10, 'sceneCount muss 10 sein.');
assert(index.imageSceneCount === 6 && index.animationSceneCount === 4, 'Verhältnis muss 6 Bilder / 4 Animationen sein.');
assert(index.imageWorld?.id === 'finanzneo-connected-studio-v3', 'Image World V3 fehlt.');
assert(index.imageWorld?.noEmptyBackground === true, 'Leere Hintergründe müssen verboten sein.');
assert(index.imageWorld?.backgroundFill === 'finanzneo-world-stage-v3', 'Einheitliche Remotion-Studiobühne fehlt.');
assert(index.timelineRules?.cutsFollowSentenceStarts === true, 'Szenenstarts müssen Satzanfängen folgen.');
assert(index.layout?.subtitleBottom === 320 && index.layout?.subtitleRight === 150, 'Caption-Safe-Area ist falsch.');
assert(index.imagePresentationContract?.imageFit === 'contain', 'Vordergrundbilder müssen contain verwenden.');
assert(index.imagePresentationContract?.maxIntentionalImageScale === 1.04, 'Maximale Bildskalierung muss 1.04 sein.');
assert(index.imagePresentationContract?.maxSourceCropPerSide === 0.2, 'Crop pro Seite muss auf 0.20 begrenzt sein.');
assert(index.imagePresentationContract?.maxSourceCropTotal === 0.34, 'Gesamt-Crop muss auf 0.34 begrenzt sein.');
assert(index.imagePresentationContract?.blurredImageBackgroundForbidden === true, 'Unscharfe Bildkopie muss verboten sein.');
assert(index.audio?.targetIntegratedLufs === -16 && index.audio?.targetTruePeakDbtp === -1, 'Audio-Zielwerte fehlen.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10 && timeline.totalFrames === 1800, 'Timeline muss 10 Szenen und 1800 Frames enthalten.');
assert(existsSync(resolve(reelRoot, '03-szenen/bildwelt.txt')), 'bildwelt.txt fehlt.');

assert(timing.subtitleMode === 'sentence-with-audio-synced-active-word', 'Caption-Modus ist falsch.');
assert(timing.activeWordColor === 'finance-green', 'Aktives Wort muss finance-green sein.');
assert(Array.isArray(timing.sentences) && timing.sentences.length === 12, 'Es müssen 12 Sätze mit Wortzeiten vorhanden sein.');

assert(sharedCode.includes('const ImageWorldBackdrop'), 'Einheitliche Image-World-Bühne fehlt im Remotion-Code.');
assert(!sharedCode.includes("filter: 'blur(34px)'"), 'Unscharfe Bildkopie ist weiterhin aktiv.');
assert(sharedCode.includes("objectFit: 'contain'"), 'Vordergrundbild muss contain verwenden.');
assert(sharedCode.includes('Math.min(1.04, imageScale)'), 'Bildskalierung muss auf 1.04 begrenzt sein.');
assert(sharedCode.includes('Math.min(0.2, sourceCropTop)'), 'Crop oben muss auf 0.20 begrenzt sein.');
assert(sharedCode.includes('Math.min(0.34, top + bottom)'), 'Gesamt-Crop muss auf 0.34 begrenzt sein.');
assert(reelCode.includes('volume={audioGain}'), 'Audio-Gain wird im Reel nicht angewendet.');
assert(configCode.includes('DREI_KONTEN_AUDIO_GAIN = 1.55'), 'Preview-Audio-Gain fehlt.');
assert(karaokeCode.includes('splitIntoBalancedLines'), 'Zwei-Zeilen-Karaoke fehlt.');
assert(karaokeCode.includes('active ? C.accentLt : C.white'), 'Aktuelles Wort wird nicht grün verfolgt.');

// Korrekte inhaltliche Zuordnung der vorhandenen Legacy-Assets.
assert(reelCode.includes('sceneId="scene-05" copy={SCENE_COPY[2]}'), 'Logische Szene 03 muss das Kontostand-Bild verwenden.');
assert(reelCode.includes('sceneId="scene-07" copy={SCENE_COPY[4]}'), 'Logische Szene 05 muss das Fixkosten-Bild verwenden.');
assert(reelCode.includes('sceneId="scene-03" copy={SCENE_COPY[6]}'), 'Logische Szene 07 muss das Rücklagen-Bild verwenden.');

let accumulated = 0;
index.scenes.forEach((scene, sceneIndex) => {
  const expectedId = `scene-${String(sceneIndex + 1).padStart(2, '0')}`;
  const directory = resolve(sceneRoot, expectedId);
  const imagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
  const remotionPlan = existsSync(resolve(directory, 'remotion.md'));
  const imageFiles = readdirSync(directory).filter((name) => supported.has(extname(name).toLowerCase()));

  assert(scene.id === expectedId, `Falsche Reihenfolge bei ${expectedId}.`);
  assert(scene.type === expectedOrder[sceneIndex], `${expectedId}: falscher Typ.`);
  assert(scene.startFrame === expectedStarts[sceneIndex], `${expectedId}: startFrame muss ${expectedStarts[sceneIndex]} sein.`);
  assert(scene.durationFrames === expectedDurations[sceneIndex], `${expectedId}: durationFrames muss ${expectedDurations[sceneIndex]} sein.`);
  assert(scene.endFrame === expectedStarts[sceneIndex] + expectedDurations[sceneIndex], `${expectedId}: endFrame ist falsch.`);
  assert(scene.cutReason === 'voice-sentence-start', `${expectedId}: Schnittgrund fehlt.`);
  assert(timeline.scenes[sceneIndex]?.startFrame === expectedStarts[sceneIndex], `${expectedId}: Timeline-Start ist falsch.`);
  assert(timeline.scenes[sceneIndex]?.durationFrames === expectedDurations[sceneIndex], `${expectedId}: Timeline-Dauer ist falsch.`);
  assert(Number(imagePrompt) + Number(remotionPlan) === 1, `${expectedId}: genau eine Produktionsquelle erforderlich.`);
  accumulated += scene.durationFrames;

  if (scene.type === 'image') {
    const prompt = readFileSync(resolve(directory, 'bildprompt.txt'), 'utf8');
    for (const marker of requiredPromptMarkers) assert(prompt.includes(marker), `${expectedId}: Promptmarker fehlt: ${marker}`);
    assert(prompt.includes('No empty black background'), `${expectedId}: leerer Hintergrund ist nicht verboten.`);
    assert(prompt.includes('No headline, subtitle, sentence, number, label'), `${expectedId}: Text ist nicht vollständig verboten.`);
    const p = scene.imagePresentation;
    assert(p && p.scale >= 1 && p.scale <= 1.04, `${expectedId}: Scale ist ungültig.`);
    assert(p.sourceCropTop >= 0 && p.sourceCropTop <= 0.2, `${expectedId}: sourceCropTop ist ungültig.`);
    assert(p.sourceCropBottom >= 0 && p.sourceCropBottom <= 0.2, `${expectedId}: sourceCropBottom ist ungültig.`);
    assert(p.sourceCropTop + p.sourceCropBottom <= 0.34 + Number.EPSILON, `${expectedId}: Gesamt-Crop ist zu groß.`);
    assert(imageFiles.length <= 1, `${expectedId}: mehr als ein finales Bild vorhanden.`);
    if (imageFiles.length === 0) missingFinalImages += 1;
  } else {
    assert(imageFiles.length === 0, `${expectedId}: Remotion-Szene darf keine Bilddatei enthalten.`);
  }
});

assert(accumulated === 1800, 'Szenendauern müssen zusammen exakt 1800 Frames ergeben.');

if (errors.length) {
  console.error('\nDrei-Konten-Validierung fehlgeschlagen:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Drei-Konten-System erfüllt Image World V3, Satzschnitt-, Bild- und Karaoke-Vertrag.');
console.log('  gleiche Welt · kein leerer Hintergrund · keine Blur-Streifen · Satzanfänge als Schnitte · sichere Crops');
if (index.scenes.find((scene) => scene.id === 'scene-02')?.assetReviewStatus === 'regenerate-required-before-final-publish') {
  console.log('  WICHTIG: Szene 02 muss vor der finalen Veröffentlichung mit dem neuen V3-Prompt neu generiert werden.');
}
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
