import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: spend-more-than-balance-creates-overdraft
 * PRIMARY_ACTION: Ein 100-Euro-Girokonto bezahlt sichtbar einen 130-Euro-Einkauf und kippt dadurch auf minus 30 Euro.
 * ANIMATION_NARRATIVE
 * START: Girokonto zeigt 100 €, Geldstapel liegt verfügbar daneben.
 * MECHANISM: 130-€-Einkaufsrechnung erscheint; Geld bewegt sich zur Rechnung; die Zahlung übersteigt das Guthaben.
 * RESULT: Konto wechselt sichtbar auf -30 € und Warnzustand.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Girokonto und 130-€-Rechnung tragen die Ursache/Wirkung.
 * SUPPORT: Geldstapel macht den Abfluss physisch sichtbar.
 * MATERIAL: Neutral für Konto, Ivory für Rechnung, Gold für Geld, Rot nur für Minus.
 * DEPTH: Konto zentral hinten, Rechnung rechts vorne, Geld bewegt sich dazwischen.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=174}) => {
  const frame = useCurrentFrame();
  const billIn = interpolate(frame,[20,55],[0,1],clamp);
  const payment = interpolate(frame,[48,112],[0,1],clamp);
  const deficit = interpolate(frame,[96,132],[0,1],clamp);
  const result = interpolate(frame,[128,Math.max(136,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const coinX = 285 + payment*360;
  const coinY = 790 + payment*60;
  return <PremiumPhysicalStage>
    <PhysicalAccount x={350} y={520} label="Girokonto" balance={deficit>0.55?'−30 €':'100 €'} state={deficit>0.55?'danger':'normal'} scale={1-deficit*0.035} tilt={deficit*2.5} />
    <PhysicalCoinStack x={coinX} y={coinY} count={5} scale={0.72-payment*0.08} opacity={1-payment*0.58} />
    <PhysicalBill x={690} y={690-(1-billIn)*90} label="Einkauf" amount="130 €" rotate={5} scale={0.76} opacity={billIn} paid={payment>0.78} />
    <div style={{position:'absolute',left:405,top:950,opacity:result,transform:`translateY(${(1-result)*18}px)`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:27}}>MINUS 30 €</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
