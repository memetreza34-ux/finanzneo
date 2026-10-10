import React from 'react';
import {Freeze, interpolate, useCurrentFrame} from 'remotion';
import {ABO_JAHR_FRAMES, ABO_JAHR_MARKEN, AboJahr} from '../../../../../src/youtube-motion/szenen/AboJahr';

export const MECHANIC_ID = 'card-to-chip-monthly-stack-merge';
export const VISUAL_TECHNIQUE_ID = 'magic-move-calendar-year-bar';
export const COMPOSITION_FAMILY_ID = 'single-object-transformation';

/**
 * ANIMATION_NARRATIVE
 * START: Abbuchungskarte „Streaming-Abo −9,99 €“.
 * MECHANISM: Karte schrumpft zum Januar-Chip; jeden Monat fällt ein Chip unter
 *   seinem Monat in den Jahresbalken; der Zähler springt beim Landen.
 * RESULT: Zwölf Chips verschmelzen, Klammer „12 Abbuchungen × 9,99 €“, große Summe 119,88 €.
 *
 * Zeit: Die Referenzszene AboJahr läuft in ihrer eigenen Zeit; hier wird sie auf
 * die gesprochenen Beats umgerechnet (Freeze je Frame = Zeitverzerrung ohne Codeänderung).
 */
export const ANIMATION_NARRATIVE = {
  START: 'Abbuchungskarte Streaming-Abo −9,99 €',
  MECHANISM: 'Karte wird Januar-Chip, zwölf Chips fallen in den Jahresbalken, Zähler springt beim Landen',
  RESULT: 'Chips verschmelzen zu 119,88 € für ein einziges Abo',
};

// beats: [Karte, „nicht einmal“ → Karte wird Chip, „zwölfmal“ → Monate laufen, „hundertneunzehn“ → Verschmelzen]
const PREVIEW_BEATS = [0, 90, 150, 240];

export const YouTubeVisual01Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  // Streng steigende Stützstellen, auch wenn Beats sehr dicht liegen.
  const b1 = Math.max(at(1), at(0) + 20);
  const b2 = Math.max(at(2), b1 + 18);
  const b3 = Math.max(at(3), b2 + 60);
  const szene = interpolate(
    frame,
    [at(0), b1, b1 + 20, b2, b3, b3 + 45],
    [ABO_JAHR_MARKEN.karte, ABO_JAHR_MARKEN.morph, ABO_JAHR_MARKEN.morph + 20, ABO_JAHR_MARKEN.monate, ABO_JAHR_MARKEN.verschmelzen, ABO_JAHR_MARKEN.ergebnis],
    {extrapolateLeft: 'clamp', extrapolateRight: 'extend'},
  );
  return (
    <Freeze frame={Math.min(ABO_JAHR_FRAMES - 1, Math.round(szene))}>
      <AboJahr />
    </Freeze>
  );
};
