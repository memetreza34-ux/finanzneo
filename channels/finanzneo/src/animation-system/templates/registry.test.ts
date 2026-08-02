import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_TEMPLATES, getFinanceAnimationTemplate} from './registry';

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

  it('marks every existing template as foundation-ready', () => {
    expect(FINANCE_ANIMATION_TEMPLATES.every((item) => item.status === 'foundation-ready')).toBe(true);
  });

  it('returns definitions by id', () => {
    expect(getFinanceAnimationTemplate('compound-growth')?.title).toBe('Zinseszins');
  });

  it('requires structured data for every template', () => {
    expect(FINANCE_ANIMATION_TEMPLATES.every((item) => item.requiredData.length > 0)).toBe(true);
  });
});
