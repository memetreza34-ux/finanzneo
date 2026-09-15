import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

export const COLORS = {
  black: '#050505',
  white: '#F7F7F2',
  gray: '#A7ADB4',
  green: '#2DD881',
  red: '#FF6B4A',
  gold: '#D8B15A',
  panel: '#111315',
  line: '#2A2F34',
};

export const FONT_STACK = 'Arial, Helvetica, sans-serif';

export const MotionStage: React.FC<{children: React.ReactNode; transparent?: boolean}> = ({children, transparent = false}) => (
  <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : COLORS.black, color: COLORS.white, fontFamily: FONT_STACK, overflow: 'hidden'}}>
    {children}
  </AbsoluteFill>
);

export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{backgroundColor: COLORS.panel, border: `2px solid ${COLORS.line}`, borderRadius: 28, boxSizing: 'border-box', ...style}}>{children}</div>
);

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Motion V3 timing helper: animation beats are expressed as fractions of the
 * final scene duration, so Phase 3 can retime a visual to the real voice-over
 * without leaving a long frozen tail.
 */
export const frameAt = (durationInFrames: number, ratio: number) => (
  Math.max(0, Math.round((Math.max(2, durationInFrames) - 1) * clamp01(ratio)))
);

export const progressBetween = (
  frame: number,
  durationInFrames: number,
  startRatio: number,
  endRatio: number,
) => {
  const start = frameAt(durationInFrames, startRatio);
  const end = Math.max(start + 1, frameAt(durationInFrames, endRatio));
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const FinanceEyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 1.2, color: COLORS.gray, textTransform: 'uppercase', ...style}}>{children}</div>
);

export const FinanceValue: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = COLORS.white, style}) => (
  <div style={{fontSize: 88, lineHeight: 0.96, fontWeight: 900, letterSpacing: -3, color, fontVariantNumeric: 'tabular-nums', ...style}}>{children}</div>
);
