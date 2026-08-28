import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalRail, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Eine rote Zeitdruck-Karte drückt von links auf eine Entscheidungsfläche, während der Reserveblock seitlich steht.
 * MECHANISM: Der Reserveblock schiebt sich zwischen Zeitdruck und Entscheidung und verlangsamt sichtbar den roten Druckpfad.
 * RESULT: Die Entscheidung bleibt frei und ruhig, der Zeitdruck steht deutlich vor dem Puffer still.
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

export const Scene14Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(48, durationFrames - RESULT_HOLD_FRAMES - 8);
  const progress = interpolate(frame, [8, endFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const settle = interpolate(progress, [0.72, 1], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <PremiumPhysicalStage>
      <PhysicalObject material="warning" width={260} height={190} x={80 + progress * 170} y={665} opacity={1 - settle * 0.25}><div style={{fontSize:38,fontWeight:900,padding:49,textAlign:'center',color:ANIMATION_COLORS.neutralText}}>ZEITDRUCK</div></PhysicalObject>
      <PhysicalObject material="money" width={300} height={230} x={420} y={640} scale={0.84 + settle * 0.16}><div style={{fontSize:44,fontWeight:900,padding:62,textAlign:'center',color:ANIMATION_COLORS.money}}>PUFFER</div></PhysicalObject>
      <PhysicalObject material="positive" width={300} height={230} x={760} y={640} opacity={0.58 + settle * 0.42}><div style={{fontSize:42,fontWeight:900,padding:62,textAlign:'center',color:ANIMATION_COLORS.positive}}>RUHE</div></PhysicalObject>
      <PhysicalRail x={180} y={930} width={700} progress={settle} material="positive" />
    </PremiumPhysicalStage>
  );
};
