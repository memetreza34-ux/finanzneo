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

  const card = (label: string, value: number, progress: number, emphasized: boolean) => (
    <div style={{flex: 1, borderRadius: 40, padding: 46, background: emphasized ? 'rgba(22,72,39,0.92)' : 'rgba(10,31,18,0.92)', border: emphasized ? '3px solid #5CFF9A' : '2px solid rgba(92,255,154,0.22)', transform: `translateY(${(1 - progress) * 54}px) scale(${0.94 + progress * 0.06})`, opacity: progress}}>
      <div style={{fontSize: 31, fontWeight: 800, color: emphasized ? '#5CFF9A' : '#AFC0B4'}}>{label}</div>
      <div style={{marginTop: 32, fontSize: 74, fontWeight: 950, color: '#F5F7F4'}}>
        <AnimatedNumber value={value * progress} suffix={unit} decimals={0} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{padding: 72, background: '#07120B', color: '#F5F7F4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 34, fontWeight: 850, color: '#5CFF9A', letterSpacing: 2}}>Vorher–Nachher</div>
      <div style={{marginTop: 88, display: 'flex', gap: 28}}>
        {card(beforeLabel, beforeValue, reveal, false)}
        {card(afterLabel, afterValue, afterReveal, true)}
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 128, textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#AFC0B4', opacity: afterReveal}}>
        Unterschied: <span style={{color: '#5CFF9A'}}><AnimatedNumber value={(afterValue - beforeValue) * afterReveal} suffix={unit} decimals={0} /></span>
      </div>
    </AbsoluteFill>
  );
};
