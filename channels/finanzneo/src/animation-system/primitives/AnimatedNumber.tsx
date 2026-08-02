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

const finiteOr = (value: number | undefined, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

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
  if (to === undefined) return finiteOr(value, 0);

  const safeFrame = finiteOr(frame, 0);
  const safeStartFrame = finiteOr(startFrame, 0);
  const safeDuration = Math.max(1, finiteOr(durationInFrames, 30));

  return interpolate(
    safeFrame,
    [safeStartFrame, safeStartFrame + safeDuration],
    [finiteOr(from, 0), finiteOr(to, 0)],
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
  const safeDecimals = Math.max(0, Math.min(20, Math.round(finiteOr(decimals, 0))));
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(resolvedValue);

  return <span style={style}>{prefix}{formatted}{suffix}</span>;
};
