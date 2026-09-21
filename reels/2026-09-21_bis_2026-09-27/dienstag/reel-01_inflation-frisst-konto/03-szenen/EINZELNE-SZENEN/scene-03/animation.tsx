import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  FONT,
  ease,
  euroText,
  kaufkraftFuerAnimation,
  settle,
} from '../../../../../../../src/design-system';
import {PhysicalCoinStack, PremiumPhysicalStage} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: same-sum-lower-purchasing-power
 * DATA_NARRATIVE
 * CLAIM: Aus 10.000 Euro werden bei 2,5 Prozent Inflation in zehn Jahren noch 7.812 Euro Kaufkraft.
 * SOURCE: kaufkraftFuerAnimation (10.000 Euro, 2,5 Prozent, 10 Jahre)
 * FIGURES: Heutiger Betrag, spaetere Kaufkraft, Verlust in Prozent.
 * ANIMATION_NARRATIVE
 * START: Zwei gleich hohe Balken stehen nebeneinander, links heute, rechts in zehn Jahren.
 * MECHANISM: Der rechte Balken sinkt sichtbar ab, waehrend der linke unveraendert stehen bleibt.
 * RESULT: Die Differenz bleibt als roter Block zwischen beiden stehen, darunter der Verlust in Prozent.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das Balkenpaar traegt den Vergleich.
 * SUPPORT: Ein Muenzstapel links zeigt, dass der Betrag selbst unveraendert bleibt.
 * MATERIAL: Gold fuer den heutigen Betrag, Warm Red fuer den Verlust, Ivory fuer Beschriftung.
 * DEPTH: Stapel links vorne, Balken dahinter mittig.
 */
export const RESULT_HOLD_FRAMES = 30;

/** 10.000 Euro, 2,5 Prozent Inflation, 10 Jahre — gerechnet, nicht geschaetzt. */
const KAUFKRAFT = kaufkraftFuerAnimation({betrag: 10000, inflationProzent: 2.5, jahre: 10});

const BALKEN = {breite: 190, maxHoehe: 380, basis: 870} as const;
const LINKS = 430;
const RECHTS = 700;

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 270}) => {
  const frame = useCurrentFrame();
  const auf = ease(frame, 10, 46);
  const sinken = ease(frame, 60, 168);
  const differenz = settle(frame, 176, 206);

  const anteil = KAUFKRAFT.spaeter / KAUFKRAFT.heute;
  const hoeheLinks = BALKEN.maxHoehe * auf;
  const hoeheRechts = BALKEN.maxHoehe * auf * (1 - (1 - anteil) * sinken);
  const wertRechts = KAUFKRAFT.heute - (KAUFKRAFT.heute - KAUFKRAFT.spaeter) * sinken;

  return (
    <PremiumPhysicalStage>
      {/* Der Stapel bleibt unveraendert: der Betrag selbst schrumpft ja nicht. */}
      <PhysicalCoinStack x={150} y={500} coins={6} progress={auf} />

      {/* Der fehlende Teil steht als roter Block ueber dem rechten Balken. */}
      <div
        style={{
          position: 'absolute',
          left: RECHTS,
          width: BALKEN.breite,
          top: BALKEN.basis - hoeheLinks,
          height: Math.max(0, hoeheLinks - hoeheRechts),
          background: ANIMATION_COLORS.warning,
          opacity: 0.22 * differenz,
          borderRadius: 10,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: LINKS,
          width: BALKEN.breite,
          top: BALKEN.basis - hoeheLinks,
          height: hoeheLinks,
          background: ANIMATION_COLORS.money,
          borderRadius: 14,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: RECHTS,
          width: BALKEN.breite,
          top: BALKEN.basis - hoeheRechts,
          height: hoeheRechts,
          background: ANIMATION_COLORS.warning,
          borderRadius: 14,
        }}
      />

      <div style={{position: 'absolute', left: LINKS, width: BALKEN.breite, top: BALKEN.basis + 20, textAlign: 'center'}}>
        <div style={{fontFamily: FONT.body, fontSize: 40, fontWeight: 800, color: ANIMATION_COLORS.money}}>
          {euroText(KAUFKRAFT.heute)}
        </div>
        <div style={{fontFamily: FONT.body, fontSize: 26, color: ANIMATION_COLORS.neutralText, marginTop: 6}}>heute</div>
      </div>

      <div style={{position: 'absolute', left: RECHTS, width: BALKEN.breite, top: BALKEN.basis + 20, textAlign: 'center'}}>
        <div style={{fontFamily: FONT.body, fontSize: 40, fontWeight: 800, color: ANIMATION_COLORS.warning}}>
          {euroText(wertRechts)}
        </div>
        <div style={{fontFamily: FONT.body, fontSize: 26, color: ANIMATION_COLORS.neutralText, marginTop: 6}}>in 10 Jahren</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 150,
          right: 150,
          top: 360,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 78,
          fontWeight: 800,
          color: ANIMATION_COLORS.warning,
          opacity: differenz,
        }}
      >
        {`−${KAUFKRAFT.verlustProzent.toFixed(1).replace('.', ',')} %`}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 150,
          right: 150,
          top: 1010,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 24,
          color: ANIMATION_COLORS.neutralText,
          opacity: ease(frame, 200, durationFrames - RESULT_HOLD_FRAMES) * 0.85,
        }}
      >
        Beispielannahme: konstant 2,5 % Inflation pro Jahr ueber 10 Jahre. Die tatsaechliche Inflation schwankt.
      </div>
    </PremiumPhysicalStage>
  );
};
