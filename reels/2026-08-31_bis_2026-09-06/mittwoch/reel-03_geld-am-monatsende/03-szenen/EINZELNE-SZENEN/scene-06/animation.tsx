import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: monthly-budget-splits-into-four-weeks
 * PRIMARY_ACTION: Ein Monatsbudget von 800 Euro wird sichtbar in vier gleich große Geldstapel auf vier Kalenderwochen verteilt.
 * ANIMATION_NARRATIVE
 * START: Ein Girokonto zeigt 800 € verfügbares Alltagsbudget.
 * MECHANISM: Vier Wochenkarten erscheinen; nacheinander wandern vier gleich große Geldstapel vom Monatsbudget zu Woche 1 bis Woche 4.
 * RESULT: Vier identische Wochenstapel bleiben stehen und 200 € / WOCHE wird klar sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die physische Aufteilung eines Monatsbetrags in vier Wochenbeträge.
 * SUPPORT: Vier Kalenderseiten geben jedem Stapel eine eindeutige Woche.
 * MATERIAL: Geld gold, Kalender ivory, Ergebnis grün, Konto neutral.
 * DEPTH: Konto zentral hinten, Wochenkarten in einer breiten Reihe, Geldstapel im Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene06Animation: React.FC<{durationFrames?:number}> = ({durationFrames=168}) => {
  const frame = useCurrentFrame();
  const weeksIn = interpolate(frame,[8,42],[0,1],clamp);
  const split1 = interpolate(frame,[38,72],[0,1],clamp);
  const split2 = interpolate(frame,[52,88],[0,1],clamp);
  const split3 = interpolate(frame,[66,104],[0,1],clamp);
  const split4 = interpolate(frame,[80,120],[0,1],clamp);
  const result = interpolate(frame,[116,Math.max(126,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const xs = [100,315,530,745];
  const moves = [split1,split2,split3,split4];
  return <PremiumPhysicalStage>
    <PhysicalAccount x={385} y={470} label="Monatsbudget" balance="800 €" state="normal" scale={1-result*0.04} />
    {xs.map((x,i)=><React.Fragment key={x}>
      <PhysicalCalendarPage x={x} y={735-(1-weeksIn)*55} month={`WOCHE ${i+1}`} scale={0.56} opacity={weeksIn} rotate={(i-1.5)*2.5} />
      <PhysicalCoinStack x={x+58} y={980-(1-moves[i])*120} count={4} scale={0.58} opacity={moves[i]} />
    </React.Fragment>)}
    <div style={{position:'absolute',left:400,top:1120,opacity:result,transform:`translateY(${(1-result)*15}px)`,color:ANIMATION_COLORS.focus}}><PhysicalTag material="positive" style={{fontSize:27}}>200 € / WOCHE</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
