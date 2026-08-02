import {describe, expect, it} from 'vitest';
import {resolveComparisonDelta} from './BeforeAfterComparisonTemplate';

describe('resolveComparisonDelta', () => {
  it('marks an improved result as positive', () => {
    expect(resolveComparisonDelta(12000, 17800)).toEqual({
      delta: 5800,
      direction: 'positive',
      accent: '#5CFF9A',
    });
  });

  it('marks a worse result as negative instead of green', () => {
    expect(resolveComparisonDelta(17800, 12000)).toEqual({
      delta: -5800,
      direction: 'negative',
      accent: '#FF7C83',
    });
  });

  it('uses a neutral treatment for identical values', () => {
    expect(resolveComparisonDelta(1000, 1000)).toEqual({
      delta: 0,
      direction: 'neutral',
      accent: '#AFC0B4',
    });
  });

  it('sanitizes non-finite values before comparing them', () => {
    expect(resolveComparisonDelta(Number.NaN, 500)).toEqual({
      delta: 500,
      direction: 'positive',
      accent: '#5CFF9A',
    });
  });
});
