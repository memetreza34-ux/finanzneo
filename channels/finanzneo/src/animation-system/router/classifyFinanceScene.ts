import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationTemplate,
  FinanceSceneMode,
} from '../contracts';
import {
  FINANCE_ANIMATION_FEATURES,
  type FinanceAnimationFeatureFlags,
} from '../featureFlags';

type TemplateKeywordDefinition = {
  template: FinanceAnimationTemplate;
  keywords: string[];
};

const TEMPLATE_KEYWORDS: TemplateKeywordDefinition[] = [
  {template: 'compound-growth', keywords: ['zinseszins', 'rendite', 'wachstum', 'gewinn']},
  {template: 'monthly-investment', keywords: ['sparplan', 'monatlich', 'rate', 'einzahlen']},
  {template: 'inflation-erosion', keywords: ['inflation', 'kaufkraft', 'preise']},
  {template: 'budget-split', keywords: ['budget', 'fixkosten', 'sparquote', 'aufteilen']},
  {template: 'portfolio-allocation', keywords: ['portfolio', 'diversifikation', 'etf', 'aufteilung']},
  {template: 'debt-paydown', keywords: ['schuld', 'tilgung', 'kredit', 'restschuld']},
  {template: 'money-flow', keywords: ['geldfluss', 'einnahmen', 'ausgaben', 'gehalt']},
  {template: 'tax-fee-flow', keywords: ['steuer', 'gebühr', 'fondskosten', 'kostenquote']},
  {template: 'risk-return-scale', keywords: ['risiko', 'rendite']},
  {template: 'timeline-milestones', keywords: ['jahre', 'zeit', 'entwicklung']},
  {template: 'before-after-comparison', keywords: ['vergleich', 'stattdessen', 'gegenüber']},
  {template: 'income-expense-balance', keywords: ['einkommen', 'ausgaben', 'saldo']},
];

const normalize = (value: string): string => value.toLocaleLowerCase('de-DE');

export const resolveFinanceAnimationMode = (
  features: FinanceAnimationFeatureFlags,
): FinanceSceneMode => {
  if (!features.enabled) return 'image';
  if (features.allowFullAnimation) return 'full-animation';
  if (features.allowHybrid) return 'hybrid';
  return 'image';
};

export const classifyFinanceSceneWithFeatures = (
  request: FinanceAnimationRequest,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationDecision => {
  if (!features.enabled || !features.allowAutomaticRouting) {
    return {
      mode: 'image',
      confidence: 1,
      reason: 'Animationssystem ist vorbereitet, aber noch deaktiviert.',
    };
  }

  const mode = resolveFinanceAnimationMode(features);
  if (mode === 'image') {
    return {
      mode: 'image',
      confidence: 1,
      reason: 'Es ist noch kein Animationsmodus freigegeben.',
    };
  }

  const haystack = normalize(`${request.message} ${request.voiceText}`);
  const rankedMatches = TEMPLATE_KEYWORDS.map((definition) => {
    const keywordMatches = definition.keywords.filter((keyword) => haystack.includes(keyword));
    const preferredBonus = request.preferredTemplate === definition.template ? 2 : 0;
    return {
      template: definition.template,
      score: keywordMatches.length + preferredBonus,
      keywordMatches,
    };
  })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score);

  const match = rankedMatches[0];
  if (!match) {
    return {
      mode: 'image',
      confidence: 0.9,
      reason: 'Keine klar passende, wiederverwendbare Finanzanimation erkannt.',
    };
  }

  return {
    mode,
    template: match.template,
    confidence: Math.min(0.95, 0.68 + match.score * 0.06),
    reason: match.keywordMatches.length > 0
      ? `Passende Finanzbegriffe erkannt: ${match.keywordMatches.join(', ')}.`
      : 'Explizit bevorzugtes Finanzanimationstemplate ausgewählt.',
  };
};

export const classifyFinanceScene = (
  request: FinanceAnimationRequest,
): FinanceAnimationDecision => classifyFinanceSceneWithFeatures(
  request,
  FINANCE_ANIMATION_FEATURES,
);
