import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: new-purchase-adds-to-card-balance
 * PRIMARY_ACTION: Eine alte Restabrechnung und eine neue Kaufabrechnung bewegen sich nacheinander in denselben Kartensaldo und erhöhen ihn sichtbar.
 * ANIMATION_NARRATIVE
 * START: 500 Euro alter Rest und 120 Euro neuer Einkauf liegen als zwei getrennte Abrechnungen vor einem Kartensaldo.
 * MECHANISM: Zuerst wird der alte Rest, danach der neue Einkauf in denselben Kartensaldo gezogen; der Betrag springt erst auf 500 und dann auf 620 Euro.
 * RESULT: Der Kartensaldo steht sichtbar höher bei 620 Euro und bleibt als gewachsener offener Betrag stabil.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der zentrale Kartensaldo zeigt die direkte Summe alter und neuer Belastung.
 * SUPPORT: Zwei physische Abrechnungen liefern die konkreten Bestandteile des wachsenden Saldos.
 * MATERIAL: Alte Rechnung neutral/warnend, neuer Einkauf neutral, Kartensaldo rot-orange, Ergebnislabel warnend.
 * DEPTH: Beide Rechnungen starten links und rechts im Vordergrund und bewegen sich auf den zentralen tieferliegenden Kartensaldo zu.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=84}) => {
  const frame = useCurrentFrame();
  const oldMove = interpolate(frame,[8,36],[0,1],clamp);
  const newMove = interpolate(frame,[28,58],[0,1],clamp);
  const accountSettle = interpolate(frame,[52,68],[0,1],clamp);
  const resultIn = interpolate(frame,[62,Math.max(66,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const oldX = 70+oldMove*300;
  const oldY = 590+oldMove*35;
  const newX = 690-newMove*300;
  const newY = 600+newMove*35;
  const balance = newMove>0.62?'620 €':oldMove>0.62?'500 €':'0 €';
  return <PremiumPhysicalStage>
    <PhysicalBill x={oldX} y={oldY} amount="500 €" label="Alter Rest" rotate={-7+oldMove*5} scale={0.72-oldMove*0.10} opacity={1-oldMove*0.45}/>
    <PhysicalBill x={newX} y={newY} amount="120 €" label="Neuer Einkauf" rotate={7-newMove*5} scale={0.72-newMove*0.10} opacity={1-newMove*0.45}/>
    <PhysicalAccount x={385} y={520} label="Kartensaldo" balance={balance} state={balance==='0 €'?'normal':'danger'} scale={0.96+accountSettle*0.03}/>
    <div style={{position:'absolute',left:425,top:950,opacity:resultIn,transform:`translateY(${(1-resultIn)*16}px)`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:28}}>SALDO WÄCHST</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
