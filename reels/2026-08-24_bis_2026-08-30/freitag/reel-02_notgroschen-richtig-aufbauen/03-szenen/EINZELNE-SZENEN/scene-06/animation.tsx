import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalRail, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Ein neutraler Zielbehälter startet klein neben unterschiedlich großen monatlichen Verpflichtungsblöcken.
 * MECHANISM: Die Verpflichtungsblöcke verändern sichtbar den Zielumfang, während der Reservebehälter proportional größer wird.
 * RESULT: Der Zielbehälter endet als individuell angepasste Reserve statt als starre Einheitsgröße.
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

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(48, durationFrames - RESULT_HOLD_FRAMES - 8);
  const progress = interpolate(frame, [8, endFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const settle = interpolate(progress, [0.72, 1], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <PremiumPhysicalStage>
      <PhysicalObject material="neutral" width={230} height={150} x={80} y={700}><div style={{fontSize:34,fontWeight:900,padding:42,textAlign:'center'}}>MIETE</div></PhysicalObject>
      <PhysicalObject material="neutral" width={210} height={140} x={330} y={710}><div style={{fontSize:32,fontWeight:900,padding:39,textAlign:'center'}}>FIXKOSTEN</div></PhysicalObject>
      <PhysicalObject material="warning" width={190} height={130} x={560} y={720} opacity={0.75 + settle * 0.25}><div style={{fontSize:31,fontWeight:900,padding:36,textAlign:'center',color:ANIMATION_COLORS.neutralText}}>RISIKO</div></PhysicalObject>
      <PhysicalObject material="money" width={250 + progress * 120} height={180 + progress * 90} x={770 - progress * 70} y={650 - progress * 45} scale={0.82 + settle * 0.18}><div style={{fontSize:40,fontWeight:900,paddingTop:62,textAlign:'center',color:ANIMATION_COLORS.money}}>DEIN ZIEL</div></PhysicalObject>
    </PremiumPhysicalStage>
  );
};
