import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalReserveTank,
  PhysicalTag,
  PhysicalWasher,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: emergency-reserve-pays-real-bill
 * PRIMARY_ACTION: Eine echte Reparaturrechnung trifft den Haushalt; sichtbares Geld verlässt den Notgroschen, erreicht die Rechnung und bezahlt sie, während das Girokonto unangetastet bleibt.
 *
 * ANIMATION_NARRATIVE
 * START: Eine defekte Waschmaschine steht neben dem Girokonto; die unerwartete Reparaturrechnung fällt sichtbar in die Alltagssituation.
 * MECHANISM: Der Notgroschen wird aktiv, ein realer Geldstapel verlässt den Reservebehälter und bewegt sich zur Rechnung. Gleichzeitig sinkt der Reservestand kontrolliert.
 * RESULT: Die Rechnung trägt BEZAHLT, das Girokonto bleibt geschützt und der reduzierte Notgroschen bleibt als nachvollziehbarer Restbestand sichtbar.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Waschmaschine, Reparaturrechnung und die tatsächlich fließende Reserve erzählen eine konkrete Haushaltspanne statt einer abstrakten Finanzgrafik.
 * SUPPORT: Girokonto und ein kurzes GESCHÜTZT-Label bestätigen nur den Endzustand; die physische Geldbewegung trägt die Erklärung.
 * MATERIAL: Weiß/Grau für die Waschmaschine, Ivory für Papier, Gold für Reserve/Geld, Emerald für Schutz und Rot nur für Defekt bzw. offene Kosten.
 * DEPTH: Problem links, Rechnung mittig, Reserve rechts und Girokonto darunter bilden gestaffelte Tiefenebenen mit eindeutigem Bewegungsweg.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const billFall = interpolate(frame, [4, 34], [0, 1], clamp);
  const reserveWake = interpolate(frame, [20, 48], [0, 1], clamp);
  const moneyRelease = interpolate(frame, [42, 66], [0, 1], clamp);
  const moneyTravel = interpolate(frame, [58, 96], [0, 1], clamp);
  const billSettle = interpolate(frame, [82, resultStart], [0, 1], clamp);
  const accountProtect = interpolate(frame, [88, resultStart], [0, 1], clamp);
  const problemSettle = interpolate(frame, [0, 26, 60], [0.95, 1.04, 1], clamp);

  const billX = 350 - billSettle * 18;
  const billY = 390 + billFall * 280 - billSettle * 16;
  const reserveFill = 0.84 - moneyTravel * 0.22;
  const moneyX = 760 - moneyTravel * 300;
  const moneyY = 790 - moneyRelease * 30 - moneyTravel * 38;
  const moneyOpacity = Math.min(1, moneyRelease * 1.8) * (1 - billSettle * 0.78);

  return (
    <PremiumPhysicalStage>
      <PhysicalWasher x={65} y={620} broken scale={problemSettle} />

      <PhysicalBill
        x={billX}
        y={billY}
        label="Reparatur"
        amount="280 €"
        rotate={-8 + billSettle * 7}
        scale={0.82 - billSettle * 0.06}
        paid={billSettle > 0.62}
      />

      <PhysicalReserveTank
        x={720 - reserveWake * 12}
        y={590 - reserveWake * 14}
        width={255}
        height={370}
        fill={reserveFill}
        label="Notgroschen"
        scale={0.9 + reserveWake * 0.1}
        opacity={0.65 + reserveWake * 0.35}
      />

      <PhysicalCoinStack
        x={moneyX}
        y={moneyY}
        count={5}
        scale={0.76 - moneyTravel * 0.12}
        opacity={moneyOpacity}
      />

      <PhysicalAccount
        x={370}
        y={1040 - accountProtect * 22}
        label="Girokonto"
        balance={accountProtect > 0.55 ? 'unangetastet' : 'Alltag'}
        state={accountProtect > 0.55 ? 'protected' : 'normal'}
        scale={0.94 + accountProtect * 0.06}
      />

      <div style={{
        position: 'absolute',
        left: 725,
        top: 1025,
        opacity: accountProtect,
        transform: `translateY(${(1 - accountProtect) * 18}px)`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 25}}>GRIFFBEREIT</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
