import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: monthly-fixed-transfer-builds-reserve
 * PRIMARY_ACTION: Drei aufeinanderfolgende Monatswechsel lösen jeweils denselben kleinen Geldstapel vom Girokonto und übertragen ihn automatisch in den Notgroschen.
 * ANIMATION_NARRATIVE
 * START: Girokonto und niedrige Reserve stehen bereit; der September-Kalender markiert den Beginn der Routine.
 * MECHANISM: SEP, OKT und NOV wechseln nacheinander; bei jedem Wechsel bewegt sich ein identisch großer Geldstapel vom Girokonto zur Reserve und erhöht deren Füllstand.
 * RESULT: Drei gleich große Transfers sind abgeschlossen und AUTO JEDEN MONAT bestätigt nur die sichtbare Routine.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Drei wiederholte identische Geldtransfers zwischen realem Girokonto und Notgroschen-Reservetank.
 * SUPPORT: Die Kalenderseiten geben der Wiederholung klare Monatszeitpunkte, ohne die Hauptmechanik zu ersetzen.
 * MATERIAL: Ivory Kalender und Konto, Gold für jeden festen Betrag, Emerald für die wachsende Reserve.
 * DEPTH: Kalender links hinten, Girokonto links vorne, Bewegungsweg durch die Mitte, Reserve rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {
  const frame = useCurrentFrame();
  const month1 = interpolate(frame,[0,20],[0,1],clamp);
  const transfer1 = interpolate(frame,[16,42],[0,1],clamp);
  const month2 = interpolate(frame,[38,56],[0,1],clamp);
  const transfer2 = interpolate(frame,[50,76],[0,1],clamp);
  const month3 = interpolate(frame,[72,90],[0,1],clamp);
  const transfer3 = interpolate(frame,[84,110],[0,1],clamp);
  const resultIn = interpolate(frame,[106,Math.max(114,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const fill = 0.18 + transfer1*0.16 + transfer2*0.16 + transfer3*0.16;

  const x1 = 325 + transfer1*390;
  const x2 = 325 + transfer2*390;
  const x3 = 325 + transfer3*390;

  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={45} y={430} month="SEP" amount="Monat 1" scale={0.78} opacity={Math.max(0.18,1-month2*0.72)} rotate={-5} />
    <PhysicalCalendarPage x={70} y={455} month="OKT" amount="Monat 2" scale={0.80} opacity={month2*(1-month3*0.72)} rotate={0} />
    <PhysicalCalendarPage x={95} y={480} month="NOV" amount="Monat 3" scale={0.82} opacity={month3} rotate={5} />
    <PhysicalAccount x={270} y={590} label="Girokonto" balance="fester Betrag" scale={0.96} />
    <PhysicalReserveTank x={755} y={520} width={230} height={410} fill={fill} label="Notgroschen" scale={0.98+resultIn*0.02} />

    <PhysicalCoinStack x={x1} y={760-transfer1*55} count={3} scale={0.50} opacity={month1*(1-transfer1*0.18)} />
    <PhysicalCoinStack x={x2} y={825-transfer2*55} count={3} scale={0.50} opacity={month2*(1-transfer2*0.18)} />
    <PhysicalCoinStack x={x3} y={890-transfer3*55} count={3} scale={0.50} opacity={month3*(1-transfer3*0.18)} />

    <div style={{position:'absolute',left:610,top:1035,opacity:resultIn,transform:`translateY(${(1-resultIn)*14}px)`,color:ANIMATION_COLORS.positive}}>
      <PhysicalTag material="positive" style={{fontSize:24}}>AUTO JEDEN MONAT</PhysicalTag>
    </div>
  </PremiumPhysicalStage>;
};
