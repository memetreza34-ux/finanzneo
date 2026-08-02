import type {
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
 * Exakte statische Datenverträge je Animationstemplate.
 *
 * Die Typen besitzen bewusst keinen offenen String-Index. Dadurch können
 * Registry-Pflichtfelder mit `keyof` tatsächlich gegen existierende Felder
 * geprüft werden und Tippfehler werden beim Typecheck erkannt.
 *
 * Prozentfelder verwenden immer Prozentpunkte: `7` bedeutet 7 Prozent und
 * `0.5` bedeutet 0,5 Prozent. Erst der Renderer wandelt diese Werte für die
 * Finanzformeln in Dezimalraten um.
 *
 * Der Request-Vertrag bleibt bewusst flexibel, damit eingehende KI-Daten
 * zuerst validiert werden können. Intern erzeugte Fixtures und kontrollierte
 * Aufrufer verwenden dagegen diese strengeren Typen.
 */
export type FinanceAnimationTemplateDataMap = {
  'money-flow': {
    amount: number;
    fromLabel: string;
    toLabel: string;
  };
  'budget-split': {
    income: number;
    needsPercent: number;
    wantsPercent: number;
    savingsPercent: number;
  };
  'compound-growth': {
    startCapital: number;
    monthlyRate: number;
    annualReturn: number;
    years: number;
  };
  'portfolio-allocation': {
    allocations: PortfolioAllocationDatum[];
    total?: number;
  };
  'inflation-erosion': {
    startingValue: number;
    inflationPercent: number;
    years: number;
  };
  'debt-paydown': {
    originalDebt: number;
    remainingDebt: number;
    paidInstallments?: number;
    totalInstallments?: number;
  };
  'monthly-investment': {
    monthlyRate: number;
    months: number;
    annualReturn?: number;
  };
  'before-after-comparison': {
    beforeLabel: string;
    afterLabel: string;
    beforeValue: number;
    afterValue: number;
  };
  'risk-return-scale': {
    riskPercent: number;
    returnPercent: number;
  };
  'timeline-milestones': {
    milestones: TimelineMilestoneDatum[];
  };
  'income-expense-balance': {
    income: number;
    expenses: number;
  };
  'tax-fee-flow': {
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
