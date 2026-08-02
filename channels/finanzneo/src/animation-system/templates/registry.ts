import type {FinanceAnimationTemplate} from '../contracts';

export type FinanceAnimationTemplateDefinition = {
  id: FinanceAnimationTemplate;
  title: string;
  purpose: string;
  status: 'planned' | 'foundation-ready';
  requiredData: string[];
};

export const FINANCE_ANIMATION_TEMPLATES: FinanceAnimationTemplateDefinition[] = [
  {id: 'money-flow', title: 'Geldfluss', purpose: 'Einnahmen auf Ausgaben, Sparen und Investieren verteilen.', status: 'foundation-ready', requiredData: ['sources', 'destinations']},
  {id: 'budget-split', title: 'Budget-Aufteilung', purpose: 'Anteile eines Budgets verständlich aufteilen.', status: 'foundation-ready', requiredData: ['total', 'segments']},
  {id: 'compound-growth', title: 'Zinseszins', purpose: 'Einzahlungen und Erträge über Zeit sichtbar wachsen lassen.', status: 'foundation-ready', requiredData: ['principal', 'annualRate', 'years']},
  {id: 'portfolio-allocation', title: 'Portfolio-Aufteilung', purpose: 'Diversifikation und Gewichtungen zeigen.', status: 'planned', requiredData: ['allocations']},
  {id: 'inflation-erosion', title: 'Kaufkraftverlust', purpose: 'Sinkende reale Kaufkraft trotz gleichem Nominalbetrag zeigen.', status: 'foundation-ready', requiredData: ['nominalValue', 'annualInflation', 'years']},
  {id: 'debt-paydown', title: 'Schuldenabbau', purpose: 'Restschuld und Tilgungsfortschritt darstellen.', status: 'planned', requiredData: ['principal', 'annualRate', 'monthlyPayment', 'months']},
  {id: 'monthly-investment', title: 'Monatlicher Sparplan', purpose: 'Regelmäßige Einzahlungen und Vermögensaufbau zeigen.', status: 'foundation-ready', requiredData: ['monthlyContribution', 'annualRate', 'years']},
  {id: 'before-after-comparison', title: 'Vorher-Nachher-Vergleich', purpose: 'Zwei Finanzentscheidungen direkt vergleichen.', status: 'planned', requiredData: ['left', 'right']},
  {id: 'risk-return-scale', title: 'Risiko und Rendite', purpose: 'Zusammenhang zwischen Risiko und erwarteter Rendite zeigen.', status: 'planned', requiredData: ['items']},
  {id: 'timeline-milestones', title: 'Finanz-Zeitleiste', purpose: 'Entwicklung über Jahre oder Meilensteine zeigen.', status: 'planned', requiredData: ['milestones']},
  {id: 'income-expense-balance', title: 'Einnahmen und Ausgaben', purpose: 'Saldo und finanzielle Balance darstellen.', status: 'planned', requiredData: ['income', 'expenses']},
  {id: 'tax-fee-flow', title: 'Steuern und Gebühren', purpose: 'Abzüge vom Bruttobetrag nachvollziehbar machen.', status: 'planned', requiredData: ['gross', 'deductions']},
];

export const getFinanceAnimationTemplate = (id: FinanceAnimationTemplate) =>
  FINANCE_ANIMATION_TEMPLATES.find((template) => template.id === id);
