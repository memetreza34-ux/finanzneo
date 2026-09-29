import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PhysicalWasher, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: emergency-fund-prevents-long-overdraft
 * PRIMARY_ACTION: Eine kaputte Waschmaschine erzeugt eine Reparaturrechnung, die sichtbar aus dem Notgroschen statt aus einem neuen Minus bezahlt wird.
 * ANIMATION_NARRATIVE
 * START: Waschmaschine fällt aus; Girokonto steht stabil bereit.
 * MECHANISM: Reparaturrechnung erscheint; Notgroschen öffnet Geld; Geldstapel bewegt sich zur Rechnung.
 * RESULT: Rechnung ist bezahlt und Girokonto bleibt geschützt außerhalb des Minus.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Waschmaschine, Reparaturrechnung und Reserve bilden eine reale Notfallsituation.
 * SUPPORT: Girokonto zeigt das vermiedene Minus.
 * MATERIAL: Ivory Maschine/Rechnung, Gold Reserve/Geld, Emerald für geschützten Ausgang.
 * DEPTH: Maschine links hinten, Rechnung Mitte vorne, Reserve rechts, Girokonto unten mittig.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene12Animation: React.FC<{durationFrames?:number}> = ({durationFrames=156}) => {
  const frame = useCurrentFrame();
  const emergency = interpolate(frame,[8,36],[0,1],clamp);
  const billIn = interpolate(frame,[26,58],[0,1],clamp);
  const pay = interpolate(frame,[54,112],[0,1],clamp);
  const protect = interpolate(frame,[104,132],[0,1],clamp);
  const result = interpolate(frame,[128,Math.max(136,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const coinX = 720 - pay*300;
  const coinY = 760 + pay*35;
  return <PremiumPhysicalStage>
    <PhysicalWasher x={40} y={520+(1-emergency)*55} broken scale={0.82} opacity={emergency} />
    <PhysicalBill x={360} y={670-(1-billIn)*90} label="Reparatur" amount="280 €" scale={0.72} opacity={billIn} paid={pay>0.78} />
    <PhysicalReserveTank x={760} y={500} width={220} height={340} fill={0.72-pay*0.24} label="Notgroschen" scale={0.94+pay*0.06} />
    <PhysicalCoinStack x={coinX} y={coinY} count={4} scale={0.58} opacity={billIn*(1-pay*0.32)} />
    <PhysicalAccount x={390} y={990} label="Girokonto" balance="geschützt" state="protected" scale={0.88+protect*0.05} opacity={0.55+protect*0.45} />
    <div style={{position:'absolute',left:685,top:1000,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:25}}>KEIN DAUER-MINUS</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
