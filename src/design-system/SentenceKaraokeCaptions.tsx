import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand';
import type {CaptionWord} from '../lib/captions';

type TimedSentence = {
  id: string;
  words: CaptionWord[];
};

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

  if (current.length > 0) result.push({id: `sentence-${result.length + 1}`, words: current});
  return result;
};

const balance = (words: CaptionWord[]): IndexedWord[][] => {
  const indexed = words.map((word, index) => ({...word, index}));
  const textLength = words.map((word) => word.word).join(' ').length;
  if (textLength <= 46 || words.length < 6) return [indexed];

  let best = Math.ceil(words.length / 2);
  let bestScore = Number.POSITIVE_INFINITY;
  for (let split = 2; split <= words.length - 2; split += 1) {
    const left = words.slice(0, split).map((word) => word.word).join(' ').length;
    const right = words.slice(split).map((word) => word.word).join(' ').length;
    const score = Math.max(left, right) * 2 + Math.abs(left - right);
    if (score < bestScore) {
      bestScore = score;
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
 * Cross-platform FinanceNeo captions:
 * - one complete sentence at a time
 * - hard maximum of two visual lines
 * - sentence changes exactly when the next sentence's first word starts
 * - active word follows the real start/end timestamps from the final audio
 * - the previous sentence stays visible during short pauses
 */
export const SentenceKaraokeCaptions: React.FC<SentenceKaraokeCaptionsProps> = ({
  words,
  bottom = 280,
  left = 60,
  right = 180,
  highlight = C.accentLt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const sentences = React.useMemo(() => splitSentences(words), [words]);

  if (sentences.length === 0 || time < sentences[0].words[0].start) return null;

  let sentenceIndex = 0;
  for (let index = 1; index < sentences.length; index += 1) {
    if (time >= sentences[index].words[0].start) sentenceIndex = index;
    else break;
  }

  const sentence = sentences[sentenceIndex];
  const lines = balance(sentence.words);
  let active = -1;
  for (let index = 0; index < sentence.words.length; index += 1) {
    const word = sentence.words[index];
    if (time >= word.start && time < word.end) {
      active = index;
      break;
    }
  }

  const longest = Math.max(...lines.map((line) => line.map((word) => word.word).join(' ').length));
  const fontSize = longest > 62 ? 25 : longest > 56 ? 27 : longest > 50 ? 29 : longest > 44 ? 32 : 36;

  return (
    <div style={{position: 'absolute', left, right, bottom, zIndex: 100}}>
      <div style={{
        minHeight: lines.length === 2 ? 120 : 88,
        borderRadius: 24,
        padding: lines.length === 2 ? '16px 22px 18px' : '17px 22px 19px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        textAlign: 'center',
        background: 'rgba(3,12,7,.93)',
        border: '1px solid rgba(255,255,255,.13)',
        boxShadow: '0 18px 56px rgba(0,0,0,.38)',
        fontFamily: FONT.body,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.14,
      }}>
        {lines.map((line, lineIndex) => (
          <div key={`${sentence.id}-${lineIndex}`} style={{whiteSpace: 'nowrap'}}>
            {line.map((word, position) => (
              <React.Fragment key={`${sentence.id}-${word.index}`}>
                {position > 0 ? ' ' : null}
                <span style={{
                  color: word.index === active ? highlight : C.white,
                  textShadow: word.index === active
                    ? `0 0 18px ${C.accent},0 2px 14px rgba(0,0,0,.8)`
                    : '0 2px 14px rgba(0,0,0,.8)',
                }}>
                  {word.word}
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
