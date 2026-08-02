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
    expect(result.errors).toContain('Beschriftung darf nicht leer sein: fromLabel');
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
