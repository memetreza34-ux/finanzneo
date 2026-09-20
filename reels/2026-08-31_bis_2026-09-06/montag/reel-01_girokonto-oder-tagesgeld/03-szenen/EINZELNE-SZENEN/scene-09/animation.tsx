import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';
import {
  PhysicalAccount,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalObject,
  PhysicalReserveTank,
  PremiumPhysicalStage,
} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: fn-account-transfer
 * PRIMARY_ACTION: Nach dem Gehaltseingang löst sich ein fester Geldbetrag vom Girokonto, bewegt sich sichtbar zum Tagesgeld und wird dort absorbiert, wodurch der Reservefüllstand steigt.
 * ANIMATION_NARRATIVE
 * START: Monatsanfang, Girokonto und Tagesgeld stehen als getrennte Geldorte bereit; Gehalt nähert sich dem Girokonto.
 * MECHANISM: Gehalt wird aufgenommen, danach löst sich eine kleinere feste Einheit, wandert auf einem klaren Weg nach rechts und verschwindet beim Eintritt in den Tagesgeldbehälter.
 * RESULT: Der Tagesgeld-Füllstand ist sichtbar höher und AUTO GETRENNT bestätigt nur das bereits gezeigte Resultat.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die einzelne feste Geld-Einheit auf dem Weg Girokonto zu Tagesgeld trägt die Erklärung.
 * SUPPORT: Girokonto, Reservetank und Monatsblatt bilden den konkreten Kontext des automatischen Sparens.
 * MATERIAL: Ivory Kalender, neutraler Girokörper, Gold für Geld und Emerald für den erreichten Reserve-Zustand.
 * DEPTH: Kalender hinten links, Giro links mittig, Transferweg durch die Mitte und Tagesgeld rechts als klares Ziel.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 165}) => {
  const frame = useCurrentFrame();
  const monthIn = interpolate(frame, [2, 20], [0, 1], clamp);
  const accountsIn = interpolate(frame, [4, 24], [0, 1], clamp);
  const salaryIn = interpolate(frame, [18, 52], [0, 1], clamp);
  const transfer = interpolate(frame, [56, 112], [0, 1], clamp);
  const absorption = interpolate(frame, [94, 116], [0, 1], clamp);
  const result = interpolate(frame, [112, Math.max(122, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const salaryX = interpolate(salaryIn, [0, 1], [20, 210], clamp);
  const salaryY = interpolate(salaryIn, [0, 1], [410, 355], clamp);
  const salaryOpacity = interpolate(frame, [18, 46, 62, 76], [0, 1, 1, 0.18], clamp);

  const transferX = interpolate(transfer, [0, 1], [420, 735], clamp);
  const transferY = interpolate(transfer, [0, 0.5, 1], [500, 390, 505], clamp);
  const transferOpacity = interpolate(absorption, [0, 1], [1, 0], clamp) * interpolate(transfer, [0, 0.12], [0, 1], clamp);
  const reserveFill = interpolate(transfer, [0, 1], [0.42, 0.68], clamp);

  return (
    <PremiumPhysicalStage>
      <PhysicalCalendarPage x={35} y={180} month="MONAT" year="GEHALT" progress={monthIn} />

      <PhysicalAccount
        x={245}
        y={285}
        balance={transfer > 0.82 ? 'REST' : 'GEHALT'}
        label="GIROKONTO"
        progress={accountsIn}
        role="neutral"
      />

      <PhysicalReserveTank
        x={755}
        y={245}
        fill={reserveFill}
        label={result > 0.5 ? 'TAGESGELD ↑' : 'TAGESGELD'}
        role="positive"
      />

      <div style={{position: 'absolute', inset: 0, opacity: salaryOpacity}}>
        <PhysicalCoinStack x={salaryX} y={salaryY} coins={6} progress={salaryIn} role="money" />
      </div>

      <PhysicalObject
        x={transferX}
        y={transferY}
        width={148}
        height={86}
        depth={16}
        radius={24}
        role="money"
        opacity={transferOpacity}
        rotate={interpolate(transfer, [0, 1], [-6, 6], clamp)}
        grounding={0}
      >
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a2d00', fontSize: 30, fontWeight: 950}}>250 €</div>
      </PhysicalObject>

      <div
        style={{
          position: 'absolute',
          left: 625,
          right: 70,
          top: 850,
          textAlign: 'center',
          color: ANIMATION_COLORS.positive,
          fontSize: 30,
          fontWeight: 950,
          opacity: result,
          transform: `translateY(${(1 - result) * 14}px)`,
        }}
      >
        AUTO GETRENNT
      </div>
    </PremiumPhysicalStage>
  );
};
