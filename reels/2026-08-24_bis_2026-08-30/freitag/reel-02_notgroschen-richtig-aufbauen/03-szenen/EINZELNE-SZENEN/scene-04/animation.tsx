import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalReserveTank,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: buffer-intercepts-before-overdraft
 * PRIMARY_ACTION: Eine offene Rechnung läuft sichtbar auf Girokonto und Dispo zu; der Notgroschen fährt dazwischen, gibt Geld frei und stoppt die Belastung vor dem Dispo.
 *
 * ANIMATION_NARRATIVE
 * START: Eine konkrete Rechnung nähert sich einem knappen Girokonto; darunter ist der rote Dispo als nächste Konsequenz sichtbar.
 * MECHANISM: Der Notgroschen fährt physisch in den Zahlungsweg, ein Geldstapel verlässt die Reserve und erreicht die Rechnung, bevor sie das Girokonto belastet.
 * RESULT: Die Rechnung ist bezahlt, der Dispo fällt aus der Szene und das Girokonto wechselt in den geschützten Zustand.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Rechnung, Notgroschen und echte Geldbewegung bilden einen klaren Abfangmoment statt einer Karten- oder Pfeilgrafik.
 * SUPPORT: Girokonto und DISPO zeigen nur Ausgangsrisiko und Ergebnis. Der Zuschauer erkennt die vermiedene Verschuldung auch ohne Text.
 * MATERIAL: Ivory für Rechnung/Konto, Gold für Reserve und transferiertes Geld, Emerald für Schutz und Rot ausschließlich für Dispo/Schuldenrisiko.
 * DEPTH: Rechnung kommt von links vorne, Reserve steigt aus der unteren Mitte hoch, Geld kreuzt den Weg zur Rechnung und das Konto bleibt rechts als Zielpunkt sichtbar.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene04Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const billApproach = interpolate(frame, [4, 54], [0, 1], clamp);
  const bufferRise = interpolate(frame, [34, 68], [0, 1], clamp);
  const moneyRelease = interpolate(frame, [56, 74], [0, 1], clamp);
  const moneyTravel = interpolate(frame, [68, 96], [0, 1], clamp);
  const billPaid = interpolate(frame, [86, resultStart], [0, 1], clamp);
  const debtRetreat = interpolate(frame, [82, resultStart], [0, 1], clamp);
  const accountRecover = interpolate(frame, [88, resultStart], [0, 1], clamp);

  const billX = 55 + billApproach * 350 - billPaid * 10;
  const billY = 590 + billApproach * 88 - billPaid * 18;
  const reserveY = 930 - bufferRise * 270;
  const reserveFill = 0.78 - moneyTravel * 0.19;
  const moneyX = 560 - moneyTravel * 130;
  const moneyY = reserveY + 95 - moneyRelease * 26 - moneyTravel * 22;
  const moneyOpacity = Math.min(1, moneyRelease * 2) * (1 - billPaid * 0.72);

  return (
    <PremiumPhysicalStage>
      <PhysicalBill
        x={billX}
        y={billY}
        label="Rechnung"
        amount="420 €"
        rotate={-9 + billApproach * 8 + billPaid * 2}
        scale={0.79 - billPaid * 0.07}
        paid={billPaid > 0.58}
      />

      <PhysicalReserveTank
        x={455}
        y={reserveY}
        width={255}
        height={360}
        fill={reserveFill}
        label="Notgroschen"
        scale={0.9 + bufferRise * 0.1}
      />

      <PhysicalCoinStack
        x={moneyX}
        y={moneyY}
        count={5}
        scale={0.74 - moneyTravel * 0.12}
        opacity={moneyOpacity}
      />

      <PhysicalAccount
        x={750}
        y={650 - accountRecover * 16}
        label="Girokonto"
        balance={accountRecover > 0.55 ? 'geschützt' : 'knapp'}
        state={accountRecover > 0.55 ? 'protected' : 'danger'}
        scale={0.95 + accountRecover * 0.05}
        tilt={accountRecover > 0.55 ? 0 : 4}
      />

      <div style={{
        position: 'absolute',
        left: 805,
        top: 935 + debtRetreat * 165,
        opacity: 1 - debtRetreat,
        transform: `scale(${1 - debtRetreat * 0.18})`,
        color: ANIMATION_COLORS.warning,
      }}>
        <PhysicalTag material="warning" style={{fontSize: 28}}>DISPO</PhysicalTag>
      </div>

      <div style={{
        position: 'absolute',
        left: 755,
        top: 970,
        opacity: accountRecover,
        transform: `translateY(${(1 - accountRecover) * 18}px)`,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 25}}>SCHULDEN VERMIEDEN</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
