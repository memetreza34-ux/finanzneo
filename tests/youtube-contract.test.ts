import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FLOW_AGENT_PROTOCOL_ID,
  GENERATED_IMAGE_ASPECT_RATIO,
  SOCIAL_PROMO_FILES,
  SERIES_LOCK_ID,
  WORLD_ID,
  YOUTUBE_PUBLISHING_FILES,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
} from '../scripts/lib/youtube-contract.mjs';
import {WORLD_ID as REEL_WORLD_ID} from '../scripts/lib/reel-contract.mjs';

test('YouTube verwendet dieselbe FinanzNeo-Welt, aber ein eigenes 16:9-Format', () => {
  assert.equal(WORLD_ID, 'finanzneo-connected-studio-v3');
  assert.equal(WORLD_ID, REEL_WORLD_ID);
  assert.equal(SERIES_LOCK_ID, 'finanzneo-same-world-v1');
  assert.equal(FLOW_AGENT_PROTOCOL_ID, 'finanzneo-flow-sequential-v1');
  assert.equal(GENERATED_IMAGE_ASPECT_RATIO, '16:9');
  assert.equal(YOUTUBE_VIDEO_ASPECT_RATIO, '16:9');
  assert.equal(YOUTUBE_VIDEO_WIDTH, 1920);
  assert.equal(YOUTUBE_VIDEO_HEIGHT, 1080);
});

test('YouTube-Paket enthält Upload-Metadaten und vier Social-Promos', () => {
  assert.deepEqual(Object.keys(SOCIAL_PROMO_FILES).sort(), ['facebook', 'instagram', 'snapchat', 'tiktok']);
  assert.deepEqual(Object.keys(YOUTUBE_PUBLISHING_FILES).sort(), [
    'chapters',
    'communityPost',
    'description',
    'finalTitle',
    'hashtags',
    'pinnedComment',
    'sourcesDisclaimer',
    'tagsKeywords',
    'thumbnailBrief',
    'titleOptions',
    'uploadChecklist',
  ]);
});
