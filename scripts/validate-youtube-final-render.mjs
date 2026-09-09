#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {analyzeYouTubeReadiness} from './lib/youtube-readiness.mjs';
import {
  CAPTION_LAYER_ID,
  PRODUCTION_MANIFEST,
  VISUAL_INDEX,
  YOUTUBE_VIDEO_FPS,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
} from './lib/youtube-contract.mjs';

const [target, videoArg] = process.argv.slice(2);
if (!target || !videoArg) {
  console.error('Nutzung: npm run youtube:final:qa -- youtube/<Projekt> <video.mp4>');
  process.exit(1);
}
const root = resolve(target);
const video = resolve(videoArg);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}
if (!existsSync(video)) {
  console.error(`Finalvideo fehlt: ${video}`);
  process.exit(1);
}

const readiness = analyzeYouTubeReadiness(root);
if (!readiness.ready) {
  console.error('Finalrender-QA verweigert: Projekt ist nicht youtube:ready.');
  [...readiness.phase1Blockers, ...readiness.phase2Blockers].forEach((blocker) => console.error(`- ${blocker}`));
  process.exit(1);
}

const failures = [];
const run = (command, args, loglevel = false) => {
  const result = spawnSync(command, args, {encoding: 'utf8'});
  if (result.error?.code === 'ENOENT') {
    failures.push(`${command} fehlt.`);
    return '';
  }
  if (result.status !== 0) {
    failures.push(`${command} konnte den Finalrender nicht prüfen.`);
    return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  }
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
};

const probeText = run('ffprobe', ['-v','error','-show_entries','format=duration:stream=index,codec_type,width,height,r_frame_rate','-of','json',video]);
let probe = null;
try { probe = JSON.parse(probeText.trim()); } catch { failures.push('ffprobe-Ausgabe ist ungültig.'); }
const videoStream = probe?.streams?.find((stream) => stream.codec_type === 'video');
const audioStream = probe?.streams?.find((stream) => stream.codec_type === 'audio');
const width = Number(videoStream?.width);
const height = Number(videoStream?.height);
if (width !== YOUTUBE_VIDEO_WIDTH || height !== YOUTUBE_VIDEO_HEIGHT) failures.push(`Finalrender muss ${YOUTUBE_VIDEO_WIDTH}×${YOUTUBE_VIDEO_HEIGHT} sein, ist aber ${width}×${height}.`);
const fpsParts = String(videoStream?.r_frame_rate ?? '').split('/').map(Number);
const fps = fpsParts.length === 2 && fpsParts[1] ? fpsParts[0] / fpsParts[1] : NaN;
if (!Number.isFinite(fps) || Math.abs(fps - YOUTUBE_VIDEO_FPS) > 0.01) failures.push(`Finalrender muss ${YOUTUBE_VIDEO_FPS} fps haben, ist aber ${fps}.`);
if (!audioStream) failures.push('Finalrender enthält keinen Audio-Stream.');

const index = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
const duration = Number(probe?.format?.duration);
const minDuration = Number(index?.targetDurationSeconds?.min ?? 420);
const maxDuration = Number(index?.targetDurationSeconds?.max ?? 660);
if (!Number.isFinite(duration) || duration < minDuration || duration > maxDuration) failures.push(`Finaldauer ${duration.toFixed?.(1) ?? duration}s liegt außerhalb ${minDuration}–${maxDuration}s.`);

const manifestPath = resolve(root, PRODUCTION_MANIFEST);
if (!existsSync(manifestPath)) failures.push(`${PRODUCTION_MANIFEST} fehlt.`);
else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const productionSource = resolve(root, manifest.productionSourceFile ?? '');
  if (!manifest.compositionId) failures.push(`${PRODUCTION_MANIFEST}: compositionId fehlt.`);
  if (!existsSync(productionSource)) failures.push(`${PRODUCTION_MANIFEST}: productionSourceFile fehlt.`);
  else {
    const source = readFileSync(productionSource, 'utf8');
    if (!source.includes('YouTubeCaptionLayer') || !source.includes(CAPTION_LAYER_ID)) failures.push(`Production-Composition bindet den verpflichtenden Caption-Layer ${CAPTION_LAYER_ID} nicht ein.`);
  }
}

// Staticness QA: compare each 1-second sample to the preceding sample using a difference frame.
// YAVG < 2 is effectively unchanged for this deep-black visual language.
const staticText = run('ffmpeg', ['-hide_banner','-loglevel','error','-i',video,'-vf','fps=1,tblend=all_mode=difference,signalstats,metadata=print:file=-','-an','-f','null','-']);
const values = [...staticText.matchAll(/lavfi\.signalstats\.YAVG=([0-9.]+)/g)].map((match) => Number(match[1]));
if (values.length < 20) failures.push('Staticness-QA konnte zu wenige Samples lesen.');
else {
  const threshold = 2;
  let maxRun = 0;
  let runLength = 0;
  let staticCount = 0;
  for (const value of values) {
    if (value < threshold) {
      staticCount += 1;
      runLength += 1;
      maxRun = Math.max(maxRun, runLength);
    } else runLength = 0;
  }
  const staticRatio = staticCount / values.length;
  if (maxRun > 8) failures.push(`Finalrender enthält einen nahezu statischen Abschnitt von ca. ${maxRun}s; Maximum sind 8s.`);
  if (staticRatio > 0.5) failures.push(`Finalrender ist in ${(staticRatio * 100).toFixed(1)} % der 1-Sekunden-Vergleiche nahezu unverändert; Maximum sind 50 %.`);
}

if (failures.length) {
  console.error('\nYouTube Finalrender-QA verletzt:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\n✓ YOUTUBE FINALRENDER QA BESTANDEN');
console.log(`  ${YOUTUBE_VIDEO_WIDTH}×${YOUTUBE_VIDEO_HEIGHT} · ${YOUTUBE_VIDEO_FPS} fps · Audio vorhanden · Caption-Layer gebunden · Staticness-Gate bestanden.`);
