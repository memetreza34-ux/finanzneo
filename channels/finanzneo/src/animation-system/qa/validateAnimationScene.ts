import type {FinanceAnimationRequest, FinanceAnimationScene} from '../contracts';

export type AnimationValidationIssue = {
  level: 'error' | 'warning';
  code: string;
  message: string;
};

export type FinanceImageSceneValidationInput = FinanceAnimationRequest & {
  mode: 'image';
};

export type FinanceAnimationValidationInput =
  | FinanceAnimationRequest
  | FinanceAnimationScene
  | FinanceImageSceneValidationInput;

const normalizedLabels = (labels: readonly string[] | undefined): string[] =>
  (labels ?? []).map((label) => label.trim());

export const validateAnimationRequest = (
  scene: FinanceAnimationValidationInput,
): AnimationValidationIssue[] => {
  if ('mode' in scene && scene.mode === 'image') {
    return [];
  }

  const issues: AnimationValidationIssue[] = [];
  const labels = normalizedLabels(scene.labels);
  const nonEmptyLabels = labels.filter((label) => label.length > 0);

  if (!scene.message?.trim()) {
    issues.push({level: 'error', code: 'missing-message', message: 'Animationsszene benötigt eine klare Kernaussage.'});
  }
  if (!scene.voiceText?.trim()) {
    issues.push({level: 'error', code: 'missing-voice-text', message: 'Animationsszene benötigt den zugehörigen Voiceover-Satz.'});
  }
  if (!scene.data || Object.keys(scene.data).length === 0) {
    issues.push({level: 'warning', code: 'missing-data', message: 'Animationsszene enthält keine strukturierten Finanzdaten.'});
  }
  if (labels.length > 5) {
    issues.push({level: 'warning', code: 'too-many-labels', message: 'Mehr als fünf Labels können die Szene überladen.'});
  }
  if (labels.some((label) => label.length === 0)) {
    issues.push({level: 'warning', code: 'empty-label', message: 'Leere Labels werden in der Animation nicht angezeigt.'});
  }
  if (new Set(nonEmptyLabels.map((label) => label.toLocaleLowerCase('de-DE'))).size !== nonEmptyLabels.length) {
    issues.push({level: 'warning', code: 'duplicate-labels', message: 'Doppelte Labels können die visuelle Zuordnung erschweren.'});
  }
  if ('mode' in scene && scene.mode !== 'image' && !scene.template) {
    issues.push({level: 'error', code: 'missing-template', message: 'Eine Hybrid- oder Vollanimationsszene benötigt ein Template.'});
  }

  return issues;
};

export const validateAnimationScene = validateAnimationRequest;
