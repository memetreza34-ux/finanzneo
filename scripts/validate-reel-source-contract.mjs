#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const sceneRoot = resolve(root, '03-szenen/EINZELNE-SZENEN');
const indexPath = resolve(root, '03-szenen/scene-index.json');
const errors = [];
let missingFinalImages = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(existsSync(sceneRoot), '03-szenen/EINZELNE-SZENEN fehlt.');
assert(existsSync(indexPath), '03-szenen/scene-index.json fehlt.');
assert(existsSync(resolve(root, '03-szenen/alle-bildprompts.txt')), 'alle-bildprompts.txt fehlt.');
assert(!existsSync(resolve(root, '03-szenen/alle-motionprompts.txt')), 'alle-motionprompts.txt ist verboten.');

const findForbidden = (directory) => {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) findForbidden(path);
    else if (entry.toLowerCase() === 'motionprompt.txt') errors.push(`Verbotene Datei: ${path}`);
    else if (entry.toLowerCase() === 'placeholder.svg' && path.startsWith(sceneRoot)) errors.push(`Platzhalter im Szenenordner verboten: ${path}`);
  }
};
findForbidden(root);

if (existsSync(sceneRoot) && existsSync(indexPath)) {
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const directories = readdirSync(sceneRoot)
    .filter((entry) => /^scene-\d{2}$/.test(entry) && statSync(resolve(sceneRoot, entry)).isDirectory())
    .sort();

  assert(Array.isArray(index.scenes), 'scene-index.json benötigt scenes[].');
  assert(index.sceneCount === directories.length, 'sceneCount stimmt nicht mit den Szenenordnern überein.');

  directories.forEach((id, position) => {
    const directory = resolve(sceneRoot, id);
    const hasImagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
    const hasRemotion = existsSync(resolve(directory, 'remotion.md'));
    const hasSceneInfo = existsSync(resolve(directory, 'szene.md'));
    const sourceCount = Number(hasImagePrompt) + Number(hasRemotion);
    const indexed = index.scenes?.[position];
    const supported = new Set(['.png','.jpg','.jpeg','.webp','.avif','.svg']);
    const images = readdirSync(directory).filter((entry) => supported.has(extname(entry).toLowerCase()));

    assert(sourceCount === 1, `${id}: exakt eine Produktionsquelle erforderlich (bildprompt.txt ODER remotion.md).`);
    assert(hasSceneInfo, `${id}: szene.md fehlt.`);
    assert(indexed?.id === id, `${id}: Reihenfolge oder ID im scene-index stimmt nicht.`);
    assert(!Object.prototype.hasOwnProperty.call(indexed ?? {}, 'motionPrompt'), `${id}: motionPrompt-Feld ist verboten.`);
    assert(!existsSync(resolve(directory, 'placeholder.svg')), `${id}: placeholder.svg ist im Szenenordner verboten.`);

    if (hasImagePrompt) {
      assert(indexed?.type === 'image', `${id}: scene-index-Typ muss image sein.`);
      assert(indexed?.planFile?.endsWith('/bildprompt.txt'), `${id}: planFile muss auf bildprompt.txt zeigen.`);
      assert(images.length <= 1, `${id}: höchstens ein finales Bild erlaubt.`);
      if (images.length === 0) missingFinalImages += 1;
    }

    if (hasRemotion) {
      assert(indexed?.type === 'animation', `${id}: scene-index-Typ muss animation sein.`);
      assert(indexed?.planFile?.endsWith('/remotion.md'), `${id}: planFile muss auf remotion.md zeigen.`);
      assert(images.length === 0, `${id}: Remotion-Szene darf keine Bilddatei enthalten.`);
    }
  });
}

if (errors.length) {
  console.error('\nReel-Quellenvertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-Quellenvertrag erfüllt.');
console.log('  Bildszene = bildprompt.txt · Remotion-Szene = remotion.md · keine Prompt- oder Bildplatzhalter');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
