import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type ProgressBarProps = {
  progress: number;
  startFrame?: number;
  durationInFrames?: number;
  height?: number;
  background?: string;
  fill?: string;
  radius?: number;
  style?: React.CSSProperties;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  startFrame = 0,
  durationInFrames = 24,
  height = 24,
  background = 'rgba(255,255,255,0.12)',
  fill = '#5CFF9A',
  radius = 999,
  style,
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [0, Math.max(0, Math.min(1, progress))],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div style={{height, borderRadius: radius, overflow: 'hidden', background, ...style}}>
      <div style={{height: '100%', width: `${reveal * 100}%`, background: fill, borderRadius: radius}} />
    </div>
  );
};
