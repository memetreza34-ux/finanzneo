import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_EXECUTION_MODE_ID,
  FLOW_STATE_MACHINE_ID,
  FLOW_STRUCTURE_LOCK_ID,
  FORBIDDEN_PUBLISHING_FILES,
  GENERATED_IMAGE_ASPECT_RATIO,
  PLATFORM_PUBLISHING_FILES,
  SERIES_LOCK_ID,
  REEL_VIDEO_ASPECT_RATIO,
  WORLD_ID,
} from '../scripts/lib/reel-contract.mjs';

test('Reel-Vertrag verwendet die verbindliche Bildwelt', () => {
  assert.equal(WORLD_ID, 'finanzneo-connected-studio-v3');
  assert.equal(SERIES_LOCK_ID, 'finanzneo-same-world-v1');
  assert.equal(FLOW_AGENT_PROTOCOL_ID, 'finanzneo-flow-sequential-v1');
  assert.equal(GENERATED_IMAGE_ASPECT_RATIO, '1:1');
  assert.equal(REEL_VIDEO_ASPECT_RATIO, '9:16');
});

test('Google Flow verwendet Strict-Single-Job-State-Machine V3', () => {
  assert.equal(FLOW_EXECUTION_MODE_ID, 'finanzneo-flow-strict-single-job-v3');
  assert.equal(FLOW_STATE_MACHINE_ID, 'finanzneo-flow-state-machine-v1');
  assert.equal(FLOW_STRUCTURE_LOCK_ID, 'finanzneo-flow-structure-lock-v2');
});

test('Reel-Vertrag erzwingt genau eine universelle Caption', () => {
  assert.deepEqual(Object.keys(PLATFORM_PUBLISHING_FILES), ['universalCaption']);
  assert.equal(PLATFORM_PUBLISHING_FILES.universalCaption, '04-caption/caption.txt');
  for (const oldFile of [
    '04-caption/youtube-shorts.txt',
    '04-caption/instagram-reels.txt',
    '04-caption/tiktok.txt',
    '04-caption/facebook-reels.txt',
    '04-caption/snapchat.txt',
  ]) {
    assert.ok(FORBIDDEN_PUBLISHING_FILES.includes(oldFile));
  }
});
