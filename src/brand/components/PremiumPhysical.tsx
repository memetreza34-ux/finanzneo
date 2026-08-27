import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ANIMATION_COLORS, C, REEL_STYLE, a} from '../tokens';
import {AnimationStage} from './ReelStage';

export type PremiumMaterial = 'structure' | 'neutral' | 'money' | 'warning' | 'positive';

const MATERIALS: Record<PremiumMaterial, {
  face: string;
  edge: string;
  rim: string;
  text: string;
  shadow: string;
}> = {
  structure: {
    face: '#123525', edge: '#071A11', rim: '#54F3A2', text: C.white,
    shadow: '0 30px 55px rgba(0,0,0,0.48), 0 8px 20px rgba(0,0,0,0.34)',
  },
  neutral: {
    face: '#E8E0CC', edge: '#8E8878', rim: '#FFF5D8', text: '#122018',
    shadow: '0 28px 52px rgba(0,0,0,0.40), 0 8px 18px rgba(0,0,0,0.28)',
  },
  money: {
    face: '#D5A72A', edge: '#7A5610', rim: '#FFE59B', text: '#251B07',
    shadow: '0 30px 58px rgba(0,0,0,0.44), 0 8px 22px rgba(255,200,61,0.14)',
  },
  warning: {
    face: '#B9422D', edge: '#641B13', rim: '#FF9B72', text: C.white,
    shadow: '0 30px 58px rgba(0,0,0,0.46), 0 8px 22px rgba(255,70,50,0.12)',
  },
  positive: {
    face: '#0C7A47', edge: '#06442A', rim: '#6CFFB5', text: C.white,
    shadow: '0 30px 58px rgba(0,0,0,0.46), 0 8px 22px rgba(0,210,106,0.15)',
  },
};

export const PREMIUM_VISUAL_LOCK = 'finanzneo-premium-physical-animation-v2';

export const PremiumPhysicalStage: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({children, scale}) => (
  <AnimationStage scale={scale}>
    <AbsoluteFill style={{perspective: 1400, overflow: 'hidden'}}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 42% 42%, rgba(20,104,66,0.20) 0%, rgba(9,35,22,0.10) 38%, rgba(2,10,6,0) 72%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 620, height: 620, left: 200, top: 420,
        borderRadius: '50%', filter: 'blur(95px)',
        background: 'rgba(0,210,106,0.06)', pointerEvents: 'none',
      }} />
      {children}
    </AbsoluteFill>
  </AnimationStage>
);

export const PhysicalObject: React.FC<{
  children?: React.ReactNode;
  material?: PremiumMaterial;
  width: number;
  height: number;
  x: number;
  y: number;
  depth?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  material = 'structure',
  width,
  height,
  x,
  y,
  depth = 26,
  rotateX = 4,
  rotateY = -8,
  rotateZ = 0,
  scale = 1,
  opacity = 1,
  radius = 38,
  style,
}) => {
  const m = MATERIALS[material];
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      borderRadius: radius,
      background: `linear-gradient(145deg, ${m.rim} 0%, ${m.face} 12%, ${m.face} 72%, ${m.edge} 100%)`,
      border: `1px solid ${a(m.rim, 0.34)}`,
      color: m.text,
      boxShadow: `${m.shadow}, inset 0 1px 0 ${a('#FFFFFF', 0.28)}, inset 0 -${Math.max(6, Math.round(depth * 0.45))}px ${Math.max(10, depth)}px ${a(m.edge, 0.35)}`,
      transform: `translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
      transformStyle: 'preserve-3d',
      opacity,
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', left: '8%', right: '8%', top: '5%', height: '22%',
        borderRadius: 999, background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0))',
        filter: 'blur(1px)', pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
};

export const PhysicalTag: React.FC<{
  children: React.ReactNode;
  material?: PremiumMaterial;
  style?: React.CSSProperties;
}> = ({children, material = 'neutral', style}) => {
  const m = MATERIALS[material];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px 16px', borderRadius: 12,
      background: `linear-gradient(145deg, ${m.rim}, ${m.face} 22%, ${m.edge})`,
      color: m.text, border: `1px solid ${a(m.rim, 0.42)}`,
      boxShadow: `0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 ${a('#FFFFFF', 0.24)}`,
      fontWeight: 900, letterSpacing: 0.4,
      ...style,
    }}>
      {children}
    </div>
  );
};

export const PhysicalRail: React.FC<{
  x: number;
  y: number;
  width: number;
  progress: number;
  material?: 'positive' | 'money' | 'warning';
  thickness?: number;
}> = ({x, y, width, progress, material = 'positive', thickness = 24}) => {
  const color = material === 'money'
    ? ANIMATION_COLORS.money
    : material === 'warning'
      ? ANIMATION_COLORS.warning
      : ANIMATION_COLORS.focus;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height: thickness,
      borderRadius: thickness / 2,
      background: 'rgba(255,255,255,0.07)',
      boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.32), 0 10px 18px rgba(0,0,0,0.20)',
      overflow: 'hidden', transform: 'translateZ(8px)',
    }}>
      <div style={{
        height: '100%', width: `${clamped * 100}%`, borderRadius: thickness / 2,
        background: `linear-gradient(90deg, ${a(color, 0.64)}, ${color})`,
        boxShadow: `0 0 22px ${a(color, 0.30)}, inset 0 2px 0 ${a('#FFFFFF', 0.26)}`,
      }} />
    </div>
  );
};

export const PremiumDepthGuide = {
  visualTop: REEL_STYLE.visual.top,
  visualBottom: REEL_STYLE.visual.bottom,
  heroMinCoverage: 0.45,
  heroMaxCoverage: 0.65,
  supportingObjectsMin: 2,
  supportingObjectsMax: 4,
} as const;
