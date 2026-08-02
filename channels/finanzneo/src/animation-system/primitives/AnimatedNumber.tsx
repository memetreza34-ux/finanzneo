import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type AnimatedNumberProps = {
  from?: number;
  to?: number;
  value?: number;
  startFrame?: number;
  durationInFrames?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  style?: React.CSSProperties;
};

export type ResolveAnimatedNumberValueInput = Pick<
  AnimatedNumberProps,
  'from' | 'to' | 'value' | 'startFrame' | 'durationInFrames'
> & {
  frame: number;
};

/**
 * `to` bezeichnet einen Zielwert, der intern animiert wird.
 * `value` bezeichnet dagegen einen bereits berechneten Wert und wird exakt angezeigt.
 * Dadurch werden Werte, die ein Template selbst pro Frame berechnet, nicht doppelt animiert.
 */
export const resolveAnimatedNumberValue = ({
  frame,
  from = 0,
  to,
  value,
  startFrame = 0,
  durationInFrames = 30,
}: ResolveAnimatedNumberValueInput): number => {
  if (to === undefined) return value ?? 0;

  return interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [from, to],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  from = 0,
  to,
  value,
  startFrame = 0,
  durationInFrames = 30,
  prefix = '',
  suffix = '',
  decimals = 0,
  locale = 'de-DE',
  style,
}) => {
  const frame = useCurrentFrame();
  const resolvedValue = resolveAnimatedNumberValue({
    frame,
    from,
    to,
    value,
    startFrame,
    durationInFrames,
  });
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(resolvedValue);

  return <span style={style}>{prefix}{formatted}{suffix}</span>;
};
