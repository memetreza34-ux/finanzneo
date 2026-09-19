import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-splits-into-separate-reserve
 * PRIMARY_ACTION: Gehalt landet zuerst sichtbar auf dem Girokonto; danach trennt sich ein eigener Teil davon und wandert physisch auf das Tagesgeld, während spätere Alltagskosten ausschließlich beim Girokonto bleiben.
 *
 * ANIMATION_NARRATIVE
 * START: Girokonto und Tagesgeld stehen räumlich getrennt; ein Gehalts-Geldstapel fällt zunächst auf das Girokonto.
 * MECHANISM: Vom angekommenen Gehalt löst sich ein zweiter Geldstapel und wandert zum Tagesgeld. Anschließend treffen Miete und Einkauf das Girokonto, nicht die Reserve.
 * RESULT: Girokonto trägt die Alltagsausgaben, Tagesgeld bleibt rechts stabil als Notgroschen stehen und „SEPARAT“ bestätigt nur den sichtbaren Endzustand.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei reale Konten plus der tatsächlich abgespaltene Geldweg zeigen die Trennung von Alltag und Reserve ohne App-UI oder Flussdiagramm.
 * SUPPORT: Miete und Einkauf demonstrieren nach dem Transfer, warum die Trennung praktisch funktioniert; Labels bleiben sekundär.
 * MATERIAL: Ivory für Girokonto/Belege, Emerald für Tagesgeld, Gold für Gehalt und transferierten Reserveanteil, Rot nur für laufende Ausgaben.
 * DEPTH: Gehalt kommt von oben links, Reserveanteil durchquert die Mitte nach rechts, Rechnungen bleiben links unten – drei klar getrennte räumliche Aktionen.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene11Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const salaryDrop = interpolate(frame, [3, 28], [0, 1], clamp);
  const salarySettle = interpolate(frame, [22, 42], [0, 1], clamp);
  const reserveSplit = interpolate(frame, [34, 58], [0, 1], clamp);
  const reserveTransfer = interpolate(frame, [48, 78], [0, 1], clamp);
  const rentArrive = interpolate(frame, [72, 92], [0, 1], clamp);
  const shoppingArrive = interpolate(frame, [84, 104], [0, 1], clamp);
  const separationSettle = interpolate(frame, [92, resultStart], [0, 1], clamp);

  const salaryX = 235;
  const salaryY = 430 + salaryDrop * 250;
  const transferX = 330 + reserveTransfer * 380;
  const transferY = 730 - reserveTransfer * 55;

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={70}
        y={650}
        label="Girokonto"
        balance={reserveTransfer > 0.7 ? '1.800 €' : salarySettle > 0.5 ? '2.000 €' : 'Alltag'}
        state="normal"
        scale={0.95 + salarySettle * 0.05}
      />

      <PhysicalAccount
        x={700}
        y={625 - separationSettle * 12}
        label="Tagesgeld"
        balance={reserveTransfer > 0.7 ? '1.200 €' : '1.000 €'}
        state="protected"
        scale={0.94 + separationSettle * 0.06}
      />

      <PhysicalCoinStack
        x={salaryX}
        y={salaryY}
        count={6}
        scale={0.84 - salarySettle * 0.08}
        opacity={Math.max(0, 1 - reserveSplit * 0.72)}
      />

      <PhysicalCoinStack
        x={transferX}
        y={transferY}
        count={4}
        scale={0.68 + reserveSplit * 0.12 - reserveTransfer * 0.08}
        opacity={reserveSplit * Math.max(0.15, 1 - separationSettle * 0.45)}
      />

      <PhysicalBill
        x={55}
        y={945 + (1 - rentArrive) * 105}
        label="Miete"
        amount="900 €"
        rotate={-5}
        scale={0.49 + rentArrive * 0.05}
        opacity={rentArrive}
      />

      <PhysicalBill
        x={270}
        y={975 + (1 - shoppingArrive) * 95}
        label="Einkauf"
        amount="85 €"
        rotate={5}
        scale={0.47 + shoppingArrive * 0.05}
        opacity={shoppingArrive}
      />

      <div style={{
        position: 'absolute',
        left: 765,
        top: 920,
        opacity: separationSettle,
        transform: `translateY(${(1 - separationSettle) * 18}px)`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 27}}>SEPARAT</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
