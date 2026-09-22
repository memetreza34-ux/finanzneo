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

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run reel:image-qa:prepare -- reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, SCENE_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${SCENE_INDEX} fehlt.`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const images = [];
if (typeof index.cover?.googleFlowFileName === 'string') {
  images.push({sceneId: 'cover', fileName: index.cover.googleFlowFileName, role: 'cover'});
}
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image' || typeof scene.googleFlowFileName !== 'string') continue;
  if (images.some((item) => item.fileName === scene.googleFlowFileName)) continue;
  images.push({sceneId: scene.id, fileName: scene.googleFlowFileName, role: 'scene'});
}

const runRaw = (file, filter) => {
  const result = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', filter, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'gray', 'pipe:1'], {encoding: null, maxBuffer: 4 * 1024 * 1024});
  if (result.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt.');
  if (result.status !== 0) throw new Error(`ffmpeg konnte ${file} nicht lesen.`);
  return result.stdout;
};

const rows = [];
for (const item of images) {
  const file = resolve(root, IMAGE_INBOX, item.fileName);
  if (!existsSync(file)) {
    console.error(`Fehlendes Bild: ${IMAGE_INBOX}/${item.fileName}`);
    process.exit(1);
  }
  const hashBytes = runRaw(file, 'scale=9:8:flags=area');
  const statBytes = runRaw(file, 'scale=32:32:flags=area');
  if (hashBytes.length !== 72 || statBytes.length !== 1024) {
    console.error(`Unerwartete Pixelprobe für ${item.fileName}.`);
    process.exit(1);
  }
  rows.push({...item, dHash: dHashFromGray9x8(hashBytes), luminance: luminanceStats(statBytes)});
}

for (let i = 0; i < rows.length; i += 1) {
  let nearest = null;
  let nearestSceneId = null;
  for (let j = 0; j < rows.length; j += 1) {
    if (i === j) continue;
    const distance = hammingDistanceHex(rows[i].dHash, rows[j].dHash);
    if (distance !== null && (nearest === null || distance < nearest)) {
      nearest = distance;
      nearestSceneId = rows[j].sceneId;
    }
  }
  const result = evaluatePixelQa({stats: rows[i].luminance, nearestDistance: nearest});
  rows[i].pixelQa = {...result, nearestDistance: nearest, nearestSceneId};
}

const existingPath = resolve(root, POST_GENERATION_QA_FILE);
let existing = null;
if (existsSync(existingPath)) {
  try { existing = JSON.parse(readFileSync(existingPath, 'utf8')); } catch { existing = null; }
}
const previousAssessments = new Map((existing?.images ?? []).map((entry) => [entry.fileName, entry.semanticQa]));
const report = {
  id: POST_GENERATION_QA_ID,
  pixelQaVersion: PIXEL_QA_VERSION,
  generatedAt: new Date().toISOString(),
  instructions: {
    semanticQaMustInspectActualPixels: true,
    doNotInferFromPromptOrFileName: true,
    failMeansRegenerateSameImageNumber: true,
    doNotAdvanceSingleJobQueueOnFail: true,
  },
  images: rows.map((row) => ({
    sceneId: row.sceneId,
    fileName: row.fileName,
    role: row.role,
    dHash: row.dHash,
    luminance: row.luminance,
    pixelQa: row.pixelQa,
    semanticQa: previousAssessments.get(row.fileName) ?? emptySemanticAssessment(row.sceneId, row.fileName),
  })),
};
writeFileSync(existingPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const failed = report.images.filter((entry) => entry.pixelQa.status !== 'PASS');
console.log(`\n✓ Pixel-QA vorbereitet: ${report.images.length} Bilder geprüft.`);
if (failed.length) {
  console.error(`✗ ${failed.length} Bild(er) fallen bereits in der Pixel-QA durch.`);
  for (const entry of failed) console.error(`- ${entry.sceneId}: ${entry.pixelQa.blockers.join(' | ')}`);
  console.error('Gleiche Bildnummer neu generieren; Queue nicht fortsetzen.');
  process.exit(1);
}
console.log(`✓ Report: ${POST_GENERATION_QA_FILE}`);
console.log('Nächster Schritt: tatsächliche Pixel visuell prüfen und semanticQa je Bild ausfüllen; danach reel:image-qa:validate.');
