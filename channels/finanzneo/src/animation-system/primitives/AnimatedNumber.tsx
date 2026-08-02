import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type AnimatedNumberProps = {
  from?: number;
  to: number;
  startFrame?: number;
  durationInFrames?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  style?: React.CSSProperties;
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  from = 0,
  to,
  startFrame = 0,
  durationInFrames = 30,
  prefix = '',
  suffix = '',
  decimals = 0,
  locale = 'de-DE',
  style,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [from, to],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return <span style={style}>{prefix}{formatted}{suffix}</span>;
};
