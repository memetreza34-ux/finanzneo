import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalReserveTank,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: monthly-deposits-fill-reserve
 * PRIMARY_ACTION: Drei Monatswechsel bringen nacheinander kleine reale Sparbeträge in den Notgroschen-Behälter, dessen Füllstand sichtbar von fast leer bis zum ersten stabilen Puffer wächst.
 *
 * ANIMATION_NARRATIVE
 * START: Ein fast leerer Notgroschen-Behälter steht neben einer Kalenderseite für den ersten Monat und einem kleinen Geldstapel.
 * MECHANISM: Der Kalender wechselt sichtbar durch drei Monate; bei jedem Wechsel wandert ein kleiner Münzstapel zum Behälter und der Füllstand steigt in klaren Etappen.
 * RESULT: Die Reserve erreicht eine deutlich markierte erste Pufferhöhe, während ein kurzer Hinweis zeigt, dass danach Schritt für Schritt weiter aufgebaut werden kann.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der reale Füllstand des Notgroschen-Behälters ist die zentrale Veränderung; Kalender und Geldstapel machen den zeitlichen Aufbau sofort nachvollziehbar.
 * SUPPORT: Monatsnamen, jeweils „50 €“ und die kurze Zielmarke „Erster Puffer“ erklären nur die notwendigen Schritte und bleiben groß lesbar.
 * MATERIAL: Warmes Papier für den Kalender, Gold für Einzahlungen/Reserve und Emerald für den erreichten Zwischenstand.
 * DEPTH: Kalender links, bewegte Münzen in der Mitte und der größere Reservebehälter rechts bilden eine klare räumliche Leserichtung ohne Fortschrittsbalken.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const monthOne = interpolate(frame, [4, 24], [0, 1], clamp);
  const depositOne = interpolate(frame, [20, 48], [0, 1], clamp);
  const monthTwo = interpolate(frame, [42, 60], [0, 1], clamp);
  const depositTwo = interpolate(frame, [55, 78], [0, 1], clamp);
  const monthThree = interpolate(frame, [72, 90], [0, 1], clamp);
  const depositThree = interpolate(frame, [86, resultStart], [0, 1], clamp);
  const finalSettle = interpolate(frame, [96, resultStart], [0, 1], clamp);

  const fill = 0.10 + depositOne * 0.17 + depositTwo * 0.18 + depositThree * 0.20;
  const activeMonth = frame < 48 ? 1 : frame < 82 ? 2 : 3;
  const coinProgress = activeMonth === 1 ? depositOne : activeMonth === 2 ? depositTwo : depositThree;

  return (
    <PremiumPhysicalStage>
      <PhysicalCalendarPage
        x={90}
        y={650}
        month="JANUAR"
        amount="50 €"
        opacity={activeMonth === 1 ? monthOne : Math.max(0, 1 - monthTwo)}
        scale={0.94 + monthOne * 0.06}
        rotate={-4}
      />
      <PhysicalCalendarPage
        x={90}
        y={650}
        month="FEBRUAR"
        amount="50 €"
        opacity={activeMonth === 2 ? monthTwo : 0}
        scale={0.94 + monthTwo * 0.06}
        rotate={1}
      />
      <PhysicalCalendarPage
        x={90}
        y={650}
        month="MÄRZ"
        amount="50 €"
        opacity={activeMonth === 3 ? monthThree : 0}
        scale={0.94 + monthThree * 0.06}
        rotate={4}
      />

      <PhysicalCoinStack
        x={355 + coinProgress * 250}
        y={735 - coinProgress * 70}
        count={4}
        scale={0.78 - coinProgress * 0.18}
        opacity={Math.min(1, (1 - coinProgress) * 1.45)}
      />

      <PhysicalReserveTank
        x={700}
        y={570}
        width={260}
        height={410}
        fill={fill}
        label="Notgroschen"
        scale={0.96 + finalSettle * 0.04}
      />

      <div style={{
        position: 'absolute',
        left: 690,
        top: 1020,
        opacity: finalSettle,
        transform: `translateY(${(1 - finalSettle) * 18}px)`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 27}}>ERSTER PUFFER</PhysicalTag>
      </div>

      <div style={{
        position: 'absolute',
        left: 692,
        top: 1090,
        opacity: finalSettle,
        color: ANIMATION_COLORS.secondaryText,
        fontSize: 25,
        fontWeight: 800,
      }}>
        weiter aufbauen
      </div>
    </PremiumPhysicalStage>
  );
};
