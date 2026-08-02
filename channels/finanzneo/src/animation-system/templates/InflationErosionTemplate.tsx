import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber} from '../primitives/AnimatedNumber';

export type InflationErosionTemplateProps = {
  startValue: number;
  endValue: number;
  years: number;
  currency?: string;
};

export type InflationErosionFrame = {
  currentValue: number;
  remainingRatio: number;
  elapsedYears: number;
};

const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export const resolveInflationErosionFrame = ({
  startValue,
  endValue,
  years,
  progress,
}: Omit<InflationErosionTemplateProps, 'currency'> & {progress: number}): InflationErosionFrame => {
  const safeStartValue = Math.max(0, Number.isFinite(startValue) ? startValue : 0);
  const safeEndValue = Math.max(0, Number.isFinite(endValue) ? endValue : 0);
  const safeYears = Math.max(0, Number.isFinite(years) ? years : 0);
  const frameProgress = clamp01(progress);
  const currentValue = safeStartValue + (safeEndValue - safeStartValue) * frameProgress;

  return {
    currentValue,
    remainingRatio: safeStartValue > 0 ? clamp01(currentValue / safeStartValue) : 0,
    elapsedYears: Math.round(safeYears * frameProgress),
  };
};

export const InflationErosionTemplate: React.FC<InflationErosionTemplateProps> = ({
  startValue,
  endValue,
  years,
  currency = '€',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resolved = resolveInflationErosionFrame({startValue, endValue, years, progress});
  const timeLabel = resolved.elapsedYears === 0
    ? 'heute'
    : `nach ${resolved.elapsedYears} ${resolved.elapsedYears === 1 ? 'Jahr' : 'Jahren'}`;

  return (
    <AbsoluteFill style={{background: '#07120B', padding: 78, fontFamily: 'Inter, sans-serif', color: '#F5F7F4'}}>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 2.5, color: '#5CFF9A'}}>KAUFKRAFT</div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 30}}>
        <div style={{fontSize: 92, fontWeight: 950}}><AnimatedNumber value={resolved.currentValue} suffix={` ${currency}`} /></div>
        <div style={{fontSize: 34, fontWeight: 750, color: '#AFC0B4', paddingBottom: 14}}>{timeLabel}</div>
      </div>
      <div style={{marginTop: 90, height: 560, display: 'flex', alignItems: 'flex-end', gap: 42}}>
        <div style={{flex: 1, height: '100%', borderRadius: 42, background: 'rgba(255,255,255,0.08)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <div style={{height: '100%', borderRadius: 28, background: 'linear-gradient(180deg, #5CFF9A, #1D7C43)', boxShadow: '0 0 38px rgba(92,255,154,0.24)'}} />
          <div style={{fontSize: 28, fontWeight: 800, marginTop: 18}}>Heute</div>
        </div>
        <div style={{flex: 1, height: '100%', borderRadius: 42, background: 'rgba(255,255,255,0.08)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <div style={{height: `${resolved.remainingRatio * 100}%`, borderRadius: 28, background: 'linear-gradient(180deg, #F2C14E, #A76D00)', boxShadow: resolved.remainingRatio > 0 ? '0 0 32px rgba(242,193,78,0.22)' : 'none'}} />
          <div style={{fontSize: 28, fontWeight: 800, marginTop: 18}}>Später</div>
        </div>
      </div>
      <div style={{fontSize: 32, color: '#AFC0B4', fontWeight: 750, marginTop: 44}}>Gleicher Kontostand, geringere Kaufkraft.</div>
    </AbsoluteFill>
  );
};
