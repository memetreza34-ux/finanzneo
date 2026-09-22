#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {IMAGE_INBOX, SCENE_INDEX} from './lib/reel-contract.mjs';
import {
  POST_GENERATION_QA_FILE,
  POST_GENERATION_QA_ID,
  PIXEL_QA_VERSION,
  dHashFromGray9x8,
  luminanceStats,
  hammingDistanceHex,
  evaluatePixelQa,
  emptySemanticAssessment,
} from './lib/post-generation-image-qa-v1.mjs';

const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const requestedFile = fileIndex === -1 ? null : args[fileIndex + 1] ?? null;
const target = args.find((arg, index) => !arg.startsWith('--') && index !== fileIndex + 1);
if (!target) {
  console.error('Nutzung: npm run reel:image-qa:prepare -- reels/<Woche>/<Tag>/<Reel> [--file <Bilddatei>]');
  process.exit(1);
}
if (fileIndex !== -1 && !requestedFile) {
  console.error('--file braucht einen Dateinamen.');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, SCENE_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${SCENE_INDEX} fehlt.`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const expected = [];
if (typeof index.cover?.googleFlowFileName === 'string') {
  expected.push({sceneId: 'cover', fileName: index.cover.googleFlowFileName, role: 'cover'});
}
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image' || typeof scene.googleFlowFileName !== 'string') continue;
  if (expected.some((item) => item.fileName === scene.googleFlowFileName)) continue;
  expected.push({sceneId: scene.id, fileName: scene.googleFlowFileName, role: 'scene'});
}
if (requestedFile && !expected.some((item) => item.fileName === requestedFile)) {
  console.error(`--file ist kein erwartetes Flow-Bild dieses Reels: ${requestedFile}`);
  process.exit(1);
}

const runRaw = (file, filter) => {
  const result = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', filter, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'gray', 'pipe:1'], {encoding: null, maxBuffer: 4 * 1024 * 1024});
  if (result.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt.');
  if (result.status !== 0) throw new Error(`ffmpeg konnte ${file} nicht lesen.`);
  return result.stdout;
};

const readPixels = (item) => {
  const file = resolve(root, IMAGE_INBOX, item.fileName);
  const hashBytes = runRaw(file, 'scale=9:8:flags=area');
  const statBytes = runRaw(file, 'scale=32:32:flags=area');
  if (hashBytes.length !== 72 || statBytes.length !== 1024) throw new Error(`Unerwartete Pixelprobe für ${item.fileName}.`);
  return {...item, dHash: dHashFromGray9x8(hashBytes), luminance: luminanceStats(statBytes)};
};

const existingExpected = expected.filter((item) => existsSync(resolve(root, IMAGE_INBOX, item.fileName)));
if (!requestedFile) {
  const missing = expected.filter((item) => !existsSync(resolve(root, IMAGE_INBOX, item.fileName)));
  if (missing.length) {
    console.error('Für die komplette QA fehlen noch Bilder:');
    missing.forEach((item) => console.error(`- ${IMAGE_INBOX}/${item.fileName}`));
    console.error('Für inkrementelle QA direkt nach einem Flow-Job: --file <Bilddatei> verwenden.');
    process.exit(1);
  }
} else if (!existsSync(resolve(root, IMAGE_INBOX, requestedFile))) {
  console.error(`Fehlendes Bild: ${IMAGE_INBOX}/${requestedFile}`);
  process.exit(1);
}

let pool;
try {
  pool = existingExpected.map(readPixels);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
const targets = requestedFile ? pool.filter((row) => row.fileName === requestedFile) : pool;
for (const row of targets) {
  let nearest = null;
  let nearestSceneId = null;
  for (const other of pool) {
    if (row.fileName === other.fileName) continue;
    const distance = hammingDistanceHex(row.dHash, other.dHash);
    if (distance !== null && (nearest === null || distance < nearest)) {
      nearest = distance;
      nearestSceneId = other.sceneId;
    }
  }
  const result = evaluatePixelQa({stats: row.luminance, nearestDistance: nearest});
  row.pixelQa = {...result, nearestDistance: nearest, nearestSceneId};
}

const reportPath = resolve(root, POST_GENERATION_QA_FILE);
let existing = null;
if (existsSync(reportPath)) {
  try { existing = JSON.parse(readFileSync(reportPath, 'utf8')); } catch { existing = null; }
}
const oldByFile = new Map((existing?.images ?? []).map((entry) => [entry.fileName, entry]));
const updatedByFile = new Map();
for (const row of targets) {
  const previous = oldByFile.get(row.fileName);
  const samePixels = previous?.dHash === row.dHash;
  updatedByFile.set(row.fileName, {
    sceneId: row.sceneId,
    fileName: row.fileName,
    role: row.role,
    dHash: row.dHash,
    luminance: row.luminance,
    pixelQa: row.pixelQa,
    semanticQa: samePixels && previous?.semanticQa
      ? previous.semanticQa
      : emptySemanticAssessment(row.sceneId, row.fileName),
  });
}

const images = [];
for (const item of expected) {
  const updated = updatedByFile.get(item.fileName);
  if (updated) {
    images.push(updated);
    continue;
  }
  const previous = oldByFile.get(item.fileName);
  if (previous && existsSync(resolve(root, IMAGE_INBOX, item.fileName))) images.push(previous);
}

const report = {
  id: POST_GENERATION_QA_ID,
  pixelQaVersion: PIXEL_QA_VERSION,
  generatedAt: new Date().toISOString(),
  mode: requestedFile ? 'incremental-single-image' : 'full-sequence',
  instructions: {
    semanticQaMustInspectActualPixels: true,
    doNotInferFromPromptOrFileName: true,
    failMeansRegenerateSameImageNumber: true,
    doNotAdvanceSingleJobQueueOnFail: true,
    semanticPassInvalidatedWhenPixelsChange: true,
  },
  images,
};
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const failed = targets.filter((entry) => entry.pixelQa.status !== 'PASS');
console.log(`\n✓ Pixel-QA vorbereitet: ${targets.length} Bild${targets.length === 1 ? '' : 'er'} geprüft.`);
if (failed.length) {
  console.error(`✗ ${failed.length} Bild(er) fallen bereits in der Pixel-QA durch.`);
  for (const entry of failed) console.error(`- ${entry.sceneId}: ${entry.pixelQa.blockers.join(' | ')}`);
  console.error('Gleiche Bildnummer neu generieren; Queue nicht fortsetzen.');
  process.exit(1);
}
console.log(`✓ Report: ${POST_GENERATION_QA_FILE}`);
if (requestedFile) console.log(`✓ Inkrementeller Flow-Gate vorbereitet für ${requestedFile}.`);
console.log('Nächster Schritt: tatsächliche Pixel visuell prüfen und semanticQa ausfüllen; danach reel:image-qa:validate.');
