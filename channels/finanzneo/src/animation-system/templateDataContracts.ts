import type {
  FinanceAnimationData,
  FinanceAnimationScene,
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
 * Prozentfelder verwenden immer Prozentpunkte: `7` bedeutet 7 Prozent und
 * `0.5` bedeutet 0,5 Prozent. Erst der Renderer wandelt diese Werte für die
 * Finanzformeln in Dezimalraten um.
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

export type TypedFinanceAnimationScene<
  TTemplate extends FinanceAnimationTemplate,
> = Omit<FinanceAnimationScene, 'template' | 'data'> & {
  template: TTemplate;
  data: FinanceAnimationTemplateData<TTemplate>;
};

export const defineFinanceAnimationData = <
  TTemplate extends FinanceAnimationTemplate,
>(
  _template: TTemplate,
  data: FinanceAnimationTemplateData<TTemplate>,
): FinanceAnimationTemplateData<TTemplate> => data;

/**
 * Factory für intern kontrollierte Szenen. Template-ID und Datenstruktur
 * bleiben dabei statisch miteinander verknüpft, während der Rückgabewert mit
 * dem allgemeinen Renderer-Vertrag kompatibel bleibt.
 */
export const defineFinanceAnimationScene = <
  TTemplate extends FinanceAnimationTemplate,
>(
  scene: TypedFinanceAnimationScene<TTemplate>,
): FinanceAnimationScene => scene;
