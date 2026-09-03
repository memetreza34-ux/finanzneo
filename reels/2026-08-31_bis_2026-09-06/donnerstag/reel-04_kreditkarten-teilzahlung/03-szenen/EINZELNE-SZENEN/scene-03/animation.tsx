import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: full-payment-clears-statement
 * PRIMARY_ACTION: Der vollständige offene Kartenbetrag bewegt sich physisch vom Girokonto zur Kreditkartenabrechnung und setzt sie sichtbar auf bezahlt.
 * ANIMATION_NARRATIVE
 * START: Eine offene 600-Euro-Kartenabrechnung steht neben dem Girokonto; der Abrechnungstermin ist sichtbar.
 * MECHANISM: Ein vollständiger Geldstapel bewegt sich vom Girokonto zur Abrechnung, während der offene Status verschwindet.
 * RESULT: Die Kartenabrechnung ist vollständig bezahlt und ein grüner Vollzahlung-Tag bleibt stabil sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Offene Kartenabrechnung und Girokonto tragen die zentrale Ausgleichsbewegung.
 * SUPPORT: Kalenderseite und Geldstapel verankern Abrechnungstermin und vollständige Zahlung.
 * MATERIAL: Rechnung neutral mit rotem offenen Betrag, Geld gold, Ergebnis grün, Kalender ivory.
 * DEPTH: Kalender hinten links, Girokonto rechts, Rechnung zentral vorne, Geld bewegt sich aus der rechten Tiefe zur Rechnung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const calendarIn = interpolate(frame,[2,20],[0,1],clamp);
  const paymentMove = interpolate(frame,[20,76],[0,1],clamp);
  const billSettle = interpolate(frame,[68,96],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const coinsX = 620-paymentMove*265;
  const coinsY = 760-paymentMove*55;
  const paid = billSettle>0.58;
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={70} y={505-(1-calendarIn)*50} month="ABRECHNUNG" scale={0.70} opacity={calendarIn} rotate={-5}/>
    <PhysicalAccount x={590} y={500} label="Girokonto" balance={paid?'abgebucht':'bereit'} state={paid?'normal':'protected'} scale={0.92}/>
    <PhysicalBill x={300} y={510} amount={paid?'0 €':'600 €'} label="Kartenabrechnung" paid={paid} scale={0.96+billSettle*0.03} rotate={-2}/>
    <PhysicalCoinStack x={coinsX} y={coinsY} count={7} scale={0.76-paymentMove*0.12} opacity={1-paymentMove*0.58}/>
    <div style={{position:'absolute',left:405,top:1010,opacity:resultIn,transform:`translateY(${(1-resultIn)*18}px)`,color:ANIMATION_COLORS.focus}}><PhysicalTag material="positive" style={{fontSize:27}}>VOLLZAHLUNG</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
