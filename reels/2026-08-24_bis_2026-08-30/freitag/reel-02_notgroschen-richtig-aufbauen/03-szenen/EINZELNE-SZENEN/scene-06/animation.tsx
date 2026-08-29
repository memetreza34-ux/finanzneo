import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalBill,
  PhysicalReserveTank,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: obligations-raise-reserve-target
 * PRIMARY_ACTION: Drei konkrete monatliche Verpflichtungen kommen nacheinander sichtbar in die Szene und erhöhen den Füllstand sowie die Zielmarke des Notgroschen-Behälters Schritt für Schritt.
 *
 * ANIMATION_NARRATIVE
 * START: Ein kleiner Notgroschen-Zielbehälter steht neben einer zunächst leeren Fläche für die reale monatliche Lebenssituation.
 * MECHANISM: Miete, Fixkosten und Mobilität erscheinen nacheinander als echte Rechnungen; mit jeder zusätzlichen Verpflichtung steigt die sichtbare Zielreserve im Behälter.
 * RESULT: Der Behälter endet deutlich höher gefüllt und mit „Dein Ziel“ markiert, sodass klar wird: Mehr Verpflichtungen können einen größeren individuellen Puffer sinnvoll machen.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der transparente Reservebehälter verändert seinen Füllstand sichtbar aufgrund konkreter Rechnungen und macht die individuelle Zielhöhe physisch nachvollziehbar.
 * SUPPORT: Drei verkleinerte echte Rechnungen tragen ausschließlich die kurzen Labels Miete, Fixkosten und Mobilität; eine kurze Zielmarke fasst das Ergebnis zusammen.
 * MATERIAL: Papier-Elfenbein für reale Verpflichtungen, Gold für die Reserve, Emerald nur für die finale Zielbestätigung und Rot sparsam für Kostenbeträge.
 * DEPTH: Die Rechnungen staffeln sich von links nach Mitte, der Reservebehälter steht klar im Vordergrund rechts; Größenänderung und Füllstand erzeugen echte Zustandsveränderung.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(106, durationFrames - RESULT_HOLD_FRAMES - 5);

  const rentIn = interpolate(frame, [4, 30], [0, 1], clamp);
  const fixedIn = interpolate(frame, [26, 54], [0, 1], clamp);
  const mobilityIn = interpolate(frame, [50, 80], [0, 1], clamp);
  const targetRise = interpolate(frame, [18, resultStart], [0, 1], clamp);
  const finalSettle = interpolate(frame, [82, resultStart], [0, 1], clamp);

  const fill = 0.22 + rentIn * 0.15 + fixedIn * 0.18 + mobilityIn * 0.15;
  const tankScale = 0.88 + targetRise * 0.12;

  return (
    <PremiumPhysicalStage>
      <PhysicalBill
        x={65}
        y={610 + (1 - rentIn) * 120}
        label="Miete"
        amount="900 €"
        rotate={-8}
        scale={0.58 + rentIn * 0.06}
        opacity={rentIn}
      />
      <PhysicalBill
        x={280}
        y={640 + (1 - fixedIn) * 110}
        label="Fixkosten"
        amount="650 €"
        rotate={2}
        scale={0.56 + fixedIn * 0.06}
        opacity={fixedIn}
      />
      <PhysicalBill
        x={490}
        y={675 + (1 - mobilityIn) * 100}
        label="Mobilität"
        amount="300 €"
        rotate={8}
        scale={0.54 + mobilityIn * 0.06}
        opacity={mobilityIn}
      />

      <PhysicalReserveTank
        x={770 - targetRise * 22}
        y={570 - targetRise * 28}
        width={245 + targetRise * 26}
        height={345 + targetRise * 60}
        fill={fill}
        label="Notgroschen"
        scale={tankScale}
      />

      <div style={{
        position: 'absolute',
        left: 745,
        top: 1035,
        opacity: finalSettle,
        transform: `translateY(${(1 - finalSettle) * 18}px) scale(${0.94 + finalSettle * 0.06})`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 27}}>DEIN ZIEL</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
