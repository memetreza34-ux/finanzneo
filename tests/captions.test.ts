import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeCaptionSentences, splitCaptionLines, validateCaptionSentences} from '../src/lib/captions';
import {REEL_CAPTION} from '../scripts/lib/reel-contract.mjs';

test('Satz-Captions bewahren vollständige Wortzeiten', () => {
  const sentences = normalizeCaptionSentences({
    sentences: [{
      text: 'Dein Warenkorb zählt.',
      start: 0,
      end: 1.2,
      words: [
        {word: 'Dein', start: 0, end: 0.3},
        {word: 'Warenkorb', start: 0.3, end: 0.8},
        {word: 'zählt.', start: 0.8, end: 1.2},
      ],
    }],
  });

  assert.equal(sentences.length, 1);
  assert.equal(sentences[0].words.length, 3);
});

test('Caption-Vertrag blockiert zu lange Sätze', () => {
  const text = 'Nutze die offizielle Rate als Orientierung und deinen eigenen Warenkorb, um zu verstehen, wo dein Geld wirklich an Kaufkraft verliert.';
  const words = text.split(' ').map((word, index) => ({word, start: index, end: index + 0.5}));
  const errors = validateCaptionSentences([
    {text, start: 0, end: words.length, words},
  ], REEL_CAPTION);

  assert.ok(errors.some((error) => error.includes('höchstens 10')));
});

test('Gutes Referenzbeispiel wird groß und ausgewogen auf zwei Zeilen gesetzt', () => {
  const text = 'Darum ist 2,8 % nicht deine Rechnung, sondern ein Vergleichswert.';
  const words = text.split(' ').map((word, index) => ({word, start: index, end: index + 0.5}));
  const lines = splitCaptionLines(words, REEL_CAPTION);

  assert.deepEqual(validateCaptionSentences([{text, start: 0, end: 5, words}], REEL_CAPTION), []);
  assert.equal(lines.length, 2);
  assert.ok(lines.every((line) => line.map((word) => word.word).join(' ').length <= REEL_CAPTION.maxCharactersPerLine));
});
