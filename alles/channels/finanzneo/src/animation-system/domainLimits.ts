export type FinanceAnimationDomainLimits = {
  readonly maxAbsoluteMoney: number;
  readonly maxYears: number;
  readonly maxMonths: number;
  readonly maxInstallments: number;
  readonly maxTimelineAbsoluteValue: number;
  readonly maxVisibleLabelLength: number;
};

/**
 * Fachliche und visuelle Obergrenzen für eine einzelne 9:16-Erklärszene.
 * Die Werte verhindern mathematische Überläufe, unlesbare Darstellungen und
 * versehentlich extrem teure oder bedeutungslose Render-Eingaben.
 */
export const FINANCE_ANIMATION_DOMAIN_LIMITS: Readonly<FinanceAnimationDomainLimits> =
  Object.freeze({
    maxAbsoluteMoney: 1_000_000_000_000,
    maxYears: 100,
    maxMonths: 1200,
    maxInstallments: 1200,
    maxTimelineAbsoluteValue: 1_000_000_000_000,
    maxVisibleLabelLength: 80,
  });
