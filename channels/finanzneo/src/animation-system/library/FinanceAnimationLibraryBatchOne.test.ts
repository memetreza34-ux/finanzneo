import {describe, expect, it} from 'vitest';
import {
  calculateCrashValue,
  calculateDividendIncome,
  calculateEmergencyFundTarget,
  calculateFireTarget,
  calculateMonthlyMortgagePayment,
  calculateNetWorth,
  calculateRecoveryValue,
  calculateRemainingMortgageBalance,
} from './FinanceAnimationLibraryBatchOne';
import {
  FINANCE_ANIMATION_LIBRARY_CATEGORIES,
  getFinanceAnimationLibraryCategory,
  getFinanceAnimationLibraryItemsByBatch,
  getFinanceAnimationLibraryItemsByCategory,
} from './catalog';

const BATCH_ONE_IDS = [
  'market-crash-recovery',
  'dividend-snowball',
  'emergency-fund-progress',
  'mortgage-amortization',
  'net-worth-stack',
  'fire-progress',
] as const;

describe('FinanceAnimationLibraryBatchOne', () => {
  it('keeps the first six reusable animations intact', () => {
    const items = getFinanceAnimationLibraryItemsByBatch(1);
    expect(items).toHaveLength(6);
    expect(items.map((item) => item.id)).toEqual(BATCH_ONE_IDS);
    expect(new Set(FINANCE_ANIMATION_LIBRARY_CATEGORIES.map((item) => item.id)).size).toBe(FINANCE_ANIMATION_LIBRARY_CATEGORIES.length);
  });

  it('keeps every first-batch item named, categorized and searchable', () => {
    for (const item of getFinanceAnimationLibraryItemsByBatch(1)) {
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.purpose.length).toBeGreaterThan(20);
      expect(item.keywords.length).toBeGreaterThanOrEqual(4);
      expect(item.durationInFrames).toBe(180);
      expect(item.status).toBe('library-ready');
      expect(item.batch).toBe(1);
      expect(getFinanceAnimationLibraryCategory(item.category)).toBeDefined();
      expect(getFinanceAnimationLibraryItemsByCategory(item.category)).toContain(item);
    }
  });

  it('calculates crash and recovery values without mixing the percentage bases', () => {
    expect(calculateCrashValue(10000, 35)).toBe(6500);
    expect(calculateRecoveryValue(10000, 35, 62)).toBe(10530);
  });

  it('calculates dividend income and emergency fund targets', () => {
    expect(calculateDividendIncome(80000, 3.5)).toBe(2800);
    expect(calculateEmergencyFundTarget(1800, 6)).toBe(10800);
  });

  it('calculates mortgage payment and remaining balance deterministically', () => {
    expect(calculateMonthlyMortgagePayment(350000, 3.5, 30)).toBeCloseTo(1571.6564, 3);
    expect(calculateRemainingMortgageBalance(350000, 3.5, 30, 10)).toBeCloseTo(270994.0637, 2);
    expect(calculateMonthlyMortgagePayment(120000, 0, 10)).toBe(1000);
    expect(calculateRemainingMortgageBalance(120000, 0, 10, 5)).toBe(60000);
  });

  it('calculates net worth and FIRE targets', () => {
    expect(calculateNetWorth(390000, 210000)).toBe(180000);
    expect(calculateFireTarget(30000, 4)).toBe(750000);
    expect(calculateFireTarget(30000, 0)).toBe(0);
  });
});
