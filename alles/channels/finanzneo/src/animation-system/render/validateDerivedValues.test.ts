import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {FINANCE_ANIMATION_DOMAIN_LIMITS} from '../domainLimits';
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

describe('derived finance animation values', () => {
  it('rejects a compound-growth result above the display maximum', () => {
    const result = validateTemplateData(scene('compound-growth', {
      startCapital: FINANCE_ANIMATION_DOMAIN_LIMITS.maxAbsoluteMoney,
      monthlyRate: 0,
      annualReturn: 100,
      years: FINANCE_ANIMATION_DOMAIN_LIMITS.maxYears,
    }));

    expect(result.errors).toContain(
      'Der berechnete Zinseszins-Endwert überschreitet das Darstellungsmaximum.',
    );
  });

  it('rejects a monthly-investment result above the display maximum', () => {
    const result = validateTemplateData(scene('monthly-investment', {
      monthlyRate: FINANCE_ANIMATION_DOMAIN_LIMITS.maxAbsoluteMoney,
      months: FINANCE_ANIMATION_DOMAIN_LIMITS.maxMonths,
      annualReturn: 100,
    }));

    expect(result.errors).toContain(
      'Der berechnete Sparplan-Endwert überschreitet das Darstellungsmaximum.',
    );
  });

  it('accepts normal compound-growth fixture values', () => {
    const result = validateTemplateData(scene('compound-growth', {
      startCapital: 1000,
      monthlyRate: 200,
      annualReturn: 7,
      years: 20,
    }));

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts normal monthly-investment values', () => {
    const result = validateTemplateData(scene('monthly-investment', {
      monthlyRate: 250,
      months: 120,
      annualReturn: 7,
    }));

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('keeps a negative but valid monthly return within the display domain', () => {
    const result = validateTemplateData(scene('monthly-investment', {
      monthlyRate: 250,
      months: 120,
      annualReturn: -10,
    }));

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
