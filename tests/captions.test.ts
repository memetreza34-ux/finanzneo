import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeCaptionSentences, validateCaptionSentences} from '../src/lib/captions';

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
  const words = Array.from({length: 13}, (_, index) => ({word: `Wort${index}`, start: index, end: index + 0.5}));
  const errors = validateCaptionSentences([
    {text: words.map((word) => word.word).join(' '), start: 0, end: 13, words},
  ], {maxWords: 12, maxCharacters: 68});

  assert.ok(errors.some((error) => error.includes('höchstens 12')));
});
