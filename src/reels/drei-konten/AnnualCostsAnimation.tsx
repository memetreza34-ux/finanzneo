import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../brand';
import {SCENE_COPY} from './config';
import {Headline, SceneBackground, SentenceCaption, VisualStage, clamp01} from './shared';

export const AnnualCostsAnimation: React.FC<{durationInFrames: number}> = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const copy = SCENE_COPY[7];
  const activeMonths = Math.min(12, Math.max(0, Math.floor((frame - 36) / 8) + 1));
  const result = clamp01(spring({frame: frame - 116, fps, config: {damping: 16, stiffness: 180}}));

  return (
    <SceneBackground>
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} />
      <VisualStage>
        <div
          style={{
            position: 'absolute',
            top: 105,
            left: 92,
            right: 92,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 18,
          }}
        >
          {Array.from({length: 12}).map((_, index) => {
            const active = index < activeMonths;
            return (
              <div
                key={index}
                style={{
                  height: 112,
                  borderRadius: 24,
                  display: 'grid',
                  placeItems: 'center',
                  background: active ? a(C.accent, 0.2) : 'rgba(255,255,255,.045)',
                  border: `2px solid ${active ? a(C.accentLt, 0.62) : 'rgba(255,255,255,.1)'}`,
                  color: active ? C.accentLt : C.grayDk,
                  fontFamily: FONT.body,
                  fontWeight: 900,
                  fontSize: 29,
                  transform: `scale(${active ? 1 : 0.92})`,
                  boxShadow: active ? `0 12px 42px ${a(C.accent, 0.15)}` : 'none',
                }}
              >
                {index + 1}. MONAT
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 545,
            left: 88,
            right: 88,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            opacity: result,
            transform: `translateY(${(1 - result) * 65}px)`,
          }}
        >
          <div style={{fontFamily: FONT.title, fontSize: 86, color: C.gold}}>1.200 €</div>
          <div style={{fontFamily: FONT.title, fontSize: 76, color: C.gray}}>÷ 12 =</div>
          <div
            style={{
              borderRadius: 32,
              padding: '22px 31px',
              background: a(C.accent, 0.2),
              border: `2px solid ${a(C.accentLt, 0.62)}`,
              fontFamily: FONT.title,
              fontSize: 100,
              color: C.accentLt,
            }}
          >
            100 €
          </div>
        </div>
      </VisualStage>
      <SentenceCaption cues={copy.subtitles} />
    </SceneBackground>
  );
};
