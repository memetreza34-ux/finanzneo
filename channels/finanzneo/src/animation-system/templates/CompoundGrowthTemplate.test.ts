import {describe, expect, it} from 'vitest';
import {
  futureValueLumpSum,
  futureValueMonthlyInvestment,
} from '../calculations/financeMath';
import {resolveCompoundGrowthBars} from './CompoundGrowthTemplate';

const expectedValue = (
  principal: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
): number =>
  futureValueLumpSum(principal, annualReturnPercent / 100, years) +
  futureValueMonthlyInvestment(
    monthlyContribution,
    annualReturnPercent / 100,
    years,
  );

describe('resolveCompoundGrowthBars', () => {
  it('calculates every visible bar from the supplied financial inputs', () => {
    const bars = resolveCompoundGrowthBars(1000, 200, 7, 20, 8);

    expect(bars).toHaveLength(8);
    expect(bars[0]).toEqual({elapsedYears: 0, value: 1000, height: expect.any(Number)});
    expect(bars[bars.length - 1]?.elapsedYears).toBe(20);

    for (const bar of bars) {
      expect(bar.value).toBeCloseTo(
        expectedValue(1000, 200, 7, bar.elapsedYears),
        8,
      );
    }
  });

  it('ends at the exact compound-growth result', () => {
    const bars = resolveCompoundGrowthBars(1000, 200, 7, 20, 8);
    const finalBar = bars[bars.length - 1];

    expect(finalBar?.value).toBeCloseTo(
      expectedValue(1000, 200, 7, 20),
      8,
    );
    expect(finalBar?.height).toBeCloseTo(730, 8);
  });

  it('creates monotonic values and heights for nonnegative returns', () => {
    const bars = resolveCompoundGrowthBars(1000, 200, 7, 20, 8);

    for (let index = 1; index < bars.length; index += 1) {
      expect(bars[index]!.value).toBeGreaterThanOrEqual(bars[index - 1]!.value);
      expect(bars[index]!.height).toBeGreaterThanOrEqual(bars[index - 1]!.height);
    }
  });

  it('uses the requested number of bars including start and end', () => {
    const bars = resolveCompoundGrowthBars(1000, 100, 5, 10, 4);

    expect(bars).toHaveLength(4);
    expect(bars[0]?.elapsedYears).toBe(0);
    expect(bars[bars.length - 1]?.elapsedYears).toBe(10);
  });

  it('shows contributions without inventing a return', () => {
    const bars = resolveCompoundGrowthBars(0, 100, 0, 1, 3);

    expect(bars.map((bar) => bar.value)).toEqual([0, 600, 1200]);
  });

  it('sanitizes invalid direct-template values and count', () => {
    const bars = resolveCompoundGrowthBars(
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NaN,
      Number.NaN,
      0,
    );

    expect(bars).toEqual([{elapsedYears: 0, value: 0, height: 0}]);
  });
});
