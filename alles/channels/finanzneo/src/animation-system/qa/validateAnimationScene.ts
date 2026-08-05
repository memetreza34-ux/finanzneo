import type {FinanceAnimationRequest, FinanceAnimationScene} from '../contracts';
import {FINANCE_ANIMATION_INPUT_LIMITS} from '../inputLimits';

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
  } else if (scene.message.length > FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength) {
    issues.push({
      level: 'error',
      code: 'message-too-long',
      message: `Kernaussage überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength} Zeichen.`,
    });
  }
  if (!hasVisibleText(scene.voiceText)) {
    issues.push({level: 'error', code: 'missing-voice-text', message: 'Animationsszene benötigt den zugehörigen Voiceover-Satz.'});
  } else if (scene.voiceText.length > FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength) {
    issues.push({
      level: 'error',
      code: 'voice-text-too-long',
      message: `Voiceover überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength} Zeichen.`,
    });
  }
  if (scene.data !== undefined && !isStructuredData(scene.data)) {
    issues.push({level: 'error', code: 'invalid-data', message: 'Animationsdaten müssen als strukturiertes Objekt vorliegen.'});
  } else if (!scene.data || Object.keys(scene.data).length === 0) {
    issues.push({level: 'warning', code: 'missing-data', message: 'Animationsszene enthält keine strukturierten Finanzdaten.'});
  } else if (Object.keys(scene.data).length > FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields) {
    issues.push({
      level: 'error',
      code: 'too-many-data-fields',
      message: `Animationsdaten enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields} Felder.`,
    });
  }
  if (normalized.invalidCount > 0) {
    issues.push({level: 'warning', code: 'invalid-labels', message: 'Nicht-textuelle Labels werden in der Animation nicht angezeigt.'});
  }
  if (labels.length > FINANCE_ANIMATION_INPUT_LIMITS.maxLabels) {
    issues.push({
      level: 'error',
      code: 'too-many-input-labels',
      message: `Labels enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabels} Einträge.`,
    });
  } else if (labels.length > 5) {
    issues.push({level: 'warning', code: 'too-many-labels', message: 'Mehr als fünf Labels können die Szene überladen.'});
  }
  if (labels.some((label) => label.length > FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength)) {
    issues.push({
      level: 'error',
      code: 'input-label-too-long',
      message: `Ein Label überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength} Zeichen.`,
    });
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
