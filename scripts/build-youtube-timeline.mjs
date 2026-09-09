#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {TIMELINE, VISUAL_INDEX, WORD_TIMINGS, YOUTUBE_VIDEO_FPS} from './lib/youtube-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:timeline:build -- youtube/<Projekt>');
  process.exit(1);
}
const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
const timing = JSON.parse(readFileSync(resolve(root, WORD_TIMINGS), 'utf8'));
const words = Array.isArray(timing.words) && timing.words.length
  ? timing.words
  : (timing.sentences ?? []).flatMap((sentence) => sentence.words ?? []);
if (words.length < 50) {
  console.error(`${WORD_TIMINGS} enthält keine vollständigen echten Wort-Timestamps.`);
  process.exit(1);
}

const visuals = index.visuals ?? [];
const errors = [];
let expectedWordStart = 0;
const timelineVisuals = [];
let previousEndFrame = 0;
for (const visual of visuals) {
  const startIndex = Number(visual.wordStartIndex);
  const endIndex = Number(visual.wordEndIndex);
  if (!Number.isInteger(startIndex) || !Number.isInteger(endIndex) || startIndex < 0 || endIndex < startIndex || endIndex >= words.length) {
    errors.push(`${visual.id}: ungültiger Wortbereich ${startIndex}–${endIndex}.`);
    continue;
  }
  if (startIndex !== expectedWordStart) errors.push(`${visual.id}: wordStartIndex muss ${expectedWordStart} sein, ist aber ${startIndex}.`);
  expectedWordStart = endIndex + 1;

  const endSeconds = Number(words[endIndex]?.end);
  if (!Number.isFinite(endSeconds)) {
    errors.push(`${visual.id}: Endzeit des letzten Wortes ist ungültig.`);
    continue;
  }
  const endFrame = Math.max(previousEndFrame + 1, Math.ceil(endSeconds * YOUTUBE_VIDEO_FPS));
  timelineVisuals.push({
    id: visual.id,
    type: visual.type,
    startFrame: previousEndFrame,
    durationFrames: endFrame - previousEndFrame,
    wordStartIndex: startIndex,
    wordEndIndex: endIndex,
  });
  previousEndFrame = endFrame;
}
if (expectedWordStart !== words.length) errors.push(`Visual-Wortbereiche enden bei Wort ${expectedWordStart - 1}, Voiceover besitzt aber ${words.length} Wörter.`);
if (errors.length) {
  console.error('\nTimeline konnte nicht gebaut werden:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

writeFileSync(resolve(root, TIMELINE), `${JSON.stringify({
  version: 3,
  fps: YOUTUBE_VIDEO_FPS,
  timingSource: WORD_TIMINGS,
  cutRule: 'real-word-timestamps',
  durationFrames: previousEndFrame,
  visuals: timelineVisuals,
}, null, 2)}\n`);
console.log(`\n✓ Framegenaue YouTube-Timeline gebaut: ${timelineVisuals.length} Visuals · ${previousEndFrame} Frames.`);
