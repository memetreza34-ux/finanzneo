import {describe, expect, it} from 'vitest';
import {normalizeMoneyFlowItems} from './MoneyFlowTemplate';

describe('normalizeMoneyFlowItems', () => {
  it('normalizes visible shares to one hundred percent', () => {
    const result = normalizeMoneyFlowItems([
      {label: 'Fixkosten', value: '1.500 €', share: 50},
      {label: 'Freizeit', value: '900 €', share: 30},
      {label: 'ETF', value: '600 €', share: 20},
    ]);

    expect(result.map((item) => item.normalizedShare)).toEqual([0.5, 0.3, 0.2]);
    expect(result.reduce((sum, item) => sum + item.normalizedShare, 0)).toBeCloseTo(1, 8);
  });

  it('uses equal shares when all inputs are invalid or zero', () => {
    const result = normalizeMoneyFlowItems([
      {label: 'A', value: '0 €', share: Number.NaN},
      {label: 'B', value: '0 €', share: -10},
    ]);

    expect(result.map((item) => item.normalizedShare)).toEqual([0.5, 0.5]);
  });

  it('limits the visual to four destinations', () => {
    const result = normalizeMoneyFlowItems([
      {label: '1', value: '1 €', share: 1},
      {label: '2', value: '1 €', share: 1},
      {label: '3', value: '1 €', share: 1},
      {label: '4', value: '1 €', share: 1},
      {label: '5', value: '1 €', share: 1},
    ]);

    expect(result).toHaveLength(4);
  });
});
