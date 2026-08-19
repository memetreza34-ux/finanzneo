#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  HEADLINE_MARKERS,
  ALL_PROMPTS,
  CAPTION_DIRECTORY,
  IMAGE_INBOX,
  PLATFORM_PUBLISHING_FILES,
  SCENE_INDEX,
  SUBTITLE_MODE,
  WORLD_ID,
  WORLD_ID_MARKER,
} from './lib/reel-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const sceneRoot = resolve(root, '03-szenen/EINZELNE-SZENEN');
const indexPath = resolve(root, SCENE_INDEX);
const allPromptsPath = resolve(root, ALL_PROMPTS);
const imageInbox = resolve(root, IMAGE_INBOX);
const errors = [];
let missingFinalImages = 0;
let finalImageCount = 0;
const assert = (condition, message) => { if (!condition) errors.push(message); };
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);

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

const containsObsoleteZoning = (text) => {
  const lower = text.toLowerCase();
  return [
    'top 15 percent',
    'top 15%',
    'bottom 25 percent',
    'bottom 25%',
    'middle 60 percent',
    'middle 60%',
    'central 64 percent',
  ].some((needle) => lower.includes(needle));
};

if (existsSync(sceneRoot) && existsSync(indexPath)) {
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const legacyImageWorld = index.imageWorld?.legacyAssetSet === true;
  const directories = readdirSync(sceneRoot)
    .filter((entry) => /^scene-\d{2}$/.test(entry) && statSync(resolve(sceneRoot, entry)).isDirectory())
    .sort();

  assert(Array.isArray(index.scenes), 'scene-index.json benötigt scenes[].');
  assert(index.sceneCount === directories.length, 'sceneCount stimmt nicht mit den Szenenordnern überein.');
  assert(index.imageWorld?.id === WORLD_ID, 'FinanzNeo Image World ID fehlt.');
  assert(index.imageWorld?.referencePromptFile === '03-szenen/bildwelt.txt', 'referencePromptFile ist falsch.');
  assert(index.timelineRules?.cutsFollowSentenceStarts === true, 'Szenenschnitte müssen Satzanfängen folgen.');
  assert(index.timelineRules?.equalLengthScenesForbiddenByDefault === true, 'Starre gleich lange Szenen müssen standardmäßig verboten sein.');

  if (legacyImageWorld) {
    assert(index.imageWorld?.noEmptyBackground === true, 'Legacy-Reel: leere Hintergründe müssen verboten sein.');
    assert(index.imageWorld?.backgroundFill === 'finanzneo-world-stage-v3', 'Legacy-Reel: alte Remotion-Studiobühne fehlt.');
  } else {
    assert(index.imageWorld?.seamlessSingleBackgroundRequired === true, 'Ein nahtloser Hintergrund muss verbindlich sein.');
    assert(index.imageWorld?.percentageZonesForbidden === true, 'Prozent-Zonen müssen ausdrücklich verboten sein.');
    assert(index.imageWorld?.backgroundBandsForbidden === true, 'Hintergrundbänder müssen verboten sein.');
    assert(index.imageWorld?.floorWallBoundaryForbidden === true, 'Boden-Wand-Grenzen müssen verboten sein.');
    assert(index.imageWorld?.horizonLineForbidden === true, 'Horizontlinien müssen verboten sein.');
    assert(index.imageWorld?.visibleFaceRequiredWhenPersonPresent === true, 'Bei Personen muss ein sichtbares Gesicht vorgeschrieben sein.');
    assert(index.imageWorld?.bakedHeadlineRequired === true, 'KI-Bilder müssen eine eingebrannte Headline tragen (CLAUDE.md 6.4).');
    assert(index.imageWorld?.bakedSublineRequired === true, 'KI-Bilder müssen eine eingebrannte Subline tragen (CLAUDE.md 6.4).');
    assert(index.imageWorld?.bakedTextZone === 'upper-third', 'Headline und Subline müssen im oberen Bilddrittel liegen, sonst kollidieren sie mit den Untertiteln.');
    assert(index.imageWorld?.headlinesInGeneratedImagesForbidden !== true, 'scene-index.json verbietet Headlines noch nach der alten Regel.');
    assert(existsSync(imageInbox), `${IMAGE_INBOX} fehlt.`);

    const publishing = index.platformPublishing;
    assert(publishing?.directory === CAPTION_DIRECTORY, `Plattform-Publishing muss direkt in ${CAPTION_DIRECTORY} liegen.`);

    const publishingFiles = PLATFORM_PUBLISHING_FILES;

    for (const [key, expectedPath] of Object.entries(publishingFiles)) {
      assert(publishing?.[key] === expectedPath, `platformPublishing.${key} muss auf ${expectedPath} zeigen.`);
      assert(existsSync(resolve(root, expectedPath)), `Plattformdatei fehlt: ${expectedPath}`);
    }
  }

  const presentationContract = index.imagePresentationContract;
  assert(presentationContract?.imageFit === 'contain', 'Vordergrundbilder müssen contain verwenden.');
  assert(Number(presentationContract?.maxIntentionalImageScale) <= 1.04, 'Bildskalierung darf 1.04 nicht überschreiten.');
  assert(Number(presentationContract?.maxSourceCropPerSide) <= 0.2, 'Source-Crop pro Seite darf 0.20 nicht überschreiten.');
  assert(Number(presentationContract?.maxSourceCropTotal) <= 0.34, 'Gesamt-Crop darf 0.34 nicht überschreiten.');
  assert(presentationContract?.blurredImageBackgroundForbidden === true, 'Unscharfe Bildkopien als Hintergrund müssen verboten sein.');
  assert(Number(index.audio?.targetIntegratedLufs) === -16, 'Audioziel muss ungefähr -16 LUFS sein.');
  assert(Number(index.audio?.targetTruePeakDbtp) === -1, 'True-Peak-Ziel muss -1 dBTP sein.');

  if (index.subtitleDisplay) {
    assert(index.subtitleDisplay.maxLines === 2, 'Untertitel müssen auf zwei Zeilen begrenzt sein.');
    assert(index.subtitleDisplay.noDeadGaps === true && index.subtitleDisplay.holdDuringPauses === true, 'Leere Caption-Lücken sind verboten.');
  }
  if (index.layout) {
    assert(Number(index.layout.subtitleBottom) >= 250, 'Untertitel liegen zu tief in der Plattform-Totzone.');
  }

  const timingPath = resolve(root, index.timelineRules?.timingSource ?? '04-caption/word-timings.json');
  assert(existsSync(timingPath), `Worttiming-Datei fehlt: ${timingPath}`);
  if (existsSync(timingPath)) {
    const timing = JSON.parse(readFileSync(timingPath, 'utf8'));
    assert(timing.subtitleMode === SUBTITLE_MODE, 'Worttiming-Datei hat falschen subtitleMode.');
    assert(timing.activeWordColor === ACTIVE_WORD_COLOR, `Aktive Wortfarbe muss ${ACTIVE_WORD_COLOR} sein.`);
    assert(Array.isArray(timing.sentences), 'Worttiming-Datei benötigt sentences[].');
  }

  const allPrompts = existsSync(allPromptsPath) ? readFileSync(allPromptsPath, 'utf8') : '';
  assert(allPrompts.includes(WORLD_ID_MARKER), 'alle-bildprompts.txt verwendet nicht die FinanzNeo World ID.');

  if (!legacyImageWorld) {
    assert(allPrompts.includes('ONE single seamless continuous deep charcoal green-black background'), 'alle-bildprompts.txt fordert keinen nahtlosen Einzelhintergrund.');
    assert(!containsObsoleteZoning(allPrompts), 'alle-bildprompts.txt enthält verbotene Prozent-Zonen.');
    assert(HEADLINE_MARKERS.some((marker) => allPrompts.includes(marker)), 'alle-bildprompts.txt fordert keine eingebrannte Headline + Subline.');
    assert(!allPrompts.includes('No headline'), 'alle-bildprompts.txt verbietet Headlines noch nach der alten Regel. Bilder tragen jetzt Headline + Subline (siehe CLAUDE.md 6.4).');
    assert(allPrompts.includes('short German object labels') || allPrompts.includes('kurzen deutschen') || allPrompts.includes('kurze deutsche'), 'alle-bildprompts.txt definiert kurze deutsche Objektlabels nicht.');
    assert(allPrompts.includes('00-ALLE-BILDER-HIER-REIN'), `Finaler gemeinsamer Bilderordner fehlt in ${ALL_PROMPTS}.`);
  }

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
    assert(!Object.prototype.hasOwnProperty.call(indexed ?? {}, 'motionPrompt'), `${id}: motionPrompt-Feld ist verboten.`);
    assert(!existsSync(resolve(directory, 'placeholder.svg')), `${id}: placeholder.svg ist im Szenenordner verboten.`);

    if (hasImagePrompt) {
      assert(indexed?.type === 'image', `${id}: scene-index-Typ muss image sein.`);
      assert(indexed?.planFile?.endsWith('/bildprompt.txt'), `${id}: planFile muss auf bildprompt.txt zeigen.`);
      assert(typeof indexed?.expectedVisual === 'string' && indexed.expectedVisual.trim(), `${id}: expectedVisual fehlt.`);
      const prompt = readFileSync(resolve(directory, 'bildprompt.txt'), 'utf8');

      if (legacyImageWorld) {
        assert(prompt.includes(WORLD_ID_MARKER), `${id}: Legacy-World-ID fehlt.`);
      } else {
        assert(prompt.includes('GOOGLE FLOW – FINALER DATEINAME:'), `${id}: finaler Google-Flow-Dateiname fehlt direkt am Prompt.`);
        assert(prompt.includes('ONE single seamless continuous deep charcoal green-black background'), `${id}: nahtloser Einzelhintergrund fehlt.`);
        assert(!containsObsoleteZoning(prompt), `${id}: Prompt enthält verbotene Prozent-Zonen.`);
        assert(HEADLINE_MARKERS.some((marker) => prompt.includes(marker)), `${id}: eingebrannte Headline + Subline fehlt im Prompt.`);
        assert(!prompt.toLowerCase().includes('no headline'), `${id}: Prompt verbietet Headlines noch nach der alten Regel.`);
        assert(prompt.toLowerCase().includes('face') || prompt.toLowerCase().includes('gesicht'), `${id}: Gesichtsregel fehlt.`);
      }

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

console.log('\n✓ Reel-Quellen-, Bildwelt-, Timing-, Publishing- und Präsentationsvertrag erfüllt.');
console.log('  Neue Reels: nahtloser Hintergrund · Headline + Subline im Bild · sichtbares Gesicht bei Personen · 5 Plattformdateien');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
