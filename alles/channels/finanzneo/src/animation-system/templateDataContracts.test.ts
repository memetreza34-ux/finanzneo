import {describe, expect, it} from 'vitest';
import {
  defineFinanceAnimationData,
  defineFinanceAnimationScene,
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

if (false) {
  // @ts-expect-error money-flow requires a numeric amount
  const missingAmount: FinanceAnimationTemplateData<'money-flow'> = {fromLabel: 'Gehalt', toLabel: 'ETF'};
  void missingAmount;

  // @ts-expect-error tax-fee-flow uses grossAmount instead of gross
  const wrongTaxField: FinanceAnimationTemplateData<'tax-fee-flow'> = {gross: 3000, taxes: 620, fees: 30};
  void wrongTaxField;

  const ambiguousPortfolio: FinanceAnimationTemplateData<'portfolio-allocation'> = {
    total: 25000,
    allocations: [
      // @ts-expect-error a portfolio position must not define value and percent together
      {label: 'ETF', value: 70, percent: 70},
    ],
  };
  void ambiguousPortfolio;
}

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

  it('creates a renderer-compatible scene while preserving template data', () => {
    const result = defineFinanceAnimationScene({
      mode: 'full-animation',
      template: 'money-flow',
      message: '600 Euro fließen in den Welt-ETF.',
      voiceText: 'Ein Teil des Gehalts wird jeden Monat investiert.',
      labels: ['Gehalt', 'Welt-ETF'],
      data: moneyFlowData,
    });

    expect(result.template).toBe('money-flow');
    expect(result.data?.amount).toBe(600);
  });
});
