#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {isStaticYouTubeVisual, requiresYouTubeMotion} from './lib/youtube-motion-contract.mjs';

const YOUTUBE_MOTION_QUALITY_STANDARD_ID = 'finanzneo-youtube-motion-quality-v1';
const YOUTUBE_VISUAL_QA_STANDARD_ID = 'finanzneo-youtube-visual-qa-16x9-v1';
const REQUIRED_STATES = ['START', '25%', '50%', '75%', 'RESULT HOLD'];
const REQUIRED_CHECKS = [
  'startResultDifferent',
  'mechanismReadable',
  'safeArea',
  'noClipping',
  'resultReadable',
  'financeValuesVerified',
  'staticAlternativeRechecked',
  'adjacentVariety',
];

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:motion:qa:validate -- youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const indexPath = resolve(root, '04-visuals/visual-index.json');
if (!existsSync(indexPath)) {
  console.error('04-visuals/visual-index.json fehlt.');
  process.exit(1);
}
const index = readJson(indexPath);
if (index?.phaseB?.motionQualityStandardId !== YOUTUBE_MOTION_QUALITY_STANDARD_ID) {
  console.log('✓ Projekt nutzt den Representative-Frame-QA-Standard nicht; übersprungen.');
  process.exit(0);
}

const errors = [];
if (index?.phaseB?.visualQaStandardId !== YOUTUBE_VISUAL_QA_STANDARD_ID) {
  errors.push(`phaseB.visualQaStandardId muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} sein.`);
}

const manifestPath = resolve(root, '06-projektdateien/motion-qa-manifest.json');
const reviewPath = resolve(root, '06-projektdateien/motion-qa-review.json');
if (!existsSync(manifestPath)) errors.push('motion-qa-manifest.json fehlt. Erst npm run youtube:motion:qa -- <projekt> ausführen.');
if (!existsSync(reviewPath)) errors.push('motion-qa-review.json fehlt. Erst Motion-QA rendern und prüfen.');

let manifest = null;
let review = null;
if (existsSync(manifestPath)) {
  try { manifest = readJson(manifestPath); } catch (error) { errors.push(`motion-qa-manifest.json ungültig: ${error.message}`); }
}
if (existsSync(reviewPath)) {
  try { review = readJson(reviewPath); } catch (error) { errors.push(`motion-qa-review.json ungültig: ${error.message}`); }
}

if (manifest?.draft === true) errors.push('Motion-QA wurde nur mit --draft gerendert. Finale QA muss die echte Timeline verwenden.');
if (manifest && manifest.standardId !== YOUTUBE_VISUAL_QA_STANDARD_ID) errors.push(`Manifest muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} verwenden.`);
if (review && review.standardId !== YOUTUBE_VISUAL_QA_STANDARD_ID) errors.push(`Review muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} verwenden.`);

const expectedVisuals = (index?.visuals ?? []).filter(requiresYouTubeMotion).filter((visual) => !isStaticYouTubeVisual(visual));
const manifestById = new Map((manifest?.visuals ?? []).map((item) => [item.id, item]));
const reviewById = new Map((review?.visuals ?? []).map((item) => [item.id, item]));

for (const visual of expectedVisuals) {
  const id = visual.id ?? 'Unbekanntes Visual';
  const manifestEntry = manifestById.get(id);
  const reviewEntry = reviewById.get(id);

  if (!manifestEntry) {
    errors.push(`${id}: fehlt im Motion-QA-Manifest.`);
  } else {
    if (manifestEntry.timingSource !== 'timeline') errors.push(`${id}: finale Motion-QA muss timingSource=timeline verwenden.`);
    if (!(Number(manifestEntry.durationInFrames) > 1)) errors.push(`${id}: ungültige durationInFrames im Motion-QA-Manifest.`);
    const names = (manifestEntry.states ?? []).map((state) => state.name);
    if (JSON.stringify(names) !== JSON.stringify(REQUIRED_STATES)) {
      errors.push(`${id}: Representative States müssen ${REQUIRED_STATES.join(' | ')} sein.`);
    }
    for (const state of manifestEntry.states ?? []) {
      const file = resolve(root, state.file ?? '');
      if (!state.file || !existsSync(file)) errors.push(`${id}: QA-Frame fehlt für ${state.name ?? 'unbekannten Zustand'}: ${state.file ?? '(kein Pfad)'}.`);
    }
  }

  if (!reviewEntry) {
    errors.push(`${id}: fehlt im Motion-QA-Review.`);
  } else {
    if (reviewEntry.status !== 'PASS') errors.push(`${id}: Motion-QA-Review steht nicht auf PASS.`);
    for (const check of REQUIRED_CHECKS) {
      if (reviewEntry?.checks?.[check] !== true) errors.push(`${id}: QA-Check ${check} ist nicht bestätigt.`);
    }
  }
}

if (errors.length) {
  console.error('\nYouTube Representative-Frame-QA ist noch nicht freigegeben:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ YouTube Motion-QA freigegeben: ${expectedVisuals.length} animierte Visual(s) × 5 repräsentative Frames.`);
console.log('  Finale Timeline · Safe Area · Clipping · Mechanik · Result Hold · Finanzwerte · statische Alternative · Szenenvielfalt geprüft.');
