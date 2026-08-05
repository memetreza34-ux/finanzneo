import {describe, expect, it} from 'vitest';
import {inflationAdjustedValue} from '../calculations/financeMath';
import {resolveInflationErosionFrame} from './InflationErosionTemplate';

const input = {
  startValue: 100,
  inflationPercent: 2.5,
  years: 10,
};

describe('resolveInflationErosionFrame', () => {
  it('starts with current purchasing power and zero elapsed years', () => {
    expect(resolveInflationErosionFrame({...input, progress: 0})).toEqual({
      currentValue: 100,
      remainingRatio: 1,
      elapsedYears: 0,
    });
  });

  it('calculates the midpoint from five years of inflation', () => {
    const result = resolveInflationErosionFrame({...input, progress: 0.5});
    const expected = inflationAdjustedValue(100, 0.025, 5);

    expect(result.currentValue).toBeCloseTo(expected, 8);
    expect(result.remainingRatio).toBeCloseTo(expected / 100, 8);
    expect(result.elapsedYears).toBe(5);
  });

  it('ends with the exact ten-year purchasing power', () => {
    const result = resolveInflationErosionFrame({...input, progress: 1});
    const expected = inflationAdjustedValue(100, 0.025, 10);

    expect(result.currentValue).toBeCloseTo(expected, 8);
    expect(result.remainingRatio).toBeCloseTo(expected / 100, 8);
    expect(result.elapsedYears).toBe(10);
  });

  it('uses fractional elapsed time instead of a linear value estimate', () => {
    const result = resolveInflationErosionFrame({...input, progress: 0.33});
    const elapsedYears = 3.3;

    expect(result.elapsedYears).toBeCloseTo(elapsedYears, 8);
    expect(result.currentValue).toBeCloseTo(
      inflationAdjustedValue(100, 0.025, elapsedYears),
      8,
    );
  });

  it('sanitizes invalid values and clamps progress', () => {
    expect(resolveInflationErosionFrame({
      startValue: Number.NaN,
      inflationPercent: -10,
      years: -4,
      progress: 2,
    })).toEqual({
      currentValue: 0,
      remainingRatio: 0,
      elapsedYears: 0,
    });
  });
});
