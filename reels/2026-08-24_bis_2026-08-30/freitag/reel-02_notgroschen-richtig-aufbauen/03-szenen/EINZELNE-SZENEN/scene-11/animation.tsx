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
 * PRIMARY_ACTION: Ein sichtbarer Teil des Gehalts verlässt das Girokonto und wandert physisch auf ein separates Tagesgeldkonto, während spätere Alltagsausgaben nur das Girokonto belasten und die Reserve unangetastet bleibt.
 *
 * ANIMATION_NARRATIVE
 * START: Girokonto und Tagesgeldkonto stehen klar getrennt; das Gehalt liegt zunächst beim Girokonto und die Reserve ist noch kleiner.
 * MECHANISM: Ein goldener Geldstapel trennt sich sichtbar vom Girokonto und wandert zum Tagesgeld; anschließend erscheinen Miete und Einkauf als echte Ausgaben am Girokonto.
 * RESULT: Die Alltagsrechnungen bleiben links beim Girokonto, während das separate Tagesgeld rechts stabil und als Notgroschen geschützt stehen bleibt.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei erkennbare Konten und der physisch wechselnde Geldstapel machen die Trennung von Alltag und Reserve ohne Diagramm oder App-UI sichtbar.
 * SUPPORT: Zwei kleine echte Ausgabenbelege zeigen anschließend, warum die Trennung funktioniert; „SEPARAT“ bestätigt nur den fertigen Zustand.
 * MATERIAL: Neutrales Elfenbein für das Girokonto, Emerald für das getrennte Tagesgeld, Gold für das transferierte Geld und Rot nur für laufende Ausgaben.
 * DEPTH: Girokonto links und Tagesgeld rechts bilden zwei räumlich getrennte Zonen; der Geldstapel durchquert die Mitte und erzeugt eine klare physische Zustandsänderung.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene11Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(106, durationFrames - RESULT_HOLD_FRAMES - 5);

  const salaryArrive = interpolate(frame, [4, 28], [0, 1], clamp);
  const reserveTransfer = interpolate(frame, [26, 70], [0, 1], clamp);
  const rentArrive = interpolate(frame, [66, 88], [0, 1], clamp);
  const shoppingArrive = interpolate(frame, [78, 100], [0, 1], clamp);
  const separationSettle = interpolate(frame, [86, resultStart], [0, 1], clamp);

  const moneyX = 300 + reserveTransfer * 385;
  const moneyY = 720 - reserveTransfer * 42;

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={80}
        y={650}
        label="Girokonto"
        balance={reserveTransfer > 0.65 ? '1.800 €' : '2.000 €'}
        state="normal"
        scale={0.96 + salaryArrive * 0.04}
      />

      <PhysicalAccount
        x={700}
        y={630}
        label="Tagesgeld"
        balance={reserveTransfer > 0.65 ? '1.200 €' : '1.000 €'}
        state="protected"
        scale={0.94 + separationSettle * 0.06}
      />

      <PhysicalCoinStack
        x={moneyX}
        y={moneyY}
        count={5}
        scale={0.78 + salaryArrive * 0.14 - reserveTransfer * 0.08}
        opacity={salaryArrive}
      />

      <PhysicalBill
        x={65}
        y={930 + (1 - rentArrive) * 100}
        label="Miete"
        amount="900 €"
        rotate={-5}
        scale={0.49 + rentArrive * 0.05}
        opacity={rentArrive}
      />

      <PhysicalBill
        x={275}
        y={960 + (1 - shoppingArrive) * 90}
        label="Einkauf"
        amount="85 €"
        rotate={5}
        scale={0.47 + shoppingArrive * 0.05}
        opacity={shoppingArrive}
      />

      <div style={{
        position: 'absolute',
        left: 765,
        top: 905,
        opacity: separationSettle,
        transform: `translateY(${(1 - separationSettle) * 18}px)`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 27}}>SEPARAT</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
