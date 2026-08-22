import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Vignette} from '../brand/components/Background';
import {FONT} from '../brand/fonts';
import {C, REEL_LAYOUT, SAFE_AREA} from '../brand/tokens';
import {FNBgAurora, FNBgGrid} from '../bausteine/fn_backgrounds';

export type FinanceBackgroundVariant = 'standard' | 'data' | 'premium';

/**
 * Verbindliche Hintergrundauswahl für neue FinanzNeo-Produktionen.
 *
 * standard: ruhige Erklärung, KI-Bild, Text oder Zahlen
 * data: Charts, Tabellen und Marktdaten
 * premium: seltener Hook, Payoff oder Kapitelhöhepunkt
 */
export const FinanceBackground: React.FC<{variant?: FinanceBackgroundVariant}> = ({
  variant = 'standard',
}) => {
  if (variant === 'data') return <FNBgGrid />;
  if (variant === 'premium') return <FNBgAurora />;

  return (
    <>
      <Background grid={false} glow />
      <Vignette />
    </>
  );
};

/**
 * Nur für Studio-/Keyframe-Prüfung. Nicht im finalen Render sichtbar lassen.
 */
export const VerticalSafeAreaGuide: React.FC<{
  enabled?: boolean;
  showLabels?: boolean;
}> = ({enabled = true, showLabels = true}) => {
  if (!enabled) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 9999}}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: SAFE_AREA.topPx,
        background: 'rgba(255,51,51,0.10)',
        borderBottom: `3px dashed ${C.negativeLt}`,
      }}>
        {showLabels && <div style={{
          position: 'absolute',
          bottom: 12,
          left: 24,
          color: C.negativeLt,
          fontFamily: FONT.body,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1,
        }}>OBERE PLATTFORM-SAFE-AREA · {SAFE_AREA.topPx} PX</div>}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SAFE_AREA.bottomPx,
        background: 'rgba(255,51,51,0.10)',
        borderTop: `3px dashed ${C.negativeLt}`,
      }}>
        {showLabels && <div style={{
          position: 'absolute',
          top: 12,
          left: 24,
          color: C.negativeLt,
          fontFamily: FONT.body,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1,
        }}>UNTERE PLATTFORM-SAFE-AREA · {SAFE_AREA.bottomPx} PX</div>}
      </div>

      <div style={{
        position: 'absolute',
        top: REEL_LAYOUT.visual.top,
        left: REEL_LAYOUT.platformSafeArea.left,
        right: REEL_LAYOUT.platformSafeArea.right,
        height: REEL_LAYOUT.visual.bottom - REEL_LAYOUT.visual.top,
        border: `2px dashed ${C.accentSoft}`,
        borderRadius: 18,
      }} />

      <div style={{
        position: 'absolute',
        top: REEL_LAYOUT.caption.top,
        left: REEL_LAYOUT.caption.left,
        right: REEL_LAYOUT.caption.right,
        height: REEL_LAYOUT.caption.maxBottom - REEL_LAYOUT.caption.top,
        border: `2px dashed ${C.gold}`,
        borderRadius: 18,
      }} />
    </AbsoluteFill>
  );
};
