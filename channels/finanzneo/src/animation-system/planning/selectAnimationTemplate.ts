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
  keywordMatches: readonly string[];
  dataMatches: readonly string[];
  preferred: boolean;
  reasons: string[];
};

export const rankAnimationTemplates = (
  request: FinanceAnimationRequest,
): AnimationSelectionCandidate[] => {
  const haystack = normalizeFinanceText(`${request.message} ${request.voiceText}`);

  return FINANCE_ANIMATION_TEMPLATES.map((definition) => {
    const keywordMatches = FINANCE_ANIMATION_KEYWORDS[definition.id].filter((keyword) =>
      containsFinanceKeyword(haystack, keyword),
    );
    const preferred = request.preferredTemplate === definition.id;
    const preferredBonus = preferred ? 5 : 0;
    const dataMatches = definition.requiredData.filter((key) => {
      const value = request.data?.[key];
      return value !== undefined && value !== null && value !== '';
    });
    const score = keywordMatches.length * 2 + preferredBonus + dataMatches.length;

    return {
      template: definition.id,
      score,
      keywordMatches,
      dataMatches,
      preferred,
      reasons: [
        ...keywordMatches.map((keyword) => `Keyword: ${keyword}`),
        ...(preferred ? ['Bevorzugtes Template'] : []),
        ...(dataMatches.length ? [`${dataMatches.length} passende Datenfelder`] : []),
      ],
    };
  }).sort((left, right) =>
    right.score - left.score ||
    right.dataMatches.length - left.dataMatches.length ||
    right.keywordMatches.length - left.keywordMatches.length,
  );
};

export const selectAnimationTemplate = (
  request: FinanceAnimationRequest,
): FinanceAnimationDecision => {
  const [best, second] = rankAnimationTemplates(request);

  if (!best || best.score <= 0) {
    return {
      mode: 'image',
      confidence: 0.95,
      reason: 'Kein ausreichend passendes Animationstemplate gefunden.',
    };
  }

  if (
    second &&
    best.score === second.score &&
    best.dataMatches.length === second.dataMatches.length &&
    !best.preferred &&
    !second.preferred
  ) {
    return {
      mode: 'image',
      confidence: 0.82,
      reason: `Template-Auswahl ist zwischen ${best.template} und ${second.template} mehrdeutig.`,
      blockedReasons: [`Gleichstand bei Auswahl-Punktzahl: ${best.score}.`],
    };
  }

  return {
    mode: 'hybrid',
    template: best.template,
    confidence: Math.min(0.95, 0.55 + best.score * 0.05),
    reason: best.reasons.join(', '),
  };
};
