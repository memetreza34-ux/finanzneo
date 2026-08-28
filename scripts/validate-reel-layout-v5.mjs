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
assert(index.layout?.visualBottom === 1400, 'layout.visualBottom muss 1400 sein.');
assert(index.layout?.subtitleBottom === 340, 'layout.subtitleBottom muss 340 sein.');
assert(index.sceneHeader?.presentation === 'plain', 'sceneHeader.presentation muss plain sein.');
assert(index.sceneHeader?.headlineColor === 'white', 'sceneHeader.headlineColor muss white sein.');
assert(index.sceneHeader?.fontSize === 56, 'sceneHeader.fontSize muss 56 sein.');
assert(index.sceneHeader?.minFontSize === 50, 'sceneHeader.minFontSize muss 50 sein.');
assert(index.sceneHeader?.maxLines === 2, 'sceneHeader.maxLines muss 2 sein.');
assert(index.sceneHeader?.iconSize === 34, 'sceneHeader.iconSize muss 34 sein.');
assert(index.sceneHeader?.defaultIconColor === 'finance-green', 'sceneHeader.defaultIconColor muss finance-green sein.');
assert(index.sceneHeader?.capsuleForbidden === true, 'Header-Capsule muss verboten sein.');
assert(index.sceneHeader?.uppercaseTransformForbidden === true, 'Automatische UPPERCASE-Transformation muss verboten sein.');
assert(index.visualSafeZone?.top === 320 && index.visualSafeZone?.bottom === 1400, 'visualSafeZone muss Y320–1400 sein.');
assert(index.visualSafeZone?.hardClipAnimations === true, 'Animationen müssen hart auf die Visualzone begrenzt sein.');
assert(index.visualSafeZone?.headerIntrusionForbidden === true, 'Animationen dürfen nicht in den Header laufen.');
assert(index.visualSafeZone?.captionIntrusionForbidden === true, 'Animationen dürfen nicht in die Caption-Zone laufen.');

if (errors.length) {
  console.error('\nReel-V5-Layout verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-V5-Layout erfüllt: 56-px Plain-Header, max. 2 Zeilen, Visual Y320–1400, Caption bottom340.');
console.log('✓ Animationen sind per Vertrag auf die zentrale Visualzone begrenzt.');
