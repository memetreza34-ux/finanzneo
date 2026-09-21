import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, FONT, ease, euroText, settle} from '../../../../../../../src/design-system';
import {PhysicalAccount, PhysicalCoinStack, PremiumPhysicalStage} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: amount-stays-purchasing-power-shrinks
 * PRIMARY_ACTION: Der Kalender laeuft durch zehn Jahre, der Kontostand bleibt bei 10.000 Euro stehen und der Muenzstapel daneben schrumpft von zehn auf knapp acht Muenzen.
 * ANIMATION_NARRATIVE
 * START: Kalender auf Jahr 1, Konto zeigt 10.000 Euro, daneben ein voller Stapel von zehn Muenzen.
 * MECHANISM: Die Jahreszahl auf dem Kalender laeuft hoch. Der Kontostand aendert sich nicht. Der Stapel verliert Muenze um Muenze.
 * RESULT: Kalender steht auf Jahr 10, das Konto weiter auf 10.000 Euro, der Stapel nur noch bei acht Muenzen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das Nebeneinander von unveraendertem Kontostand und schrumpfendem Stapel traegt die Aussage.
 * SUPPORT: Das Kalenderblatt macht sichtbar, dass Zeit die Ursache ist.
 * MATERIAL: Neutral fuer Konto und Kalender, Gold fuer die Muenzen, Warm Red nur fuer die fehlende Menge.
 * DEPTH: Kalender links, Konto mittig hinten, Muenzstapel rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 26;

const BETRAG = 10000;
const MUENZEN_START = 10;
const MUENZEN_ENDE = 8;

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 210}) => {
  const frame = useCurrentFrame();

  // Drei getrennte Kanaele: das Erscheinen, der Zeitlauf und das Schrumpfen.
  const auf = ease(frame, 8, 40);
  const zeit = ease(frame, 46, 150);
  const schluss = settle(frame, 156, 184);

  const jahr = 1 + Math.round(zeit * 9);
  const muenzen = Math.max(MUENZEN_ENDE, Math.round(MUENZEN_START - zeit * (MUENZEN_START - MUENZEN_ENDE)));

  return (
    <PremiumPhysicalStage>
      {/* Der Zeitlauf steht als eigene Zeile darueber: PhysicalCalendarPage
          zeigt eine fest einprogrammierte Tageszahl und taugt nicht als Jahreszaehler. */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          right: 150,
          top: 430,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 44,
          fontWeight: 800,
          color: ANIMATION_COLORS.neutralText,
          opacity: auf,
        }}
      >
        {`Jahr ${jahr} von 10`}
      </div>

      <PhysicalAccount x={150} y={560} label="Kontostand" balance={euroText(BETRAG)} role="neutral" progress={auf} />

      <PhysicalCoinStack x={640} y={540} coins={muenzen} progress={auf} />

      <div
        style={{
          position: 'absolute',
          left: 640,
          width: 280,
          top: 1020,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 30,
          fontWeight: 700,
          color: ANIMATION_COLORS.warning,
          opacity: schluss,
        }}
      >
        weniger Kaufkraft
      </div>

      <div
        style={{
          position: 'absolute',
          left: 160,
          width: 410,
          top: 1020,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 30,
          fontWeight: 700,
          color: ANIMATION_COLORS.neutralText,
          opacity: schluss,
        }}
      >
        gleicher Betrag
      </div>

      <div
        style={{
          position: 'absolute',
          left: 150,
          right: 150,
          top: 1110,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 24,
          color: ANIMATION_COLORS.neutralText,
          opacity: ease(frame, 150, durationFrames - RESULT_HOLD_FRAMES) * 0.85,
        }}
      >
        Veranschaulichung derselben Beispielannahme: 2,5 % Inflation pro Jahr.
      </div>
    </PremiumPhysicalStage>
  );
};
