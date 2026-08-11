import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand';
import type {CaptionWord} from '../lib/captions';

type TimedSentence = {id: string; words: CaptionWord[]};
type IndexedWord = CaptionWord & {index: number};

const MAX_WORDS = 12;
const MAX_CHARS = 68;
const MIN_FONT_SIZE = 42;
const MAX_FONT_SIZE = 50;
const NATURAL_PAUSE_SECONDS = 0.34;

const textLength = (words: CaptionWord[]) => words.map((word) => word.word).join(' ').length;
const isHardEnd = (word: string) => /[.!?…][\"'»”)]?$/.test(word);
const isSoftBreak = (word: string) => /[,;:–—-][\"'»”)]?$/.test(word);

const findPreferredBreak = (words: CaptionWord[]): number => {
  for (let i = words.length - 1; i >= 4; i -= 1) {
    if (isSoftBreak(words[i - 1].word)) return i;
  }
  return -1;
};

const splitCaptionUnits = (words: CaptionWord[]): TimedSentence[] => {
  const result: TimedSentence[] = [];
  let current: CaptionWord[] = [];

  const push = (unit: CaptionWord[]) => {
    if (!unit.length) return;
    result.push({id: `caption-${result.length + 1}`, words: unit});
  };

  for (const word of words) {
    const previous = current[current.length - 1];
    const pauseBefore = previous ? Math.max(0, word.start - previous.end) : 0;

    if (
      current.length >= 4 &&
      pauseBefore >= NATURAL_PAUSE_SECONDS
    ) {
      push(current);
      current = [];
    }

    const prospective = [...current, word];
    const wouldOverflow = prospective.length > MAX_WORDS || textLength(prospective) > MAX_CHARS;

    if (current.length && wouldOverflow) {
      const preferredBreak = findPreferredBreak(current);

      if (preferredBreak > 0 && preferredBreak < current.length) {
        push(current.slice(0, preferredBreak));
        current = current.slice(preferredBreak);
      } else {
        push(current);
        current = [];
      }
    }

    current.push(word);

    if (current.length > MAX_WORDS || textLength(current) > MAX_CHARS) {
      throw new Error(
        `Single caption unit cannot satisfy ${MAX_WORDS} words / ${MAX_CHARS} characters: "${current.map((item) => item.word).join(' ')}"`,
      );
    }

    if (isHardEnd(word.word)) {
      push(current);
      current = [];
    }
  }

  push(current);
  return result;
};

const balance = (words: CaptionWord[]): IndexedWord[][] => {
  const indexed = words.map((word, index) => ({...word, index}));
  if (words.length < 5) return [indexed];

  let best = Math.ceil(words.length / 2);
  let score = Infinity;
  for (let split = 2; split <= words.length - 2; split += 1) {
    const left = words.slice(0, split).map((w) => w.word).join(' ').length;
    const right = words.slice(split).map((w) => w.word).join(' ').length;
    const next = Math.max(left, right) * 2 + Math.abs(left - right);
    if (next < score) {
      score = next;
      best = split;
    }
  }
  return [indexed.slice(0, best), indexed.slice(best)];
};

export type SentenceKaraokeCaptionsProps = {
  words: CaptionWord[];
  bottom?: number;
  left?: number;
  right?: number;
  highlight?: string;
};

/**
 * One short spoken caption unit at a time.
 * Units prefer real sentence endings and actual speech pauses, and split before
 * they can exceed the safe word/character contract. Real word timing drives
 * both unit switches and the active-word highlight.
 */
export const SentenceKaraokeCaptions: React.FC<SentenceKaraokeCaptionsProps> = ({
  words,
  bottom = 320,
  left = 72,
  right = 180,
  highlight = C.accentLt,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const time = frame / fps;
  const sentences = React.useMemo(() => splitCaptionUnits(words), [words]);
  if (!sentences.length || time < sentences[0].words[0].start) return null;

  let sentenceIndex = 0;
  for (let i = 1; i < sentences.length; i += 1) {
    if (time >= sentences[i].words[0].start) sentenceIndex = i;
    else break;
  }

  const sentence = sentences[sentenceIndex];
  const lines = balance(sentence.words);

  let active = -1;
  for (let i = 0; i < sentence.words.length; i += 1) {
    if (time >= sentence.words[i].start && time < sentence.words[i].end) {
      active = i;
      break;
    }
  }

  const longest = Math.max(...lines.map((line) => line.map((w) => w.word).join(' ').length));
  const availableWidth = Math.max(1, width - left - right);
  const estimatedFit = Math.floor(availableWidth / Math.max(1, longest * 0.56));
  const fontSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, estimatedFit));

  if (estimatedFit < MIN_FONT_SIZE) {
    throw new Error(
      `Caption unit too wide for safe area at ${MIN_FONT_SIZE}px: "${sentence.words.map((w) => w.word).join(' ')}"`,
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left,
        right,
        bottom,
        zIndex: 100,
        textAlign: 'center',
        fontFamily: FONT.body,
        fontWeight: 900,
        fontSize,
        lineHeight: 1.12,
        letterSpacing: -0.35,
        color: C.white,
        textShadow: '0 3px 6px rgba(0,0,0,.98), 0 0 20px rgba(0,0,0,.88)',
      }}
    >
      {lines.map((line, lineIndex) => (
        <div
          key={`${sentence.id}-${lineIndex}`}
          style={{
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            marginTop: lineIndex ? 6 : 0,
          }}
        >
          {line.map((word, position) => (
            <React.Fragment key={`${sentence.id}-${word.index}`}>
              {position ? ' ' : null}
              <span
                style={{
                  color: word.index === active ? highlight : C.white,
                  textShadow:
                    word.index === active
                      ? `0 0 18px ${C.accent}, 0 3px 6px rgba(0,0,0,.98)`
                      : '0 3px 6px rgba(0,0,0,.98), 0 0 20px rgba(0,0,0,.88)',
                }}
              >
                {word.word}
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};
