export type FinanceAnimationFeatureFlags = {
  readonly enabled: boolean;
  readonly allowHybrid: boolean;
  readonly allowFullAnimation: boolean;
  readonly allowAutomaticRouting: boolean;
};

export const FINANCE_ANIMATION_FEATURES: FinanceAnimationFeatureFlags = {
  enabled: false,
  allowHybrid: false,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
};

export const isFinanceAnimationEnabled = (): boolean =>
  FINANCE_ANIMATION_FEATURES.enabled;
