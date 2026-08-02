import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber, ProgressBar} from '../primitives';

export type MonthlyInvestmentTemplateProps = {
  monthlyAmount: number;
  months: number;
  finalValue: number;
  label?: string;
};

export const MonthlyInvestmentTemplate: React.FC<MonthlyInvestmentTemplateProps> = ({
  monthlyAmount,
  months,
  finalValue,
  label = 'Monatlicher Sparplan',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const completedMonths = Math.max(0, Math.round(months * progress));
  const invested = monthlyAmount * completedMonths;
  const value = finalValue * progress;

  return (
    <AbsoluteFill style={{padding: 72, background: '#07120B', color: '#F5F7F4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 34, fontWeight: 800, color: '#5CFF9A', letterSpacing: 2}}>{label}</div>
      <div style={{marginTop: 46, fontSize: 86, fontWeight: 950}}>
        <AnimatedNumber value={value} suffix=" €" decimals={0} />
      </div>
      <div style={{marginTop: 22, fontSize: 34, color: '#AFC0B4'}}>
        Eingezahlt: <AnimatedNumber value={invested} suffix=" €" decimals={0} />
      </div>
      <div style={{marginTop: 72}}>
        <ProgressBar
          progress={progress}
          animated={false}
          label={`${completedMonths} von ${months} Monaten`}
        />
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 120, display: 'flex', justifyContent: 'space-between', fontSize: 30}}>
        <span>{monthlyAmount.toLocaleString('de-DE')} € pro Monat</span>
        <span>{months} Monate</span>
      </div>
    </AbsoluteFill>
  );
};
