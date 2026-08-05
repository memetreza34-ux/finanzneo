import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {validateTemplateData} from './validateTemplateData';

const compoundScene = (annualReturn: number): FinanceAnimationScene => ({
  mode: 'full-animation',
  template: 'compound-growth',
  message: 'Zinseszins lässt Vermögen über Jahre wachsen.',
  voiceText: 'Einzahlungen und Erträge entwickeln sich über die Zeit.',
  labels: ['Startkapital', 'Endkapital'],
  data: {
    startCapital: 1000,
    monthlyRate: 200,
    annualReturn,
    years: 20,
  },
});

describe('compound-growth template validation', () => {
  it('accepts a nonnegative return for the growth visualization', () => {
    expect(validateTemplateData(compoundScene(7)).ok).toBe(true);
  });

  it('rejects a negative return because the current bars only visualize growth', () => {
    const result = validateTemplateData(compoundScene(-10));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Das Zinseszins-Template benötigt eine nichtnegative Rendite.',
    );
  });
});
