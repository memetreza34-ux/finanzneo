#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const reelRoot = resolve('reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_drei-konten-system');
const sceneRoot = resolve(reelRoot, '03-szenen/EINZELNE-SZENEN');
const index = JSON.parse(readFileSync(resolve(reelRoot, '03-szenen/scene-index.json'), 'utf8'));
const timeline = JSON.parse(readFileSync(resolve(reelRoot, 'timeline/timeline.json'), 'utf8'));
const sharedCode = readFileSync(resolve('src/reels/drei-konten/shared.tsx'), 'utf8');
const expectedOrder = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const errors = [];
let missingFinalImages = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };
const sentenceCount = (text) => (text.match(/[.!?](?=\s|$)/g) ?? []).length;

assert(index.sceneCount === 10, 'sceneCount muss 10 sein.');
assert(index.imageSceneCount === 6, 'imageSceneCount muss 6 sein.');
assert(index.animationSceneCount === 4, 'animationSceneCount muss 4 sein.');
assert(index.imageShare === 0.6, 'imageShare muss exakt 0.6 sein.');
assert(index.animationShare === 0.4, 'animationShare muss exakt 0.4 sein.');
assert(index.sourceContract === 'exactly-one-of-bildprompt-or-remotion', 'sourceContract fehlt oder ist falsch.');
assert(index.layoutContract === 'headline-top_visual-above-center_subtitle-bottom_one-sentence', 'layoutContract fehlt oder ist falsch.');
assert(index.subtitleRule === 'one-complete-sentence-per-cue', 'subtitleRule fehlt oder ist falsch.');
assert(index.layout?.headlineTop === 92, 'Überschrift muss bei Y=92 beginnen.');
assert(index.layout?.visualTop === 300 && index.layout?.visualBottom === 1410, 'Visueller Bereich muss Y=300–1410 sein.');
assert(index.layout?.subtitleBottom === 180, 'Untertitel-Safe-Area muss 180 px betragen.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10, 'Timeline muss 10 Szenen enthalten.');
assert(timeline.totalFrames === 1800, 'Timeline muss exakt 1800 Frames enthalten.');
assert(existsSync(resolve(reelRoot, '03-szenen/alle-bildprompts.txt')), 'alle-bildprompts.txt fehlt.');
assert(!existsSync(resolve(reelRoot, '03-szenen/alle-motionprompts.txt')), 'alle-motionprompts.txt ist verboten.');
assert(sharedCode.includes('headlineTop: 92'), 'Remotion-Layout: headlineTop ist nicht 92.');
assert(sharedCode.includes('visualTop: 300'), 'Remotion-Layout: visualTop ist nicht 300.');
assert(sharedCode.includes('visualHeight: 1110'), 'Remotion-Layout: visualHeight ist nicht 1110.');
assert(sharedCode.includes('subtitleBottom: 180'), 'Remotion-Layout: subtitleBottom ist nicht 180.');
assert(!sharedCode.includes('kicker:'), 'Kicker im Untertitel-System ist verboten.');

index.scenes.forEach((scene, indexNumber) => {
  const expectedId = `scene-${String(indexNumber + 1).padStart(2, '0')}`;
  const directory = resolve(sceneRoot, expectedId);
  const imagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
  const remotionPlan = existsSync(resolve(directory, 'remotion.md'));
  const imageFiles = readdirSync(directory).filter((name) => supported.has(extname(name).toLowerCase()));
  assert(scene.id === expectedId, `Falsche Reihenfolge bei ${expectedId}.`);
  assert(scene.type === expectedOrder[indexNumber], `${expectedId}: Typ muss ${expectedOrder[indexNumber]} sein.`);
  assert(typeof scene.headline === 'string' && scene.headline.trim().length > 0, `${expectedId}: Überschrift fehlt.`);
  assert(typeof scene.accent === 'string' && scene.accent.trim().length > 0, `${expectedId}: Schwerpunktzeile fehlt.`);
  assert(Array.isArray(scene.subtitles) && scene.subtitles.length > 0, `${expectedId}: Untertitel-Cues fehlen.`);
  assert(existsSync(resolve(directory, 'szene.md')), `${expectedId}: szene.md fehlt.`);
  assert(!existsSync(resolve(directory, 'motionprompt.txt')), `${expectedId}: motionprompt.txt ist verboten.`);
  assert(!existsSync(resolve(directory, 'placeholder.svg')), `${expectedId}: placeholder.svg ist im Szenenordner verboten.`);
  assert(Number(imagePrompt) + Number(remotionPlan) === 1, `${expectedId}: genau eine Produktionsquelle erforderlich.`);

  let previousEnd = 0;
  for (const cue of scene.subtitles ?? []) {
    assert(Number.isInteger(cue.fromFrame) && Number.isInteger(cue.toFrame), `${expectedId}: Cue-Grenzen müssen ganze Frames sein.`);
    assert(cue.fromFrame >= previousEnd, `${expectedId}: Untertitel-Cues überlappen sich.`);
    assert(cue.toFrame > cue.fromFrame && cue.toFrame <= scene.durationFrames, `${expectedId}: ungültige Cue-Dauer.`);
    assert(typeof cue.text === 'string' && cue.text.trim().length > 0, `${expectedId}: leerer Untertitel.`);
    assert(sentenceCount(cue.text) <= 1, `${expectedId}: pro Cue ist nur ein Satz erlaubt: ${cue.text}`);
    previousEnd = cue.toFrame;
  }
  assert(previousEnd === scene.durationFrames, `${expectedId}: Untertitel-Cues müssen die ganze Szene abdecken.`);

  if (scene.type === 'image') {
    assert(imagePrompt && !remotionPlan, `${expectedId}: Bildszene benötigt ausschließlich bildprompt.txt.`);
    assert(scene.planFile?.endsWith('/bildprompt.txt'), `${expectedId}: planFile muss bildprompt.txt sein.`);
    assert(typeof scene.expectedVisual === 'string' && scene.expectedVisual.length > 12, `${expectedId}: expectedVisual fehlt.`);
    const prompt = readFileSync(resolve(directory, 'bildprompt.txt'), 'utf8');
    assert(prompt.includes('TEXT IN IMAGE:\nNo text.'), `${expectedId}: Bildprompt muss Text vollständig verbieten.`);
    assert(imageFiles.length <= 1, `${expectedId}: Mehr als ein finales Bild vorhanden.`);
    if (imageFiles.length === 0) missingFinalImages += 1;
  } else {
    assert(remotionPlan && !imagePrompt, `${expectedId}: Animationsszene benötigt ausschließlich remotion.md.`);
    assert(scene.planFile?.endsWith('/remotion.md'), `${expectedId}: planFile muss remotion.md sein.`);
    assert(imageFiles.length === 0, `${expectedId}: Remotion-Szene darf keine Bilddatei enthalten.`);
  }
});

if (errors.length) {
  console.error('\nDrei-Konten-Validierung fehlgeschlagen:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Drei-Konten-System ist strukturell und visuell valide.');
console.log('  Überschrift oben · Visual oberhalb der Mitte · Untertitel unten · maximal ein Satz pro Cue');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
