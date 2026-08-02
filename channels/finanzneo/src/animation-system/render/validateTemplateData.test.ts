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

  it('rejects non-positive and non-integer durations', () => {
    const result = validateTemplateData(makeScene('monthly-investment', {
      monthlyRate: 250,
      months: 0.5,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Zahlenwert muss ganzzahlig sein: months');
  });

  it('allows negative returns above minus one hundred percent for a monthly plan', () => {
    const result = validateTemplateData(makeScene('monthly-investment', {
      monthlyRate: 250,
      months: 12,
      annualReturn: -10,
    }));

    expect(result.ok).toBe(true);
  });

  it('rejects a return of minus one hundred percent or lower', () => {
    const result = validateTemplateData(makeScene('monthly-investment', {
      monthlyRate: 250,
      months: 12,
      annualReturn: -100,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Rendite muss größer als -100 Prozent sein.');
  });

  it('rejects malformed structured lists', () => {
    const result = validateTemplateData(makeScene('portfolio-allocation', {
      allocations: [{label: '', value: -10}],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Portfolio-Einträge benötigen Label und nichtnegative Zahl.');
  });

  it('rejects a portfolio with zero total allocation', () => {
    const result = validateTemplateData(makeScene('portfolio-allocation', {
      allocations: [{label: 'ETF', value: 0}, {label: 'Cash', value: 0}],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Portfolio-Gewichtungen müssen zusammen größer als null sein.');
  });

  it('rejects explicit portfolio percentages that do not total one hundred', () => {
    const result = validateTemplateData(makeScene('portfolio-allocation', {
      allocations: [
        {label: 'ETF', percent: 60},
        {label: 'Cash', percent: 20},
      ],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('statt 100 Prozent'))).toBe(true);
  });

  it('warns when a timeline has no visible development', () => {
    const result = validateTemplateData(makeScene('timeline-milestones', {
      milestones: [{label: 'Start', value: 0}],
    }));

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain('Eine Zeitleiste mit nur einem Meilenstein zeigt keine Entwicklung.');
  });

  it('rejects budget percentages that do not total one hundred', () => {
    const result = validateTemplateData(makeScene('budget-split', {
      income: 2500,
      needsPercent: 50,
      wantsPercent: 20,
      savingsPercent: 10,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain('statt 100 Prozent');
  });

  it('rejects paid installments above the installment total', () => {
    const result = validateTemplateData(makeScene('debt-paydown', {
      originalDebt: 12000,
      remainingDebt: 4000,
      paidInstallments: 30,
      totalInstallments: 24,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Bezahlte Raten überschreiten die Gesamtzahl der Raten.');
  });

  it('rejects remaining debt above the original debt', () => {
    const result = validateTemplateData(makeScene('debt-paydown', {
      originalDebt: 12000,
      remainingDebt: 14000,
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Die Restschuld darf nicht über der ursprünglichen Schuld liegen.',
    );
  });

  it('rejects identical flow labels', () => {
    const result = validateTemplateData(makeScene('money-flow', {
      amount: 300,
      fromLabel: 'ETF',
      toLabel: 'ETF',
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Quelle und Ziel des Geldflusses müssen unterschiedlich sein.',
    );
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
