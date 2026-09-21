import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  C,
  FONT,
  PhysicalCoinStack,
  PremiumPhysicalStage,
  ease,
  euroText,
  settle,
  sparplanFuerAnimation,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: contributions-and-interest-stack-apart
 * DATA_NARRATIVE
 * CLAIM: Aus 72.000 Euro Einzahlung werden in dreissig Jahren rund 200.900 Euro, der groessere Teil davon sind Zinsen.
 * SOURCE: sparplanFuerAnimation (200 Euro monatlich, 6 Prozent pro Jahr, 30 Jahre)
 * FIGURES: Eingezahltes und Zinsen werden getrennt gestapelt, der Endwert zaehlt mit.
 * ANIMATION_NARRATIVE
 * START: Leere Flaeche, ein Geldstapel steht links als monatliche Einzahlung.
 * MECHANISM: Die blaue Einzahlungsflaeche waechst gleichmaessig, die goldene Zinsflaeche darueber holt auf.
 * RESULT: Die Zinsflaeche ist sichtbar die groessere; beide Betraege bleiben stehen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die beiden gestapelten Flaechen tragen den Vergleich.
 * SUPPORT: Der Geldstapel zeigt, dass am Anfang nur die Rate steht.
 * MATERIAL: Blau fuer Eingezahltes, Gold fuer Zinsen, Ivory fuer Beschriftung.
 * DEPTH: Stapel links vorne, Flaechen dahinter ueber die volle Breite.
 */
export const RESULT_HOLD_FRAMES = 20;

/** 200 Euro monatlich, 6 Prozent pro Jahr, 30 Jahre — gerechnet, nicht geschaetzt. */
const PLAN = sparplanFuerAnimation({monatlich: 200, renditeProzent: 6, jahre: 30});

const FLAECHE = {links: 300, oben: 600, breite: 700, hoehe: 440} as const;
const MAXIMUM = PLAN.endwert * 1.06;

const flaechenPfad = (werte: number[]) => {
  const schritt = FLAECHE.breite / Math.max(1, werte.length - 1);
  const linie = werte
    .map((wert, i) => `${i === 0 ? 'M' : 'L'}${(i * schritt).toFixed(1)} ${(FLAECHE.hoehe * (1 - wert / MAXIMUM)).toFixed(1)}`)
    .join(' ');
  return `${linie} L${FLAECHE.breite} ${FLAECHE.hoehe} L0 ${FLAECHE.hoehe} Z`;
};

const GESAMT = flaechenPfad(PLAN.jahre.map((jahr) => jahr.gesamt));
const EINGEZAHLT = flaechenPfad(PLAN.jahre.map((jahr) => jahr.eingezahlt));

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 194}) => {
  const frame = useCurrentFrame();
  const wachsen = ease(frame, 16, 142);
  const betraege = settle(frame, 148, 170);
  const stand = PLAN.endwert * wachsen;

  return (
    <PremiumPhysicalStage>
      <PhysicalCoinStack x={150} y={780} count={3} scale={1.1} opacity={ease(frame, 6, 30)} />

      <svg
        width={FLAECHE.breite}
        height={FLAECHE.hoehe}
        style={{position: 'absolute', left: FLAECHE.links, top: FLAECHE.oben}}
      >
        <defs>
          <clipPath id="plan-schnitt">
            <rect x={0} y={0} width={FLAECHE.breite * wachsen} height={FLAECHE.hoehe} />
          </clipPath>
        </defs>

        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={0}
            y1={(FLAECHE.hoehe * i) / 3}
            x2={FLAECHE.breite}
            y2={(FLAECHE.hoehe * i) / 3}
            stroke="rgba(255,255,255,0.09)"
            strokeWidth={2}
            opacity={ease(frame, 6, 26)}
          />
        ))}

        <g clipPath="url(#plan-schnitt)">
          <path d={GESAMT} fill={ANIMATION_COLORS.money} opacity={0.3} />
          <path d={GESAMT} fill="none" stroke={ANIMATION_COLORS.money} strokeWidth={7} strokeLinejoin="round" />
          <path d={EINGEZAHLT} fill={C.blue} opacity={0.55} />
          <path d={EINGEZAHLT} fill="none" stroke={C.blue} strokeWidth={7} strokeLinejoin="round" />
        </g>
      </svg>

      <div
        style={{
          position: 'absolute',
          left: FLAECHE.links,
          width: FLAECHE.breite,
          top: FLAECHE.oben - 126,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 94,
          fontWeight: 800,
          color: ANIMATION_COLORS.money,
          opacity: ease(frame, 18, 38),
        }}
      >
        {euroText(stand)}
      </div>

      <div
        style={{
          position: 'absolute',
          left: FLAECHE.links,
          width: FLAECHE.breite,
          top: FLAECHE.oben + FLAECHE.hoehe + 34,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONT.body,
          fontSize: 26,
          color: ANIMATION_COLORS.neutralText,
          opacity: ease(frame, 20, 42),
        }}
      >
        <span>Jahr 1</span>
        <span>Jahr 30</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: FLAECHE.links,
          width: FLAECHE.breite,
          top: FLAECHE.oben + FLAECHE.hoehe + 92,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONT.body,
          fontSize: 34,
          fontWeight: 800,
          opacity: betraege,
        }}
      >
        <span style={{color: C.blue}}>
          {euroText(PLAN.eingezahltGesamt)}
          <span style={{color: ANIMATION_COLORS.neutralText, fontWeight: 600, fontSize: 27}}> eingezahlt</span>
        </span>
        <span style={{color: ANIMATION_COLORS.money}}>
          {euroText(PLAN.zinsenGesamt)}
          <span style={{color: ANIMATION_COLORS.neutralText, fontWeight: 600, fontSize: 27}}> Zinsen</span>
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          top: FLAECHE.oben + FLAECHE.hoehe + 158,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 24,
          color: ANIMATION_COLORS.neutralText,
          opacity: ease(frame, 156, durationFrames - RESULT_HOLD_FRAMES) * 0.85,
        }}
      >
        Beispielannahme: 200 Euro monatlich, 6 Prozent pro Jahr, 30 Jahre. Keine Zusage einer Rendite.
      </div>
    </PremiumPhysicalStage>
  );
};
