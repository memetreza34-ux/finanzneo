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
assert(index.layout?.headlineTop === 74, 'Überschrift muss bei Y=74 beginnen.');
assert(index.layout?.visualTop === 270 && index.layout?.visualBottom === 1310, 'Visueller Bereich muss Y=270–1310 sein.');
assert(index.layout?.subtitleBottom === 270, 'Untertitel-Safe-Area muss 270 px betragen.');
assert(index.headlineIconRule === 'matching-icon-centered-next-to-accent-same-visual-size', 'Icon-Regel fehlt.');
assert(index.subtitleDisplay?.maxLines === 2, 'Untertitel dürfen höchstens zwei Zeilen belegen.');
assert(index.subtitleDisplay?.holdDuringPauses === true && index.subtitleDisplay?.noDeadGaps === true, 'Caption-Lücken sind verboten.');
assert(index.maxIntentionalImageScale === 1.18, 'Maximale Bildvergrößerung muss 1.18 sein.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10 && timeline.totalFrames === 1800, 'Timeline muss 10 Szenen und 1800 Frames enthalten.');

assert(timing.subtitleMode === 'sentence-with-audio-synced-active-word', 'Caption-Modus muss audio-synchrone Wortverfolgung sein.');
assert(timing.activeWordColor === 'finance-green', 'Aktives Wort muss finance-green sein.');
assert(timing.fps === 30, 'Wortzeiten müssen 30 fps verwenden.');
assert(Array.isArray(timing.sentences) && timing.sentences.length === 12, 'Es müssen 12 zeitlich getrennte Sätze vorhanden sein.');
for (const sentence of timing.sentences ?? []) {
  const words = String(sentence.text ?? '').trim().split(/\s+/).filter(Boolean);
  assert(Array.isArray(sentence.frames) && sentence.frames.length === words.length + 1, `${sentence.id}: frames muss Wortanzahl + 1 enthalten.`);
  for (let i = 1; i < (sentence.frames?.length ?? 0); i += 1) assert(sentence.frames[i] > sentence.frames[i - 1], `${sentence.id}: Wortzeiten müssen streng ansteigen.`);
}

assert(sharedCode.includes("objectFit: 'contain'"), 'Das Vordergrundbild muss objectFit contain verwenden.');
assert(sharedCode.includes('Math.min(1.18, imageScale)'), 'Bildvergrößerung muss auf 1.18 begrenzt sein.');
assert(sharedCode.includes('subtitleBottom: 270'), 'Untertitel müssen oberhalb der Reels-Totzone liegen.');
assert(sharedCode.includes("'headline' | 'accent' | 'accentTone' | 'icon'"), 'Headline-Komponente muss ein Icon verlangen.');
assert(reelCode.includes('<KaraokeCaptions />'), 'Globale KaraokeCaptions fehlen.');
assert(karaokeCode.includes('nextSentenceStart'), 'Untertitel müssen während Sprechpausen sichtbar bleiben.');
assert(karaokeCode.includes('active ? C.accentLt : C.white'), 'Aktuelles Wort wird nicht grün verfolgt.');
assert(karaokeCode.includes('textLength > 105 ? 27'), 'Lange Untertitel werden nicht kompakt genug dargestellt.');
assert(wordTimingCode.includes('DREI_KONTEN_WORD_TIMINGS'), 'Remotion-Wortzeiten fehlen.');
assert((configCode.match(/icon: '/g) ?? []).length === 10, 'Jede Szene benötigt genau ein passendes Überschriften-Icon.');
for (const file of animationFiles) {
  const code = readFileSync(resolve(codeRoot, file), 'utf8');
  assert(code.includes('icon={copy.icon}'), `${file}: Überschriften-Icon fehlt.`);
}

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
  assert(typeof scene.icon === 'string' && scene.icon.length > 2, `${expectedId}: passendes Icon fehlt.`);
  assert(existsSync(resolve(directory, 'szene.md')), `${expectedId}: szene.md fehlt.`);
  assert(!existsSync(resolve(directory, 'motionprompt.txt')), `${expectedId}: motionprompt.txt ist verboten.`);
  assert(!existsSync(resolve(directory, 'placeholder.svg')), `${expectedId}: placeholder.svg ist verboten.`);
  assert(Number(imagePrompt) + Number(remotionPlan) === 1, `${expectedId}: genau eine Produktionsquelle erforderlich.`);

  if (scene.type === 'image') {
    assert(imagePrompt && !remotionPlan, `${expectedId}: Bildszene benötigt nur bildprompt.txt.`);
    assert(typeof scene.expectedVisual === 'string' && scene.expectedVisual.length > 12, `${expectedId}: expectedVisual fehlt.`);
    assert(scene.imagePresentation && Number(scene.imagePresentation.scale) >= 1 && Number(scene.imagePresentation.scale) <= 1.18, `${expectedId}: imagePresentation.scale muss zwischen 1 und 1.18 liegen.`);
    assert(Number(scene.imagePresentation?.positionY) >= 35 && Number(scene.imagePresentation?.positionY) <= 60, `${expectedId}: positionY ist unplausibel.`);
    if (Number(scene.imagePresentation?.scale) > 1.05) assert(scene.imagePresentation?.cropSafe === true, `${expectedId}: Scale über 1.05 benötigt cropSafe=true.`);
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

console.log('\n✓ Drei-Konten-System erfüllt Struktur, Icon-, Bild- und Karaoke-Vertrag.');
console.log('  Icons mittig · Bildgrößen vereinheitlicht · ein Satz · keine Caption-Lücken · Safe-Area 270 px');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
