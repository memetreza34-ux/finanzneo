import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../brand';
import {SCENE_COPY} from './config';
import {Caption, SceneBackground, clamp01} from './shared';

export const WeeklyBudgetAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const source = clamp01(spring({frame, fps, config: {damping: 18, stiffness: 160}}));
  const split = clamp01(spring({frame: frame - 48, fps, config: {damping: 17, stiffness: 175}}));
  const active = Math.min(4, Math.max(0, Math.floor((frame - 76) / 16) + 1));

  return (
    <SceneBackground>
      <div
        style={{
          position: 'absolute',
          top: 370,
          left: 70,
          right: 70,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 98,
          color: C.white,
        }}
      >
        600 € WERDEN <span style={{color: C.accent}}>4 WOCHEN</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 620,
          left: '50%',
          transform: `translateX(-50%) scale(${0.75 + source * 0.25})`,
          opacity: source * (1 - split * 0.24),
          width: 560,
          height: 250,
          borderRadius: 44,
          display: 'grid',
          placeItems: 'center',
          background: `linear-gradient(145deg, ${C.gold}, #9E6500)`,
          boxShadow: `0 32px 100px ${a(C.gold, 0.28)}`,
          color: '#2C1B00',
          fontFamily: FONT.title,
          fontSize: 142,
        }}
      >
        600 €
      </div>
      <div
        style={{
          position: 'absolute',
          top: 930,
          left: 80,
          right: 80,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
        }}
      >
        {Array.from({length: 4}).map((_, index) => {
          const visible = Math.min(1, Math.max(0, split * 1.4 - index * 0.18));
          const isActive = index < active;
          return (
            <div
              key={index}
              style={{
                height: 250,
                borderRadius: 36,
                padding: 28,
                background: isActive ? a(C.accent, 0.18) : 'rgba(255,255,255,.05)',
                border: `2px solid ${isActive ? a(C.accentLt, 0.62) : 'rgba(255,255,255,.12)'}`,
                opacity: visible,
                transform: `translateY(${(1 - visible) * 80}px) scale(${0.82 + visible * 0.18})`,
                boxShadow: isActive ? `0 24px 72px ${a(C.accent, 0.18)}` : 'none',
              }}
            >
              <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 31, color: C.gray}}>
                WOCHE {index + 1}
              </div>
              <div style={{fontFamily: FONT.title, fontSize: 96, color: isActive ? C.accentLt : C.white}}>
                150 €
              </div>
            </div>
          );
        })}
      </div>
      <Caption kicker={SCENE_COPY[8].kicker} text={SCENE_COPY[8].caption} durationInFrames={durationInFrames} />
    </SceneBackground>
  );
};

