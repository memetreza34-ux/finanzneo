import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {planFinanceAnimationSceneWithFeatures} from './planFinanceAnimationScene';

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

describe('animation activation simulation', () => {
  it('routes every canonical fixture through the complete hybrid planner path', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = planFinanceAnimationSceneWithFeatures(
        fixture.scene,
        hybridFeatures,
      );

      expect(result.decision.mode).toBe('hybrid');
      expect(result.decision.template).toBe(fixture.scene.template);
      expect(result.scene?.mode).toBe('hybrid');
      expect(result.scene?.template).toBe(fixture.scene.template);
      expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
    }
  });

  it('routes every canonical fixture through the complete full-animation path', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = planFinanceAnimationSceneWithFeatures(
        fixture.scene,
        fullAnimationFeatures,
      );

      expect(result.decision.mode).toBe('full-animation');
      expect(result.decision.template).toBe(fixture.scene.template);
      expect(result.scene?.mode).toBe('full-animation');
      expect(result.scene?.template).toBe(fixture.scene.template);
      expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
    }
  });

  it('keeps every fixture in image mode when automatic routing is not released', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = planFinanceAnimationSceneWithFeatures(fixture.scene, {
        ...hybridFeatures,
        allowAutomaticRouting: false,
      });

      expect(result.decision.mode).toBe('image');
      expect(result.scene).toBeUndefined();
    }
  });
});
