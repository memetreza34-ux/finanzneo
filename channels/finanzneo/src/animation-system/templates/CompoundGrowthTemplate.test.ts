import {describe, expect, it} from 'vitest';
import {resolveCompoundGrowthBars} from './CompoundGrowthTemplate';

describe('resolveCompoundGrowthBars', () => {
  it('creates a monotonic value and height progression', () => {
    const bars = resolveCompoundGrowthBars(1000, 50000, 20, 8);

    expect(bars).toHaveLength(8);
    expect(bars[0]?.year).toBeGreaterThanOrEqual(1);
    expect(bars.at(-1)?.year).toBe(20);
    expect(bars.at(-1)?.value).toBeCloseTo(50000, 8);
    for (let index = 1; index < bars.length; index += 1) {
      expect(bars[index].value).toBeGreaterThanOrEqual(bars[index - 1].value);
      expect(bars[index].height).toBeGreaterThanOrEqual(bars[index - 1].height);
    }
  });

  it('uses the requested number of bars', () => {
    expect(resolveCompoundGrowthBars(1000, 2000, 10, 4)).toHaveLength(4);
  });

  it('does not visualize a direct-template decline as compound growth', () => {
    const bars = resolveCompoundGrowthBars(1000, 500, 10, 4);

    expect(bars.every((bar) => bar.value >= 1000)).toBe(true);
    expect(bars.at(-1)?.value).toBe(1000);
  });

  it('sanitizes invalid values and count', () => {
    const bars = resolveCompoundGrowthBars(
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NaN,
      0,
    );

    expect(bars).toEqual([{year: 1, value: 0, height: 730}]);
  });
});
