import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand';
import type {CaptionWord} from '../lib/captions';

type TimedSentence = {id: string; words: CaptionWord[]};
type IndexedWord = CaptionWord & {index: number};

const MAX_WORDS = 12;
const MAX_CHARS = 72;
const MIN_FONT_SIZE = 42;
const MAX_FONT_SIZE = 50;

const textLength = (words: CaptionWord[]) => words.map((word) => word.word).join(' ').length;
const isHardEnd = (word: string) => /[.!?…][\"'»”)]?$/.test(word);
const isSoftBreak = (word: string) => /[,;:–—-][\"'»”)]?$/.test(word);

const splitCaptionUnits = (words: CaptionWord[]): TimedSentence[] => {
  const result: TimedSentence[] = [];
  let current: CaptionWord[] = [];

  const push = (unit: CaptionWord[]) => {
    if (!unit.length) return;
    result.push({id: `caption-${result.length + 1}`, words: unit});
  };

  for (const word of words) {
    current.push(word);

    if (isHardEnd(word.word)) {
      push(current);
      current = [];
      continue;
    }

    if (current.length >= MAX_WORDS || textLength(current) >= MAX_CHARS) {
      let splitAt = -1;
      for (let i = current.length - 2; i >= 5; i -= 1) {
        if (isSoftBreak(current[i].word)) {
          splitAt = i + 1;
          break;
        }
      }

      if (splitAt > 0) {
        push(current.slice(0, splitAt));
        current = current.slice(splitAt);
      } else {
        push(current);
        current = [];
      }
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
 * One short spoken caption unit at a time, never two units simultaneously.
 * Long spoken sentences are split sequentially at a natural break when possible.
 * Maximum two visual lines, minimum 42px effective font, real word timing only.
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
