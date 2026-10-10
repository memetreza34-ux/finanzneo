import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, euroText, zahlText} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'pack-price-to-unit-price-reveal';
export const VISUAL_TECHNIQUE_ID = 'shelf-labels-with-calculated-unit-price-move-in';
export const COMPOSITION_FAMILY_ID = 'shelf-label-calculation';

/**
 * ANIMATION_NARRATIVE
 * START: Regal mit kleiner (200 g) und großer Packung (500 g); am Preisschild nur die Endpreise
 *   1,49 € und 4,29 €. Packungsflächen sind exakt im Verhältnis 200 : 500.
 * MECHANISM: Unter jedem Schild wird gerechnet (Preis : Menge in kg), das Ergebnis zählt hoch.
 * CONSEQUENCE: 7,45 € pro kg gegen 8,58 € pro kg — die große Packung bekommt „+1,13 € pro kg“.
 * RESULT: Die Ergebnisse wandern als Grundpreis auf die Preisschilder (die Rechnung blendet aus);
 *   der große Endpreis tritt zurück, die kleine Zahl darunter wird hervorgehoben.
 *
 * Beispielwerte, siehe data-notes.md.
 */
export const ANIMATION_NARRATIVE = {
  START: 'Kleine und große Packung, nur Endpreise 1,49 € und 4,29 €',
  MECHANISM: 'Preis : kg wird gerechnet, 7,45 € vs. 8,58 € pro kg',
  RESULT: 'Grundpreis steht auf dem Schild: große Packung pro kg 1,13 € teurer',
};

type Packung = {titel: string; gramm: number; cent: number};
const PACKUNGEN: Packung[] = [
  {titel: 'klein', gramm: 200, cent: 149},
  {titel: 'groß', gramm: 500, cent: 429},
];
const proKgCent = (pk: Packung) => Math.round((pk.cent * 1000) / pk.gramm); // 745 · 858
const GRUNDPREISE = PACKUNGEN.map(proKgCent);
if (GRUNDPREISE[0] !== 745 || GRUNDPREISE[1] !== 858) throw new Error('Grundpreis-Rechnung stimmt nicht.');
const DIFFERENZ_CENT = GRUNDPREISE[1] - GRUNDPREISE[0]; // 113

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});
const euro = (cent: number) => euroText(cent / 100, 2);
const kgText = (gramm: number) => `${zahlText(gramm / 1000, 1)} kg`;

// beats: [„Das stimmt aber nicht immer“, „Verbrauchertests finden“, „pro Kilo teurer“, „Darum gibt es den Grundpreis“, „Also der Preis pro Kilo“]
const PREVIEW_BEATS = [0, 67, 147, 249, 384];

const SPALTEN_X = [700, 1220];
const REGAL_Y = 540;
// Packungsfläche proportional zur Füllmenge: Seitenlängen skalieren mit √(Gramm).
const PACK_BASIS = {gramm: 200, breite: 150, hoehe: 190};
const packMass = (gramm: number) => {
  const f = Math.sqrt(gramm / PACK_BASIS.gramm);
  return {breite: PACK_BASIS.breite * f, hoehe: PACK_BASIS.hoehe * f};
};
const SCHILD = {breite: 360, oben: REGAL_Y + 22, hoehe: 200};
const PREIS_Y = SCHILD.oben + 72;
const GRUND_Y = SCHILD.oben + 158;
const RECHNUNG_Y = SCHILD.oben + SCHILD.hoehe + 66;
const ERGEBNIS_Y = RECHNUNG_Y + 64;

export const YouTubeVisual25Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const auf = p(frame, at(0), at(0) + 14);
  const rechnung = (i: number) => p(frame, at(1) + i * 10, at(1) + i * 10 + 14);
  const ergebnis = (i: number) => p(frame, at(2) + i * 10, at(2) + i * 10 + 18);
  const badge = p(frame, at(2) + 34, at(2) + 48);
  const wandern = (i: number) => p(frame, at(3) + i * 6, at(3) + i * 6 + 26);
  const marker = p(frame, at(3) + 30, at(3) + 44);
  const betonen = p(frame, at(4), at(4) + 20);

  return (
    <DatenBuehne>
      <Quelle>Beispielrechnung</Quelle>

      {/* Regalboden */}
      <div style={{position: 'absolute', left: 380, top: REGAL_Y, width: 1160, height: 10, borderRadius: 5, backgroundColor: DATEN.neutral, opacity: auf}} />

      {PACKUNGEN.map((pk, i) => {
        const x = SPALTEN_X[i];
        const m = packMass(pk.gramm);
        const r = rechnung(i);
        const e = ergebnis(i);
        const w = wandern(i);
        const yErgebnis = interpolate(w, [0, 1], [ERGEBNIS_Y, GRUND_Y]);
        const grundCent = Math.round(GRUNDPREISE[i] * e);
        const teurer = i === 1;
        return (
          <React.Fragment key={pk.titel}>
            {/* Packung */}
            <div style={{position: 'absolute', left: x - m.breite / 2, top: REGAL_Y - m.hoehe, width: m.breite, height: m.hoehe, borderRadius: 12, backgroundColor: DATEN.gold, opacity: auf, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: m.hoehe * 0.34, height: m.hoehe * 0.3, backgroundColor: DATEN.papier, opacity: 0.85}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: m.hoehe * 0.49, transform: 'translateY(-50%)', textAlign: 'center', fontSize: teurer ? 44 : 34, fontWeight: 800, color: DATEN.text}}>
                {zahlText(pk.gramm)} g
              </div>
            </div>

            {/* Preisschild am Regal */}
            <div style={{position: 'absolute', left: x - SCHILD.breite / 2, top: SCHILD.oben, width: SCHILD.breite, height: SCHILD.hoehe, borderRadius: 14, backgroundColor: DATEN.papier, border: `3px solid ${DATEN.linie}`, boxShadow: '0 12px 30px rgba(32, 42, 37, 0.08)', opacity: auf}} />
            {/* Grundpreis-Markierung */}
            <div style={{position: 'absolute', left: x - 150, top: GRUND_Y - 26, width: 300 * marker, height: 52, borderRadius: 8, backgroundColor: DATEN.gold, opacity: 0.35}} />
            <div style={{position: 'absolute', left: x, top: PREIS_Y, transform: 'translate(-50%, -50%)', fontSize: 84, fontWeight: 900, letterSpacing: -1.5, color: DATEN.text, opacity: auf * (1 - 0.6 * betonen), whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
              {euro(pk.cent)}
            </div>

            {/* Rechnung: Preis : Menge */}
            <div style={{position: 'absolute', left: x, top: RECHNUNG_Y, transform: `translate(-50%, -50%) translateY(${((1 - r) * 12).toFixed(1)}px)`, opacity: r * (1 - w), fontSize: 36, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
              {euro(pk.cent)} : {kgText(pk.gramm)} =
            </div>
            {/* Ergebnis → wandert als Grundpreis aufs Schild */}
            {e > 0 ? (
              <div style={{position: 'absolute', left: x, top: yErgebnis, transform: 'translate(-50%, -50%)', opacity: Math.min(1, e * 3), fontSize: interpolate(w, [0, 1], [44, 38]), fontWeight: 800, color: teurer ? DATEN.rot : DATEN.gruen, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                {euro(grundCent)} pro kg
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* Differenz an der großen Packung */}
      <div
        style={{
          position: 'absolute',
          left: SPALTEN_X[1] + SCHILD.breite / 2 + 28,
          top: interpolate(wandern(1), [0, 1], [ERGEBNIS_Y, GRUND_Y]),
          transform: `translateY(-50%) translateX(${((1 - badge) * -14).toFixed(1)}px)`,
          opacity: badge,
          padding: '10px 22px',
          borderRadius: 999,
          backgroundColor: DATEN.rot,
          color: DATEN.papier,
          fontSize: 32,
          fontWeight: 800,
          whiteSpace: 'nowrap',
        }}
      >
        +{euro(DIFFERENZ_CENT)} pro kg
      </div>

      <Text x={SPALTEN_X[0] - SCHILD.breite / 2 - 28} y={GRUND_Y} groesse={32} gewicht={800} farbe={DATEN.text} ausrichtung="rechts" ab={at(3) + 34}>
        Grundpreis
      </Text>
    </DatenBuehne>
  );
};
