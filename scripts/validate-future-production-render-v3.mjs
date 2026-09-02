#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const [target, videoArg] = process.argv.slice(2);
if (!target || !videoArg) {
  console.error('Nutzung: node scripts/validate-future-production-render-v3.mjs <Reel-Pfad> <Candidate-MP4>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-future-production-v3';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.futureProductionStandard;
if (!contract) {
  console.log('✓ Kein Future-Production-V3-Marker: zusätzliche Render-QA wird für dieses bestehende Reel nicht rückwirkend erzwungen.');
  process.exit(0);
}
if (contract.id !== CONTRACT_ID) {
  console.error(`Unbekannter Future-Production-Vertrag: ${String(contract.id)}`);
  process.exit(1);
}

const videoPath = resolve(videoArg);
if (!existsSync(videoPath)) {
  console.error(`Candidate-MP4 fehlt: ${videoPath}`);
  process.exit(1);
}

const failures = [];
const fail = (message) => failures.push(message);
const audio = contract.audioMastering ?? {};
const framing = contract.animationFraming ?? {};

// ── Audio-Lautheit am echten gemasterten Candidate messen ──────────────────
const loudnessProbe = spawnSync('ffmpeg', [
  '-hide_banner',
  '-nostats',
  '-i', videoPath,
  '-map', '0:a:0',
  '-af', `loudnorm=I=${Number(audio.targetIntegratedLufs)}:TP=${Number(audio.targetTruePeakDbtp)}:LRA=${Number(audio.targetLra ?? 11)}:print_format=json`,
  '-f', 'null',
  '-',
], {encoding: 'utf8', maxBuffer: 10 * 1024 * 1024});

if (loudnessProbe.error?.code === 'ENOENT') {
  fail('ffmpeg fehlt; Future-V3-Lautheits-QA kann nicht durchgeführt werden.');
}

let loudness = null;
if (!loudnessProbe.error) {
  const stderr = String(loudnessProbe.stderr ?? '');
  const blocks = stderr.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/g) ?? [];
  const raw = blocks.at(-1);
  if (!raw) {
    fail('Loudnorm-Messwerte konnten aus ffmpeg nicht gelesen werden.');
  } else {
    try {
      const parsed = JSON.parse(raw);
      loudness = {
        integratedLufs: Number(parsed.input_i),
        truePeakDbtp: Number(parsed.input_tp),
        lra: Number(parsed.input_lra),
      };
      const targetI = Number(audio.targetIntegratedLufs);
      const tolerance = Number(audio.integratedLufsTolerance);
      const maxTp = Number(audio.maxTruePeakDbtp);
      if (!Number.isFinite(loudness.integratedLufs) || Math.abs(loudness.integratedLufs - targetI) > tolerance) {
        fail(`Audio liegt bei ${Number.isFinite(loudness.integratedLufs) ? loudness.integratedLufs.toFixed(2) : '?'} LUFS; Future V3 verlangt ${targetI} ± ${tolerance} LU.`);
      }
      if (!Number.isFinite(loudness.truePeakDbtp) || loudness.truePeakDbtp > maxTp) {
        fail(`True Peak liegt bei ${Number.isFinite(loudness.truePeakDbtp) ? loudness.truePeakDbtp.toFixed(2) : '?'} dBTP; Future V3 erlaubt maximal ${maxTp} dBTP.`);
      }
    } catch (error) {
      fail(`Loudnorm-JSON ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// ── Tatsächliche Animationsbelegung im visuellen Kern messen ───────────────
const fps = Number(index.video?.fps) || 30;
const layout = index.layout ?? {};
const declaredVisualTop = Math.max(320, Number(layout.visualTop) || 320);
const declaredVisualBottom = Math.min(1480, Number(layout.visualBottom) || 1480);
const cropX = 92;
const cropY = Math.min(declaredVisualBottom - 160, declaredVisualTop + 70);
const cropWidth = 896;
const cropBottom = Math.max(cropY + 160, Math.min(declaredVisualBottom - 170, 1260));
const cropHeight = Math.max(160, cropBottom - cropY);
const sampleWidth = 96;
const sampleHeight = 104;
const ratios = Array.isArray(framing.sampleRatios) ? framing.sampleRatios.map(Number) : [0.2, 0.5, 0.8];
const minPeak = Number(framing.minPeakActivePixelRatio);
const minMedian = Number(framing.minMedianActivePixelRatio);

const extractActiveRatio = (timeSeconds) => {
  const result = spawnSync('ffmpeg', [
    '-v', 'error',
    '-ss', Math.max(0, timeSeconds).toFixed(3),
    '-i', videoPath,
    '-vf', `crop=${cropWidth}:${cropHeight}:${cropX}:${cropY},scale=${sampleWidth}:${sampleHeight}:flags=area,format=gray`,
    '-frames:v', '1',
    '-f', 'rawvideo',
    '-pix_fmt', 'gray',
    'pipe:1',
  ], {encoding: null, maxBuffer: 5 * 1024 * 1024});
  if (result.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt.');
  if (result.status !== 0 || !result.stdout || result.stdout.length < sampleWidth * sampleHeight) {
    throw new Error(`Frame bei ${timeSeconds.toFixed(2)} s konnte nicht gelesen werden.`);
  }
  const bytes = result.stdout.subarray(0, sampleWidth * sampleHeight);
  let active = 0;
  for (const value of bytes) if (value > 18) active += 1;
  return active / bytes.length;
};

const animationQa = [];
for (const scene of (Array.isArray(index.scenes) ? index.scenes : []).filter((item) => item?.type === 'animation')) {
  const durationFrames = Number(scene.durationFrames);
  const startFrame = Number(scene.startFrame);
  if (!Number.isFinite(durationFrames) || durationFrames <= 1 || !Number.isFinite(startFrame)) {
    fail(`${scene.id}: startFrame/durationFrames fehlen für Future-V3-Occupancy-QA.`);
    continue;
  }

  const samples = [];
  try {
    for (const ratio of ratios) {
      const localFrame = Math.max(1, Math.min(durationFrames - 1, Math.round(durationFrames * ratio)));
      const frame = startFrame + localFrame;
      const time = frame / fps;
      samples.push({ratio, frame, time: Number(time.toFixed(3)), activePixelRatio: extractActiveRatio(time)});
    }
  } catch (error) {
    fail(`${scene.id}: ${error instanceof Error ? error.message : String(error)}`);
    animationQa.push({id: scene.id, passed: false, samples});
    continue;
  }

  const values = samples.map((sample) => sample.activePixelRatio).sort((a, b) => a - b);
  const peak = Math.max(...values);
  const median = values[Math.floor(values.length / 2)];
  let passed = true;
  if (peak < minPeak) {
    passed = false;
    fail(`${scene.id}: Hauptmechanik bleibt zu klein/leer (Peak active-pixel ratio ${peak.toFixed(3)}; Future V3 verlangt >= ${minPeak.toFixed(2)}).`);
  }
  if (median < minMedian) {
    passed = false;
    fail(`${scene.id}: Animation nutzt im typischen Verlauf zu wenig aktive Visualfläche (Median ${median.toFixed(3)}; Future V3 verlangt >= ${minMedian.toFixed(2)}).`);
  }
  animationQa.push({
    id: scene.id,
    passed,
    peakActivePixelRatio: Number(peak.toFixed(4)),
    medianActivePixelRatio: Number(median.toFixed(4)),
    samples: samples.map((sample) => ({...sample, activePixelRatio: Number(sample.activePixelRatio.toFixed(4))})),
  });
}

const reportPath = resolve(root, '05-projektdateien/future-production-v3-render-qa.json');
mkdirSync(dirname(reportPath), {recursive: true});
writeFileSync(reportPath, `${JSON.stringify({
  version: 1,
  contractId: CONTRACT_ID,
  status: failures.length ? 'FAILED' : 'PASSED',
  generatedAt: new Date().toISOString(),
  loudness,
  animationFraming: {
    minPeakActivePixelRatio: minPeak,
    minMedianActivePixelRatio: minMedian,
    scenes: animationQa,
  },
  failures,
}, null, 2)}\n`, 'utf8');

if (failures.length) {
  console.error('\n✗ FUTURE-PRODUCTION-V3-RENDER-QA NICHT BESTANDEN\n');
  failures.forEach((message) => console.error(`- ${message}`));
  console.error(`\nQA-Bericht: ${reportPath}`);
  process.exit(1);
}

console.log('\n✓ FUTURE-PRODUCTION-V3-RENDER-QA BESTANDEN');
console.log(`  Audio: ${loudness?.integratedLufs?.toFixed(2) ?? '?'} LUFS · True Peak ${loudness?.truePeakDbtp?.toFixed(2) ?? '?'} dBTP.`);
console.log(`  Animationen: ${animationQa.length}/${animationQa.length} erfüllen größere/füllendere Hauptmechanik im echten Render.`);
