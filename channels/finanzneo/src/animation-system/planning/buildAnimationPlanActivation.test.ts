import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {
  buildAnimationPlan,
  buildAnimationPlanWithFeatures,
} from './buildAnimationPlan';

const hybridFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: true,
};

const fullAnimationFeatures: FinanceAnimationFeatureFlags = {
  ...hybridFeatures,
  allowFullAnimation: true,
};

describe('complete animation plan activation simulation', () => {
  it('builds animation-ready hybrid plans for every canonical fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlanWithFeatures(
        fixture.scene,
        hybridFeatures,
      );

      expect(plan.status).toBe('animation-ready');
      expect(plan.mode).toBe('hybrid');
      expect(plan.template).toBe(fixture.scene.template);
      expect(plan.scene?.template).toBe(fixture.scene.template);
      expect(plan.errors).toEqual([]);
    }
  });

  it('builds animation-ready full-animation plans for every fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlanWithFeatures(
        fixture.scene,
        fullAnimationFeatures,
      );

      expect(plan.status).toBe('animation-ready');
      expect(plan.mode).toBe('full-animation');
      expect(plan.template).toBe(fixture.scene.template);
      expect(plan.scene?.template).toBe(fixture.scene.template);
      expect(plan.errors).toEqual([]);
    }
  });

  it('keeps the global production path in image fallback for every fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlan(fixture.scene);

      expect(plan.status).toBe('image-fallback');
      expect(plan.mode).toBe('image');
      expect(plan.scene).toBeUndefined();
    }
  });

  it('keeps explicit feature simulation in image fallback without routing release', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlanWithFeatures(fixture.scene, {
        ...fullAnimationFeatures,
        allowAutomaticRouting: false,
      });

      expect(plan.status).toBe('image-fallback');
      expect(plan.mode).toBe('image');
      expect(plan.scene).toBeUndefined();
    }
  });
});
