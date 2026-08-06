#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const reelRoot = resolve('reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_drei-konten-system');
const sceneRoot = resolve(reelRoot, '03-szenen/EINZELNE-SZENEN');
const index = JSON.parse(readFileSync(resolve(reelRoot, '03-szenen/scene-index.json'), 'utf8'));
const timeline = JSON.parse(readFileSync(resolve(reelRoot, 'timeline/timeline.json'), 'utf8'));
const expectedOrder = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const errors = [];
let missingFinalImages = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(index.sceneCount === 10, 'sceneCount muss 10 sein.');
assert(index.imageSceneCount === 6, 'imageSceneCount muss 6 sein.');
assert(index.animationSceneCount === 4, 'animationSceneCount muss 4 sein.');
assert(index.imageShare === 0.6, 'imageShare muss exakt 0.6 sein.');
assert(index.animationShare === 0.4, 'animationShare muss exakt 0.4 sein.');
assert(index.sourceContract === 'exactly-one-of-bildprompt-or-remotion', 'sourceContract fehlt oder ist falsch.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10, 'Timeline muss 10 Szenen enthalten.');
assert(timeline.totalFrames === 1800, 'Timeline muss exakt 1800 Frames enthalten.');
assert(existsSync(resolve(reelRoot, '03-szenen/alle-bildprompts.txt')), 'alle-bildprompts.txt fehlt.');
assert(!existsSync(resolve(reelRoot, '03-szenen/alle-motionprompts.txt')), 'alle-motionprompts.txt ist verboten.');
assert(existsSync(resolve('src/reels/drei-konten/DreiKontenSystem.tsx')), 'Remotion-Code fehlt.');

index.scenes.forEach((scene, indexNumber) => {
  const expectedId = `scene-${String(indexNumber + 1).padStart(2, '0')}`;
  const directory = resolve(sceneRoot, expectedId);
  const imagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
  const remotionPlan = existsSync(resolve(directory, 'remotion.md'));
  const imageFiles = readdirSync(directory).filter((name) => supported.has(extname(name).toLowerCase()));
  assert(scene.id === expectedId, `Falsche Reihenfolge bei ${expectedId}.`);
  assert(scene.type === expectedOrder[indexNumber], `${expectedId}: Typ muss ${expectedOrder[indexNumber]} sein.`);
  assert(existsSync(resolve(directory, 'szene.md')), `${expectedId}: szene.md fehlt.`);
  assert(!existsSync(resolve(directory, 'motionprompt.txt')), `${expectedId}: motionprompt.txt ist verboten.`);
  assert(!existsSync(resolve(directory, 'placeholder.svg')), `${expectedId}: placeholder.svg ist im Szenenordner verboten.`);
  assert(Number(imagePrompt) + Number(remotionPlan) === 1, `${expectedId}: genau eine Produktionsquelle erforderlich.`);
  assert(!Object.prototype.hasOwnProperty.call(scene, 'motionPrompt'), `${expectedId}: motionPrompt-Feld ist verboten.`);

  if (scene.type === 'image') {
    assert(imagePrompt && !remotionPlan, `${expectedId}: Bildszene benötigt ausschließlich bildprompt.txt.`);
    assert(scene.planFile?.endsWith('/bildprompt.txt'), `${expectedId}: planFile muss bildprompt.txt sein.`);
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

console.log('\n✓ Drei-Konten-System ist strukturell valide.');
console.log('  10 Szenen · 6 Bilder · 4 Animationen · 60,0 Sekunden · keine Platzhalter in Szenenordnern');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch; zentrale public-Fallbacks halten die Vorschau renderbar.`);
