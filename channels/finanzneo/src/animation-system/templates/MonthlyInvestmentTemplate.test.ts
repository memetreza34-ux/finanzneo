import {describe, expect, it} from 'vitest';
import {futureValueMonthlyInvestment} from '../calculations/financeMath';
import {resolveMonthlyInvestmentFrame} from './MonthlyInvestmentTemplate';

const input = {
  monthlyAmount: 250,
  months: 12,
  annualReturnPercent: 7,
};

const expectedValue = (
  monthlyAmount: number,
  completedMonths: number,
  annualReturnPercent: number,
): number => futureValueMonthlyInvestment(
  monthlyAmount,
  annualReturnPercent / 100,
  completedMonths / 12,
);

describe('resolveMonthlyInvestmentFrame', () => {
  it('starts before the first contribution', () => {
    expect(resolveMonthlyInvestmentFrame({...input, progress: 0})).toEqual({
      completedMonths: 0,
      invested: 0,
      currentValue: 0,
      earnings: 0,
      progress: 0,
    });
  });

  it('calculates the midpoint from six completed months', () => {
    const result = resolveMonthlyInvestmentFrame({...input, progress: 0.5});

    expect(result.completedMonths).toBe(6);
    expect(result.invested).toBe(1500);
    expect(result.currentValue).toBeCloseTo(expectedValue(250, 6, 7), 8);
    expect(result.earnings).toBeCloseTo(result.currentValue - 1500, 8);
    expect(result.progress).toBe(0.5);
  });

  it('ends exactly on the calculated twelve-month value', () => {
    const result = resolveMonthlyInvestmentFrame({...input, progress: 1});

    expect(result.completedMonths).toBe(12);
    expect(result.invested).toBe(3000);
    expect(result.currentValue).toBeCloseTo(expectedValue(250, 12, 7), 8);
    expect(result.earnings).toBeCloseTo(result.currentValue - 3000, 8);
    expect(result.progress).toBe(1);
  });

  it('supports a negative development without hiding it', () => {
    const result = resolveMonthlyInvestmentFrame({
      monthlyAmount: 250,
      months: 12,
      annualReturnPercent: -10,
      progress: 1,
    });

    expect(result.invested).toBe(3000);
    expect(result.currentValue).toBeCloseTo(expectedValue(250, 12, -10), 8);
    expect(result.earnings).toBeLessThan(0);
  });

  it('uses completed whole months instead of a fabricated linear value', () => {
    const result = resolveMonthlyInvestmentFrame({...input, progress: 0.51});

    expect(result.completedMonths).toBe(6);
    expect(result.currentValue).toBeCloseTo(expectedValue(250, 6, 7), 8);
    expect(result.progress).toBe(0.5);
  });

  it('sanitizes invalid amounts, durations, rates and progress', () => {
    expect(resolveMonthlyInvestmentFrame({
      monthlyAmount: Number.NaN,
      months: -12,
      annualReturnPercent: Number.POSITIVE_INFINITY,
      progress: 4,
    })).toEqual({
      completedMonths: 0,
      invested: 0,
      currentValue: 0,
      earnings: 0,
      progress: 0,
    });
  });
});
