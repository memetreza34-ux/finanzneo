import {describe, expect, it} from 'vitest';
import {resolveInflationErosionFrame} from './InflationErosionTemplate';

describe('resolveInflationErosionFrame', () => {
  const input = {
    startValue: 100,
    endValue: 78,
    years: 10,
  };

  it('starts with current purchasing power and zero elapsed years', () => {
    expect(resolveInflationErosionFrame({...input, progress: 0})).toEqual({
      currentValue: 100,
      remainingRatio: 1,
      elapsedYears: 0,
    });
  });

  it('keeps value, bar and year progression synchronized', () => {
    const result = resolveInflationErosionFrame({...input, progress: 0.5});

    expect(result.currentValue).toBe(89);
    expect(result.remainingRatio).toBeCloseTo(0.89, 8);
    expect(result.elapsedYears).toBe(5);
  });

  it('ends with the supplied future purchasing power', () => {
    expect(resolveInflationErosionFrame({...input, progress: 1})).toEqual({
      currentValue: 78,
      remainingRatio: 0.78,
      elapsedYears: 10,
    });
  });

  it('sanitizes invalid values and clamps progress', () => {
    expect(resolveInflationErosionFrame({
      startValue: Number.NaN,
      endValue: -10,
      years: -4,
      progress: 2,
    })).toEqual({
      currentValue: 0,
      remainingRatio: 0,
      elapsedYears: 0,
    });
  });
});
