import {describe, expect, it} from 'vitest';
import {resolveIncomeExpenseBalance} from './IncomeExpenseBalanceTemplate';

describe('resolveIncomeExpenseBalance', () => {
  it('marks a positive balance as a surplus', () => {
    expect(resolveIncomeExpenseBalance(2800, 2100)).toEqual({
      income: 2800,
      expenses: 2100,
      balance: 700,
      status: 'surplus',
      accent: '#5CFF9A',
      scale: 2800,
    });
  });

  it('marks a negative balance as a deficit', () => {
    expect(resolveIncomeExpenseBalance(2100, 2800)).toEqual({
      income: 2100,
      expenses: 2800,
      balance: -700,
      status: 'deficit',
      accent: '#FF7C83',
      scale: 2800,
    });
  });

  it('uses neutral styling for a balanced result', () => {
    expect(resolveIncomeExpenseBalance(2000, 2000)).toEqual({
      income: 2000,
      expenses: 2000,
      balance: 0,
      status: 'balanced',
      accent: '#AFC0B4',
      scale: 2000,
    });
  });

  it('sanitizes invalid and negative amounts', () => {
    expect(resolveIncomeExpenseBalance(Number.NaN, -100)).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
      status: 'balanced',
      accent: '#AFC0B4',
      scale: 1,
    });
  });
});
