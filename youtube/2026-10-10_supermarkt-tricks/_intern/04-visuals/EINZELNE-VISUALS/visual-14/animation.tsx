import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, skala, zahlText} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'tempo-track-to-revenue-overshoot';
export const VISUAL_TECHNIQUE_ID = 'scrolling-beat-ticks-with-baseline-overshoot-bar';
export const COMPOSITION_FAMILY_ID = 'comparison';

/**
 * ANIMATION_NARRATIVE
 * START: Zwei Zeilen der Studie: „schnelle Musik“ und „langsame Musik“, noch ohne Umsatz.
 * MECHANISM: In jeder Zeile laufen Takt-Striche durch ein Fenster — oben dicht und schnell,
 *   unten weit und langsam. Dann wachsen beide Umsatzbalken gleichzeitig bis zur 100-%-Linie;
 *   der Balken der langsamen Musik wächst weiter.
 * RESULT: Langsame Musik = 138 % des Umsatzes bei schneller Musik; das Plus von 38 % ist farbig abgesetzt.
 *
 * Daten nur relativ (schnelle Musik = 100 %), siehe data-notes.md. Keine Euro-Werte.
 */
export const ANIMATION_NARRATIVE = {
  START: 'Schnelle und langsame Musik nebeneinander, Umsatz leer',
  MECHANISM: 'Takt läuft schnell bzw. langsam; beide Umsatzbalken wachsen, langsam überholt die 100-%-Linie',
  RESULT: 'Langsame Musik: 138 % statt 100 % Umsatz (+38 %)',
};

const BASIS = 100;
const LANGSAM = 138; // Milliman 1982: rund 38 % mehr Umsatz bei langsamer Musik
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const linear = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], CLAMP);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„In einer bekannten Studie“, „mal schnelle“, „mal langsame Musik“, „Bei langsamer Musik“, „Und der Umsatz“]
const PREVIEW_BEATS = [0, 129, 161, 205, 296];

const ZEILE = {links: 160, rechts: 1760, hoehe: 230};
const ZEILEN_Y = [DATEN.mitteY - 150, DATEN.mitteY + 150];
const TAKT = {links: 230, breite: 400, hoehe: 64};
const BALKEN = {links: 820, max: 760, hoehe: 76};
const breite = skala(LANGSAM, BALKEN.max);

const Noten: React.FC<{x: number; y: number; farbe: string}> = ({x, y, farbe}) => (
  <svg width={52} height={52} viewBox="0 0 52 52" style={{position: 'absolute', left: x, top: y - 26}}>
    <ellipse cx={13} cy={40} rx={9} ry={7} fill={farbe} transform="rotate(-20 13 40)" />
    <ellipse cx={39} cy={35} rx={9} ry={7} fill={farbe} transform="rotate(-20 39 35)" />
    <rect x={19.5} y={8} width={4} height={32} fill={farbe} />
    <rect x={45.5} y={3} width={4} height={32} fill={farbe} />
    <polygon points="19.5,8 49.5,3 49.5,11 19.5,16" fill={farbe} />
  </svg>
);

/** Takt-Striche, die mit konstantem Tempo durch ein Fenster laufen. Tempo = Pixel pro Frame,
 *  Striche pro Sekunde = tempo / abstand × 30 (schnell ≈ 5, langsam ≈ 0,7). */
const TaktSpur: React.FC<{y: number; tempo: number; abstand: number; ab: number; farbe: string}> = ({y, tempo, abstand, ab, farbe}) => {
  const frame = useCurrentFrame();
  const sichtbar = p(frame, ab, ab + 12);
  const weg = Math.max(0, frame - ab) * tempo;
  const anzahl = Math.ceil(TAKT.breite / abstand) + 2;
  const versatz = weg % abstand;
  const erster = Math.floor(weg / abstand);
  const striche = [];
  for (let k = 0; k < anzahl; k += 1) {
    const index = erster + k;
    const x = k * abstand - versatz;
    const betont = index % 4 === 0;
    const h = betont ? TAKT.hoehe * 0.9 : TAKT.hoehe * 0.45;
    striche.push(<rect key={index} x={x} y={(TAKT.hoehe - h) / 2} width={8} height={h} rx={4} fill={farbe} opacity={betont ? 1 : 0.55} />);
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: TAKT.links,
        top: y - TAKT.hoehe / 2,
        width: TAKT.breite,
        height: TAKT.hoehe,
        overflow: 'hidden',
        opacity: 0.25 + 0.75 * sichtbar,
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%)',
      }}
    >
      <svg width={TAKT.breite} height={TAKT.hoehe}>
        <line x1={0} y1={TAKT.hoehe / 2} x2={TAKT.breite} y2={TAKT.hoehe / 2} stroke={DATEN.linie} strokeWidth={3} />
        {sichtbar > 0 ? striche : null}
      </svg>
    </div>
  );
};

export const YouTubeVisual14Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const karten = p(frame, at(0), at(0) + 16);
  // Umsatz: beide Balken wachsen gemeinsam bis 100 %, dann wächst nur „langsam“ weiter.
  const bisBasis = p(frame, at(4), at(4) + 22);
  const ueberBasis = p(frame, at(4) + 24, at(4) + 50);
  const wertSchnell = BASIS * bisBasis;
  const wertLangsam = BASIS * bisBasis + (LANGSAM - BASIS) * ueberBasis;
  const plusSichtbar = p(frame, at(4) + 46, at(4) + 60);
  const basisLinie = linear(frame, at(4) + 18, at(4) + 30);

  const zeilen = [
    {titel: 'schnelle Musik', kunden: 'Kunden gehen schneller', tempo: 4.4, abstand: 26, ab: at(1), wert: wertSchnell, farbe: DATEN.blau},
    {titel: 'langsame Musik', kunden: 'Kunden gehen langsamer', tempo: 1.4, abstand: 64, ab: at(2), wert: wertLangsam, farbe: DATEN.blau},
  ];

  const xBasis = BALKEN.links + breite(BASIS);
  const yOben = ZEILEN_Y[0] - BALKEN.hoehe / 2 - 24;
  const yUnten = ZEILEN_Y[1] + BALKEN.hoehe / 2 + 24;

  return (
    <DatenBuehne>
      <Quelle>Quelle: Milliman, Journal of Marketing, 1982 · US-Supermarkt</Quelle>

      <Text x={BALKEN.links} y={ZEILEN_Y[0] - ZEILE.hoehe / 2 - 36} groesse={30} gewicht={700} farbe={DATEN.leise} ab={at(0) + 6}>
        Umsatz
      </Text>

      {zeilen.map((zeile, i) => {
        const y = ZEILEN_Y[i];
        const aktiv = p(frame, zeile.ab, zeile.ab + 12);
        const textFarbe = aktiv > 0.5 ? DATEN.text : DATEN.leise;
        const balken = breite(zeile.wert);
        return (
          <React.Fragment key={zeile.titel}>
            <div
              style={{
                position: 'absolute',
                left: ZEILE.links,
                top: y - ZEILE.hoehe / 2,
                width: ZEILE.rechts - ZEILE.links,
                height: ZEILE.hoehe,
                borderRadius: 26,
                backgroundColor: DATEN.papier,
                boxShadow: '0 14px 36px rgba(32, 42, 37, 0.08)',
                opacity: karten,
              }}
            />
            <Noten x={TAKT.links} y={y - 62} farbe={aktiv > 0.5 ? DATEN.gold : DATEN.neutral} />
            <div style={{position: 'absolute', left: TAKT.links + 70, top: y - 62, transform: 'translateY(-50%)', fontSize: 40, fontWeight: 800, color: textFarbe, opacity: karten, whiteSpace: 'nowrap'}}>
              {zeile.titel}
            </div>
            <TaktSpur y={y + 10} tempo={zeile.tempo} abstand={zeile.abstand} ab={zeile.ab} farbe={DATEN.gold} />
            <Text x={TAKT.links} y={y + 74} groesse={28} gewicht={700} farbe={DATEN.leise} ab={at(3) + i * 8}>
              {zeile.kunden}
            </Text>

            {/* Umsatzbalken: Länge exakt aus dem Prozentwert */}
            <div style={{position: 'absolute', left: BALKEN.links, top: y - BALKEN.hoehe / 2, width: BALKEN.max, height: BALKEN.hoehe, borderRadius: 14, backgroundColor: DATEN.grund, opacity: karten}} />
            <div style={{position: 'absolute', left: BALKEN.links, top: y - BALKEN.hoehe / 2, width: Math.min(balken, breite(BASIS)), height: BALKEN.hoehe, borderRadius: balken > breite(BASIS) ? '14px 0 0 14px' : 14, backgroundColor: zeile.farbe}} />
            {balken > breite(BASIS) ? (
              <div style={{position: 'absolute', left: xBasis, top: y - BALKEN.hoehe / 2, width: balken - breite(BASIS), height: BALKEN.hoehe, borderRadius: '0 14px 14px 0', backgroundColor: DATEN.orange}} />
            ) : null}
            {zeile.wert > 0.5 ? (
              <div style={{position: 'absolute', left: BALKEN.links + balken - 18, top: y, transform: 'translate(-100%, -50%)', fontSize: 38, fontWeight: 800, color: DATEN.papier, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', opacity: p(frame, at(4) + 6, at(4) + 14)}}>
                {zahlText(Math.round(zeile.wert))} %
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* 100-%-Linie über beide Zeilen */}
      <div style={{position: 'absolute', left: xBasis - 2, top: yOben, width: 0, height: (yUnten - yOben) * basisLinie, borderLeft: `4px dashed ${DATEN.text}`, opacity: 0.55}} />

      {/* Plus über dem Mehrumsatz */}
      <div
        style={{
          position: 'absolute',
          left: xBasis + (breite(LANGSAM) - breite(BASIS)) / 2,
          top: ZEILEN_Y[1] - BALKEN.hoehe / 2 - 44,
          transform: `translate(-50%, -50%) translateY(${((1 - plusSichtbar) * 12).toFixed(1)}px)`,
          opacity: plusSichtbar,
          fontSize: 48,
          fontWeight: 900,
          color: DATEN.orange,
          whiteSpace: 'nowrap',
        }}
      >
        +{LANGSAM - BASIS} %
      </div>
    </DatenBuehne>
  );
};
