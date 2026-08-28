import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalRail, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Eine rote Rechnung bewegt sich auf einen offenen Schuldenblock zu, während der Goldpuffer bereitsteht.
 * MECHANISM: Der Goldpuffer schiebt sich sichtbar in den Weg und übernimmt die Belastung, bevor die Rechnung den Schuldenblock erreicht.
 * RESULT: Die Rechnung endet beim Reserveblock; der rote Schuldenblock bleibt unberührt und deutlich getrennt.
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

export const Scene04Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(48, durationFrames - RESULT_HOLD_FRAMES - 8);
  const progress = interpolate(frame, [8, endFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const settle = interpolate(progress, [0.72, 1], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <PremiumPhysicalStage>
      <PhysicalObject material="warning" width={300} height={190} x={90 + progress * 290} y={650}><div style={{fontSize:42,fontWeight:900,padding:45,textAlign:'center',color:ANIMATION_COLORS.neutralText}}>RECHNUNG</div></PhysicalObject>
      <PhysicalObject material="money" width={330} height={230} x={450} y={625} scale={0.84 + settle * 0.16}><div style={{fontSize:48,fontWeight:900,padding:54,textAlign:'center',color:ANIMATION_COLORS.money}}>PUFFER</div></PhysicalObject>
      <PhysicalObject material="warning" width={220} height={220} x={800} y={630} opacity={0.9 - settle * 0.45}><div style={{fontSize:40,fontWeight:900,padding:58,textAlign:'center',color:ANIMATION_COLORS.neutralText}}>DISPO</div></PhysicalObject>
      <PhysicalRail x={180} y={930} width={650} progress={progress} material="positive" />
    </PremiumPhysicalStage>
  );
};
