#!/usr/bin/env node

import {existsSync, readFileSync, renameSync, rmSync} from 'node:fs';
import {basename, dirname, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const [target, videoArg] = process.argv.slice(2);
if (!target || !videoArg) {
  console.error('Nutzung: node scripts/normalize-future-reel-audio-v3.mjs <Reel-Pfad> <Candidate-MP4>');
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
  console.log('✓ Kein Future-Production-V3-Marker: Audio bleibt für dieses bestehende Reel unverändert.');
  process.exit(0);
}
if (contract.id !== CONTRACT_ID) {
  console.error(`Unbekannter Future-Production-Vertrag: ${String(contract.id)}`);
  process.exit(1);
}

const audio = contract.audioMastering ?? {};
if (audio.normalizeBeforeRenderQa !== true) {
  console.error('Future V3 verlangt normalizeBeforeRenderQa=true.');
  process.exit(1);
}

const videoPath = resolve(videoArg);
if (!existsSync(videoPath)) {
  console.error(`Candidate-MP4 fehlt: ${videoPath}`);
  process.exit(1);
}

const targetI = Number(audio.targetIntegratedLufs);
const targetTp = Number(audio.targetTruePeakDbtp);
const targetLra = Number(audio.targetLra ?? 11);
const bitrate = String(audio.audioBitrate ?? '320k');
const sampleRate = Number(audio.sampleRate ?? 48000);
const tempPath = resolve(dirname(videoPath), `${basename(videoPath).replace(/\.mp4$/i, '')}.audio-mastered.mp4`);

if (existsSync(tempPath)) rmSync(tempPath, {force: true});

const result = spawnSync('ffmpeg', [
  '-y',
  '-hide_banner',
  '-loglevel', 'error',
  '-i', videoPath,
  '-map', '0:v:0',
  '-map', '0:a:0',
  '-c:v', 'copy',
  '-af', `loudnorm=I=${targetI}:TP=${targetTp}:LRA=${targetLra}`,
  '-c:a', 'aac',
  '-b:a', bitrate,
  '-ar', String(sampleRate),
  '-movflags', '+faststart',
  tempPath,
], {encoding: 'utf8'});

if (result.error?.code === 'ENOENT') {
  console.error('ffmpeg fehlt. Future-V3-Audio-Mastering kann nicht durchgeführt werden.');
  process.exit(1);
}
if (result.status !== 0 || !existsSync(tempPath)) {
  if (existsSync(tempPath)) rmSync(tempPath, {force: true});
  console.error('Future-V3-Audio-Mastering ist fehlgeschlagen. Candidate bleibt nicht freigabefähig.');
  if (result.stderr) console.error(result.stderr.trim());
  process.exit(result.status ?? 1);
}

rmSync(videoPath, {force: true});
renameSync(tempPath, videoPath);

console.log(`✓ Future-V3-Audio gemastert: Ziel ${targetI} LUFS · ${targetTp} dBTP · ${bitrate} · ${sampleRate} Hz.`);
console.log('  Video wurde nicht neu encodiert; nur die finale Audiomischung wurde vor der Render-QA normalisiert.');
