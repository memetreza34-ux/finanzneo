import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalBill,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: inflation-calendar-price-reprice
 * PRIMARY_ACTION: Ein sichtbarer Jahressprung im Kalender löst die Neubepreisung desselben Einkaufs von 100 auf 103 Euro aus, während zusätzliches Geld zum Beleg rückt.
 * ANIMATION_NARRATIVE
 * START: Der bekannte Einkaufsbeleg steht bei 100 Euro und ein Kalender markiert den Ausgangszeitpunkt.
 * MECHANISM: Der Kalender wechselt sichtbar auf Jahr 1; gleichzeitig verändert sich der Beleg auf 103 Euro und ein zusätzlicher Geldstapel wird für denselben Einkauf nötig.
 * RESULT: Der Einkauf kostet nach einem Jahr 103 Euro und der Drei-Prozent-Schritt ist als Ursache klar lesbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Kalender und realer Einkaufsbeleg zeigen Zeit und Preisänderung als konkrete Ursache-Wirkungs-Kette.
 * SUPPORT: Goldene Münzen machen sichtbar, dass für dieselben Waren mehr nominales Geld nötig ist.
 * MATERIAL: Ivory für Papier und Kalender, Gold für Geld, Warm Red-Orange für Preisbelastung und Emerald nur für neutrale Orientierung.
 * DEPTH: Kalender links vorne, Beleg zentral, Zusatzgeld rechts und anschließend näher am Beleg.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene04Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const calendarIn = interpolate(frame, [3, 28], [0, 1], clamp);
  const priceRise = interpolate(frame, [34, 84], [0, 1], clamp);
  const extraMoney = interpolate(frame, [58, 104], [0, 1], clamp);
  const result = interpolate(frame, [96, Math.max(108, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const amount = priceRise < 0.45 ? '100 €' : priceRise < 0.82 ? '101 €' : '103 €';
  const coinX = 735 - extraMoney * 175;
  const coinY = 825 - extraMoney * 100;

  return (
    <PremiumPhysicalStage>
      <PhysicalCalendarPage
        x={92}
        y={610 - calendarIn * 28}
        month={priceRise < 0.2 ? 'HEUTE' : 'JAHR 1'}
        amount={priceRise < 0.2 ? '100 €' : '+3 %'}
        scale={0.82 + calendarIn * 0.12}
        opacity={calendarIn}
        rotate={-5 + priceRise * 7}
      />
      <PhysicalBill
        x={405}
        y={565}
        label="Derselbe Einkauf"
        amount={amount}
        rotate={priceRise * 2}
        scale={0.94 + result * 0.04}
        opacity={1}
        paid={false}
      />
      <PhysicalCoinStack x={540} y={848} count={5} scale={0.65} opacity={0.72} />
      <PhysicalCoinStack
        x={coinX}
        y={coinY}
        count={2}
        scale={0.56 + extraMoney * 0.08}
        opacity={extraMoney}
      />
      <div
        style={{
          position: 'absolute',
          left: 430,
          top: 1010,
          opacity: result,
          color: ANIMATION_COLORS.warning,
          transform: `translateY(${(1 - result) * 16}px)`,
        }}
      >
        <PhysicalTag material="warning" style={{fontSize: 28}}>+3 % → 103 €</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
