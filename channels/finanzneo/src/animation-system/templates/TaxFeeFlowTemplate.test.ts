import {describe, expect, it} from 'vitest';
import {resolveTaxFeeFlow} from './TaxFeeFlowTemplate';

describe('resolveTaxFeeFlow', () => {
  it('calculates a complete deduction breakdown', () => {
    expect(resolveTaxFeeFlow(3000, 620, 30)).toEqual({
      gross: 3000,
      taxes: 620,
      fees: 30,
      net: 2350,
      taxPercent: 620 / 3000 * 100,
      feePercent: 1,
      netPercent: 2350 / 3000 * 100,
    });
  });

  it('keeps all displayed percentages aligned with the gross amount', () => {
    const result = resolveTaxFeeFlow(1000, 200, 50);

    expect(result.taxPercent + result.feePercent + result.netPercent).toBeCloseTo(100, 8);
  });

  it('prevents a negative net value for invalid direct template input', () => {
    const result = resolveTaxFeeFlow(1000, 800, 400);

    expect(result.net).toBe(0);
    expect(result.netPercent).toBe(0);
  });

  it('sanitizes non-finite and negative amounts', () => {
    expect(resolveTaxFeeFlow(Number.NaN, -50, Number.POSITIVE_INFINITY)).toEqual({
      gross: 0,
      taxes: 0,
      fees: 0,
      net: 0,
      taxPercent: 0,
      feePercent: 0,
      netPercent: 0,
    });
  });
});
