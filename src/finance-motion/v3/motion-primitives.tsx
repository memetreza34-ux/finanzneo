import React from 'react';
import {AbsoluteFill} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {FONT} from '../../brand';
import {MOTION_V3} from './motion-tokens';

export const MotionSurfaceV3: React.FC<{
  children: React.ReactNode;
  tone?: 'cream' | 'paper' | 'mist' | 'sage' | 'dark';
}> = ({children, tone = 'cream'}) => (
  <AbsoluteFill
    data-finanzneo-motion-v3={tone}
    style={{
      background: MOTION_V3.surface[tone],
      color: tone === 'dark' ? MOTION_V3.white : MOTION_V3.ink,
      fontFamily: FONT.body,
      overflow: 'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);

export const EditorialCaptionV3: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  width?: number;
  opacity?: number;
  emphasis?: boolean;
}> = ({children, x, y, width = 280, opacity = 1, emphasis = false}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      color: emphasis ? MOTION_V3.greenDark : MOTION_V3.ink,
      fontFamily: FONT.body,
      fontWeight: emphasis ? 900 : 800,
      fontSize: emphasis ? 32 : 25,
      lineHeight: 1.15,
      textAlign: 'center',
      opacity,
    }}
  >
    {children}
  </div>
);

export const BigValueV3: React.FC<{
  value: string;
  x: number;
  y: number;
  opacity?: number;
  scale?: number;
  tone?: 'green' | 'orange' | 'blue' | 'gold' | 'ink';
}> = ({value, x, y, opacity = 1, scale = 1, tone = 'ink'}) => {
  const color = tone === 'ink' ? MOTION_V3.ink : MOTION_V3[tone];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        color,
        fontFamily: FONT.title,
        fontSize: 64,
        fontWeight: 900,
        letterSpacing: 0.2,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {value}
    </div>
  );
};

export const DrawnPathV3: React.FC<{
  d: string;
  progress: number;
  stroke?: string;
  width?: number;
  ghost?: boolean;
}> = ({d, progress, stroke = MOTION_V3.green, width = 10, ghost = true}) => {
  const evolved = evolvePath(progress, d);
  return (
    <>
      {ghost ? <path d={d} fill="none" stroke={MOTION_V3.line} strokeWidth={width} strokeLinecap="round" /> : null}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </>
  );
};

export const PathFollowerV3: React.FC<{
  d: string;
  progress: number;
  size?: number;
  color?: string;
  children?: React.ReactNode;
}> = ({d, progress, size = 34, color = MOTION_V3.ink, children}) => {
  const length = getLength(d);
  const point = getPointAtLength(d, length * progress) ?? {x: 0, y: 0};
  return (
    <div
      style={{
        position: 'absolute',
        left: point.x - size / 2,
        top: point.y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        border: `5px solid ${MOTION_V3.surface.paper}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: MOTION_V3.white,
        fontWeight: 900,
        fontSize: Math.max(14, size * 0.35),
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

export const SoftCardV3: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  scale?: number;
  borderColor?: string;
}> = ({children, x, y, width, height, opacity = 1, scale = 1, borderColor = MOTION_V3.line}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      borderRadius: 30,
      background: MOTION_V3.white,
      border: `2px solid ${borderColor}`,
      boxShadow: '0 12px 30px rgba(36,48,42,0.07)',
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: '50% 50%',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);
