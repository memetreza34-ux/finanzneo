import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../brand';
import {SCENE_COPY} from './config';
import {Headline, SceneBackground, VisualStage, clamp, clamp01} from './shared';

export const AnnualCostsAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const copy = SCENE_COPY[7];
  const progress = frame / Math.max(1, durationInFrames - 1);
  const monthProgress = interpolate(progress, [0.08, 0.68], [0, 12], clamp);
  const activeMonths = Math.min(12, Math.max(0, Math.ceil(monthProgress)));
  const resultStart = Math.round(durationInFrames * 0.58);
  const result = clamp01(spring({
    frame: frame - resultStart,
    fps,
    config: {damping: 16, stiffness: 180, mass: 0.78},
    durationInFrames: Math.max(24, Math.round(durationInFrames * 0.24)),
  }));
  const lineProgress = interpolate(progress, [0.16, 0.72], [0, 1], clamp);

  return (
    <SceneBackground>
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} icon={copy.icon} />
      <VisualStage>
        <div style={{position: 'absolute', top: 34, left: 78, right: 78, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14}}>
          {Array.from({length: 12}).map((_, index) => {
            const active = index < activeMonths;
            const local = clamp01(spring({
              frame: frame - Math.round(durationInFrames * 0.08) - index * Math.max(3, Math.round(durationInFrames * 0.045)),
              fps,
              config: {damping: 18, stiffness: 190},
            }));
            return (
              <div
                key={index}
                style={{
                  height: 126,
                  borderRadius: 23,
                  display: 'grid',
                  placeItems: 'center',
                  background: active ? a(C.accent, 0.22) : 'rgba(255,255,255,.045)',
                  border: `2px solid ${active ? a(C.accentLt, 0.68) : 'rgba(255,255,255,.1)'}`,
                  color: active ? C.accentLt : C.grayDk,
                  fontFamily: FONT.body,
                  fontWeight: 900,
                  fontSize: 28,
                  transform: `scale(${0.92 + local * 0.08})`,
                  boxShadow: active ? `0 12px 40px ${a(C.accent, 0.16)}` : 'none',
                }}
              >
                {index + 1}. MONAT
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', top: 456, left: 138, right: 138, height: 112}}>
          <div style={{position: 'absolute', top: 49, left: 0, right: 0, height: 7, borderRadius: 10, background: 'rgba(255,255,255,.08)'}} />
          <div style={{position: 'absolute', top: 49, left: 0, width: `${lineProgress * 100}%`, height: 7, borderRadius: 10, background: `linear-gradient(90deg, ${C.accent}, ${C.accentLt})`, boxShadow: `0 0 24px ${a(C.accent, 0.36)}`}} />
          <div style={{position: 'absolute', top: 16, left: `${Math.max(0, lineProgress * 100 - 4)}%`, width: 72, height: 72, borderRadius: '50%', display: 'grid', placeItems: 'center', transform: 'translateX(-50%)', background: C.gold, color: C.bgDeep, fontFamily: FONT.title, fontSize: 35, boxShadow: `0 12px 34px ${a(C.gold, 0.25)}`}}>€</div>
        </div>

        <div style={{position: 'absolute', top: 595, left: 74, right: 74, borderRadius: 38, padding: '30px 34px', display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: 18, background: 'rgba(5,18,11,.78)', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 24px 70px rgba(0,0,0,.32)', opacity: result, transform: `translateY(${(1 - result) * 55}px)`}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: C.gray}}>JAHRESKOSTEN</div>
            <div style={{fontFamily: FONT.title, fontSize: 78, color: C.gold, marginTop: 6}}>1.200 €</div>
          </div>
          <div style={{fontFamily: FONT.title, fontSize: 64, color: C.gray}}>÷</div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: C.gray}}>MONATE</div>
            <div style={{fontFamily: FONT.title, fontSize: 78, color: C.white, marginTop: 6}}>12</div>
          </div>
          <div style={{fontFamily: FONT.title, fontSize: 64, color: C.gray}}>=</div>
          <div style={{textAlign: 'center', borderRadius: 28, padding: '18px 18px', background: a(C.accent, 0.22), border: `2px solid ${a(C.accentLt, 0.64)}`}}>
            <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 23, color: C.accentLt}}>PRO MONAT</div>
            <div style={{fontFamily: FONT.title, fontSize: 86, color: C.accentLt, marginTop: 3}}>100 €</div>
          </div>
        </div>
      </VisualStage>
    </SceneBackground>
  );
};
