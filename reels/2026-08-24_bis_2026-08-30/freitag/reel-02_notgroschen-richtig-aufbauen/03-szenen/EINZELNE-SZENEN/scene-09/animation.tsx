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
 * PRIMARY_ACTION: Drei aufeinanderfolgende Monate liefern jeweils einen eigenen sichtbaren Geldstapel in den Notgroschen; der Behälter füllt sich nach jeder Einzahlung in einer klaren Stufe weiter.
 *
 * ANIMATION_NARRATIVE
 * START: Januar liegt links als erste Kalenderseite, daneben steht ein fast leerer Notgroschen und die erste 50-Euro-Einzahlung bereit.
 * MECHANISM: Januar, Februar und März wechseln nacheinander. Zu jedem Monat fliegt ein eigener Geldstapel in die Reserve und erhöht den Füllstand sichtbar.
 * RESULT: Drei Einzahlungen sind abgeschlossen, der Notgroschen erreicht den ersten stabilen Puffer und „ERSTER PUFFER“ bleibt als klarer Zwischenstand stehen.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die drei echten Einzahlungsbewegungen und der dabei schrittweise steigende Füllstand zeigen Aufbau über Zeit ohne Fortschrittsbalken.
 * SUPPORT: Kalenderseiten geben den zeitlichen Rhythmus vor; Monatsnamen, 50 € und der Ergebnis-Tag sind kurz und funktional.
 * MATERIAL: Warmes Papier für Kalender, Gold für Einzahlungen und Reserve, Emerald für den erreichten Zwischenstand.
 * DEPTH: Kalender links, drei zeitversetzte Geldpfade durch die Mitte und der größere Reservebehälter rechts erzeugen eine eindeutige räumliche Leserichtung.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const janIn = interpolate(frame, [3, 18], [0, 1], clamp);
  const janDeposit = interpolate(frame, [16, 42], [0, 1], clamp);
  const febIn = interpolate(frame, [38, 54], [0, 1], clamp);
  const febDeposit = interpolate(frame, [50, 72], [0, 1], clamp);
  const marIn = interpolate(frame, [68, 84], [0, 1], clamp);
  const marDeposit = interpolate(frame, [80, 104], [0, 1], clamp);
  const finalSettle = interpolate(frame, [94, resultStart], [0, 1], clamp);

  const fill = 0.08 + janDeposit * 0.17 + febDeposit * 0.18 + marDeposit * 0.20;
  const janCoinOpacity = janIn * Math.max(0, 1 - janDeposit * 0.82);
  const febCoinOpacity = febIn * Math.max(0, 1 - febDeposit * 0.82);
  const marCoinOpacity = marIn * Math.max(0, 1 - marDeposit * 0.82);

  return (
    <PremiumPhysicalStage>
      <PhysicalCalendarPage
        x={85}
        y={650}
        month="JANUAR"
        amount="50 €"
        opacity={Math.max(0, 1 - febIn)}
        scale={0.94 + janIn * 0.06}
        rotate={-4}
      />
      <PhysicalCalendarPage
        x={85}
        y={650}
        month="FEBRUAR"
        amount="50 €"
        opacity={febIn * Math.max(0, 1 - marIn)}
        scale={0.94 + febIn * 0.06}
        rotate={1}
      />
      <PhysicalCalendarPage
        x={85}
        y={650}
        month="MÄRZ"
        amount="50 €"
        opacity={marIn}
        scale={0.94 + marIn * 0.06}
        rotate={4}
      />

      <PhysicalCoinStack
        x={360 + janDeposit * 270}
        y={750 - janDeposit * 72}
        count={4}
        scale={0.72 - janDeposit * 0.12}
        opacity={janCoinOpacity}
      />
      <PhysicalCoinStack
        x={350 + febDeposit * 280}
        y={815 - febDeposit * 125}
        count={4}
        scale={0.74 - febDeposit * 0.12}
        opacity={febCoinOpacity}
      />
      <PhysicalCoinStack
        x={365 + marDeposit * 265}
        y={875 - marDeposit * 178}
        count={4}
        scale={0.76 - marDeposit * 0.12}
        opacity={marCoinOpacity}
      />

      <PhysicalReserveTank
        x={700}
        y={565}
        width={265}
        height={420}
        fill={fill}
        label="Notgroschen"
        scale={0.96 + finalSettle * 0.04}
      />

      <div style={{
        position: 'absolute',
        left: 685,
        top: 1030,
        opacity: finalSettle,
        transform: `translateY(${(1 - finalSettle) * 18}px)`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 27}}>ERSTER PUFFER</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
