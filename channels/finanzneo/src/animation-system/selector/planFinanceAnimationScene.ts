import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationScene,
} from '../contracts';
import {classifyFinanceScene} from '../router/classifyFinanceScene';
import {validateAnimationScene} from '../qa/validateAnimationScene';
import {createImageFallback} from '../fallback/createImageFallback';

export type FinanceAnimationPlanResult = {
  decision: FinanceAnimationDecision;
  scene?: FinanceAnimationScene;
  issues: ReturnType<typeof validateAnimationScene>;
};

export const planFinanceAnimationScene = (
  request: FinanceAnimationRequest,
): FinanceAnimationPlanResult => {
  const decision = classifyFinanceScene(request);

  if (decision.mode === 'image' || !decision.template) {
    return {
      decision,
      issues: [],
    };
  }

  const scene: FinanceAnimationScene = {
    ...request,
    mode: decision.mode,
    template: decision.template,
  };

  const issues = validateAnimationScene(scene);
  const errors = issues.filter((issue) => issue.level === 'error');

  if (errors.length > 0) {
    return {
      decision: createImageFallback(
        request,
        errors.map((issue) => issue.code),
      ),
      issues,
    };
  }

  return {
    decision,
    scene,
    issues,
  };
};
