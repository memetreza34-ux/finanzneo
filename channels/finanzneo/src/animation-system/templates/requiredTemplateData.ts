import type {FinanceAnimationTemplate} from '../contracts';
import type {FinanceAnimationTemplateDataMap} from '../templateDataContracts';

type FinanceAnimationRequiredDataMap = {
  [TTemplate in FinanceAnimationTemplate]: readonly (
    keyof FinanceAnimationTemplateDataMap[TTemplate] & string
  )[];
};

/**
 * Einzige kanonische Liste der Pflichtfelder je Template.
 * `satisfies` verhindert, dass ein Feld eingetragen wird, das im zugehörigen
 * streng typisierten Datenvertrag nicht existiert.
 */
export const FINANCE_ANIMATION_REQUIRED_DATA = {
  'money-flow': ['amount', 'fromLabel', 'toLabel'],
  'budget-split': ['income', 'needsPercent', 'wantsPercent', 'savingsPercent'],
  'compound-growth': ['startCapital', 'monthlyRate', 'annualReturn', 'years'],
  'portfolio-allocation': ['allocations'],
  'inflation-erosion': ['startingValue', 'inflationPercent', 'years'],
  'debt-paydown': ['originalDebt', 'remainingDebt'],
  'monthly-investment': ['monthlyRate', 'months'],
  'before-after-comparison': ['beforeLabel', 'afterLabel', 'beforeValue', 'afterValue'],
  'risk-return-scale': ['riskPercent', 'returnPercent'],
  'timeline-milestones': ['milestones'],
  'income-expense-balance': ['income', 'expenses'],
  'tax-fee-flow': ['grossAmount', 'taxes', 'fees'],
} as const satisfies FinanceAnimationRequiredDataMap;

export const getRequiredTemplateData = <
  TTemplate extends FinanceAnimationTemplate,
>(template: TTemplate) => FINANCE_ANIMATION_REQUIRED_DATA[template];
