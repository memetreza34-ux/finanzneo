import type {
  FinanceAnimationDecision,
  FinanceAnimationRequest,
} from '../contracts';
import {
  haveAmbiguousTopCandidates,
  rankFinanceAnimationCandidates,
  type FinanceAnimationRoutingCandidate,
} from '../router/rankFinanceAnimationCandidates';

export type AnimationSelectionCandidate = FinanceAnimationRoutingCandidate & {
  reasons: string[];
};

export const rankAnimationTemplates = (
  request: FinanceAnimationRequest,
): AnimationSelectionCandidate[] => rankFinanceAnimationCandidates(request).map((candidate) => ({
  ...candidate,
  reasons: [
    ...candidate.keywordMatches.map((keyword) => `Keyword: ${keyword}`),
    ...(candidate.preferred ? ['Bevorzugtes Template'] : []),
    ...(candidate.dataMatches.length
      ? [`${candidate.dataMatches.length} passende Datenfelder`]
      : []),
  ],
}));

export const selectAnimationTemplate = (
  request: FinanceAnimationRequest,
): FinanceAnimationDecision => {
  const candidates = rankAnimationTemplates(request);
  const [best, second] = candidates;

  if (!best || best.score <= 0) {
    return {
      mode: 'image',
      confidence: 0.95,
      reason: 'Kein ausreichend passendes Animationstemplate gefunden.',
    };
  }

  if (haveAmbiguousTopCandidates(candidates) && second) {
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
