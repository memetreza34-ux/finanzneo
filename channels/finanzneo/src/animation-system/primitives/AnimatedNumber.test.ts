import {describe, expect, it} from 'vitest';
import {resolveAnimatedNumberValue} from './AnimatedNumber';

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
});
