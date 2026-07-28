import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Vignette} from '../brand/components/Background';
import {FONT} from '../brand/fonts';
import {C, SAFE_AREA} from '../brand/tokens';
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
        }}>OBERE SAFE AREA · 18 %</div>}
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
