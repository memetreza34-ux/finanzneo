import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalAccount, PhysicalCoinStack, PhysicalTag, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'standing-order-fixed-split';
export const VISUAL_TECHNIQUE_ID = 'payday-amount-walks-over';
export const COMPOSITION_FAMILY_ID = 'physical-process';
export const RESULT_HOLD_FRAMES = 48;

export const ANIMATION_NARRATIVE = {
  START: 'Das Gehalt landet auf dem Girokonto, das Rücklagenkonto steht leer daneben',
  MECHANISM: 'Ein fester Betrag löst sich sofort ab und wandert sichtbar zum zweiten Konto',
  RESULT: 'Die Rücklage steht auf dem eigenen Konto, bevor der Alltag am Rest zehrt',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der feste Betrag, der von einem Konto zum anderen wandert',
  SUPPORT: 'Girokonto als Quelle, Rücklagenkonto als Ziel, Dauerauftrag als Etikett',
  MATERIAL: 'Gold für den wandernden Betrag, Grün für das geschützte Rücklagenkonto',
  DEPTH: 'Beide Konten auf einer Ebene, der Betrag davor',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const GIRO = {x: 210, y: 372};
const RESERVE = {x: 1400, y: 372};
/** Der Betrag startet am Girokonto und endet am Rücklagenkonto. */
const WALK_FROM = 330;
/**
 * Der Betrag endet vor dem Zielkonto, nicht darauf.
 *
 * Läuft er bis in die Kontofläche hinein, überdeckt er Label und Betrag. Er hält
 * kurz davor an und geht dort auf — im selben Moment steht die Summe auf dem
 * Konto, und genau das ist die Aussage.
 */
const WALK_TO = 1090;

export const YouTubeVisual22Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — das Gehalt trifft ein: der Kontostand springt auf seinen Wert.
  const payday = ramp(frame, 6, 30);

  // Kanal 2 — der feste Betrag wandert hinüber. Er startet erst, wenn das Gehalt
  // da ist, und braucht sichtbar Zeit für den Weg.
  const walk = ramp(frame, 40, 128);

  // Kanal 3 — das Rücklagenkonto nimmt den Betrag auf und schaltet auf geschützt.
  const landed = ramp(frame, 118, 150);

  const walkX = interpolate(walk, [0, 1], [WALK_FROM, WALK_TO]);
  // Der Betrag hebt sich auf dem Weg leicht an, statt stur zu gleiten.
  const arc = Math.sin(walk * Math.PI) * 86;

  return (
    <YouTubePhysicalStage>
      <PhysicalAccount
        x={GIRO.x}
        y={GIRO.y}
        label="Girokonto"
        balance={payday > 0.5 ? '2.400 €' : '0 €'}
        scale={1.34}
      />

      <PhysicalAccount
        x={RESERVE.x}
        y={RESERVE.y}
        label="Rücklagenkonto"
        balance={landed > 0.5 ? '150 €' : '0 €'}
        state={landed > 0.5 ? 'protected' : 'normal'}
        scale={1.34}
      />

      {/* Der feste Betrag selbst — das Hauptobjekt der Szene. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 626,
          transform: `translate(${walkX}px, ${-arc}px)`,
          opacity: payday * (1 - landed),
        }}
      >
        <PhysicalCoinStack x={0} y={0} count={4} scale={1.3} />
      </div>

      {/* Das Etikett läuft mit und benennt, warum sich der Betrag bewegt. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 546,
          transform: `translate(${walkX - 30}px, ${-arc}px)`,
          opacity: payday * (1 - landed),
        }}
      >
        <PhysicalTag material="money">Dauerauftrag 150 €</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
