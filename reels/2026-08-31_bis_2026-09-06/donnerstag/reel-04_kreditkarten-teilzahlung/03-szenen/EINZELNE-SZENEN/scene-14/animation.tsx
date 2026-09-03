import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: single-purchase-spans-multiple-months
 * PRIMARY_ACTION: Dieselbe offene Kaufabrechnung bleibt physisch bestehen, während nacheinander mehrere Monatskalender erscheinen und die Belastung sichtbar in die Länge gezogen wird.
 * ANIMATION_NARRATIVE
 * START: Eine einzelne offene Kaufabrechnung liegt vor dem Kalender des ersten Monats.
 * MECHANISM: Monat zwei und Monat drei erscheinen nacheinander hinter derselben weiterhin offenen Abrechnung; ein kleiner Kostenstapel wächst mit der Zeit.
 * RESULT: Die ursprüngliche Abrechnung ist nach mehreren Monaten noch offen und ein Warnhinweis macht die lange Schuldenstrecke eindeutig.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Dieselbe unveränderte offene Kaufabrechnung bleibt über die gesamte Szene das Hauptmotiv.
 * SUPPORT: Drei Monatskalender und ein wachsender Münzstapel zeigen Dauer und zusätzliche Belastung.
 * MATERIAL: Rechnung neutral/warnend, Kalender ivory mit grünem Kopf, Kosten gold, Endwarnung rot-orange.
 * DEPTH: Abrechnung vorne zentral; Monatsseiten staffeln sich nach hinten; Kostenstapel wächst rechts vorne und schafft räumliche Trennung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene14Animation: React.FC<{durationFrames?:number}> = ({durationFrames=126}) => {
  const frame = useCurrentFrame();
  const billIn = interpolate(frame,[2,18],[0,1],clamp);
  const month2In = interpolate(frame,[24,54],[0,1],clamp);
  const month3In = interpolate(frame,[50,82],[0,1],clamp);
  const costGrow = interpolate(frame,[58,98],[0,1],clamp);
  const resultIn = interpolate(frame,[94,Math.max(102,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={60} y={575} month="MONAT 1" scale={0.60} opacity={billIn} rotate={-8}/>
    <PhysicalCalendarPage x={145} y={525} month="MONAT 2" scale={0.64} opacity={month2In} rotate={-2}/>
    <PhysicalCalendarPage x={230} y={475} month="MONAT 3" scale={0.68} opacity={month3In} rotate={4}/>
    <PhysicalBill x={430} y={500} amount="OFFEN" label="Ein Einkauf" rotate={-2} scale={0.98} opacity={billIn}/>
    <PhysicalCoinStack x={720} y={790-costGrow*85} count={Math.max(1,Math.round(1+costGrow*6))} scale={0.56+costGrow*0.20} opacity={costGrow}/>
    <div style={{position:'absolute',left:455,top:1010,opacity:resultIn,transform:`translateY(${(1-resultIn)*18}px)`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:26}}>MEHRERE MONATE OFFEN</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
