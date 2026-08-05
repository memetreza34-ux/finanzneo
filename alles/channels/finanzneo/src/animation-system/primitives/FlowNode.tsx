import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type FlowNodeProps = {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  startFrame?: number;
  accent?: string;
  width?: number;
  style?: React.CSSProperties;
};

const finiteOr = (value: number | undefined, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

export const resolveFlowNodeLocalFrame = (
  frame: number,
  startFrame: number,
): number => Math.max(0, finiteOr(frame, 0) - finiteOr(startFrame, 0));

export const FlowNode: React.FC<FlowNodeProps> = ({
  label,
  value,
  icon,
  startFrame = 0,
  accent = '#5CFF9A',
  width = 260,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = resolveFlowNodeLocalFrame(frame, startFrame);
  const safeFps = Math.max(1, finiteOr(fps, 30));
  const safeWidth = Math.max(0, finiteOr(width, 260));
  const enter = spring({frame: local, fps: safeFps, config: {damping: 18, stiffness: 120}});
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      width: safeWidth,
      minHeight: 132,
      borderRadius: 28,
      padding: '24px 26px',
      boxSizing: 'border-box',
      background: 'rgba(7,24,13,0.9)',
      border: `2px solid ${accent}55`,
      boxShadow: '0 18px 55px rgba(0,0,0,0.34)',
      color: '#F5F7F4',
      opacity,
      transform: `translateY(${(1 - enter) * 26}px) scale(${0.94 + enter * 0.06})`,
      ...style,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        {icon && <div style={{color: accent, display: 'flex'}}>{icon}</div>}
        <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 0.3}}>{label}</div>
      </div>
      {value && <div style={{fontSize: 44, fontWeight: 950, color: accent, marginTop: 14}}>{value}</div>}
    </div>
  );
};
