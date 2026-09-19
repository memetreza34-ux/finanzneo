import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-arrives-fixed-share-moves-to-savings
 * PRIMARY_ACTION: Nach dem Gehaltseingang löst sich ein fester Geldstapel vom Girokonto und wandert automatisch in den Tagesgeld-Reservetank.
 * ANIMATION_NARRATIVE
 * START: Monatsanfang, Girokonto und Tagesgeld stehen getrennt bereit.
 * MECHANISM: Gehalt landet im Girokonto; danach trennt sich ein kleinerer Geldstapel und bewegt sich sichtbar in den Tagesgeldbehälter.
 * RESULT: Der Tagesgeld-Füllstand ist gestiegen und AUTO GETRENNT bestätigt nur das sichtbare Ergebnis.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Physische Trennung eines Geldstapels zwischen den beiden Konten.
 * SUPPORT: Monatsblatt macht den wiederkehrenden Ablauf konkret.
 * MATERIAL: Ivory Kalender, neutraler Girokörper, Gold Geld, Emerald für das erreichte Trenn-Ergebnis.
 * DEPTH: Kalender hinten links, Giro mittig links, Bewegungsweg durch die Mitte, Reserve rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=165}) => {
  const frame = useCurrentFrame();
  const monthIn = interpolate(frame,[2,24],[0,1],clamp);
  const salaryIn = interpolate(frame,[18,52],[0,1],clamp);
  const split = interpolate(frame,[52,78],[0,1],clamp);
  const transfer = interpolate(frame,[72,118],[0,1],clamp);
  const fill = 0.46 + transfer*0.20;
  const result = interpolate(frame,[112,Math.max(122,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const salaryX = 65 + salaryIn*285;
  const savingsX = 430 + transfer*330;
  const savingsY = 785 - split*35 - transfer*70;

  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={55} y={470-(1-monthIn)*55} month="MONAT" amount="Gehalt" scale={0.82} opacity={monthIn} rotate={-5+monthIn*5} />
    <PhysicalAccount x={300} y={625} label="Girokonto" balance="Gehalt" scale={0.96+salaryIn*0.04} />
    <PhysicalCoinStack x={salaryX} y={720-salaryIn*35} count={6} scale={0.68} opacity={1-split*0.68} />
    <PhysicalCoinStack x={savingsX} y={savingsY} count={4} scale={0.62} opacity={split} />
    <PhysicalReserveTank x={740} y={545} width={235} height={390} fill={fill} label="Tagesgeld" scale={0.97+transfer*0.03} />
    <div style={{position:'absolute',left:650,top:1015,opacity:result,transform:`translateY(${(1-result)*14}px)`,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:24}}>AUTO GETRENNT</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
