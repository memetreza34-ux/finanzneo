import React from 'react';
import {AbsoluteFill} from 'remotion';

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

export const MotionStage: React.FC<{children: React.ReactNode; transparent?: boolean}> = ({children, transparent = false}) => (
  <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : COLORS.black, color: COLORS.white, fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
    {children}
  </AbsoluteFill>
);

export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{backgroundColor: COLORS.panel, border: `2px solid ${COLORS.line}`, borderRadius: 28, boxSizing: 'border-box', ...style}}>{children}</div>
);

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
