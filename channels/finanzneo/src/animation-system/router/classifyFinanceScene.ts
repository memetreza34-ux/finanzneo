import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationTemplate,
} from '../contracts';
import {FINANCE_ANIMATION_FEATURES} from '../featureFlags';

const TEMPLATE_KEYWORDS: Array<{template: FinanceAnimationTemplate; keywords: string[]}> = [
  {template: 'compound-growth', keywords: ['zinseszins', 'rendite', 'wachstum', 'gewinn']},
  {template: 'monthly-investment', keywords: ['sparplan', 'monatlich', 'rate', 'einzahlen']},
  {template: 'inflation-erosion', keywords: ['inflation', 'kaufkraft', 'preise']},
  {template: 'budget-split', keywords: ['budget', 'fixkosten', 'sparquote', 'aufteilen']},
  {template: 'portfolio-allocation', keywords: ['portfolio', 'diversifikation', 'etf', 'aufteilung']},
  {template: 'debt-paydown', keywords: ['schuld', 'tilgung', 'kredit', 'restschuld']},
  {template: 'money-flow', keywords: ['geldfluss', 'einnahmen', 'ausgaben', 'gehalt']},
  {template: 'tax-fee-flow', keywords: ['steuer', 'gebühr', 'ter', 'kosten']},
  {template: 'risk-return-scale', keywords: ['risiko', 'rendite']},
  {template: 'timeline-milestones', keywords: ['jahre', 'zeit', 'entwicklung']},
  {template: 'before-after-comparison', keywords: ['vergleich', 'stattdessen', 'gegenüber']},
  {template: 'income-expense-balance', keywords: ['einkommen', 'ausgaben', 'saldo']},
];

const normalize = (value: string): string => value.toLocaleLowerCase('de-DE');

export const classifyFinanceScene = (
  request: FinanceAnimationRequest,
): FinanceAnimationDecision => {
  if (!FINANCE_ANIMATION_FEATURES.enabled || !FINANCE_ANIMATION_FEATURES.allowAutomaticRouting) {
    return {
      mode: 'image',
      confidence: 1,
      reason: 'Animationssystem ist vorbereitet, aber noch deaktiviert.',
    };
  }

  const haystack = normalize(`${request.message} ${request.voiceText}`);
  const match = TEMPLATE_KEYWORDS.find(({keywords}) => keywords.some((keyword) => haystack.includes(keyword)));

  if (!match) {
    return {
      mode: 'image',
      confidence: 0.9,
      reason: 'Keine klar passende, wiederverwendbare Finanzanimation erkannt.',
    };
  }

  return {
    mode: FINANCE_ANIMATION_FEATURES.allowFullAnimation ? 'full-animation' : 'hybrid',
    template: request.preferredTemplate ?? match.template,
    confidence: 0.72,
    reason: 'Aussage passt zu einem vorbereiteten Finanzanimationstemplate.',
  };
};
