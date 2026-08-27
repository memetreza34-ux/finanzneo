#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {PREMIUM_ANIMATION_LOCK} from './lib/premium-animation-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-premium-visual-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const PREMIUM_WORLD_LOCK = 'finanzneo-premium-physical-editorial-v8';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const errors = [];
const fail = (message) => errors.push(message);

if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const index = JSON.parse(read(indexPath));
if (index.imageWorld?.legacyAssetSet === true) {
  console.log('✓ Legacy-Reel: Premium-V8-Migration wird nicht rückwirkend erzwungen.');
  process.exit(0);
}

const world = index.imageWorld ?? {};
if (world.premiumVisualWorldLockId !== PREMIUM_WORLD_LOCK) fail(`imageWorld.premiumVisualWorldLockId muss ${PREMIUM_WORLD_LOCK} sein.`);
if (world.physicalExplainerLockId !== PREMIUM_WORLD_LOCK) fail(`imageWorld.physicalExplainerLockId muss ${PREMIUM_WORLD_LOCK} sein.`);
if (world.dominantHeroObjectRequired !== true) fail('dominantHeroObjectRequired muss true sein.');
if (Number(world.heroUsefulFrameMinRatio) < 0.45 || Number(world.heroUsefulFrameMaxRatio) > 0.65) fail('Hero-Korridor muss ungefähr 45–65% bleiben.');
if (world.supportingObjectsMin !== 2 || world.supportingObjectsMax !== 4) fail('Supporting Objects müssen 2–4 sein.');
for (const key of [
  'mediumCloseThreeQuarterCameraRequired',
  'foregroundHeroBackgroundDepthRequired',
  'purposefulOverlapRequired',
  'contactShadowsRequired',
  'ambientOcclusionRequired',
  'threeMaterialRolesRequired',
  'nonMonochromeSemanticAccentRequired',
  'dashboardCompositionForbidden',
  'flowchartMainCompositionForbidden',
  'smallBoxesThinLinesForbidden',
  'genericRectangularInfoCardsAsMainObjectsForbidden',
  'thinNeonConnectorMainMotifForbidden',
  'flatPosterCompositionForbidden',
  'monochromeGreenFrameForbidden',
]) {
  if (world[key] !== true) fail(`imageWorld.${key} muss true sein.`);
}

const requiredPromptMarkers = [
  `PREMIUM_VISUAL_WORLD_LOCK: ${PREMIUM_WORLD_LOCK}`,
  '45–65%',
  '2–4 supporting',
  'medium-close 3/4 camera',
  'ambient occlusion',
  'Dashboard or control-panel composition',
  'Flowchart as the main composition',
  'Small boxes connected by thin lines',
  'Monochrome green-only frames are forbidden',
];

const promptPaths = [
  resolve(root, '03-szenen/bildwelt.txt'),
  resolve(root, '03-szenen/00-cover/cover.txt'),
  resolve(root, '03-szenen/alle-bildprompts.txt'),
];

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
for (const scene of scenes) {
  if (scene?.type === 'image') {
    const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
    promptPaths.push(resolve(root, '03-szenen', plan));
  }
}

for (const path of promptPaths) {
  if (!existsSync(path)) {
    fail(`Premium-Promptdatei fehlt: ${path}`);
    continue;
  }
  const content = read(path);
  for (const marker of requiredPromptMarkers) {
    if (!content.includes(marker)) fail(`${path}: Premium-V8-Marker fehlt: ${marker}`);
  }
  if (/3[–-]6 supporting/i.test(content)) fail(`${path}: alter 3–6-Supporting-Object-Korridor widerspricht Premium V8.`);
  if (/PHYSICAL_EXPLAINER_LOCK:\s*finanzneo-physical-explainer-editorial-v7/.test(content)) fail(`${path}: alter V7-Lock darf im Premium-V8-Prompt nicht mehr vorkommen.`);
}

if (index.phase1AnimationCode?.premiumVisualLock !== PREMIUM_ANIMATION_LOCK) {
  fail(`phase1AnimationCode.premiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
}
for (const scene of scenes.filter((s) => s?.type === 'animation')) {
  if (scene.animationPremiumVisualLock !== PREMIUM_ANIMATION_LOCK) fail(`${scene.id}: animationPremiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const remotionPath = resolve(root, '03-szenen', plan);
  if (!existsSync(remotionPath)) {
    fail(`${scene.id}: remotion.md fehlt.`);
    continue;
  }
  const remotion = read(remotionPath);
  if (!remotion.includes(`Premium Visual Lock: ${PREMIUM_ANIMATION_LOCK}`)) fail(`${scene.id}: remotion.md enthält Premium-Animation-Lock nicht.`);
  for (const marker of ['großes dominantes Hero-Objekt','Materialität','Dashboard-/Control-Panel-Look','Flowchart als Hauptkomposition']) {
    if (!remotion.includes(marker)) fail(`${scene.id}: remotion.md enthält Premium-Regel nicht: ${marker}`);
  }
}

if (errors.length) {
  console.error('\nPremium-Visual-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Premium Visual World ${PREMIUM_WORLD_LOCK} ist im Reel vollständig verankert.`);
console.log(`✓ Premium Animation ${PREMIUM_ANIMATION_LOCK} ist für jede Remotion-Szene verankert.`);
console.log('✓ Alte UI-/Flowchart-/kleine-Boxen-/monochrom-grüne Bildsprache wird nicht akzeptiert.');
