import {describe, expect, it} from 'vitest';
import {
  calculateCashflowSurplus,
  calculateMinimumPaymentPlan,
  calculateRebalanceTrades,
  calculateRecoveryGainNeeded,
  calculateRentVsBuyBreakEvenYears,
  calculateSequenceEndBalance,
} from './FinanceAnimationLibraryBatchFour';
import {
  FINANCE_ANIMATION_LIBRARY_ITEMS,
  getFinanceAnimationLibraryCategory,
  getFinanceAnimationLibraryItemsByBatch,
  getFinanceAnimationLibraryItemsByCategory,
} from './catalog';

const BATCH_FOUR_IDS = [
  'cashflow-surplus-funnel',
  'credit-card-minimum-payment',
  'portfolio-rebalancing',
  'rent-vs-buy-break-even',
  'drawdown-recovery-time',
  'sequence-of-returns-risk',
] as const;

describe('FinanceAnimationLibraryBatchFour', () => {
  it('keeps the fourth six reusable animations intact', () => {
    const items = getFinanceAnimationLibraryItemsByBatch(4);
    expect(items).toHaveLength(6);
    expect(items.map((item) => item.id)).toEqual(BATCH_FOUR_IDS);
    expect(FINANCE_ANIMATION_LIBRARY_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(new Set(FINANCE_ANIMATION_LIBRARY_ITEMS.map((item) => item.id)).size).toBe(
      FINANCE_ANIMATION_LIBRARY_ITEMS.length,
    );
  });

  it('keeps every fourth-batch item named, categorized and searchable', () => {
    for (const item of getFinanceAnimationLibraryItemsByBatch(4)) {
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.purpose.length).toBeGreaterThan(20);
      expect(item.keywords.length).toBeGreaterThanOrEqual(6);
      expect(item.durationInFrames).toBe(180);
      expect(item.status).toBe('library-ready');
      expect(item.batch).toBe(4);
      expect(getFinanceAnimationLibraryCategory(item.category)).toBeDefined();
      expect(getFinanceAnimationLibraryItemsByCategory(item.category)).toContain(item);
    }
  });

  it('calculates the monthly cashflow surplus', () => {
    const expenses = [
      {label: 'Wohnen', amount: 1150},
      {label: 'Lebensmittel', amount: 420},
      {label: 'Mobilität', amount: 260},
      {label: 'Verträge', amount: 190},
      {label: 'Freizeit', amount: 310},
    ];
    expect(calculateCashflowSurplus(3200, expenses)).toBe(870);
    expect(calculateCashflowSurplus(2000, expenses)).toBe(-330);
  });

  it('calculates a deterministic minimum-payment plan', () => {
    const result = calculateMinimumPaymentPlan(5000, 19.9, 3, 50);
    expect(result.paid).toBe(true);
    expect(result.months).toBe(128);
    expect(result.totalInterest).toBeCloseTo(4751.284951, 5);
  });

  it('calculates rebalancing trades without changing total portfolio value', () => {
    const trades = calculateRebalanceTrades(
      100000,
      [
        {label: 'Aktien', percent: 78},
        {label: 'Anleihen', percent: 14},
        {label: 'Cash', percent: 8},
      ],
      [
        {label: 'Aktien', percent: 70},
        {label: 'Anleihen', percent: 20},
        {label: 'Cash', percent: 10},
      ],
    );
    expect(trades.map((trade) => trade.tradeValue)).toEqual([-8000, 6000, 2000]);
    expect(trades.reduce((sum, trade) => sum + trade.tradeValue, 0)).toBe(0);
  });

  it('calculates rent-buy break-even and drawdown recovery percentages', () => {
    expect(calculateRentVsBuyBreakEvenYears(1350, 2.5, 52000, 1050)).toBe(10);
    expect(calculateRecoveryGainNeeded(50)).toBe(100);
    expect(calculateRecoveryGainNeeded(35)).toBeCloseTo(53.8461538, 6);
  });

  it('shows sequence risk from the same return building blocks', () => {
    const goodFirst = [12, 9, 7, 5, -4, -8, 6, 8];
    const badFirst = [-8, -4, 5, 7, 9, 12, 6, 8];
    expect([...goodFirst].sort((a, b) => a - b)).toEqual([...badFirst].sort((a, b) => a - b));
    const endA = calculateSequenceEndBalance(500000, 24000, goodFirst);
    const endB = calculateSequenceEndBalance(500000, 24000, badFirst);
    expect(endA).toBeCloseTo(483990.4709, 3);
    expect(endB).toBeCloseTo(441928.2564, 3);
    expect(endA).toBeGreaterThan(endB);
  });
});
