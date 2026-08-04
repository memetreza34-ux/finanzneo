import {describe, expect, it} from 'vitest';
import {
  calculateBondPriceChangePercent,
  calculateBondValueAfterRateChange,
  calculateBusinessProfit,
  calculateCapitalGainsTax,
  calculateDiversifiedPortfolioShockPercent,
  calculateGrossRentalYieldPercent,
  calculateLifestyleInflationLoss,
  calculateNetInvestmentProceeds,
  calculateNetRentalYieldPercent,
  calculateOperatingCashflow,
  calculateSavingsRatePercent,
} from './FinanceAnimationLibraryBatchFive';
import {
  FINANCE_ANIMATION_LIBRARY_ITEMS,
  getFinanceAnimationLibraryCategory,
  getFinanceAnimationLibraryItemsByBatch,
  getFinanceAnimationLibraryItemsByCategory,
} from './catalog';

const BATCH_FIVE_IDS = [
  'bond-rate-price-seesaw',
  'capital-gains-tax-waterfall',
  'business-profit-cashflow',
  'rental-yield-breakdown',
  'diversification-shock-absorber',
  'lifestyle-inflation',
] as const;

describe('FinanceAnimationLibraryBatchFive', () => {
  it('registers six additional reusable animations with unique ids', () => {
    const items = getFinanceAnimationLibraryItemsByBatch(5);
    expect(items).toHaveLength(6);
    expect(items.map((item) => item.id)).toEqual(BATCH_FIVE_IDS);
    expect(FINANCE_ANIMATION_LIBRARY_ITEMS).toHaveLength(30);
    expect(new Set(FINANCE_ANIMATION_LIBRARY_ITEMS.map((item) => item.id)).size).toBe(30);
  });

  it('keeps every fifth-batch item named, categorized and searchable', () => {
    for (const item of getFinanceAnimationLibraryItemsByBatch(5)) {
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.purpose.length).toBeGreaterThan(20);
      expect(item.keywords.length).toBeGreaterThanOrEqual(6);
      expect(item.durationInFrames).toBe(180);
      expect(item.status).toBe('library-ready');
      expect(item.batch).toBe(5);
      expect(getFinanceAnimationLibraryCategory(item.category)).toBeDefined();
      expect(getFinanceAnimationLibraryItemsByCategory(item.category)).toContain(item);
    }
  });

  it('calculates the duration-based bond approximation consistently', () => {
    expect(calculateBondPriceChangePercent(6.5, 2, 4)).toBeCloseTo(-13, 8);
    expect(calculateBondValueAfterRateChange(10000, 6.5, 2, 4)).toBeCloseTo(8700, 8);
    expect(calculateBondPriceChangePercent(4, 5, 3)).toBeCloseTo(8, 8);
  });

  it('calculates capital gains tax only above cost basis and allowance', () => {
    expect(calculateCapitalGainsTax(25000, 16000, 1000, 26.375)).toBeCloseTo(2110, 8);
    expect(calculateNetInvestmentProceeds(25000, 16000, 1000, 26.375)).toBeCloseTo(22890, 8);
    expect(calculateCapitalGainsTax(15000, 16000, 1000, 26.375)).toBe(0);
  });

  it('separates business profit from operating cashflow', () => {
    expect(calculateBusinessProfit(48000, 36000)).toBe(12000);
    expect(calculateOperatingCashflow(48000, 36000, 3500, 5200)).toBe(10300);
  });

  it('calculates gross and net rental yields from different bases', () => {
    expect(calculateGrossRentalYieldPercent(1250, 310000)).toBeCloseTo(4.8387096774, 8);
    expect(calculateNetRentalYieldPercent(1250, 2700, 310000, 34000)).toBeCloseTo(3.5755813953, 8);
  });

  it('calculates weighted diversification shocks and lifestyle inflation', () => {
    expect(calculateDiversifiedPortfolioShockPercent([
      {label: 'Aktien', weightPercent: 55, shockPercent: -18},
      {label: 'Anleihen', weightPercent: 25, shockPercent: 4},
      {label: 'Gold', weightPercent: 10, shockPercent: 8},
      {label: 'Cash', weightPercent: 10, shockPercent: 0},
    ])).toBeCloseTo(-8.1, 8);
    expect(calculateSavingsRatePercent(2800, 2200)).toBeCloseTo(21.4285714286, 8);
    expect(calculateSavingsRatePercent(3600, 3050)).toBeCloseTo(15.2777777778, 8);
    expect(calculateLifestyleInflationLoss(2800, 2200, 3600, 3050)).toBe(850);
  });
});
