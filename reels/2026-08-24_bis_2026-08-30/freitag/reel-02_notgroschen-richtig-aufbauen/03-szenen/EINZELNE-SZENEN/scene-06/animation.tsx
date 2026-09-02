import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalReserveTank,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: obligations-raise-reserve-target
 * PRIMARY_ACTION: Reale monatliche Verpflichtungen kommen nacheinander physisch in die Szene; mit jeder zusätzlichen Belastung wächst die sichtbare Zielreserve im Notgroschen-Behälter und ein Geldstapel baut sich mit auf.
 *
 * ANIMATION_NARRATIVE
 * START: Ein kleiner Notgroschen steht rechts, während links noch keine monatlichen Verpflichtungen sichtbar sind.
 * MECHANISM: Miete, Fixkosten und Mobilität rutschen nacheinander in die Haushaltssituation. Nach jeder Rechnung steigt der Reservestand und ein sichtbarer Geldstapel wächst als Zielgröße mit.
 * RESULT: Drei reale Verpflichtungen stehen klar im Bild, der Notgroschen ist deutlich größer und „DEIN ZIEL“ markiert den individuellen Endzustand.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die Reserve reagiert unmittelbar auf echte monatliche Verpflichtungen; die Ursache für das größere Ziel ist dadurch ohne abstrakte Skala verständlich.
 * SUPPORT: Ein wachsender Geldstapel verstärkt den Zielzustand, kurze Rechnungslabels und „DEIN ZIEL“ bleiben nur erklärende Orientierung.
 * MATERIAL: Ivory für Rechnungen, Gold für Reserve/Geld, Emerald für das bestätigte Ziel und Rot sparsam ausschließlich auf Kostenbeträgen.
 * DEPTH: Rechnungen staffeln sich links und in der Mitte, Reserve und Zielgeld stehen rechts im Vordergrund; die Szene wächst sichtbar von leer zu belastet.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const rentIn = interpolate(frame, [4, 28], [0, 1], clamp);
  const fixedIn = interpolate(frame, [28, 54], [0, 1], clamp);
  const mobilityIn = interpolate(frame, [52, 80], [0, 1], clamp);
  const targetRise = interpolate(frame, [16, 92], [0, 1], clamp);
  const moneyBuild = interpolate(frame, [32, 98], [0, 1], clamp);
  const finalSettle = interpolate(frame, [88, resultStart], [0, 1], clamp);

  const fill = 0.18 + rentIn * 0.16 + fixedIn * 0.18 + mobilityIn * 0.17;
  const tankScale = 0.88 + targetRise * 0.12;

  return (
    <PremiumPhysicalStage>
      <PhysicalBill
        x={35 + rentIn * 38}
        y={565 + (1 - rentIn) * 145}
        label="Miete"
        amount="900 €"
        rotate={-10 + rentIn * 3}
        scale={0.56 + rentIn * 0.08}
        opacity={rentIn}
      />
      <PhysicalBill
        x={235 + fixedIn * 50}
        y={615 + (1 - fixedIn) * 135}
        label="Fixkosten"
        amount="650 €"
        rotate={-1 + fixedIn * 3}
        scale={0.54 + fixedIn * 0.08}
        opacity={fixedIn}
      />
      <PhysicalBill
        x={440 + mobilityIn * 48}
        y={660 + (1 - mobilityIn) * 125}
        label="Mobilität"
        amount="300 €"
        rotate={7 - mobilityIn * 2}
        scale={0.52 + mobilityIn * 0.08}
        opacity={mobilityIn}
      />

      <PhysicalReserveTank
        x={760 - targetRise * 28}
        y={585 - targetRise * 35}
        width={240 + targetRise * 34}
        height={330 + targetRise * 78}
        fill={fill}
        label="Notgroschen"
        scale={tankScale}
      />

      <PhysicalCoinStack
        x={690 + moneyBuild * 42}
        y={1000 - moneyBuild * 70}
        count={6}
        scale={0.56 + moneyBuild * 0.26}
        opacity={0.25 + moneyBuild * 0.75}
      />

      <div style={{
        position: 'absolute',
        left: 730,
        top: 1080,
        opacity: finalSettle,
        transform: `translateY(${(1 - finalSettle) * 20}px) scale(${0.94 + finalSettle * 0.06})`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 27}}>DEIN ZIEL</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
