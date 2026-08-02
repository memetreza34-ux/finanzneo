import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceAnimationTemplate,
} from '../contracts';
import {FINANCE_ANIMATION_KEYWORDS} from '../router/financeAnimationKeywords';
import {
  containsFinanceKeyword,
  normalizeFinanceText,
} from '../router/financeKeywordMatching';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';

export type AnimationSelectionCandidate = {
  template: FinanceAnimationTemplate;
  score: number;
  reasons: string[];
};

export const rankAnimationTemplates = (
  request: FinanceAnimationRequest,
): AnimationSelectionCandidate[] => {
  const haystack = normalizeFinanceText(`${request.message} ${request.voiceText}`);

  return FINANCE_ANIMATION_TEMPLATES.map((definition) => {
    const matches = FINANCE_ANIMATION_KEYWORDS[definition.id].filter((keyword) =>
      containsFinanceKeyword(haystack, keyword),
    );
    const preferredBonus = request.preferredTemplate === definition.id ? 3 : 0;
    const dataCoverage = definition.requiredData.filter((key) =>
      request.data?.[key] !== undefined,
    ).length;
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
