import type {FinanceAnimationDecision, FinanceAnimationRequest} from '../contracts';

export const normalizeFallbackReasons = (
  reasons: readonly string[],
): string[] => {
  const normalized = reasons
    .map((reason) => reason.trim())
    .filter((reason) => reason.length > 0);
  return [...new Set(normalized)];
};

/**
 * Liefert immer einen sicheren Bild-Fallback.
 * Dieses Modul ist bewusst unabhängig vom produktiven Renderer.
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
    request.message.trim() ? '' : 'Kernaussage fehlt.',
    request.voiceText.trim() ? '' : 'Voiceover-Text fehlt.',
  ]),
});
