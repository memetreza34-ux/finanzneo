import type {
  FinanceAnimationData,
  FinanceAnimationTemplate,
} from './contracts';

export type PortfolioAllocationDatum = {
  label: string;
  value?: number;
  percent?: number;
};

export type TimelineMilestoneDatum = {
  label: string;
  value: number | string;
};

/**
 * Statische Datenverträge je Animationstemplate.
 *
 * Der bestehende Request-Vertrag bleibt bewusst flexibel, damit eingehende
 * KI-Daten zuerst validiert werden können. Intern erzeugte Fixtures und
 * spätere kontrollierte Aufrufer können dagegen diese strengeren Typen nutzen.
 */
export type FinanceAnimationTemplateDataMap = {
  'money-flow': FinanceAnimationData & {
    amount: number;
    fromLabel: string;
    toLabel: string;
  };
  'budget-split': FinanceAnimationData & {
    income: number;
    needsPercent: number;
    wantsPercent: number;
    savingsPercent: number;
  };
  'compound-growth': FinanceAnimationData & {
    startCapital: number;
    monthlyRate: number;
    annualReturn: number;
    years: number;
  };
  'portfolio-allocation': FinanceAnimationData & {
    allocations: PortfolioAllocationDatum[];
    total?: number;
  };
  'inflation-erosion': FinanceAnimationData & {
    startingValue: number;
    inflationPercent: number;
    years: number;
  };
  'debt-paydown': FinanceAnimationData & {
    originalDebt: number;
    remainingDebt: number;
    paidInstallments?: number;
    totalInstallments?: number;
  };
  'monthly-investment': FinanceAnimationData & {
    monthlyRate: number;
    months: number;
    annualReturn?: number;
  };
  'before-after-comparison': FinanceAnimationData & {
    beforeLabel: string;
    afterLabel: string;
    beforeValue: number;
    afterValue: number;
  };
  'risk-return-scale': FinanceAnimationData & {
    riskPercent: number;
    returnPercent: number;
  };
  'timeline-milestones': FinanceAnimationData & {
    milestones: TimelineMilestoneDatum[];
  };
  'income-expense-balance': FinanceAnimationData & {
    income: number;
    expenses: number;
  };
  'tax-fee-flow': FinanceAnimationData & {
    grossAmount: number;
    taxes: number;
    fees: number;
  };
};

export type FinanceAnimationTemplateData<
  TTemplate extends FinanceAnimationTemplate,
> = FinanceAnimationTemplateDataMap[TTemplate];

export const defineFinanceAnimationData = <
  TTemplate extends FinanceAnimationTemplate,
>(
  _template: TTemplate,
  data: FinanceAnimationTemplateData<TTemplate>,
): FinanceAnimationTemplateData<TTemplate> => data;
