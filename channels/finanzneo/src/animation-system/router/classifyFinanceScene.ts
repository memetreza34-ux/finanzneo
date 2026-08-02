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
    const preferredBonus = request.preferredTemplate === definition.id ? 5 : 0;
    const dataMatches = definition.requiredData.filter((key) => {
      const value = request.data?.[key];
      return value !== undefined && value !== null && value !== '';
    });
    return {
      template: definition.id,
      score: keywordMatches.length * 2 + preferredBonus + dataMatches.length,
      keywordMatches,
      dataMatches,
      preferred: preferredBonus > 0,
    };
  })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) =>
      right.score - left.score ||
      right.dataMatches.length - left.dataMatches.length ||
      right.keywordMatches.length - left.keywordMatches.length,
    );

  const match = rankedMatches[0];
  if (!match) {
    return {
      mode: 'image',
      confidence: 0.9,
      reason: 'Keine klar passende, wiederverwendbare Finanzanimation erkannt.',
    };
  }

  const secondMatch = rankedMatches[1];
  if (
    secondMatch &&
    match.score === secondMatch.score &&
    match.dataMatches.length === secondMatch.dataMatches.length &&
    !match.preferred &&
    !secondMatch.preferred
  ) {
    return {
      mode: 'image',
      confidence: 0.82,
      reason: `Mehrdeutige Zuordnung zwischen ${match.template} und ${secondMatch.template}; Bildmodus ist sicherer.`,
      blockedReasons: [
        `Gleichstand bei Routing-Punktzahl: ${match.score}.`,
      ],
    };
  }

  const reasonParts = [];
  if (match.keywordMatches.length > 0) {
    reasonParts.push(`Finanzbegriffe: ${match.keywordMatches.join(', ')}`);
  }
  if (match.dataMatches.length > 0) {
    reasonParts.push(`Datenfelder: ${match.dataMatches.join(', ')}`);
  }
  if (match.preferred) {
    reasonParts.push('explizit bevorzugtes Template');
  }

  return {
    mode,
    template: match.template,
    confidence: Math.min(0.95, 0.62 + match.score * 0.04),
    reason: `${reasonParts.join('; ')}.`,
  };
};

export const classifyFinanceScene = (
  request: FinanceAnimationRequest,
): FinanceAnimationDecision => classifyFinanceSceneWithFeatures(
  request,
  FINANCE_ANIMATION_FEATURES,
);
