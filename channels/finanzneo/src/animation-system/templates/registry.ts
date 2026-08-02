import type {FinanceAnimationTemplate} from '../contracts';

export type FinanceAnimationTemplateStatus = 'planned' | 'foundation-ready';

export type FinanceAnimationTemplateDefinition = {
  readonly id: FinanceAnimationTemplate;
  readonly title: string;
  readonly purpose: string;
  readonly status: FinanceAnimationTemplateStatus;
  readonly requiredData: readonly string[];
};

export const FINANCE_ANIMATION_TEMPLATES = [
  {id: 'money-flow', title: 'Geldfluss', purpose: 'Einnahmen auf Ausgaben, Sparen und Investieren verteilen.', status: 'foundation-ready', requiredData: ['amount', 'fromLabel', 'toLabel']},
  {id: 'budget-split', title: 'Budget-Aufteilung', purpose: 'Anteile eines Budgets verständlich aufteilen.', status: 'foundation-ready', requiredData: ['income', 'needsPercent', 'wantsPercent', 'savingsPercent']},
  {id: 'compound-growth', title: 'Zinseszins', purpose: 'Einzahlungen und Erträge über Zeit sichtbar wachsen lassen.', status: 'foundation-ready', requiredData: ['startCapital', 'monthlyRate', 'annualReturn', 'years']},
  {id: 'portfolio-allocation', title: 'Portfolio-Aufteilung', purpose: 'Diversifikation und Gewichtungen zeigen.', status: 'foundation-ready', requiredData: ['allocations']},
  {id: 'inflation-erosion', title: 'Kaufkraftverlust', purpose: 'Sinkende reale Kaufkraft trotz gleichem Nominalbetrag zeigen.', status: 'foundation-ready', requiredData: ['startingValue', 'inflationPercent', 'years']},
  {id: 'debt-paydown', title: 'Schuldenabbau', purpose: 'Restschuld und Tilgungsfortschritt darstellen.', status: 'foundation-ready', requiredData: ['originalDebt', 'remainingDebt']},
  {id: 'monthly-investment', title: 'Monatlicher Sparplan', purpose: 'Regelmäßige Einzahlungen und Vermögensaufbau zeigen.', status: 'foundation-ready', requiredData: ['monthlyRate', 'months']},
  {id: 'before-after-comparison', title: 'Vorher-Nachher-Vergleich', purpose: 'Zwei Finanzentscheidungen direkt vergleichen.', status: 'foundation-ready', requiredData: ['beforeLabel', 'afterLabel', 'beforeValue', 'afterValue']},
  {id: 'risk-return-scale', title: 'Risiko und Rendite', purpose: 'Zusammenhang zwischen Risiko und erwarteter Rendite zeigen.', status: 'foundation-ready', requiredData: ['riskPercent', 'returnPercent']},
  {id: 'timeline-milestones', title: 'Finanz-Zeitleiste', purpose: 'Entwicklung über Jahre oder Meilensteine zeigen.', status: 'foundation-ready', requiredData: ['milestones']},
  {id: 'income-expense-balance', title: 'Einnahmen und Ausgaben', purpose: 'Saldo und finanzielle Balance darstellen.', status: 'foundation-ready', requiredData: ['income', 'expenses']},
  {id: 'tax-fee-flow', title: 'Steuern und Gebühren', purpose: 'Abzüge vom Bruttobetrag nachvollziehbar machen.', status: 'foundation-ready', requiredData: ['grossAmount', 'taxes', 'fees']},
] as const satisfies readonly FinanceAnimationTemplateDefinition[];

const TEMPLATE_BY_ID = new Map<FinanceAnimationTemplate, FinanceAnimationTemplateDefinition>(
  FINANCE_ANIMATION_TEMPLATES.map((template) => [template.id, template]),
);

export const getFinanceAnimationTemplate = (
  id: FinanceAnimationTemplate,
): FinanceAnimationTemplateDefinition | undefined => TEMPLATE_BY_ID.get(id);

export const getRequiredFinanceAnimationData = (
  id: FinanceAnimationTemplate,
): readonly string[] => getFinanceAnimationTemplate(id)?.requiredData ?? [];
