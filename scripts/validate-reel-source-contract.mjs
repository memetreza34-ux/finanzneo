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
const allPromptsPath = resolve(root, '03-szenen/alle-bildprompts.txt');
const errors = [];
let missingFinalImages = 0;
let finalImageCount = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const promptMarkers = [
  'FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3',
  'SERIES CONTINUITY LOCK:',
  'ENVIRONMENT:',
  'COMPOSITION LOCK:',
  'TEXT:',
  'CONSISTENCY NEGATIVES:',
  'SCENE MESSAGE:',
  'CONNECTED VISUAL STORY:',
];

assert(existsSync(sceneRoot), '03-szenen/EINZELNE-SZENEN fehlt.');
assert(existsSync(indexPath), '03-szenen/scene-index.json fehlt.');
assert(existsSync(allPromptsPath), '03-szenen/alle-bildprompts.txt fehlt.');
assert(existsSync(resolve(root, '03-szenen/bildwelt.txt')), '03-szenen/bildwelt.txt fehlt.');
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
  assert(index.imageWorld?.id === 'finanzneo-connected-studio-v3', 'Image World V3 fehlt.');
  assert(index.imageWorld?.noEmptyBackground === true, 'Leere Hintergründe müssen ausdrücklich verboten sein.');
  assert(index.imageWorld?.backgroundFill === 'finanzneo-world-stage-v3', 'Einheitliche Remotion-Studiobühne fehlt.');
  assert(index.imageWorld?.referencePromptFile === '03-szenen/bildwelt.txt', 'referencePromptFile ist falsch.');
  assert(index.timelineRules?.cutsFollowSentenceStarts === true, 'Szenenschnitte müssen Satzanfängen folgen.');
  assert(index.timelineRules?.equalLengthScenesForbiddenByDefault === true, 'Starre gleich lange Szenen müssen standardmäßig verboten sein.');
  assert(index.headlineIconRule === 'matching-icon-centered-next-to-accent-same-visual-size', 'Headline-Icon-Regel fehlt.');
  assert(index.subtitleDisplay?.maxLines === 2, 'Untertitel müssen auf zwei Zeilen begrenzt sein.');
  assert(index.subtitleDisplay?.noDeadGaps === true && index.subtitleDisplay?.holdDuringPauses === true, 'Leere Caption-Lücken sind verboten.');
  assert(Number(index.layout?.subtitleBottom) >= 250, 'Untertitel liegen zu tief in der Plattform-Totzone.');
  assert(index.imagePresentationContract?.imageFit === 'contain', 'Vordergrundbilder müssen contain verwenden.');
  assert(Number(index.imagePresentationContract?.maxIntentionalImageScale) <= 1.04, 'Bildskalierung darf 1.04 nicht überschreiten.');
  assert(Number(index.imagePresentationContract?.maxSourceCropPerSide) <= 0.2, 'Source-Crop pro Seite darf 0.20 nicht überschreiten.');
  assert(Number(index.imagePresentationContract?.maxSourceCropTotal) <= 0.34, 'Gesamt-Crop darf 0.34 nicht überschreiten.');
  assert(index.imagePresentationContract?.blurredImageBackgroundForbidden === true, 'Unscharfe Bildkopien als Hintergrund müssen verboten sein.');
  assert(Number(index.audio?.targetIntegratedLufs) === -16, 'Audioziel muss ungefähr -16 LUFS sein.');
  assert(Number(index.audio?.targetTruePeakDbtp) === -1, 'True-Peak-Ziel muss -1 dBTP sein.');

  const timingPath = resolve(root, index.timelineRules?.timingSource ?? '04-caption/word-timings.json');
  assert(existsSync(timingPath), `Worttiming-Datei fehlt: ${timingPath}`);
  if (existsSync(timingPath)) {
    const timing = JSON.parse(readFileSync(timingPath, 'utf8'));
    assert(timing.subtitleMode === 'sentence-with-audio-synced-active-word', 'Worttiming-Datei hat falschen subtitleMode.');
    assert(timing.activeWordColor === 'finance-green', 'Aktive Wortfarbe muss finance-green sein.');
    assert(Array.isArray(timing.sentences), 'Worttiming-Datei benötigt sentences[].');
  }

  const allPrompts = existsSync(allPromptsPath) ? readFileSync(allPromptsPath, 'utf8') : '';
  assert(allPrompts.includes('FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3'), 'alle-bildprompts.txt verwendet nicht Image World V3.');
  assert(allPrompts.includes('No empty black background'), 'alle-bildprompts.txt verbietet leere Hintergründe nicht.');

  directories.forEach((id, position) => {
    const directory = resolve(sceneRoot, id);
    const hasImagePrompt = existsSync(resolve(directory, 'bildprompt.txt'));
    const hasRemotion = existsSync(resolve(directory, 'remotion.md'));
    const hasSceneInfo = existsSync(resolve(directory, 'szene.md'));
    const sourceCount = Number(hasImagePrompt) + Number(hasRemotion);
    const indexed = index.scenes?.[position];
    const images = readdirSync(directory).filter((entry) => supported.has(extname(entry).toLowerCase()));

    assert(sourceCount === 1, `${id}: exakt eine Produktionsquelle erforderlich.`);
    assert(hasSceneInfo, `${id}: szene.md fehlt.`);
    assert(indexed?.id === id, `${id}: Reihenfolge oder ID im scene-index stimmt nicht.`);
    assert(typeof indexed?.icon === 'string' && indexed.icon.trim(), `${id}: passendes Überschriften-Icon fehlt.`);
    assert(!Object.prototype.hasOwnProperty.call(indexed ?? {}, 'motionPrompt'), `${id}: motionPrompt-Feld ist verboten.`);
    assert(!existsSync(resolve(directory, 'placeholder.svg')), `${id}: placeholder.svg ist im Szenenordner verboten.`);

    if (hasImagePrompt) {
      assert(indexed?.type === 'image', `${id}: scene-index-Typ muss image sein.`);
      assert(indexed?.planFile?.endsWith('/bildprompt.txt'), `${id}: planFile muss auf bildprompt.txt zeigen.`);
      assert(typeof indexed?.expectedVisual === 'string' && indexed.expectedVisual.trim(), `${id}: expectedVisual fehlt.`);
      const prompt = readFileSync(resolve(directory, 'bildprompt.txt'), 'utf8');
      for (const marker of promptMarkers) assert(prompt.includes(marker), `${id}: Promptmarker fehlt: ${marker}`);
      assert(prompt.includes('Do not redesign the world.'), `${id}: Weltkontinuität ist nicht gesperrt.`);
      assert(prompt.includes('No headline, subtitle, sentence, number, label'), `${id}: Bildtext ist nicht vollständig verboten.`);

      const presentation = indexed?.imagePresentation;
      const scale = Number(presentation?.scale);
      const top = Number(presentation?.sourceCropTop);
      const bottom = Number(presentation?.sourceCropBottom);
      assert(presentation && scale >= 1 && scale <= 1.04, `${id}: imagePresentation.scale fehlt oder ist ungültig.`);
      assert(top >= 0 && top <= 0.2, `${id}: sourceCropTop muss zwischen 0 und 0.20 liegen.`);
      assert(bottom >= 0 && bottom <= 0.2, `${id}: sourceCropBottom muss zwischen 0 und 0.20 liegen.`);
      assert(top + bottom <= 0.34 + Number.EPSILON, `${id}: Gesamt-Crop darf 0.34 nicht überschreiten.`);
      assert(images.length <= 1, `${id}: höchstens ein finales Bild erlaubt.`);
      if (images.length === 0) missingFinalImages += 1;
      else finalImageCount += 1;
    }

    if (hasRemotion) {
      assert(indexed?.type === 'animation', `${id}: scene-index-Typ muss animation sein.`);
      assert(indexed?.planFile?.endsWith('/remotion.md'), `${id}: planFile muss auf remotion.md zeigen.`);
      assert(images.length === 0, `${id}: Remotion-Szene darf keine Bilddatei enthalten.`);
    }
  });

  if (index.imageWorld?.referenceImageRequired === true && finalImageCount > 0) {
    assert(existsSync(resolve(root, index.imageWorld.referenceImageFile)), 'Bildwelt-Referenzbild fehlt, obwohl finale Bilder vorhanden sind.');
  }
}

if (errors.length) {
  console.error('\nReel-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-Quellen-, Image-World-, Timing- und Präsentationsvertrag erfüllt.');
console.log('  Image World V3 · kein leerer Hintergrund · Satzschnitte · contain · sichere Crops · Karaoke-Safe-Area');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
