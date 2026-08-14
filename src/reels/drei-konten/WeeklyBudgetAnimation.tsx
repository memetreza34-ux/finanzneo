import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../design-system';
import {SCENE_COPY} from './config';
import {Headline, SceneBackground, VisualStage, clamp, clamp01} from './shared';

export const WeeklyBudgetAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const copy = SCENE_COPY[8];
  const progress = frame / Math.max(1, durationInFrames - 1);
  const source = clamp01(spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 160},
    durationInFrames: Math.max(18, Math.round(durationInFrames * 0.2)),
  }));
  const splitStart = Math.round(durationInFrames * 0.2);
  const split = clamp01(spring({
    frame: frame - splitStart,
    fps,
    config: {damping: 17, stiffness: 175},
    durationInFrames: Math.max(20, Math.round(durationInFrames * 0.22)),
  }));
  const activeProgress = interpolate(progress, [0.42, 0.82], [0, 4], clamp);
  const active = Math.min(4, Math.max(0, Math.ceil(activeProgress)));
  const pathProgress = interpolate(progress, [0.24, 0.7], [0, 1], clamp);

  return (
    <SceneBackground>
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} icon={copy.icon} />
      <VisualStage>
        <div style={{position: 'absolute', top: 62, left: '50%', transform: `translateX(-50%) scale(${0.75 + source * 0.25})`, opacity: source * (1 - split * 0.18), width: 500, height: 210, borderRadius: 42, display: 'grid', placeItems: 'center', background: `linear-gradient(145deg, ${C.gold}, #9E6500)`, boxShadow: `0 32px 100px ${a(C.gold, 0.28)}`, color: '#2C1B00', fontFamily: FONT.title, fontSize: 128}}>600 €</div>

        <div style={{position: 'absolute', top: 300, left: 160, right: 160, height: 92}}>
          <div style={{position: 'absolute', top: 38, left: 0, right: 0, height: 7, borderRadius: 999, background: 'rgba(255,255,255,.08)'}} />
          <div style={{position: 'absolute', top: 38, left: 0, width: `${pathProgress * 100}%`, height: 7, borderRadius: 999, background: `linear-gradient(90deg, ${C.gold}, ${C.accentLt})`, boxShadow: `0 0 24px ${a(C.accent, 0.35)}`}} />
          {[0, 1, 2, 3].map((index) => (
            <div key={index} style={{position: 'absolute', left: `${(index / 3) * 100}%`, top: 21, width: 40, height: 40, borderRadius: '50%', transform: 'translateX(-50%)', background: index < active ? C.accentLt : C.surface, border: `3px solid ${index < active ? C.accentLt : 'rgba(255,255,255,.18)'}`, boxShadow: index < active ? `0 0 22px ${a(C.accent, 0.4)}` : 'none'}} />
          ))}
        </div>

        <div style={{position: 'absolute', top: 408, left: 82, right: 82, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20}}>
          {Array.from({length: 4}).map((_, index) => {
            const revealStart = Math.round(durationInFrames * (0.32 + index * 0.075));
            const visible = clamp01(spring({
              frame: frame - revealStart,
              fps,
              config: {damping: 18, stiffness: 175},
              durationInFrames: Math.max(16, Math.round(durationInFrames * 0.16)),
            }));
            const isActive = index < active;
            return (
              <div key={index} style={{height: 190, borderRadius: 34, padding: 24, background: isActive ? a(C.accent, 0.18) : 'rgba(255,255,255,.05)', border: `2px solid ${isActive ? a(C.accentLt, 0.62) : 'rgba(255,255,255,.12)'}`, opacity: visible, transform: `translateY(${(1 - visible) * 60}px) scale(${0.84 + visible * 0.16})`, boxShadow: isActive ? `0 24px 72px ${a(C.accent, 0.18)}` : 'none'}}>
                <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 29, color: C.gray}}>WOCHE {index + 1}</div>
                <div style={{fontFamily: FONT.title, fontSize: 84, color: isActive ? C.accentLt : C.white}}>150 €</div>
              </div>
            );
          })}
        </div>
      </VisualStage>
    </SceneBackground>
  );
};
