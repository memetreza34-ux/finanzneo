import {describe, expect, it} from 'vitest';
import {normalizePortfolioPercentages} from './PortfolioAllocationTemplate';

describe('normalizePortfolioPercentages', () => {
  it('normalizes relative weights to one hundred percent', () => {
    const result = normalizePortfolioPercentages([
      {label: 'ETF', percent: 7},
      {label: 'Cash', percent: 3},
    ]);

    expect(result[0]?.percent).toBeCloseTo(70, 8);
    expect(result[1]?.percent).toBeCloseTo(30, 8);
    expect(result.reduce((sum, item) => sum + item.percent, 0)).toBeCloseTo(100, 8);
  });

  it('sanitizes negative and non-finite weights', () => {
    const result = normalizePortfolioPercentages([
      {label: 'ETF', percent: 50},
      {label: 'Cash', percent: -10},
      {label: 'Fehler', percent: Number.NaN},
    ]);

    expect(result.map((item) => item.percent)).toEqual([100, 0, 0]);
  });

  it('keeps an all-zero portfolio at zero without division errors', () => {
    expect(normalizePortfolioPercentages([
      {label: 'ETF', percent: 0},
      {label: 'Cash', percent: 0},
    ])).toEqual([
      {label: 'ETF', percent: 0},
      {label: 'Cash', percent: 0},
    ]);
  });
});
