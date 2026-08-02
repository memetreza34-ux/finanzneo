import {describe, expect, it} from 'vitest';
import {
  normalizeNumberForDisplay,
  resolveAnimatedNumberValue,
  resolveNumberDecimals,
} from './AnimatedNumber';

describe('resolveAnimatedNumberValue', () => {
  it('returns an externally resolved value without applying a second animation', () => {
    expect(resolveAnimatedNumberValue({frame: 15, value: 420})).toBe(420);
  });

  it('interpolates an explicit target value', () => {
    expect(resolveAnimatedNumberValue({
      frame: 15,
      from: 0,
      to: 100,
      startFrame: 0,
      durationInFrames: 30,
    })).toBeCloseTo(50, 8);
  });

  it('clamps values before and after the configured animation', () => {
    expect(resolveAnimatedNumberValue({
      frame: 0,
      from: 10,
      to: 20,
      startFrame: 5,
      durationInFrames: 10,
    })).toBe(10);
    expect(resolveAnimatedNumberValue({
      frame: 30,
      from: 10,
      to: 20,
      startFrame: 5,
      durationInFrames: 10,
    })).toBe(20);
  });

  it('uses a minimum duration of one frame', () => {
    expect(resolveAnimatedNumberValue({
      frame: 1,
      from: 0,
      to: 10,
      durationInFrames: 0,
    })).toBe(10);
  });

  it('sanitizes non-finite resolved and target values', () => {
    expect(resolveAnimatedNumberValue({frame: 10, value: Number.NaN})).toBe(0);
    expect(resolveAnimatedNumberValue({
      frame: Number.NaN,
      from: Number.NaN,
      to: Number.POSITIVE_INFINITY,
      startFrame: Number.NaN,
      durationInFrames: Number.NaN,
    })).toBe(0);
  });
});

describe('animated number display normalization', () => {
  it('removes negative zero at the selected precision', () => {
    expect(normalizeNumberForDisplay(-0.4, 0)).toBe(0);
    expect(normalizeNumberForDisplay(-0.004, 2)).toBe(0);
    expect(normalizeNumberForDisplay(-0.006, 2)).toBe(-0.006);
  });

  it('sanitizes and clamps decimal precision', () => {
    expect(resolveNumberDecimals(Number.NaN)).toBe(0);
    expect(resolveNumberDecimals(-4)).toBe(0);
    expect(resolveNumberDecimals(2.4)).toBe(2);
    expect(resolveNumberDecimals(40)).toBe(20);
  });
});
