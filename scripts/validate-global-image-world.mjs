#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';

const LOCK_PATH = 'config/finanzneo-image-world-lock.json';
const WORLD_PATH = 'config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt';
const APPLY_V9_PATH = 'scripts/apply-stylized-animated-black-world-v9.mjs';
const EXPECTED_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const EXPECTED_BASE_WORLD = 'finanzneo-connected-studio-v3';
const EXPECTED_SERIES = 'finanzneo-same-world-v1';
const EXPECTED_FLOW_MODE = 'finanzneo-flow-strict-single-job-v3';
const EXPECTED_FLOW_STATE_MACHINE = 'finanzneo-flow-state-machine-v1';

const errors = [];
const fail = (m) => errors.push(m);
const read = (p) => readFileSync(p, 'utf8');

for (const path of [LOCK_PATH, WORLD_PATH, APPLY_V9_PATH, 'docs/IMAGE-PROMPT-BASELINE.md']) {
  if (!existsSync(path)) fail(`Pflichtdatei fehlt: ${path}`);
}

let lock=null;
if (existsSync(LOCK_PATH)) {
  try { lock=JSON.parse(read(LOCK_PATH)); } catch (e) { fail(`${LOCK_PATH} ist ungültig: ${e.message}`); }
}

if (lock) {
  if (lock.locked !== true) fail('Image-World-Lock muss locked=true sein.');
  if (lock.baseWorldId !== EXPECTED_BASE_WORLD) fail(`baseWorldId muss ${EXPECTED_BASE_WORLD} sein.`);
  if (lock.seriesLockId !== EXPECTED_SERIES) fail(`seriesLockId muss ${EXPECTED_SERIES} sein.`);
  if (lock.animatedWorldLockId !== EXPECTED_LOCK) fail(`animatedWorldLockId muss ${EXPECTED_LOCK} sein.`);
  if (lock.worldDefinitionPath !== WORLD_PATH) fail(`worldDefinitionPath muss ${WORLD_PATH} sein.`);
  if (lock.coverAspectRatio !== '1:1' || lock.sceneImageAspectRatio !== '1:1') fail('Reel-Quellbilder müssen 1:1 bleiben.');

  const styleRules=['nonPhotorealisticRequired','stylized3DAnimatedRequired','softRoundedGeometryRequired','simplifiedDetailsRequired','premiumPlayfulBalanceRequired','deepBlackBackgroundRequired','cleanMinimalBackgroundRequired','subjectSeparationLightingRequired','softContactShadowsRequired','sameWorldAcrossSeriesRequired'];
  for (const key of styleRules) if (lock.rules?.[key] !== true) fail(`Visual-Style-Regel fehlt: ${key}`);

  const removedCreativeKeys=['realWorldGroundedSituationRequired','completeExplanatorySceneRequired','causeEffectReadableRequired','understandableWithoutAudioRequired','germanObjectLabelsWhenHelpfulRequired','contentFirstCompositionRequired','supportingObjectsOnlyWhenHelpful','clarityBeforeObjectCount','abstractSymbolOnlyCompositionForbidden','genericFinanceIconCompositionForbidden','visualMetaphorInterpretationRequiredForbidden','dashboardCompositionForbidden','appUiCompositionForbidden','flowchartMainCompositionForbidden','miniatureDioramaForbidden','clutterForbidden'];
  for (const key of removedCreativeKeys) if (key in (lock.rules ?? {})) fail(`Alte kreative Bildregel ist noch im World-Lock aktiv: ${key}`);
  if ('promptPolicy' in lock) fail('Alte globale promptPolicy muss aus dem Image-World-Lock entfernt bleiben.');

  if (lock.colors?.background !== 'deep black') fail('Hintergrund-Farbrolle muss deep black bleiben.');
  if (lock.lighting?.style !== 'clean soft studio lighting') fail('Lichtstil muss clean soft studio lighting bleiben.');

  if (lock.googleFlow?.executionModeId !== EXPECTED_FLOW_MODE) fail('Google-Flow-Modus ist falsch.');
  if (lock.googleFlow?.stateMachineId !== EXPECTED_FLOW_STATE_MACHINE) fail('Google-Flow-State-Machine ist falsch.');
  if (lock.googleFlow?.maxConcurrentGenerations !== 1) fail('Google Flow muss concurrency=1 behalten.');
}

if (existsSync(WORLD_PATH)) {
  const world=read(WORLD_PATH);
  for (const marker of [
    `PREMIUM_VISUAL_WORLD_LOCK: ${EXPECTED_LOCK}`,
    `FINANZNEO_WORLD_ID: ${EXPECTED_BASE_WORLD}`,
    `FINANZNEO_SERIES_LOCK: ${EXPECTED_SERIES}`,
    'premium stylized 3D animation look',
    'clearly non-photorealistic',
    'deep black',
    'clean soft studio lighting',
    'CREATIVE SCOPE'
  ]) if (!world.toLowerCase().includes(marker.toLowerCase())) fail(`World-Definition enthält Pflichtmarker nicht: ${marker}`);
}

if (existsSync('package.json')) {
  const pkg=JSON.parse(read('package.json'));
  if (pkg.scripts?.['validate:image-world'] !== 'node scripts/validate-global-image-world.mjs') fail('package.json braucht validate:image-world.');
  if (pkg.scripts?.['reel:visual-world:v9'] !== `node ${APPLY_V9_PATH}`) fail('package.json braucht reel:visual-world:v9.');
}

if (existsSync('scripts/create-finanzneo-reel.mjs')) {
  const creator=read('scripts/create-finanzneo-reel.mjs');
  if (!creator.includes(APPLY_V9_PATH)) fail('reel:create muss den V9-Visual-World-Lock anwenden.');
  if (creator.includes('apply-future-image-storytelling-v3.mjs')) fail('reel:create darf den entfernten Image-Storytelling-V3-Vertrag nicht mehr anwenden.');
}

if (errors.length) {
  console.error('\nImage-World-Lock verletzt:\n');
  errors.forEach((e)=>console.error('- '+e));
  process.exit(1);
}

console.log(`\n✓ Image World visual style locked: ${EXPECTED_LOCK}`);
console.log('✓ Rendering identity remains active: stylized 3D · deep black · FinanzNeo colors · soft studio light.');
console.log('✓ Old global image-storytelling/prompt formulas are not part of the world lock anymore.');
