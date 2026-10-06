#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-stylized-animated-black-world-v9.mjs <Reel-Pfad>');
  process.exit(1);
}

const WORLD_ID = 'finanzneo-connected-studio-v3';
const SERIES_LOCK = 'finanzneo-same-world-v1';
const WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');

if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld = {
  id: WORLD_ID,
  seriesLockId: SERIES_LOCK,
  premiumVisualWorldLockId: WORLD_LOCK,
  animatedWorldLockId: WORLD_LOCK,
  generatedImageAspectRatio: '1:1',
  squareGeneratedImagesRequired: true,
  referencePromptFile: '03-szenen/bildwelt.txt',
  style: 'stylized-3d-animated-black-v9',
  nonPhotorealisticRequired: true,
  stylized3DAnimatedRequired: true,
  softRoundedGeometryRequired: true,
  simplifiedDetailsRequired: true,
  premiumPlayfulBalanceRequired: true,
  deepBlackBackgroundRequired: true,
  cleanMinimalBackgroundRequired: true,
  subjectSeparationLightingRequired: true,
  softContactShadowsRequired: true,
  sameWorldAcrossSeriesRequired: true
};

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const worldPath = resolve(root, '03-szenen/bildwelt.txt');
if (existsSync(worldPath)) {
  writeFileSync(worldPath, `FINANZNEO STYLIZED 3D ANIMATED BLACK WORLD — V9

FINANZNEO_WORLD_ID: ${WORLD_ID}
FINANZNEO_SERIES_LOCK: ${SERIES_LOCK}
PREMIUM_VISUAL_WORLD_LOCK: ${WORLD_LOCK}
GENERATED_IMAGE_ASPECT_RATIO: 1:1

VISUAL STYLE
- premium stylized 3D animation look
- clearly non-photorealistic
- soft / simplified recognizable forms
- seamless deep black background
- emerald / ivory / soft gray / subtle gold / warm red-orange color system
- clean soft studio lighting
- polished, consistent material language

CREATIVE PROMPT RULES
No global motif/storytelling formula is applied here. See docs/IMAGE-PROMPT-BASELINE.md.
`, 'utf8');
}

console.log(`✓ Visual image world applied: ${WORLD_LOCK}`);
console.log('✓ Only rendering identity is locked; creative image-prompt formulas are not injected.');
