import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {FINANCE_ANIMATION_DOMAIN_LIMITS} from '../domainLimits';
import {validateTemplateData} from './validateTemplateData';

const scene = (
  template: FinanceAnimationScene['template'],
  data: NonNullable<FinanceAnimationScene['data']>,
  labels?: string[],
): FinanceAnimationScene => ({
  mode: 'full-animation',
  template,
  message: 'Testszene',
  voiceText: 'Testszene',
  data,
  ...(labels ? {labels} : {}),
});

describe('finance animation domain limits', () => {
  it('rejects compound and inflation periods above one hundred years', () => {
    const compound = validateTemplateData(scene('compound-growth', {
      startCapital: 1000,
      monthlyRate: 200,
      annualReturn: 7,
      years: FINANCE_ANIMATION_DOMAIN_LIMITS.maxYears + 1,
    }));
    const inflation = validateTemplateData(scene('inflation-erosion', {
      startingValue: 100,
      inflationPercent: 2,
      years: FINANCE_ANIMATION_DOMAIN_LIMITS.maxYears + 1,
    }));

    expect(compound.errors).toContain(
      `Laufzeit überschreitet ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxYears} Jahre.`,
    );
    expect(inflation.errors).toContain(
      `Laufzeit überschreitet ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxYears} Jahre.`,
    );
  });

  it('rejects monthly plans above the supported month range', () => {
    const result = validateTemplateData(scene('monthly-investment', {
      monthlyRate: 250,
      months: FINANCE_ANIMATION_DOMAIN_LIMITS.maxMonths + 1,
      annualReturn: 7,
    }));

    expect(result.errors).toContain(
      `Laufzeit überschreitet ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxMonths} Monate.`,
    );
  });

  it('rejects installment counts above the supported range', () => {
    const result = validateTemplateData(scene('debt-paydown', {
      originalDebt: 12000,
      remainingDebt: 4000,
      paidInstallments: FINANCE_ANIMATION_DOMAIN_LIMITS.maxInstallments + 1,
      totalInstallments: FINANCE_ANIMATION_DOMAIN_LIMITS.maxInstallments + 1,
    }));

    expect(result.errors).toEqual(expect.arrayContaining([
      `Ratenzahl überschreitet ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxInstallments}: paidInstallments`,
      `Ratenzahl überschreitet ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxInstallments}: totalInstallments`,
    ]));
  });

  it('rejects top-level money values above the display maximum', () => {
    const result = validateTemplateData(scene('money-flow', {
      amount: FINANCE_ANIMATION_DOMAIN_LIMITS.maxAbsoluteMoney + 1,
      fromLabel: 'Quelle',
      toLabel: 'Ziel',
    }));

    expect(result.errors).toContain(
      'Geldwert überschreitet das Darstellungsmaximum: amount',
    );
  });

  it('rejects portfolio values above the display maximum', () => {
    const tooLarge = FINANCE_ANIMATION_DOMAIN_LIMITS.maxAbsoluteMoney + 1;
    const result = validateTemplateData(scene('portfolio-allocation', {
      total: tooLarge,
      allocations: [{label: 'ETF', value: tooLarge}],
    }));

    expect(result.errors).toEqual(expect.arrayContaining([
      'Geldwert überschreitet das Darstellungsmaximum: total',
      'Portfolio-Wert in Position 1 überschreitet das Darstellungsmaximum.',
    ]));
  });

  it('rejects oversized numerical timeline values', () => {
    const result = validateTemplateData(scene('timeline-milestones', {
      milestones: [{
        label: 'Ziel',
        value: FINANCE_ANIMATION_DOMAIN_LIMITS.maxTimelineAbsoluteValue + 1,
      }],
    }));

    expect(result.errors).toContain(
      'Meilenstein-Wert in Position 1 überschreitet das Darstellungsmaximum.',
    );
  });

  it('rejects oversized structured labels', () => {
    const label = 'L'.repeat(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength + 1,
    );
    const portfolio = validateTemplateData(scene('portfolio-allocation', {
      total: 10000,
      allocations: [{label, percent: 100}],
    }));
    const timeline = validateTemplateData(scene('timeline-milestones', {
      milestones: [{label, value: 1000}],
    }));

    expect(portfolio.errors).toContain(
      `Portfolio-Label in Position 1 ist länger als ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength} Zeichen.`,
    );
    expect(timeline.errors).toContain(
      `Meilenstein-Label in Position 1 ist länger als ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength} Zeichen.`,
    );
  });

  it('rejects oversized top-level and auxiliary visible labels', () => {
    const label = 'L'.repeat(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength + 1,
    );
    const result = validateTemplateData(scene('money-flow', {
      amount: 300,
      fromLabel: label,
      toLabel: 'Depot',
    }, [label]));

    expect(result.errors).toEqual(expect.arrayContaining([
      `Sichtbarer Text ist länger als ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength} Zeichen: fromLabel`,
      `Sichtbarer Text ist länger als ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength} Zeichen: labels[0]`,
    ]));
  });

  it('rejects oversized string values inside timeline cards', () => {
    const value = 'W'.repeat(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength + 1,
    );
    const result = validateTemplateData(scene('timeline-milestones', {
      milestones: [{label: 'Ziel', value}],
    }));

    expect(result.errors).toContain(
      `Sichtbarer Text ist länger als ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength} Zeichen: milestones[0].value`,
    );
  });

  it('accepts exact upper boundaries', () => {
    const exactLabel = 'L'.repeat(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength,
    );
    const moneyFlow = validateTemplateData(scene('money-flow', {
      amount: FINANCE_ANIMATION_DOMAIN_LIMITS.maxAbsoluteMoney,
      fromLabel: exactLabel,
      toLabel: 'Ziel',
    }));
    const monthly = validateTemplateData(scene('monthly-investment', {
      monthlyRate: 1,
      months: FINANCE_ANIMATION_DOMAIN_LIMITS.maxMonths,
      annualReturn: 0,
    }));

    expect(moneyFlow.ok).toBe(true);
    expect(monthly.ok).toBe(true);
  });
});
