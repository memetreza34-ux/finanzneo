#!/usr/bin/env node

import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ALL_PROMPTS,
  CAPTION_DIRECTORY,
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_STATE_MACHINE_ID,
  GENERATED_IMAGE_ASPECT_MARKER,
  GENERATED_IMAGE_ASPECT_RATIO,
  IMAGE_INBOX,
  PLATFORM_PUBLISHING_FILES,
  REEL_VIDEO_ASPECT_RATIO,
  SCENE_INDEX,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  SUBTITLE_MODE,
  WORLD_ID,
  WORLD_ID_MARKER,
} from './lib/reel-contract.mjs';
import {
  ANIMATION_QUALITY_LOCK,
  validatePhase3Executor,
  validateSceneShape,
} from './lib/reel-scene-schema.mjs';

const V9_WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const PURE_BLACK_CONTRACT = 'finanzneo-pure-black-background-v1';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const sceneRoot = resolve(root, '03-szenen/EINZELNE-SZENEN');
const indexPath = resolve(root, SCENE_INDEX);
const allPromptsPath = resolve(root, ALL_PROMPTS);
const worldPromptPath = resolve(root, '03-szenen/bildwelt.txt');
const coverPromptPath = resolve(root, '03-szenen/00-cover/cover.txt');
const imageInbox = resolve(root, IMAGE_INBOX);
const errors = [];
const notes = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (path) => readFileSync(path, 'utf8');

for (const path of [sceneRoot, indexPath, allPromptsPath, worldPromptPath, coverPromptPath, imageInbox]) {
  assert(existsSync(path), `Pflichtpfad fehlt: ${path}`);
}
assert(!existsSync(resolve(root, '03-szenen/alle-motionprompts.txt')), 'alle-motionprompts.txt ist verboten.');

const walkForbidden = (directory) => {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) walkForbidden(path);
    else if (entry.toLowerCase() === 'motionprompt.txt') errors.push(`Verbotene Datei: ${path}`);
    else if (entry.toLowerCase() === 'placeholder.svg' && path.startsWith(sceneRoot)) errors.push(`Platzhalter im Szenenordner verboten: ${path}`);
  }
};
walkForbidden(root);

if (!existsSync(indexPath)) {
  console.error('\nReel-Source-Vertrag verletzt:\n- 03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

let index;
try {
  index = JSON.parse(read(indexPath));
} catch (error) {
  console.error(`\nReel-Source-Vertrag verletzt:\n- scene-index.json ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const legacyImageWorld = index.imageWorld?.legacyAssetSet === true;
const directories = existsSync(sceneRoot)
  ? readdirSync(sceneRoot)
      .filter((entry) => /^scene-\d{2}$/.test(entry) && statSync(resolve(sceneRoot, entry)).isDirectory())
      .sort()
  : [];

assert(Array.isArray(index.scenes), 'scene-index.json benötigt scenes[].');
assert(scenes.length > 0, 'scene-index.json enthält keine Szenen.');
assert(Number(index.sceneCount) === scenes.length, 'sceneCount stimmt nicht mit scenes[] überein.');
assert(Number(index.sceneCount) === directories.length, 'sceneCount stimmt nicht mit den scene-XX-Ordnern überein.');
assert(index.video?.aspectRatio === REEL_VIDEO_ASPECT_RATIO, 'Reel-Videoformat muss 9:16 sein.');
assert(Number(index.video?.width) === 1080 && Number(index.video?.height) === 1920, 'Reel-Video muss 1080 × 1920 sein.');
assert(Number(index.video?.fps) === 30, 'Reel-Video muss 30 fps verwenden.');
assert(typeof index.cover?.googleFlowFileName === 'string' && index.cover.googleFlowFileName.trim(), 'cover.googleFlowFileName fehlt.');
assert(index.cover?.planFile === '03-szenen/00-cover/cover.txt', 'cover.planFile muss 03-szenen/00-cover/cover.txt sein.');
assert(index.cover?.aspectRatio === '1:1', 'Cover-Quellbild muss 1:1 sein.');

for (const error of validatePhase3Executor(index.phase3Executor)) errors.push(error);
for (const [position, scene] of scenes.entries()) {
  for (const error of validateSceneShape(scene, {index: position})) errors.push(error);
}

if (!legacyImageWorld) {
  const world = index.imageWorld ?? {};
  assert(world.id === WORLD_ID, `imageWorld.id muss ${WORLD_ID} sein.`);
  assert(world.seriesLockId === SERIES_LOCK_ID, `imageWorld.seriesLockId muss ${SERIES_LOCK_ID} sein.`);
  assert(world.premiumVisualWorldLockId === V9_WORLD_LOCK, `imageWorld.premiumVisualWorldLockId muss ${V9_WORLD_LOCK} sein.`);
  assert(world.animatedWorldLockId === V9_WORLD_LOCK, `imageWorld.animatedWorldLockId muss ${V9_WORLD_LOCK} sein.`);
  assert(world.physicalExplainerLockId === V9_WORLD_LOCK, `imageWorld.physicalExplainerLockId muss ${V9_WORLD_LOCK} sein.`);
  assert(world.generatedImageAspectRatio === GENERATED_IMAGE_ASPECT_RATIO, 'Google-Flow-Quellbilder müssen 1:1 sein.');
  assert(world.squareGeneratedImagesRequired === true, 'Quadratische Google-Flow-Quellbilder müssen verpflichtend sein.');
  assert(world.referencePromptFile === '03-szenen/bildwelt.txt', 'imageWorld.referencePromptFile ist falsch.');
  assert(world.styleReferenceStrategy === 'written-style-lock-only', 'Bildkonsistenz muss ausschließlich über den geschriebenen Style-Lock entstehen.');
  assert(world.referenceImageUse === 'forbidden', 'Bild-zu-Bild-/Cover-Referenzen müssen verboten sein.');
  assert(world.sameWorldAcrossSeriesRequired === true, 'Same-World-Lock muss über die Serie gelten.');
  assert(world.deepBlackBackgroundRequired === true, 'V9 verlangt deepBlackBackgroundRequired=true.');
  assert(world.cleanMinimalBackgroundRequired === true, 'V9 verlangt cleanMinimalBackgroundRequired=true.');
  assert(world.supportingObjectCountFlexible === true, 'V9 verlangt flexible Objektanzahl.');
  assert(world.supportingObjectsOnlyWhenHelpful === true, 'Support-Objekte dürfen nur bei echtem Erklärnutzen verwendet werden.');
  assert(world.clarityBeforeObjectCount === true, 'Klarheit muss vor Objektanzahl stehen.');
  assert(!('supportingObjectsMin' in world) && !('supportingObjectsMax' in world), 'Feste Supporting-Object-Min/Max-Werte sind in V9 verboten.');
  assert(world.dashboardCompositionForbidden === true, 'Dashboard-Komposition muss verboten sein.');
  assert(world.appUiCompositionForbidden === true, 'App-UI-Komposition muss verboten sein.');
  assert(world.flowchartMainCompositionForbidden === true, 'Flowchart-Hauptkomposition muss verboten sein.');
  assert(world.photorealismForbidden === true, 'Photorealismus muss verboten sein.');
  assert(world.productPhotoLookForbidden === true, 'Produktfoto-Look muss verboten sein.');
  assert(world.clutterForbidden === true, 'Clutter muss verboten sein.');
  assert(world.brandMarksRecognizableButStylizedRequired === true, 'Marken/Logos müssen erkennbar aber stilisiert sein.');
  assert(world.flatPastedRealLogoForbidden === true, 'Flach aufgeklebte Real-Logos müssen verboten sein.');
  assert(world.screenshotLikeBrandUiForbidden === true, 'Screenshot-artige Marken-UI muss verboten sein.');
}

const googleFlow = index.googleFlow ?? {};
assert(googleFlow.protocolId === FLOW_AGENT_PROTOCOL_ID, `googleFlow.protocolId muss ${FLOW_AGENT_PROTOCOL_ID} sein.`);
assert(googleFlow.executionModeId === FLOW_EXECUTION_MODE_ID, `googleFlow.executionModeId muss ${FLOW_EXECUTION_MODE_ID} sein.`);
assert(googleFlow.stateMachineId === FLOW_STATE_MACHINE_ID, `googleFlow.stateMachineId muss ${FLOW_STATE_MACHINE_ID} sein.`);
assert(googleFlow.generationMode === 'one-image-at-a-time', 'Google Flow muss one-image-at-a-time verwenden.');
assert(googleFlow.strictSequential === true, 'Google Flow muss strikt sequenziell arbeiten.');
assert(Number(googleFlow.maxConcurrentGenerations) === 1, 'Google Flow darf maximal einen laufenden Bildjob haben.');
assert(googleFlow.batchGenerationForbidden === true, 'Batch-Generierung muss verboten sein.');
assert(googleFlow.queueLaterImagesForbidden === true, 'Queueing späterer Bilder muss verboten sein.');
assert(googleFlow.waitForCurrentImage === true, 'Auf den aktuellen einzelnen Bildjob muss intern gewartet werden.');
assert(googleFlow.renameBeforeNext === true, 'Aktuelles Bild muss vor dem nächsten Bild umbenannt werden.');
assert(googleFlow.qaBeforeNext === true, 'Aktuelles Bild muss vor dem nächsten Bild QA bestehen.');
assert(googleFlow.retrySameImageOnFailure === true, 'Fehlerhaftes Bild muss unter derselben Nummer neu erzeugt werden.');
assert(googleFlow.finalCollectionDirectory === `${IMAGE_INBOX}/`, `Fertige Bilder müssen in ${IMAGE_INBOX}/ gesammelt werden.`);
assert(googleFlow.distributeToSceneFolders === false, 'Google Flow darf Bilder nicht selbst auf Szenenordner verteilen.');

const phase1Animation = index.phase1AnimationCode ?? {};
assert(phase1Animation.required === true, 'phase1AnimationCode.required muss true sein.');
assert(phase1Animation.qualityLock === ANIMATION_QUALITY_LOCK, `phase1AnimationCode.qualityLock muss ${ANIMATION_QUALITY_LOCK} sein.`);
assert(phase1Animation.phase3MayNotReplaceCanonicalAnimation === true, 'Phase 3 darf kanonischen Phase-1-Animationscode nicht ersetzen.');
assert(phase1Animation.pureBlackCanvasRequired === true, 'Animationen müssen den Pure-Black-Canvas-Vertrag erben.');
assert(phase1Animation.transparentAnimationStageRequired === true, 'PremiumPhysicalStage muss transparent bleiben.');
assert(phase1Animation.decorativeBackgroundEffectsForbidden === true, 'Dekorative Animations-Hintergründe müssen verboten sein.');

const phase3 = index.phase3CompletionContract ?? {};
assert(phase3.reelBackgroundContractId === PURE_BLACK_CONTRACT, `Phase 3 braucht ${PURE_BLACK_CONTRACT}.`);
assert(phase3.pureBlackBackgroundRequired === true, 'Phase 3 muss statischen Pure-Black-Hintergrund erzwingen.');
assert(phase3.blackOrEmptyVisualMustFail === true, 'Schwarze/leere Szenen müssen Phase 3 blockieren.');
assert(phase3.backgroundMotionDoesNotCountAsAnimation === true, 'Background-Motion darf nicht als Animation zählen.');
assert(phase3.captionOnlySceneForbidden === true, 'Caption-only-Szenen müssen verboten sein.');
assert(phase3.postRenderVisualQaRequired === true, 'Post-Render-Visual-QA muss Pflicht sein.');

const presentation = index.imagePresentationContract ?? {};
assert(presentation.imageFit === 'contain', 'Bilder müssen contain verwenden.');
assert(Number(presentation.maxIntentionalImageScale) <= 1.04, 'Bildskalierung darf 1.04 nicht überschreiten.');
assert(Number(presentation.maxSourceCropPerSide) <= 0.2, 'Source-Crop pro Seite darf 0.20 nicht überschreiten.');
assert(Number(presentation.maxSourceCropTotal) <= 0.34, 'Gesamt-Crop darf 0.34 nicht überschreiten.');
assert(presentation.blurredImageBackgroundForbidden === true, 'Unscharfe Bildkopie als Hintergrund muss verboten sein.');
assert(Number(index.audio?.targetIntegratedLufs) === -16, 'Audioziel muss -16 LUFS sein.');
assert(Number(index.audio?.targetTruePeakDbtp) === -1, 'True-Peak-Ziel muss -1 dBTP sein.');
assert(index.timelineRules?.cutsFollowSentenceStarts === true || index.timelineRules?.cutsFollowSentenceStartsAndMeaningfulPhraseStarts === true, 'Szenenschnitte müssen echten Satz-/Phrasenanfängen folgen.');
assert(index.timelineRules?.equalLengthScenesForbiddenByDefault === true, 'Starre gleich lange Szenen müssen standardmäßig verboten sein.');

for (const [key, expectedPath] of Object.entries(PLATFORM_PUBLISHING_FILES)) {
  assert(index.platformPublishing?.[key] === expectedPath, `platformPublishing.${key} muss ${expectedPath} sein.`);
  assert(existsSync(resolve(root, expectedPath)), `Plattformdatei fehlt: ${expectedPath}`);
}
assert(index.platformPublishing?.directory === CAPTION_DIRECTORY, `platformPublishing.directory muss ${CAPTION_DIRECTORY} sein.`);

const timingPath = resolve(root, index.timelineRules?.timingSource ?? '04-caption/word-timings.json');
assert(existsSync(timingPath), `Worttiming-Datei fehlt: ${timingPath}`);
if (existsSync(timingPath)) {
  try {
    const timing = JSON.parse(read(timingPath));
    assert(timing.subtitleMode === SUBTITLE_MODE, `word-timings.subtitleMode muss ${SUBTITLE_MODE} sein.`);
    assert(timing.activeWordColor === ACTIVE_WORD_COLOR, `word-timings.activeWordColor muss ${ACTIVE_WORD_COLOR} sein.`);
    assert(Array.isArray(timing.words), 'word-timings.json benötigt words[].');
    assert(Array.isArray(timing.sentences), 'word-timings.json benötigt sentences[].');
  } catch (error) {
    errors.push(`word-timings.json ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const promptFiles = [
  ['Master-Prompt', allPromptsPath],
  ['Bildwelt', worldPromptPath],
  ['Cover', coverPromptPath],
];
for (const scene of scenes.filter((scene) => scene?.type === 'image')) {
  const relativePlan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  promptFiles.push([scene.id, resolve(root, '03-szenen', relativePlan)]);
}

for (const [label, path] of promptFiles) {
  assert(existsSync(path), `${label}: Promptdatei fehlt: ${path}`);
  if (!existsSync(path)) continue;
  const source = read(path);
  const lower = source.toLowerCase();
  assert(source.includes(WORLD_ID_MARKER), `${label}: ${WORLD_ID_MARKER} fehlt.`);
  assert(source.includes(SERIES_LOCK_MARKER), `${label}: ${SERIES_LOCK_MARKER} fehlt.`);
  assert(source.includes(GENERATED_IMAGE_ASPECT_MARKER), `${label}: ${GENERATED_IMAGE_ASPECT_MARKER} fehlt.`);
  assert(source.includes(`PREMIUM_VISUAL_WORLD_LOCK: ${V9_WORLD_LOCK}`), `${label}: V9-Visual-Lock fehlt.`);
  assert(lower.includes('deep black background'), `${label}: deep-black Background-Pflicht fehlt.`);
  assert(!lower.includes('deep charcoal green-black background'), `${label}: alter green-black Background ist noch aktiv.`);
  assert(!/\b(?:2|3)[–-](?:4|5|6)\s+(?:supporting|unterstützende)/i.test(source), `${label}: feste Supporting-Object-Anzahl ist verboten.`);
}

if (existsSync(allPromptsPath)) {
  const master = read(allPromptsPath);
  assert(master.includes(FLOW_AGENT_PROTOCOL_MARKER), 'Master-Prompt enthält das Flow-Agent-Protokoll nicht.');
  assert(master.includes(`FLOW_EXECUTION_MODE: ${FLOW_EXECUTION_MODE_ID}`), 'Master-Prompt enthält Strict-Single-Job V3 nicht.');
  assert(master.includes(`FLOW_STATE_MACHINE: ${FLOW_STATE_MACHINE_ID}`), 'Master-Prompt enthält die Flow-State-Machine nicht.');
  assert(/MAX_CONCURRENT_GENERATIONS\s*=\s*1/.test(master) || /CONCURRENCY\s*=\s*1/.test(master), 'Master-Prompt begrenzt die Bildgenerierung nicht auf concurrency=1.');
  assert(master.includes('00-ALLE-BILDER-HIER-REIN'), 'Master-Prompt nennt den finalen Bilderordner nicht.');
}

if (existsSync(coverPromptPath) && typeof index.cover?.googleFlowFileName === 'string') {
  assert(read(coverPromptPath).includes(index.cover.googleFlowFileName), 'Cover-Prompt enthält nicht den exakten cover.googleFlowFileName.');
}

for (const scene of scenes) {
  const id = scene.id ?? 'unbekannte Szene';
  const directory = resolve(sceneRoot, id);
  assert(existsSync(directory), `${id}: Szenenordner fehlt.`);
  if (!existsSync(directory)) continue;
  assert(existsSync(resolve(directory, 'szene.md')), `${id}: szene.md fehlt.`);

  if (scene.type === 'image') {
    const promptPath = resolve(root, '03-szenen', String(scene.planFile ?? '').replace(/^03-szenen\//, ''));
    assert(existsSync(promptPath), `${id}: bildprompt.txt fehlt.`);
    if (existsSync(promptPath)) {
      const prompt = read(promptPath);
      assert(prompt.includes(scene.googleFlowFileName), `${id}: Bildprompt enthält nicht den exakten googleFlowFileName.`);
    }
  }

  if (scene.type === 'animation') {
    const remotionPath = resolve(root, '03-szenen', String(scene.planFile ?? '').replace(/^03-szenen\//, ''));
    const animationPath = resolve(root, '03-szenen', String(scene.animationSourceFile ?? '').replace(/^03-szenen\//, ''));
    assert(existsSync(remotionPath), `${id}: remotion.md fehlt.`);
    assert(existsSync(animationPath), `${id}: kanonische animation.tsx fehlt.`);
  }
}

for (const relativePath of [
  '01-script/script-fliess-text.txt',
  '05-projektdateien/recherche-quellen.md',
  '05-projektdateien/szenenplan.md',
  '05-projektdateien/animationen.md',
]) assert(existsSync(resolve(root, relativePath)), `Pflichtdatei fehlt: ${relativePath}`);

if (legacyImageWorld) notes.push('Legacy-Bildwelt erkannt: nur Strukturvertrag geprüft; V9-Migration wird nicht rückwirkend erzwungen.');
else notes.push(`V9-Bildwelt geprüft: ${V9_WORLD_LOCK} · deep black · flexible Objektanzahl.`);
notes.push(`Google Flow geprüft: ${FLOW_EXECUTION_MODE_ID} · concurrency=1.`);
notes.push(`Phase 3 geprüft: ${PURE_BLACK_CONTRACT} · leere/schwarze Visuals müssen scheitern.`);

if (errors.length) {
  console.error('\nReel-Source-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-Source-Vertrag erfüllt.');
notes.forEach((note) => console.log(`✓ ${note}`));
