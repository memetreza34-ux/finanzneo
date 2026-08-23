import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../tokens';
import {FONT} from '../fonts';
import type {CaptionWord} from '../../lib/captions';

export type {CaptionWord} from '../../lib/captions';

// FINANZNEO CAPTIONS V3
// Crisp mobile-first subtitles: full phrase, active word green, rest white.
// No glow blur, no word jump, no scale pop, no yellow karaoke.
const MAX_WORDS = 10;
const MAX_CHARS = 58;
const HOLD_SECONDS = 0.38;
const SENTENCE_END = /[.!?…][\]})"'»”]*$/;

type CaptionUnit = {words: CaptionWord[]; start: number; end: number};

const charsFor = (words: CaptionWord[]) =>
  words.reduce((sum, word, index) => sum + word.word.length + (index === 0 ? 0 : 1), 0);

const buildCaptionUnits = (words: CaptionWord[]): CaptionUnit[] => {
  const units: CaptionUnit[] = [];
  let current: CaptionWord[] = [];

  const push = () => {
    if (!current.length) return;
    units.push({words: current, start: current[0].start, end: current[current.length - 1].end});
    current = [];
  };

  words.forEach((word, index) => {
    const projected = current.length ? [...current, word] : [word];
    if (current.length && (current.length >= MAX_WORDS || charsFor(projected) > MAX_CHARS)) push();
    current.push(word);

    const next = words[index + 1];
    const pauseAfter = next ? Math.max(0, next.start - word.end) : Number.POSITIVE_INFINITY;
    if (SENTENCE_END.test(word.word) || pauseAfter >= HOLD_SECONDS || current.length >= MAX_WORDS || charsFor(current) >= MAX_CHARS) push();
  });

  push();
  return units;
};

export const Captions: React.FC<{
  words: CaptionWord[];
  perGroup?: number;
  fps?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size?: number;
  highlight?: string;
  color?: string;
  background?: boolean;
}> = ({
  words,
  fps = 30,
  bottom = 285,
  left = 72,
  right = 140,
  size = 64,
  background = true,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const t = frame / (cfg?.fps ?? fps);
  const units = useMemo(() => buildCaptionUnits(words), [words]);

  const unit = units.find((entry, index) => {
    const next = units[index + 1];
    const visibleEnd = next ? Math.min(entry.end + HOLD_SECONDS, next.start) : entry.end + HOLD_SECONDS;
    return t >= entry.start && t <= visibleEnd;
  });

  if (!unit) return null;

  const charCount = charsFor(unit.words);
  const fittedSize = Math.max(50, Math.min(size, charCount > 52 ? size - 8 : charCount > 44 ? size - 4 : size));

  return (
    <div style={{position: 'absolute', bottom, left, right, zIndex: 60, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{
        maxWidth: 820,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        columnGap: 11,
        rowGap: 2,
        padding: background ? '13px 22px 15px' : 0,
        borderRadius: 20,
        background: background ? 'rgba(3, 14, 8, 0.86)' : 'transparent',
        border: background ? '1px solid rgba(255,255,255,0.12)' : 'none',
        boxShadow: background ? '0 8px 22px rgba(0,0,0,0.34)' : 'none',
        textAlign: 'center',
        fontFamily: FONT.body,
        fontWeight: 900,
        fontSize: fittedSize,
        lineHeight: 1.08,
        letterSpacing: '-0.4px',
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
      }}>
        {unit.words.map((word, index) => {
          const active = t >= word.start && t <= word.end + 0.035;
          return (
            <span key={`${word.start}-${index}`} style={{
              color: active ? C.accentLt : C.white,
              display: 'inline-block',
              textShadow: '0 2px 1px rgba(0,0,0,0.96)',
              WebkitTextStroke: '1.6px rgba(0,0,0,0.78)',
            }}>
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const CaptionsBoxed: React.FC<React.ComponentProps<typeof Captions>> = (props) => (
  <div><Captions {...props} background /></div>
);
