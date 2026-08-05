import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {validateTemplateSemantics} from './validateTemplateSemantics';

const scene = (
  template: FinanceAnimationScene['template'],
  data: NonNullable<FinanceAnimationScene['data']>,
): FinanceAnimationScene => ({
  mode: 'full-animation',
  template,
  message: 'Testszene',
  voiceText: 'Testszene',
  data,
});

describe('validateTemplateSemantics', () => {
  it('rejects zero-value money flow and invisible labels', () => {
    const result = validateTemplateSemantics(scene('money-flow', {
      amount: 0,
      fromLabel: '   ',
      toLabel: 'ETF',
    }));

    expect(result.errors).toContain('Der Geldfluss-Betrag muss größer als null sein.');
    expect(result.errors).toContain('Beschriftung muss ein sichtbarer Text sein: fromLabel');
  });

  it('rejects non-string labels at untrusted input boundaries', () => {
    const result = validateTemplateSemantics(scene('before-after-comparison', {
      beforeLabel: 100,
      afterLabel: 'Nachher',
      beforeValue: 1000,
      afterValue: 1200,
    }));

    expect(result.errors).toContain('Beschriftung muss ein sichtbarer Text sein: beforeLabel');
  });

  it('detects flow labels that only differ by casing and whitespace', () => {
    const result = validateTemplateSemantics(scene('money-flow', {
      amount: 300,
      fromLabel: ' ETF ',
      toLabel: 'etf',
    }));

    expect(result.errors).toContain(
      'Quelle und Ziel des Geldflusses sind auch nach Normalisierung identisch.',
    );
  });

  it('requires compound growth to have capital or a monthly contribution', () => {
    const result = validateTemplateSemantics(scene('compound-growth', {
      startCapital: 0,
      monthlyRate: 0,
      annualReturn: 7,
      years: 20,
    }));

    expect(result.errors).toContain(
      'Zinseszins benötigt Startkapital oder eine positive monatliche Einzahlung.',
    );
  });

  it('rejects a flat compound-growth scene without contribution or return', () => {
    const result = validateTemplateSemantics(scene('compound-growth', {
      startCapital: 1000,
      monthlyRate: 0,
      annualReturn: 0,
      years: 20,
    }));

    expect(result.errors).toContain(
      'Das Wachstumstemplate benötigt eine positive Einzahlung oder Rendite.',
    );
  });

  it('requires a positive inflation rate for an erosion scene', () => {
    const result = validateTemplateSemantics(scene('inflation-erosion', {
      startingValue: 100,
      inflationPercent: 0,
      years: 10,
    }));

    expect(result.errors).toContain(
      'Das Kaufkraftverlust-Template benötigt eine positive Inflationsrate.',
    );
  });

  it('keeps debt amount and installment progress logically consistent', () => {
    const noPayments = validateTemplateSemantics(scene('debt-paydown', {
      originalDebt: 12000,
      remainingDebt: 8000,
      paidInstallments: 0,
      totalInstallments: 40,
    }));
    expect(noPayments.errors).toContain(
      'Die Restschuld ist gesunken, obwohl keine Raten bezahlt wurden.',
    );

    const noReduction = validateTemplateSemantics(scene('debt-paydown', {
      originalDebt: 12000,
      remainingDebt: 12000,
      paidInstallments: 10,
      totalInstallments: 40,
    }));
    expect(noReduction.errors).toContain(
      'Schuldenabbau benötigt nach bezahlten Raten eine niedrigere Restschuld.',
    );
  });

  it('requires positive core values for relevant templates', () => {
    expect(validateTemplateSemantics(scene('budget-split', {
      income: 0,
      needsPercent: 50,
      wantsPercent: 30,
      savingsPercent: 20,
    })).errors).toContain('Das verfügbare Budget muss größer als null sein.');

    expect(validateTemplateSemantics(scene('monthly-investment', {
      monthlyRate: 0,
      months: 12,
    })).errors).toContain('Die monatliche Sparrate muss größer als null sein.');

    expect(validateTemplateSemantics(scene('tax-fee-flow', {
      grossAmount: 0,
      taxes: 0,
      fees: 0,
    })).errors).toContain('Der Bruttobetrag muss größer als null sein.');
  });

  it('warns about visually empty comparison scales', () => {
    expect(validateTemplateSemantics(scene('risk-return-scale', {
      riskPercent: 0,
      returnPercent: 0,
    })).warnings).toContain(
      'Risiko und Renditechance sind beide null; die Skala zeigt keinen Unterschied.',
    );

    expect(validateTemplateSemantics(scene('income-expense-balance', {
      income: 0,
      expenses: 0,
    })).warnings).toContain(
      'Einnahmen und Ausgaben sind beide null; es entsteht keine sichtbare Balance.',
    );
  });
});
