#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const config = loadFinanceConfig();
const args = process.argv.slice(2);
const videoArg = args.find((arg) => !arg.startsWith('--'));
if (!videoArg) {
  console.error('Nutzung: node scripts/run-finance-render-qa.mjs <video.mp4> [--out=<ordner>]');
  process.exit(1);
}

const video = path.resolve(videoArg);
if (!fs.existsSync(video)) throw new Error(`Video nicht gefunden: ${video}`);
const option = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const outputDir = path.resolve(option('out', path.join(path.dirname(video), `${path.parse(video).name}-qa`)));
const stillsDir = path.join(outputDir, 'stills');
const reportFile = path.join(outputDir, 'report.json');
fs.mkdirSync(stillsDir, {recursive: true});

const capture = (command, commandArgs, label) => {
  const result = spawnSync(command, commandArgs, {encoding: 'utf8'});
  if (result.error) throw new Error(`${label} konnte nicht gestartet werden: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${label} fehlgeschlagen: ${result.stderr || result.stdout}`);
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
};

const findings = [];
const add = (severity, code, message, data) => findings.push({severity, code, message, ...(data ? {data} : {})});
const parseRate = (value) => {
  if (!value) return 0;
  const [numerator, denominator = '1'] = value.split('/').map(Number);
  return denominator ? numerator / denominator : 0;
};

const probe = JSON.parse(capture('ffprobe', [
  '-v', 'error',
  '-show_streams',
  '-show_format',
  '-of', 'json',
  video,
], 'ffprobe'));
const videoStream = probe.streams?.find((stream) => stream.codec_type === 'video');
const audioStream = probe.streams?.find((stream) => stream.codec_type === 'audio');
const durationSeconds = Number(probe.format?.duration ?? videoStream?.duration ?? 0);
const fps = parseRate(videoStream?.avg_frame_rate || videoStream?.r_frame_rate);

if (!videoStream) add('error', 'VIDEO_STREAM_MISSING', 'Die MP4 besitzt keine Videospur.');
if (!audioStream) add('error', 'AUDIO_STREAM_MISSING', 'Die MP4 besitzt keine Audiospur.');
if (videoStream && (videoStream.width !== config.format.width || videoStream.height !== config.format.height)) {
  add('error', 'WRONG_DIMENSIONS', `Export ist ${videoStream.width}×${videoStream.height}; erwartet werden ${config.format.width}×${config.format.height}.`);
}
if (Math.abs(fps - config.format.fps) > 0.05) add('error', 'WRONG_FPS', `Export verwendet ${fps.toFixed(3)} fps statt ${config.format.fps} fps.`);
if (durationSeconds < config.format.durationSeconds.min || durationSeconds > config.format.durationSeconds.max + 0.2) {
  add('error', 'WRONG_DURATION', `Export dauert ${durationSeconds.toFixed(2)} s; erlaubt sind ${config.format.durationSeconds.min}–${config.format.durationSeconds.max} s.`);
}
if (videoStream?.pix_fmt !== config.render.pixelFormat) add('warning', 'PIXEL_FORMAT', `Pixelformat ist ${videoStream?.pix_fmt ?? 'unbekannt'} statt ${config.render.pixelFormat}.`);

const blackLog = capture('ffmpeg', [
  '-hide_banner', '-nostats', '-i', video,
  '-vf', `blackdetect=d=${config.renderQa.blackMinimumDurationSeconds}:pix_th=0.10`,
  '-an', '-f', 'null', '-',
], 'Schwarzbildanalyse');
const blackSegments = [...blackLog.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)]
  .map((match) => ({start: Number(match[1]), end: Number(match[2]), duration: Number(match[3])}));
for (const segment of blackSegments) add('error', 'BLACK_SEGMENT', `Schwarzbild von ${segment.start.toFixed(2)} bis ${segment.end.toFixed(2)} s.`, segment);

const freezeLog = capture('ffmpeg', [
  '-hide_banner', '-nostats', '-i', video,
  '-vf', `freezedetect=n=0.002:d=${config.renderQa.freezeMinimumDurationSeconds}`,
  '-an', '-f', 'null', '-',
], 'Freeze-Analyse');
const freezeStarts = [...freezeLog.matchAll(/freeze_start:\s*([\d.]+)/g)].map((match) => Number(match[1]));
const freezeDurations = [...freezeLog.matchAll(/freeze_duration:\s*([\d.]+)/g)].map((match) => Number(match[1]));
freezeStarts.forEach((start, index) => {
  const duration = freezeDurations[index] ?? config.renderQa.freezeMinimumDurationSeconds;
  add('warning', 'FREEZE_SEGMENT', `Sehr geringe Bildveränderung ab ${start.toFixed(2)} s für etwa ${duration.toFixed(2)} s.`, {start, duration});
});

let integratedLufs = null;
let truePeakDb = null;
if (audioStream) {
  const loudnessLog = capture('ffmpeg', [
    '-hide_banner', '-nostats', '-i', video,
    '-af', 'ebur128=peak=true',
    '-f', 'null', '-',
  ], 'Loudness-Analyse');
  const loudnessMatches = [...loudnessLog.matchAll(/I:\s*(-?[\d.]+)\s+LUFS/g)];
  const peakMatches = [...loudnessLog.matchAll(/Peak:\s*(-?[\d.]+)\s+dBFS/g)];
  integratedLufs = loudnessMatches.length ? Number(loudnessMatches.at(-1)[1]) : null;
  truePeakDb = peakMatches.length ? Number(peakMatches.at(-1)[1]) : null;
  if (integratedLufs === null) add('warning', 'LOUDNESS_UNREADABLE', 'Integrierte Lautheit konnte nicht gelesen werden.');
  else if (integratedLufs < config.renderQa.integratedLufsMin || integratedLufs > config.renderQa.integratedLufsMax) {
    add('error', 'LOUDNESS_OUT_OF_RANGE', `Lautheit liegt bei ${integratedLufs.toFixed(1)} LUFS; erlaubt sind ${config.renderQa.integratedLufsMin} bis ${config.renderQa.integratedLufsMax} LUFS.`);
  }
  if (truePeakDb !== null && truePeakDb > config.renderQa.truePeakMaximumDb) {
    add('error', 'TRUE_PEAK_TOO_HIGH', `True Peak liegt bei ${truePeakDb.toFixed(1)} dBFS; Maximum ist ${config.renderQa.truePeakMaximumDb} dBFS.`);
  }

  const silenceLog = capture('ffmpeg', [
    '-hide_banner', '-nostats', '-i', video,
    '-af', `silencedetect=noise=${config.voice.silenceThresholdDb}dB:d=0.25`,
    '-f', 'null', '-',
  ], 'Stilleanalyse');
  const silenceStarts = [...silenceLog.matchAll(/silence_start:\s*([\d.]+)/g)].map((match) => Number(match[1]));
  const silenceEnds = [...silenceLog.matchAll(/silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)/g)]
    .map((match) => ({end: Number(match[1]), duration: Number(match[2])}));
  if (silenceStarts[0] !== undefined && silenceStarts[0] <= 0.05) {
    const initial = silenceEnds[0]?.duration ?? 0;
    if (initial > config.renderQa.maximumInitialSilenceSeconds) add('error', 'INITIAL_SILENCE', `Anfangsstille dauert ${initial.toFixed(2)} s.`);
  }
  const finalSilence = silenceEnds.findLast((item) => Math.abs(item.end - durationSeconds) < 0.3);
  if (finalSilence && finalSilence.duration > config.renderQa.maximumEndSilenceSeconds) {
    add('error', 'END_SILENCE', `Endstille dauert ${finalSilence.duration.toFixed(2)} s.`);
  }
}

const controlFrameCount = config.renderQa.controlFrameCount;
for (let index = 0; index < controlFrameCount; index += 1) {
  const ratio = controlFrameCount === 1 ? 0.5 : index / (controlFrameCount - 1);
  const timestamp = Math.max(0, Math.min(durationSeconds - 0.05, durationSeconds * ratio));
  const file = path.join(stillsDir, `${String(index + 1).padStart(2, '0')}-${timestamp.toFixed(2)}s.jpg`);
  capture('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', timestamp.toFixed(3), '-i', video,
    '-frames:v', '1', '-q:v', '2',
    file,
  ], `Kontrollframe ${index + 1}`);
}

const report = {
  version: 'finance-render-qa-v1',
  video,
  passed: !findings.some((finding) => finding.severity === 'error'),
  generatedAt: new Date().toISOString(),
  metrics: {
    width: videoStream?.width ?? 0,
    height: videoStream?.height ?? 0,
    fps: Number(fps.toFixed(3)),
    durationSeconds: Number(durationSeconds.toFixed(3)),
    videoCodec: videoStream?.codec_name ?? 'missing',
    pixelFormat: videoStream?.pix_fmt ?? 'missing',
    audioCodec: audioStream?.codec_name ?? 'missing',
    integratedLufs: integratedLufs ?? 'unreadable',
    truePeakDb: truePeakDb ?? 'unreadable',
    blackSegmentCount: blackSegments.length,
    freezeSegmentCount: freezeStarts.length,
    controlFrameCount,
  },
  findings,
};
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(`${report.passed ? '✓' : '✗'} Finance-Render-QA → ${reportFile}`);
console.log(report.metrics);
for (const finding of findings) console.log(`${finding.severity.toUpperCase()} ${finding.code}: ${finding.message}`);
process.exitCode = report.passed ? 0 : 1;
