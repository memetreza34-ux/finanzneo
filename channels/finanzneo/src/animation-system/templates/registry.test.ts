import {describe, expect, it} from 'vitest';
import {
  FINANCE_ANIMATION_TEMPLATES,
  getFinanceAnimationTemplate,
  getRequiredFinanceAnimationData,
} from './registry';
import {FINANCE_ANIMATION_REQUIRED_DATA} from './requiredTemplateData';

const EXPECTED_IDS = [
  'money-flow',
  'budget-split',
  'compound-growth',
  'portfolio-allocation',
  'inflation-erosion',
  'debt-paydown',
  'monthly-investment',
  'before-after-comparison',
  'risk-return-scale',
  'timeline-milestones',
  'income-expense-balance',
  'tax-fee-flow',
] as const;

describe('finance animation template registry', () => {
  it('contains exactly the twelve prepared templates', () => {
    expect(FINANCE_ANIMATION_TEMPLATES.map((item) => item.id)).toEqual(EXPECTED_IDS);
  });

  it('contains no duplicate template identifiers', () => {
    const ids = FINANCE_ANIMATION_TEMPLATES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks every existing template as foundation-ready', () => {
    expect(FINANCE_ANIMATION_TEMPLATES.every((item) => item.status === 'foundation-ready')).toBe(true);
  });

  it('returns definitions by id', () => {
    expect(getFinanceAnimationTemplate('compound-growth')?.title).toBe('Zinseszins');
  });

  it('returns the canonical required data for a template', () => {
    expect(getRequiredFinanceAnimationData('tax-fee-flow')).toEqual([
      'grossAmount',
      'taxes',
      'fees',
    ]);
  });

  it('derives every registry entry from the typed required-data map', () => {
    for (const template of FINANCE_ANIMATION_TEMPLATES) {
      expect(template.requiredData).toBe(
        FINANCE_ANIMATION_REQUIRED_DATA[template.id],
      );
    }
  });

  it('requires unique structured data keys for every template', () => {
    expect(FINANCE_ANIMATION_TEMPLATES.every((item) => {
      const uniqueKeys = new Set(item.requiredData);
      return item.requiredData.length > 0 && uniqueKeys.size === item.requiredData.length;
    })).toBe(true);
  });
});
