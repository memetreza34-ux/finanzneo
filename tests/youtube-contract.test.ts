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
  IMAGE_STORYTELLING_CONTRACT_ID,
  MIN_IMAGE_ASSETS_8_TO_10_MIN,
  MIN_TOTAL_VISIBLE_BEATS_8_TO_10_MIN,
  PREMIUM_VISUAL_WORLD_LOCK_ID,
  PROJECT_DIR,
  SCENES_DIR,
  SCRIPT_DIR,
  SERIES_LOCK_ID,
  STATIC_IMAGE_MAX_SECONDS,
  TIMELINE,
  VISUAL_INDEX,
  WORD_TIMINGS,
  WORLD_ID,
  YOUTUBE_IMAGE_DENSITY_STANDARD_ID,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
  YOUTUBE_VISUAL_TYPES,
} from '../scripts/lib/youtube-contract.mjs';
import {WORLD_ID as REEL_WORLD_ID} from '../scripts/lib/reel-contract.mjs';

test('YouTube behält exakt die Reel-Bildwelt und nutzt nur ein anderes 16:9-Framing', () => {
  assert.equal(WORLD_ID, 'finanzneo-connected-studio-v3');
  assert.equal(WORLD_ID, REEL_WORLD_ID);
  assert.equal(SERIES_LOCK_ID, 'finanzneo-same-world-v1');
  assert.equal(PREMIUM_VISUAL_WORLD_LOCK_ID, 'finanzneo-stylized-3d-animated-black-v9');
  assert.equal(IMAGE_STORYTELLING_CONTRACT_ID, 'finanzneo-image-storytelling-v3');
  assert.equal(GENERATED_IMAGE_ASPECT_RATIO, '16:9');
  assert.equal(YOUTUBE_VIDEO_ASPECT_RATIO, '16:9');
  assert.equal(YOUTUBE_VIDEO_WIDTH, 1920);
  assert.equal(YOUTUBE_VIDEO_HEIGHT, 1080);
});

test('YouTube V3 erzwingt dichte Visualplanung ohne starre Bildquote', () => {
  assert.equal(YOUTUBE_IMAGE_DENSITY_STANDARD_ID, 'finanzneo-youtube-image-density-v3');
  assert.equal(MIN_IMAGE_ASSETS_8_TO_10_MIN, 24);
  assert.equal(MIN_TOTAL_VISIBLE_BEATS_8_TO_10_MIN, 45);
  assert.equal(STATIC_IMAGE_MAX_SECONDS, 6);
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
