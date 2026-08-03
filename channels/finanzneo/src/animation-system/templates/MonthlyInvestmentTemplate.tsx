import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {futureValueMonthlyInvestment} from '../calculations/financeMath';
import {AnimatedNumber, ProgressBar} from '../primitives';

export type MonthlyInvestmentTemplateProps = {
  monthlyAmount: number;
  months: number;
  annualReturnPercent: number;
  label?: string;
};

export type MonthlyInvestmentFrame = {
  completedMonths: number;
  invested: number;
  currentValue: number;
  earnings: number;
  progress: number;
};

const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

/**
 * Der sichtbare Zwischenwert wird aus den tatsächlich abgeschlossenen Monaten
 * und der gelieferten Rendite berechnet. Eine lineare Schätzung zwischen null
 * und dem Endwert wird bewusst nicht verwendet.
 */
export const resolveMonthlyInvestmentFrame = ({
  monthlyAmount,
  months,
  annualReturnPercent,
  progress,
}: Omit<MonthlyInvestmentTemplateProps, 'label'> & {progress: number}): MonthlyInvestmentFrame => {
  const safeMonthlyAmount = Math.max(0, Number.isFinite(monthlyAmount) ? monthlyAmount : 0);
  const safeMonths = Math.max(0, Math.round(Number.isFinite(months) ? months : 0));
  const safeAnnualReturnPercent = Number.isFinite(annualReturnPercent)
    ? Math.max(-99.999, annualReturnPercent)
    : 0;
  const frameProgress = clamp01(progress);
  const completedMonths = Math.min(
    safeMonths,
    Math.round(safeMonths * frameProgress),
  );
  const completedRatio = safeMonths > 0 ? completedMonths / safeMonths : 0;
  const invested = safeMonthlyAmount * completedMonths;
  const currentValue = futureValueMonthlyInvestment(
    safeMonthlyAmount,
    safeAnnualReturnPercent / 100,
    completedMonths / 12,
  );

  return {
    completedMonths,
    invested,
    currentValue,
    earnings: currentValue - invested,
    progress: completedRatio,
  };
};

export const MonthlyInvestmentTemplate: React.FC<MonthlyInvestmentTemplateProps> = ({
  monthlyAmount,
  months,
  annualReturnPercent,
  label = 'Monatlicher Sparplan',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resolved = resolveMonthlyInvestmentFrame({
    monthlyAmount,
    months,
    annualReturnPercent,
    progress,
  });
  const earningsAccent = resolved.earnings >= 0 ? '#5CFF9A' : '#FF7C83';

  return (
    <AbsoluteFill style={{padding: 72, background: '#07120B', color: '#F5F7F4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 34, fontWeight: 800, color: '#5CFF9A', letterSpacing: 2}}>{label}</div>
      <div style={{marginTop: 46, fontSize: 86, fontWeight: 950}}>
        <AnimatedNumber value={resolved.currentValue} suffix=" €" decimals={0} />
      </div>
      <div style={{marginTop: 22, fontSize: 34, color: '#AFC0B4'}}>
        Eingezahlt: <AnimatedNumber value={resolved.invested} suffix=" €" decimals={0} />
      </div>
      <div style={{marginTop: 14, fontSize: 30, color: earningsAccent, fontWeight: 800}}>
        Entwicklung: <AnimatedNumber value={resolved.earnings} suffix=" €" decimals={0} />
      </div>
      <div style={{marginTop: 72}}>
        <ProgressBar
          progress={resolved.progress}
          animated={false}
          label={`${resolved.completedMonths} von ${months} Monaten`}
        />
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 120, display: 'flex', justifyContent: 'space-between', fontSize: 30}}>
        <span>{monthlyAmount.toLocaleString('de-DE')} € pro Monat</span>
        <span>{annualReturnPercent.toLocaleString('de-DE', {maximumFractionDigits: 2})} % p.a.</span>
      </div>
    </AbsoluteFill>
  );
};
