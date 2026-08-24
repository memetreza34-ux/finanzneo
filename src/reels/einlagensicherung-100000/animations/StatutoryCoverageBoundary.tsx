import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, a, prog} from '../../../brand';
import {Chip, VISUAL_CENTER_Y} from './shared';

// Szene 06 — Start: Gesamtwert-Balken 110.000 € (neutral).
// Mechanismus: grüner Füllstrom läuft bis exakt 100.000 € auf, Rest bleibt
// außerhalb der Füllung und wird Rot-Orange markiert.
// Ergebnis: 100.000 € GESETZLICH (grün) / 10.000 € ÜBER DER GESETZLICHEN
// DECKUNG (rot-orange). Bewusst nicht "ungeschützt".
const TOTAL = 110000;
const LIMIT = 100000;
const BAR_WIDTH = 780;
const LIMIT_RATIO = LIMIT / TOTAL;

export const StatutoryCoverageBoundary: React.FC<{durationFrames: number}> = ({durationFrames}) => {
  const frame = useCurrentFrame();
  const mechStart = Math.round(durationFrames * 0.26);
  const mechEnd = Math.round(durationFrames * 0.66);
  const resultAt = mechEnd + 4;

  const fill = prog(frame, mechStart, mechEnd);
  const greenWidth = BAR_WIDTH * LIMIT_RATIO * fill;
  const overflowReveal = prog(frame, mechEnd - 6, mechEnd + 4);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y - 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <div style={{fontFamily: FONT.body, fontWeight: 800, color: C.whiteSoft, fontSize: 26, letterSpacing: 2}}>
          GESAMTGUTHABEN 110.000 €
        </div>

        <div style={{position: 'relative', width: BAR_WIDTH, height: 96, borderRadius: 26, background: a(C.white, 0.08), border: `2px solid ${a(C.white, 0.22)}`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: greenWidth, background: a(C.accent, 0.55), borderRight: `3px solid ${C.accentLt}`}} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: BAR_WIDTH * (1 - LIMIT_RATIO),
            background: a(C.negative, 0.4 * overflowReveal), borderLeft: overflowReveal > 0.05 ? `2px dashed ${a(C.negativeLt, 0.7)}` : 'none',
          }} />
          <div style={{
            position: 'absolute', left: BAR_WIDTH * LIMIT_RATIO - 1, top: -8, bottom: -8, width: 3,
            background: C.white, opacity: fill > 0.02 ? 1 : 0,
          }} />
        </div>

        <div style={{display: 'flex', gap: 18, opacity: prog(frame, resultAt, resultAt + 10)}}>
          <Chip label="100.000 € GESETZLICH" tone={C.accentLt} />
          <Chip label="10.000 € ÜBER DER GESETZLICHEN DECKUNG" tone={C.negativeLt} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
