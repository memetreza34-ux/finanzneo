#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const [target, videoArg] = process.argv.slice(2);
if (!target || !videoArg) {
  console.error('Nutzung: node scripts/validate-cover-frame0-render-v1.mjs <Reel-Pfad> <Candidate-MP4>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.coverHookContract;
if (contract?.id !== 'finanzneo-cover-hook-v3') {
  console.log('✓ Kein Cover-Hook-V3: Frame-0-Hero-Render-Gate bleibt für Legacy-Reels ein No-op.');
  process.exit(0);
}

const videoPath = resolve(videoArg);
if (!existsSync(videoPath)) {
  console.error(`Candidate-MP4 fehlt: ${videoPath}`);
  process.exit(1);
}

const fps = Number(index.video?.fps) || 30;
const first = Array.isArray(index.scenes) ? index.scenes[0] : null;
const durationFrames = Math.max(2, Number(first?.durationFrames) || Math.round(fps * 3));
const layout = index.layout ?? {};
const visualTop = Math.max(320, Number(layout.visualTop) || 320);
const visualBottom = Math.min(1480, Number(layout.visualBottom) || 1400);
const crop = {
  x: 92,
  y: Math.min(visualBottom - 160, visualTop + 70),
  width: 896,
  height: Math.max(160, Math.min(visualBottom - 170, 1260) - Math.min(visualBottom - 160, visualTop + 70)),
};

const extractMetrics = (timeSeconds) => {
  const outWidth = 96;
  const outHeight = 104;
  const result = spawnSync('ffmpeg', [
    '-v', 'error',
    '-ss', Math.max(0, timeSeconds).toFixed(3),
    '-i', videoPath,
    '-vf', `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y},scale=${outWidth}:${outHeight}:flags=area,format=gray`,
    '-frames:v', '1',
    '-f', 'rawvideo',
    '-pix_fmt', 'gray',
    'pipe:1',
  ], {encoding: null, maxBuffer: 5 * 1024 * 1024});

  if (result.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt.');
  if (result.status !== 0 || !result.stdout || result.stdout.length < outWidth * outHeight) {
    throw new Error(`Frame bei ${timeSeconds.toFixed(3)} s konnte nicht gelesen werden.`);
  }

  const bytes = result.stdout.subarray(0, outWidth * outHeight);
  let active = 0;
  let sum = 0;
  for (const value of bytes) {
    sum += value;
    if (value > 18) active += 1;
  }
  return {
    activePixelRatio: active / bytes.length,
    meanLuma: sum / bytes.length,
  };
};

let frame0;
let earlyStable;
try {
  // 12 Frames / 0,4 s sind bewusst früh genug, um nur den Cover-Start zu
  // vergleichen, aber spät genug, um einen versteckten Fade-in zu entlarven.
  const referenceFrame = Math.max(1, Math.min(durationFrames - 1, 12));
  frame0 = extractMetrics(0);
  earlyStable = extractMetrics(referenceFrame / fps);
} catch (error) {
  console.error(`\n✗ Frame-0-Cover-QA konnte nicht ausgeführt werden: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const minImage = Number(index.futurePresentationContract?.minImageActivePixelRatio ?? 0.10);
const minFrame0Active = Math.max(minImage, earlyStable.activePixelRatio * 0.82);
const minFrame0Luma = earlyStable.meanLuma * 0.72;
const failures = [];

if (frame0.activePixelRatio < minFrame0Active) {
  failures.push(`Frame 0 enthält das Hero-Bild nicht bereits vollständig genug (aktive Visualfläche ${frame0.activePixelRatio.toFixed(3)}; benötigt >= ${minFrame0Active.toFixed(3)}).`);
}
if (earlyStable.meanLuma > 4 && frame0.meanLuma < minFrame0Luma) {
  failures.push(`Frame 0 ist gegenüber dem frühen Cover-Zustand zu dunkel (${frame0.meanLuma.toFixed(2)} vs. ${earlyStable.meanLuma.toFixed(2)} Luma). Bild-Fade-in/schwarzer Vorlauf erkannt.`);
}

if (failures.length) {
  console.error('\n✗ COVER FRAME-0 HERO QA NICHT BESTANDEN\n');
  failures.forEach((message) => console.error(`- ${message}`));
  console.error('Frame 0 muss bereits Hero-Bild + Titel als fertiges Cover zeigen.');
  process.exit(1);
}

console.log('\n✓ COVER FRAME-0 HERO QA BESTANDEN');
console.log(`  Frame 0 aktive Visualfläche: ${frame0.activePixelRatio.toFixed(3)} · frühe Referenz: ${earlyStable.activePixelRatio.toFixed(3)}`);
console.log(`  Frame 0 Luma: ${frame0.meanLuma.toFixed(2)} · frühe Referenz: ${earlyStable.meanLuma.toFixed(2)}`);
console.log('  Hero-Bild ist bereits im ersten Videoframe sichtbar; kein schwarzer Bild-Vorlauf erkannt.');
