import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../brand/fonts';
import {C, SAFE_AREA} from '../brand/tokens';

/**
 * Backward-compatible prop only. Reel backgrounds no longer have visual
 * variants: every production reel uses one static pure-black canvas.
 */
export type FinanceBackgroundVariant = 'standard' | 'data' | 'premium';

export const REEL_BACKGROUND_COLOR = '#000000';

/**
 * Verbindlicher FinanzNeo-Reel-Hintergrund.
 * `variant` bleibt nur als API-Kompatibilität erhalten und wird ignoriert.
 */
export const FinanceBackground: React.FC<{variant?: FinanceBackgroundVariant}> = () => (
  <AbsoluteFill
    data-finanzneo-reel-background="pure-black-v1"
    style={{backgroundColor: REEL_BACKGROUND_COLOR}}
  />
);

/** Nur für Studio-/Keyframe-Prüfung. Im finalen Render deaktivieren. */
export const VerticalSafeAreaGuide: React.FC<{
  enabled?: boolean;
  showLabels?: boolean;
}> = ({enabled = true, showLabels = true}) => {
  if (!enabled) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 9999}}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: SAFE_AREA.topPx,
        background: 'rgba(255,51,51,0.10)',
        borderBottom: `3px dashed ${C.negativeLt}`,
      }}>
        {showLabels && <div style={{
          position: 'absolute', bottom: 12, left: 24,
          color: C.negativeLt, fontFamily: FONT.body, fontSize: 24,
          fontWeight: 800, letterSpacing: 1,
        }}>OBERE SAFE AREA · 18 %</div>}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SAFE_AREA.bottomPx,
        background: 'rgba(255,51,51,0.10)',
        borderTop: `3px dashed ${C.negativeLt}`,
      }}>
        {showLabels && <div style={{
          position: 'absolute', top: 12, left: 24,
          color: C.negativeLt, fontFamily: FONT.body, fontSize: 24,
          fontWeight: 800, letterSpacing: 1,
        }}>UNTERE SAFE AREA · 22 %</div>}
      </div>

      <div style={{
        position: 'absolute',
        top: SAFE_AREA.topPx,
        bottom: SAFE_AREA.bottomPx,
        left: 22,
        right: 22,
        border: `2px dashed ${C.accentSoft}`,
        borderRadius: 18,
      }} />
    </AbsoluteFill>
  );
};
