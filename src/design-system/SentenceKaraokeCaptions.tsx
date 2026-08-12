import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand';
import type {CaptionWord} from '../lib/captions';

type TimedSentence = {id: string; words: CaptionWord[]};
type IndexedWord = CaptionWord & {index: number};

const splitSentences = (words: CaptionWord[]): TimedSentence[] => {
  const result: TimedSentence[] = [];
  let current: CaptionWord[] = [];
  for (const word of words) {
    current.push(word);
    if (/[.!?…][\"'»”)]?$/.test(word.word)) {
      result.push({id: `sentence-${result.length + 1}`, words: current});
      current = [];
    }
  }
  if (current.length) result.push({id: `sentence-${result.length + 1}`, words: current});
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
 * Exactly one spoken sentence at a time. Maximum two visual lines.
 * No opaque caption card: readability comes from text shadow and the scene's
 * continuous readability scrim, so captions do not create a third background.
 */
export const SentenceKaraokeCaptions: React.FC<SentenceKaraokeCaptionsProps> = ({
  words,
  bottom = 320,
  left = 72,
  right = 180,
  highlight = C.accentLt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const sentences = React.useMemo(() => splitSentences(words), [words]);
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
  // V17 requirement: min 42px font size. (Max chars ~68 means 42px is applied for the longest ones)
  const fontSize = longest > 60 ? 42 : longest > 48 ? 44 : longest > 40 ? 46 : 50;

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
        letterSpacing: -0.45,
        color: C.white,
        textShadow: '0 3px 6px rgba(0,0,0,.98), 0 0 20px rgba(0,0,0,.88)',
      }}
    >
      {lines.map((line, lineIndex) => (
        <div key={`${sentence.id}-${lineIndex}`} style={{whiteSpace: 'nowrap', marginTop: lineIndex ? 6 : 0}}>
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
