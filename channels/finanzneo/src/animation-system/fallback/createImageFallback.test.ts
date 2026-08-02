import {describe, expect, it} from 'vitest';
import {createImageFallback} from './createImageFallback';

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
});
