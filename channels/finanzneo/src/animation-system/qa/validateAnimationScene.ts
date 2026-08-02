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

const hasVisibleText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeLabels = (labels: unknown): {
  labels: string[];
  invalidCount: number;
} => {
  if (!Array.isArray(labels)) return {labels: [], invalidCount: labels === undefined ? 0 : 1};

  let invalidCount = 0;
  const normalized = labels.map((label) => {
    if (typeof label !== 'string') {
      invalidCount += 1;
      return '';
    }
    return label.trim();
  });

  return {labels: normalized, invalidCount};
};

const isStructuredData = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateAnimationRequest = (
  scene: FinanceAnimationValidationInput,
): AnimationValidationIssue[] => {
  if ('mode' in scene && scene.mode === 'image') {
    return [];
  }

  const issues: AnimationValidationIssue[] = [];
  const normalized = normalizeLabels(scene.labels);
  const labels = normalized.labels;
  const nonEmptyLabels = labels.filter((label) => label.length > 0);

  if (!hasVisibleText(scene.message)) {
    issues.push({level: 'error', code: 'missing-message', message: 'Animationsszene benötigt eine klare Kernaussage.'});
  }
  if (!hasVisibleText(scene.voiceText)) {
    issues.push({level: 'error', code: 'missing-voice-text', message: 'Animationsszene benötigt den zugehörigen Voiceover-Satz.'});
  }
  if (scene.data !== undefined && !isStructuredData(scene.data)) {
    issues.push({level: 'error', code: 'invalid-data', message: 'Animationsdaten müssen als strukturiertes Objekt vorliegen.'});
  } else if (!scene.data || Object.keys(scene.data).length === 0) {
    issues.push({level: 'warning', code: 'missing-data', message: 'Animationsszene enthält keine strukturierten Finanzdaten.'});
  }
  if (normalized.invalidCount > 0) {
    issues.push({level: 'warning', code: 'invalid-labels', message: 'Nicht-textuelle Labels werden in der Animation nicht angezeigt.'});
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
  if ('mode' in scene && !scene.template) {
    issues.push({level: 'error', code: 'missing-template', message: 'Eine Hybrid- oder Vollanimationsszene benötigt ein Template.'});
  }

  return issues;
};

export const validateAnimationScene = validateAnimationRequest;
