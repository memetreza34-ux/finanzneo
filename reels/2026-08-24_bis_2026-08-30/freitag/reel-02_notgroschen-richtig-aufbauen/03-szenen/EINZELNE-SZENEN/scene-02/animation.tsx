import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalRail, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Ein goldener Reserveblock liegt ungeschützt neben einer unerwarteten roten Kostenkarte.
 * MECHANISM: Ein Emerald-Schutzschild fährt zwischen Kostenkarte und Reserve und ordnet das Geld sichtbar als Notfallpuffer.
 * RESULT: Die Kostenkarte bleibt abgefangen, während der geschützte Notgroschen stabil und griffbereit stehen bleibt.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Ein großes physisches Hauptobjekt trägt die Kernaussage und bleibt sofort erkennbar.
 * SUPPORT: Nur direkt erklärende Nebenobjekte ergänzen den Mechanismus; ihre Anzahl bleibt flexibel.
 * MATERIAL: Ivory und Gold zeigen neutrale Reserve und Geld, Emerald zeigt Schutz, Rot-Orange zeigt Kostenrisiko.
 * DEPTH: Gestaffelte Objektpositionen, sichtbare Dicke und klare Lichttrennung erzeugen räumliche Tiefe auf transparentem Stage.
 *
 * Der Stage bleibt transparent und nutzt ausschließlich den zentralen statischen Reel-Canvas.
 * Die Bewegung erklärt den gesprochenen Inhalt und endet in einem stabilen Ergebnis.
 */
export const RESULT_HOLD_FRAMES = 18;

export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(48, durationFrames - RESULT_HOLD_FRAMES - 8);
  const progress = interpolate(frame, [8, endFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const settle = interpolate(progress, [0.72, 1], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <PremiumPhysicalStage>
      <PhysicalObject material="money" width={360} height={230} x={560} y={650} scale={0.9 + settle * 0.1}><div style={{fontSize:54,fontWeight:900,padding:52,textAlign:'center',color:ANIMATION_COLORS.money}}>RESERVE</div></PhysicalObject>
      <PhysicalObject material="warning" width={290} height={190} x={80 + progress * 250} y={680} opacity={1 - settle * 0.35}><div style={{fontSize:42,fontWeight:900,padding:42,textAlign:'center',color:ANIMATION_COLORS.neutralText}}>KOSTEN</div></PhysicalObject>
      <PhysicalObject material="positive" width={120} height={360} x={470} y={590} scale={0.72 + progress * 0.28}><div style={{fontSize:68,fontWeight:900,paddingTop:120,textAlign:'center',color:ANIMATION_COLORS.positive}}>✓</div></PhysicalObject>
    </PremiumPhysicalStage>
  );
};
