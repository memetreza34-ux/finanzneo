import {describe, expect, it} from 'vitest';
import {
  calculateAnnualInsuranceCost,
  calculateBubbleCrashValue,
  calculateBubblePeakValue,
  calculateDcaEndValue,
  calculateDcaShares,
  calculateLargestWealthShare,
  calculateLumpSumEndValue,
  calculateNetSalary,
  findHighestNetVariant,
  normalizeWealthDistribution,
} from './FinanceAnimationLibraryBatchThree';
import {
  FINANCE_ANIMATION_LIBRARY_ITEMS,
  getFinanceAnimationLibraryCategory,
  getFinanceAnimationLibraryItemsByBatch,
  getFinanceAnimationLibraryItemsByCategory,
} from './catalog';

const BATCH_THREE_IDS = [
  'gross-net-waterfall',
  'tax-class-comparison',
  'dca-vs-lump-sum',
  'market-bubble-cycle',
  'insurance-cost-stack',
  'wealth-distribution',
] as const;

describe('FinanceAnimationLibraryBatchThree', () => {
  it('keeps the third six reusable animations intact', () => {
    const items = getFinanceAnimationLibraryItemsByBatch(3);
    expect(items).toHaveLength(6);
    expect(items.map((item) => item.id)).toEqual(BATCH_THREE_IDS);
    expect(FINANCE_ANIMATION_LIBRARY_ITEMS.length).toBeGreaterThanOrEqual(18);
    expect(new Set(FINANCE_ANIMATION_LIBRARY_ITEMS.map((item) => item.id)).size).toBe(
      FINANCE_ANIMATION_LIBRARY_ITEMS.length,
    );
  });

  it('keeps every third-batch item named, categorized and searchable', () => {
    for (const item of getFinanceAnimationLibraryItemsByBatch(3)) {
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.purpose.length).toBeGreaterThan(20);
      expect(item.keywords.length).toBeGreaterThanOrEqual(6);
      expect(item.durationInFrames).toBe(180);
      expect(item.status).toBe('library-ready');
      expect(item.batch).toBe(3);
      expect(getFinanceAnimationLibraryCategory(item.category)).toBeDefined();
      expect(getFinanceAnimationLibraryItemsByCategory(item.category)).toContain(item);
    }
  });

  it('calculates net salary and identifies the highest example payout', () => {
    expect(calculateNetSalary(4200, 620, 840, 55)).toBe(2685);
    expect(calculateNetSalary(1000, 800, 400, 0)).toBe(0);
    expect(findHighestNetVariant([
      {label: 'Klasse I', netSalary: 2685},
      {label: 'Klasse III', netSalary: 3020},
      {label: 'Klasse V', netSalary: 2250},
    ])).toEqual({label: 'Klasse III', netSalary: 3020});
  });

  it('calculates DCA and lump-sum outcomes from the same capital', () => {
    const prices = [100, 80, 60, 90, 120, 140];
    expect(calculateDcaShares(12000, prices)).toBeCloseTo(131.5079365079, 8);
    expect(calculateDcaEndValue(12000, prices)).toBeCloseTo(18411.1111111111, 8);
    expect(calculateLumpSumEndValue(12000, prices)).toBe(16800);
    expect(calculateDcaEndValue(12000, prices)).toBeGreaterThan(calculateLumpSumEndValue(12000, prices));
    expect(calculateDcaShares(12000, [])).toBe(0);
  });

  it('keeps bubble percentages on their correct bases', () => {
    expect(calculateBubblePeakValue(10000, 180)).toBe(28000);
    expect(calculateBubbleCrashValue(10000, 180, 72)).toBeCloseTo(7840, 8);
  });

  it('calculates annual insurance cost from monthly policies', () => {
    const policies = [
      {label: 'Haftpflicht', monthlyPremium: 8},
      {label: 'Hausrat', monthlyPremium: 14},
      {label: 'Rechtsschutz', monthlyPremium: 29},
      {label: 'Berufsunfähigkeit', monthlyPremium: 96},
      {label: 'Kfz', monthlyPremium: 74},
    ];
    expect(calculateAnnualInsuranceCost(policies)).toBe(2652);
  });

  it('normalizes population and wealth shares independently', () => {
    const normalized = normalizeWealthDistribution([
      {label: 'Untere 50 %', populationPercent: 50, wealthPercent: 3},
      {label: 'Mittlere 40 %', populationPercent: 40, wealthPercent: 31},
      {label: 'Obere 10 %', populationPercent: 10, wealthPercent: 66},
    ]);
    expect(normalized.reduce((sum, item) => sum + item.populationPercent, 0)).toBeCloseTo(100, 8);
    expect(normalized.reduce((sum, item) => sum + item.wealthPercent, 0)).toBeCloseTo(100, 8);
    expect(calculateLargestWealthShare(normalized)).toBeCloseTo(66, 8);
  });
});
