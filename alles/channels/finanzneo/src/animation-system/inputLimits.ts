export type FinanceAnimationInputLimits = {
  readonly maxTextLength: number;
  readonly maxLabels: number;
  readonly maxLabelLength: number;
  readonly maxDataFields: number;
  readonly maxStructuredArrayItems: number;
};

/**
 * Technische Obergrenzen an der Parser- und Typed-Request-Grenze.
 * Layout-spezifische, strengere Grenzen stehen separat in `domainLimits.ts`.
 */
export const FINANCE_ANIMATION_INPUT_LIMITS: Readonly<FinanceAnimationInputLimits> =
  Object.freeze({
    maxTextLength: 5000,
    maxLabels: 20,
    maxLabelLength: 160,
    maxDataFields: 64,
    maxStructuredArrayItems: 50,
  });
