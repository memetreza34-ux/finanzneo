import {describe, expect, it} from 'vitest';
import {clampUnitInterval} from './RiskReturnScaleTemplate';

describe('clampUnitInterval', () => {
  it('keeps valid ratios unchanged', () => {
    expect(clampUnitInterval(0)).toBe(0);
    expect(clampUnitInterval(0.45)).toBe(0.45);
    expect(clampUnitInterval(1)).toBe(1);
  });

  it('clamps ratios outside the visual scale', () => {
    expect(clampUnitInterval(-0.5)).toBe(0);
    expect(clampUnitInterval(2)).toBe(1);
  });

  it('turns non-finite input into a safe empty scale', () => {
    expect(clampUnitInterval(Number.NaN)).toBe(0);
    expect(clampUnitInterval(Number.POSITIVE_INFINITY)).toBe(0);
  });
});
