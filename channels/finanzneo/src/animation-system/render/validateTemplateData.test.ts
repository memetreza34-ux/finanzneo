import {describe, expect, it} from 'vitest';
import type {
  FinanceAnimationData,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import {validateTemplateData} from './validateTemplateData';

const baseScene: FinanceAnimationScene = {
  mode: 'full-animation',
  template: 'money-flow',
  message: '300 Euro fließen jeden Monat in den ETF.',
  voiceText: 'Jeden Monat investierst du 300 Euro in einen ETF.',
  labels: ['Gehalt', 'ETF'],
  data: {
    amount: 300,
    fromLabel: 'Gehalt',
    toLabel: 'ETF',
  },
};

const makeScene = (
  template: FinanceAnimationTemplate,
  data: FinanceAnimationData,
): FinanceAnimationScene => ({
  ...baseScene,
  template,
  data,
});

describe('validateTemplateData', () => {
  it('accepts complete template data', () => {
    expect(validateTemplateData(baseScene)).toEqual({
      ok: true,
      template: 'money-flow',
      errors: [],
      warnings: [],
    });
  });

  it('reports missing required data', () => {
    const result = validateTemplateData({...baseScene, data: {amount: 300}});
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Pflichtwert fehlt: fromLabel');
    expect(result.errors).toContain('Pflichtwert fehlt: toLabel');
  });

  it('rejects invalid numeric and percentage values', () => {
    const result = validateTemplateData(makeScene('risk-return-scale', {
      riskPercent: 140,
      returnPercent: Number.NaN,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Prozentwert liegt über 100: riskPercent');
    expect(result.errors).toContain('Zahlenwert ist ungültig: returnPercent');
  });

  it('rejects malformed structured lists', () => {
    const result = validateTemplateData(makeScene('portfolio-allocation', {
      allocations: [{label: '', value: -10}],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Portfolio-Einträge benötigen Label und nichtnegative Zahl.');
  });

  it('warns when budget percentages do not total one hundred', () => {
    const result = validateTemplateData(makeScene('budget-split', {
      income: 2500,
      needsPercent: 50,
      wantsPercent: 20,
      savingsPercent: 10,
    }));

    expect(result.ok).toBe(true);
    expect(result.warnings[0]).toContain('statt 100 Prozent');
  });

  it('rejects deductions above the gross amount', () => {
    const result = validateTemplateData(makeScene('tax-fee-flow', {
      grossAmount: 1000,
      taxes: 800,
      fees: 300,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Steuern und Gebühren überschreiten den Bruttobetrag.');
  });

  it('warns about excessive labels', () => {
    const result = validateTemplateData({...baseScene, labels: ['1', '2', '3', '4', '5', '6']});
    expect(result.ok).toBe(true);
    expect(result.warnings).toHaveLength(1);
  });
});
