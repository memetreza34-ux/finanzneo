import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a, euro} from '../../brand';
import {SCENE_COPY} from './config';
import {Headline, SceneBackground, VisualStage, clamp01} from './shared';

const AnimatedMoneyBlock: React.FC<{
  amount: number;
  label: string;
  color: string;
  width: number;
  x: number;
  y: number;
  delay: number;
}> = ({amount, label, color, width, x, y, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp01(
    spring({
      frame: frame - delay,
      fps,
      config: {damping: 18, stiffness: 160, mass: 0.75},
    }),
  );
  const visibleAmount = Math.round(amount * reveal);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: 230,
        borderRadius: 36,
        padding: 26,
        background: `linear-gradient(145deg, ${a(color, 0.95)}, ${a(color, 0.45)})`,
        border: `2px solid ${a(C.white, 0.18)}`,
        boxShadow: `0 30px 90px ${a(color, 0.22)}`,
        transform: `translateY(${(1 - reveal) * 90}px) scale(${0.82 + reveal * 0.18})`,
        opacity: reveal,
      }}
    >
      <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.whiteSoft}}>
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT.title,
          fontSize: 91,
          color: C.white,
          marginTop: 28,
          lineHeight: 1,
        }}
      >
        {euro(visibleAmount)}
      </div>
    </div>
  );
};

export const FixedCostsMathAnimation: React.FC<{durationInFrames: number}> = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const copy = SCENE_COPY[5];
  const minus = clamp01(spring({frame: frame - 45, fps, config: {damping: 16, stiffness: 170}}));
  const result = clamp01(spring({frame: frame - 76, fps, config: {damping: 15, stiffness: 180}}));

  return (
    <SceneBackground>
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} />
      <VisualStage>
        <AnimatedMoneyBlock amount={1800} label="EINKOMMEN" color={C.blue} width={410} x={82} y={145} delay={4} />
        <div
          style={{
            position: 'absolute',
            top: 216,
            left: 510,
            color: C.white,
            fontFamily: FONT.title,
            fontSize: 108,
            opacity: minus,
            transform: `scale(${0.5 + minus * 0.5})`,
          }}
        >
          −
        </div>
        <AnimatedMoneyBlock amount={1100} label="FIXKOSTEN" color={C.negativeDk} width={410} x={588} y={145} delay={40} />
        <div
          style={{
            position: 'absolute',
            top: 438,
            left: 88,
            right: 88,
            height: 8,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            transform: `scaleX(${result})`,
            boxShadow: `0 0 26px ${a(C.accent, 0.55)}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 510,
            left: 120,
            right: 120,
            borderRadius: 42,
            padding: '34px 48px',
            textAlign: 'center',
            background: a(C.accent, 0.16),
            border: `2px solid ${a(C.accentLt, 0.62)}`,
            opacity: result,
            transform: `translateY(${(1 - result) * 70}px) scale(${0.76 + result * 0.24})`,
            boxShadow: `0 26px 100px ${a(C.accent, 0.25)}`,
          }}
        >
          <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: C.accentLt}}>
            VERFÜGBAR NACH FIXKOSTEN
          </div>
          <div style={{fontFamily: FONT.title, fontSize: 142, color: C.white, lineHeight: 1.05}}>
            {euro(Math.round(700 * result))}
          </div>
        </div>
      </VisualStage>
    </SceneBackground>
  );
};
