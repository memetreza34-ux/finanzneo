import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../tokens';
import {FONT} from '../fonts';
import type {CaptionWord} from '../../lib/captions';

export type {CaptionWord} from '../../lib/captions';

// ════════════════════════════════════════════════════════════════════════════
//  UNTERTITEL V2 — satzbasiert, stabil und mobil lesbar.
//  - aktuelles Wort IMMER FinanzNeo-grün
//  - restliche Wörter IMMER weiß
//  - keine gelben Active-Words
//  - kein Word-Jump, kein Scale-Pop
//  - kurze Pausen halten die vorherige Caption sichtbar
// ════════════════════════════════════════════════════════════════════════════

const MAX_WORDS = 12;
const MAX_CHARS = 68;
const HOLD_SECONDS = 0.34;
const SENTENCE_END = /[.!?…][\]})"'»”]*$/;

type CaptionUnit = {
  words: CaptionWord[];
  start: number;
  end: number;
};

const charsFor = (words: CaptionWord[]) =>
  words.reduce((sum, word, index) => sum + word.word.length + (index === 0 ? 0 : 1), 0);

const buildCaptionUnits = (words: CaptionWord[]): CaptionUnit[] => {
  const units: CaptionUnit[] = [];
  let current: CaptionWord[] = [];

  const pushCurrent = () => {
    if (!current.length) return;
    units.push({
      words: current,
      start: current[0].start,
      end: current[current.length - 1].end,
    });
    current = [];
  };

  words.forEach((word, index) => {
    const projected = current.length ? [...current, word] : [word];
    if (current.length && (current.length >= MAX_WORDS || charsFor(projected) > MAX_CHARS)) {
      pushCurrent();
    }

    current.push(word);

    const next = words[index + 1];
    const pauseAfter = next ? Math.max(0, next.start - word.end) : Number.POSITIVE_INFINITY;
    const hardBoundary = SENTENCE_END.test(word.word) || pauseAfter >= HOLD_SECONDS;

    if (hardBoundary || current.length >= MAX_WORDS || charsFor(current) >= MAX_CHARS) {
      pushCurrent();
    }
  });

  pushCurrent();
  return units;
};

export const Captions: React.FC<{
  words: CaptionWord[];
  /** Legacy prop: bleibt nur API-kompatibel; V2 gruppiert satzbasiert. */
  perGroup?: number;
  fps?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size?: number;
  /** Legacy prop: wird absichtlich ignoriert; Active-Word ist immer FinanzNeo-grün. */
  highlight?: string;
  /** Legacy prop: wird absichtlich ignoriert; normaler Text ist immer weiß. */
  color?: string;
  background?: boolean;
}> = ({
  words,
  fps = 30,
  bottom = 320,
  left = 62,
  right = 150,
  size = 58,
  background = true,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const effectiveFps = cfg?.fps ?? fps;
  const t = frame / effectiveFps;
  const units = useMemo(() => buildCaptionUnits(words), [words]);

  const unit = units.find((entry, index) => {
    const next = units[index + 1];
    const visibleEnd = next
      ? Math.min(entry.end + HOLD_SECONDS, next.start)
      : entry.end + HOLD_SECONDS;
    return t >= entry.start && t <= visibleEnd;
  });

  if (!unit) return null;

  const charCount = charsFor(unit.words);
  const fittedSize = Math.max(44, Math.min(size, charCount > 60 ? size - 10 : charCount > 48 ? size - 5 : size));

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left,
        right,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          columnGap: 12,
          rowGap: 3,
          padding: background ? '12px 20px 14px' : 0,
          borderRadius: 24,
          background: background ? 'rgba(4, 18, 10, 0.58)' : 'transparent',
          border: background ? '1px solid rgba(92, 255, 173, 0.10)' : 'none',
          boxShadow: background ? '0 12px 36px rgba(0, 0, 0, 0.20)' : 'none',
          textAlign: 'center',
          fontFamily: FONT.body,
          fontWeight: 900,
          fontSize: fittedSize,
          lineHeight: 1.16,
        }}
      >
        {unit.words.map((word, index) => {
          const active = t >= word.start && t <= word.end + 0.04;
          return (
            <span
              key={`${word.start}-${index}`}
              style={{
                color: active ? C.accent : C.white,
                display: 'inline-block',
                textShadow: active
                  ? '0 0 18px rgba(0, 210, 106, 0.42), 0 4px 12px rgba(0,0,0,0.88)'
                  : '0 4px 12px rgba(0,0,0,0.88)',
                WebkitTextStroke: '1.4px rgba(0,0,0,0.46)',
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const CaptionsBoxed: React.FC<React.ComponentProps<typeof Captions>> = (props) => (
  <div>
    <Captions {...props} background />
  </div>
);
