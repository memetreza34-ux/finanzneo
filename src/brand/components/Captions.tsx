import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, E, prog, a } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  UNTERTITEL — TikTok/Shorts-Style, wortgenau.
//  Daten: Array von { word, start, end } (Sekunden) — aus Whisper.
//  Zeigt 3–4 Wörter gleichzeitig, hebt das aktuell gesprochene hervor.
// ════════════════════════════════════════════════════════════════════════════

export type CaptionWord = { word: string; start: number; end: number };

const chunk = (words: CaptionWord[], size: number): CaptionWord[][] => {
  const out: CaptionWord[][] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size));
  return out;
};

export const Captions: React.FC<{
  words: CaptionWord[];
  perGroup?: number;          // Wörter pro Einblendung (3–4)
  fps?: number;
  bottom?: number;
  size?: number;
  highlight?: string;         // Farbe des aktiven Worts
  color?: string;
}> = ({ words, perGroup = 3, fps = 30, bottom = 360, size = 72, highlight = C.accent, color = C.white }) => {
  const f = useCurrentFrame();
  const cfg = useVideoConfig();
  const t = f / (cfg?.fps ?? fps);
  const groups = chunk(words, perGroup);

  // aktive Gruppe finden
  const g = groups.find((grp) => t >= grp[0].start && t <= grp[grp.length - 1].end + 0.15);
  if (!g) return null;

  const popIn = prog(f, g[0].start * (cfg?.fps ?? fps), g[0].start * (cfg?.fps ?? fps) + 4, E.spring);

  return (
    <div style={{ position: 'absolute', bottom, left: 60, right: 60, textAlign: 'center',
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px',
      fontFamily: FONT.body, fontWeight: 900, fontSize: size, lineHeight: 1.2,
      transform: `scale(${0.9 + popIn * 0.1})` }}>
      {g.map((w, i) => {
        const active = t >= w.start && t <= w.end + 0.05;
        return (
          <span key={i} style={{
            color: active ? highlight : color,
            transform: active ? 'translateY(-6px)' : 'none',
            textShadow: active
              ? `0 0 24px ${a(highlight, 0.6)}, 0 4px 12px rgba(0,0,0,0.9)`
              : '0 4px 12px rgba(0,0,0,0.9)',
            transition: 'none', display: 'inline-block',
            WebkitTextStroke: `2px ${a('#000000', 0.5)}`,
          }}>{w.word}</span>
        );
      })}
    </div>
  );
};

// Box-Variante (mit Hintergrund-Pille hinter den Wörtern)
export const CaptionsBoxed: React.FC<React.ComponentProps<typeof Captions>> = (props) => (
  <div>
    <Captions {...props} />
  </div>
);
