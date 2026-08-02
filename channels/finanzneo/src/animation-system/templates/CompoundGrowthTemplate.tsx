import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber, ProgressBar} from '../primitives';

export type CompoundGrowthTemplateProps = {
  principal: number;
  finalValue: number;
  years: number;
  accent?: string;
};

export const CompoundGrowthTemplate: React.FC<CompoundGrowthTemplateProps> = ({
  principal,
  finalValue,
  years,
  accent = '#5CFF9A',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const bars = Array.from({length: 8}, (_, index) => {
    const t = (index + 1) / 8;
    const value = principal + (finalValue - principal) * Math.pow(t, 1.8);
    return {height: 110 + t * 620, value};
  });

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #07120B 0%, #030805 100%)', color: '#F5F7F4', padding: 72, boxSizing: 'border-box'}}>
      <div style={{fontSize: 32, fontWeight: 800, letterSpacing: 3, color: accent}}>ZINSESZINS</div>
      <div style={{fontSize: 72, fontWeight: 950, marginTop: 14}}>Dein Geld wächst mit der Zeit</div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 820, marginTop: 70}}>
        {bars.map((bar, index) => {
          const local = Math.max(0, Math.min(1, progress * 8 - index));
          return (
            <div key={index} style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 14}}>
              <div style={{fontSize: 24, fontWeight: 800, opacity: local}}>
                {Math.round(bar.value).toLocaleString('de-DE')} €
              </div>
              <div style={{width: '100%', height: bar.height * local, borderRadius: '22px 22px 8px 8px', background: `linear-gradient(180deg, ${accent}, rgba(92,255,154,0.28))`, boxShadow: '0 14px 40px rgba(0,0,0,0.28)'}} />
              <div style={{fontSize: 22, color: '#AFC0B4'}}>Jahr {Math.round((index + 1) * years / 8)}</div>
            </div>
          );
        })}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 42}}>
        <div style={{borderRadius: 28, padding: 28, background: 'rgba(255,255,255,0.05)'}}>
          <div style={{fontSize: 24, color: '#AFC0B4'}}>Startkapital</div>
          <AnimatedNumber to={principal} suffix=" €" style={{fontSize: 54, fontWeight: 950}} />
        </div>
        <div style={{borderRadius: 28, padding: 28, background: 'rgba(92,255,154,0.08)'}}>
          <div style={{fontSize: 24, color: '#AFC0B4'}}>Endkapital</div>
          <AnimatedNumber to={finalValue} suffix=" €" startFrame={12} durationInFrames={42} style={{fontSize: 54, fontWeight: 950, color: accent}} />
        </div>
      </div>
      <ProgressBar progress={progress} style={{marginTop: 36}} />
    </AbsoluteFill>
  );
};
