import type {FinanceAnimationTemplate} from '../contracts';
import {
  FINANCE_ANIMATION_REQUIRED_DATA,
  getRequiredTemplateData,
} from './requiredTemplateData';

export type FinanceAnimationTemplateStatus = 'planned' | 'foundation-ready';

export type FinanceAnimationTemplateDefinition = {
  readonly id: FinanceAnimationTemplate;
  readonly title: string;
  readonly purpose: string;
  readonly status: FinanceAnimationTemplateStatus;
  readonly requiredData: readonly string[];
};

export const FINANCE_ANIMATION_TEMPLATES = [
  {id: 'money-flow', title: 'Geldfluss', purpose: 'Einnahmen auf Ausgaben, Sparen und Investieren verteilen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['money-flow']},
  {id: 'budget-split', title: 'Budget-Aufteilung', purpose: 'Anteile eines Budgets verständlich aufteilen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['budget-split']},
  {id: 'compound-growth', title: 'Zinseszins', purpose: 'Einzahlungen und Erträge über Zeit sichtbar wachsen lassen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['compound-growth']},
  {id: 'portfolio-allocation', title: 'Portfolio-Aufteilung', purpose: 'Diversifikation und Gewichtungen zeigen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['portfolio-allocation']},
  {id: 'inflation-erosion', title: 'Kaufkraftverlust', purpose: 'Sinkende reale Kaufkraft trotz gleichem Nominalbetrag zeigen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['inflation-erosion']},
  {id: 'debt-paydown', title: 'Schuldenabbau', purpose: 'Restschuld und Tilgungsfortschritt darstellen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['debt-paydown']},
  {id: 'monthly-investment', title: 'Monatlicher Sparplan', purpose: 'Regelmäßige Einzahlungen und Vermögensaufbau zeigen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['monthly-investment']},
  {id: 'before-after-comparison', title: 'Vorher-Nachher-Vergleich', purpose: 'Zwei Finanzentscheidungen direkt vergleichen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['before-after-comparison']},
  {id: 'risk-return-scale', title: 'Risiko und Rendite', purpose: 'Zusammenhang zwischen Risiko und erwarteter Rendite zeigen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['risk-return-scale']},
  {id: 'timeline-milestones', title: 'Finanz-Zeitleiste', purpose: 'Entwicklung über Jahre oder Meilensteine zeigen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['timeline-milestones']},
  {id: 'income-expense-balance', title: 'Einnahmen und Ausgaben', purpose: 'Saldo und finanzielle Balance darstellen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['income-expense-balance']},
  {id: 'tax-fee-flow', title: 'Steuern und Gebühren', purpose: 'Abzüge vom Bruttobetrag nachvollziehbar machen.', status: 'foundation-ready', requiredData: FINANCE_ANIMATION_REQUIRED_DATA['tax-fee-flow']},
] as const satisfies readonly FinanceAnimationTemplateDefinition[];

const TEMPLATE_BY_ID = new Map<FinanceAnimationTemplate, FinanceAnimationTemplateDefinition>(
  FINANCE_ANIMATION_TEMPLATES.map((template) => [template.id, template]),
);

export const getFinanceAnimationTemplate = (
  id: FinanceAnimationTemplate,
): FinanceAnimationTemplateDefinition | undefined => TEMPLATE_BY_ID.get(id);

export const getRequiredFinanceAnimationData = (
  id: FinanceAnimationTemplate,
): readonly string[] => getRequiredTemplateData(id);
