import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, REEL_STYLE} from '../tokens';
import {FONT} from '../fonts';
import type {CaptionWord} from '../../lib/captions';

export type {CaptionWord} from '../../lib/captions';

// FINANZNEO CAPTIONS V4
// Scharfe, mobil lesbare Untertitel: ganze Phrase, aktives Wort grün, Rest weiß.
// Alle Maße kommen aus REEL_STYLE.caption — hier stehen bewusst keine eigenen
// Zahlen mehr, damit jedes Reel im Repo denselben Untertitel-Look erbt.
const S = REEL_STYLE.caption;
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
    if (current.length && (current.length >= S.maxWords || charsFor(projected) > S.maxChars)) push();
    current.push(word);

    const next = words[index + 1];
    const pauseAfter = next ? Math.max(0, next.start - word.end) : Number.POSITIVE_INFINITY;
    if (SENTENCE_END.test(word.word) || pauseAfter >= S.holdSeconds || current.length >= S.maxWords || charsFor(current) >= S.maxChars) push();
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
  bottom = S.bottom,
  left = S.left,
  right = S.right,
  size = S.fontSize,
  background = true,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const t = frame / (cfg?.fps ?? fps);
  const units = useMemo(() => buildCaptionUnits(words), [words]);

  const unit = units.find((entry, index) => {
    const next = units[index + 1];
    const visibleEnd = next ? Math.min(entry.end + S.holdSeconds, next.start) : entry.end + S.holdSeconds;
    return t >= entry.start && t <= visibleEnd;
  });

  if (!unit) return null;

  const charCount = charsFor(unit.words);
  const fittedSize = Math.max(
    S.minFontSize,
    Math.min(size, charCount > 46 ? size - 6 : charCount > 38 ? size - 3 : size),
  );

  return (
    <div style={{position: 'absolute', bottom, left, right, zIndex: 60, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{
        maxWidth: S.maxWidth,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        columnGap: 10,
        rowGap: 2,
        padding: background ? '12px 20px 14px' : 0,
        borderRadius: 16,
        background: background ? 'rgba(4, 15, 9, 0.82)' : 'transparent',
        border: background ? '1px solid rgba(255,255,255,0.08)' : 'none',
        boxShadow: background ? '0 6px 18px rgba(0,0,0,0.30)' : 'none',
        textAlign: 'center',
        fontFamily: FONT.body,
        fontWeight: S.fontWeight,
        fontSize: fittedSize,
        lineHeight: S.lineHeight,
        letterSpacing: S.letterSpacing,
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
      }}>
        {unit.words.map((word, index) => {
          const active = t >= word.start && t <= word.end + 0.035;
          return (
            <span key={`${word.start}-${index}`} style={{
              color: active ? C.accentLt : C.white,
              display: 'inline-block',
              textShadow: S.textShadow,
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
