import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_INPUT_LIMITS} from './inputLimits';
import {FINANCE_ANIMATION_INPUT_LIMITS as PARSER_INPUT_LIMITS} from './ingestion/parseFinanceAnimationInput';

describe('FINANCE_ANIMATION_INPUT_LIMITS', () => {
  it('is immutable at runtime', () => {
    expect(Object.isFrozen(FINANCE_ANIMATION_INPUT_LIMITS)).toBe(true);
  });

  it('defines finite positive technical boundaries', () => {
    for (const value of Object.values(FINANCE_ANIMATION_INPUT_LIMITS)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
    }
  });

  it('uses one shared object in parser and typed validators', () => {
    expect(PARSER_INPUT_LIMITS).toBe(FINANCE_ANIMATION_INPUT_LIMITS);
  });

  it('keeps structured list limits above visible template capacities', () => {
    expect(FINANCE_ANIMATION_INPUT_LIMITS.maxStructuredArrayItems).toBeGreaterThan(6);
    expect(FINANCE_ANIMATION_INPUT_LIMITS.maxLabels).toBeGreaterThan(5);
  });

  it('keeps individual labels shorter than general narrative text', () => {
    expect(FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength).toBeLessThan(
      FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength,
    );
  });
});
