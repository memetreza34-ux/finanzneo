import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_DOMAIN_LIMITS} from './domainLimits';

describe('FINANCE_ANIMATION_DOMAIN_LIMITS', () => {
  it('is immutable at runtime', () => {
    expect(Object.isFrozen(FINANCE_ANIMATION_DOMAIN_LIMITS)).toBe(true);
  });

  it('defines finite positive boundaries', () => {
    for (const value of Object.values(FINANCE_ANIMATION_DOMAIN_LIMITS)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
    }
  });

  it('keeps month and installment limits aligned with one hundred years', () => {
    expect(FINANCE_ANIMATION_DOMAIN_LIMITS.maxMonths).toBe(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxYears * 12,
    );
    expect(FINANCE_ANIMATION_DOMAIN_LIMITS.maxInstallments).toBe(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxMonths,
    );
  });

  it('uses the same absolute limit for money and numerical timeline values', () => {
    expect(FINANCE_ANIMATION_DOMAIN_LIMITS.maxTimelineAbsoluteValue).toBe(
      FINANCE_ANIMATION_DOMAIN_LIMITS.maxAbsoluteMoney,
    );
  });
});
