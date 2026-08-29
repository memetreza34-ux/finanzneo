import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalBill,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalReserveTank,
  PhysicalTag,
  PhysicalWasher,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: reserve-stops-countdown-and-opens-options
 * PRIMARY_ACTION: Eine kaputte Waschmaschine und offene Rechnung bauen Zeitdruck auf; Geld verlässt den Notgroschen, bezahlt die Rechnung, stoppt den Countdown und macht anschließend sichtbar Raum für eine ruhige Entscheidung frei.
 *
 * ANIMATION_NARRATIVE
 * START: Waschmaschine kaputt, Rechnung offen, roter Countdown läuft – die Haushaltssituation wirkt sofort dringend.
 * MECHANISM: Der Notgroschen rückt zur Rechnung, ein echter Geldstapel verlässt die Reserve und bezahlt sie. Parallel verliert der Countdown seine Dominanz und stoppt.
 * RESULT: Die Rechnung ist bezahlt, eine ruhige Zeit-/Entscheidungsseite erscheint und die drei Optionen Reparieren, Preise vergleichen und Ersatz planen öffnen sich erst danach.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Konkrete Haushaltspanne, reale Zahlung und stoppender Zeitdruck erzählen die Geschichte; die Szene kippt sichtbar von Panik zu Handlungsfreiheit.
 * SUPPORT: Kalenderseite und kurze Entscheidungslabels erscheinen erst nach der Zahlung und bestätigen den gewonnenen Spielraum, statt die Hauptaktion zu ersetzen.
 * MATERIAL: Weiß/Grau für Waschmaschine, Ivory für Rechnung/Kalender, Gold für Reserve/Geld, Rot für Zeitdruck und Emerald für den beruhigten Endzustand.
 * DEPTH: Waschmaschine links, Rechnung mittig, Reserve rechts; Geld kreuzt den Raum zur Rechnung, danach öffnet sich die untere Vordergrundebene für die Entscheidung.
 */
export const RESULT_HOLD_FRAMES = 22;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene14Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(108, durationFrames - RESULT_HOLD_FRAMES - 5);

  const pressureBuild = interpolate(frame, [4, 30], [0, 1], clamp);
  const reserveMove = interpolate(frame, [28, 58], [0, 1], clamp);
  const moneyRelease = interpolate(frame, [50, 68], [0, 1], clamp);
  const moneyTravel = interpolate(frame, [62, 88], [0, 1], clamp);
  const billPaid = interpolate(frame, [78, 98], [0, 1], clamp);
  const countdownStop = interpolate(frame, [76, 100], [0, 1], clamp);
  const timeOpen = interpolate(frame, [90, 108], [0, 1], clamp);
  const choicesOpen = interpolate(frame, [100, resultStart], [0, 1], clamp);

  const reserveX = 745 - reserveMove * 150;
  const reserveFill = 0.78 - moneyTravel * 0.20;
  const timerScale = 0.9 + pressureBuild * 0.13 - countdownStop * 0.09;
  const timerOpacity = 0.55 + pressureBuild * 0.45 - countdownStop * 0.70;
  const seconds = countdownStop > 0.6 ? 'STOP' : pressureBuild > 0.62 ? '00:08' : '00:15';
  const moneyX = reserveX + 35 - moneyTravel * 205;
  const moneyY = 760 - moneyRelease * 24 - moneyTravel * 42;
  const moneyOpacity = Math.min(1, moneyRelease * 2) * Math.max(0, 1 - billPaid * 0.72);

  return (
    <PremiumPhysicalStage>
      <PhysicalWasher
        x={60}
        y={610}
        broken
        scale={0.96 + pressureBuild * 0.04}
      />

      <PhysicalBill
        x={360}
        y={650 - billPaid * 12}
        label="Reparatur"
        amount="280 €"
        rotate={-5 + billPaid * 5}
        scale={0.76 - billPaid * 0.05}
        paid={billPaid > 0.62}
      />

      <PhysicalReserveTank
        x={reserveX}
        y={625 - reserveMove * 10}
        width={245}
        height={350}
        fill={reserveFill}
        label="Notgroschen"
        scale={0.92 + reserveMove * 0.08}
      />

      <PhysicalCoinStack
        x={moneyX}
        y={moneyY}
        count={5}
        scale={0.74 - moneyTravel * 0.10}
        opacity={moneyOpacity}
      />

      <div style={{
        position: 'absolute',
        left: 380,
        top: 500,
        width: 210,
        height: 105,
        borderRadius: 52,
        border: `5px solid ${countdownStop > 0.6 ? ANIMATION_COLORS.positive : ANIMATION_COLORS.warning}`,
        color: countdownStop > 0.6 ? ANIMATION_COLORS.positive : ANIMATION_COLORS.warning,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 37,
        fontWeight: 950,
        letterSpacing: 1,
        opacity: timerOpacity,
        transform: `translateZ(60px) scale(${timerScale})`,
        boxShadow: `0 18px 34px rgba(0,0,0,0.34)`,
      }}>
        {seconds}
      </div>

      <PhysicalCalendarPage
        x={675}
        y={925}
        month="ZEIT"
        amount="zum Entscheiden"
        opacity={timeOpen}
        scale={0.70 + timeOpen * 0.08}
        rotate={3 - timeOpen * 3}
      />

      <div style={{
        position: 'absolute',
        left: 85,
        right: 80,
        top: 1110,
        display: 'flex',
        justifyContent: 'center',
        gap: 18,
        opacity: choicesOpen,
        transform: `translateY(${(1 - choicesOpen) * 26}px) scale(${0.96 + choicesOpen * 0.04})`,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 21}}>REPARIEREN</PhysicalTag>
        <PhysicalTag material="neutral" style={{fontSize: 21}}>PREISE VERGLEICHEN</PhysicalTag>
        <PhysicalTag material="money" style={{fontSize: 21}}>ERSATZ PLANEN</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
