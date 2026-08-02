import type {FinanceAnimationDecision, FinanceAnimationRequest} from '../contracts';

/**
 * Liefert immer einen sicheren Bild-Fallback.
 * Dieses Modul ist bewusst unabhängig vom produktiven Renderer.
 */
export const createImageFallback = (
  request: FinanceAnimationRequest,
  blockedReasons: string[] = [],
): FinanceAnimationDecision => ({
  mode: 'image',
  confidence: 1,
  reason: 'Animation nicht sicher einsetzbar; bestehender Bild-Workflow bleibt aktiv.',
  blockedReasons: [
    ...blockedReasons,
    request.message.trim() ? '' : 'Kernaussage fehlt.',
    request.voiceText.trim() ? '' : 'Voiceover-Text fehlt.',
  ].filter(Boolean),
});
