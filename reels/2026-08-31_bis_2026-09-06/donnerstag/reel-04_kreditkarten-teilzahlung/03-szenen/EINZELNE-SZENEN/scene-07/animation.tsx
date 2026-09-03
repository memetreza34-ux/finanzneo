import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: partial-payment-leaves-principal
 * PRIMARY_ACTION: Eine kleine 100-Euro-Rückzahlung wird physisch auf eine 600-Euro-Kartenabrechnung angewendet und lässt sichtbar 500 Euro Rest zurück.
 * ANIMATION_NARRATIVE
 * START: Die Kartenabrechnung zeigt 600 Euro offen; ein kleiner Rückzahlungsstapel liegt getrennt daneben.
 * MECHANISM: Der 100-Euro-Stapel bewegt sich zur Abrechnung, während der sichtbare Kartenrest von 600 auf 500 Euro wechselt.
 * RESULT: 500 Euro bleiben offen und ein stabiler Rest-offen-Tag hält das Ergebnis fest.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die Kartenabrechnung mit ihrem sinkenden, aber nicht verschwindenden Restbetrag trägt die Aussage.
 * SUPPORT: Kleiner Rückzahlungsstapel und Kartensaldo verdeutlichen Teilzahlung und verbleibende Belastung.
 * MATERIAL: Rechnung neutral/warnend, Rückzahlung gold, offener Kartensaldo rot-orange, Ergebnislabel warnend.
 * DEPTH: Rechnung vorne zentral, Rückzahlung links vorne, Kartensaldo rechts hinten; Zahlung bewegt sich sichtbar in die Rechnung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene07Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const setupIn = interpolate(frame,[2,18],[0,1],clamp);
  const paymentMove = interpolate(frame,[22,72],[0,1],clamp);
  const restSettle = interpolate(frame,[66,94],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const paymentX = 90+paymentMove*245;
  const paymentY = 800-paymentMove*80;
  const remaining = restSettle>0.52?'500 €':'600 €';
  return <PremiumPhysicalStage>
    <PhysicalBill x={340} y={500} amount={remaining} label="Kartenabrechnung" rotate={-2} scale={0.97+restSettle*0.02} opacity={setupIn}/>
    <PhysicalCoinStack x={paymentX} y={paymentY} count={3} scale={0.64-paymentMove*0.08} opacity={setupIn*(1-paymentMove*0.45)}/>
    <PhysicalAccount x={650} y={550} label="Kartensaldo" balance={remaining} state="danger" scale={0.88} opacity={setupIn} tilt={3}/>
    <div style={{position:'absolute',left:315,top:1012,opacity:resultIn,transform:`translateY(${(1-resultIn)*18}px)`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:27}}>500 € REST OFFEN</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
