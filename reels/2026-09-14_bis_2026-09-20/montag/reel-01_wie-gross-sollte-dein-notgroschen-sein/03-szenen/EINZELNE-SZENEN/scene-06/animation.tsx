import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: stable-access-versus-market-swing
 * PRIMARY_ACTION: Ein Notgroschen-Geldstapel beobachtet einen sichtbar schwankenden ETF-Wert neben stabilem Tagesgeld und bewegt sich danach eindeutig zum verfügbaren Tagesgeld.
 * ANIMATION_NARRATIVE
 * START: Tagesgeld links, Notgroschen mittig und ETF rechts stehen als drei klar getrennte physische Objekte bereit.
 * MECHANISM: Der ETF-Körper sinkt deutlich und erholt sich nur teilweise; Tagesgeld bleibt stabil; anschließend bewegt sich der Notgroschen vom Zentrum zum Tagesgeld.
 * RESULT: Der Geldstapel liegt beim stabilen Tagesgeld und VERFÜGBAR hält als Ergebnis, während der ETF separat bleibt.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der einzelne Notgroschen-Geldstapel trifft eine sichtbare Ortsentscheidung zwischen stabilem Konto und schwankender Anlage.
 * SUPPORT: Kurze Tags STABIL und SCHWANKT benennen nur die bereits sichtbaren Zustände.
 * MATERIAL: Emerald für geschütztes Tagesgeld, Gold für den Notgroschen, warmes Red-Orange für die temporäre ETF-Schwankung.
 * DEPTH: Tagesgeld links vorne, Notgroschen zentral, ETF rechts leicht hinten mit vertikalem Bewegungsraum.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 165}) => {
  const frame = useCurrentFrame();
  const sceneIn = interpolate(frame, [0, 22], [0, 1], clamp);
  const etfDrop = interpolate(frame, [26, 58], [0, 1], clamp);
  const etfRecover = interpolate(frame, [60, 88], [0, 1], clamp);
  const chooseTagesgeld = interpolate(frame, [88, 126], [0, 1], clamp);
  const resultIn = interpolate(frame, [122, Math.max(134, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const etfY = 610 + etfDrop * 115 - etfRecover * 60;
  const coinX = 465 - chooseTagesgeld * 245;
  const coinY = 770 - chooseTagesgeld * 70;

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount x={85} y={560} label="Tagesgeld" balance="verfügbar" state="protected" scale={0.96 + chooseTagesgeld * 0.04} opacity={sceneIn} />
      <PhysicalCoinStack x={coinX} y={coinY} count={6} scale={0.72} opacity={sceneIn} />
      <PhysicalAccount x={710} y={etfY} label="ETF" balance="Marktwert" state={etfDrop > 0.35 && etfRecover < 0.9 ? 'danger' : 'normal'} scale={0.98} opacity={sceneIn} tilt={-2 + etfRecover * 2} />

      <div style={{position:'absolute',left:105,top:955,opacity:sceneIn,color:ANIMATION_COLORS.positive}}>
        <PhysicalTag material="positive" style={{fontSize:23}}>STABIL</PhysicalTag>
      </div>
      <div style={{position:'absolute',left:760,top:955,opacity:Math.max(etfDrop, etfRecover),color:ANIMATION_COLORS.warning}}>
        <PhysicalTag material="warning" style={{fontSize:23}}>SCHWANKT</PhysicalTag>
      </div>
      <div style={{position:'absolute',left:120,top:1050,opacity:resultIn,transform:`translateY(${(1-resultIn)*12}px)`,color:ANIMATION_COLORS.positive}}>
        <PhysicalTag material="positive" style={{fontSize:25}}>NOTGROSCHEN: VERFÜGBAR</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
