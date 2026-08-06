#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const target = process.argv[2];
if (!target) { console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner>'); process.exit(1); }
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
  const directories = readdirSync(sceneRoot).filter((entry) => /^scene-\d{2}$/.test(entry) && statSync(resolve(sceneRoot, entry)).isDirectory()).sort();
  assert(Array.isArray(index.scenes), 'scene-index.json benötigt scenes[].');
  assert(index.sceneCount === directories.length, 'sceneCount stimmt nicht mit den Szenenordnern überein.');
  assert(index.headlineIconRule === 'matching-icon-centered-next-to-accent-same-visual-size', 'Headline-Icon-Regel fehlt.');
  assert(index.subtitleDisplay?.maxLines === 2 && index.subtitleDisplay?.balancedLines === true, 'Untertitel müssen auf zwei ausgewogene Zeilen begrenzt sein.');
  assert(index.subtitleDisplay?.noDeadGaps === true && index.subtitleDisplay?.holdDuringPauses === true, 'Leere Caption-Lücken sind verboten.');
  assert(Number(index.layout?.subtitleBottom) >= 320, 'Untertitel liegen zu tief in der Plattform-Totzone.');
  assert(Number(index.layout?.subtitleRight) >= 150, 'Rechte Reels-Bedienzone wird nicht ausreichend freigehalten.');

  const timingPath = resolve(root, index.wordTimingFile ?? '04-caption/word-timings.json');
  assert(existsSync(timingPath), `Worttiming-Datei fehlt: ${timingPath}`);
  let timing = null;
  if (existsSync(timingPath)) {
    timing = JSON.parse(readFileSync(timingPath, 'utf8'));
    assert(timing.subtitleMode === 'sentence-with-audio-synced-active-word', 'Worttiming-Datei hat falschen subtitleMode.');
    assert(timing.activeWordColor === 'finance-green', 'Worttiming-Datei hat falsche aktive Wortfarbe.');
    assert(Array.isArray(timing.sentences), 'Worttiming-Datei benötigt sentences[].');
  }
  assert((index.subtitleMode ?? timing?.subtitleMode) === 'sentence-with-audio-synced-active-word', 'Audio-synchrone Wortverfolgung fehlt.');
  assert((index.activeWordColor ?? timing?.activeWordColor) === 'finance-green', 'Aktive Wortfarbe muss finance-green sein.');
  if (index.imageFit !== undefined) assert(index.imageFit === 'contain', 'imageFit muss contain sein.');
  if (index.maxIntentionalImageScale !== undefined) assert(Number(index.maxIntentionalImageScale) <= 1.06, 'maxIntentionalImageScale darf 1.06 nicht überschreiten.');
  if (index.maxSourceCropPerSide !== undefined) assert(Number(index.maxSourceCropPerSide) <= 0.22, 'maxSourceCropPerSide darf 0.22 nicht überschreiten.');
  if (index.maxSourceCropTotal !== undefined) assert(Number(index.maxSourceCropTotal) <= 0.36, 'maxSourceCropTotal darf 0.36 nicht überschreiten.');

  directories.forEach((id, position) => {
    const directory = resolve(sceneRoot, id);
    const hasImagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
    const hasRemotion = existsSync(resolve(directory, 'remotion.md'));
    const sourceCount = Number(hasImagePrompt) + Number(hasRemotion);
    const indexed = index.scenes?.[position];
    const supported = new Set(['.png','.jpg','.jpeg','.webp','.avif','.svg']);
    const images = readdirSync(directory).filter((entry) => supported.has(extname(entry).toLowerCase()));

    assert(sourceCount === 1, `${id}: exakt eine Produktionsquelle erforderlich.`);
    assert(existsSync(resolve(directory, 'szene.md')), `${id}: szene.md fehlt.`);
    assert(indexed?.id === id, `${id}: Reihenfolge oder ID im scene-index stimmt nicht.`);
    assert(typeof indexed?.icon === 'string' && indexed.icon.trim(), `${id}: passendes Überschriften-Icon fehlt.`);
    assert(!Object.prototype.hasOwnProperty.call(indexed ?? {}, 'motionPrompt'), `${id}: motionPrompt-Feld ist verboten.`);
    assert(!existsSync(resolve(directory, 'placeholder.svg')), `${id}: placeholder.svg ist im Szenenordner verboten.`);

    if (hasImagePrompt) {
      const presentation = indexed?.imagePresentation ?? {};
      const scale = Number(presentation.scale);
      const top = Number(presentation.sourceCropTop);
      const bottom = Number(presentation.sourceCropBottom);
      assert(indexed?.type === 'image', `${id}: scene-index-Typ muss image sein.`);
      assert(indexed?.planFile?.endsWith('/bildprompt.txt'), `${id}: planFile muss auf bildprompt.txt zeigen.`);
      assert(typeof indexed?.expectedVisual === 'string' && indexed.expectedVisual.trim(), `${id}: expectedVisual fehlt.`);
      assert(scale >= 1 && scale <= 1.06, `${id}: Scale muss zwischen 1 und 1.06 liegen.`);
      assert(top >= 0 && top <= 0.22 && bottom >= 0 && bottom <= 0.22, `${id}: Source-Crop pro Seite ist ungültig.`);
      assert(top + bottom <= 0.36, `${id}: Gesamt-Crop überschreitet 0.36.`);
      if (top + bottom > 0) assert(presentation.cropSafe === true, `${id}: Cropping benötigt cropSafe=true.`);
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
  console.error('\nReel-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-Quellen- und Präsentationsvertrag erfüllt.');
console.log('  Icon-Headline · Zwei-Zeilen-Captions · 320 px Safe-Area · sichere Source-Crops');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
