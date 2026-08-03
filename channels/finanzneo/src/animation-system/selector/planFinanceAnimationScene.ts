import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import {createImageFallback} from '../fallback/createImageFallback';
import {
  type FinanceAnimationFeatureFlags,
  validateFinanceAnimationFeatureFlags,
} from '../featureFlags';
import {
  type AnimationValidationIssue,
  validateAnimationScene,
} from '../qa/validateAnimationScene';
import {validateTemplateData} from '../render/validateTemplateData';
import {
  classifyFinanceScene,
  classifyFinanceSceneWithFeatures,
  resolveFinanceAnimationMode,
} from '../router/classifyFinanceScene';

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

/**
 * Manuell ausgewähltes Template für die erste Aktivierungsstufe.
 *
 * Dieser Pfad benötigt absichtlich kein automatisches Routing. Dadurch kann
 * zunächst ausschließlich `allowHybrid` freigegeben und ein explizit
 * ausgewähltes Template getestet werden. Ungültige Feature-Kombinationen,
 * fehlende Modusfreigaben und fehlerhafte Daten bleiben im Bildmodus.
 */
export const planFinanceAnimationSceneForTemplate = (
  request: FinanceAnimationRequest,
  template: FinanceAnimationTemplate,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationPlanResult => {
  const featureErrors = validateFinanceAnimationFeatureFlags(features);
  if (featureErrors.length > 0) {
    return planFinanceAnimationSceneFromDecision(request, {
      mode: 'image',
      confidence: 1,
      reason: 'Manuelle Animationsauswahl durch ungültige Feature-Konfiguration blockiert.',
      blockedReasons: featureErrors,
    });
  }

  if (!features.enabled) {
    return planFinanceAnimationSceneFromDecision(request, {
      mode: 'image',
      confidence: 1,
      reason: 'Animationssystem ist vorbereitet, aber noch deaktiviert.',
    });
  }

  const mode = resolveFinanceAnimationMode(features);
  if (mode === 'image') {
    return planFinanceAnimationSceneFromDecision(request, {
      mode: 'image',
      confidence: 1,
      reason: 'Für die manuelle Auswahl ist noch kein Animationsmodus freigegeben.',
    });
  }

  return planFinanceAnimationSceneFromDecision(request, {
    mode,
    template,
    confidence: 1,
    reason: `Template ${template} wurde für den kontrollierten ${mode}-Test manuell ausgewählt.`,
  });
};

/**
 * Vollständige Simulation der späteren automatischen Aktivierung mit
 * expliziten Flags. Die global deaktivierten Produktionsflags werden dabei
 * nicht verändert.
 */
export const planFinanceAnimationSceneWithFeatures = (
  request: FinanceAnimationRequest,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationPlanResult => planFinanceAnimationSceneFromDecision(
  request,
  classifyFinanceSceneWithFeatures(request, features),
);

export const planFinanceAnimationScene = (
  request: FinanceAnimationRequest,
): FinanceAnimationPlanResult => planFinanceAnimationSceneFromDecision(
  request,
  classifyFinanceScene(request),
);
