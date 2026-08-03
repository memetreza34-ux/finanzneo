import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
  FinanceSceneMode,
} from '../contracts';
import {
  FINANCE_ANIMATION_FEATURES,
  type FinanceAnimationFeatureFlags,
  validateFinanceAnimationFeatureFlags,
} from '../featureFlags';
import {
  haveAmbiguousTopCandidates,
  rankFinanceAnimationCandidates,
} from './rankFinanceAnimationCandidates';

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
  const featureErrors = validateFinanceAnimationFeatureFlags(features);
  if (featureErrors.length > 0) {
    return {
      mode: 'image',
      confidence: 1,
      reason: 'Die Animations-Feature-Konfiguration verletzt die sichere Aktivierungsreihenfolge.',
      blockedReasons: featureErrors,
    };
  }

  if (!features.enabled) {
    return {
      mode: 'image',
      confidence: 1,
      reason: 'Animationssystem ist vorbereitet, aber noch deaktiviert.',
    };
  }

  if (!features.allowAutomaticRouting) {
    return {
      mode: 'image',
      confidence: 1,
      reason: 'Automatische Animationsauswahl ist noch nicht freigegeben.',
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

  const rankedMatches = rankFinanceAnimationCandidates(request);
  const match = rankedMatches[0];
  if (!match || match.score <= 0) {
    return {
      mode: 'image',
      confidence: 0.9,
      reason: 'Keine klar passende, wiederverwendbare Finanzanimation erkannt.',
    };
  }

  const secondMatch = rankedMatches[1];
  if (haveAmbiguousTopCandidates(rankedMatches) && secondMatch) {
    return {
      mode: 'image',
      confidence: 0.82,
      reason: `Mehrdeutige Zuordnung zwischen ${match.template} und ${secondMatch.template}; Bildmodus ist sicherer.`,
      blockedReasons: [
        `Gleichstand bei Routing-Punktzahl: ${match.score}.`,
      ],
    };
  }

  const reasonParts: string[] = [];
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
