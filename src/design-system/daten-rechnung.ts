// Reine Rechenlogik des YouTube-Daten-Baukastens (daten.tsx) — ohne React,
// damit sie ohne Browser testbar ist.
//
// Grundsatz: Kein Baustein setzt eine Größe von Hand. Höhen, Breiten und
// Punktzahlen entstehen aus den Werten über `skala`; das Zählwerk zeigt genau
// den Wert, den der Text darunter nennt.

import {E} from '../brand/tokens';

export const begrenzen = (wert: number, min: number, max: number) => Math.max(min, Math.min(max, wert));

/** Deutscher Eurobetrag: 119,88 € · 3.000 € · −800 €. */
export const euroText = (wert: number, nachkomma = 0, vorzeichen = false) => {
  const text = Math.abs(wert).toLocaleString('de-DE', {minimumFractionDigits: nachkomma, maximumFractionDigits: nachkomma});
  const zeichen = wert < 0 ? '−' : vorzeichen && wert > 0 ? '+' : '';
  return `${zeichen}${text} €`;
};

/** Deutsche Zahl ohne Einheit: 11.988 · 7,5. */
export const zahlText = (wert: number, nachkomma = 0) =>
  wert.toLocaleString('de-DE', {minimumFractionDigits: nachkomma, maximumFractionDigits: nachkomma});

export type Skala = {max: number; schritt: number; striche: number[]};

/**
 * Runde Achse für einen Höchstwert: 1, 2, 2,5 oder 5 × 10^n als Schritt,
 * 3–6 Striche. Der Höchstwert liegt immer innerhalb der Skala.
 */
export const schoeneSkala = (hoechstwert: number, zielStriche = 4): Skala => {
  const roh = Math.max(hoechstwert, 1e-9) / zielStriche;
  const zehner = 10 ** Math.floor(Math.log10(roh));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * zehner).find((s) => s >= roh) ?? 10 * zehner;
  const max = Math.ceil(hoechstwert / schritt - 1e-9) * schritt;
  const striche: number[] = [];
  for (let wert = 0; wert <= max + schritt / 2; wert += schritt) striche.push(Number(wert.toFixed(10)));
  return {max, schritt, striche};
};

/** Lineare Abbildung Wert → Pixel. 0 € hat immer 0 px. */
export const skala = (max: number, pixel: number) => (wert: number) => (max <= 0 ? 0 : (wert / max) * pixel);

export type Station = {ab: number; wert: number};

/**
 * Wert zu einem Frame aus Stationen: Ab `ab` gleitet der Wert in `dauer`
 * Frames zum Stationswert und bleibt dort, bis die nächste Station beginnt.
 * Vor der ersten Station gilt `start`.
 */
export const wertBeiStationen = (frame: number, stationen: Station[], start = 0, dauer = 24) => {
  let wert = start;
  for (const station of [...stationen].sort((x, y) => x.ab - y.ab)) {
    if (frame <= station.ab) break;
    const p = E.inOut(begrenzen((frame - station.ab) / Math.max(1, dauer), 0, 1));
    wert = wert + (station.wert - wert) * p;
  }
  return wert;
};

export type ZaehlStelle = {
  /** 0 = letzte angezeigte Stelle (bei Cent die Hundertstel). */
  stelle: number;
  /** Position auf dem Ziffernband 0–10; ganzzahlig, sobald die Zahl steht. */
  position: number;
  /** 1 = sichtbar; dazwischen, während eine neue führende Stelle hereinrollt. */
  sichtbarkeit: number;
};

/**
 * Stellen eines mechanischen Zählwerks. `einheiten` ist der Wert in kleinster
 * Anzeigeeinheit (bei Cent-Anzeige: Cent). Eine Ziffer steht still und rollt
 * erst im letzten Viertel weiter; eine höhere Stelle dreht nur mit, wenn alle
 * darunter auf 9 stehen. `minStellen` erzwingt führende Nullen (0,99 €).
 */
export const zaehlStellen = (einheiten: number, minStellen = 1): ZaehlStelle[] => {
  const aktuell = Math.max(0, einheiten);
  const ganz = Math.floor(aktuell + 1e-9);
  const schritt = E.inOut(begrenzen((aktuell - ganz - 0.75) / 0.25, 0, 1));
  const oben = Math.max(minStellen - 1, Math.floor(Math.log10(Math.max(1, ganz))) + 1);
  const ergebnis: ZaehlStelle[] = [];
  for (let stelle = oben; stelle >= 0; stelle--) {
    const einheit = 10 ** stelle;
    const uebertrag = stelle === 0 || ganz % einheit === einheit - 1 ? schritt : 0;
    const sichtbar = ganz >= einheit || stelle < minStellen;
    if (!sichtbar && uebertrag === 0) continue;
    ergebnis.push({stelle, position: (Math.floor(ganz / einheit) % 10) + uebertrag, sichtbarkeit: sichtbar ? 1 : uebertrag});
  }
  return ergebnis;
};
