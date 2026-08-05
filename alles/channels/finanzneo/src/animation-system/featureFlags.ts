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

/**
 * Erzwingt die stufenweise Freigabe aus der Aktivierungs-Checkliste.
 * Vollanimation darf nicht vor Hybrid aktiviert werden und automatisches
 * Routing benötigt einen tatsächlich freigegebenen Animationsmodus.
 */
export const validateFinanceAnimationFeatureFlags = (
  features: FinanceAnimationFeatureFlags,
): string[] => {
  const errors: string[] = [];

  if (
    !features.enabled &&
    (features.allowHybrid ||
      features.allowFullAnimation ||
      features.allowAutomaticRouting)
  ) {
    errors.push(
      'Animationsmodi und automatisches Routing müssen deaktiviert bleiben, solange enabled false ist.',
    );
  }

  if (features.allowFullAnimation && !features.allowHybrid) {
    errors.push(
      'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    );
  }

  if (
    features.allowAutomaticRouting &&
    !features.allowHybrid &&
    !features.allowFullAnimation
  ) {
    errors.push(
      'Automatisches Routing benötigt mindestens einen freigegebenen Animationsmodus.',
    );
  }

  return errors;
};

export const isFinanceAnimationEnabled = (): boolean =>
  FINANCE_ANIMATION_FEATURES.enabled;
