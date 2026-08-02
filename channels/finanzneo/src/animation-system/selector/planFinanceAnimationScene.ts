import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationScene,
} from '../contracts';
import {createImageFallback} from '../fallback/createImageFallback';
import {
  type AnimationValidationIssue,
  validateAnimationScene,
} from '../qa/validateAnimationScene';
import {validateTemplateData} from '../render/validateTemplateData';
import {classifyFinanceScene} from '../router/classifyFinanceScene';

export type FinanceAnimationPlanResult = {
  decision: FinanceAnimationDecision;
  scene?: FinanceAnimationScene;
  issues: AnimationValidationIssue[];
};

const mergeUniqueIssues = (
  ...issueGroups: AnimationValidationIssue[][]
): AnimationValidationIssue[] => {
  const seen = new Set<string>();
  return issueGroups.flat().filter((issue) => {
    const key = `${issue.level}:${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const fallbackReasonsFromIssues = (
  issues: readonly AnimationValidationIssue[],
): string[] => issues
  .filter((issue) => issue.level === 'error')
  .map((issue) => issue.message);

export const planFinanceAnimationSceneFromDecision = (
  request: FinanceAnimationRequest,
  decision: FinanceAnimationDecision,
): FinanceAnimationPlanResult => {
  if (decision.mode === 'image') {
    return {
      decision,
      issues: [],
    };
  }

  if (!decision.template) {
    const issues: AnimationValidationIssue[] = [{
      level: 'error',
      code: 'missing-template',
      message: 'Eine Animationsentscheidung benötigt ein Template.',
    }];
    return {
      decision: createImageFallback(request, fallbackReasonsFromIssues(issues)),
      issues,
    };
  }

  const scene: FinanceAnimationScene = {
    ...request,
    mode: decision.mode,
    template: decision.template,
  };

  const sceneIssues = validateAnimationScene(scene);
  const templateValidation = validateTemplateData(scene);
  const templateIssues: AnimationValidationIssue[] = [
    ...templateValidation.errors.map((message, index) => ({
      level: 'error' as const,
      code: `template-data-error-${index + 1}`,
      message,
    })),
    ...templateValidation.warnings.map((message, index) => ({
      level: 'warning' as const,
      code: `template-data-warning-${index + 1}`,
      message,
    })),
  ];
  const issues = mergeUniqueIssues(sceneIssues, templateIssues);
  const errors = issues.filter((issue) => issue.level === 'error');

  if (errors.length > 0) {
    return {
      decision: createImageFallback(
        request,
        fallbackReasonsFromIssues(errors),
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

export const planFinanceAnimationScene = (
  request: FinanceAnimationRequest,
): FinanceAnimationPlanResult => planFinanceAnimationSceneFromDecision(
  request,
  classifyFinanceScene(request),
);
