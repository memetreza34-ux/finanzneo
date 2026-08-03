import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  futureValueLumpSum,
  futureValueMonthlyInvestment,
} from '../calculations/financeMath';
import {AnimatedNumber, ProgressBar} from '../primitives';

export type CompoundGrowthTemplateProps = {
  principal: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  years: number;
  accent?: string;
};

export type CompoundGrowthBar = {
  elapsedYears: number;
  value: number;
  height: number;
};

const safeNonNegative = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

const calculateCompoundValue = (
  principal: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  elapsedYears: number,
): number => {
  const rate = safeNonNegative(annualReturnPercent) / 100;
  return (
    futureValueLumpSum(safeNonNegative(principal), rate, elapsedYears) +
    futureValueMonthlyInvestment(
      safeNonNegative(monthlyContribution),
      rate,
      elapsedYears,
    )
  );
};

/**
 * Jeder sichtbare Balken wird aus denselben Eingabedaten wie der Endwert
 * berechnet. Es gibt keine frei interpolierten oder erfundenen Zwischenwerte.
 */
export const resolveCompoundGrowthBars = (
  principal: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  count = 8,
): CompoundGrowthBar[] => {
  const safeYears = Math.max(0, Number.isFinite(years) ? years : 0);
  const safeCount = Math.max(1, Math.round(Number.isFinite(count) ? count : 8));
  const elapsedYears = Array.from({length: safeCount}, (_, index) =>
    safeCount === 1 ? safeYears : safeYears * index / (safeCount - 1),
  );
  const values = elapsedYears.map((elapsed) =>
    calculateCompoundValue(
      principal,
      monthlyContribution,
      annualReturnPercent,
      elapsed,
    ),
  );
  const maximumValue = Math.max(0, ...values);

  return values.map((value, index) => ({
    elapsedYears: elapsedYears[index] ?? 0,
    value,
    height: value > 0 && maximumValue > 0
      ? 110 + value / maximumValue * 620
      : 0,
  }));
};

const formatElapsedYears = (elapsedYears: number): string => {
  if (elapsedYears === 0) return 'Start';
  const rounded = Math.round(elapsedYears * 10) / 10;
  return `Jahr ${rounded.toLocaleString('de-DE', {maximumFractionDigits: 1})}`;
};

export const CompoundGrowthTemplate: React.FC<CompoundGrowthTemplateProps> = ({
  principal,
  monthlyContribution,
  annualReturnPercent,
  years,
  accent = '#5CFF9A',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const bars = resolveCompoundGrowthBars(
    principal,
    monthlyContribution,
    annualReturnPercent,
    years,
  );
  const safePrincipal = safeNonNegative(principal);
  const finalValue = bars[bars.length - 1]?.value ?? safePrincipal;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #07120B 0%, #030805 100%)', color: '#F5F7F4', padding: 72, boxSizing: 'border-box'}}>
      <div style={{fontSize: 32, fontWeight: 800, letterSpacing: 3, color: accent}}>ZINSESZINS</div>
      <div style={{fontSize: 72, fontWeight: 950, marginTop: 14}}>Dein Geld wächst mit der Zeit</div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 820, marginTop: 70}}>
        {bars.map((bar, index) => {
          const local = Math.max(0, Math.min(1, progress * bars.length - index));
          return (
            <div key={`${bar.elapsedYears}-${index}`} style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 14}}>
              <div style={{fontSize: 24, fontWeight: 800, opacity: local}}>
                {Math.round(bar.value).toLocaleString('de-DE')} €
              </div>
              <div style={{width: '100%', height: bar.height * local, borderRadius: '22px 22px 8px 8px', background: `linear-gradient(180deg, ${accent}, rgba(92,255,154,0.28))`, boxShadow: local > 0 && bar.height > 0 ? '0 14px 40px rgba(0,0,0,0.28)' : 'none'}} />
              <div style={{fontSize: 22, color: '#AFC0B4'}}>{formatElapsedYears(bar.elapsedYears)}</div>
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
          <AnimatedNumber to={finalValue} suffix=" €" startFrame={12} durationInFrames={42} style={{fontSize: 54, fontWeight: 950, color: accent}} />
        </div>
      </div>
      <ProgressBar progress={progress} animated={false} style={{marginTop: 36}} />
    </AbsoluteFill>
  );
};
