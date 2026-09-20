import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  FONT,
  PhysicalCoinStack,
  PremiumPhysicalStage,
  ease,
  kursPfad,
  kursreiheFuerAnimation,
  settle,
} from '../../../../../../../src/design-system';
import serie from '../../../../../../../public/data/msci-world.json';

/**
 * MECHANIC_ID: measured-decade-with-marked-drawdown
 * DATA_NARRATIVE
 * CLAIM: Zehn Jahre Weltmarkt steigen auf das 2,91-fache und fallen zwischendurch 24 Prozent unter das vorherige Hoch.
 * SOURCE: public/data/msci-world.json
 * FIGURES: Faktor vom ersten zum letzten Punkt, tiefster Rückgang gegenüber dem bis dahin höchsten Stand.
 * ANIMATION_NARRATIVE
 * START: Leeres Raster, ein Geldstapel steht links als Maßstab für den eingesetzten Euro.
 * MECHANISM: Die gemessene Reihe zeichnet sich von links nach rechts durch das Raster.
 * RESULT: Der tiefste Einbruch fällt als markierter Punkt ein; beide Kennzahlen bleiben stehen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die gemessene Kurve trägt die Aussage.
 * SUPPORT: Der wachsende Geldstapel gibt der Kurve einen körperlichen Maßstab.
 * MATERIAL: Gold für Geld, Emerald für die Reihe, Warm Red nur für den Einbruch.
 * DEPTH: Stapel links vorne, Raster und Kurve dahinter über die volle Breite.
 */
export const RESULT_HOLD_FRAMES = 30;

const REIHE = kursreiheFuerAnimation(serie);

const FLAECHE = {links: 300, oben: 560, breite: 700, hoehe: 480} as const;
const PFAD = kursPfad(REIHE, {breite: FLAECHE.breite, hoehe: FLAECHE.hoehe, rand: 16});

/** Der Punkt, an dem die Reihe am weitesten unter ihrem bisherigen Hoch lag. */
const TIEFPUNKT = (() => {
  let hoch = REIHE.punkte[0].y;
  let schlimmster = 0;
  let index = 0;
  REIHE.punkte.forEach((punkt, i) => {
    hoch = Math.max(hoch, punkt.y);
    const fall = (punkt.y - hoch) / hoch;
    if (fall < schlimmster) {
      schlimmster = fall;
      index = i;
    }
  });
  return index;
})();

const punktBei = (index: number) => {
  const anteil = index / Math.max(1, REIHE.punkte.length - 1);
  return {
    x: FLAECHE.links + 16 + anteil * (FLAECHE.breite - 32),
    y: FLAECHE.oben + 16 + (1 - REIHE.anteil(REIHE.punkte[index])) * (FLAECHE.hoehe - 32),
  };
};

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 330}) => {
  const frame = useCurrentFrame();
  const zeichnen = ease(frame, 24, 210);
  const marke = settle(frame, 214, 244);
  const kennzahlen = settle(frame, 248, 278);

  const tief = punktBei(TIEFPUNKT);
  const ende = punktBei(REIHE.punkte.length - 1);
  const tiefErreicht = zeichnen >= TIEFPUNKT / (REIHE.punkte.length - 1);
  const muenzen = Math.max(1, Math.round(1 + zeichnen * 5));

  return (
    <PremiumPhysicalStage>
      {/* Der Stapel wächst mit der Reihe: die Kurve bekommt einen Körper. */}
      <PhysicalCoinStack x={96} y={720} count={muenzen} scale={1.15} opacity={ease(frame, 8, 34)} />

      <svg
        width={FLAECHE.breite}
        height={FLAECHE.hoehe}
        style={{position: 'absolute', left: FLAECHE.links, top: FLAECHE.oben}}
      >
        <defs>
          <linearGradient id="reihe-flaeche" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ANIMATION_COLORS.positive} stopOpacity={0.34} />
            <stop offset="100%" stopColor={ANIMATION_COLORS.positive} stopOpacity={0} />
          </linearGradient>
          <clipPath id="reihe-schnitt">
            <rect x={0} y={0} width={FLAECHE.breite * zeichnen} height={FLAECHE.hoehe} />
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

        <path
          d={`${PFAD} L${FLAECHE.breite - 16} ${FLAECHE.hoehe} L16 ${FLAECHE.hoehe} Z`}
          fill="url(#reihe-flaeche)"
          clipPath="url(#reihe-schnitt)"
        />
        <path
          d={PFAD}
          stroke={ANIMATION_COLORS.positive}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - zeichnen}
        />
      </svg>

      {tiefErreicht ? (
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: marke}}>
          <line
            x1={tief.x}
            y1={tief.y}
            x2={tief.x}
            y2={FLAECHE.oben + FLAECHE.hoehe}
            stroke={ANIMATION_COLORS.warning}
            strokeWidth={4}
            strokeDasharray="12 10"
            opacity={0.75}
          />
          <circle cx={tief.x} cy={tief.y} r={16} fill="#000000" stroke={ANIMATION_COLORS.warning} strokeWidth={7} />
        </svg>
      ) : null}

      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={ende.x} cy={ende.y} r={16} fill={ANIMATION_COLORS.positive} opacity={ease(frame, 196, 216)} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: FLAECHE.links,
          top: FLAECHE.oben - 152,
          opacity: kennzahlen,
          transform: `translateY(${(1 - kennzahlen) * 14}px)`,
        }}
      >
        <div style={{fontFamily: FONT.body, fontSize: 86, fontWeight: 800, color: ANIMATION_COLORS.money, lineHeight: 1}}>
          {`${REIHE.faktor.toFixed(2).replace('.', ',')}×`}
        </div>
        <div style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 600, color: ANIMATION_COLORS.neutralText, marginTop: 8}}>
          in zehn Jahren
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: FLAECHE.links,
          width: FLAECHE.breite,
          top: FLAECHE.oben - 152,
          textAlign: 'right',
          opacity: kennzahlen,
          transform: `translateY(${(1 - kennzahlen) * 14}px)`,
        }}
      >
        <div style={{fontFamily: FONT.body, fontSize: 86, fontWeight: 800, color: ANIMATION_COLORS.warning, lineHeight: 1}}>
          {`${Math.round(REIHE.groessterRueckgangProzent)} %`}
        </div>
        <div style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 600, color: ANIMATION_COLORS.neutralText, marginTop: 8}}>
          tiefster Einbruch
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          top: FLAECHE.oben + FLAECHE.hoehe + 56,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 24,
          color: ANIMATION_COLORS.neutralText,
          opacity: ease(frame, 260, durationFrames - RESULT_HOLD_FRAMES) * 0.85,
        }}
      >
        Quelle: Yahoo Finance · URTH · 10y, Stand 20.9.2026. Historische Entwicklung, keine Aussage ueber die Zukunft.
      </div>
    </PremiumPhysicalStage>
  );
};
