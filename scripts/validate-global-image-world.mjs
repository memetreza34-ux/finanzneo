#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';

const LOCK_PATH = 'config/finanzneo-image-world-lock.json';
const WORLD_PATH = 'config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt';
const EXPECTED_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const EXPECTED_BASE_WORLD = 'finanzneo-connected-studio-v3';
const EXPECTED_SERIES = 'finanzneo-same-world-v1';
const EXPECTED_FLOW_MODE = 'finanzneo-flow-strict-single-job-v3';
const EXPECTED_FLOW_STATE_MACHINE = 'finanzneo-flow-state-machine-v1';

const errors = [];
const fail = (message) => errors.push(message);
const read = (path) => readFileSync(path, 'utf8');

for (const path of [LOCK_PATH, WORLD_PATH]) {
  if (!existsSync(path)) fail(`Pflichtdatei fehlt: ${path}`);
}

let lock = null;
if (existsSync(LOCK_PATH)) {
  try {
    lock = JSON.parse(read(LOCK_PATH));
  } catch (error) {
    fail(`${LOCK_PATH} ist kein gültiges JSON: ${error.message}`);
  }
}

if (lock) {
  if (lock.locked !== true) fail('globaler Image-World-Lock muss locked=true bleiben.');
  if (lock.integrationMode !== 'reel-system-v9-animated-black-world') fail('integrationMode muss reel-system-v9-animated-black-world sein.');
  if (lock.baseWorldId !== EXPECTED_BASE_WORLD) fail(`baseWorldId muss ${EXPECTED_BASE_WORLD} sein.`);
  if (lock.seriesLockId !== EXPECTED_SERIES) fail(`seriesLockId muss ${EXPECTED_SERIES} sein.`);
  if (lock.physicalExplainerLockId !== EXPECTED_LOCK) fail(`physicalExplainerLockId muss ${EXPECTED_LOCK} sein.`);
  if (lock.animatedWorldLockId !== EXPECTED_LOCK) fail(`animatedWorldLockId muss ${EXPECTED_LOCK} sein.`);
  if (lock.worldDefinitionPath !== WORLD_PATH) fail(`worldDefinitionPath muss ${WORLD_PATH} sein.`);
  if (lock.coverAspectRatio !== '1:1' || lock.sceneImageAspectRatio !== '1:1') fail('Cover und Szenen-Quellbilder müssen 1:1 bleiben.');
  if (lock.preferredSceneImageSize !== '1080x1080') fail('preferredSceneImageSize muss 1080x1080 sein.');
  if (lock.promptPolicy?.length !== 'medium') fail('promptPolicy.length muss medium sein.');
  if (lock.promptPolicy?.clarityFirst !== true || lock.promptPolicy?.avoidOverlongRuleBlocks !== true) fail('Prompt-Policy muss Klarheit priorisieren und überlange Regelblöcke vermeiden.');

  const requiredTrueRules = [
    'nonPhotorealisticRequired',
    'stylized3DAnimatedRequired',
    'softRoundedGeometryRequired',
    'simplifiedDetailsRequired',
    'premiumPlayfulBalanceRequired',
    'clearMainSubjectOrActionRequired',
    'contentFirstCompositionRequired',
    'supportingObjectCountFlexible',
    'supportingObjectsOnlyWhenHelpful',
    'clarityBeforeObjectCount',
    'deepBlackBackgroundRequired',
    'cleanMinimalBackgroundRequired',
    'subjectSeparationLightingRequired',
    'softContactShadowsRequired',
    'sameWorldAcrossSeriesRequired',
    'brandMarksRecognizableButStylizedRequired',
    'flatPastedRealLogoForbidden',
    'screenshotLikeBrandUiForbidden',
    'dashboardCompositionForbidden',
    'appUiCompositionForbidden',
    'flowchartMainCompositionForbidden',
    'smallBoxesThinLinesForbidden',
    'floatingUiTilesForbidden',
    'microchipVisualLanguageForbidden',
    'miniatureDioramaForbidden',
    'photorealismForbidden',
    'productPhotoLookForbidden',
    'clutterForbidden',
  ];
  for (const key of requiredTrueRules) if (lock.rules?.[key] !== true) fail(`V9-Regel ${key} muss true sein.`);
  if ('supportingObjectsMin' in (lock.rules ?? {}) || 'supportingObjectsMax' in (lock.rules ?? {})) fail('Feste Supporting-Object-Min/Max-Werte sind verboten.');
  if ('heroUsefulFrameMinRatio' in (lock.rules ?? {}) || 'heroUsefulFrameMaxRatio' in (lock.rules ?? {})) fail('Ein fester Hero-Prozentkorridor ist in V9 nicht erlaubt.');

  if (lock.colors?.background !== 'deep black') fail('V9-Hintergrund muss deep black sein.');
  for (const key of ['positive','neutral','money','warning']) {
    if (typeof lock.colors?.[key] !== 'string' || !lock.colors[key].trim()) fail(`Farbrolle ${key} fehlt.`);
  }
  if (lock.lighting?.style !== 'clean soft studio lighting') fail('V9-Lichtstil muss clean soft studio lighting sein.');
  for (const key of ['clearHighlightsRequired','readableShadowsRequired','subjectSeparationRequired','softContactShadowsRequired']) {
    if (lock.lighting?.[key] !== true) fail(`Lichtregel ${key} muss true sein.`);
  }

  if (lock.googleFlow?.executionModeId !== EXPECTED_FLOW_MODE) fail(`Google Flow executionModeId muss ${EXPECTED_FLOW_MODE} sein.`);
  if (lock.googleFlow?.stateMachineId !== EXPECTED_FLOW_STATE_MACHINE) fail(`Google Flow stateMachineId muss ${EXPECTED_FLOW_STATE_MACHINE} sein.`);
  if (lock.googleFlow?.maxConcurrentGenerations !== 1) fail('Google Flow maxConcurrentGenerations muss 1 sein.');
  for (const key of [
    'continuousAutonomousRunRequired',
    'batchGenerationForbidden',
    'multiImageRequestForbidden',
    'queueLaterImagesForbidden',
    'nextStepLockedUntilRenameAndQa',
    'userConfirmationBetweenImagesForbidden',
    'autoRegenerateInvalidImage',
    'completionSummaryOnlyAfterAllImages',
  ]) {
    if (lock.googleFlow?.[key] !== true) fail(`Google-Flow-Regel ${key} muss true sein.`);
  }
}

if (existsSync(WORLD_PATH)) {
  const world = read(WORLD_PATH);
  const requiredMarkers = [
    `PREMIUM_VISUAL_WORLD_LOCK: ${EXPECTED_LOCK}`,
    `FINANZNEO_WORLD_ID: ${EXPECTED_BASE_WORLD}`,
    `FINANZNEO_SERIES_LOCK: ${EXPECTED_SERIES}`,
    'clearly stylized 3D animation, never photorealistic',
    'deep black background as a strict requirement',
    'no fixed number of supporting objects',
    'BRANDS + LOGOS',
    'recognizable but reinterpret it inside the same stylized 3D animated world',
    'PROMPT LENGTH POLICY',
    'medium-length image prompts',
    'dashboard or app UI',
    'flowchart as the main composition',
    'Strict single-job state machine',
  ];
  for (const marker of requiredMarkers) if (!world.includes(marker)) fail(`World-Definition enthält Pflichtmarker nicht: ${marker}`);
}

if (existsSync('package.json')) {
  try {
    const pkg = JSON.parse(read('package.json'));
    if (pkg.scripts?.['validate:image-world'] !== 'node scripts/validate-global-image-world.mjs') fail('package.json braucht validate:image-world.');
    if (pkg.scripts?.['reel:visual-world:v7'] !== 'node scripts/apply-stylized-animated-black-world-v7.mjs') fail('package.json braucht reel:visual-world:v7.');
    if (!String(pkg.scripts?.validate ?? '').includes('validate:image-world')) fail('npm run validate muss validate:image-world enthalten.');
  } catch (error) {
    fail(`package.json ist ungültig: ${error.message}`);
  }
}

if (errors.length) {
  console.error('\nStylized Animated Black Image-World-Lock verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Image World erfüllt: ${EXPECTED_LOCK}`);
console.log('✓ Nicht realistisch · stylized 3D animated · deep black Pflicht · soft rounded · premium/leicht verspielt.');
console.log('✓ Keine feste Objektanzahl/kein Hero-Prozentkorridor; Inhalt und Klarheit entscheiden.');
console.log('✓ Marken/Logos erkennbar aber stilisiert; Flat-Paste/Screenshot-Look verboten.');
console.log('✓ Mittel-lange Prompts · Dashboard/App-UI/Flowchart/Produktfoto-Look/Clutter verboten.');
console.log(`✓ Google Flow: ${EXPECTED_FLOW_MODE} · concurrency=1 · Batch/Queueing verboten.`);
