import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const scaffold = readFileSync(resolve('scripts/scaffold-finanzneo-youtube.mjs'), 'utf8');
const system = JSON.parse(readFileSync(resolve('config/finanzneo-youtube-visual-system.json'), 'utf8'));
const currentThumbnail = readFileSync(resolve('youtube/warum-du-trotz-gehaltserhoehung-nicht-mehr-geld-hast-hybrid/04-visuals/thumbnail-prompt.txt'), 'utf8');
const currentHandoff = readFileSync(resolve('youtube/warum-du-trotz-gehaltserhoehung-nicht-mehr-geld-hast-hybrid/04-visuals/alle-bildprompts.txt'), 'utf8');

test('future YouTube thumbnails are generated with final hook text from the start', () => {
  assert.match(scaffold, /THUMBNAIL_HEADLINE — REQUIRED FINAL TEXT/);
  assert.match(scaffold, /THIS EXACT TEXT MUST APPEAR INSIDE THE GENERATED THUMBNAIL/);
  assert.match(scaffold, /DO NOT LEAVE AN EMPTY TYPOGRAPHY AREA FOR LATER/);
  assert.match(scaffold, /Exact spelling is mandatory/);
  assert.match(scaffold, /thumbnailStyleBlock/);
});

test('global thumbnail contract makes direct generated text the preferred final route', () => {
  assert.equal(system.thumbnailContract.preferredHeadlineOwner, 'flow-generated-final-thumbnail');
  assert.equal(system.thumbnailContract.directGeneratedHeadlineRequired, true);
  assert.equal(system.thumbnailContract.flowHeadlineMustBeExactOrRegenerated, true);
  assert.equal(system.thumbnailContract.noTextThumbnailForbiddenAsFinal, true);
  assert.equal(system.principles.thumbnailHeadlineIsDirectGenerationException, true);
});

test('current salary-raise test video requires exact headline inside Flow thumbnail', () => {
  for (const source of [currentThumbnail, currentHandoff]) {
    assert.match(source, /MEHR GEHALT, TROTZDEM KNAPP\?/);
    assert.match(source, /regenerate the SAME thumbnail/i);
    assert.doesNotMatch(source, /No generated headline/i);
    assert.doesNotMatch(source, /Final layout adds exactly/i);
  }
});
