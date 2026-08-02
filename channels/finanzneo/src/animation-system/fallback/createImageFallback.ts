import type {FinanceAnimationDecision, FinanceAnimationRequest} from '../contracts';

const hasVisibleText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const normalizeFallbackReasons = (
  reasons: readonly string[],
): string[] => {
  const normalized = reasons
    .filter((reason): reason is string => typeof reason === 'string')
    .map((reason) => reason.trim())
    .filter((reason) => reason.length > 0);
  return [...new Set(normalized)];
};

/**
 * Liefert immer einen sicheren Bild-Fallback.
 * Dieses Modul ist bewusst unabhängig vom produktiven Renderer und toleriert
 * auch zur Laufzeit unvollständige Eingaben an der KI-Datengrenze.
 */
export const createImageFallback = (
  request: FinanceAnimationRequest,
  blockedReasons: readonly string[] = [],
): FinanceAnimationDecision => ({
  mode: 'image',
  confidence: 1,
  reason: 'Animation nicht sicher einsetzbar; bestehender Bild-Workflow bleibt aktiv.',
  blockedReasons: normalizeFallbackReasons([
    ...blockedReasons,
    hasVisibleText(request.message) ? '' : 'Kernaussage fehlt.',
    hasVisibleText(request.voiceText) ? '' : 'Voiceover-Text fehlt.',
  ]),
});
