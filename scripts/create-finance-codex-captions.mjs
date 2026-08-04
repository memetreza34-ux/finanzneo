#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/create-finance-codex-captions.mjs <projektordner>');
  process.exit(1);
}

const projectRoot = path.resolve(projectArg);
const packageFile = path.join(projectRoot, '06-projektdateien', 'codex-reel-package.json');
if (!fs.existsSync(packageFile)) throw new Error(`Codex-Reel-Paket fehlt: ${packageFile}`);
const reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

const audioRelative = reel.voiceover?.asset;
const captionsRelative = reel.captions?.asset;
if (typeof audioRelative !== 'string' || !audioRelative.trim()) throw new Error('voiceover.asset fehlt im Codex-Reel-Paket.');
if (typeof captionsRelative !== 'string' || !captionsRelative.trim()) throw new Error('captions.asset fehlt im Codex-Reel-Paket.');
if (reel.captions?.mayGenerateProvisionalTimings !== true) {
  throw new Error('Das Codex-Reel-Paket erlaubt keine provisorischen Caption-Zeitstempel.');
}

const audioFile = path.resolve(projectRoot, audioRelative);
const captionsFile = path.resolve(projectRoot, captionsRelative);
if (!fs.existsSync(audioFile) || !fs.statSync(audioFile).isFile()) throw new Error(`Voiceover fehlt: ${audioRelative}`);

const durationSeconds = Number(execFileSync('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1',
  audioFile,
], {encoding: 'utf8'}).trim());
if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) throw new Error('Audiodauer konnte nicht bestimmt werden.');

const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
if (!scenes.length) throw new Error('Das Codex-Reel-Paket enthält keine Szenen.');
const plannedDuration = scenes.reduce((sum, scene) => sum + Number(scene.durationSec || 0), 0);
if (!Number.isFinite(plannedDuration) || plannedDuration <= 0) throw new Error('Geplante Szenendauer ist ungültig.');

const tokenize = (text) => String(text ?? '').trim().split(/\s+/).filter(Boolean);
const tokenWeight = (token) => {
  const letters = token.replace(/[^a-zA-Z0-9äöüÄÖÜß€%]/g, '').length;
  const pause = /[.!?]$/.test(token) ? 2.2 : /[,;:]$/.test(token) ? 1.45 : 1;
  return Math.max(1, Math.sqrt(Math.max(1, letters))) * pause;
};

const audioDurationMs = Math.round(durationSeconds * 1000);
const scale = audioDurationMs / (plannedDuration * 1000);
const captions = [];
const sceneTiming = [];
let cursorMs = 0;

for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex += 1) {
  const scene = scenes[sceneIndex];
  const isLastScene = sceneIndex === scenes.length - 1;
  const sceneDurationMs = isLastScene
    ? audioDurationMs - cursorMs
    : Math.round(Number(scene.durationSec) * 1000 * scale);
  const sceneStartMs = cursorMs;
  const sceneEndMs = Math.min(audioDurationMs, sceneStartMs + Math.max(1, sceneDurationMs));
  const words = tokenize(scene.voiceText);
  if (!words.length) throw new Error(`Szene ${scene.id ?? sceneIndex + 1} enthält keinen Caption-Text.`);
  const weights = words.map(tokenWeight);
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let wordCursor = sceneStartMs;

  for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
    const isLastWord = wordIndex === words.length - 1;
    const share = weights[wordIndex] / totalWeight;
    const next = isLastWord
      ? sceneEndMs
      : Math.min(sceneEndMs, wordCursor + Math.max(1, Math.round((sceneEndMs - sceneStartMs) * share)));
    captions.push({
      text: words[wordIndex],
      startMs: wordCursor,
      endMs: Math.max(wordCursor + 1, next),
      timestampMs: wordCursor,
      confidence: null
    });
    wordCursor = Math.max(wordCursor + 1, next);
  }

  sceneTiming.push({
    sceneId: scene.id,
    startMs: sceneStartMs,
    endMs: sceneEndMs,
    durationSec: Number(((sceneEndMs - sceneStartMs) / 1000).toFixed(3)),
    wordCount: words.length
  });
  cursorMs = sceneEndMs;
}

if (captions.at(-1)) captions.at(-1).endMs = audioDurationMs;
fs.mkdirSync(path.dirname(captionsFile), {recursive: true});
fs.writeFileSync(captionsFile, JSON.stringify(captions, null, 2));

const reportFile = path.join(projectRoot, '06-projektdateien', 'codex-caption-generation.json');
fs.writeFileSync(reportFile, JSON.stringify({
  version: 'finanzneo-codex-caption-v1',
  generatedAt: new Date().toISOString(),
  method: 'provisional-weighted-word-distribution',
  speechRecognitionUsed: false,
  audio: audioRelative,
  audioDurationSec: Number(durationSeconds.toFixed(3)),
  captions: captionsRelative,
  captionCount: captions.length,
  scenes: sceneTiming,
  warning: 'Provisorische, skriptbasierte Zeitstempel. Synchronität muss im vollständigen Render visuell geprüft werden.'
}, null, 2));

console.log(`✓ Provisorische Wort-Captions erzeugt: ${path.relative(process.cwd(), captionsFile)}`);
console.log(`  Wörter: ${captions.length}`);
console.log(`  Audiodauer: ${durationSeconds.toFixed(3)} s`);
console.log(`  Methode: skriptbasierte Gewichtung, keine Spracherkennung`);
console.log(`  Prüfbericht: ${path.relative(process.cwd(), reportFile)}`);
