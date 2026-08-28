#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {PREMIUM_ANIMATION_LOCK} from './lib/premium-animation-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-premium-visual-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const MAX_INDIVIDUAL_PROMPT_CHARS = 4200;
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
  console.log('✓ Legacy-Reel: V9-Migration wird nicht rückwirkend erzwungen.');
  process.exit(0);
}

const world = index.imageWorld ?? {};
if (world.premiumVisualWorldLockId !== WORLD_LOCK) fail(`imageWorld.premiumVisualWorldLockId muss ${WORLD_LOCK} sein.`);
if (world.physicalExplainerLockId !== WORLD_LOCK) fail(`imageWorld.physicalExplainerLockId muss ${WORLD_LOCK} sein.`);
if (world.animatedWorldLockId !== WORLD_LOCK) fail(`imageWorld.animatedWorldLockId muss ${WORLD_LOCK} sein.`);
for (const key of [
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
]) {
  if (world[key] !== true) fail(`imageWorld.${key} muss true sein.`);
}
if ('supportingObjectsMin' in world || 'supportingObjectsMax' in world) fail('Feste Supporting-Object-Min/Max-Werte sind nicht erlaubt.');
if ('heroUsefulFrameMinRatio' in world || 'heroUsefulFrameMaxRatio' in world) fail('Ein fester Hero-Prozentkorridor ist in V9 nicht erlaubt.');

const requiredPromptMarkers = [
  `PREMIUM_VISUAL_WORLD_LOCK: ${WORLD_LOCK}`,
  'stylized 3D animated',
  'deep black background is mandatory',
  'Supporting objects have no fixed count',
  'BRANDS + LOGOS',
  'recognizable but reinterpret it in the same stylized 3D animated world',
  'No realism or photorealism',
  'No dashboard',
  'no app UI',
  'no flowchart',
];

const promptPaths = [
  resolve(root, '03-szenen/bildwelt.txt'),
  resolve(root, '03-szenen/00-cover/cover.txt'),
  resolve(root, '03-szenen/alle-bildprompts.txt'),
];

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const individualPromptPaths = [];
for (const scene of scenes) {
  if (scene?.type === 'image') {
    const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
    const path = resolve(root, '03-szenen', plan);
    promptPaths.push(path);
    individualPromptPaths.push(path);
  }
}
individualPromptPaths.push(resolve(root, '03-szenen/00-cover/cover.txt'));

for (const path of promptPaths) {
  if (!existsSync(path)) {
    fail(`V9-Promptdatei fehlt: ${path}`);
    continue;
  }
  const content = read(path);
  for (const marker of requiredPromptMarkers) {
    if (!content.includes(marker)) fail(`${path}: V9-Marker fehlt: ${marker}`);
  }
  if (/\b(?:2|3)[–-](?:4|6)\s+(?:supporting|concrete supporting)/i.test(content)) fail(`${path}: feste Supporting-Object-Anzahl ist nicht erlaubt.`);
  if (/hero.{0,30}45[–-]65\s*%/i.test(content)) fail(`${path}: alter Hero-Prozentkorridor ist in V9 nicht erlaubt.`);
  if (/finanzneo-premium-physical-editorial-v8/.test(content)) fail(`${path}: alter Premium-Physical-V8-Lock darf nicht mehr vorkommen.`);
}

for (const path of individualPromptPaths) {
  if (!existsSync(path)) continue;
  const content = read(path);
  if (content.length > MAX_INDIVIDUAL_PROMPT_CHARS) fail(`${path}: Prompt ist mit ${content.length} Zeichen zu lang; V9 verlangt mittel-lange Prompts (max. ${MAX_INDIVIDUAL_PROMPT_CHARS}).`);
}

if (index.phase1AnimationCode?.premiumVisualLock !== PREMIUM_ANIMATION_LOCK) {
  fail(`phase1AnimationCode.premiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
}
for (const scene of scenes.filter((s) => s?.type === 'animation')) {
  if (scene.animationPremiumVisualLock !== PREMIUM_ANIMATION_LOCK) fail(`${scene.id}: animationPremiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
}

if (errors.length) {
  console.error('\nStylized-Animated-Visual-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Stylized 3D Animated Black World ${WORLD_LOCK} ist im Reel vollständig verankert.`);
console.log('✓ Deep-black Pflicht · nicht realistisch · soft rounded · premium/leicht verspielt · Klarheit vor Objektzahl.');
console.log('✓ Marken/Logos bleiben erkennbar aber stilisiert; Flat-Paste/Screenshot-Look ist verboten.');
console.log(`✓ Einzelprompts bleiben mittel-lang (max. ${MAX_INDIVIDUAL_PROMPT_CHARS} Zeichen).`);
console.log(`✓ Phase-1-Animation-Lock bleibt ${PREMIUM_ANIMATION_LOCK}.`);
