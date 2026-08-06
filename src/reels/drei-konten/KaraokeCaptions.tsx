import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {REEL_LAYOUT} from './shared';
import {DREI_KONTEN_WORD_TIMINGS} from './word-timings';

export const KaraokeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  let sentenceIndex = -1;

  for (let index = 0; index < DREI_KONTEN_WORD_TIMINGS.length; index += 1) {
    if (frame >= DREI_KONTEN_WORD_TIMINGS[index].frames[0]) sentenceIndex = index;
    else break;
  }

  if (sentenceIndex < 0) return null;

  const sentence = DREI_KONTEN_WORD_TIMINGS[sentenceIndex];
  const nextSentenceStart =
    DREI_KONTEN_WORD_TIMINGS[sentenceIndex + 1]?.frames[0] ?? 1800;
  if (frame >= nextSentenceStart) return null;

  const words = sentence.text.split(/\s+/);
  let activeWordIndex = -1;
  for (let index = 0; index < words.length; index += 1) {
    if (frame >= sentence.frames[index] && frame < sentence.frames[index + 1]) {
      activeWordIndex = index;
      break;
    }
  }

  const textLength = sentence.text.length;
  const fontSize = textLength > 105 ? 27 : textLength > 88 ? 29 : textLength > 72 ? 32 : textLength > 55 ? 35 : 38;

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 128,
        bottom: REEL_LAYOUT.subtitleBottom,
        zIndex: 100,
      }}
    >
      <div
        style={{
          minHeight: 96,
          borderRadius: 26,
          padding: '18px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          columnGap: 7,
          rowGap: 0,
          textAlign: 'center',
          background: 'rgba(3, 12, 7, 0.92)',
          border: '1px solid rgba(255,255,255,0.13)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.38)',
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.14,
        }}
      >
        {words.map((word, index) => {
          const active = index === activeWordIndex;
          return (
            <span
              key={`${sentence.id}-${index}`}
              style={{
                color: active ? C.accentLt : C.white,
                textShadow: active
                  ? `0 0 18px ${C.accent}, 0 2px 14px rgba(0,0,0,.8)`
                  : '0 2px 14px rgba(0,0,0,.8)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
