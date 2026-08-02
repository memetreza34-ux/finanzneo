import type {FinanceAnimationRequest, FinanceAnimationScene} from '../contracts';

export type AnimationValidationIssue = {
  level: 'error' | 'warning';
  code: string;
  message: string;
};

type FinanceAnimationValidationInput =
  | FinanceAnimationRequest
  | FinanceAnimationScene
  | (FinanceAnimationRequest & {mode: 'image'});

export const validateAnimationRequest = (
  scene: FinanceAnimationValidationInput,
): AnimationValidationIssue[] => {
  if ('mode' in scene && scene.mode === 'image') {
    return [];
  }

  const issues: AnimationValidationIssue[] = [];

  if (!scene.message?.trim()) {
    issues.push({level: 'error', code: 'missing-message', message: 'Animationsszene benötigt eine klare Kernaussage.'});
  }
  if (!scene.voiceText?.trim()) {
    issues.push({level: 'error', code: 'missing-voice-text', message: 'Animationsszene benötigt den zugehörigen Voiceover-Satz.'});
  }
  if (!scene.data || Object.keys(scene.data).length === 0) {
    issues.push({level: 'warning', code: 'missing-data', message: 'Animationsszene enthält keine strukturierten Finanzdaten.'});
  }
  if ((scene.labels?.length ?? 0) > 5) {
    issues.push({level: 'warning', code: 'too-many-labels', message: 'Mehr als fünf Labels können die Szene überladen.'});
  }
  if ('mode' in scene && scene.mode !== 'image' && !scene.template) {
    issues.push({level: 'error', code: 'missing-template', message: 'Eine Hybrid- oder Vollanimationsszene benötigt ein Template.'});
  }

  return issues;
};

export const validateAnimationScene = validateAnimationRequest;
