#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';

const LOCK_PATH = 'config/finanzneo-image-world-lock.json';
const WORLD_PATH = 'config/finanzneo-image-worlds/finanzneo-premium-physical-editorial-v8.txt';
const EXPECTED_LOCK = 'finanzneo-premium-physical-editorial-v8';
const EXPECTED_BASE_WORLD = 'finanzneo-connected-studio-v3';
const EXPECTED_SERIES = 'finanzneo-same-world-v1';
const EXPECTED_STYLIZED = 'finanzneo-stylized-3d-editorial-v5';
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
  if (lock.integrationMode !== 'reel-system-v6-premium-overlay') fail('integrationMode muss reel-system-v6-premium-overlay sein.');
  if (lock.baseWorldId !== EXPECTED_BASE_WORLD) fail(`baseWorldId muss ${EXPECTED_BASE_WORLD} sein.`);
  if (lock.seriesLockId !== EXPECTED_SERIES) fail(`seriesLockId muss ${EXPECTED_SERIES} sein.`);
  if (lock.stylized3DLockId !== EXPECTED_STYLIZED) fail(`stylized3DLockId muss ${EXPECTED_STYLIZED} sein.`);
  if (lock.physicalExplainerLockId !== EXPECTED_LOCK) fail(`physicalExplainerLockId muss ${EXPECTED_LOCK} sein.`);
  if (lock.worldDefinitionPath !== WORLD_PATH) fail(`worldDefinitionPath muss ${WORLD_PATH} sein.`);
  if (lock.coverAspectRatio !== '1:1' || lock.sceneImageAspectRatio !== '1:1') fail('Cover und Szenen-Quellbilder müssen 1:1 bleiben.');
  if (lock.preferredSceneImageSize !== '1080x1080') fail('preferredSceneImageSize muss 1080x1080 sein.');

  if (Number(lock.rules?.heroUsefulFrameMinRatio) < 0.45) fail('Hero-Objekt muss mindestens ca. 45% der nutzbaren Komposition einnehmen.');
  if (Number(lock.rules?.heroUsefulFrameMaxRatio) > 0.65) fail('Hero-Korridor darf 65% nicht überschreiten.');
  if (lock.rules?.supportingObjectCountFlexible !== true) fail('supportingObjectCountFlexible muss true sein.');
  if (lock.rules?.supportingObjectsOnlyWhenHelpful !== true) fail('supportingObjectsOnlyWhenHelpful muss true sein.');
  if (lock.rules?.clarityBeforeObjectCount !== true) fail('clarityBeforeObjectCount muss true sein.');
  if ('supportingObjectsMin' in (lock.rules ?? {}) || 'supportingObjectsMax' in (lock.rules ?? {})) fail('Feste Supporting-Object-Min/Max-Werte sind verboten.');

  const requiredTrueRules = [
    'dominantHeroObjectRequired',
    'recognizableTopicObjectsRequired',
    'physicalTagsRequiredWhenLabelsUsed',
    'naturalAsymmetryRequired',
    'mediumCloseThreeQuarterCameraRequired',
    'foregroundHeroBackgroundDepthRequired',
    'purposefulOverlapRequired',
    'contactShadowsRequired',
    'ambientOcclusionRequired',
    'threeMaterialRolesRequired',
    'nonMonochromeSemanticAccentRequired',
    'subjectSeparationLightingRequired',
    'seamlessSingleBackgroundRequired',
    'dashboardCompositionForbidden',
    'flowchartMainCompositionForbidden',
    'smallBoxesThinLinesForbidden',
    'floatingUiTilesForbidden',
    'genericRectangularInfoCardsAsMainObjectsForbidden',
    'microchipVisualLanguageForbidden',
    'gameBoardCompositionForbidden',
    'satelliteModuleOrbitForbidden',
    'symmetricalFourCornerLayoutForbidden',
    'thinNeonConnectorMainMotifForbidden',
    'tinyIsometricDioramaForbidden',
    'sterileProductAdLookForbidden',
    'emptyBlackStudioForbidden',
    'flatPosterCompositionForbidden',
    'monochromeGreenFrameForbidden',
    'photorealisticOfficeStillLifeForbidden',
    'childishClayToyPixarLookForbidden'
  ];
  for (const key of requiredTrueRules) if (lock.rules?.[key] !== true) fail(`Premium-V8-Regel ${key} muss true sein.`);

  for (const key of ['structure','neutral','money','warning','glass']) {
    if (typeof lock.materials?.[key] !== 'string' || !lock.materials[key].trim()) fail(`Materialrolle ${key} fehlt.`);
  }
  for (const key of ['key','rim','valueHighlight']) {
    if (typeof lock.lighting?.[key] !== 'string' || !lock.lighting[key].trim()) fail(`Lichtrolle ${key} fehlt.`);
  }
  if (lock.lighting?.shadowFillRequired !== true || lock.lighting?.contactShadowsRequired !== true) fail('Premium-V8 braucht Shadow-Fill und Contact-Shadows.');

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
    `STYLIZED_3D_LOCK: ${EXPECTED_STYLIZED}`,
    '45–65%',
    'NO fixed count',
    'Clarity decides',
    'medium-close 3/4 camera',
    'ambient occlusion',
    'dashboard or control-panel composition',
    'flowchart as the main composition',
    'small boxes connected by thin lines',
    'monochrome green-only frame',
    'Strict single-job state machine',
  ];
  for (const marker of requiredMarkers) if (!world.includes(marker)) fail(`World-Definition enthält Pflichtmarker nicht: ${marker}`);
  if (/\b(?:2|3)[–-](?:4|6)\s+(?:supporting|concrete supporting)/i.test(world)) fail('World-Definition darf keine feste Supporting-Object-Anzahl mehr enthalten.');
}

if (existsSync('package.json')) {
  try {
    const pkg = JSON.parse(read('package.json'));
    if (pkg.scripts?.['validate:image-world'] !== 'node scripts/validate-global-image-world.mjs') fail('package.json braucht validate:image-world.');
    if (!String(pkg.scripts?.validate ?? '').includes('validate:image-world')) fail('npm run validate muss validate:image-world enthalten.');
  } catch (error) {
    fail(`package.json ist ungültig: ${error.message}`);
  }
}

if (errors.length) {
  console.error('\nPremium Image-World-Lock verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Premium Image World erfüllt: ${EXPECTED_LOCK}`);
console.log('✓ Supporting-Objekte haben keine feste Anzahl; Klarheit und Inhalt entscheiden.');
console.log('✓ Dashboard/Flowchart/kleine Boxen + dünne Linien/monochrom-grün sind als Hauptsprache verboten.');
console.log(`✓ Google Flow: ${EXPECTED_FLOW_MODE} · concurrency=1 · Batch/Queueing verboten.`);
