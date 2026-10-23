import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'grant-steps-fill-rate-cells-then-merge';
export const VISUAL_TECHNIQUE_ID = 'two-step-contribution-staircase-dashed-rate-cells-green-grant-slabs-merge-to-540';
export const COMPOSITION_FAMILY_ID = 'stepped-grant-scale';

/**
 * ANIMATION_NARRATIVE
 * START: Die zwei Stufen aus Bild 11 stehen als Treppe auf einer €-Achse „Eigenbeitrag im Jahr“
 *   0 – 1.800 €: Stufe 1 ist genau 0 – 360 € breit, Stufe 2 genau 360 – 1.800 €.
 * MECHANISM: Auf jeder Stufe liegt ein gestricheltes Fach so lang wie die Stufe, geteilt in
 *   2 (Stufe 1, „50 %“) bzw. 4 (Stufe 2, „25 %“) gleiche Zellen. Die grüne Zulage füllt genau
 *   eine Zelle: 180 € (halbe Stufe 1) und 360 € (Viertel von Stufe 2) — gleiche €-Skala.
 * CONSEQUENCE: Beide grünen Stücke heben ab und rutschen in einer Zeile zusammen.
 * RESULT: +180 € +360 € = 540 € im Jahr (höchstens), als ein durchgehender grüner Balken.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: zusammengeschobener Zulage-Balken mit „= 540 € im Jahr“
 * SUPPORT: Sandfarbene Treppe (Bridge „Stufen“), Prozentzahlen auf den Stufen, €-Achse
 * SURFACE: Flow-Creme DATEN.grund, Stift-Konturen wie in den Flow-Bildern
 * SHAPE_LANGUAGE: wenige große flache Blöcke, Längen exakt aus Euro-Werten
 */
export const ANIMATION_NARRATIVE = {
  START: 'Treppe Stufe 1 (0–360 €) und Stufe 2 (360–1.800 €) auf der Eigenbeitrag-Achse',
  MECHANISM: 'Zulage füllt 1 von 2 Zellen (50 % → 180 €) und 1 von 4 Zellen (25 % → 360 €)',
  RESULT: '180 € + 360 € rutschen zusammen: höchstens 540 € im Jahr',
};

// Zahlen: Altersvorsorgereformgesetz, Bundestag 27.03.2026.
const GRENZE_1 = 360;
const GRENZE_2 = 1800;
const SATZ_1 = 0.5;
const SATZ_2 = 0.25;
const ZULAGE_1 = GRENZE_1 * SATZ_1;
const ZULAGE_2 = (GRENZE_2 - GRENZE_1) * SATZ_2;
const ZULAGE_MAX = ZULAGE_1 + ZULAGE_2;
if (ZULAGE_1 !== 180 || ZULAGE_2 !== 360 || ZULAGE_MAX !== 540) {
  throw new Error('Zulagen-Staffel muss 180 € + 360 € = 540 € ergeben.');
}

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const gleiten = Easing.bezier(0.65, 0, 0.35, 1);
const p = (frame: number, von: number, bis: number, easing = weich) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// beats: [„Auf die ersten dreihundertsechzig Euro“, „fünfzig Prozent dazu“, „Auf alles darüber“,
//         „fünfundzwanzig Prozent“, „Zusammen sind das“] — Frames ab Visual-Start.
const PREVIEW_BEATS = [0, 152, 190, 304, 330];

// Eine gemeinsame €-Skala für Eigenbeitrag und Zulage: 1.800 € = 1.560 px (1 € = 0,8667 px).
const LINKS = 180;
const BREITE = 1560;
const px = skala(GRENZE_2, BREITE);
const X_GRENZE = LINKS + px(GRENZE_1); // 492
const X_ENDE = LINKS + px(GRENZE_2); // 1740
const BODEN = 720;
const OBEN_1 = 530;
const OBEN_2 = 410;
const STUECK = 64;
// Ergebnis: Beide Stücke liegen am Ende zusammen oben auf Stufe 2 (ab Stufen-Kante).
const ZEILE = OBEN_2 - STUECK;
const ZIEL_X = X_GRENZE;
const SAND_HELL = '#F2DFB6';
const SAND = '#E3BF7F';
const ZELLE = 'rgba(255, 255, 255, 0.55)';

type Ausrichtung = 'links' | 'mitte' | 'rechts';
const T: React.FC<{
  x: number;
  y: number;
  groesse: number;
  gewicht?: number;
  farbe?: string;
  ausrichtung?: Ausrichtung;
  sicht?: number;
  heben?: number;
  children: React.ReactNode;
}> = ({x, y, groesse, gewicht = 800, farbe = DATEN.text, ausrichtung = 'mitte', sicht = 1, heben = 0, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${ausrichtung === 'mitte' ? '-50%' : ausrichtung === 'rechts' ? '-100%' : '0'}, -50%) translateY(${heben.toFixed(1)}px)`,
      opacity: sicht,
      fontSize: Math.max(DATEN.minText, groesse),
      fontWeight: gewicht,
      color: farbe,
      lineHeight: 1.1,
      whiteSpace: 'nowrap',
      letterSpacing: groesse >= 80 ? -1.5 : 0,
    }}
  >
    {children}
  </div>
);

export const YouTubeVisual12Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const achse = p(frame, 0, 14);
  // Stufe 1: Eigenbeitrag füllt die Stufe 0 → 360 €, dann Fach in 2 Zellen, Zulage füllt eine Zelle = 180 €.
  const beitrag1 = p(frame, at(0) + 6, at(0) + 66);
  const fach1 = p(frame, at(0) + 50, at(0) + 76);
  const satz1 = p(frame, at(1), at(1) + 12);
  const wachs1Ab = Math.max(at(1) + 4, at(0) + 76);
  const wachs1 = p(frame, wachs1Ab, wachs1Ab + 26);
  // Stufe 2: Fach 360–1.800 € in 4 Zellen, Zulage füllt eine Zelle = 360 €.
  const fach2Ab = Math.max(at(2), wachs1Ab + 26);
  const beitrag2 = p(frame, fach2Ab, fach2Ab + 48);
  const fach2 = p(frame, fach2Ab + 10, fach2Ab + 50);
  const satz2 = p(frame, at(3), at(3) + 12);
  const wachs2Ab = Math.max(at(3) + 4, fach2Ab + 50);
  const wachs2 = p(frame, wachs2Ab, wachs2Ab + 26);
  // Zusammen: beide Stücke heben ab und rutschen in eine Zeile.
  const zusammenAb = Math.max(at(4), wachs2Ab + 28);
  const faecherWeg = p(frame, zusammenAb, zusammenAb + 12);
  // Stück 2 macht zuerst Platz, dann landet Stück 1 davor — keine Überlappung.
  const flug2 = p(frame, zusammenAb, zusammenAb + 22, gleiten);
  const flug1 = p(frame, zusammenAb + 6, zusammenAb + 32, gleiten);
  const ergebnis = p(frame, zusammenAb + 26, zusammenAb + 40);


  const laenge1 = px(ZULAGE_1);
  const laenge2 = px(ZULAGE_2);
  // Stück 1 springt von Stufe 1 hinauf, Stück 2 rückt um genau px(180 €) nach rechts.
  const stueck1 = {x: mix(LINKS, ZIEL_X, flug1), y: mix(OBEN_1 - STUECK, ZEILE, flug1) - 4 * flug1 * (1 - flug1) * 70};
  const stueck2 = {x: mix(X_GRENZE, ZIEL_X + laenge1, flug2), y: ZEILE};

  const breite1 = X_GRENZE - LINKS;
  const breite2 = X_ENDE - X_GRENZE;

  return (
    <DatenBuehne>
      <T x={DATEN.rand} y={64} groesse={32} gewicht={600} farbe={DATEN.leise} ausrichtung="links">
        Altersvorsorgereformgesetz, Bundestag 27.03.2026
      </T>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <filter id="v12-stift" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="rauschen" />
            <feDisplacementMap in="SourceGraphic" in2="rauschen" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id="v12-fach1">
            <rect x={LINKS - 8} y={OBEN_1 - STUECK - 8} width={(breite1 + 16) * fach1} height={STUECK + 16} />
          </clipPath>
          <clipPath id="v12-fach2">
            <rect x={X_GRENZE - 8} y={OBEN_2 - STUECK - 8} width={(breite2 + 16) * fach2} height={STUECK + 16} />
          </clipPath>
        </defs>

        {/* Bridge „Stufen“: zwei Treppenstufen, Breiten exakt 0–360 € und 360–1.800 € */}
        <rect x={LINKS} y={OBEN_1} width={breite1} height={BODEN - OBEN_1} fill={SAND_HELL} />
        <rect x={X_GRENZE} y={OBEN_2} width={breite2} height={BODEN - OBEN_2} fill={SAND_HELL} />
        {/* Eigenbeitrag füllt die Stufen entlang der €-Achse, während er genannt wird */}
        <rect x={LINKS} y={OBEN_1} width={breite1 * beitrag1} height={BODEN - OBEN_1} fill={SAND} />
        <rect x={X_GRENZE} y={OBEN_2} width={breite2 * beitrag2} height={BODEN - OBEN_2} fill={SAND} />
        <g filter="url(#v12-stift)" fill="none" stroke={DATEN.text} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
          <path d={`M${LINKS},${BODEN} L${LINKS},${OBEN_1} L${X_GRENZE},${OBEN_1} L${X_GRENZE},${OBEN_2} L${X_ENDE},${OBEN_2} L${X_ENDE},${BODEN}`} />
          <path d={`M${X_GRENZE},${OBEN_1} L${X_GRENZE},${BODEN}`} />
          <path d={`M${LINKS - 24},${BODEN} L${X_ENDE + 24},${BODEN}`} strokeWidth={6} />
          {[LINKS, X_GRENZE, X_ENDE].map((x) => (
            <path key={x} d={`M${x},${BODEN} L${x},${BODEN + 18}`} opacity={achse} />
          ))}
        </g>

        {/* Fach Stufe 1: so lang wie 360 €, 2 Zellen = 50 % */}
        <g clipPath="url(#v12-fach1)" opacity={1 - faecherWeg}>
          <rect x={LINKS} y={OBEN_1 - STUECK} width={breite1} height={STUECK} rx={6} fill={ZELLE} stroke={DATEN.text} strokeWidth={3} strokeDasharray="12 9" />
          <line x1={LINKS + breite1 / 2} y1={OBEN_1 - STUECK + 8} x2={LINKS + breite1 / 2} y2={OBEN_1 - 8} stroke={DATEN.leise} strokeWidth={3} strokeDasharray="7 7" />
        </g>
        {/* Fach Stufe 2: so lang wie 1.440 €, 4 Zellen = 25 % */}
        <g clipPath="url(#v12-fach2)" opacity={1 - faecherWeg}>
          <rect x={X_GRENZE} y={OBEN_2 - STUECK} width={breite2} height={STUECK} rx={6} fill={ZELLE} stroke={DATEN.text} strokeWidth={3} strokeDasharray="12 9" />
          {[1, 2, 3].map((k) => (
            <line key={k} x1={X_GRENZE + (breite2 * k) / 4} y1={OBEN_2 - STUECK + 8} x2={X_GRENZE + (breite2 * k) / 4} y2={OBEN_2 - 8} stroke={DATEN.leise} strokeWidth={3} strokeDasharray="7 7" />
          ))}
        </g>

        {/* Zulage-Stücke: Länge exakt px(180 €) und px(360 €) */}
        {wachs1 > 0 ? (
          <rect x={stueck1.x} y={stueck1.y} width={laenge1 * wachs1} height={STUECK} rx={6} fill={DATEN.gruen} stroke={DATEN.text} strokeWidth={4} />
        ) : null}
        {wachs2 > 0 ? (
          <rect x={stueck2.x} y={stueck2.y} width={laenge2 * wachs2} height={STUECK} rx={6} fill={DATEN.gruen} stroke={DATEN.text} strokeWidth={4} />
        ) : null}
        {ergebnis > 0 ? (
          <rect x={ZIEL_X - 8} y={ZEILE - 8} width={px(ZULAGE_MAX) + 16} height={STUECK + 8} rx={12} fill="none" stroke={DATEN.gruen} strokeWidth={5} opacity={ergebnis} />
        ) : null}
      </svg>

      {/* Stufen-Beschriftung: wie in Bild 11, Prozentsatz erst beim Sprechen */}
      <T x={LINKS + breite1 / 2} y={OBEN_1 + 42} groesse={40}>
        Stufe 1
      </T>
      <T x={LINKS + breite1 / 2} y={OBEN_1 + 120} groesse={80} gewicht={900} farbe={DATEN.gruen} sicht={satz1} heben={(1 - satz1) * 14}>
        50 %
      </T>
      <T x={X_GRENZE + breite2 / 2} y={OBEN_2 + 50} groesse={40}>
        Stufe 2
      </T>
      <T x={X_GRENZE + breite2 / 2} y={OBEN_2 + 162} groesse={112} gewicht={900} farbe={DATEN.gruen} sicht={satz2} heben={(1 - satz2) * 14}>
        25 %
      </T>

      {/* €-Achse */}
      <T x={LINKS} y={BODEN + 46} groesse={36} gewicht={700} farbe={DATEN.leise} ausrichtung="links" sicht={achse}>
        0 €
      </T>
      <T x={X_GRENZE} y={BODEN + 46} groesse={36} gewicht={800} farbe={beitrag1 > 0.9 ? DATEN.text : DATEN.leise} sicht={achse}>
        {euroText(GRENZE_1)}
      </T>
      <T x={X_ENDE + 6} y={BODEN + 46} groesse={36} gewicht={800} farbe={beitrag2 > 0.9 ? DATEN.text : DATEN.leise} ausrichtung="rechts" sicht={achse}>
        {euroText(GRENZE_2)}
      </T>
      <T x={960} y={BODEN + 112} groesse={40} gewicht={700} sicht={achse}>
        Eigenbeitrag im Jahr
      </T>

      {/* Zulage-Beträge wandern mit ihren Stücken */}
      <T x={stueck1.x + laenge1 / 2} y={stueck1.y - 38} groesse={44} gewicht={900} farbe={DATEN.gruen} sicht={p(frame, wachs1Ab + 3, wachs1Ab + 10)}>
        {euroText(Math.round(ZULAGE_1 * wachs1), 0, true)}
      </T>
      <T x={stueck2.x + laenge2 / 2} y={stueck2.y - 38} groesse={44} gewicht={900} farbe={DATEN.gruen} sicht={p(frame, wachs2Ab + 3, wachs2Ab + 10)}>
        {euroText(Math.round(ZULAGE_2 * wachs2), 0, true)}
      </T>

      {/* Ergebnis */}
      <T x={ZIEL_X + px(ZULAGE_MAX) + 52} y={ZEILE - 104} groesse={44} gewicht={700} farbe={DATEN.leise} ausrichtung="links" sicht={ergebnis} heben={(1 - ergebnis) * 12}>
        höchstens
      </T>
      <div
        style={{
          position: 'absolute',
          left: ZIEL_X + px(ZULAGE_MAX) + 48,
          top: OBEN_2 - 8,
          transform: `translateY(-100%) translateY(${((1 - ergebnis) * 14).toFixed(1)}px)`,
          opacity: ergebnis,
          display: 'flex',
          alignItems: 'baseline',
          gap: 22,
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        <span style={{fontSize: 128, fontWeight: 900, letterSpacing: -2, color: DATEN.gruen}}>= {euroText(ZULAGE_MAX)}</span>
        <span style={{fontSize: 56, fontWeight: 800, color: DATEN.text}}>im Jahr</span>
      </div>
    </DatenBuehne>
  );
};
