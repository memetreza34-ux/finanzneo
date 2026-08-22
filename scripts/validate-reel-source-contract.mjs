#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ALL_PROMPTS,
  CAPTION_DIRECTORY,
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  GENERATED_IMAGE_ASPECT_MARKER,
  GENERATED_IMAGE_ASPECT_RATIO,
  IMAGE_INBOX,
  PLATFORM_PUBLISHING_FILES,
  REEL_CAPTION,
  REEL_FINAL_EXPORT,
  REEL_LAYOUT,
  REEL_VISUAL_MIX,
  SCENE_INDEX,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  SUBTITLE_MODE,
  REEL_VIDEO_ASPECT_RATIO,
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

const containsWrongGeneratedImageRatio = (text) => {
  const lower = text.toLowerCase();
  return lower.includes('vertical 9:16 image') || lower.includes('portrait 9:16') || lower.includes('9:16 source image');
};

if (existsSync(sceneRoot) && existsSync(indexPath)) {
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const legacyImageWorld = index.imageWorld?.legacyAssetSet === true;
  const directories = readdirSync(sceneRoot)
    .filter((entry) => /^scene-\d{2}$/.test(entry) && statSync(resolve(sceneRoot, entry)).isDirectory())
    .sort();

  assert(Array.isArray(index.scenes), 'scene-index.json benötigt scenes[].');
  assert(typeof index.cover?.googleFlowFileName === 'string' && index.cover.googleFlowFileName.trim(), 'scene-index.json benötigt cover.googleFlowFileName.');
  assert(index.cover?.planFile === '03-szenen/00-cover/cover.txt', 'cover.planFile muss auf 03-szenen/00-cover/cover.txt zeigen.');
  assert(index.cover?.type === 'image-with-remotion-text', 'Cover muss Bild und verlässlichen Remotion-Text kombinieren.');
  for (const field of ['headline', 'accentLine', 'payoff']) {
    assert(typeof index.cover?.overlay?.[field] === 'string' && index.cover.overlay[field].trim(), `cover.overlay.${field} fehlt.`);
  }
  assert(index.sceneCount === directories.length, 'sceneCount stimmt nicht mit den Szenenordnern überein.');
  assert(index.video?.aspectRatio === REEL_VIDEO_ASPECT_RATIO, 'Reel-Videoformat muss 9:16 sein.');
  assert(Number(index.video?.width) === 1080 && Number(index.video?.height) === 1920, 'Reel-Video muss 1080 × 1920 verwenden.');
  assert(index.imageWorld?.id === WORLD_ID, 'FinanzNeo Image World ID fehlt.');
  assert(index.imageWorld?.generatedImageAspectRatio === GENERATED_IMAGE_ASPECT_RATIO, 'Google-Flow-Quellbilder müssen 1:1 sein.');
  assert(index.imageWorld?.squareGeneratedImagesRequired === true, 'Quadratische Google-Flow-Bilder müssen verpflichtend sein.');
  assert(index.imageWorld?.seriesLockId === SERIES_LOCK_ID, 'FinanzNeo Same-World-Serien-Lock fehlt.');
  assert(index.imageWorld?.sameWorldAcrossSeriesRequired === true, 'Dieselbe Bildwelt muss für die gesamte Serie vorgeschrieben sein.');
  assert(index.imageWorld?.styleReferenceStrategy === 'approved-cover-style-only', 'Das freigegebene Cover muss als reine Stilreferenz für Folgebilder dienen.');
  assert(index.imageWorld?.referencePromptFile === '03-szenen/bildwelt.txt', 'referencePromptFile ist falsch.');
  assert(index.googleFlow?.protocolId === FLOW_AGENT_PROTOCOL_ID, 'Google-Flow-Agent-Protokoll fehlt.');
  assert(index.googleFlow?.generationMode === 'one-image-at-a-time', 'Google Flow muss Bild für Bild arbeiten.');
  assert(index.googleFlow?.strictSequential === true, 'Google Flow muss strikt sequenziell arbeiten.');
  assert(index.googleFlow?.waitForCurrentImage === true, 'Google Flow muss die aktuelle Bilderzeugung vollständig abwarten.');
  assert(index.googleFlow?.renameBeforeNext === true, 'Google Flow muss jedes Bild vor dem nächsten Bild umbenennen.');
  assert(index.googleFlow?.qaBeforeNext === true, 'Google Flow muss jedes Bild vor dem nächsten Bild prüfen.');
  assert(index.googleFlow?.retrySameImageOnFailure === true, 'Google Flow muss fehlerhafte Bilder unter derselben Nummer neu erzeugen.');
  assert(index.googleFlow?.finalCollectionDirectory === `${IMAGE_INBOX}/`, 'Google Flow muss alle fertigen Bilder im gemeinsamen Bilderordner sammeln.');
  assert(index.googleFlow?.distributeToSceneFolders === false, 'Google Flow darf Bilder nicht auf Szenenordner verteilen.');
  assert(index.timelineRules?.cutsFollowSentenceStarts === true, 'Szenenschnitte müssen Satzanfängen folgen.');
  assert(index.timelineRules?.equalLengthScenesForbiddenByDefault === true, 'Starre gleich lange Szenen müssen standardmäßig verboten sein.');
  assert(JSON.stringify(index.layout) === JSON.stringify(REEL_LAYOUT), 'Layout muss exakt src/brand/reel-contract.json entsprechen.');
  assert(JSON.stringify(index.finalExport) === JSON.stringify(REEL_FINAL_EXPORT), 'Finaler Export muss exakt dem zentralen Reel-Vertrag entsprechen.');
  assert(existsSync(resolve(root, REEL_FINAL_EXPORT.directory)), `${REEL_FINAL_EXPORT.directory} fehlt.`);

  const animationCount = Array.isArray(index.scenes)
    ? index.scenes.filter((scene) => scene?.type === 'animation').length
    : 0;
  const animationShare = index.scenes?.length ? animationCount / index.scenes.length : 0;
  assert(index.visualMix?.strategy === REEL_VISUAL_MIX.strategy, `Visualmix muss ${REEL_VISUAL_MIX.strategy} sein.`);
  assert(Number(index.visualMix?.preferredAnimationShare) === REEL_VISUAL_MIX.preferredAnimationShare, 'Bevorzugter Animationsanteil muss dem zentralen Vertrag entsprechen.');
  assert(Math.abs(Number(index.visualMix?.actualAnimationShare) - Number(animationShare.toFixed(2))) <= 0.001, 'actualAnimationShare stimmt nicht mit den Szenentypen überein.');
  if (animationShare < REEL_VISUAL_MIX.minimumAnimationShare) {
    assert(typeof index.visualMix?.exceptionRationale === 'string' && index.visualMix.exceptionRationale.trim(), 'Ein Animationsanteil unter dem Minimum benötigt eine Begründung.');
  }

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
    assert(index.imageWorld?.objectLabelsOnly === true, 'KI-Bilder dürfen nur kurze Objektlabels als Text enthalten.');
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

  assert(index.subtitleDisplay?.mode === REEL_CAPTION.mode, 'Untertitelmodus widerspricht dem zentralen Vertrag.');
  assert(index.subtitleDisplay?.activeWordColor === REEL_CAPTION.activeWordColor, 'Aktives Untertitelwort muss FinanzNeo-grün sein.');
  assert(Number(index.subtitleDisplay?.maxWords) === REEL_CAPTION.maxWords, 'Maximale Wörter pro Untertitelsatz sind falsch.');
  assert(Number(index.subtitleDisplay?.maxCharacters) === REEL_CAPTION.maxCharacters, 'Maximale Zeichen pro Untertitelsatz sind falsch.');
  assert(Number(index.subtitleDisplay?.maxLines) === REEL_CAPTION.maxLines, 'Untertitel müssen auf zwei Zeilen begrenzt sein.');
  assert(index.subtitleDisplay?.noDeadGaps === true && index.subtitleDisplay?.holdDuringPauses === true, 'Leere Caption-Lücken sind verboten.');
  assert(index.subtitleDisplay?.noWordJump === true && index.subtitleDisplay?.noWordScale === true, 'Springende oder skalierende Untertitelwörter sind verboten.');

  const timingPath = resolve(root, index.timelineRules?.timingSource ?? '04-caption/word-timings.json');
  assert(existsSync(timingPath), `Worttiming-Datei fehlt: ${timingPath}`);
  if (existsSync(timingPath)) {
    const timing = JSON.parse(readFileSync(timingPath, 'utf8'));
    assert(timing.subtitleMode === SUBTITLE_MODE, 'Worttiming-Datei hat falschen subtitleMode.');
    assert(timing.activeWordColor === ACTIVE_WORD_COLOR, `Aktive Wortfarbe muss ${ACTIVE_WORD_COLOR} sein.`);
    assert(Array.isArray(timing.words), 'Worttiming-Datei benötigt words[].');
    assert(Array.isArray(timing.sentences), 'Worttiming-Datei benötigt sentences[].');
  }

  const allPrompts = existsSync(allPromptsPath) ? readFileSync(allPromptsPath, 'utf8') : '';
  const coverPromptPath = resolve(root, '03-szenen/00-cover/cover.txt');
  const coverPrompt = existsSync(coverPromptPath) ? readFileSync(coverPromptPath, 'utf8') : '';
  const worldPromptPath = resolve(root, '03-szenen/bildwelt.txt');
  const worldPrompt = existsSync(worldPromptPath) ? readFileSync(worldPromptPath, 'utf8') : '';
  assert(allPrompts.includes(WORLD_ID_MARKER), 'alle-bildprompts.txt verwendet nicht die FinanzNeo World ID.');
  assert(allPrompts.includes(GENERATED_IMAGE_ASPECT_MARKER), 'alle-bildprompts.txt schreibt das quadratische 1:1-Bildformat nicht vor.');
  assert(allPrompts.includes(SERIES_LOCK_MARKER), 'alle-bildprompts.txt enthält keinen verbindlichen Same-World-Lock.');
  assert(allPrompts.includes(FLOW_AGENT_PROTOCOL_MARKER), 'alle-bildprompts.txt enthält kein striktes Google-Flow-Agent-Protokoll.');

  if (!legacyImageWorld) {
    assert(coverPrompt.includes(index.cover?.googleFlowFileName ?? ''), 'Cover-Prompt und scene-index verwenden nicht denselben Google-Flow-Dateinamen.');
    assert(coverPrompt.includes(GENERATED_IMAGE_ASPECT_MARKER), 'Cover-Prompt schreibt 1:1 nicht vor.');
    assert(coverPrompt.includes('square 1:1 source image'), 'Cover muss ein quadratisches 1:1-Quellbild sein.');
    assert(!containsWrongGeneratedImageRatio(coverPrompt), 'Cover-Prompt verlangt fälschlich 9:16 statt 1:1.');
    assert(worldPrompt.includes(GENERATED_IMAGE_ASPECT_MARKER), 'bildwelt.txt schreibt 1:1 nicht vor.');
    assert(worldPrompt.includes('square 1:1 source image'), 'bildwelt.txt definiert kein quadratisches 1:1-Quellbild.');
    assert(allPrompts.includes('ONE single seamless continuous deep charcoal green-black background'), 'alle-bildprompts.txt fordert keinen nahtlosen Einzelhintergrund.');
    assert(!containsObsoleteZoning(allPrompts), 'alle-bildprompts.txt enthält verbotene Prozent-Zonen.');
    assert(!containsWrongGeneratedImageRatio(allPrompts), 'alle-bildprompts.txt verlangt fälschlich ein 9:16-Quellbild statt 1:1.');
    assert(allPrompts.includes('square 1:1 source image'), 'alle-bildprompts.txt verlangt kein quadratisches 1:1-Quellbild.');
    assert(allPrompts.includes('No headline') || allPrompts.includes('No headline.'), 'alle-bildprompts.txt verbietet generierte Headlines nicht.');
    assert(allPrompts.includes('short German object labels') || allPrompts.includes('kurzen deutschen') || allPrompts.includes('kurze deutsche'), 'alle-bildprompts.txt definiert kurze deutsche Objektlabels nicht.');
    assert(allPrompts.includes('00-ALLE-BILDER-HIER-REIN'), `Finaler gemeinsamer Bilderordner fehlt in ${ALL_PROMPTS}.`);
    assert(allPrompts.includes('Erzeuge GENAU EIN Bild'), 'Google-Flow-Agent muss exakt ein Bild pro Schritt erzeugen.');
    assert(allPrompts.includes('Benenne es SOFORT exakt'), 'Sofortige Umbenennung vor dem nächsten Bild fehlt.');
    assert(allPrompts.includes('Erzeuge DIESELBE Bildnummer neu'), 'Wiederholungsregel für fehlerhafte Bilder fehlt.');
    assert(allPrompts.includes('verbindliche visuelle Stilreferenz'), 'Das Cover wird nicht als verbindliche Stilreferenz festgelegt.');
    assert(allPrompts.includes('Übernimm NICHT Motiv, Komposition oder Labels des Covers'), 'Folgebilder grenzen Stilreferenz und Cover-Inhalt nicht sauber ab.');
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
        assert(typeof indexed?.googleFlowFileName === 'string' && indexed.googleFlowFileName.trim(), `${id}: googleFlowFileName fehlt.`);
        assert(prompt.includes(FLOW_AGENT_PROTOCOL_MARKER), `${id}: striktes Google-Flow-Agent-Protokoll fehlt.`);
        assert(prompt.includes(SERIES_LOCK_MARKER), `${id}: Same-World-Lock fehlt.`);
        assert(prompt.includes(GENERATED_IMAGE_ASPECT_MARKER), `${id}: 1:1-Format-Lock fehlt.`);
        assert(prompt.includes('square 1:1 source image'), `${id}: Google-Flow-Quellbild muss quadratisch sein.`);
        assert(!containsWrongGeneratedImageRatio(prompt), `${id}: Prompt verlangt fälschlich 9:16 statt 1:1.`);
        assert(prompt.split(WORLD_ID_MARKER).length - 1 === 1, `${id}: Bildstilblock muss exakt einmal vorkommen.`);
        assert(prompt.includes('GOOGLE FLOW – FINALER DATEINAME:'), `${id}: finaler Google-Flow-Dateiname fehlt direkt am Prompt.`);
        assert(prompt.includes(indexed?.googleFlowFileName ?? ''), `${id}: Prompt und scene-index verwenden nicht denselben Google-Flow-Dateinamen.`);
        assert(prompt.includes('ONE single seamless continuous deep charcoal green-black background'), `${id}: nahtloser Einzelhintergrund fehlt.`);
        assert(!containsObsoleteZoning(prompt), `${id}: Prompt enthält verbotene Prozent-Zonen.`);
        assert(prompt.toLowerCase().includes('no headline'), `${id}: große generierte Headline ist nicht verboten.`);
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
      for (const field of ['visualMetaphor', 'startState', 'action', 'endState']) {
        assert(typeof indexed?.[field] === 'string' && indexed[field].trim(), `${id}: ${field} fehlt.`);
      }
      const specification = readFileSync(resolve(directory, 'remotion.md'), 'utf8');
      assert(specification.includes('Visuelle Metapher'), `${id}: Remotion-Spezifikation benötigt eine visuelle Metapher.`);
      assert(specification.includes('Startzustand'), `${id}: Remotion-Spezifikation benötigt einen Startzustand.`);
      assert(specification.includes('Handlung/Mechanismus'), `${id}: Remotion-Spezifikation benötigt eine sichtbare Handlung.`);
      assert(specification.includes('Endzustand'), `${id}: Remotion-Spezifikation benötigt einen Endzustand.`);
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

console.log('\n✓ Reel-Quellen-, Bildwelt-, Timing-, Publishing-, Präsentations- und Exportvertrag erfüllt.');
console.log('  Neue Reels: nahtloser Hintergrund · sichtbares Gesicht bei Personen · kurze deutsche Objektlabels · Master-Caption + 4 Plattformdateien · finaler Video-/Cover-Export');
if (missingFinalImages > 0) console.log(`  Hinweis: ${missingFinalImages} finale Bilddateien fehlen noch.`);
