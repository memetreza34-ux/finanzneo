import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const scaffold = readFileSync(resolve('scripts/scaffold-finanzneo-youtube.mjs'), 'utf8');

test('future YouTube thumbnails are generated with final hook text from the start', () => {
  assert.match(scaffold, /THUMBNAIL_HEADLINE — REQUIRED FINAL TEXT/);
  assert.match(scaffold, /THIS EXACT TEXT MUST APPEAR INSIDE THE GENERATED THUMBNAIL/);
  assert.match(scaffold, /DO NOT LEAVE AN EMPTY TYPOGRAPHY AREA FOR LATER/);
  assert.match(scaffold, /Exact spelling is mandatory/);
  assert.match(scaffold, /thumbnailStyleBlock/);
});

test('thumbnail contract forbids final textless covers and requires regeneration on bad Flow text', () => {
  assert.match(scaffold, /finalCoverTextRequired:true/);
  assert.match(scaffold, /flowHeadlineMustBeExactOrRegenerated:true/);
  assert.match(scaffold, /headlineMustBePresentBeforeFinalExport:true/);
  assert.match(scaffold, /noTextThumbnailForbiddenAsFinal:true/);
  assert.match(scaffold, /thumbnailDirectTextException:true/);
  assert.doesNotMatch(scaffold, /Do not generate the headline inside the image\./);
});
