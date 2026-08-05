import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const ETF_COLORS = {
  background: '#051009',
  backgroundSoft: '#0A1B11',
  surface: 'rgba(14, 34, 22, 0.94)',
  surfaceSoft: 'rgba(255,255,255,0.055)',
  line: 'rgba(255,255,255,0.14)',
  text: '#F7F5ED',
  muted: '#A8B9AF',
  green: '#62F59A',
  mint: '#B9FFD0',
  gold: '#F4C95D',
  orange: '#F29B58',
  blue: '#68B8FF',
  red: '#FF7474',
} as const;

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number = Easing.out(Easing.cubic),
): number => interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing,
});

export const sceneProgress = (frame: number, durationInFrames: number): number =>
  clamp01(frame / Math.max(1, durationInFrames - 1));

export const pop = (frame: number, delay = 0, fps = 30): number => spring({
  frame: Math.max(0, frame - delay),
  fps,
  config: {damping: 16, stiffness: 155, mass: 0.8},
});

export const SceneBackground: React.FC<{
  accent?: string;
  children: React.ReactNode;
}> = ({accent = ETF_COLORS.green, children}) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 45) * 36;
  const driftY = Math.cos(frame / 57) * 24;
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: ETF_COLORS.text,
        fontFamily: 'Inter, Arial, sans-serif',
        background: `radial-gradient(circle at ${20 + driftX / 12}% ${15 + driftY / 15}%, ${accent}25, transparent 34%), radial-gradient(circle at 86% 64%, rgba(244,201,93,0.11), transparent 30%), linear-gradient(180deg, ${ETF_COLORS.backgroundSoft} 0%, ${ETF_COLORS.background} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
          transform: `translate3d(${frame % 84}px, ${(frame * 0.55) % 84}px, 0)`,
        }}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 150px rgba(0,0,0,0.32)'}} />
      {children}
    </AbsoluteFill>
  );
};

export const GlowPill: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, color = ETF_COLORS.green, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      padding: '8px 18px',
      borderRadius: 999,
      background: `${color}1E`,
      border: `1px solid ${color}66`,
      color,
      fontSize: 23,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: 0.8,
      boxShadow: `0 0 28px ${color}1F`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const SceneHeader: React.FC<{
  kicker: string;
  headline: string;
  body?: string;
  accent?: string;
}> = ({kicker, headline, body, accent = ETF_COLORS.green}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 18, stiffness: 145, mass: 0.85}});
  const opacity = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 70,
        top: 58,
        left: 64,
        right: 64,
        opacity,
        transform: `translateY(${(1 - entrance) * -22}px)`,
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <div style={{fontSize: 23, fontWeight: 950, letterSpacing: 4.2, color: accent}}>{kicker}</div>
      <div
        style={{
          marginTop: 13,
          fontSize: 64,
          lineHeight: 0.99,
          fontWeight: 950,
          letterSpacing: -1.8,
          textShadow: '0 4px 18px rgba(0,0,0,0.68)',
        }}
      >
        {headline}
      </div>
      {body ? (
        <div
          style={{
            display: 'inline-flex',
            marginTop: 18,
            padding: '10px 18px',
            borderRadius: 999,
            color: ETF_COLORS.mint,
            fontSize: 24,
            fontWeight: 850,
            background: 'rgba(4,16,9,0.78)',
            border: `1px solid ${ETF_COLORS.line}`,
          }}
        >
          {body}
        </div>
      ) : null}
    </div>
  );
};

export const AnimationSafeArea: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      left: 52,
      right: 52,
      top: 288,
      bottom: 410,
      overflow: 'hidden',
      borderRadius: 46,
    }}
  >
    {children}
  </div>
);
