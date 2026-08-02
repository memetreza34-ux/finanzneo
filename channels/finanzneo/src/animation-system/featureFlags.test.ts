import {describe, expect, it} from 'vitest';
import {
  FINANCE_ANIMATION_FEATURES,
  isFinanceAnimationEnabled,
} from './featureFlags';

describe('finance animation feature flags', () => {
  it('keeps every production-facing animation capability disabled', () => {
    expect(FINANCE_ANIMATION_FEATURES).toEqual({
      enabled: false,
      allowHybrid: false,
      allowFullAnimation: false,
      allowAutomaticRouting: false,
    });
  });

  it('reports the animation system as disabled', () => {
    expect(isFinanceAnimationEnabled()).toBe(false);
  });
});
