#!/usr/bin/env node

import {existsSync, mkdirSync, statSync, writeFileSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  PHASE3_QA_RELATIVE,
  normalizeRepoPath,
  resolveProjectPath,
  sha256File,
  validatePhase3Manifest,
} from './lib/phase3-completion.mjs';

const [target, videoArg, manifestArg] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run reel:phase3:qa -- <Reel-Pfad> [Video-Datei] [phase3-production-manifest.json]');
  process.exit(1);
}

const failures = [];
const fail = (message) => failures.push(message);
let preflight;

try {
  preflight = validatePhase3Manifest(resolve(target), manifestArg ?? null);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  console.error('\nPost-Render-QA abgebrochen. Reel bleibt NOT_COMPLETE.');
  process.exit(1);
}

const {root, index, manifest, manifestPath, scenes, totalFrames} = preflight;
const videoPath = resolveProjectPath(videoArg ?? manifest.output);
const qaPath = resolve(root, index.phase3CompletionContract?.renderQa ?? PHASE3_QA_RELATIVE);
const fps = Number(index.video?.fps) || 30;
const qaRules = index.phase3CompletionContract?.visualQa ?? {};
const layout = index.layout ?? {};

if (!existsSync(videoPath)) {
  console.error(`\n✗ Gerenderte Datei fehlt: ${normalizeRepoPath(relative(resolve('.'), videoPath))}`);
  process.exit(1);
}

const probe = spawnSync('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration,size',
  '-show_entries', 'stream=codec_type,width,height',
  '-of', 'json',
  videoPath,
], {encoding: 'utf8'});

if (probe.error?.code === 'ENOENT') {
  console.error('\n✗ ffprobe fehlt. Post-Render-QA kann nicht durchgeführt werden.');
  process.exit(1);
}
if (probe.status !== 0) {
  console.error('\n✗ Finale Candidate-MP4 ist nicht lesbar.');
  process.exit(1);
}

let media;
try {
  media = JSON.parse(probe.stdout);
} catch {
  media = null;
}

const videoStream = media?.streams?.find((stream) => stream.codec_type === 'video' || (stream.width && stream.height));
const audioStream = media?.streams?.find((stream) => stream.codec_type === 'audio');
const width = Number(videoStream?.width);
const height = Number(videoStream?.height);
const duration = Number(media?.format?.duration);
const videoSize = Number(media?.format?.size ?? statSync(videoPath).size);
const expectedDuration = totalFrames / fps;

if (width !== 1080 || height !== 1920) fail(`Finalvideo muss 1080×1920 sein, ist ${width || '?'}×${height || '?'}.`);
if (!audioStream) fail('Finalvideo enthält keinen Audio-Stream. Voiceover wurde nicht in den Render eingebunden.');
if (!Number.isFinite(duration) || duration <= 0) fail('Videodauer ist nicht lesbar.');
if (Number.isFinite(duration) && Math.abs(duration - expectedDuration) > 0.6) {
  fail(`Videodauer ${duration.toFixed(2)} s passt nicht zur Produktions-Timeline ${expectedDuration.toFixed(2)} s.`);
}
if (!Number.isFinite(videoSize) || videoSize < 100000) fail('Finalvideo ist auffällig klein/leer.');

// Nur den visuellen Kern prüfen. Header oben und Caption-Backplate unten sind
// absichtlich NICHT im Sample. Sonst könnte eine reine Caption-Szene die QA
// fälschlich als "visuell belegt" bestehen.
const declaredVisualTop = Math.max(0, Number(layout.visualTop) || 390);
const declaredVisualBottom = Math.min(1920, Number(layout.visualBottom) || 1560);
const cropX = 92;
const cropY = Math.min(declaredVisualBottom - 160, declaredVisualTop + 70);
const cropWidth = 896;
const cropBottom = Math.max(cropY + 160, Math.min(declaredVisualBottom - 170, 1340));
const cropHeight = Math.max(160, cropBottom - cropY);
const sampleWidth = 96;
const sampleHeight = 104;

const extractGray = (timeSeconds) => {
  const args = [
    '-v', 'error',
    '-ss', Math.max(0, timeSeconds).toFixed(3),
    '-i', videoPath,
    '-vf', `crop=${cropWidth}:${cropHeight}:${cropX}:${cropY},scale=${sampleWidth}:${sampleHeight}:flags=area,format=gray`,
    '-frames:v', '1',
    '-f', 'rawvideo',
    '-pix_fmt', 'gray',
    'pipe:1',
  ];
  const result = spawnSync('ffmpeg', args, {encoding: null, maxBuffer: 5 * 1024 * 1024});
  if (result.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt.');
  if (result.status !== 0 || !result.stdout || result.stdout.length < sampleWidth * sampleHeight) {
    throw new Error(`Frame bei ${timeSeconds.toFixed(2)} s konnte nicht gelesen werden.`);
  }
  return Buffer.from(result.stdout.subarray(0, sampleWidth * sampleHeight));
};

const frameMetrics = (buffer) => {
  const values = [...buffer];
  const count = values.length;
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / count;
  const stdDev = Math.sqrt(variance);
  const sorted = values.slice().sort((a, b) => a - b);
  const p10 = sorted[Math.floor((count - 1) * 0.10)];
  const p90 = sorted[Math.floor((count - 1) * 0.90)];
  let edgeSum = 0;
  let edgeCount = 0;

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const i = y * sampleWidth + x;
      if (x + 1 < sampleWidth) {
        edgeSum += Math.abs(values[i] - values[i + 1]);
        edgeCount += 1;
      }
      if (y + 1 < sampleHeight) {
        edgeSum += Math.abs(values[i] - values[i + sampleWidth]);
        edgeCount += 1;
      }
    }
  }

  return {
    mean: Number(mean.toFixed(3)),
    stdDev: Number(stdDev.toFixed(3)),
    contrastP90P10: p90 - p10,
    edgeMean: Number((edgeSum / Math.max(1, edgeCount)).toFixed(3)),
  };
};

const meanAbsDiff = (a, b) => {
  const count = Math.min(a.length, b.length);
  let total = 0;
  for (let i = 0; i < count; i += 1) total += Math.abs(a[i] - b[i]);
  return total / Math.max(1, count);
};

const hasVisualStructure = (metrics) => (
  metrics.stdDev >= Number(qaRules.minStdDev ?? 4) &&
  metrics.contrastP90P10 >= Number(qaRules.minContrastP90P10 ?? 12) &&
  metrics.edgeMean >= Number(qaRules.minEdgeMean ?? 0.5)
);

const sceneQa = [];
for (const scene of scenes) {
  const ratios = scene.type === 'animation'
    ? (Array.isArray(qaRules.sampleAnimationRatios) ? qaRules.sampleAnimationRatios : [0.2, 0.5, 0.8])
    : (Array.isArray(qaRules.sampleImageRatios) ? qaRules.sampleImageRatios : [0.5]);
  const buffers = [];
  const samples = [];

  try {
    for (const ratio of ratios) {
      const frame = scene.startFrame + Math.max(1, Math.min(scene.durationFrames - 1, Math.round(scene.durationFrames * Number(ratio))));
      const time = frame / fps;
      const buffer = extractGray(time);
      buffers.push(buffer);
      samples.push({ratio, frame, time: Number(time.toFixed(3)), metrics: frameMetrics(buffer)});
    }
  } catch (error) {
    fail(`${scene.id}: ${error instanceof Error ? error.message : String(error)}`);
    sceneQa.push({id: scene.id, type: scene.type, passed: false, samples, error: String(error)});
    continue;
  }

  const structured = samples.filter((sample) => hasVisualStructure(sample.metrics)).length;
  let passed = true;
  let animationMeanAbsDiff = null;

  if (scene.type === 'image') {
    if (structured < 1) {
      passed = false;
      fail(`${scene.id}: visueller Kern wirkt leer/caption-only; erwartetes Bild ist im Render nicht sicher sichtbar.`);
    }
  } else {
    if (structured < 2) {
      passed = false;
      fail(`${scene.id}: Animationsszene hat zu wenig sichtbaren Inhalt im visuellen Kern.`);
    }
    const diffs = [];
    for (let i = 1; i < buffers.length; i += 1) diffs.push(meanAbsDiff(buffers[i - 1], buffers[i]));
    animationMeanAbsDiff = diffs.length ? Math.max(...diffs) : 0;
    if (animationMeanAbsDiff < Number(qaRules.minAnimationMeanAbsDiff ?? 1)) {
      passed = false;
      fail(`${scene.id}: Animation zeigt praktisch keine Bewegung im visuellen Kern (Diff ${animationMeanAbsDiff.toFixed(3)}).`);
    }
  }

  sceneQa.push({
    id: scene.id,
    type: scene.type,
    passed,
    structuredSamples: structured,
    animationMeanAbsDiff: animationMeanAbsDiff === null ? null : Number(animationMeanAbsDiff.toFixed(3)),
    samples,
  });
}

const qa = {
  version: 1,
  contractId: index.phase3CompletionContract?.id,
  status: failures.length === 0 ? 'PASSED' : 'FAILED',
  generatedAt: new Date().toISOString(),
  reelProject: normalizeRepoPath(relative(resolve('.'), root)),
  composition: manifest.composition,
  validatedVideoPath: normalizeRepoPath(manifest.output),
  analyzedVideoPath: normalizeRepoPath(relative(resolve('.'), videoPath)),
  videoSha256: sha256File(videoPath),
  videoSize,
  sceneIndexSha256: sha256File(resolve(root, '03-szenen/scene-index.json')),
  productionManifestSha256: sha256File(manifestPath),
  width,
  height,
  duration,
  expectedDuration,
  fps,
  audioStreamPresent: Boolean(audioStream),
  visualCrop: {x: cropX, y: cropY, width: cropWidth, height: cropHeight, excludesHeaderAndCaptions: true},
  sceneCount: scenes.length,
  imageSceneCount: scenes.filter((scene) => scene.type === 'image').length,
  animationSceneCount: scenes.filter((scene) => scene.type === 'animation').length,
  checks: {
    allScenesImplemented: true,
    audioStreamPresent: Boolean(audioStream),
    captionOnlySceneForbidden: true,
    visualCoreSampledPerScene: true,
    animationMotionChecked: true,
    exactVideoHashRecorded: true,
  },
  failures,
  scenes: sceneQa,
};

mkdirSync(dirname(qaPath), {recursive: true});
writeFileSync(qaPath, `${JSON.stringify(qa, null, 2)}\n`, 'utf8');

if (failures.length) {
  console.error('\n✗ PHASE-3-RENDER-QA NICHT BESTANDEN\n');
  failures.forEach((message) => console.error(`- ${message}`));
  console.error(`\nQA-Bericht: ${normalizeRepoPath(relative(resolve('.'), qaPath))}`);
  console.error('Reel bleibt NOT_COMPLETE. Candidate-MP4 darf nicht als final ausgeliefert werden.');
  process.exit(1);
}

console.log('\n✓ PHASE-3-RENDER-QA BESTANDEN');
console.log(`  ${scenes.length}/${scenes.length} Szenen im visuellen Kern belegt · Bildszenen sichtbar · Animationsbewegung geprüft · Audio vorhanden`);
console.log(`  QA-Bericht: ${normalizeRepoPath(relative(resolve('.'), qaPath))}`);
