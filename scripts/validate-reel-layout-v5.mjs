#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-reel-layout-v5.mjs <Reel-Pfad>');
  process.exit(1);
}

const indexPath = resolve(target, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(index.layoutVersion === 'finanzneo-reel-layout-v5', 'layoutVersion muss finanzneo-reel-layout-v5 sein.');
assert(index.layout?.headlineY === 154, 'layout.headlineY muss 154 sein.');
assert(index.layout?.visualTop === 320, 'layout.visualTop muss 320 sein.');
assert(index.layout?.visualBottom === 1480, 'layout.visualBottom muss 1480 sein.');
assert(index.layout?.subtitleBottom === 340, 'layout.subtitleBottom muss 340 sein.');
assert(index.sceneHeader?.presentation === 'plain', 'sceneHeader.presentation muss plain sein.');
assert(index.sceneHeader?.headlineColor === 'white', 'sceneHeader.headlineColor muss white sein.');
assert(index.sceneHeader?.defaultIconColor === 'finance-green', 'sceneHeader.defaultIconColor muss finance-green sein.');
assert(index.sceneHeader?.capsuleForbidden === true, 'Header-Capsule muss verboten sein.');
assert(index.sceneHeader?.uppercaseTransformForbidden === true, 'Automatische UPPERCASE-Transformation muss verboten sein.');

if (errors.length) {
  console.error('\nReel-V5-Layout verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-V5-Layout erfüllt: normaler Plain-Header, Visuals höher, Captions höher.');
