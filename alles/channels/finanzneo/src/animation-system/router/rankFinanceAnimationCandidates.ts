import type {
  FinanceAnimationRequest,
  FinanceAnimationTemplate,
} from '../contracts';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';
import {FINANCE_ANIMATION_KEYWORDS} from './financeAnimationKeywords';
import {
  containsFinanceKeyword,
  normalizeFinanceText,
} from './financeKeywordMatching';

export type FinanceAnimationRoutingCandidate = {
  template: FinanceAnimationTemplate;
  score: number;
  keywordMatches: readonly string[];
  dataMatches: readonly string[];
  preferred: boolean;
};

export const rankFinanceAnimationCandidates = (
  request: FinanceAnimationRequest,
): FinanceAnimationRoutingCandidate[] => {
  const haystack = normalizeFinanceText(`${request.message} ${request.voiceText}`);

  return FINANCE_ANIMATION_TEMPLATES.map((definition) => {
    const keywordMatches = FINANCE_ANIMATION_KEYWORDS[definition.id].filter((keyword) =>
      containsFinanceKeyword(haystack, keyword),
    );
    const preferred = request.preferredTemplate === definition.id;
    const dataMatches = definition.requiredData.filter((key) => {
      const value = request.data?.[key];
      return value !== undefined && value !== null && value !== '';
    });

    return {
      template: definition.id,
      score: keywordMatches.length * 2 + (preferred ? 5 : 0) + dataMatches.length,
      keywordMatches,
      dataMatches,
      preferred,
    };
  }).sort((left, right) =>
    right.score - left.score ||
    right.dataMatches.length - left.dataMatches.length ||
    right.keywordMatches.length - left.keywordMatches.length,
  );
};

export const haveAmbiguousTopCandidates = (
  candidates: readonly FinanceAnimationRoutingCandidate[],
): boolean => {
  const [first, second] = candidates;
  return Boolean(
    first &&
    second &&
    first.score > 0 &&
    first.score === second.score &&
    first.dataMatches.length === second.dataMatches.length &&
    !first.preferred &&
    !second.preferred,
  );
};
