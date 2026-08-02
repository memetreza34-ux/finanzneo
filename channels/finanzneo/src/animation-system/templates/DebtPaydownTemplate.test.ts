import {describe, expect, it} from 'vitest';
import {resolveDebtPaydownFrame} from './DebtPaydownTemplate';

describe('resolveDebtPaydownFrame', () => {
  const input = {
    startingDebt: 12000,
    remainingDebt: 4200,
    paidInstallments: 26,
    totalInstallments: 40,
  };

  it('starts with the original debt and no paid installments', () => {
    expect(resolveDebtPaydownFrame({...input, progress: 0})).toEqual({
      currentDebt: 12000,
      debtRatio: 1,
      currentPaidInstallments: 0,
      installmentProgress: 0,
    });
  });

  it('animates debt and installments consistently', () => {
    const result = resolveDebtPaydownFrame({...input, progress: 0.5});

    expect(result.currentDebt).toBe(8100);
    expect(result.debtRatio).toBeCloseTo(0.675, 8);
    expect(result.currentPaidInstallments).toBe(13);
    expect(result.installmentProgress).toBeCloseTo(13 / 40, 8);
  });

  it('ends on the supplied debt and installment values', () => {
    const result = resolveDebtPaydownFrame({...input, progress: 1});

    expect(result.currentDebt).toBe(4200);
    expect(result.currentPaidInstallments).toBe(26);
  });

  it('sanitizes invalid numbers and clamps progress', () => {
    const result = resolveDebtPaydownFrame({
      startingDebt: Number.NaN,
      remainingDebt: -100,
      paidInstallments: 99,
      totalInstallments: 10,
      progress: 4,
    });

    expect(result.currentDebt).toBe(0);
    expect(result.debtRatio).toBe(0);
    expect(result.currentPaidInstallments).toBe(10);
    expect(result.installmentProgress).toBe(1);
  });
});
