import React from 'react';
import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene, FinanceAnimationTemplate} from '../contracts';
import {
  CompoundGrowthTemplate,
  type CompoundGrowthTemplateProps,
  InflationErosionTemplate,
  type InflationErosionTemplateProps,
  MonthlyInvestmentTemplate,
  type MonthlyInvestmentTemplateProps,
} from '../templates';
import {
  FinanceAnimationRenderer,
  percentagePointsToRatio,
} from './FinanceAnimationRenderer';

const makeScene = (
  template: FinanceAnimationTemplate,
  data: FinanceAnimationScene['data'],
): FinanceAnimationScene => ({
  mode: 'full-animation',
  template,
  message: 'Testszene',
  voiceText: 'Testszene',
  data,
});

describe('FinanceAnimationRenderer', () => {
  const cases: Array<[FinanceAnimationTemplate, FinanceAnimationScene['data']]> = [
    ['compound-growth', {startCapital: 1000, monthlyRate: 200, annualReturn: 7, years: 20}],
    ['money-flow', {amount: 300, fromLabel: 'Gehalt', toLabel: 'ETF'}],
    ['budget-split', {income: 2500, needsPercent: 50, wantsPercent: 30, savingsPercent: 20}],
    ['inflation-erosion', {startingValue: 100, inflationPercent: 2.5, years: 10}],
    ['portfolio-allocation', {total: 10000, allocations: [{label: 'ETF', value: 7000}, {label: 'Cash', value: 3000}]}],
    ['debt-paydown', {originalDebt: 12000, remainingDebt: 4200, paidInstallments: 26, totalInstallments: 40}],
    ['monthly-investment', {monthlyRate: 250, months: 12}],
    ['before-after-comparison', {beforeLabel: 'Vorher', afterLabel: 'Nachher', beforeValue: 12000, afterValue: 17800}],
    ['risk-return-scale', {riskPercent: 45, returnPercent: 65}],
    ['timeline-milestones', {milestones: [{label: 'Start', value: 0}, {label: 'Ziel', value: 10000}]}],
    ['income-expense-balance', {income: 2800, expenses: 2100}],
    ['tax-fee-flow', {grossAmount: 3000, taxes: 620, fees: 30}],
  ];

  it.each(cases)('maps %s to a renderable React element', (template, data) => {
    const element = FinanceAnimationRenderer({scene: makeScene(template, data)});
    expect(React.isValidElement(element)).toBe(true);
  });

  it('passes raw compound inputs instead of a precomputed endpoint', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('compound-growth', {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      }),
    });

    expect(React.isValidElement<CompoundGrowthTemplateProps>(element)).toBe(true);
    if (!React.isValidElement<CompoundGrowthTemplateProps>(element)) return;
    expect(element.type).toBe(CompoundGrowthTemplate);
    expect(element.props).toEqual({
      principal: 1000,
      monthlyContribution: 200,
      annualReturnPercent: 7,
      years: 20,
    });
    expect(element.props).not.toHaveProperty('finalValue');
  });

  it('passes the inflation rate so every elapsed-time state can be calculated', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('inflation-erosion', {
        startingValue: 100,
        inflationPercent: 2.5,
        years: 10,
      }),
    });

    expect(React.isValidElement<InflationErosionTemplateProps>(element)).toBe(true);
    if (!React.isValidElement<InflationErosionTemplateProps>(element)) return;
    expect(element.type).toBe(InflationErosionTemplate);
    expect(element.props).toEqual({
      startValue: 100,
      inflationPercent: 2.5,
      years: 10,
    });
    expect(element.props).not.toHaveProperty('endValue');
  });

  it('passes the annual return so every completed-month state can be calculated', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('monthly-investment', {
        monthlyRate: 250,
        months: 12,
        annualReturn: 7,
      }),
    });

    expect(React.isValidElement<MonthlyInvestmentTemplateProps>(element)).toBe(true);
    if (!React.isValidElement<MonthlyInvestmentTemplateProps>(element)) return;
    expect(element.type).toBe(MonthlyInvestmentTemplate);
    expect(element.props).toEqual({
      monthlyAmount: 250,
      months: 12,
      annualReturnPercent: 7,
    });
    expect(element.props).not.toHaveProperty('finalValue');
  });

  it('uses zero return when the optional monthly-investment rate is absent', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('monthly-investment', {
        monthlyRate: 250,
        months: 12,
      }),
    });

    expect(React.isValidElement<MonthlyInvestmentTemplateProps>(element)).toBe(true);
    if (!React.isValidElement<MonthlyInvestmentTemplateProps>(element)) return;
    expect(element.props.annualReturnPercent).toBe(0);
  });

  it('refuses to render incomplete template data', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('money-flow', {amount: 300}),
    });

    expect(element).toBeNull();
  });

  it('does not invent a portfolio total', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('portfolio-allocation', {
        allocations: [{label: 'ETF', percent: 100}],
      }),
    });

    expect(element).toBeNull();
  });

  it('does not invent debt installment progress', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('debt-paydown', {
        originalDebt: 12000,
        remainingDebt: 4200,
      }),
    });

    expect(element).toBeNull();
  });

  it('refuses to render semantically inconsistent template data', () => {
    const element = FinanceAnimationRenderer({
      scene: makeScene('budget-split', {
        income: 2500,
        needsPercent: 50,
        wantsPercent: 20,
        savingsPercent: 10,
      }),
    });

    expect(element).toBeNull();
  });
});

describe('percentagePointsToRatio', () => {
  it('converts percentage points without ambiguous threshold heuristics', () => {
    expect(percentagePointsToRatio(7)).toBeCloseTo(0.07, 8);
    expect(percentagePointsToRatio(1)).toBeCloseTo(0.01, 8);
    expect(percentagePointsToRatio(0.5)).toBeCloseTo(0.005, 8);
    expect(percentagePointsToRatio(-10)).toBeCloseTo(-0.1, 8);
  });
});
