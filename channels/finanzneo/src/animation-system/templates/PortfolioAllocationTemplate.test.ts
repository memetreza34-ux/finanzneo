import {describe, expect, it} from 'vitest';
import {normalizePortfolioPercentages} from './PortfolioAllocationTemplate';

describe('normalizePortfolioPercentages', () => {
  it('normalizes relative weights to one hundred percent', () => {
    const result = normalizePortfolioPercentages([
      {label: 'ETF', weight: 7},
      {label: 'Cash', weight: 3},
    ]);

    expect(result[0]?.percent).toBeCloseTo(70, 8);
    expect(result[1]?.percent).toBeCloseTo(30, 8);
    expect(result.reduce((sum, item) => sum + item.percent, 0)).toBeCloseTo(100, 8);
  });

  it('sanitizes negative and non-finite weights', () => {
    const result = normalizePortfolioPercentages([
      {label: 'ETF', weight: 50},
      {label: 'Cash', weight: -10},
      {label: 'Fehler', weight: Number.NaN},
    ]);

    expect(result.map((item) => item.percent)).toEqual([100, 0, 0]);
  });

  it('keeps an all-zero portfolio at zero without division errors', () => {
    expect(normalizePortfolioPercentages([
      {label: 'ETF', weight: 0},
      {label: 'Cash', weight: 0},
    ])).toEqual([
      {label: 'ETF', percent: 0},
      {label: 'Cash', percent: 0},
    ]);
  });
});
