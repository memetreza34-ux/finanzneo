import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: three-salary-blocks-fill-one-reserve
 * PRIMARY_ACTION: Drei gleich große Monatsgehalt-Stapel erscheinen klar nacheinander; mit jedem Monatsblock steigt derselbe zentrale Notgroschen sichtbar bis zur 2–3-Monatsgehälter-Zone.
 * ANIMATION_NARRATIVE
 * START: Links steht nur Monat 1, rechts ein bewusst niedriger Notgroschen.
 * MECHANISM: Monat 2 und Monat 3 kommen nacheinander hinzu; exakt bei jedem neuen Stapel steigt der Füllstand des einen Reservebehälters in einer klaren Stufe.
 * RESULT: Drei vollständige Monatsblöcke bleiben sichtbar, der Notgroschen steht deutlich gefüllt daneben und die kurze Ergebniszeile bestätigt 2–3 Monatsgehälter.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Eine einzige Mengenbeziehung: drei gleichartige Goldstapel links gegen einen großen Reservebehälter rechts.
 * SUPPORT: Kleine Monatslabels und ein kurzer Ergebnis-Tag; keine Konten, Rechnungen, Kalender oder zweite Mechanik.
 * MATERIAL: Warmes Gold für Monatsgehälter, Emerald/Gold für die Reserve, Ivory nur für neutrale Beschriftung.
 * DEPTH: Alle Hauptobjekte liegen bewusst innerhalb X=120–860; keine Elemente berühren die horizontalen Reel-Ränder.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 135}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const one = spring({frame, fps, config: {damping: 18, stiffness: 105, mass: 0.9}, durationInFrames: 24});
  const two = spring({frame: Math.max(0, frame - 30), fps, config: {damping: 18, stiffness: 105, mass: 0.9}, durationInFrames: 24});
  const three = spring({frame: Math.max(0, frame - 62), fps, config: {damping: 18, stiffness: 105, mass: 0.9}, durationInFrames: 24});
  const reserveStep1 = interpolate(frame, [10, 28], [0.18, 0.38], clamp);
  const reserveStep2 = interpolate(frame, [38, 58], [0.38, 0.62], clamp);
  const reserveStep3 = interpolate(frame, [70, 92], [0.62, 0.86], clamp);
  const fill = frame < 38 ? reserveStep1 : frame < 70 ? reserveStep2 : reserveStep3;
  const resultIn = interpolate(frame, [90, Math.max(102, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  return (
    <PremiumPhysicalStage>
      <div style={{position:'absolute',left:120,top:520,width:470,height:520}}>
        <PhysicalCoinStack x={20} y={235 - (1 - one) * 55} count={6} scale={0.72 + one * 0.06} opacity={one} />
        <PhysicalCoinStack x={175} y={235 - (1 - two) * 55} count={6} scale={0.72 + two * 0.06} opacity={two} />
        <PhysicalCoinStack x={330} y={235 - (1 - three) * 55} count={6} scale={0.72 + three * 0.06} opacity={three} />

        <div style={{position:'absolute',left:18,top:410,opacity:one,color:ANIMATION_COLORS.money}}>
          <PhysicalTag material="money" style={{fontSize:20}}>MONAT 1</PhysicalTag>
        </div>
        <div style={{position:'absolute',left:173,top:410,opacity:two,color:ANIMATION_COLORS.money}}>
          <PhysicalTag material="money" style={{fontSize:20}}>MONAT 2</PhysicalTag>
        </div>
        <div style={{position:'absolute',left:328,top:410,opacity:three,color:ANIMATION_COLORS.money}}>
          <PhysicalTag material="money" style={{fontSize:20}}>MONAT 3</PhysicalTag>
        </div>
      </div>

      <PhysicalReserveTank
        x={620}
        y={500}
        width={240}
        height={440}
        fill={fill}
        label="Notgroschen"
        scale={0.96 + resultIn * 0.04}
      />

      <div style={{
        position:'absolute',
        left:360,
        top:1030,
        opacity:resultIn,
        transform:`translateY(${(1-resultIn)*16}px) scale(${0.96 + resultIn*0.04})`,
        color:ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize:25}}>2–3 MONATSGEHÄLTER</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
