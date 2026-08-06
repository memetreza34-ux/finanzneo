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
const wordTimingCode = readFileSync(resolve(codeRoot, 'word-timings.ts'), 'utf8');
const animationFiles = ['SalarySplitAnimation.tsx','FixedCostsMathAnimation.tsx','AnnualCostsAnimation.tsx','WeeklyBudgetAnimation.tsx'];
const expectedOrder = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const errors = [];
let missingFinalImages = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(index.sceneCount === 10, 'sceneCount muss 10 sein.');
assert(index.imageSceneCount === 6 && index.animationSceneCount === 4, 'Verhältnis muss 6 Bilder / 4 Animationen sein.');
assert(index.imageShare === 0.6 && index.animationShare === 0.4, 'Anteile müssen 60/40 sein.');
assert(index.layout?.headlineTop === 92, 'Überschrift muss bei Y=92 beginnen.');
assert(index.layout?.visualTop === 300 && index.layout?.visualBottom === 1410, 'Visueller Bereich muss Y=300–1410 sein.');
assert(index.layout?.subtitleBottom === 180, 'Untertitel-Safe-Area muss 180 px betragen.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10 && timeline.totalFrames === 1800, 'Timeline muss 10 Szenen und 1800 Frames enthalten.');

assert(timing.subtitleMode === 'sentence-with-audio-synced-active-word', 'Caption-Modus muss audio-synchrone Wortverfolgung sein.');
assert(timing.activeWordColor === 'finance-green', 'Aktives Wort muss finance-green sein.');
assert(timing.fps === 30, 'Wortzeiten müssen 30 fps verwenden.');
assert(Array.isArray(timing.sentences) && timing.sentences.length === 12, 'Es müssen 12 zeitlich getrennte Sätze vorhanden sein.');
for (const sentence of timing.sentences ?? []) {
  const words = String(sentence.text ?? '').trim().split(/\s+/).filter(Boolean);
  assert(Array.isArray(sentence.frames) && sentence.frames.length === words.length + 1, `${sentence.id}: frames muss Wortanzahl + 1 enthalten.`);
  for (let i = 1; i < (sentence.frames?.length ?? 0); i += 1) {
    assert(sentence.frames[i] > sentence.frames[i - 1], `${sentence.id}: Wortzeiten müssen streng ansteigen.`);
  }
}

assert(sharedCode.includes("objectFit: 'contain'"), 'Das Vordergrundbild muss objectFit contain verwenden.');
assert(sharedCode.includes('Math.min(1.05, imageScale)'), 'Bewusste Bildvergrößerung muss auf 1.05 begrenzt sein.');
assert(reelCode.includes('<KaraokeCaptions />'), 'Globale KaraokeCaptions fehlen.');
assert(karaokeCode.includes('active ? C.accentLt : C.white'), 'Aktuelles Wort wird nicht grün verfolgt.');
assert(karaokeCode.includes('sentence.text.split'), 'Der vollständige aktive Satz muss sichtbar bleiben.');
assert(wordTimingCode.includes('DREI_KONTEN_WORD_TIMINGS'), 'Remotion-Wortzeiten fehlen.');
assert(!sharedCode.includes('SentenceCaption'), 'Lokale Satz-Captions in shared.tsx sind verboten.');
for (const file of animationFiles) {
  const code = readFileSync(resolve(codeRoot, file), 'utf8');
  assert(!code.includes('SentenceCaption'), `${file}: lokale Untertitel sind verboten.`);
}

// Reparatur für die im Referenz-Render vertauschten vorhandenen Dateien.
assert(reelCode.includes('sceneId="scene-05" copy={SCENE_COPY[2]}'), 'Szene 03 muss aktuell das Kontostand-Bild aus scene-05 verwenden.');
assert(reelCode.includes('sceneId="scene-07" copy={SCENE_COPY[4]}'), 'Szene 05 muss aktuell das Fixkosten-Bild aus scene-07 verwenden.');
assert(reelCode.includes('sceneId="scene-03" copy={SCENE_COPY[6]}'), 'Szene 07 muss aktuell das Rücklagen-Bild aus scene-03 verwenden.');

index.scenes.forEach((scene, indexNumber) => {
  const expectedId = `scene-${String(indexNumber + 1).padStart(2, '0')}`;
  const directory = resolve(sceneRoot, expectedId);
  const imagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
  const remotionPlan = existsSync(resolve(directory, 'remotion.md'));
  const imageFiles = readdirSync(directory).filter((name) => supported.has(extname(name).toLowerCase()));

  assert(scene.id === expectedId, `Falsche Reihenfolge bei ${expectedId}.`);
  assert(scene.type === expectedOrder[indexNumber], `${expectedId}: falscher Typ.`);
  assert(existsSync(resolve(directory, 'szene.md')), `${expectedId}: szene.md fehlt.`);
  assert(!existsSync(resolve(directory, 'motionprompt.txt')), `${expectedId}: motionprompt.txt ist verboten.`);
  assert(!existsSync(resolve(directory, 'placeholder.svg')), `${expectedId}: placeholder.svg ist verboten.`);
  assert(Number(imagePrompt) + Number(remotionPlan) === 1, `${expectedId}: genau eine Produktionsquelle erforderlich.`);

  if (scene.type === 'image') {
    assert(imagePrompt && !remotionPlan, `${expectedId}: Bildszene benötigt nur bildprompt.txt.`);
    assert(typeof scene.expectedVisual === 'string' && scene.expectedVisual.length > 12, `${expectedId}: expectedVisual fehlt.`);
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

console.log('\n✓ Drei-Konten-System erfüllt Struktur, Layout und Karaoke-Vertrag.');
console.log('  10 Szenen · 60/40 · ein Satz · aktives Wort grün · Vordergrund contain · max. Scale 1.05');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
