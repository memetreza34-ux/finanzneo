import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationTemplate,
} from '../contracts';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';

export type AnimationSelectionCandidate = {
  template: FinanceAnimationTemplate;
  score: number;
  reasons: string[];
};

const KEYWORDS: Record<FinanceAnimationTemplate, string[]> = {
  'money-flow': ['geldfluss', 'gehalt', 'einnahmen', 'ausgaben'],
  'budget-split': ['budget', 'fixkosten', 'sparquote', 'aufteilen'],
  'compound-growth': ['zinseszins', 'rendite', 'wachstum', 'gewinn'],
  'portfolio-allocation': ['portfolio', 'diversifikation', 'etf', 'aufteilung'],
  'inflation-erosion': ['inflation', 'kaufkraft', 'preise'],
  'debt-paydown': ['schuld', 'tilgung', 'kredit', 'restschuld'],
  'monthly-investment': ['sparplan', 'monatlich', 'rate', 'einzahlen'],
  'before-after-comparison': ['vergleich', 'stattdessen', 'gegenüber', 'vorher', 'nachher'],
  'risk-return-scale': ['risiko', 'rendite'],
  'timeline-milestones': ['jahre', 'zeit', 'entwicklung', 'meilenstein'],
  'income-expense-balance': ['einkommen', 'ausgaben', 'saldo'],
  'tax-fee-flow': ['steuer', 'gebühr', 'ter', 'kosten'],
};

const normalize = (value: string): string => value.toLocaleLowerCase('de-DE');

export const rankAnimationTemplates = (
  request: FinanceAnimationRequest,
): AnimationSelectionCandidate[] => {
  const haystack = normalize(`${request.message} ${request.voiceText}`);

  return FINANCE_ANIMATION_TEMPLATES.map((definition) => {
    const matches = KEYWORDS[definition.id].filter((keyword) => haystack.includes(keyword));
    const preferredBonus = request.preferredTemplate === definition.id ? 3 : 0;
    const dataCoverage = definition.requiredData.filter((key) => request.data?.[key] !== undefined).length;
    const score = matches.length * 2 + preferredBonus + dataCoverage;

    return {
      template: definition.id,
      score,
      reasons: [
        ...matches.map((keyword) => `Keyword: ${keyword}`),
        ...(preferredBonus ? ['Bevorzugtes Template'] : []),
        ...(dataCoverage ? [`${dataCoverage} passende Datenfelder`] : []),
      ],
    };
  }).sort((a, b) => b.score - a.score);
};

export const selectAnimationTemplate = (
  request: FinanceAnimationRequest,
): FinanceAnimationDecision => {
  const [best] = rankAnimationTemplates(request);

  if (!best || best.score <= 0) {
    return {
      mode: 'image',
      confidence: 0.95,
      reason: 'Kein ausreichend passendes Animationstemplate gefunden.',
    };
  }

  return {
    mode: 'hybrid',
    template: best.template,
    confidence: Math.min(0.95, 0.55 + best.score * 0.05),
    reason: best.reasons.join(', '),
  };
};
