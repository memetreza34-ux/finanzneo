import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalRail, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Ein gemeinsamer Geldblock liegt zwischen einem Alltags-Wallet und einem geschützten Reservebehälter.
 * MECHANISM: Der Geldblock teilt sich sichtbar: Alltagsgeld bleibt links, der Notgroschen wandert separat in den geschützten Behälter.
 * RESULT: Zwei klar getrennte Bereiche bleiben stabil: tägliches Budget und unangetastete Reserve.
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

export const Scene11Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(48, durationFrames - RESULT_HOLD_FRAMES - 8);
  const progress = interpolate(frame, [8, endFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const settle = interpolate(progress, [0.72, 1], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <PremiumPhysicalStage>
      <PhysicalObject material="neutral" width={300} height={220} x={110} y={650}><div style={{fontSize:42,fontWeight:900,padding:58,textAlign:'center'}}>ALLTAG</div></PhysicalObject>
      <PhysicalObject material="money" width={250} height={180} x={420 + progress * 180} y={675} scale={0.82 + settle * 0.18}><div style={{fontSize:40,fontWeight:900,padding:48,textAlign:'center',color:ANIMATION_COLORS.money}}>RESERVE</div></PhysicalObject>
      <PhysicalObject material="positive" width={310} height={240} x={730} y={640} opacity={0.55 + progress * 0.45}><div style={{fontSize:40,fontWeight:900,padding:68,textAlign:'center',color:ANIMATION_COLORS.positive}}>SEPARAT</div></PhysicalObject>
      <PhysicalRail x={180} y={930} width={700} progress={progress} material="positive" />
    </PremiumPhysicalStage>
  );
};
