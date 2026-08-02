import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceSceneMode,
} from '../contracts';
import {
  FINANCE_ANIMATION_FEATURES,
  type FinanceAnimationFeatureFlags,
} from '../featureFlags';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';
import {FINANCE_ANIMATION_KEYWORDS} from './financeAnimationKeywords';
import {
  containsFinanceKeyword,
  normalizeFinanceText,
} from './financeKeywordMatching';

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

  const haystack = normalizeFinanceText(`${request.message} ${request.voiceText}`);
  const rankedMatches = FINANCE_ANIMATION_TEMPLATES.map((definition) => {
    const keywordMatches = FINANCE_ANIMATION_KEYWORDS[definition.id].filter((keyword) =>
      containsFinanceKeyword(haystack, keyword),
    );
    const preferredBonus = request.preferredTemplate === definition.id ? 2 : 0;
    return {
      template: definition.id,
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
