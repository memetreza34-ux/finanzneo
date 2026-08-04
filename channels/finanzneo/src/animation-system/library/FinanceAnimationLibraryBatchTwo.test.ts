import {describe, expect, it} from 'vitest';
import {
  calculateDebtSnowballOrder,
  calculateEtfFeeGap,
  calculateFeeAdjustedFutureValue,
  calculateNominalSalary,
  calculatePercentChange,
  calculateRealSalary,
  calculateRetirementGap,
  calculateSavingsGoalMonths,
  calculateTotalDebt,
} from './FinanceAnimationLibraryBatchTwo';
import {
  FINANCE_ANIMATION_LIBRARY_ITEMS,
  getFinanceAnimationLibraryCategory,
  getFinanceAnimationLibraryItemsByBatch,
  getFinanceAnimationLibraryItemsByCategory,
} from './catalog';

const BATCH_TWO_IDS = [
  'stock-vs-etf-race',
  'salary-vs-inflation',
  'debt-snowball',
  'savings-goal-countdown',
  'retirement-gap',
  'etf-fee-drag',
] as const;

describe('FinanceAnimationLibraryBatchTwo', () => {
  it('registers six additional reusable animations with unique ids', () => {
    const items = getFinanceAnimationLibraryItemsByBatch(2);
    expect(items).toHaveLength(6);
    expect(items.map((item) => item.id)).toEqual(BATCH_TWO_IDS);
    expect(new Set(FINANCE_ANIMATION_LIBRARY_ITEMS.map((item) => item.id)).size).toBe(12);
  });

  it('keeps every second-batch item named, categorized and searchable', () => {
    for (const item of getFinanceAnimationLibraryItemsByBatch(2)) {
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.purpose.length).toBeGreaterThan(20);
      expect(item.keywords.length).toBeGreaterThanOrEqual(5);
      expect(item.durationInFrames).toBe(180);
      expect(item.status).toBe('library-ready');
      expect(item.batch).toBe(2);
      expect(getFinanceAnimationLibraryCategory(item.category)).toBeDefined();
      expect(getFinanceAnimationLibraryItemsByCategory(item.category)).toContain(item);
    }
  });

  it('calculates market changes and real salary values', () => {
    expect(calculatePercentChange(10000, 14600)).toBeCloseTo(46, 8);
    expect(calculateNominalSalary(3000, 2, 10)).toBeCloseTo(3656.9833, 3);
    expect(calculateRealSalary(3000, 2, 3, 10)).toBeCloseTo(2721.1390, 3);
    expect(calculateRealSalary(3000, 2, 3, 10)).toBeLessThan(3000);
  });

  it('orders the debt snowball by balance and calculates total debt', () => {
    const debts = [
      {label: 'Autokredit', balance: 12800, annualInterestPercent: 4.8},
      {label: 'Kreditkarte', balance: 1800, annualInterestPercent: 18.9},
      {label: 'Konsumkredit', balance: 6200, annualInterestPercent: 7.4},
    ];
    expect(calculateTotalDebt(debts)).toBe(20800);
    expect(calculateDebtSnowballOrder(debts).map((debt) => debt.label)).toEqual([
      'Kreditkarte',
      'Konsumkredit',
      'Autokredit',
    ]);
  });

  it('calculates savings countdowns and retirement gaps', () => {
    expect(calculateSavingsGoalMonths(30000, 12000, 600)).toBe(30);
    expect(calculateSavingsGoalMonths(30000, 30000, 600)).toBe(0);
    expect(calculateSavingsGoalMonths(30000, 12000, 0)).toBe(0);
    expect(calculateRetirementGap(2800, 1450, 450)).toBe(900);
    expect(calculateRetirementGap(2000, 1600, 500)).toBe(0);
  });

  it('calculates the long-term difference caused by annual fees', () => {
    const lowCost = calculateFeeAdjustedFutureValue(10000, 250, 7, 0.2, 30);
    const highCost = calculateFeeAdjustedFutureValue(10000, 250, 7, 1.8, 30);
    expect(lowCost).toBeCloseTo(369690.3409, 3);
    expect(highCost).toBeCloseTo(263359.4287, 3);
    expect(calculateEtfFeeGap(10000, 250, 7, 0.2, 1.8, 30)).toBeCloseTo(106330.9122, 3);
    expect(lowCost).toBeGreaterThan(highCost);
  });
});
