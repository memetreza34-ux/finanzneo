import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalBill,
  PhysicalReserveTank,
  PhysicalTag,
  PhysicalWasher,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: reserve-stops-countdown-and-opens-options
 * PRIMARY_ACTION: Eine defekte Waschmaschine und eine offene Reparaturrechnung erzeugen sichtbaren Zeitdruck; sobald der Notgroschen die Rechnung absichert, stoppt der Countdown und drei ruhige Entscheidungsoptionen werden frei.
 *
 * ANIMATION_NARRATIVE
 * START: Die Waschmaschine ist kaputt, eine unbezahlte Rechnung liegt daneben und ein roter Countdown zeigt spürbaren Entscheidungsdruck.
 * MECHANISM: Der Notgroschen fährt sichtbar zur Rechnung, übernimmt den Betrag und markiert sie als bezahlt; gleichzeitig verliert der Countdown seine Dominanz und stoppt.
 * RESULT: Nach der finanziellen Absicherung erscheinen ruhig die Optionen Reparieren, Preise vergleichen und Ersatz planen – der Puffer hat sichtbar Entscheidungszeit geschaffen.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Eine konkrete Haushaltspanne mit Rechnung und Countdown erzählt die Situation; die Handlung kippt sichtbar von Druck zu kontrollierter Entscheidung.
 * SUPPORT: Der goldene Reservebehälter und drei kurze deutsche Entscheidungslabels zeigen die Lösung, ohne ein Dashboard oder abstraktes Flussdiagramm zu bauen.
 * MATERIAL: Realitätsnahe Weiß-/Grautöne für Waschmaschine und Papier, Gold für die Reserve, Rot für Zeitdruck und Emerald für den beruhigten Endzustand.
 * DEPTH: Waschmaschine links, Rechnung mittig und Reserve rechts erzeugen eine reale Bühne; der Countdown sitzt darüber, die Optionen öffnen sich erst nach der Zahlung im Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 22;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene14Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(104, durationFrames - RESULT_HOLD_FRAMES - 5);

  const pressureBuild = interpolate(frame, [4, 34], [0, 1], clamp);
  const reserveMove = interpolate(frame, [30, 72], [0, 1], clamp);
  const billPaid = interpolate(frame, [62, 92], [0, 1], clamp);
  const countdownStop = interpolate(frame, [68, 96], [0, 1], clamp);
  const choicesOpen = interpolate(frame, [86, resultStart], [0, 1], clamp);

  const reserveX = 740 - reserveMove * 175;
  const reserveFill = 0.78 - billPaid * 0.18;
  const timerScale = 0.9 + pressureBuild * 0.13 - countdownStop * 0.08;
  const timerOpacity = 0.55 + pressureBuild * 0.45 - countdownStop * 0.68;
  const seconds = countdownStop > 0.6 ? 'STOP' : pressureBuild > 0.62 ? '00:08' : '00:15';

  return (
    <PremiumPhysicalStage>
      <PhysicalWasher
        x={65}
        y={610}
        broken
        scale={0.96 + pressureBuild * 0.04}
      />

      <PhysicalBill
        x={365}
        y={650}
        label="Reparatur"
        amount="280 €"
        rotate={-4 + billPaid * 5}
        scale={0.76 - billPaid * 0.05}
        paid={billPaid > 0.72}
      />

      <PhysicalReserveTank
        x={reserveX}
        y={625}
        width={245}
        height={350}
        fill={reserveFill}
        label="Notgroschen"
        scale={0.92 + reserveMove * 0.08}
      />

      <div style={{
        position: 'absolute',
        left: 380,
        top: 500,
        width: 210,
        height: 105,
        borderRadius: 52,
        border: `5px solid ${ANIMATION_COLORS.warning}`,
        color: countdownStop > 0.6 ? ANIMATION_COLORS.positive : ANIMATION_COLORS.warning,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 37,
        fontWeight: 950,
        letterSpacing: 1,
        opacity: timerOpacity,
        transform: `translateZ(60px) scale(${timerScale})`,
        boxShadow: `0 18px 34px rgba(0,0,0,0.34), inset 0 0 0 2px ${countdownStop > 0.6 ? 'rgba(0,210,106,0.22)' : 'rgba(255,51,51,0.22)'}`,
      }}>
        {seconds}
      </div>

      <div style={{
        position: 'absolute',
        left: 120,
        right: 90,
        top: 1040,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        opacity: choicesOpen,
        transform: `translateY(${(1 - choicesOpen) * 28}px) scale(${0.96 + choicesOpen * 0.04})`,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 22}}>REPARIEREN</PhysicalTag>
        <PhysicalTag material="neutral" style={{fontSize: 22}}>PREISE VERGLEICHEN</PhysicalTag>
        <PhysicalTag material="money" style={{fontSize: 22}}>ERSATZ PLANEN</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
