import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: small-purchases-accumulate-into-visible-cost
 * PRIMARY_ACTION: Vier kleine Alltagskäufe erscheinen nacheinander, ziehen sichtbar Geld aus dem Konto und addieren sich zu 44 Euro Monatskosten.
 * ANIMATION_NARRATIVE
 * START: Ein Konto zeigt 100 € frei verfügbares Geld.
 * MECHANISM: Kaffee, Snack, Lieferung und kleiner Einkauf erscheinen zeitversetzt; mit jedem Kauf wandern Münzen aus dem Konto und der Rest schrumpft.
 * RESULT: Das Konto steht bei 56 € und der Ergebnis-Tag 44 € WEG zeigt die Summe der kleinen Käufe.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Konto plus nacheinander eintreffende kleine Rechnungen zeigen Ursache und Wirkung.
 * SUPPORT: Bewegter Geldstapel macht jeden Abfluss physisch sichtbar.
 * MATERIAL: Konto neutral, Rechnungen ivory, Geld gold, Warn-Ergebnis rot-orange.
 * DEPTH: Konto links, Rechnungen gestaffelt rechts, Geld bewegt sich dazwischen im Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 26;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=174}) => {
  const frame = useCurrentFrame();
  const coffee = interpolate(frame,[8,32],[0,1],clamp);
  const snack = interpolate(frame,[28,54],[0,1],clamp);
  const delivery = interpolate(frame,[50,80],[0,1],clamp);
  const shop = interpolate(frame,[74,108],[0,1],clamp);
  const drain = interpolate(frame,[24,120],[0,1],clamp);
  const result = interpolate(frame,[116,Math.max(126,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalAccount x={250} y={520} label="Alltagsgeld" balance={drain>0.82?'56 €':drain>0.55?'75 €':drain>0.25?'93 €':'100 €'} state={result>0.5?'warning':'normal'} scale={1-drain*0.035} />
    <PhysicalCoinStack x={430+drain*180} y={820+drain*45} count={5} scale={0.68-drain*0.08} opacity={1-drain*0.52} />
    <PhysicalBill x={650} y={500-(1-coffee)*55} label="Kaffee" amount="4 €" rotate={-6} scale={0.55} opacity={coffee} paid={drain>0.22} />
    <PhysicalBill x={765} y={650-(1-snack)*55} label="Snack" amount="3 €" rotate={5} scale={0.55} opacity={snack} paid={drain>0.42} />
    <PhysicalBill x={640} y={820-(1-delivery)*55} label="Lieferung" amount="12 €" rotate={-3} scale={0.55} opacity={delivery} paid={drain>0.64} />
    <PhysicalBill x={770} y={960-(1-shop)*55} label="Spontankauf" amount="25 €" rotate={6} scale={0.55} opacity={shop} paid={drain>0.82} />
    <div style={{position:'absolute',left:285,top:1070,opacity:result,transform:`translateY(${(1-result)*16}px)`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:28}}>44 € WEG</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
