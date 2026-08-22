#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {relative, resolve, sep} from 'node:path';
import {analyzeReelFinalExport} from './lib/reel-final-export.mjs';
import {REEL_FINAL_EXPORT} from './lib/reel-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run reel:final -- reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('reels'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein Reel-Projekt unter reels/ sein.');
  process.exit(1);
}

const contract = spawnSync(process.execPath, [resolve('scripts/validate-reel.mjs'), root], {stdio: 'inherit'});
if (contract.status !== 0) process.exit(contract.status ?? 1);

const result = analyzeReelFinalExport(root);
if (!result.ready) {
  console.error('\nFinaler Export ist unvollständig:');
  result.blockers.forEach((blocker) => console.error(`- ${blocker}`));
  console.error('\n✗ Reel ist noch nicht fertig.');
  process.exit(1);
}

const probe = (path) => {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'stream=codec_type,width,height,r_frame_rate',
    '-of', 'json',
    path,
  ], {encoding: 'utf8'});
  if (result.error?.code === 'ENOENT') {
    console.error('\n✗ ffprobe fehlt für die finale Exportprüfung.');
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`\n✗ Exportdatei ist unlesbar oder beschädigt: ${path}`);
    process.exit(1);
  }
  try {
    return JSON.parse(result.stdout)?.streams ?? [];
  } catch {
    console.error(`\n✗ Medieninformationen sind nicht lesbar: ${path}`);
    process.exit(1);
  }
};

const videoStreams = probe(result.videoPath);
const video = videoStreams.find((stream) => stream.codec_type === 'video');
const audio = videoStreams.find((stream) => stream.codec_type === 'audio');
const [fpsNumerator, fpsDenominator] = String(video?.r_frame_rate ?? '').split('/').map(Number);
const fps = fpsDenominator > 0 ? fpsNumerator / fpsDenominator : Number.NaN;
if (Number(video?.width) !== REEL_FINAL_EXPORT.video.width
  || Number(video?.height) !== REEL_FINAL_EXPORT.video.height
  || Math.abs(fps - REEL_FINAL_EXPORT.video.fps) > 0.01) {
  console.error(`\n✗ ${REEL_FINAL_EXPORT.videoFile} muss ${REEL_FINAL_EXPORT.video.width} × ${REEL_FINAL_EXPORT.video.height} bei ${REEL_FINAL_EXPORT.video.fps} fps sein.`);
  process.exit(1);
}
if (REEL_FINAL_EXPORT.video.audioRequired && !audio) {
  console.error(`\n✗ ${REEL_FINAL_EXPORT.videoFile} enthält keine Audiospur.`);
  process.exit(1);
}

const coverStreams = probe(result.coverPath);
const cover = coverStreams.find((stream) => stream.codec_type === 'video');
if (Number(cover?.width) !== REEL_FINAL_EXPORT.cover.width
  || Number(cover?.height) !== REEL_FINAL_EXPORT.cover.height) {
  console.error(`\n✗ ${REEL_FINAL_EXPORT.coverFile} muss ${REEL_FINAL_EXPORT.cover.width} × ${REEL_FINAL_EXPORT.cover.height} sein.`);
  process.exit(1);
}

console.log('\n✓ REEL FINAL');
console.log(`  Video: ${REEL_FINAL_EXPORT.videoFile}`);
console.log(`  Cover: ${REEL_FINAL_EXPORT.coverFile}`);
console.log('  Beide Dateien sind lesbar und entsprechen dem zentralen Exportvertrag.');
