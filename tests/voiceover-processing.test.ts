import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  readVoiceoverStandard,
  validateVoiceoverProcessing,
} from '../scripts/lib/voiceover-processing.mjs';

const makeFixture = (kind: 'reel' | 'youtube') => {
  const root = mkdtempSync(resolve('.tmp-voiceover-processing-'));
  const audioDir = resolve(root, kind === 'reel' ? '02-audio' : '03-audio');
  const timingsPath = resolve(root, kind === 'reel' ? '04-caption/word-timings.json' : '03-audio/word-timings.json');
  mkdirSync(resolve(audioDir, 'raw'), {recursive: true});
  mkdirSync(resolve(timingsPath, '..'), {recursive: true});

  writeFileSync(resolve(audioDir, 'raw/original.wav'), 'raw');
  writeFileSync(resolve(audioDir, 'voiceover.processed.wav'), 'processed');

  const standard = readVoiceoverStandard();
  writeFileSync(resolve(audioDir, 'voiceover-processing.json'), `${JSON.stringify({
    version: 1,
    contractId: standard.id,
    sourceFile: 'raw/original.wav',
    processedFile: 'voiceover.processed.wav',
    speed: standard.voiceover.playbackSpeed,
    silenceThresholdDb: standard.voiceover.silenceThresholdDb,
    minimumLongPauseSeconds: standard.voiceover.minimumSilenceSeconds,
    retainedPauseSeconds: standard.voiceover.targetLongPauseSeconds,
    durationBefore: 11,
    durationAfter: 10,
    processedAt: '2026-09-25T00:00:00.000Z',
    timingAuthority: 'processed-voiceover',
    exclusions: ['music', 'sfx'],
  }, null, 2)}\n`);

  writeFileSync(timingsPath, `${JSON.stringify({
    version: 1,
    source: 'voiceover.processed.wav',
    duration: 10,
    words: [{word: 'Test', start: 0, end: 0.4}],
    sentences: [{text: 'Test', start: 0, end: 0.4}],
  }, null, 2)}\n`);

  return {root, timingsPath};
};

test('Reel accepts processed voiceover as timing authority', () => {
  const fixture = makeFixture('reel');
  try {
    const result = validateVoiceoverProcessing(fixture.root, {kind: 'reel'});
    assert.equal(result.ok, true, result.errors.join('\n'));
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});

test('YouTube accepts the same processed voiceover contract for both production modes', () => {
  const fixture = makeFixture('youtube');
  try {
    const result = validateVoiceoverProcessing(fixture.root, {kind: 'youtube'});
    assert.equal(result.ok, true, result.errors.join('\n'));
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});

test('readiness rejects timings that still point to the raw voiceover', () => {
  const fixture = makeFixture('reel');
  try {
    writeFileSync(fixture.timingsPath, `${JSON.stringify({
      source: 'original.wav',
      duration: 10,
      words: [{word: 'Test', start: 0, end: 0.4}],
      sentences: [{text: 'Test', start: 0, end: 0.4}],
    }, null, 2)}\n`);
    const result = validateVoiceoverProcessing(fixture.root, {kind: 'reel'});
    assert.equal(result.ok, false);
    assert.match(result.errors.join('\n'), /voiceover\.processed\.wav/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});

test('readiness rejects stale timing duration after narration pacing changed', () => {
  const fixture = makeFixture('youtube');
  try {
    writeFileSync(fixture.timingsPath, `${JSON.stringify({
      source: 'voiceover.processed.wav',
      duration: 11,
      words: [{word: 'Test', start: 0, end: 0.4}],
      sentences: [{text: 'Test', start: 0, end: 0.4}],
    }, null, 2)}\n`);
    const result = validateVoiceoverProcessing(fixture.root, {kind: 'youtube'});
    assert.equal(result.ok, false);
    assert.match(result.errors.join('\n'), /Timing-Dauer/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});
