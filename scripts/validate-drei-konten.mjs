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

const assert = (condition, message) => { if (!condition) errors.push(message); };
const file = (path) => existsSync(resolve(reelRoot, path));

assert(index.sceneCount === 10, 'sceneCount muss 10 sein.');
assert(index.imageSceneCount === 6, 'imageSceneCount muss 6 sein.');
assert(index.animationSceneCount === 4, 'animationSceneCount muss 4 sein.');
assert(index.imageShare === 0.6, 'imageShare muss exakt 0.6 sein.');
assert(index.animationShare === 0.4, 'animationShare muss exakt 0.4 sein.');
assert(Array.isArray(index.scenes) && index.scenes.length === 10, 'scene-index muss 10 Szenen enthalten.');
assert(Array.isArray(timeline.scenes) && timeline.scenes.length === 10, 'Timeline muss 10 Szenen enthalten.');
assert(timeline.totalFrames === 1800, 'Timeline muss exakt 1800 Frames enthalten.');
assert(file('03-szenen/alle-bildprompts.txt'), 'alle-bildprompts.txt fehlt.');
assert(file('03-szenen/alle-motionprompts.txt'), 'alle-motionprompts.txt fehlt.');
assert(existsSync(resolve('src/reels/drei-konten/DreiKontenSystem.tsx')), 'Remotion-Code fehlt.');

index.scenes.forEach((scene, indexNumber) => {
  const expectedId = `scene-${String(indexNumber + 1).padStart(2, '0')}`;
  const directory = resolve(sceneRoot, expectedId);
  assert(scene.id === expectedId, `Falsche Reihenfolge bei ${expectedId}.`);
  assert(scene.type === expectedOrder[indexNumber], `${expectedId}: Typ muss ${expectedOrder[indexNumber]} sein.`);
  assert(existsSync(resolve(directory, 'szene.md')), `${expectedId}: szene.md fehlt.`);
  assert(existsSync(resolve(directory, 'motionprompt.txt')), `${expectedId}: motionprompt.txt fehlt.`);

  if (scene.type === 'image') {
    assert(existsSync(resolve(directory, 'bildprompt.txt')), `${expectedId}: bildprompt.txt fehlt.`);
    const candidates = existsSync(directory)
      ? readdirSync(directory).filter((name) => supported.has(extname(name).toLowerCase()))
      : [];
    const finals = candidates.filter((name) => name !== 'placeholder.svg');
    assert(finals.length <= 1, `${expectedId}: Mehr als ein finales Bild vorhanden.`);
    assert(finals.length === 1 || candidates.includes('placeholder.svg'), `${expectedId}: Bild oder placeholder.svg fehlt.`);
  } else {
    assert(existsSync(resolve(directory, 'remotion.md')), `${expectedId}: remotion.md fehlt.`);
  }
});

if (errors.length) {
  console.error('\nDrei-Konten-Validierung fehlgeschlagen:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Drei-Konten-System ist strukturell valide.');
console.log('  10 Szenen · 6 Bilder · 4 Animationen · 60,0 Sekunden · 1800 Frames');
