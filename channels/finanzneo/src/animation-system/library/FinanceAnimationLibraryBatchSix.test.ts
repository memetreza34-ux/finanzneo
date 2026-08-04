import {describe, expect, it} from 'vitest';
import {
  calculateAnnualSubscriptionCost,
  calculateBnplCommittedAmount,
  calculateBnplMonthlyLoad,
  calculateDividendTotalReturnPercent,
  calculateExchangeLoss,
  calculateExchangeReceived,
  calculateFreedomYears,
  calculateLoanMonthlyPayment,
  calculateRefinanceBreakEvenMonths,
} from './FinanceAnimationLibraryBatchSix';
import {
  FINANCE_ANIMATION_LIBRARY_BATCH_SIX_CATEGORIES,
  FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS,
  FINANCE_ANIMATION_LIBRARY_COMBINED_ITEMS,
  getFinanceAnimationLibraryBatchSixCategory,
  getFinanceAnimationLibraryCombinedItemsByCategory,
} from './FinanceAnimationLibraryBatchSixCatalog';

const BATCH_SIX_IDS = [
  'subscription-creep',
  'currency-exchange-spread',
  'loan-refinance-break-even',
  'dividend-yield-trap',
  'savings-rate-freedom-timeline',
  'bnpl-installment-stack',
] as const;

describe('FinanceAnimationLibraryBatchSix', () => {
  it('registers six additional reusable animations in the combined library', () => {
    expect(FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS).toHaveLength(6);
    expect(FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS.map((item) => item.id)).toEqual(BATCH_SIX_IDS);
    expect(FINANCE_ANIMATION_LIBRARY_COMBINED_ITEMS).toHaveLength(36);
    expect(new Set(FINANCE_ANIMATION_LIBRARY_COMBINED_ITEMS.map((item) => item.id)).size).toBe(36);
    expect(FINANCE_ANIMATION_LIBRARY_BATCH_SIX_CATEGORIES).toHaveLength(15);
  });

  it('keeps every sixth-batch item named, categorized and searchable', () => {
    for (const item of FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS) {
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.purpose.length).toBeGreaterThan(20);
      expect(item.keywords.length).toBeGreaterThanOrEqual(6);
      expect(item.durationInFrames).toBe(180);
      expect(item.status).toBe('library-ready');
      expect(item.batch).toBe(6);
      expect(getFinanceAnimationLibraryBatchSixCategory(item.category)).toBeDefined();
      expect(getFinanceAnimationLibraryCombinedItemsByCategory(item.category)).toContain(item);
    }
  });

  it('calculates annual subscription costs from monthly contracts', () => {
    expect(calculateAnnualSubscriptionCost([
      {label: 'Streaming', monthlyCost: 17.99},
      {label: 'Musik', monthlyCost: 10.99},
      {label: 'Cloud', monthlyCost: 9.99},
      {label: 'Fitness', monthlyCost: 34.9},
      {label: 'Apps', monthlyCost: 18.5},
    ])).toBeCloseTo(1108.44, 8);
  });

  it('separates exchange-rate and fee losses from the ideal value', () => {
    expect(calculateExchangeReceived(1000, 1.055, 1.5, 4.9)).toBeCloseTo(1034.0055, 8);
    expect(calculateExchangeLoss(1000, 1.09, 1.055, 1.5, 4.9)).toBeCloseTo(55.9945, 8);
  });

  it('calculates refinance payments and break-even month', () => {
    expect(calculateLoanMonthlyPayment(180000, 5.4, 18)).toBeCloseTo(1304.6660175, 6);
    expect(calculateLoanMonthlyPayment(180000, 3.7, 18)).toBeCloseTo(1142.6482057, 6);
    expect(calculateRefinanceBreakEvenMonths(180000, 5.4, 3.7, 18, 3900)).toBe(25);
    expect(calculateRefinanceBreakEvenMonths(180000, 3.7, 5.4, 18, 3900)).toBe(0);
  });

  it('combines dividends and price changes into total return', () => {
    expect(calculateDividendTotalReturnPercent(12, -35)).toBe(-23);
    expect(calculateDividendTotalReturnPercent(4, 8)).toBe(12);
  });

  it('models shorter freedom timelines at higher savings rates', () => {
    const ten = calculateFreedomYears(3200, 10, 6, 4);
    const twentyFive = calculateFreedomYears(3200, 25, 6, 4);
    const forty = calculateFreedomYears(3200, 40, 6, 4);
    const fiftyFive = calculateFreedomYears(3200, 55, 6, 4);
    expect(ten).toBeCloseTo(44.75, 8);
    expect(twentyFive).toBeCloseTo(28.5, 8);
    expect(forty).toBeCloseTo(19.75, 8);
    expect(fiftyFive).toBeCloseTo(13.4166667, 6);
    expect(ten).toBeGreaterThan(twentyFive);
    expect(twentyFive).toBeGreaterThan(forty);
    expect(forty).toBeGreaterThan(fiftyFive);
  });

  it('calculates monthly and total BNPL commitments', () => {
    const contracts = [
      {label: 'Smartphone', monthlyPayment: 79, remainingMonths: 18},
      {label: 'Möbel', monthlyPayment: 64, remainingMonths: 11},
      {label: 'Kleidung', monthlyPayment: 42, remainingMonths: 4},
      {label: 'Laptop', monthlyPayment: 119, remainingMonths: 15},
    ];
    expect(calculateBnplMonthlyLoad(contracts)).toBe(304);
    expect(calculateBnplCommittedAmount(contracts)).toBe(4079);
  });
});
