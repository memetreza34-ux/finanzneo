#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-image-storytelling-v2.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-image-storytelling-v2';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.imageStorytellingContract;
if (!c) {
  console.log('✓ Reel ohne Future-Image-Storytelling bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
assert(c.id === ID, 'imageStorytellingContract.id muss ' + ID + ' sein.');
for (const key of [
  'practicalEverydaySituationRequired',
  'directMeaningWithoutCaptionRequired',
  'visibleActionConflictOrConsequenceRequired',
  'genericSymbolOnlyForbidden',
  'isolatedFinanceIconAsMainStoryForbidden',
  'decorativeObjectPileForbidden',
  'staticCatalogCompositionForbidden',
  'entertainmentThroughActionContrastOrConflictRequired',
  'beforeAfterOrCauseEffectWhenHelpful',
  'humanContextWhenHelpful',
  'visualHookUnderOneSecondRequired',
  'oneImagePerSentenceWhenItImprovesClarity',
  'extraImagePreferredOverOverloadedStill',
  'labelsSupplementalOnly',
]) assert(c[key] === true, 'imageStorytellingContract.' + key + ' muss true sein.');

const paths = ['03-szenen/alle-bildprompts.txt', '03-szenen/bildwelt.txt', '03-szenen/00-cover/cover.txt', '05-projektdateien/szenenplan.md', '05-projektdateien/ANTIGRAVITY-AUFTRAG.md'];
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene.type === 'image' && typeof scene.planFile === 'string') paths.push(scene.planFile);
}
for (const relative of paths) {
  const path = relative.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relative) : resolve(root, relative);
  assert(existsSync(path), relative + ' fehlt.');
  if (!existsSync(path)) continue;
  const source = readFileSync(path, 'utf8');
  assert(source.includes('IMAGE_STORYTELLING_CONTRACT: ' + ID), relative + ' enthält den Storytelling-V2-Marker nicht.');
  assert(source.includes('Keine stumpfen Symbolbilder'), relative + ' enthält das Verbot stumpfer Symbolbilder nicht.');
  assert(source.includes('Ursache → Wirkung'), relative + ' enthält die Ursache/Wirkung-Regel nicht.');
  assert(source.includes('zusätzliches Bild'), relative + ' enthält die Regel für zusätzliche Bilder nicht.');
}

if (errors.length) {
  console.error('\nFuture-Image-Storytelling verletzt:\n');
  errors.forEach((e) => console.error('- ' + e));
  process.exit(1);
}
console.log('\n✓ Future-Image-Storytelling erfüllt: ' + ID);
console.log('✓ Alltag/Handlung/Konsequenz vor Deko · keine stumpfen Symbolbilder · zusätzliche Bilder für Klarheit erlaubt.');
