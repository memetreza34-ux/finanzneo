#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {IMAGE_INBOX, SCENE_INDEX} from './lib/reel-contract.mjs';
import {
  POST_GENERATION_QA_FILE,
  POST_GENERATION_QA_ID,
  PIXEL_QA_VERSION,
  validateSemanticAssessment,
} from './lib/post-generation-image-qa-v1.mjs';

const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const requestedFile = fileIndex === -1 ? null : args[fileIndex + 1] ?? null;
const target = args.find((arg, index) => !arg.startsWith('--') && index !== fileIndex + 1);
if (!target) {
  console.error('Nutzung: npm run reel:image-qa:validate -- reels/<Woche>/<Tag>/<Reel> [--file <Bilddatei>]');
  process.exit(1);
}
if (fileIndex !== -1 && !requestedFile) {
  console.error('--file braucht einen Dateinamen.');
  process.exit(1);
}
const root = resolve(target);
const indexPath = resolve(root, SCENE_INDEX);
const reportPath = resolve(root, POST_GENERATION_QA_FILE);
const errors = [];
const fail = (message) => errors.push(message);
if (!existsSync(indexPath)) fail(`${SCENE_INDEX} fehlt.`);
if (!existsSync(reportPath)) fail(`${POST_GENERATION_QA_FILE} fehlt. Führe reel:image-qa:prepare aus.`);
if (errors.length) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const report = JSON.parse(readFileSync(reportPath, 'utf8'));
if (report.id !== POST_GENERATION_QA_ID) fail(`QA-ID muss ${POST_GENERATION_QA_ID} sein.`);
if (Number(report.pixelQaVersion) !== PIXEL_QA_VERSION) fail(`pixelQaVersion muss ${PIXEL_QA_VERSION} sein.`);
for (const key of ['semanticQaMustInspectActualPixels', 'doNotInferFromPromptOrFileName', 'failMeansRegenerateSameImageNumber', 'doNotAdvanceSingleJobQueueOnFail', 'semanticPassInvalidatedWhenPixelsChange']) {
  if (report.instructions?.[key] !== true) fail(`instructions.${key} muss true sein.`);
}
const expected = [];
if (typeof index.cover?.googleFlowFileName === 'string') expected.push({sceneId: 'cover', fileName: index.cover.googleFlowFileName});
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image' || typeof scene.googleFlowFileName !== 'string') continue;
  if (!expected.some((entry) => entry.fileName === scene.googleFlowFileName)) expected.push({sceneId: scene.id, fileName: scene.googleFlowFileName});
}
if (requestedFile && !expected.some((entry) => entry.fileName === requestedFile)) {
  fail(`--file ist kein erwartetes Flow-Bild dieses Reels: ${requestedFile}`);
}
const scope = requestedFile ? expected.filter((entry) => entry.fileName === requestedFile) : expected;
const entries = Array.isArray(report.images) ? report.images : [];
for (const item of scope) {
  const entry = entries.find((candidate) => candidate?.fileName === item.fileName);
  if (!entry) {
    fail(`${item.sceneId}: QA-Eintrag für ${item.fileName} fehlt.`);
    continue;
  }
  const imagePath = resolve(root, IMAGE_INBOX, item.fileName);
  if (!existsSync(imagePath)) fail(`${item.sceneId}: Bild fehlt inzwischen: ${IMAGE_INBOX}/${item.fileName}`);
  if (entry.pixelQa?.status !== 'PASS') fail(`${item.sceneId}: Pixel-QA ist nicht PASS: ${(entry.pixelQa?.blockers ?? []).join(' | ')}`);
  for (const error of validateSemanticAssessment(entry.semanticQa)) fail(`${item.sceneId}: ${error}`);
  if (entry.semanticQa?.fileName !== item.fileName) fail(`${item.sceneId}: semanticQa.fileName passt nicht zum Bild.`);
}
if (!requestedFile) {
  for (const entry of entries) {
    if (!expected.some((item) => item.fileName === entry?.fileName)) fail(`QA enthält unerwartetes Bild: ${entry?.fileName ?? '<ohne Dateiname>'}`);
  }
}
if (errors.length) {
  console.error('\nPost-Generation Image QA nicht bestanden:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  console.error('\nFAIL bedeutet: dieselbe Bildnummer in Flow neu generieren und die Single-Job-Queue nicht fortsetzen.');
  process.exit(1);
}
console.log(`\n✓ Post-Generation Image QA bestanden: ${scope.length} Bild${scope.length === 1 ? '' : 'er'}.`);
if (requestedFile) console.log(`✓ Strict-Single-Job-Gate offen für den nächsten Flow-Job nach ${requestedFile}.`);
else console.log('✓ Pixel-QA PASS + echte semantische Vision-QA PASS für jedes finale Flow-Bild.');
