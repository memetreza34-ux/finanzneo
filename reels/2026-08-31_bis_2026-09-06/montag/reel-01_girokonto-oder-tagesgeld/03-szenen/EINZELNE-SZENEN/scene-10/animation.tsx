import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: today-bill-uses-giro-future-money-stays
 * PRIMARY_ACTION: Eine heutige Alltagsausgabe wird aus dem Girokonto bezahlt, während die Tagesgeld-Rücklage physisch stehen bleibt und mit SPÄTER verknüpft wird.
 * ANIMATION_NARRATIVE
 * START: HEUTE steht beim Girokonto, SPÄTER beim Tagesgeld; beide Geldbereiche sind getrennt.
 * MECHANISM: Eine Einkaufsrechnung erscheint bei HEUTE, ein Geldstapel verlässt das Girokonto und bezahlt sie. Die Reserve rechts bleibt unverändert.
 * RESULT: Einkauf ist bezahlt; HEUTE/Giro und SPÄTER/Tagesgeld bleiben als zwei klare Aufgaben sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Konkrete heutige Zahlung links gegen sichtbar unangetastete Rücklage rechts.
 * SUPPORT: Kalenderblätter benennen nur den Zeitbezug.
 * MATERIAL: Ivory Kalender/Rechnung, Gold Geld, neutraler Girokörper, Emerald nur für abgeschlossene Zahlung und Reserve.
 * DEPTH: HEUTE links oben, Giro und Rechnung links unten; SPÄTER und Reserve rechts als stabile zweite Ebene.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene10Animation: React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame = useCurrentFrame();
  const calendars = interpolate(frame,[2,28],[0,1],clamp);
  const billIn = interpolate(frame,[28,60],[0,1],clamp);
  const pay = interpolate(frame,[58,108],[0,1],clamp);
  const reserveEmphasis = interpolate(frame,[88,126],[0,1],clamp);
  const result = interpolate(frame,[118,Math.max(130,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const payX = 330 - pay*145;
  const payY = 770 + pay*150;

  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={65} y={420-(1-calendars)*55} month="HEUTE" scale={0.72} opacity={calendars} />
    <PhysicalCalendarPage x={785} y={420-(1-calendars)*55} month="SPÄTER" scale={0.72} opacity={calendars} />
    <PhysicalAccount x={120} y={625} label="Girokonto" balance="Alltag" scale={0.96+pay*0.025} />
    <PhysicalBill x={45} y={905-(1-billIn)*70} label="Einkauf" amount="65 €" scale={0.67} opacity={billIn} paid={pay>0.7} />
    <PhysicalCoinStack x={payX} y={payY} count={3} scale={0.56} opacity={billIn*(1-pay*0.42)} />
    <PhysicalReserveTank x={720} y={600-reserveEmphasis*10} width={245} height={380} fill={0.72} label="Tagesgeld" scale={0.96+reserveEmphasis*0.04} />
    <div style={{position:'absolute',left:105,top:1035,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:23}}>BEZAHLT</PhysicalTag></div>
    <div style={{position:'absolute',left:745,top:1035,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:23}}>BLEIBT LIEGEN</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
