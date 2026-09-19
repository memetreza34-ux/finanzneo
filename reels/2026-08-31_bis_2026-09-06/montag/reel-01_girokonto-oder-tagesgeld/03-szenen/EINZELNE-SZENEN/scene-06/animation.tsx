import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: daily-spending-moves-giro-reserve-stays
 * PRIMARY_ACTION: Eine konkrete Alltagsrechnung zieht Geld aus dem Girokonto, während die getrennte Tagesgeld-Rücklage sichtbar stabil bleibt.
 * ANIMATION_NARRATIVE
 * START: Girokonto links und Tagesgeld rechts stehen getrennt bereit.
 * MECHANISM: Gehalt stärkt kurz das Girokonto; eine Alltagsrechnung erscheint und zieht einen Geldstapel aus dem Girokonto. Die Reserve rechts bewegt sich nicht mit.
 * RESULT: Links steht ALLTAG, rechts RÜCKLAGE; der Unterschied ist körperlich sichtbar statt nur beschriftet.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das belastete Girokonto und der stabile Reservebehälter bilden den klaren Kontrast.
 * SUPPORT: Eine reale Alltagsrechnung zeigt, warum sich Geld links bewegt.
 * MATERIAL: Neutral/Gold links, Emerald/Gold rechts, Warnfarbe nur an der offenen Rechnung.
 * DEPTH: Giro und Rechnung links vorne, Reserve rechts leicht zurückgesetzt.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {
  const frame = useCurrentFrame();
  const salary = interpolate(frame,[4,30],[0,1],clamp);
  const billIn = interpolate(frame,[26,52],[0,1],clamp);
  const payment = interpolate(frame,[50,88],[0,1],clamp);
  const reserveSettle = interpolate(frame,[70,98],[0,1],clamp);
  const result = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const inX = 30 + salary*230;
  const outX = 300 - payment*145;
  const outY = 760 + payment*135;

  return <PremiumPhysicalStage>
    <PhysicalAccount x={145} y={585} label="Girokonto" balance={payment>0.7?'Alltag':'Gehalt'} scale={0.96+salary*0.04-payment*0.025} />
    <PhysicalCoinStack x={inX} y={690-salary*45} count={5} scale={0.65} opacity={1-payment*0.75} />
    <PhysicalBill x={35} y={875-(1-billIn)*70} label="Einkauf" amount="75 €" scale={0.68} opacity={billIn} paid={payment>0.7} />
    <PhysicalCoinStack x={outX} y={outY} count={3} scale={0.55} opacity={billIn*(1-payment*0.45)} />
    <PhysicalReserveTank x={690} y={555-reserveSettle*8} width={250} height={380} fill={0.72} label="Tagesgeld" scale={0.96+reserveSettle*0.04} />
    <div style={{position:'absolute',left:180,top:1025,opacity:result,color:ANIMATION_COLORS.secondaryText}}><PhysicalTag style={{fontSize:24}}>ALLTAG</PhysicalTag></div>
    <div style={{position:'absolute',left:735,top:1025,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:24}}>RÜCKLAGE</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
