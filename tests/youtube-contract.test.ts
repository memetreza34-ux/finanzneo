import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ANIMATION_SEAL,
  AUDIO_DIR,
  CAPTION_DIR,
  CAPTION_LAYER_ID,
  EXPORT_DIR,
  GENERATED_IMAGE_ASPECT_RATIO,
  IMAGE_INBOX,
  PROJECT_DIR,
  SCENES_DIR,
  SCRIPT_DIR,
  SERIES_LOCK_ID,
  TIMELINE,
  VISUAL_INDEX,
  WORD_TIMINGS,
  WORLD_ID,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
  YOUTUBE_VISUAL_TYPES,
} from '../scripts/lib/youtube-contract.mjs';
import {WORLD_ID as REEL_WORLD_ID} from '../scripts/lib/reel-contract.mjs';

test('YouTube behält die FinanzNeo-Bildwelt und nutzt Full-HD 16:9', () => {
  assert.equal(WORLD_ID, 'finanzneo-connected-studio-v3');
  assert.equal(WORLD_ID, REEL_WORLD_ID);
  assert.equal(SERIES_LOCK_ID, 'finanzneo-same-world-v1');
  assert.equal(GENERATED_IMAGE_ASPECT_RATIO, '16:9');
  assert.equal(YOUTUBE_VIDEO_ASPECT_RATIO, '16:9');
  assert.equal(YOUTUBE_VIDEO_WIDTH, 1920);
  assert.equal(YOUTUBE_VIDEO_HEIGHT, 1080);
});

test('YouTube Motion V3 bleibt technikoffen, aber produktionsstrenger', () => {
  assert.equal(YOUTUBE_MOTION_STANDARD_ID, 'finanzneo-youtube-motion-v3');
  assert.deepEqual(YOUTUBE_VISUAL_TYPES, ['image', 'animation', 'hybrid', 'data']);
  assert.equal(CAPTION_LAYER_ID, 'finanzneo-youtube-caption-layer-v2');
});

test('YouTube verwendet dieselbe einfache Top-Level-Struktur wie Reels', () => {
  assert.deepEqual(
    [SCRIPT_DIR, AUDIO_DIR, SCENES_DIR, CAPTION_DIR, PROJECT_DIR, EXPORT_DIR],
    ['01-script', '02-audio', '03-szenen', '04-caption', '05-projektdateien', '06-export'],
  );
  assert.equal(VISUAL_INDEX, '05-projektdateien/scene-index.json');
  assert.equal(WORD_TIMINGS, '02-audio/word-timings.json');
  assert.equal(TIMELINE, '05-projektdateien/timeline.json');
  assert.equal(ANIMATION_SEAL, '05-projektdateien/animation-seal.json');
  assert.equal(IMAGE_INBOX, '03-szenen/00-ALLE-BILDER-HIER-REIN');
});
