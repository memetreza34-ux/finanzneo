import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: overdraft-time-adds-interest-cost
 * PRIMARY_ACTION: Ein dauerhaft negatives Girokonto bleibt stehen, während mehrere Monatsblätter wechseln und ein sichtbarer Zinskosten-Stapel wächst.
 * ANIMATION_NARRATIVE
 * START: Girokonto steht bei -30 €.
 * MECHANISM: Monatsblätter erscheinen nacheinander; mit vergehender Zeit wächst ein separater Geld-/Kostenstapel.
 * RESULT: Das Konto ist weiter negativ und ZEIT KOSTET bleibt sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Negatives Girokonto plus vergehende Monate.
 * SUPPORT: Wachsender Kostenstapel zeigt die Zinsfolge.
 * MATERIAL: Rot für Minus, Ivory für Kalender, Gold als Geldwert, Warnfarbe für Ergebnis.
 * DEPTH: Konto zentral, Kalender gestaffelt links, Kostenstapel rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene05Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {
  const frame = useCurrentFrame();
  const month1 = interpolate(frame,[10,30],[0,1],clamp);
  const month2 = interpolate(frame,[32,58],[0,1],clamp);
  const month3 = interpolate(frame,[60,84],[0,1],clamp);
  const costGrow = interpolate(frame,[36,98],[0,1],clamp);
  const result = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalAccount x={385} y={560} label="Girokonto" balance="−30 €" state="danger" scale={0.98+result*0.02} />
    <PhysicalCalendarPage x={45} y={700-(1-month1)*70} month="MONAT 1" scale={0.64} opacity={month1} rotate={-6} />
    <PhysicalCalendarPage x={115} y={760-(1-month2)*70} month="MONAT 2" scale={0.64} opacity={month2} rotate={0} />
    <PhysicalCalendarPage x={185} y={820-(1-month3)*70} month="MONAT 3" scale={0.64} opacity={month3} rotate={6} />
    <PhysicalCoinStack x={760} y={780-costGrow*95} count={Math.max(2,Math.round(2+costGrow*5))} scale={0.62+costGrow*0.12} opacity={0.35+costGrow*0.65} />
    <div style={{position:'absolute',left:705,top:1000,opacity:result,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:27}}>ZEIT KOSTET</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
