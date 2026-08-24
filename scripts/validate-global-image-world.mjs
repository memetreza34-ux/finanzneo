#!/usr/bin/env node

// Verbindet den V24-Physical-Explainer-Lock mit dem Reel-System V4, ohne den
// bestehenden 1:1-Quellbildvertrag zu brechen. Dieser Validator prüft die
// globale Overlay-Definition und dass neue Reels sie über den Scaffold erben.

import {existsSync, readFileSync} from 'node:fs';

const LOCK_PATH = 'config/finanzneo-image-world-lock.json';
const WORLD_PATH = 'config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt';
const SCAFFOLD_PATH = 'scripts/scaffold-finanzneo-reel.mjs';
const EXPECTED_PHYSICAL_LOCK = 'finanzneo-physical-explainer-editorial-v7';
const EXPECTED_BASE_WORLD = 'finanzneo-connected-studio-v3';
const EXPECTED_SERIES = 'finanzneo-same-world-v1';
const EXPECTED_STYLIZED = 'finanzneo-stylized-3d-editorial-v5';

const errors = [];
const fail = (message) => errors.push(message);
const read = (path) => readFileSync(path, 'utf8');

for (const path of [LOCK_PATH, WORLD_PATH, SCAFFOLD_PATH]) {
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
  if (lock.integrationMode !== 'reel-system-v4-compatible-overlay') fail('integrationMode muss reel-system-v4-compatible-overlay sein.');
  if (lock.baseWorldId !== EXPECTED_BASE_WORLD) fail(`baseWorldId muss ${EXPECTED_BASE_WORLD} sein.`);
  if (lock.seriesLockId !== EXPECTED_SERIES) fail(`seriesLockId muss ${EXPECTED_SERIES} sein.`);
  if (lock.stylized3DLockId !== EXPECTED_STYLIZED) fail(`stylized3DLockId muss ${EXPECTED_STYLIZED} sein.`);
  if (lock.physicalExplainerLockId !== EXPECTED_PHYSICAL_LOCK) fail(`physicalExplainerLockId muss ${EXPECTED_PHYSICAL_LOCK} sein.`);
  if (lock.worldDefinitionPath !== WORLD_PATH) fail(`worldDefinitionPath muss ${WORLD_PATH} sein.`);
  if (lock.coverAspectRatio !== '1:1') fail('Cover-Quellbild muss im V4-Vertrag 1:1 bleiben.');
  if (lock.sceneImageAspectRatio !== '1:1') fail('Szenen-Quellbilder müssen 1:1 bleiben.');
  if (lock.preferredSceneImageSize !== '1080x1080') fail('preferredSceneImageSize muss 1080x1080 sein.');

  const requiredTrueRules = [
    'physicalHeroObjectRequired',
    'recognizableTopicObjectsRequired',
    'physicalTagsRequiredWhenLabelsUsed',
    'naturalAsymmetryRequired',
    'seamlessSingleBackgroundRequired',
    'realisticEverydaySceneForbidden',
    'floatingUiTilesForbidden',
    'microchipVisualLanguageForbidden',
    'gameBoardCompositionForbidden',
    'satelliteModuleOrbitForbidden',
    'symmetricalFourCornerLayoutForbidden',
    'digitalCentralScreenForbidden',
    'genericIconButtonsAsMainObjectsForbidden',
    'lineNetworkMainMotifForbidden',
    'abstractFlowMainMotifForbidden',
    'repeatedContractWallForbidden',
    'wealthTowersForbidden',
    'monolithsForbidden',
    'sterileProductAdLookForbidden',
    'emptyBlackStudioForbidden',
    'tinyPosterCompositionForbidden',
  ];

  for (const key of requiredTrueRules) {
    if (lock.rules?.[key] !== true) fail(`Image-World-Regel ${key} muss true sein.`);
  }
  if (lock.rules?.supportingObjectsMin !== 3 || lock.rules?.supportingObjectsMax !== 6) {
    fail('Supporting-Object-Korridor muss 3–6 bleiben.');
  }

  for (const key of [
    'continuousAutonomousRunRequired',
    'userConfirmationBetweenImagesForbidden',
    'autoRegenerateInvalidImage',
    'completionSummaryOnlyAfterAllImages',
  ]) {
    if (lock.googleFlow?.[key] !== true) fail(`Google-Flow-Regel ${key} muss true sein.`);
  }
}

if (existsSync(WORLD_PATH)) {
  const world = read(WORLD_PATH);
  const markers = [
    `PHYSICAL_EXPLAINER_LOCK: ${EXPECTED_PHYSICAL_LOCK}`,
    `FINANZNEO_WORLD_ID: ${EXPECTED_BASE_WORLD}`,
    `FINANZNEO_SERIES_LOCK: ${EXPECTED_SERIES}`,
    `STYLIZED_3D_LOCK: ${EXPECTED_STYLIZED}`,
    'ONE large PHYSICAL hero object',
    '3–6 RECOGNIZABLE, TOPIC-SPECIFIC physical objects',
    'floating cards, tiles, chips, buttons',
    'microchip or circuit-board visual language',
    'Cover Bild 00: strict square 1:1',
    'Never ask `Weiter?`',
  ];
  for (const marker of markers) if (!world.includes(marker)) fail(`World-Definition enthält Pflichtmarker nicht: ${marker}`);
}

if (existsSync(SCAFFOLD_PATH)) {
  const scaffold = read(SCAFFOLD_PATH);
  for (const marker of [
    `const PHYSICAL_EXPLAINER_LOCK_ID = '${EXPECTED_PHYSICAL_LOCK}'`,
    'PHYSICAL_EXPLAINER_LOCK:',
    '3–6 supporting recognizable physical objects',
    'floating UI cards',
    'microchip or circuit-board',
    'physicalExplainerLockId:PHYSICAL_EXPLAINER_LOCK_ID',
  ]) {
    if (!scaffold.includes(marker)) fail(`Scaffold erbt globalen Physical-Explainer-Lock nicht: ${marker}`);
  }
}

if (existsSync('package.json')) {
  try {
    const pkg = JSON.parse(read('package.json'));
    if (pkg.scripts?.['validate:image-world'] !== 'node scripts/validate-global-image-world.mjs') {
      fail('package.json braucht validate:image-world.');
    }
    if (!String(pkg.scripts?.validate ?? '').includes('validate:image-world')) {
      fail('npm run validate muss validate:image-world enthalten.');
    }
  } catch (error) {
    fail(`package.json ist ungültig: ${error.message}`);
  }
}

if (errors.length) {
  console.error('\nGlobaler Image-World-Lock verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Globaler Image-World-Overlay-Lock erfüllt: ${EXPECTED_PHYSICAL_LOCK}`);
console.log('✓ Cover + Szenenbilder bleiben als Flow-Quellen 1:1; 9:16 entsteht erst in Remotion.');
