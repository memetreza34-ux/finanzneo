import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-arrives-before-budgeting
 * PRIMARY_ACTION: Ein echter Gehaltsstapel bewegt sich physisch zum Girokonto und setzt den sichtbaren Monatsbetrag auf 2.400 Euro.
 * ANIMATION_NARRATIVE
 * START: Monatskalender und leeres Girokonto warten auf den Zahlungseingang.
 * MECHANISM: Ein goldener Gehaltsstapel fährt von links zum Konto, wird aufgenommen und der Kontostand steigt sichtbar.
 * RESULT: Das Konto zeigt stabil 2.400 € und der Tag NETTO 2.400 € macht den verfügbaren Monatsbetrag eindeutig.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Girokonto und ankommender Gehaltsstapel tragen die Hauptaktion.
 * SUPPORT: Monatskalender verankert den Betrag zeitlich.
 * MATERIAL: Konto neutral, Geld gold, Ergebnis grün, Kalender ivory.
 * DEPTH: Kalender links hinten, Konto zentral, Geld bewegt sich aus dem Vordergrund zum Konto.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=162}) => {
  const frame = useCurrentFrame();
  const calendarIn = interpolate(frame,[4,24],[0,1],clamp);
  const salaryMove = interpolate(frame,[24,86],[0,1],clamp);
  const accountSettle = interpolate(frame,[72,110],[0,1],clamp);
  const result = interpolate(frame,[106,Math.max(116,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const coinX = 120 + salaryMove*330;
  const coinY = 780 - salaryMove*120;
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={70} y={510-(1-calendarIn)*70} month="MONAT" scale={0.72} opacity={calendarIn} rotate={-5} />
    <PhysicalAccount x={420} y={520} label="Girokonto" balance={accountSettle>0.55?'2.400 €':'0 €'} state="normal" scale={0.98+accountSettle*0.02} />
    <PhysicalCoinStack x={coinX} y={coinY} count={8} scale={0.78-salaryMove*0.08} opacity={1-salaryMove*0.42} />
    <div style={{position:'absolute',left:405,top:980,opacity:result,transform:`translateY(${(1-result)*18}px)`,color:ANIMATION_COLORS.focus}}><PhysicalTag material="positive" style={{fontSize:27}}>NETTO 2.400 €</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
