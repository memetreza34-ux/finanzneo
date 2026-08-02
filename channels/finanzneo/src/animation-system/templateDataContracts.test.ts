import {describe, expect, it} from 'vitest';
import {
  defineFinanceAnimationData,
  type FinanceAnimationTemplateData,
} from './templateDataContracts';

const moneyFlowData = {
  amount: 600,
  fromLabel: 'Gehalt',
  toLabel: 'Welt-ETF',
} satisfies FinanceAnimationTemplateData<'money-flow'>;

const portfolioData = {
  total: 25000,
  allocations: [
    {label: 'Welt-ETF', percent: 70},
    {label: 'Anleihen', value: 20},
    {label: 'Cash', percent: 10},
  ],
} satisfies FinanceAnimationTemplateData<'portfolio-allocation'>;

describe('templateDataContracts', () => {
  it('preserves strongly typed money-flow data', () => {
    const result = defineFinanceAnimationData('money-flow', moneyFlowData);
    expect(result).toBe(moneyFlowData);
    expect(result.toLabel).toBe('Welt-ETF');
  });

  it('supports value or percentage portfolio weights', () => {
    const result = defineFinanceAnimationData('portfolio-allocation', portfolioData);
    expect(result.allocations).toHaveLength(3);
    expect(result.total).toBe(25000);
  });
});
