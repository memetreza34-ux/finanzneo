import React from 'react';
import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {
  PortfolioAllocationTemplate,
  type PortfolioAllocationTemplateProps,
} from '../templates';
import {FinanceAnimationRenderer} from './FinanceAnimationRenderer';

const renderPortfolio = (
  allocations: unknown[],
  total = 10000,
): React.ReactElement<PortfolioAllocationTemplateProps> | null => {
  const scene: FinanceAnimationScene = {
    mode: 'full-animation',
    template: 'portfolio-allocation',
    message: 'Portfolio-Aufteilung',
    voiceText: 'Das Portfolio wird aufgeteilt.',
    data: {total, allocations},
  };
  const element = FinanceAnimationRenderer({scene});
  return React.isValidElement<PortfolioAllocationTemplateProps>(element)
    ? element
    : null;
};

describe('FinanceAnimationRenderer portfolio mapping', () => {
  it('passes percentage allocations as neutral weights', () => {
    const element = renderPortfolio([
      {label: 'ETF', percent: 70},
      {label: 'Cash', percent: 30},
    ]);

    expect(element?.type).toBe(PortfolioAllocationTemplate);
    expect(element?.props.allocations).toEqual([
      {label: 'ETF', weight: 70},
      {label: 'Cash', weight: 30},
    ]);
  });

  it('passes absolute allocations as neutral weights without renaming them percent', () => {
    const element = renderPortfolio([
      {label: 'ETF', value: 7000},
      {label: 'Cash', value: 3000},
    ]);

    expect(element?.type).toBe(PortfolioAllocationTemplate);
    expect(element?.props.allocations).toEqual([
      {label: 'ETF', weight: 7000},
      {label: 'Cash', weight: 3000},
    ]);
    expect(element?.props.allocations[0]).not.toHaveProperty('percent');
  });

  it('does not render mixed portfolio modes', () => {
    const element = renderPortfolio([
      {label: 'ETF', percent: 70},
      {label: 'Cash', value: 3000},
    ]);

    expect(element).toBeNull();
  });
});
