import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: giro-salary-in-daily-payments-out
 * PRIMARY_ACTION: Gehalt landet physisch im Girokonto; danach verlassen zwei sichtbare Geldstapel das Konto und bezahlen Miete und Einkauf.
 * ANIMATION_NARRATIVE
 * START: Das Girokonto steht als Alltagskonto bereit, Gehalt nähert sich von links.
 * MECHANISM: Gehalt landet im Konto; Miete und Einkauf erscheinen; zwei getrennte Geldstapel bewegen sich zu den Ausgaben.
 * RESULT: Beide Alltagsausgaben sind bezahlt und das Girokonto bleibt als aktiver Zahlungsort sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Girokonto und reale Geldbewegung tragen die Erklärung.
 * SUPPORT: Miete und Einkauf zeigen konkrete Alltagsausgaben.
 * MATERIAL: Neutraler Kontokörper, Gold für Geld, Ivory für Rechnungen, Emerald nur für bezahlte Resultate.
 * DEPTH: Gehalt links vorne, Girokonto zentral, Ausgaben links/rechts tiefer im Raum.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=150}) => {
  const frame = useCurrentFrame();
  const salaryIn = interpolate(frame,[4,38],[0,1],clamp);
  const billsIn = interpolate(frame,[30,58],[0,1],clamp);
  const rentPay = interpolate(frame,[58,96],[0,1],clamp);
  const shopPay = interpolate(frame,[68,106],[0,1],clamp);
  const result = interpolate(frame,[104,Math.max(112,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const salaryX = 40 + salaryIn*360;
  const salaryY = 650 - salaryIn*55;
  const rentX = 435 - rentPay*255;
  const rentY = 760 + rentPay*165;
  const shopX = 510 + shopPay*265;
  const shopY = 760 + shopPay*165;

  return <PremiumPhysicalStage>
    <PhysicalAccount x={385} y={560} label="Girokonto" balance={result>0.55?'Alltag':'Gehalt'} state={result>0.55?'protected':'normal'} scale={0.96+salaryIn*0.04} />
    <PhysicalCoinStack x={salaryX} y={salaryY} count={6} scale={0.82-salaryIn*0.08} opacity={1-result*0.72} />
    <PhysicalBill x={65} y={845-(1-billsIn)*85} label="Miete" amount="900 €" scale={0.72} opacity={billsIn} paid={rentPay>0.72} />
    <PhysicalBill x={745} y={845-(1-billsIn)*65} label="Einkauf" amount="120 €" rotate={6} scale={0.72} opacity={billsIn} paid={shopPay>0.72} />
    <PhysicalCoinStack x={rentX} y={rentY} count={4} scale={0.62} opacity={billsIn*(1-rentPay*0.42)} />
    <PhysicalCoinStack x={shopX} y={shopY} count={3} scale={0.58} opacity={billsIn*(1-shopPay*0.42)} />
    <div style={{position:'absolute',left:420,top:1030,opacity:result,transform:`translateY(${(1-result)*14}px)`,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:25}}>ALLTAG</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
