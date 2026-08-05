import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {validateTemplateData} from './validateTemplateData';

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

describe('exact animation template data contracts', () => {
  it('rejects unknown top-level data fields', () => {
    const result = validateTemplateData(scene('money-flow', {
      amount: 500,
      fromLabel: 'Gehalt',
      toLabel: 'Depot',
      unexpectedField: 'wird nicht gerendert',
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Unbekanntes Datenfeld für money-flow: unexpectedField',
    );
  });

  it('allows the optional annual return for monthly investments', () => {
    const result = validateTemplateData(scene('monthly-investment', {
      monthlyRate: 200,
      months: 120,
      annualReturn: 7,
    }));

    expect(result.errors.some((error) => error.includes('Unbekanntes Datenfeld'))).toBe(false);
    expect(result.ok).toBe(true);
  });

  it('rejects unknown fields inside portfolio entries', () => {
    const result = validateTemplateData(scene('portfolio-allocation', {
      total: 10000,
      allocations: [
        {label: 'ETF', percent: 70, hiddenColor: '#fff'},
        {label: 'Tagesgeld', percent: 30},
      ],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Unbekanntes Portfolio-Feld in Position 1: hiddenColor',
    );
  });

  it('rejects unknown fields inside timeline milestones', () => {
    const result = validateTemplateData(scene('timeline-milestones', {
      milestones: [
        {label: 'Start', value: 1000, executableHint: 'ignore'},
        {label: 'Ziel', value: 5000},
      ],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Unbekanntes Meilenstein-Feld in Position 1: executableHint',
    );
  });

  it('accepts exact percentage-based portfolio data', () => {
    const result = validateTemplateData(scene('portfolio-allocation', {
      total: 10000,
      allocations: [
        {label: 'ETF', percent: 70},
        {label: 'Tagesgeld', percent: 30},
      ],
    }));

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts exact value-based portfolio data matching the total', () => {
    const result = validateTemplateData(scene('portfolio-allocation', {
      total: 10000,
      allocations: [
        {label: 'ETF', value: 7000},
        {label: 'Tagesgeld', value: 3000},
      ],
    }));

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects mixed portfolio weighting modes', () => {
    const result = validateTemplateData(scene('portfolio-allocation', {
      total: 10000,
      allocations: [
        {label: 'ETF', percent: 70},
        {label: 'Tagesgeld', value: 3000},
      ],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Portfolio-Positionen müssen einheitlich entweder percent oder value verwenden.',
    );
  });

  it('rejects value-based allocations whose sum differs from the displayed total', () => {
    const result = validateTemplateData(scene('portfolio-allocation', {
      total: 10000,
      allocations: [
        {label: 'ETF', value: 6000},
        {label: 'Tagesgeld', value: 3000},
      ],
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Portfolio-Werte ergeben 9000.00 statt 10000.00 Gesamtwert.',
    );
  });
});
