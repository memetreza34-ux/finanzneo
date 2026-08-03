import {describe, expect, it} from 'vitest';
import * as packageRoot from './index';
import * as internalApi from './internal';
import * as publicApi from './public';

const forbiddenPublicRuntimeExports = [
  'FinanceAnimationRenderer',
  'FinanceAnimationGalleryRoot',
  'FinanceAnimationTestReelRoot',
  'AnimationGallery',
  'AnimationFrameMatrix',
  'AnimationTestReel',
  'selectAnimationTemplate',
  'rankAnimationTemplates',
  'planFinanceAnimationSceneFromDecision',
  'buildAnimationPlanFromResult',
  'classifyFinanceSceneWithFeatures',
  'validateTemplateData',
  'futureValueLumpSum',
  'futureValueMonthlyInvestment',
  'calculateCompoundInterest',
  'calculateMonthlyInvestment',
  'calculateLoanBalance',
] as const;

const requiredPublicRuntimeExports = [
  'FINANCE_ANIMATION_DOMAIN_LIMITS',
  'FINANCE_ANIMATION_INPUT_LIMITS',
  'FINANCE_ANIMATION_FEATURES',
  'validateFinanceAnimationFeatureFlags',
  'parseFinanceAnimationRequest',
  'parseFinanceAnimationScene',
  'planFinanceAnimationInput',
  'planFinanceAnimationInputForTemplate',
  'planFinanceAnimationInputWithFeatures',
  'planFinanceAnimationScene',
  'planFinanceAnimationSceneForTemplate',
  'planFinanceAnimationSceneWithFeatures',
  'buildAnimationPlan',
  'buildAnimationPlanForTemplate',
  'buildAnimationPlanWithFeatures',
  'SafeFinanceAnimationRenderer',
  'FINANCE_ANIMATION_ALLOWED_DATA',
  'FINANCE_ANIMATION_REQUIRED_DATA',
  'FINANCE_ANIMATION_TEMPLATES',
] as const;

describe('finance animation public API', () => {
  it('exports every safe integration entry point', () => {
    for (const exportName of requiredPublicRuntimeExports) {
      expect(publicApi).toHaveProperty(exportName);
    }
  });

  it('does not expose raw renderer, gallery, test, decision or calculation bypass APIs', () => {
    for (const exportName of forbiddenPublicRuntimeExports) {
      expect(publicApi).not.toHaveProperty(exportName);
    }
  });

  it('makes the package root identical to the safe public module', () => {
    expect(Object.keys(packageRoot).sort()).toEqual(Object.keys(publicApi).sort());
  });

  it('keeps development-only APIs available only through the internal module', () => {
    for (const exportName of forbiddenPublicRuntimeExports) {
      expect(internalApi).toHaveProperty(exportName);
    }
  });

  it('shares immutable input and domain limit objects with internal tools', () => {
    expect(publicApi.FINANCE_ANIMATION_INPUT_LIMITS).toBe(
      internalApi.FINANCE_ANIMATION_INPUT_LIMITS,
    );
    expect(publicApi.FINANCE_ANIMATION_DOMAIN_LIMITS).toBe(
      internalApi.FINANCE_ANIMATION_DOMAIN_LIMITS,
    );
    expect(Object.isFrozen(publicApi.FINANCE_ANIMATION_INPUT_LIMITS)).toBe(true);
    expect(Object.isFrozen(publicApi.FINANCE_ANIMATION_DOMAIN_LIMITS)).toBe(true);
  });
});
