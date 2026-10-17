import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../fonts';
import {AnimationStage, VISUAL_BOTTOM, VISUAL_TOP} from './ReelStage';

export type EditorialSurface = 'cream' | 'off-white' | 'light-gray' | 'muted-green' | 'dark';

export const EDITORIAL_MOTION_COLORS = {
  cream: '#F4EFE4',
  offWhite: '#FBF8F1',
  lightGray: '#ECEDEA',
  mutedGreenSurface: '#E7EEE8',
  dark: '#26302B',
  ink: '#24302A',
  inkSoft: '#56615B',
  green: '#5F8E70',
  greenDark: '#3F6D54',
  orange: '#D77C5F',
  blue: '#68839B',
  gold: '#BE9A50',
  neutral: '#A8AEA9',
  line: '#D5D7D2',
  white: '#FFFFFF',
} as const;

const SURFACES: Record<EditorialSurface, {background: string; ink: string; soft: string; line: string}> = {
  cream: {background: EDITORIAL_MOTION_COLORS.cream, ink: EDITORIAL_MOTION_COLORS.ink, soft: EDITORIAL_MOTION_COLORS.inkSoft, line: '#D9D2C4'},
  'off-white': {background: EDITORIAL_MOTION_COLORS.offWhite, ink: EDITORIAL_MOTION_COLORS.ink, soft: EDITORIAL_MOTION_COLORS.inkSoft, line: '#DDD9D0'},
  'light-gray': {background: EDITORIAL_MOTION_COLORS.lightGray, ink: EDITORIAL_MOTION_COLORS.ink, soft: EDITORIAL_MOTION_COLORS.inkSoft, line: '#D1D5D2'},
  'muted-green': {background: EDITORIAL_MOTION_COLORS.mutedGreenSurface, ink: EDITORIAL_MOTION_COLORS.ink, soft: EDITORIAL_MOTION_COLORS.inkSoft, line: '#CBD8CE'},
  dark: {background: EDITORIAL_MOTION_COLORS.dark, ink: '#F8F5ED', soft: '#D6DAD6', line: '#4C5A52'},
};

export const EditorialMotionStage: React.FC<{
  children: React.ReactNode;
  surface?: EditorialSurface;
  scale?: number;
}> = ({children, surface = 'cream', scale = 1}) => {
  const palette = SURFACES[surface];
  return (
    <AnimationStage scale={scale}>
      <AbsoluteFill>
        <div
          data-finanzneo-editorial-motion-surface={surface}
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            top: VISUAL_TOP + 18,
            height: VISUAL_BOTTOM - VISUAL_TOP - 36,
            borderRadius: 42,
            background: palette.background,
            border: `1px solid ${palette.line}`,
            overflow: 'hidden',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            color: palette.ink,
            fontFamily: FONT.body,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AnimationStage>
  );
};

export const EditorialLabel: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  width?: number;
  tone?: 'green' | 'orange' | 'blue' | 'gold' | 'neutral';
  size?: number;
  opacity?: number;
}> = ({children, x, y, width = 220, tone = 'neutral', size = 28, opacity = 1}) => {
  const color = {
    green: EDITORIAL_MOTION_COLORS.green,
    orange: EDITORIAL_MOTION_COLORS.orange,
    blue: EDITORIAL_MOTION_COLORS.blue,
    gold: EDITORIAL_MOTION_COLORS.gold,
    neutral: EDITORIAL_MOTION_COLORS.inkSoft,
  }[tone];

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        minHeight: 54,
        padding: '10px 16px',
        borderRadius: 16,
        background: EDITORIAL_MOTION_COLORS.white,
        border: `2px solid ${color}`,
        color: EDITORIAL_MOTION_COLORS.ink,
        fontSize: size,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export const EditorialDocument: React.FC<{
  x: number;
  y: number;
  title?: string;
  amount?: string;
  accent?: 'green' | 'orange' | 'blue' | 'gold';
  scale?: number;
  opacity?: number;
}> = ({x, y, title = 'Rechnung', amount, accent = 'blue', scale = 1, opacity = 1}) => {
  const color = EDITORIAL_MOTION_COLORS[accent];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 300,
        height: 360,
        borderRadius: 24,
        background: EDITORIAL_MOTION_COLORS.white,
        border: '2px solid #D9DCD7',
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
        opacity,
        padding: 28,
        color: EDITORIAL_MOTION_COLORS.ink,
      }}
    >
      <div style={{fontFamily: FONT.title, fontSize: 38, fontWeight: 900}}>{title}</div>
      <div style={{width: 150, height: 8, borderRadius: 8, background: color, marginTop: 22}} />
      <div style={{width: 220, height: 8, borderRadius: 8, background: '#DADDD8', marginTop: 24}} />
      <div style={{width: 180, height: 8, borderRadius: 8, background: '#DADDD8', marginTop: 14}} />
      <div style={{width: 205, height: 8, borderRadius: 8, background: '#DADDD8', marginTop: 14}} />
      {amount ? <div style={{position: 'absolute', left: 28, right: 28, bottom: 34, fontFamily: FONT.title, fontSize: 46, fontWeight: 900, color}}>{amount}</div> : null}
    </div>
  );
};

export const EditorialPerson: React.FC<{
  x: number;
  y: number;
  scale?: number;
  shirt?: 'green' | 'orange' | 'blue' | 'gold';
  opacity?: number;
}> = ({x, y, scale = 1, shirt = 'green', opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 130, height: 250, transform: `scale(${scale})`, transformOrigin: '50% 100%', opacity}}>
    <div style={{position: 'absolute', left: 39, top: 0, width: 54, height: 54, borderRadius: '50%', background: '#D8AF91'}} />
    <div style={{position: 'absolute', left: 23, top: 55, width: 86, height: 105, borderRadius: 34, background: EDITORIAL_MOTION_COLORS[shirt]}} />
    <div style={{position: 'absolute', left: 29, top: 150, width: 28, height: 95, borderRadius: 16, background: EDITORIAL_MOTION_COLORS.ink}} />
    <div style={{position: 'absolute', right: 29, top: 150, width: 28, height: 95, borderRadius: 16, background: EDITORIAL_MOTION_COLORS.ink}} />
  </div>
);

export const EditorialBuilding: React.FC<{
  x: number;
  y: number;
  label?: string;
  accent?: 'green' | 'orange' | 'blue' | 'gold';
  scale?: number;
  opacity?: number;
}> = ({x, y, label = 'Unternehmen', accent = 'blue', scale = 1, opacity = 1}) => {
  const color = EDITORIAL_MOTION_COLORS[accent];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 300, height: 300, transform: `scale(${scale})`, transformOrigin: '50% 100%', opacity}}>
      <div style={{position: 'absolute', left: 22, right: 22, bottom: 42, height: 210, borderRadius: 18, background: '#FFFFFF', border: `3px solid ${color}`}}>
        {[0,1,2].map((row) => [0,1,2].map((col) => (
          <div key={`${row}-${col}`} style={{position: 'absolute', left: 34 + col * 66, top: 34 + row * 52, width: 34, height: 28, borderRadius: 6, background: '#DCE4E0'}} />
        )))}
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 0, textAlign: 'center', fontSize: 26, fontWeight: 850, color: EDITORIAL_MOTION_COLORS.ink}}>{label}</div>
    </div>
  );
};

export const EditorialMountain: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  progress?: number;
  flagLabel?: string;
}> = ({x, y, width = 640, height = 430, progress = 0, flagLabel}) => {
  const path = `M 20 ${height - 20} L ${width * 0.26} ${height * 0.58} L ${width * 0.42} ${height * 0.72} L ${width * 0.66} ${height * 0.32} L ${width - 30} ${height - 20} Z`;
  return (
    <div style={{position: 'absolute', left: x, top: y, width, height}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={path} fill="#C8D6CB" />
        <path d={`M 65 ${height - 58} C ${width * 0.28} ${height * 0.66}, ${width * 0.46} ${height * 0.82}, ${width * 0.67} ${height * 0.38}`} fill="none" stroke={EDITORIAL_MOTION_COLORS.greenDark} strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
        <line x1={width * 0.67} y1={height * 0.34} x2={width * 0.67} y2={height * 0.19} stroke={EDITORIAL_MOTION_COLORS.ink} strokeWidth="7" />
        <path d={`M ${width * 0.67} ${height * 0.19} h 105 l -24 32 h -81 Z`} fill={EDITORIAL_MOTION_COLORS.orange} />
      </svg>
      {flagLabel ? <div style={{position: 'absolute', left: width * 0.67 + 94, top: height * 0.14, fontFamily: FONT.title, fontSize: 34, fontWeight: 900, color: EDITORIAL_MOTION_COLORS.ink}}>{flagLabel}</div> : null}
    </div>
  );
};
