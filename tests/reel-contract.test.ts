import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FORBIDDEN_PUBLISHING_FILES,
  PLATFORM_PUBLISHING_FILES,
  WORLD_ID,
} from '../scripts/lib/reel-contract.mjs';

test('Reel-Vertrag verwendet die verbindliche Bildwelt', () => {
  assert.equal(WORLD_ID, 'finanzneo-connected-studio-v3');
});

test('Reel-Vertrag enthält genau die vier erlaubten Plattformdateien', () => {
  assert.deepEqual(Object.keys(PLATFORM_PUBLISHING_FILES).sort(), [
    'facebookReels',
    'instagramReels',
    'masterCaption',
    'snapchat',
    'tiktok',
  ]);
  assert.ok(FORBIDDEN_PUBLISHING_FILES.includes('04-caption/youtube-shorts.txt'));
});
