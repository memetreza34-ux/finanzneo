import {describe, expect, it} from 'vitest';
import {resolveMonthlyInvestmentFrame} from './MonthlyInvestmentTemplate';

describe('resolveMonthlyInvestmentFrame', () => {
  const input = {
    monthlyAmount: 250,
    months: 12,
    finalValue: 3180,
  };

  it('starts before the first contribution', () => {
    expect(resolveMonthlyInvestmentFrame({...input, progress: 0})).toEqual({
      completedMonths: 0,
      invested: 0,
      currentValue: 0,
      earnings: 0,
      progress: 0,
    });
  });

  it('keeps month count, contributions and value synchronized', () => {
    expect(resolveMonthlyInvestmentFrame({...input, progress: 0.5})).toEqual({
      completedMonths: 6,
      invested: 1500,
      currentValue: 1590,
      earnings: 90,
      progress: 0.5,
    });
  });

  it('ends exactly on the supplied plan values', () => {
    expect(resolveMonthlyInvestmentFrame({...input, progress: 1})).toEqual({
      completedMonths: 12,
      invested: 3000,
      currentValue: 3180,
      earnings: 180,
      progress: 1,
    });
  });

  it('supports a negative development without hiding it', () => {
    const result = resolveMonthlyInvestmentFrame({
      monthlyAmount: 250,
      months: 12,
      finalValue: 2800,
      progress: 1,
    });

    expect(result.invested).toBe(3000);
    expect(result.currentValue).toBe(2800);
    expect(result.earnings).toBe(-200);
  });

  it('sanitizes invalid amounts, durations and progress', () => {
    expect(resolveMonthlyInvestmentFrame({
      monthlyAmount: Number.NaN,
      months: -12,
      finalValue: Number.POSITIVE_INFINITY,
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
