import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneBackground, VisualStage, WorldStage, clamp01, clampInput} from '../notgroschen/shared';
import {Headline} from './shared';
import {C, FONT, a, euro} from '../../brand';
import {ZINSESZINS_COPY} from './config';

// 1. EqualContributionAnimation
export const EqualContributionAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames - 1);
  const reveal = clamp01(spring({frame, fps, durationInFrames: Math.round(durationInFrames * .22), config: {damping: 18, stiffness: 160}}));

  return (
    <SceneBackground>
      <Headline copy={ZINSESZINS_COPY[1]} />
      <VisualStage>
        <WorldStage />
        <div style={{position: 'absolute', top: 120, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 40}}>
          {[
            {label: '100 € × 12 × 30 JAHRE', amount: 36000},
            {label: '200 € × 12 × 15 JAHRE', amount: 36000}
          ].map((item, i) => {
            const itemReveal = interpolate(p, [0.1 + i * 0.15, 0.3 + i * 0.15], [0, 1], clampInput);
            return (
              <div key={i} style={{
                height: 180, borderRadius: 30, display: 'grid', placeItems: 'center',
                background: a(C.accent, 0.15), border: `2px solid ${a(C.accentLt, 0.6)}`,
                opacity: itemReveal, transform: `translateY(${(1 - itemReveal) * 50}px)`
              }}>
                <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, color: C.gray}}>{item.label}</div>
                <div style={{fontFamily: FONT.title, fontSize: 80, color: C.accentLt}}>= {euro(item.amount)}</div>
              </div>
            );
          })}
        </div>
      </VisualStage>
    </SceneBackground>
  );
};

// 2. AssumptionAnimation
export const AssumptionAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const source = clamp01(spring({frame, fps, durationInFrames: Math.round(durationInFrames * .2), config: {damping: 18, stiffness: 160}}));

  return (
    <SceneBackground>
      <Headline copy={ZINSESZINS_COPY[3]} />
      <VisualStage>
        <WorldStage />
        <div style={{
          position: 'absolute', top: 200, left: '50%', transform: `translateX(-50%) scale(${0.8 + source * 0.2})`,
          opacity: source, borderRadius: 40, padding: '40px 60px', background: a(C.gold, 0.18), border: `2px solid ${a(C.goldLt, 0.6)}`, textAlign: 'center'
        }}>
          <div style={{fontFamily: FONT.title, fontSize: 130, color: C.goldLt}}>5 %</div>
          <div style={{fontFamily: FONT.body, fontSize: 32, fontWeight: 900, color: C.white}}>RENDITE PRO JAHR</div>
        </div>
      </VisualStage>
    </SceneBackground>
  );
};

// 3. TimeAdvantageComparison
export const TimeAdvantageComparison: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = frame / Math.max(1, durationInFrames - 1);
  const results = interpolate(p, [0.1, 0.5], [0, 1], clampInput);

  return (
    <SceneBackground>
      <Headline copy={ZINSESZINS_COPY[6]} />
      <VisualStage>
        <WorldStage />
        <div style={{position: 'absolute', top: 150, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 30}}>
          {[
            {label: '200 € / 15 JAHRE', result: 53500, ratio: 0.64},
            {label: '100 € / 30 JAHRE', result: 83200, ratio: 1.0}
          ].map((item, i) => {
            const w = interpolate(results, [0, 1], [0, item.ratio * 100]);
            return (
              <div key={i} style={{opacity: results}}>
                <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, color: C.gray, marginBottom: 10}}>{item.label}</div>
                <div style={{width: '100%', height: 90, background: 'rgba(255,255,255,.05)', borderRadius: 20, overflow: 'hidden'}}>
                  <div style={{
                    width: `${w}%`, height: '100%', background: i === 1 ? C.accentLt : C.goldLt,
                    display: 'flex', alignItems: 'center', paddingLeft: 20,
                    fontFamily: FONT.title, fontSize: 50, color: C.bg
                  }}>
                    {euro(item.result)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </VisualStage>
    </SceneBackground>
  );
};

// 4. RealityCheckAnimation
export const RealityCheckAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp01(spring({frame, fps, durationInFrames: Math.round(durationInFrames * .2), config: {damping: 18, stiffness: 160}}));

  return (
    <SceneBackground>
      <Headline copy={ZINSESZINS_COPY[8]} />
      <VisualStage>
        <WorldStage />
        <div style={{
          position: 'absolute', top: 180, left: 60, right: 60, display: 'grid', placeItems: 'center',
          opacity: reveal, transform: `translateY(${(1 - reveal) * 40}px)`,
          background: a('#FF3333', 0.15), border: `2px solid ${a('#FF3333', 0.6)}`, borderRadius: 40, padding: 40, textAlign: 'center'
        }}>
          <div style={{fontFamily: FONT.title, fontSize: 100, color: '#FF3333'}}>!</div>
          <div style={{fontFamily: FONT.body, fontSize: 32, fontWeight: 900, color: C.white, marginTop: 20, lineHeight: 1.4}}>
            Schwankungen<br/>Kosten<br/>Steuern<br/>Risiko
          </div>
        </div>
      </VisualStage>
    </SceneBackground>
  );
};

// 5. SmallRateLongTimeAnimation
export const SmallRateLongTimeAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames - 1);
  const grow = clamp01(spring({frame, fps, durationInFrames: Math.round(durationInFrames * .3), config: {damping: 20, stiffness: 120}}));

  return (
    <SceneBackground>
      <Headline copy={ZINSESZINS_COPY[4]} />
      <VisualStage>
        <WorldStage />
        <div style={{
          position: 'absolute', top: 200, left: 60, right: 60, height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'
        }}>
          <div style={{fontFamily: FONT.title, fontSize: 80, color: C.accentLt, opacity: grow, transform: `translateY(${(1 - grow) * 30}px)`}}>
            ≈ 83.200 €
          </div>
          <div style={{
            width: 140, height: 40 + grow * 400, background: `linear-gradient(to top, ${a(C.accent, 0.4)}, ${C.accentLt})`,
            borderRadius: '20px 20px 0 0', marginTop: 20, borderTop: `4px solid ${C.white}`
          }} />
          <div style={{width: '100%', height: 4, background: a(C.white, 0.2), marginTop: 2}} />
          <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, color: C.gray, marginTop: 16}}>30 JAHRE LAUFZEIT</div>
        </div>
      </VisualStage>
    </SceneBackground>
  );
};

// 6. HighRateShortTimeAnimation
export const HighRateShortTimeAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = clamp01(spring({frame, fps, durationInFrames: Math.round(durationInFrames * .3), config: {damping: 20, stiffness: 120}}));

  return (
    <SceneBackground>
      <Headline copy={ZINSESZINS_COPY[5]} />
      <VisualStage>
        <WorldStage />
        <div style={{
          position: 'absolute', top: 200, left: 60, right: 60, height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'
        }}>
          <div style={{fontFamily: FONT.title, fontSize: 80, color: C.goldLt, opacity: grow, transform: `translateY(${(1 - grow) * 30}px)`}}>
            ≈ 53.500 €
          </div>
          <div style={{
            width: 140, height: 40 + grow * 250, background: `linear-gradient(to top, ${a(C.gold, 0.4)}, ${C.goldLt})`,
            borderRadius: '20px 20px 0 0', marginTop: 20, borderTop: `4px solid ${C.white}`
          }} />
          <div style={{width: '100%', height: 4, background: a(C.white, 0.2), marginTop: 2}} />
          <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, color: C.gray, marginTop: 16}}>NUR 15 JAHRE LAUFZEIT</div>
        </div>
      </VisualStage>
    </SceneBackground>
  );
};
