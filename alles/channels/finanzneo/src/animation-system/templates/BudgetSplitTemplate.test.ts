import {describe, expect, it} from 'vitest';
import {resolveBudgetBarWidth} from './BudgetSplitTemplate';

describe('resolveBudgetBarWidth', () => {
  it('starts at zero without an artificial minimum-width flash', () => {
    expect(resolveBudgetBarWidth(500, 1000, 0)).toBe(0);
  });

  it('resolves the proportional animated width', () => {
    expect(resolveBudgetBarWidth(500, 1000, 0.5)).toBe(25);
    expect(resolveBudgetBarWidth(500, 1000, 1)).toBe(50);
  });

  it('sanitizes invalid values and clamps progress', () => {
    expect(resolveBudgetBarWidth(Number.NaN, 1000, 1)).toBe(0);
    expect(resolveBudgetBarWidth(500, 0, 1)).toBe(0);
    expect(resolveBudgetBarWidth(500, 1000, 4)).toBe(50);
  });
});
