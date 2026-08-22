import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FLOW_AGENT_PROTOCOL_ID,
  FORBIDDEN_PUBLISHING_FILES,
  GENERATED_IMAGE_ASPECT_RATIO,
  PLATFORM_PUBLISHING_FILES,
  SERIES_LOCK_ID,
  REEL_VIDEO_ASPECT_RATIO,
  REEL_CAPTION,
  REEL_FINAL_EXPORT,
  REEL_LAYOUT,
  REEL_VISUAL_MIX,
  WORLD_ID,
} from '../scripts/lib/reel-contract.mjs';

test('Reel-Vertrag verwendet die verbindliche Bildwelt', () => {
  assert.equal(WORLD_ID, 'finanzneo-connected-studio-v3');
  assert.equal(SERIES_LOCK_ID, 'finanzneo-same-world-v1');
  assert.equal(FLOW_AGENT_PROTOCOL_ID, 'finanzneo-flow-sequential-v1');
  assert.equal(GENERATED_IMAGE_ASPECT_RATIO, '1:1');
  assert.equal(REEL_VIDEO_ASPECT_RATIO, '9:16');
  assert.equal(REEL_LAYOUT.caption.top, 1360);
  assert.equal(REEL_LAYOUT.caption.right, 150);
  assert.equal(REEL_CAPTION.maxLines, 2);
  assert.equal(REEL_CAPTION.maxWords, 10);
  assert.equal(REEL_CAPTION.singleLineMaxCharacters, 32);
  assert.equal(REEL_CAPTION.maxCharactersPerLine, 40);
  assert.equal(REEL_CAPTION.fontSize, 46);
  assert.equal(REEL_CAPTION.activeWordColor, 'finance-green');
  assert.equal(REEL_VISUAL_MIX.preferredAnimationShare, 0.6);
  assert.equal(REEL_FINAL_EXPORT.videoFile, '06-export/reel.mp4');
  assert.equal(REEL_FINAL_EXPORT.coverFile, '06-export/cover.png');
  assert.equal(REEL_FINAL_EXPORT.video.audioRequired, true);
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
