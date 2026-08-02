import type {FinanceAnimationRequest} from '../contracts';
import {planFinanceAnimationScene} from './planFinanceAnimationScene';
import type {FinanceAnimationPlan} from './animationPlanTypes';

export const buildAnimationPlan = (
  request: FinanceAnimationRequest,
): FinanceAnimationPlan => {
  const result = planFinanceAnimationScene(request);

  if (result.decision.mode === 'image') {
    return {
      status: 'image-fallback',
      mode: 'image',
      decision: result.decision,
      warnings: result.issues
        .filter((issue) => issue.level === 'warning')
        .map((issue) => issue.message),
      errors: result.issues
        .filter((issue) => issue.level === 'error')
        .map((issue) => issue.message),
    };
  }

  if (!result.scene) {
    return {
      status: 'blocked',
      mode: result.decision.mode,
      decision: result.decision,
      template: result.decision.template,
      warnings: result.issues
        .filter((issue) => issue.level === 'warning')
        .map((issue) => issue.message),
      errors: result.issues
        .filter((issue) => issue.level === 'error')
        .map((issue) => issue.message),
    };
  }

  return {
    status: 'animation-ready',
    mode: result.decision.mode,
    decision: result.decision,
    scene: result.scene,
    template: result.scene.template,
    warnings: result.issues
      .filter((issue) => issue.level === 'warning')
      .map((issue) => issue.message),
    errors: [],
  };
};
