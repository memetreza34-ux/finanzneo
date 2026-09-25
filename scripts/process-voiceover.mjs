#!/usr/bin/env node

import {existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {basename, relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  isSupportedAudioFile,
  resolveVoiceoverProject,
} from './lib/voiceover-processing.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run audio:process -- <reels/... oder youtube/...>');
  process.exit(1);
}

const project = resolveVoiceoverProject(target);
const {standard} = project;
const settings = standard.voiceover;

const fail = (message) => {
  console.error(`\n✗ ${message}`);
  process.exit(1);
};

const listAudioFiles = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .map((name) => resolve(directory, name))
    .filter((path) => statSync(path).isFile() && isSupportedAudioFile(path));
};

const probeDuration = (path) => {
  const probe = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    path,
  ], {encoding: 'utf8'});

  if (probe.error?.code === 'ENOENT') fail('ffprobe fehlt. FFmpeg/ffprobe muss installiert sein.');
  if (probe.status !== 0) fail(`Audio kann nicht gelesen werden: ${path}`);
  const duration = Number.parseFloat(String(probe.stdout).trim());
  if (!Number.isFinite(duration) || duration <= 0) fail(`Ungültige Audiodauer: ${path}`);
  return duration;
};

if (!existsSync(project.audioDir)) fail(`Audio-Ordner fehlt: ${relative(resolve('.'), project.audioDir)}`);
mkdirSync(project.rawDir, {recursive: true});

let rawFiles = listAudioFiles(project.rawDir);
const topLevelCandidates = listAudioFiles(project.audioDir)
  .filter((path) => basename(path) !== project.outputFile);

if (rawFiles.length > 1) {
  fail(`Im raw/-Ordner liegt mehr als eine Voiceover-Datei: ${rawFiles.map((path) => basename(path)).join(', ')}`);
}
if (rawFiles.length === 1 && topLevelCandidates.length > 0) {
  fail(`Voiceover ist doppelt/mehrdeutig. raw/ enthält ${basename(rawFiles[0])}, zusätzlich liegen oben: ${topLevelCandidates.map((path) => basename(path)).join(', ')}`);
}
if (rawFiles.length === 0) {
  if (topLevelCandidates.length !== 1) {
    fail(`Genau eine rohe Voiceover-Datei erwartet. Gefunden: ${topLevelCandidates.length}. Lege sie in ${relative(project.root, project.rawDir)}/ ab.`);
  }
  const source = topLevelCandidates[0];
  const destination = resolve(project.rawDir, basename(source));
  if (existsSync(destination)) fail(`Zieldatei existiert bereits: ${destination}`);
  renameSync(source, destination);
  rawFiles = [destination];
  console.log(`Raw-Voiceover verschoben: ${relative(project.root, destination)}`);
}

const rawFile = rawFiles[0];
const durationBefore = probeDuration(rawFile);
const temporaryOutput = resolve(project.audioDir, `.voiceover.processed.${process.pid}.tmp.wav`);
rmSync(temporaryOutput, {force: true});

const threshold = `${settings.silenceThresholdDb}dB`;
const audioFilter = [
  `silenceremove=start_periods=1:start_duration=0.10:start_threshold=${threshold}:stop_periods=-1:stop_duration=${settings.minimumSilenceSeconds}:stop_threshold=${threshold}:stop_silence=${settings.targetLongPauseSeconds}`,
  `atempo=${settings.playbackSpeed}`,
].join(',');

const ffmpeg = spawnSync('ffmpeg', [
  '-hide_banner',
  '-loglevel', 'error',
  '-y',
  '-i', rawFile,
  '-vn',
  '-af', audioFilter,
  '-ar', String(settings.sampleRate),
  '-ac', String(settings.channels),
  '-c:a', 'pcm_s16le',
  temporaryOutput,
], {encoding: 'utf8'});

if (ffmpeg.error?.code === 'ENOENT') fail('ffmpeg fehlt. FFmpeg/ffprobe muss installiert sein.');
if (ffmpeg.status !== 0) {
  rmSync(temporaryOutput, {force: true});
  fail(`Voiceover-Verarbeitung fehlgeschlagen: ${String(ffmpeg.stderr || ffmpeg.stdout).trim()}`);
}

const durationAfter = probeDuration(temporaryOutput);
rmSync(project.outputPath, {force: true});
renameSync(temporaryOutput, project.outputPath);

const sourceFile = relative(project.audioDir, rawFile).split(sep).join('/');
const metadata = {
  version: 1,
  contractId: standard.id,
  sourceFile,
  processedFile: project.outputFile,
  speed: settings.playbackSpeed,
  silenceThresholdDb: settings.silenceThresholdDb,
  minimumLongPauseSeconds: settings.minimumSilenceSeconds,
  retainedPauseSeconds: settings.targetLongPauseSeconds,
  durationBefore: Number(durationBefore.toFixed(6)),
  durationAfter: Number(durationAfter.toFixed(6)),
  processedAt: new Date().toISOString(),
  timingAuthority: 'processed-voiceover',
  exclusions: standard.exclusions,
};
writeFileSync(project.metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

console.log('\n✓ VOICEOVER VERARBEITET');
console.log(`  Tempo: ${settings.playbackSpeed}×`);
console.log(`  Lange Pausen: ab ${settings.minimumSilenceSeconds}s auf ungefähr ${settings.targetLongPauseSeconds}s verdichtet`);
console.log(`  Dauer: ${durationBefore.toFixed(2)}s → ${durationAfter.toFixed(2)}s`);
console.log(`  Ausgabe: ${relative(project.root, project.outputPath)}`);
console.log('  Musik/SFX: unverändert; finale Loudness-/True-Peak-Normalisierung bleibt eine separate Render-/Mastering-Stufe.');
console.log(`\nNÄCHSTER PFLICHTSCHRITT: echte Wort-Timings neu aus ${project.outputFile} erzeugen.`);
console.log(`Timing-Datei: ${project.timingsRelative}`);
