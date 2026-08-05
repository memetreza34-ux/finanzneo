import {describe, expect, it} from 'vitest';
import type {FinanceAnimationRequest} from '../contracts';
import {
  createImageFallback,
  normalizeFallbackReasons,
} from './createImageFallback';

describe('createImageFallback', () => {
  it('returns the image mode with full confidence', () => {
    const decision = createImageFallback({
      message: 'Eine komplexe Alltagsszene ist als Bild klarer.',
      voiceText: 'Diese Aussage bleibt bewusst im Bildmodus.',
    });

    expect(decision.mode).toBe('image');
    expect(decision.confidence).toBe(1);
    expect(decision.blockedReasons).toEqual([]);
  });

  it('documents missing required text', () => {
    const decision = createImageFallback({message: '', voiceText: ''}, ['Kein passendes Template.']);

    expect(decision.blockedReasons).toContain('Kein passendes Template.');
    expect(decision.blockedReasons).toContain('Kernaussage fehlt.');
    expect(decision.blockedReasons).toContain('Voiceover-Text fehlt.');
  });

  it('tolerates malformed runtime text at the untrusted input boundary', () => {
    const malformedRequest = {
      message: 123,
      voiceText: null,
    } as unknown as FinanceAnimationRequest;

    expect(() => createImageFallback(malformedRequest)).not.toThrow();
    expect(createImageFallback(malformedRequest).blockedReasons).toEqual([
      'Kernaussage fehlt.',
      'Voiceover-Text fehlt.',
    ]);
  });

  it('normalizes empty and duplicate reasons', () => {
    expect(normalizeFallbackReasons([
      ' Daten fehlen. ',
      '',
      'Daten fehlen.',
      'Template fehlt.',
    ])).toEqual([
      'Daten fehlen.',
      'Template fehlt.',
    ]);
  });

  it('does not duplicate generated and supplied reasons', () => {
    const decision = createImageFallback(
      {message: '', voiceText: 'Vorhandener Text.'},
      ['Kernaussage fehlt.', ' Kernaussage fehlt. '],
    );

    expect(decision.blockedReasons).toEqual(['Kernaussage fehlt.']);
  });
});
