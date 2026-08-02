import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber, ProgressBar} from '../primitives';

export type CompoundGrowthTemplateProps = {
  principal: number;
  finalValue: number;
  years: number;
  accent?: string;
};

export type CompoundGrowthBar = {
  year: number;
  value: number;
  height: number;
};

export const resolveCompoundGrowthBars = (
  principal: number,
  finalValue: number,
  years: number,
  count = 8,
): CompoundGrowthBar[] => {
  const safePrincipal = Math.max(0, Number.isFinite(principal) ? principal : 0);
  const safeFinalValue = Math.max(
    safePrincipal,
    Number.isFinite(finalValue) ? finalValue : safePrincipal,
  );
  const safeYears = Math.max(1, Number.isFinite(years) ? years : 1);
  const safeCount = Math.max(1, Math.round(Number.isFinite(count) ? count : 8));
  const range = safeFinalValue - safePrincipal;

  return Array.from({length: safeCount}, (_, index) => {
    const timeProgress = (index + 1) / safeCount;
    const value = safePrincipal + range * Math.pow(timeProgress, 1.8);
    const valueProgress = range > 0 ? (value - safePrincipal) / range : timeProgress;
    return {
      year: Math.max(1, Math.round((index + 1) * safeYears / safeCount)),
      value,
      height: 110 + valueProgress * 620,
    };
  });
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
  const bars = resolveCompoundGrowthBars(principal, finalValue, years);
  const safePrincipal = Math.max(0, Number.isFinite(principal) ? principal : 0);
  const safeFinalValue = bars.at(-1)?.value ?? safePrincipal;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #07120B 0%, #030805 100%)', color: '#F5F7F4', padding: 72, boxSizing: 'border-box'}}>
      <div style={{fontSize: 32, fontWeight: 800, letterSpacing: 3, color: accent}}>ZINSESZINS</div>
      <div style={{fontSize: 72, fontWeight: 950, marginTop: 14}}>Dein Geld wächst mit der Zeit</div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 820, marginTop: 70}}>
        {bars.map((bar, index) => {
          const local = Math.max(0, Math.min(1, progress * bars.length - index));
          return (
            <div key={`${bar.year}-${index}`} style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 14}}>
              <div style={{fontSize: 24, fontWeight: 800, opacity: local}}>
                {Math.round(bar.value).toLocaleString('de-DE')} €
              </div>
              <div style={{width: '100%', height: bar.height * local, borderRadius: '22px 22px 8px 8px', background: `linear-gradient(180deg, ${accent}, rgba(92,255,154,0.28))`, boxShadow: local > 0 ? '0 14px 40px rgba(0,0,0,0.28)' : 'none'}} />
              <div style={{fontSize: 22, color: '#AFC0B4'}}>Jahr {bar.year}</div>
            </div>
          );
        })}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 42}}>
        <div style={{borderRadius: 28, padding: 28, background: 'rgba(255,255,255,0.05)'}}>
          <div style={{fontSize: 24, color: '#AFC0B4'}}>Startkapital</div>
          <AnimatedNumber to={safePrincipal} suffix=" €" style={{fontSize: 54, fontWeight: 950}} />
        </div>
        <div style={{borderRadius: 28, padding: 28, background: 'rgba(92,255,154,0.08)'}}>
          <div style={{fontSize: 24, color: '#AFC0B4'}}>Endkapital</div>
          <AnimatedNumber to={safeFinalValue} suffix=" €" startFrame={12} durationInFrames={42} style={{fontSize: 54, fontWeight: 950, color: accent}} />
        </div>
      </div>
      <ProgressBar progress={progress} animated={false} style={{marginTop: 36}} />
    </AbsoluteFill>
  );
};
