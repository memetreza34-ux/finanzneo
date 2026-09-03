import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: interest-accrues-on-open-balance
 * PRIMARY_ACTION: Eine offene Restabrechnung bleibt liegen, während der nächste Monat sichtbar einrückt und daneben ein zusätzlicher Kostenstapel anwächst.
 * ANIMATION_NARRATIVE
 * START: Eine offene 500-Euro-Restabrechnung liegt vor dem aktuellen Monatskalender; zusätzliche Kosten sind noch nicht sichtbar.
 * MECHANISM: Eine neue Kalenderseite rückt ein, die Restabrechnung bleibt unverändert offen und ein weiterer Geldstapel baut sich daneben auf.
 * RESULT: Der offene Rest besteht weiter und ein klarer Kosten-Tag macht mögliche Zinsen auf den Rest sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die unverändert offene Restabrechnung ist das stabile Hauptobjekt.
 * SUPPORT: Zwei Kalenderseiten und der wachsende Münzstapel zeigen Zeitablauf und zusätzliche Kosten.
 * MATERIAL: Rechnung neutral mit Warnbetrag, Kalender ivory/grün, Kostenstapel gold, Warnhinweis rot-orange.
 * DEPTH: Alte Kalenderseite hinten links, neue Seite gleitet dahinter ein, Rechnung vorne zentral, Kosten wachsen rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene05Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const billIn = interpolate(frame,[2,18],[0,1],clamp);
  const monthShift = interpolate(frame,[24,72],[0,1],clamp);
  const costGrow = interpolate(frame,[52,96],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={70} y={520} month="MONAT 1" scale={0.67} opacity={billIn*(1-monthShift*0.30)} rotate={-7}/>
    <PhysicalCalendarPage x={120+monthShift*90} y={555-monthShift*85} month="MONAT 2" scale={0.72} opacity={monthShift} rotate={4}/>
    <PhysicalBill x={350} y={500} amount="500 €" label="Rest offen" rotate={-2} scale={0.96+(1-billIn)*0.02} opacity={billIn}/>
    <PhysicalCoinStack x={700} y={770-costGrow*70} count={Math.max(1,Math.round(1+costGrow*5))} scale={0.58+costGrow*0.18} opacity={costGrow}/>
    <div style={{position:'absolute',left:655,top:1010,opacity:resultIn,transform:`translateY(${(1-resultIn)*18}px)`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:26}}>ZINSEN MÖGLICH</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
