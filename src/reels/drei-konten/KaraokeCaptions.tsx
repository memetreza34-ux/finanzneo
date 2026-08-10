import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {REEL_LAYOUT} from './shared';
import {DREI_KONTEN_WORD_TIMINGS} from './word-timings';

type IndexedWord = {word: string; index: number};

const splitIntoBalancedLines = (words: string[]): IndexedWord[][] => {
  const indexed = words.map((word, index) => ({word, index}));
  const totalCharacters = words.reduce((sum, word) => sum + word.length, 0) + Math.max(0, words.length - 1);
  if (totalCharacters <= 46 || words.length < 6) return [indexed];

  let bestSplit = Math.ceil(words.length / 2);
  let bestScore = Number.POSITIVE_INFINITY;

  for (let split = 2; split <= words.length - 2; split += 1) {
    const left = words.slice(0, split).join(' ').length;
    const right = words.slice(split).join(' ').length;
    const longest = Math.max(left, right);
    const imbalance = Math.abs(left - right);
    const score = longest * 2 + imbalance;
    if (score < bestScore) {
      bestScore = score;
      bestSplit = split;
    }
  }

  return [indexed.slice(0, bestSplit), indexed.slice(bestSplit)];
};

export const KaraokeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  let sentenceIndex = 0;

  for (let index = 1; index < DREI_KONTEN_WORD_TIMINGS.length; index += 1) {
    if (frame >= DREI_KONTEN_WORD_TIMINGS[index].frames[0]) sentenceIndex = index;
    else break;
  }

  const sentence = DREI_KONTEN_WORD_TIMINGS[sentenceIndex];
  const words = sentence.text.split(/\s+/);
  const lines = splitIntoBalancedLines(words);
  let activeWordIndex = -1;

  for (let index = 0; index < words.length; index += 1) {
    if (frame >= sentence.frames[index] && frame < sentence.frames[index + 1]) {
      activeWordIndex = index;
      break;
    }
  }

  const longestLine = Math.max(...lines.map((line) => line.map(({word}) => word).join(' ').length));
  const fontSize = longestLine > 62 ? 25 : longestLine > 56 ? 27 : longestLine > 50 ? 29 : longestLine > 44 ? 32 : 36;
  const twoLines = lines.length === 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: REEL_LAYOUT.subtitleLeft,
        right: REEL_LAYOUT.subtitleRight,
        bottom: REEL_LAYOUT.subtitleBottom,
        zIndex: 100,
      }}
    >
      <div
        style={{
          minHeight: twoLines ? 124 : 92,
          borderRadius: 26,
          padding: twoLines ? '17px 22px 19px' : '18px 22px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: twoLines ? 2 : 0,
          textAlign: 'center',
          background: 'rgba(3, 12, 7, 0.93)',
          border: '1px solid rgba(255,255,255,0.13)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.4)',
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.14,
        }}
      >
        {lines.map((line, lineIndex) => (
          <div key={`${sentence.id}-line-${lineIndex}`} style={{whiteSpace: 'nowrap'}}>
            {line.map(({word, index}, position) => {
              const active = index === activeWordIndex;
              return (
                <React.Fragment key={`${sentence.id}-${index}`}>
                  {position > 0 ? ' ' : null}
                  <span
                    style={{
                      color: active ? C.accentLt : C.white,
                      textShadow: active
                        ? `0 0 18px ${C.accent}, 0 2px 14px rgba(0,0,0,.8)`
                        : '0 2px 14px rgba(0,0,0,.8)',
                    }}
                  >
                    {word}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
