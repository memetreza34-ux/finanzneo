import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, euroText, zahlText} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'week-calendar-fill-count-up';
export const VISUAL_TECHNIQUE_ID = 'fifty-two-week-grid-column-fill-with-month-bracket';
export const COMPOSITION_FAMILY_ID = 'calendar-grid-fill';

/**
 * ANIMATION_NARRATIVE
 * START: Leeres Jahr aus 52 Wochenfeldern (13 Spalten à 4 Wochen), Zähler 0 €.
 * MECHANISM: Woche 1 füllt sich mit 10 €, dann Woche 2–4; jede gefüllte Woche erhöht den Zähler
 *   um genau 10 €. Klammer unter den ersten 4 Wochen: „über 40 € im Monat“ (1 Monat ≈ 4,3 Wochen).
 * CONSEQUENCE: Die restlichen 48 Wochen füllen sich Spalte für Spalte, der Zähler läuft mit.
 * RESULT: Alle 52 Felder rot, Zähler steht auf 520 € — „im Jahr“.
 *
 * Reine Annahme / Rechenbeispiel: 10 € pro Woche ungeplant gekauft.
 */
export const ANIMATION_NARRATIVE = {
  START: '52 leere Wochen, 0 €',
  MECHANISM: 'Jede Woche füllt sich mit 10 €, nach 4 Wochen 40 € (über 40 € im Monat)',
  RESULT: '52 Wochen × 10 € = 520 € im Jahr',
};

const PRO_WOCHE = 10;
const WOCHEN = 52;
const PRO_SPALTE = 4;
const SPALTEN = WOCHEN / PRO_SPALTE; // 13
const JAHR = PRO_WOCHE * WOCHEN;
if (JAHR !== 520 || !Number.isInteger(SPALTEN)) throw new Error('Wochenrechnung stimmt nicht.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Machen wir ein einfaches“, „Du kaufst jede Woche“, „Zehn Euro pro Woche“, „über vierzig Euro“, „Und fünfhundertzwanzig Euro“]
const PREVIEW_BEATS = [0, 112, 305, 363, 431];

const FELD = 92;
const FUGE = 14;
const RASTER = {
  breite: SPALTEN * FELD + (SPALTEN - 1) * FUGE,
  hoehe: PRO_SPALTE * FELD + (PRO_SPALTE - 1) * FUGE,
};
const RASTER_LINKS = 960 - RASTER.breite / 2;
const RASTER_OBEN = 390;
const ZAEHLER_Y = 228;
// Woche w (0-basiert) liegt in Spalte w / 4, Zeile w % 4 — eine Spalte = 4 Wochen.
const feldX = (w: number) => RASTER_LINKS + Math.floor(w / PRO_SPALTE) * (FELD + FUGE);
const feldY = (w: number) => RASTER_OBEN + (w % PRO_SPALTE) * (FELD + FUGE);

export const YouTubeVisual38Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const fuellAb = (w: number) => {
    if (w === 0) return at(1) + 6;
    if (w < PRO_SPALTE) return at(2) + (w - 1) * 8;
    // Rest des Jahres: 48 Wochen in ~36 Frames, Zähler erreicht 520 € kurz nach „fünfhundertzwanzig“.
    return Math.max(at(3) + 24, at(4) - 20) + (w - PRO_SPALTE) * 0.75;
  };
  const fuellung = Array.from({length: WOCHEN}, (_, w) => p(frame, fuellAb(w), fuellAb(w) + 10));
  const gefuellt = fuellung.filter((f) => f >= 0.5).length;
  const summe = gefuellt * PRO_WOCHE;

  const raster = p(frame, at(0), at(0) + 16);
  const klammer = p(frame, at(3), at(3) + 16);
  const jahr = p(frame, fuellAb(WOCHEN - 1) + 6, fuellAb(WOCHEN - 1) + 18);

  const unterzeile = gefuellt === 0 ? `${WOCHEN} Wochen` : gefuellt === 1 ? 'nach 1 Woche' : `nach ${gefuellt} Wochen`;

  return (
    <DatenBuehne>
      <Quelle>Annahme: {euroText(PRO_WOCHE)} pro Woche ungeplant gekauft</Quelle>

      {/* Zähler: immer exakt 10 € × gefüllte Wochen */}
      <div style={{position: 'absolute', left: 960, top: ZAEHLER_Y, transform: 'translate(-50%, -50%)', opacity: raster, fontSize: 128, fontWeight: 900, letterSpacing: -2, color: summe > 0 ? DATEN.rot : DATEN.leise, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
        {zahlText(summe)} €
      </div>
      <div style={{position: 'absolute', left: 960, top: ZAEHLER_Y + 92, transform: 'translate(-50%, -50%)', opacity: raster * (1 - jahr), fontSize: 32, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap'}}>
        {unterzeile}
      </div>
      <div style={{position: 'absolute', left: 960, top: ZAEHLER_Y + 92, transform: `translate(-50%, -50%) scale(${(0.9 + 0.1 * jahr).toFixed(3)})`, opacity: jahr, fontSize: 40, fontWeight: 900, color: DATEN.rot, whiteSpace: 'nowrap'}}>
        im Jahr
      </div>

      {/* 52 Wochenfelder */}
      {Array.from({length: WOCHEN}, (_, w) => {
        const f = fuellung[w];
        return (
          <div key={w} style={{position: 'absolute', left: feldX(w), top: feldY(w), width: FELD, height: FELD, opacity: raster}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 14, border: `3px solid ${DATEN.linie}`, backgroundColor: DATEN.papier}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: DATEN.neutral, opacity: 1 - f}}>
              {w + 1}
            </div>
            {f > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 14,
                  backgroundColor: DATEN.rot,
                  transform: `scale(${(0.55 + 0.45 * f).toFixed(3)})`,
                  opacity: Math.min(1, f * 1.6),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 800,
                  color: DATEN.papier,
                  whiteSpace: 'nowrap',
                }}
              >
                {euroText(PRO_WOCHE)}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Monatsklammer unter den ersten 4 Wochen */}
      <div
        style={{
          position: 'absolute',
          left: RASTER_LINKS,
          top: RASTER_OBEN + RASTER.hoehe + 18,
          width: FELD,
          height: 18,
          borderLeft: `4px solid ${DATEN.rot}`,
          borderRight: `4px solid ${DATEN.rot}`,
          borderBottom: `4px solid ${DATEN.rot}`,
          borderRadius: '0 0 8px 8px',
          opacity: klammer,
        }}
      />
      <div style={{position: 'absolute', left: RASTER_LINKS, top: RASTER_OBEN + RASTER.hoehe + 72, transform: `translateY(-50%) translateY(${((1 - klammer) * 10).toFixed(1)}px)`, opacity: klammer, whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 18}}>
        <span style={{fontSize: 40, fontWeight: 900, color: DATEN.rot}}>über {euroText(PRO_SPALTE * PRO_WOCHE)} im Monat</span>
        <span style={{fontSize: 28, fontWeight: 700, color: DATEN.leise}}>1 Monat ≈ 4,3 Wochen</span>
      </div>
    </DatenBuehne>
  );
};
