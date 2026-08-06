import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {REEL_LAYOUT, clamp} from './shared';
import {DREI_KONTEN_WORD_TIMINGS} from './word-timings';

export const KaraokeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const sentence = DREI_KONTEN_WORD_TIMINGS.find((item) => {
    const first = item.frames[0];
    const last = item.frames[item.frames.length - 1];
    return frame >= first && frame < last;
  });

  if (!sentence) return null;

  const words = sentence.text.split(/\s+/);
  const activeWordIndex = sentence.frames.findIndex(
    (fromFrame, index) =>
      index < words.length && frame >= fromFrame && frame < sentence.frames[index + 1],
  );
  const sentenceStart = sentence.frames[0];
  const sentenceEnd = sentence.frames[sentence.frames.length - 1];
  const opacity =
    interpolate(frame, [sentenceStart, sentenceStart + 5], [0, 1], clamp) *
    interpolate(frame, [sentenceEnd - 5, sentenceEnd], [1, 0], clamp);
  const textLength = sentence.text.length;
  const fontSize = textLength > 108 ? 34 : textLength > 82 ? 37 : 41;

  return (
    <div
      style={{
        position: 'absolute',
        left: 66,
        right: 66,
        bottom: REEL_LAYOUT.subtitleBottom,
        zIndex: 100,
        opacity,
      }}
    >
      <div
        style={{
          minHeight: 112,
          borderRadius: 28,
          padding: '22px 28px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 10,
          rowGap: 2,
          textAlign: 'center',
          background: 'rgba(3, 12, 7, 0.91)',
          border: '1px solid rgba(255,255,255,0.13)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.38)',
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.18,
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
