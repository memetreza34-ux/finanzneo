import type {FinanceAnimationRequest} from '../contracts';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import type {AnimationValidationIssue} from '../qa/validateAnimationScene';
import {
  planFinanceAnimationScene,
  planFinanceAnimationSceneWithFeatures,
  type FinanceAnimationPlanResult,
} from '../selector/planFinanceAnimationScene';
import type {FinanceAnimationPlan} from './animationPlanTypes';

const messagesForLevel = (
  issues: AnimationValidationIssue[],
  level: AnimationValidationIssue['level'],
): string[] => issues
  .filter((issue) => issue.level === level)
  .map((issue) => issue.message);

export const buildAnimationPlanFromResult = (
  result: FinanceAnimationPlanResult,
): FinanceAnimationPlan => {
  const warnings = messagesForLevel(result.issues, 'warning');
  const errors = messagesForLevel(result.issues, 'error');

  if (result.decision.mode === 'image') {
    return {
      status: 'image-fallback',
      mode: 'image',
      decision: result.decision,
      warnings,
      errors,
    };
  }

  if (!result.scene) {
    return {
      status: 'blocked',
      mode: result.decision.mode,
      decision: result.decision,
      template: result.decision.template,
      warnings,
      errors,
    };
  }

  return {
    status: 'animation-ready',
    mode: result.decision.mode,
    decision: result.decision,
    scene: result.scene,
    template: result.scene.template,
    warnings,
    errors,
  };
};

/**
 * Vollständige Plan-Simulation mit expliziten Testflags. Diese Funktion
 * verändert die global deaktivierten Produktionsflags nicht und eignet sich
 * ausschließlich für Aktivierungs-, QA- und Integrationsprüfungen.
 */
export const buildAnimationPlanWithFeatures = (
  request: FinanceAnimationRequest,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationPlan => buildAnimationPlanFromResult(
  planFinanceAnimationSceneWithFeatures(request, features),
);

export const buildAnimationPlan = (
  request: FinanceAnimationRequest,
): FinanceAnimationPlan => buildAnimationPlanFromResult(
  planFinanceAnimationScene(request),
);
