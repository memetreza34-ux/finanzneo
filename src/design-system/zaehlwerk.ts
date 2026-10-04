// Reine Zählwerk-Logik ohne React — damit sie ohne Browser testbar ist.
// Genutzt von `Zaehlwerk` in flache-daten.tsx.

import {E} from '../brand/tokens';

const begrenzen = (wert: number, min: number, max: number) => Math.max(min, Math.min(max, wert));

export type ZaehlwerkStelle = {
  /** 0 = Einer, 3 = Tausender … */
  stelle: number;
  /** Position auf dem Ziffernband 0–10; ganzzahlig, sobald die Zahl steht. */
  position: number;
  /** 1 = sichtbar; dazwischen, während eine neue führende Stelle hereinrollt. */
  sichtbarkeit: number;
};

/**
 * Stellen eines mechanischen Zählwerks für einen Wert.
 *
 * Eine Ziffer steht still und rollt erst im letzten Viertel zur nächsten; eine
 * höhere Stelle dreht nur mit, wenn alle darunter auf 9 stehen. Für eine ganze
 * Zahl sind alle Positionen ganzzahlig — keine halb gedrehte Ziffer.
 */
export const zaehlwerkStellen = (wert: number): ZaehlwerkStelle[] => {
  const aktuell = Math.max(0, wert);
  const ganz = Math.floor(aktuell);
  const schritt = E.inOut(begrenzen((aktuell - ganz - 0.75) / 0.25, 0, 1));
  const stellen = Math.max(1, Math.floor(Math.log10(Math.max(1, ganz))) + 1);
  const ergebnis: ZaehlwerkStelle[] = [];
  for (let stelle = stellen; stelle >= 0; stelle--) {
    const einheit = 10 ** stelle;
    const uebertrag = stelle === 0 || ganz % einheit === einheit - 1 ? schritt : 0;
    const sichtbar = ganz >= einheit || stelle === 0;
    if (!sichtbar && uebertrag === 0) continue;
    ergebnis.push({stelle, position: (Math.floor(ganz / einheit) % 10) + uebertrag, sichtbarkeit: sichtbar ? 1 : uebertrag});
  }
  return ergebnis;
};
