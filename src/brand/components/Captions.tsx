import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, E, prog, a} from '../tokens';
import {FONT} from '../fonts';
import type {CaptionWord} from '../../lib/captions';

export type {CaptionWord} from '../../lib/captions';

// ════════════════════════════════════════════════════════════════════════════
//  UNTERTITEL — TikTok/Shorts-Style, wortgenau.
//  Daten: normalisiertes Array von {word,start,end} aus src/lib/captions.ts.
//  Zeigt 3–4 Wörter gleichzeitig und hebt das aktuell gesprochene Wort hervor.
// ════════════════════════════════════════════════════════════════════════════

const chunk = (words: CaptionWord[], size: number): CaptionWord[][] => {
  const safeSize = Math.max(1, Math.floor(size));
  const out: CaptionWord[][] = [];
  for (let i = 0; i < words.length; i += safeSize) out.push(words.slice(i, i + safeSize));
  return out;
};

export const Captions: React.FC<{
  words: CaptionWord[];
  perGroup?: number;
  fps?: number;
  bottom?: number;
  size?: number;
  highlight?: string;
  color?: string;
}> = ({
  words,
  perGroup = 3,
  fps = 30,
  bottom = 360,
  size = 72,
  highlight = C.accent,
  color = C.white,
}) => {
  const f = useCurrentFrame();
  const cfg = useVideoConfig();
  const effectiveFps = cfg?.fps ?? fps;
  const t = f / effectiveFps;
  const groups = chunk(words, perGroup);

  const group = groups.find(
    (entry) => entry.length > 0 && t >= entry[0].start && t <= entry[entry.length - 1].end + 0.15,
  );

  if (!group) return null;

  const popIn = prog(f, group[0].start * effectiveFps, group[0].start * effectiveFps + 4, E.spring);

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 60,
        right: 60,
        textAlign: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 16px',
        fontFamily: FONT.body,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.2,
        transform: `scale(${0.9 + popIn * 0.1})`,
      }}
    >
      {group.map((word, index) => {
        const active = t >= word.start && t <= word.end + 0.05;
        return (
          <span
            key={`${word.start}-${index}`}
            style={{
              color: active ? highlight : color,
              transform: active ? 'translateY(-6px)' : 'none',
              textShadow: active
                ? `0 0 24px ${a(highlight, 0.6)}, 0 4px 12px rgba(0,0,0,0.9)`
                : '0 4px 12px rgba(0,0,0,0.9)',
              transition: 'none',
              display: 'inline-block',
              WebkitTextStroke: `2px ${a('#000000', 0.5)}`,
            }}
          >
            {word.word}
          </span>
        );
      })}
    </div>
  );
};

export const CaptionsBoxed: React.FC<React.ComponentProps<typeof Captions>> = (props) => (
  <div>
    <Captions {...props} />
  </div>
);
