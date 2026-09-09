import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const YOUTUBE_CAPTION_LAYER_ID = 'finanzneo-youtube-caption-layer-v2';

type TimingWord = {
  word: string;
  start: number;
  end: number;
};

type TimingSentence = {
  text?: string;
  start?: number;
  end?: number;
  words: TimingWord[];
};

type Props = {
  sentences: TimingSentence[];
};

const secondsAt = (frame: number, fps: number) => frame / fps;

export const YouTubeCaptionLayer: React.FC<Props> = ({sentences}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = secondsAt(frame, fps);
  const sentence = sentences.find((candidate) => {
    const words = candidate.words ?? [];
    const start = Number.isFinite(candidate.start) ? Number(candidate.start) : words[0]?.start;
    const end = Number.isFinite(candidate.end) ? Number(candidate.end) : words.at(-1)?.end;
    return Number.isFinite(start) && Number.isFinite(end) && now >= Number(start) && now <= Number(end);
  });

  if (!sentence?.words?.length) return null;
  const start = sentence.words[0].start;
  const end = sentence.words.at(-1)?.end ?? start;
  const opacity = interpolate(now, [start, start + 0.08, Math.max(start + 0.08, end - 0.08), end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      data-caption-layer={YOUTUBE_CAPTION_LAYER_ID}
      style={{
        pointerEvents: 'none',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 58,
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1420,
          borderRadius: 22,
          background: 'rgba(0,0,0,0.72)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.34)',
          padding: '18px 30px 20px',
          textAlign: 'center',
          fontSize: 46,
          lineHeight: 1.16,
          fontWeight: 800,
          letterSpacing: -0.7,
          color: '#F7F5EF',
        }}
      >
        {sentence.words.map((word, index) => {
          const active = now >= word.start && now < word.end;
          return (
            <React.Fragment key={`${word.start}-${index}`}>
              <span style={{color: active ? '#22E08A' : '#F7F5EF'}}>{word.word}</span>
              {index < sentence.words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
