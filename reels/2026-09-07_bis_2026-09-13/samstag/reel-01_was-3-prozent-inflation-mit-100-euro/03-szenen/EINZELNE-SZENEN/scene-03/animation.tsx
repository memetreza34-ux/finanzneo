import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: shopping-price-baseline-settle
 * PRIMARY_ACTION: Ein realer Einkaufsbeleg erscheint, und ein sichtbarer 100-Euro-Geldbetrag bewegt sich dorthin, bis der heutige Einkauf vollständig bezahlt ist.
 * ANIMATION_NARRATIVE
 * START: Der Einkaufsbeleg mit 100 Euro Gesamtpreis kommt als konkreter Alltagsgegenstand in die Szene.
 * MECHANISM: Zwei sichtbare Geldstapel bewegen sich zum Beleg; die Zahlung erreicht den Rechnungsbetrag und der Beleg wechselt auf bezahlt.
 * RESULT: Der Einkauf ist vollständig gedeckt und die heutige Preis-Baseline von 100 Euro bleibt klar stehen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der reale Einkaufsbeleg und die Gold-Geldstapel tragen die Erklärung.
 * SUPPORT: Ein zweiter Geldstapel verstärkt den sichtbaren Zusammenhang zwischen Geldbetrag und Einkauf.
 * MATERIAL: Ivory für den Beleg, Gold für Geld und Emerald ausschließlich für den erfolgreich gedeckten Endzustand.
 * DEPTH: Beleg zentral vorne, Geld zunächst seitlich und danach räumlich nah am Beleg.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 90}) => {
  const frame = useCurrentFrame();
  const billIn = interpolate(frame, [2, 22], [0, 1], clamp);
  const moneyIn = interpolate(frame, [14, 42], [0, 1], clamp);
  const payment = interpolate(frame, [34, 61], [0, 1], clamp);
  const result = interpolate(frame, [58, Math.max(62, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const mainMoneyX = 88 + moneyIn * 272;
  const mainMoneyY = 820 - moneyIn * 128;
  const supportMoneyX = 760 - payment * 225;
  const supportMoneyY = 842 - payment * 115;

  return (
    <PremiumPhysicalStage>
      <PhysicalBill
        x={410}
        y={560 + (1 - billIn) * 70}
        label="Einkauf"
        amount="100 €"
        rotate={-3 + billIn * 3}
        scale={0.88 + billIn * 0.08}
        opacity={billIn}
        paid={payment > 0.72}
      />
      <PhysicalCoinStack
        x={mainMoneyX}
        y={mainMoneyY}
        count={6}
        scale={0.82 + payment * 0.08}
        opacity={moneyIn}
      />
      <PhysicalCoinStack
        x={supportMoneyX}
        y={supportMoneyY}
        count={3}
        scale={0.64}
        opacity={moneyIn * (1 - result * 0.35)}
      />
      <div
        style={{
          position: 'absolute',
          left: 392,
          top: 1010,
          opacity: result,
          transform: `translateY(${(1 - result) * 18}px)`,
          color: ANIMATION_COLORS.positive,
        }}
      >
        <PhysicalTag material="positive" style={{fontSize: 27}}>100 € HEUTE</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
