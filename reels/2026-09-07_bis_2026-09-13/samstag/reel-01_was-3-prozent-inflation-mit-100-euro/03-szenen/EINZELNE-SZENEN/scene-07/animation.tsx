import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: purchasing-power-present-value-compression
 * PRIMARY_ACTION: Der Kontostand bleibt physisch bei 100 Euro, während ein Zehn-Jahres-Schritt den sichtbaren heutigen Kaufkraft-Gegenwert des gleichen Geldes auf rund 74 Euro reduziert.
 * ANIMATION_NARRATIVE
 * START: Konto und voller Geldstapel zeigen denselben nominalen Betrag von 100 Euro.
 * MECHANISM: Ein Zehn-Jahres-Kalender erscheint; der Kontostand bleibt unverändert, aber der volle Geldstapel verliert sichtbar Volumen und der Kaufkraft-Beleg wechselt auf 74 Euro.
 * RESULT: 100 Euro nominal stehen gleichzeitig neben rund 74 Euro heutiger Kaufkraft und machen den Unterschied eindeutig.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das unveränderte Konto und der sichtbar kleiner werdende Geldgegenwert tragen die Erklärung.
 * SUPPORT: Kalender und Kaufkraft-Beleg geben Zeitbezug und konkrete Endzahl.
 * MATERIAL: Neutral-Emerald für das stabile Konto, Gold für Geldwert, Ivory für den Beleg und Warm Red-Orange für Kaufkraftverlust.
 * DEPTH: Konto links vorne, Geldstapel mittig, Kaufkraft-Beleg rechts; Kalender leicht dahinter als Zeitauslöser.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene07Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 135}) => {
  const frame = useCurrentFrame();
  const accountIn = interpolate(frame, [2, 24], [0, 1], clamp);
  const yearsIn = interpolate(frame, [20, 54], [0, 1], clamp);
  const powerDrop = interpolate(frame, [47, 92], [0, 1], clamp);
  const result = interpolate(frame, [88, Math.max(96, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const fullOpacity = 1 - powerDrop;
  const reducedOpacity = powerDrop;
  const purchasingAmount = powerDrop < 0.45 ? '100 €' : powerDrop < 0.82 ? '86 €' : '74 €';

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={72}
        y={600}
        label="Kontostand"
        balance="100 €"
        state="protected"
        scale={0.9 + accountIn * 0.08}
        opacity={accountIn}
      />
      <PhysicalCalendarPage
        x={430}
        y={850 - yearsIn * 65}
        month="JAHR 10"
        amount="3 % p.a."
        scale={0.68 + yearsIn * 0.1}
        opacity={yearsIn}
        rotate={3}
      />
      <PhysicalCoinStack x={410} y={610} count={7} scale={0.76} opacity={fullOpacity} />
      <PhysicalCoinStack x={455} y={675} count={4} scale={0.68} opacity={reducedOpacity} />
      <PhysicalBill
        x={720}
        y={595}
        label="Heutige Kaufkraft"
        amount={purchasingAmount}
        rotate={4}
        scale={0.78 + result * 0.04}
        opacity={yearsIn}
        paid={false}
      />
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 1050,
          opacity: result,
          color: ANIMATION_COLORS.warning,
          transform: `translateY(${(1 - result) * 16}px)`,
        }}
      >
        <PhysicalTag material="warning" style={{fontSize: 26}}>100 € → ca. 74 € KAUFKRAFT</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
