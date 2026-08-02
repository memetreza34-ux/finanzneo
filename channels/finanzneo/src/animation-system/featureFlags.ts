export const FINANCE_ANIMATION_FEATURES = {
  enabled: false,
  allowHybrid: false,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
} as const;

export const isFinanceAnimationEnabled = (): boolean =>
  FINANCE_ANIMATION_FEATURES.enabled === true;
