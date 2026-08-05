import {describe, expect, it} from 'vitest';
import {
  FINANCE_ANIMATION_FEATURES,
  isFinanceAnimationEnabled,
  validateFinanceAnimationFeatureFlags,
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

  it('freezes the production safety configuration at runtime', () => {
    expect(Object.isFrozen(FINANCE_ANIMATION_FEATURES)).toBe(true);
  });

  it('reports the animation system as disabled', () => {
    expect(isFinanceAnimationEnabled()).toBe(false);
  });

  it('accepts the fully disabled production configuration', () => {
    expect(validateFinanceAnimationFeatureFlags(FINANCE_ANIMATION_FEATURES)).toEqual([]);
  });

  it('accepts staged hybrid activation before full animation', () => {
    expect(validateFinanceAnimationFeatureFlags({
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: false,
    })).toEqual([]);
  });

  it('accepts automatic hybrid routing only after hybrid release', () => {
    expect(validateFinanceAnimationFeatureFlags({
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: true,
    })).toEqual([]);
  });

  it('rejects active modes while the master switch is disabled', () => {
    const errors = validateFinanceAnimationFeatureFlags({
      enabled: false,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: false,
    });

    expect(errors).toContain(
      'Animationsmodi und automatisches Routing müssen deaktiviert bleiben, solange enabled false ist.',
    );
  });

  it('rejects full animation before hybrid mode', () => {
    const errors = validateFinanceAnimationFeatureFlags({
      enabled: true,
      allowHybrid: false,
      allowFullAnimation: true,
      allowAutomaticRouting: false,
    });

    expect(errors).toContain(
      'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    );
  });

  it('rejects automatic routing without an animation mode', () => {
    const errors = validateFinanceAnimationFeatureFlags({
      enabled: true,
      allowHybrid: false,
      allowFullAnimation: false,
      allowAutomaticRouting: true,
    });

    expect(errors).toContain(
      'Automatisches Routing benötigt mindestens einen freigegebenen Animationsmodus.',
    );
  });
});
