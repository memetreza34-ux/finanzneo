import {describe, expect, it} from 'vitest';
import {
  calculateCompoundInterest,
  calculateInflationAdjustedValue,
  calculateLoanBalance,
  calculateMonthlyInvestment,
  normalizePortfolioAllocation,
} from './financeMath';

describe('financeMath', () => {
  it('calculates compound interest deterministically', () => {
    const result = calculateCompoundInterest({principal: 1000, annualRate: 0.07, years: 10});
    expect(result).toBeGreaterThan(1900);
    expect(result).toBeLessThan(2000);
  });

  it('calculates a monthly investment plan', () => {
    const result = calculateMonthlyInvestment({monthlyRate: 200, annualRate: 0.07, years: 10});
    expect(result.totalContributions).toBe(24000);
    expect(result.finalValue).toBeGreaterThan(result.totalContributions);
  });

  it('keeps negative investment performance visible', () => {
    const result = calculateMonthlyInvestment({monthlyRate: 100, annualRate: -0.1, years: 1});
    expect(result.totalContributions).toBe(1200);
    expect(result.finalValue).toBeLessThan(result.totalContributions);
    expect(result.earnings).toBeLessThan(0);
  });

  it('reduces purchasing power through inflation', () => {
    const value = calculateInflationAdjustedValue({amount: 100, inflationRate: 0.02, years: 10});
    expect(value).toBeLessThan(100);
    expect(value).toBeGreaterThan(80);
  });

  it('reduces remaining loan balance after payments', () => {
    const result = calculateLoanBalance({principal: 12000, annualRate: 0.04, monthlyPayment: 300, months: 12});
    expect(result.remainingBalance).toBeLessThan(12000);
    expect(result.totalPaid).toBe(3600);
  });

  it('sanitizes invalid and negative allocation values', () => {
    const result = normalizePortfolioAllocation([
      {label: 'Ungültig', value: Number.NaN},
      {label: 'Negativ', value: -5},
      {label: 'ETF', value: 5},
    ]);

    expect(result.map((item) => item.value)).toEqual([0, 0, 5]);
    expect(result.map((item) => item.percent)).toEqual([0, 0, 100]);
  });

  it('normalizes portfolio allocations to one hundred percent', () => {
    const result = normalizePortfolioAllocation([{label: 'ETF', value: 7}, {label: 'Cash', value: 3}]);
    expect(result.reduce((sum, item) => sum + item.percent, 0)).toBeCloseTo(100, 8);
  });
});
