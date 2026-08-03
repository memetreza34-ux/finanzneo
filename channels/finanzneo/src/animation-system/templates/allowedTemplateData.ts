import type {FinanceAnimationTemplate} from '../contracts';
import type {FinanceAnimationTemplateDataMap} from '../templateDataContracts';

type FinanceAnimationAllowedDataMap = {
  [TTemplate in FinanceAnimationTemplate]: readonly (
    keyof FinanceAnimationTemplateDataMap[TTemplate] & string
  )[];
};

/**
 * Vollständige Allowlist aller Datenfelder je Template.
 *
 * Anders als `FINANCE_ANIMATION_REQUIRED_DATA` enthält diese Liste auch
 * optionale Felder. Sie dient der Laufzeitvalidierung unbekannter KI-/JSON-
 * Eingaben und verhindert, dass Tippfehler oder nicht verwendete Zusatzdaten
 * still akzeptiert werden.
 */
export const FINANCE_ANIMATION_ALLOWED_DATA = {
  'money-flow': ['amount', 'fromLabel', 'toLabel'],
  'budget-split': ['income', 'needsPercent', 'wantsPercent', 'savingsPercent'],
  'compound-growth': ['startCapital', 'monthlyRate', 'annualReturn', 'years'],
  'portfolio-allocation': ['allocations', 'total'],
  'inflation-erosion': ['startingValue', 'inflationPercent', 'years'],
  'debt-paydown': ['originalDebt', 'remainingDebt', 'paidInstallments', 'totalInstallments'],
  'monthly-investment': ['monthlyRate', 'months', 'annualReturn'],
  'before-after-comparison': ['beforeLabel', 'afterLabel', 'beforeValue', 'afterValue'],
  'risk-return-scale': ['riskPercent', 'returnPercent'],
  'timeline-milestones': ['milestones'],
  'income-expense-balance': ['income', 'expenses'],
  'tax-fee-flow': ['grossAmount', 'taxes', 'fees'],
} as const satisfies FinanceAnimationAllowedDataMap;

export const FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS = {
  'portfolio-allocation': ['label', 'percent', 'value'],
  'timeline-milestones': ['label', 'value'],
} as const;

export const getAllowedTemplateData = <
  TTemplate extends FinanceAnimationTemplate,
>(template: TTemplate): readonly string[] =>
  FINANCE_ANIMATION_ALLOWED_DATA[template];
