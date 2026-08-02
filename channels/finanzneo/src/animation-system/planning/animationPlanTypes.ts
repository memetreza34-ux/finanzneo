import type {
  FinanceAnimationDecision,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
  FinanceSceneMode,
} from '../contracts';

export type FinanceAnimationPlanStatus =
  | 'image-fallback'
  | 'animation-ready'
  | 'blocked';

export type FinanceAnimationPlan = {
  status: FinanceAnimationPlanStatus;
  mode: FinanceSceneMode;
  decision: FinanceAnimationDecision;
  scene?: FinanceAnimationScene;
  template?: FinanceAnimationTemplate;
  warnings: string[];
  errors: string[];
};
