import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../brand';
import {SCENE_COPY} from './config';
import {Caption, SceneBackground, clamp01} from './shared';

export const AnnualCostsAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = clamp01(spring({frame, fps, config: {damping: 18, stiffness: 160}}));
  const activeMonths = Math.min(12, Math.max(0, Math.floor((frame - 42) / 8) + 1));
  const result = clamp01(spring({frame: frame - 118, fps, config: {damping: 16, stiffness: 180}}));

  return (
    <SceneBackground>
      <div
        style={{
          position: 'absolute',
          top: 370,
          left: 74,
          right: 74,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 94,
          color: C.white,
          opacity: intro,
        }}
      >
        JAHRESKOSTEN <span style={{color: C.accent}}>MONATLICH PLANEN</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 650,
          left: 95,
          right: 95,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}
      >
        {Array.from({length: 12}).map((_, index) => {
          const active = index < activeMonths;
          return (
            <div
              key={index}
              style={{
                height: 132,
                borderRadius: 26,
                display: 'grid',
                placeItems: 'center',
                background: active ? a(C.accent, 0.2) : 'rgba(255,255,255,.045)',
                border: `2px solid ${active ? a(C.accentLt, 0.62) : 'rgba(255,255,255,.1)'}`,
                color: active ? C.accentLt : C.grayDk,
                fontFamily: FONT.body,
                fontWeight: 900,
                fontSize: 32,
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
          top: 1160,
          left: 100,
          right: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          opacity: result,
          transform: `translateY(${(1 - result) * 70}px)`,
        }}
      >
        <div style={{fontFamily: FONT.title, fontSize: 92, color: C.gold}}>1.200 €</div>
        <div style={{fontFamily: FONT.title, fontSize: 82, color: C.gray}}>÷ 12 =</div>
        <div
          style={{
            borderRadius: 34,
            padding: '24px 34px',
            background: a(C.accent, 0.2),
            border: `2px solid ${a(C.accentLt, 0.62)}`,
            fontFamily: FONT.title,
            fontSize: 108,
            color: C.accentLt,
          }}
        >
          100 €
        </div>
      </div>
      <Caption kicker={SCENE_COPY[7].kicker} text={SCENE_COPY[7].caption} durationInFrames={durationInFrames} />
    </SceneBackground>
  );
};

