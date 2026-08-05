import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber} from '../primitives';

export type BeforeAfterComparisonTemplateProps = {
  beforeLabel: string;
  afterLabel: string;
  beforeValue: number;
  afterValue: number;
  unit?: string;
};

export type ComparisonDelta = {
  delta: number;
  direction: 'positive' | 'negative' | 'neutral';
  accent: string;
};

export const resolveComparisonDelta = (
  beforeValue: number,
  afterValue: number,
): ComparisonDelta => {
  const before = Number.isFinite(beforeValue) ? beforeValue : 0;
  const after = Number.isFinite(afterValue) ? afterValue : 0;
  const delta = after - before;
  if (delta > 0) return {delta, direction: 'positive', accent: '#5CFF9A'};
  if (delta < 0) return {delta, direction: 'negative', accent: '#FF7C83'};
  return {delta: 0, direction: 'neutral', accent: '#AFC0B4'};
};

export const BeforeAfterComparisonTemplate: React.FC<BeforeAfterComparisonTemplateProps> = ({
  beforeLabel,
  afterLabel,
  beforeValue,
  afterValue,
  unit = ' €',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const reveal = interpolate(frame, [0, Math.max(1, durationInFrames * 0.62)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const afterReveal = interpolate(frame, [durationInFrames * 0.28, Math.max(1, durationInFrames * 0.9)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const comparison = resolveComparisonDelta(beforeValue, afterValue);

  const card = (
    label: string,
    value: number,
    progress: number,
    emphasized: boolean,
    accent: string,
  ) => (
    <div style={{flex: 1, borderRadius: 40, padding: 46, background: emphasized ? `${accent}18` : 'rgba(10,31,18,0.92)', border: emphasized ? `3px solid ${accent}` : '2px solid rgba(92,255,154,0.22)', transform: `translateY(${(1 - progress) * 54}px) scale(${0.94 + progress * 0.06})`, opacity: progress}}>
      <div style={{fontSize: 31, fontWeight: 800, color: emphasized ? accent : '#AFC0B4'}}>{label}</div>
      <div style={{marginTop: 32, fontSize: 74, fontWeight: 950, color: '#F5F7F4'}}>
        <AnimatedNumber value={value * progress} suffix={unit} decimals={0} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{padding: 72, background: '#07120B', color: '#F5F7F4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 34, fontWeight: 850, color: '#5CFF9A', letterSpacing: 2}}>Vorher–Nachher</div>
      <div style={{marginTop: 88, display: 'flex', gap: 28}}>
        {card(beforeLabel, beforeValue, reveal, false, '#AFC0B4')}
        {card(afterLabel, afterValue, afterReveal, true, comparison.accent)}
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 128, textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#AFC0B4', opacity: afterReveal}}>
        Unterschied: <span style={{color: comparison.accent}}><AnimatedNumber value={comparison.delta * afterReveal} suffix={unit} decimals={0} /></span>
      </div>
    </AbsoluteFill>
  );
};
