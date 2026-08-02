import React from 'react';
import {describe, expect, it} from 'vitest';
import {FinanceAnimationRenderer} from './FinanceAnimationRenderer';
import type {FinanceAnimationScene, FinanceAnimationTemplate} from '../contracts';

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
    ['portfolio-allocation', {allocations: [] as never}],
    ['debt-paydown', {originalDebt: 12000, remainingDebt: 4200}],
    ['monthly-investment', {monthlyRate: 250, months: 12}],
    ['before-after-comparison', {beforeLabel: 'Vorher', afterLabel: 'Nachher', beforeValue: 12000, afterValue: 17800}],
    ['risk-return-scale', {riskPercent: 45, returnPercent: 65}],
    ['timeline-milestones', {milestones: [] as never}],
    ['income-expense-balance', {income: 2800, expenses: 2100}],
    ['tax-fee-flow', {grossAmount: 3000, taxes: 620, fees: 30}],
  ];

  it.each(cases)('maps %s to a renderable React element', (template, data) => {
    const element = FinanceAnimationRenderer({scene: makeScene(template, data)});
    expect(React.isValidElement(element)).toBe(true);
  });
});
