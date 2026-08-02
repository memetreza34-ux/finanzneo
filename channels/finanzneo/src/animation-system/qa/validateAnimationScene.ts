import type {AnimationSceneConfig} from '../contracts/types';

export type AnimationValidationIssue = {
  level: 'error' | 'warning';
  code: string;
  message: string;
};

export const validateAnimationScene = (scene: AnimationSceneConfig): AnimationValidationIssue[] => {
  const issues: AnimationValidationIssue[] = [];

  if (scene.mode === 'image') return issues;
  if (!scene.template) {
    issues.push({level: 'error', code: 'missing-template', message: 'Animationsszene benötigt ein Template.'});
  }
  if (!scene.message?.trim()) {
    issues.push({level: 'error', code: 'missing-message', message: 'Animationsszene benötigt eine klare Kernaussage.'});
  }
  if (!scene.data || Object.keys(scene.data).length === 0) {
    issues.push({level: 'warning', code: 'missing-data', message: 'Animationsszene enthält keine strukturierten Finanzdaten.'});
  }
  if ((scene.labels?.length ?? 0) > 5) {
    issues.push({level: 'warning', code: 'too-many-labels', message: 'Mehr als fünf Labels können die Szene überladen.'});
  }

  return issues;
};
