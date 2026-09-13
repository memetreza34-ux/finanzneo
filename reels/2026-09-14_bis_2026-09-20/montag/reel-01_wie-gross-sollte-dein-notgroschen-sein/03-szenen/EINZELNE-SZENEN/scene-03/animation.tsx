import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-blocks-build-emergency-reserve
 * PRIMARY_ACTION: Drei vollständige Monatsgehalt-Stapel erscheinen nacheinander und bauen den Notgroschen sichtbar auf zwei bis drei Monatsgehälter auf.
 * ANIMATION_NARRATIVE
 * START: Ein erster Monatsgehalt-Stapel und ein noch niedriger Notgroschen stehen als Ausgangspunkt bereit.
 * MECHANISM: Zweiter und dritter gleich großer Monatsblock kommen zeitlich getrennt hinzu; mit jedem Block steigt der Reservefüllstand sichtbar.
 * RESULT: Drei Monatsblöcke stehen vollständig lesbar neben einer deutlich gefüllten Reserve; 2–3 MONATSGEHÄLTER bestätigt die Größenordnung.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der große Notgroschen-Reservetank und drei gleich gewichtete Monatsgehalt-Stapel bilden die zentrale Mengenbeziehung.
 * SUPPORT: Kurze Tags markieren Monat 1, Monat 2 und Monat 3, ohne die physische Erklärung zu ersetzen.
 * MATERIAL: Emerald Reserve, warmes Gold für Geldstapel, Ivory für kurze neutrale Beschriftungen.
 * DEPTH: Reserve groß rechts vorne, Monatsstapel staffeln sich links nach rechts mit leichter Tiefenversetzung.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 135}) => {
  const frame = useCurrentFrame();
  const firstIn = interpolate(frame, [0, 24], [0, 1], clamp);
  const secondIn = interpolate(frame, [28, 55], [0, 1], clamp);
  const thirdIn = interpolate(frame, [58, 86], [0, 1], clamp);
  const reserveRise = interpolate(frame, [18, 92], [0.22, 0.88], clamp);
  const resultIn = interpolate(frame, [88, Math.max(98, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  return (
    <PremiumPhysicalStage>
      <PhysicalCoinStack x={95} y={735 - (1 - firstIn) * 70} count={6} scale={0.75} opacity={firstIn} />
      <PhysicalCoinStack x={330} y={735 - (1 - secondIn) * 70} count={6} scale={0.75} opacity={secondIn} />
      <PhysicalCoinStack x={565} y={735 - (1 - thirdIn) * 70} count={6} scale={0.75} opacity={thirdIn} />
      <PhysicalReserveTank x={715} y={500} width={250} height={430} fill={reserveRise} label="Notgroschen" scale={0.96 + resultIn * 0.04} />

      <div style={{position:'absolute',left:95,top:930,opacity:firstIn,color:ANIMATION_COLORS.money}}>
        <PhysicalTag material="money" style={{fontSize:22}}>MONAT 1</PhysicalTag>
      </div>
      <div style={{position:'absolute',left:330,top:930,opacity:secondIn,color:ANIMATION_COLORS.money}}>
        <PhysicalTag material="money" style={{fontSize:22}}>MONAT 2</PhysicalTag>
      </div>
      <div style={{position:'absolute',left:565,top:930,opacity:thirdIn,color:ANIMATION_COLORS.money}}>
        <PhysicalTag material="money" style={{fontSize:22}}>MONAT 3</PhysicalTag>
      </div>
      <div style={{position:'absolute',left:585,top:1040,opacity:resultIn,transform:`translateY(${(1-resultIn)*14}px)`,color:ANIMATION_COLORS.positive}}>
        <PhysicalTag material="positive" style={{fontSize:24}}>2–3 MONATSGEHÄLTER</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
