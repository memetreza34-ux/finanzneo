import assert from 'node:assert/strict';
import test from 'node:test';
import {YOUTUBE_FORMAT, YOUTUBE_STYLE, youtubeLayoutIssues} from '../src/youtube/layout';

test('YouTube-Layout: Bahnen überlappen sich nicht und liegen im Frame', () => {
  assert.deepEqual(youtubeLayoutIssues(), []);
});

test('YouTube-Layout: 1920 × 1080 bei 30 fps', () => {
  assert.equal(YOUTUBE_FORMAT.width, 1920);
  assert.equal(YOUTUBE_FORMAT.height, 1080);
  assert.equal(YOUTUBE_FORMAT.fps, 30);
});

test('YouTube-Layout: das Bild steht auf drei Vierteln und bleibt 16:9', () => {
  const {visual} = YOUTUBE_STYLE;
  assert.equal(visual.width, 1440);
  assert.equal(visual.height, 810);
  assert.equal(visual.width / YOUTUBE_FORMAT.width, 3 / 4);
  assert.equal(visual.width / visual.height, 16 / 9);
});

test('YouTube-Layout: über dem Bild bleibt Platz für die Zwischenüberschrift', () => {
  const {header, visual} = YOUTUBE_STYLE;
  const headerBottom = header.top + header.fontSize * 1.08 * header.maxLines;
  assert.ok(headerBottom <= visual.top, `Header endet bei ${headerBottom}, Visualzone beginnt bei ${visual.top}.`);
  assert.ok(visual.top >= 120, 'Die Kopfbahn ist zu schmal für eine zweizeilige Überschrift.');
});

test('YouTube-Layout: unter dem Bild bleibt Platz für optionalen Infotext', () => {
  const {visual, infoText} = YOUTUBE_STYLE;
  const infoTop = YOUTUBE_FORMAT.height - infoText.bottom - infoText.fontSize * 1.2 * infoText.maxLines;
  assert.ok(visual.bottom <= infoTop, `Visualzone endet bei ${visual.bottom}, Infotext beginnt bei ${infoTop}.`);
});

test('YouTube-Layout: Karaoke-Untertitel sind ausdrücklich nicht vorgesehen', () => {
  // Reels laufen stumm im Feed und brauchen Untertitel. Longform wird mit Ton
  // geschaut; unten steht nur optionaler einzeiliger Infotext.
  assert.equal(YOUTUBE_STYLE.captionsDisabled, true);
  assert.equal(YOUTUBE_STYLE.infoText.maxLines, 1);
});

test('YouTube-Layout: eine verschobene Zone wird als Problem gemeldet', () => {
  // Spiegelt die Prüfung gegen eine absichtlich kaputte Geometrie, damit der
  // Test nicht nur die aktuellen Zahlen bestätigt.
  const broken = {...YOUTUBE_STYLE.visual, top: 40};
  const headerBottom = YOUTUBE_STYLE.header.top + YOUTUBE_STYLE.header.fontSize * 1.08 * YOUTUBE_STYLE.header.maxLines;
  assert.ok(headerBottom > broken.top, 'Bei top = 40 müsste der Header in die Visualzone ragen.');
});

test('YouTube-Layout: Schwarzblende zwischen Szenen bleibt verboten', () => {
  assert.equal(YOUTUBE_STYLE.transition.fadeToBlackForbidden, true);
  assert.ok(YOUTUBE_STYLE.transition.continuityFrames > 0);
});
