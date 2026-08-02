export type FinanceAnimationFeatureFlags = {
  readonly enabled: boolean;
  readonly allowHybrid: boolean;
  readonly allowFullAnimation: boolean;
  readonly allowAutomaticRouting: boolean;
};

/**
 * Die Foundation bleibt sowohl typseitig als auch zur Laufzeit unveränderlich.
 * Eine spätere Aktivierung muss deshalb bewusst über einen Code-Änderungsschritt
 * erfolgen und kann nicht versehentlich durch Mutation zur Laufzeit passieren.
 */
export const FINANCE_ANIMATION_FEATURES: Readonly<FinanceAnimationFeatureFlags> =
  Object.freeze({
    enabled: false,
    allowHybrid: false,
    allowFullAnimation: false,
    allowAutomaticRouting: false,
  });

export const isFinanceAnimationEnabled = (): boolean =>
  FINANCE_ANIMATION_FEATURES.enabled;
