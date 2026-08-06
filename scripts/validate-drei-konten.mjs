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
const karaokeCode = readFileSync(resolve(codeRoot, 'KaraokeCaptions.tsx'), 'utf8');
const configCode = readFileSync(resolve(codeRoot, 'config.ts'), 'utf8');
const expectedOrder = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const errors = [];
let missingFinalImages = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(index.sceneCount === 10, 'sceneCount muss 10 sein.');
assert(index.imageSceneCount === 6 && index.animationSceneCount === 4, 'Verhältnis muss 6 Bilder / 4 Animationen sein.');
assert(index.imageShare === 0.6 && index.animationShare === 0.4, 'Anteile müssen 60/40 sein.');
assert(index.layout?.headlineTop === 78, 'Überschrift muss bei Y=78 beginnen.');
assert(index.layout?.visualTop === 270 && index.layout?.visualBottom === 1350, 'Visueller Bereich muss Y=270–1350 sein.');
assert(index.layout?.subtitleBottom === 320, 'Untertitel-Safe-Area muss 320 px betragen.');
assert(index.layout?.subtitleLeft === 62 && index.layout?.subtitleRight === 150, 'Caption-Seitenabstände stimmen nicht.');
assert(index.headlineIconRule === 'matching-icon-centered-next-to-accent-same-visual-size', 'Icon-Regel fehlt.');
assert(index.subtitleDisplay?.maxLines === 2 && index.subtitleDisplay?.balancedLines === true, 'Untertitel müssen auf zwei ausgewogene Zeilen begrenzt sein.');
assert(index.subtitleDisplay?.holdDuringPauses === true && index.subtitleDisplay?.noDeadGaps === true, 'Caption-Lücken sind verboten.');
assert(index.maxIntentionalImageScale === 1.06, 'Maximale Bildvergrößerung muss 1.06 sein.');
assert(index.maxSourceCropPerSide === 0.22 && index.maxSourceCropTotal === 0.36, 'Source-Crop-Grenzen fehlen.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10 && timeline.totalFrames === 1800, 'Timeline muss 10 Szenen und 1800 Frames enthalten.');

assert(timing.subtitleMode === 'sentence-with-audio-synced-active-word', 'Caption-Modus muss audio-synchrone Wortverfolgung sein.');
assert(timing.activeWordColor === 'finance-green', 'Aktives Wort muss finance-green sein.');
assert(Array.isArray(timing.sentences) && timing.sentences.length === 12, 'Es müssen 12 zeitlich getrennte Sätze vorhanden sein.');
for (const sentence of timing.sentences ?? []) {
  const words = String(sentence.text ?? '').trim().split(/\s+/).filter(Boolean);
  assert(Array.isArray(sentence.frames) && sentence.frames.length === words.length + 1, `${sentence.id}: frames muss Wortanzahl + 1 enthalten.`);
}

assert(sharedCode.includes("objectFit: 'contain'"), 'Vordergrundbild muss contain verwenden.');
assert(sharedCode.includes('sourceCropTop'), 'Sicheres Top-Cropping fehlt.');
assert(sharedCode.includes('sourceCropBottom'), 'Sicheres Bottom-Cropping fehlt.');
assert(sharedCode.includes('Math.min(0.36, top + bottom)'), 'Gesamt-Crop muss auf 0.36 begrenzt sein.');
assert(sharedCode.includes('Math.min(1.06, imageScale)'), 'Bildvergrößerung muss auf 1.06 begrenzt sein.');
assert(sharedCode.includes('subtitleBottom: 320'), 'Untertitel liegen nicht hoch genug.');
assert(sharedCode.includes('subtitleRight: 150'), 'Rechte Reels-Bedienzone ist nicht freigehalten.');
assert(karaokeCode.includes('splitIntoBalancedLines'), 'Ausgewogene Zwei-Zeilen-Aufteilung fehlt.');
assert(karaokeCode.includes("whiteSpace: 'nowrap'"), 'Eine berechnete Untertitelzeile darf nicht erneut umbrechen.');
assert(karaokeCode.includes('let sentenceIndex = 0'), 'Der erste Satz muss schon vor dem ersten Wort sichtbar sein.');
assert(karaokeCode.includes('active ? C.accentLt : C.white'), 'Aktuelles Wort wird nicht grün verfolgt.');
assert(reelCode.includes('<KaraokeCaptions />'), 'Globale KaraokeCaptions fehlen.');
assert((configCode.match(/icon: '/g) ?? []).length === 10, 'Jede Szene benötigt ein Icon.');

assert(reelCode.includes('sceneId="scene-05" copy={SCENE_COPY[2]}'), 'Szene 03 muss das Kontostand-Bild verwenden.');
assert(reelCode.includes('sceneId="scene-07" copy={SCENE_COPY[4]}'), 'Szene 05 muss das Fixkosten-Bild verwenden.');
assert(reelCode.includes('sceneId="scene-03" copy={SCENE_COPY[6]}'), 'Szene 07 muss das Rücklagen-Bild verwenden.');

index.scenes.forEach((scene, indexNumber) => {
  const expectedId = `scene-${String(indexNumber + 1).padStart(2, '0')}`;
  const directory = resolve(sceneRoot, expectedId);
  const imagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
  const remotionPlan = existsSync(resolve(directory, 'remotion.md'));
  const imageFiles = readdirSync(directory).filter((name) => supported.has(extname(name).toLowerCase()));

  assert(scene.id === expectedId, `Falsche Reihenfolge bei ${expectedId}.`);
  assert(scene.type === expectedOrder[indexNumber], `${expectedId}: falscher Typ.`);
  assert(typeof scene.icon === 'string' && scene.icon.length > 2, `${expectedId}: Icon fehlt.`);
  assert(existsSync(resolve(directory, 'szene.md')), `${expectedId}: szene.md fehlt.`);
  assert(!existsSync(resolve(directory, 'motionprompt.txt')), `${expectedId}: motionprompt.txt ist verboten.`);
  assert(!existsSync(resolve(directory, 'placeholder.svg')), `${expectedId}: placeholder.svg ist verboten.`);
  assert(Number(imagePrompt) + Number(remotionPlan) === 1, `${expectedId}: genau eine Produktionsquelle erforderlich.`);

  if (scene.type === 'image') {
    const presentation = scene.imagePresentation ?? {};
    const top = Number(presentation.sourceCropTop);
    const bottom = Number(presentation.sourceCropBottom);
    assert(imagePrompt && !remotionPlan, `${expectedId}: Bildszene benötigt nur bildprompt.txt.`);
    assert(typeof scene.expectedVisual === 'string' && scene.expectedVisual.length > 12, `${expectedId}: expectedVisual fehlt.`);
    assert(Number(presentation.scale) >= 1 && Number(presentation.scale) <= 1.06, `${expectedId}: Scale muss zwischen 1 und 1.06 liegen.`);
    assert(top >= 0 && top <= 0.22 && bottom >= 0 && bottom <= 0.22, `${expectedId}: Source-Crop pro Seite ist ungültig.`);
    assert(top + bottom <= 0.36, `${expectedId}: Gesamt-Crop überschreitet 0.36.`);
    if (top + bottom > 0) assert(presentation.cropSafe === true, `${expectedId}: Cropping benötigt cropSafe=true.`);
    assert(imageFiles.length <= 1, `${expectedId}: mehr als ein finales Bild vorhanden.`);
    if (imageFiles.length === 0) missingFinalImages += 1;
  } else {
    assert(remotionPlan && !imagePrompt, `${expectedId}: Animationsszene benötigt nur remotion.md.`);
    assert(imageFiles.length === 0, `${expectedId}: Remotion-Szene darf keine Bilddatei enthalten.`);
  }
});

if (errors.length) {
  console.error('\nDrei-Konten-Validierung fehlgeschlagen:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Drei-Konten-System erfüllt Struktur, Cropping-, Icon- und Karaoke-Vertrag.');
console.log('  sichere Source-Crops · maximal zwei Caption-Zeilen · 320 px Plattform-Safe-Area');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
