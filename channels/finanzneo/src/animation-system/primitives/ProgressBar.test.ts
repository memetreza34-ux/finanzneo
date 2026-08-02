import {describe, expect, it} from 'vitest';
import {resolveProgressBarValue} from './ProgressBar';

describe('resolveProgressBarValue', () => {
  it('uses an externally resolved progress value directly', () => {
    expect(resolveProgressBarValue({
      frame: 12,
      progress: 0.4,
      animated: false,
    })).toBe(0.4);
  });

  it('animates a fixed progress target', () => {
    expect(resolveProgressBarValue({
      frame: 12,
      progress: 1,
      durationInFrames: 24,
    })).toBeCloseTo(0.5, 8);
  });

  it('clamps progress values into the valid range', () => {
    expect(resolveProgressBarValue({frame: 30, progress: 2})).toBe(1);
    expect(resolveProgressBarValue({frame: 30, progress: -1})).toBe(0);
    expect(resolveProgressBarValue({frame: 30, progress: Number.NaN})).toBe(0);
  });

  it('sanitizes malformed timing inputs', () => {
    expect(resolveProgressBarValue({
      frame: Number.NaN,
      progress: 1,
      startFrame: Number.NaN,
      durationInFrames: Number.NaN,
    })).toBe(0);

    expect(resolveProgressBarValue({
      frame: 1,
      progress: 1,
      durationInFrames: 0,
    })).toBe(1);
  });
});
