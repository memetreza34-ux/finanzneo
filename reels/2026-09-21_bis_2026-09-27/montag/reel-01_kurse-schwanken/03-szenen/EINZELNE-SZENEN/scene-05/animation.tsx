import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, FONT, ease, euroText, settle} from '../../../../../../../src/design-system';
// Motion Core V1: die Physical-Primitives kommen aus src/motion, nicht mehr aus
// der Legacy-API in src/brand.
import {PhysicalAccount, PhysicalCoinStack, PremiumPhysicalStage} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: selling-at-the-low-locks-the-loss
 * PRIMARY_ACTION: Zwei gleich hohe Depots fallen gemeinsam; eines wird am Tiefpunkt verkauft und bleibt dort stehen, das andere bleibt liegen und steht am Ende wieder oberhalb des Starts.
 * ANIMATION_NARRATIVE
 * START: Zwei Depots stehen nebeneinander, beide bei 10.000 Euro.
 * MECHANISM: Beide fallen auf 7.600 Euro. Das linke wird verkauft — sein Geld wandert als Stapel heraus und der Wert friert ein. Das rechte bleibt unangetastet und steigt weiter.
 * RESULT: Links stehen 7.600 Euro still, rechts 11.900 Euro. Der Unterschied ist die Entscheidung, nicht der Markt.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die beiden Depots tragen den Vergleich.
 * SUPPORT: Der herausgenommene Geldstapel macht den Verkauf körperlich.
 * MATERIAL: Warnrot für das verkaufte Depot, Emerald für das liegengebliebene, Gold für das entnommene Geld.
 * DEPTH: Depots hinten nebeneinander, der Stapel kommt nach vorne aus dem linken heraus.
 */
export const RESULT_HOLD_FRAMES = 26;

const START = 10000;
const TIEF = 7600;
const ENDE = 11900;

export const Scene05Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 285}) => {
  const frame = useCurrentFrame();

  // Drei getrennte Bewegungen statt einer globalen Variable: der gemeinsame
  // Fall, der Verkauf am Tiefpunkt und die spätere Erholung nur rechts.
  const fallen = ease(frame, 20, 96);
  const verkaufen = ease(frame, 104, 152);
  const erholen = ease(frame, 160, 246);
  const schluss = settle(frame, 232, 262);

  const linksWert = START - (START - TIEF) * fallen;
  const rechtsWert = START - (START - TIEF) * fallen + (ENDE - TIEF) * erholen;

  const verkauft = verkaufen > 0.5;

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={96}
        y={620}
        label="verkauft"
        balance={euroText(linksWert)}
        role={verkauft ? 'warning' : 'neutral'}
        progress={ease(frame, 4, 26)}
      />

      <PhysicalAccount
        x={592}
        y={620}
        label="liegen gelassen"
        balance={euroText(rechtsWert)}
        role={erholen > 0.6 ? 'positive' : 'neutral'}
        progress={ease(frame, 10, 32)}
      />

      {/* Das Geld verlässt das linke Depot sichtbar — der Verkauf hat einen Körper. */}
      <PhysicalCoinStack
        x={150}
        y={1060 + (1 - verkaufen) * 120}
        coins={5}
        progress={verkaufen}
      />

      <div
        style={{
          position: 'absolute',
          left: 96,
          width: 400,
          top: 1266,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 30,
          fontWeight: 700,
          color: ANIMATION_COLORS.warning,
          opacity: schluss,
        }}
      >
        bleibt unten stehen
      </div>

      <div
        style={{
          position: 'absolute',
          left: 584,
          width: 400,
          top: 1266,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 30,
          fontWeight: 700,
          color: ANIMATION_COLORS.positive,
          opacity: schluss,
        }}
      >
        steht wieder oben
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          top: 520,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 28,
          color: ANIMATION_COLORS.neutralText,
          opacity: ease(frame, 200, durationFrames - RESULT_HOLD_FRAMES) * 0.85,
        }}
      >
        Beispielhafte Betraege zur Veranschaulichung, keine echte Kursreihe.
      </div>
    </PremiumPhysicalStage>
  );
};
