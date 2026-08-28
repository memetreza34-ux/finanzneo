import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalRail, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Ein kleiner goldener Startpuffer steht als einzelner kompakter Reserveblock in der Mitte.
 * MECHANISM: Mit dem Fortschritt kommen weitere Goldsegmente hinzu und verbinden sich sichtbar zu einer stabileren Reserve.
 * RESULT: Die Reserve endet deutlich größer, ohne einen unrealistischen Sofortsprung zu suggerieren.
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

export const Scene09Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(48, durationFrames - RESULT_HOLD_FRAMES - 8);
  const progress = interpolate(frame, [8, endFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const settle = interpolate(progress, [0.72, 1], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <PremiumPhysicalStage>
      <PhysicalObject material="money" width={220} height={170} x={180} y={700} scale={0.86 + settle * 0.14}><div style={{fontSize:44,fontWeight:900,padding:48,textAlign:'center',color:ANIMATION_COLORS.money}}>START</div></PhysicalObject>
      <PhysicalObject material="money" width={220} height={170} x={430} y={700} opacity={progress} scale={0.72 + progress * 0.28}><div style={{fontSize:44,fontWeight:900,padding:48,textAlign:'center',color:ANIMATION_COLORS.money}}>+1</div></PhysicalObject>
      <PhysicalObject material="positive" width={220} height={170} x={680} y={700} opacity={settle} scale={0.72 + settle * 0.28}><div style={{fontSize:42,fontWeight:900,padding:48,textAlign:'center',color:ANIMATION_COLORS.positive}}>STABILER</div></PhysicalObject>
      <PhysicalRail x={200} y={930} width={650} progress={progress} material="money" />
    </PremiumPhysicalStage>
  );
};
