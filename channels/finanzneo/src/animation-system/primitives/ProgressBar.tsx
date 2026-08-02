import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type ProgressBarProps = {
  progress: number;
  animated?: boolean;
  label?: string;
  startFrame?: number;
  durationInFrames?: number;
  height?: number;
  background?: string;
  fill?: string;
  radius?: number;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
};

export type ResolveProgressBarValueInput = Pick<
  ProgressBarProps,
  'progress' | 'animated' | 'startFrame' | 'durationInFrames'
> & {
  frame: number;
};

const finiteOr = (value: number | undefined, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const clampProgress = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export const resolveProgressBarValue = ({
  frame,
  progress,
  animated = true,
  startFrame = 0,
  durationInFrames = 24,
}: ResolveProgressBarValueInput): number => {
  const target = clampProgress(progress);
  if (!animated) return target;

  const safeFrame = finiteOr(frame, 0);
  const safeStartFrame = finiteOr(startFrame, 0);
  const safeDuration = Math.max(1, finiteOr(durationInFrames, 24));

  return interpolate(
    safeFrame,
    [safeStartFrame, safeStartFrame + safeDuration],
    [0, target],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = true,
  label,
  startFrame = 0,
  durationInFrames = 24,
  height = 24,
  background = 'rgba(255,255,255,0.12)',
  fill = '#5CFF9A',
  radius = 999,
  style,
  labelStyle,
}) => {
  const frame = useCurrentFrame();
  const resolvedProgress = resolveProgressBarValue({
    frame,
    progress,
    animated,
    startFrame,
    durationInFrames,
  });

  return (
    <div style={{width: '100%'}}>
      {label ? (
        <div style={{fontSize: 24, fontWeight: 800, color: '#AFC0B4', marginBottom: 12, ...labelStyle}}>
          {label}
        </div>
      ) : null}
      <div style={{height, borderRadius: radius, overflow: 'hidden', background, ...style}}>
        <div style={{height: '100%', width: `${resolvedProgress * 100}%`, background: fill, borderRadius: radius}} />
      </div>
    </div>
  );
};
