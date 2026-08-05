import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber} from '../primitives/AnimatedNumber';

export type PortfolioAllocationTemplateProps = {
  total: number;
  allocations: Array<{label: string; weight: number}>;
  currency?: string;
};

export type NormalizedPortfolioAllocation = {
  label: string;
  percent: number;
};

/**
 * Normalisiert neutrale Gewichtungen auf exakt 100 Prozent. Dadurch stimmen
 * die angezeigte Prozentzahl und der daraus berechnete Geldbetrag immer
 * überein, unabhängig davon, ob der Renderer Prozentwerte oder absolute
 * Beträge als Gewichtung übergibt.
 */
export const normalizePortfolioPercentages = (
  allocations: Array<{label: string; weight: number}>,
): NormalizedPortfolioAllocation[] => {
  const sanitized = allocations.map((item) => ({
    label: item.label,
    weight: Number.isFinite(item.weight) ? Math.max(0, item.weight) : 0,
  }));
  const totalWeight = sanitized.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    return sanitized.map((item) => ({label: item.label, percent: 0}));
  }
  return sanitized.map((item) => ({
    label: item.label,
    percent: item.weight / totalWeight * 100,
  }));
};

export const PortfolioAllocationTemplate: React.FC<PortfolioAllocationTemplateProps> = ({
  total,
  allocations,
  currency = '€',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const normalized = normalizePortfolioPercentages(allocations);

  return (
    <AbsoluteFill style={{background: '#07120B', padding: 76, fontFamily: 'Inter, sans-serif', color: '#F5F7F4'}}>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 2.5, color: '#5CFF9A'}}>PORTFOLIO</div>
      <div style={{fontSize: 86, fontWeight: 950, marginTop: 18}}><AnimatedNumber value={total} suffix={` ${currency}`} /></div>
      <div style={{marginTop: 76, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        {normalized.map((item, index) => {
          const value = total * (item.percent / 100);
          const reveal = interpolate(progress, [Math.min(0.8, index * 0.08), Math.min(1, index * 0.08 + 0.35)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div key={`${item.label}-${index}`} style={{borderRadius: 34, padding: 30, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(92,255,154,0.18)', opacity: reveal, transform: `translateY(${(1 - reveal) * 32}px)`}}>
              <div style={{fontSize: 30, color: '#AFC0B4', fontWeight: 800}}>{item.label}</div>
              <div style={{fontSize: 56, fontWeight: 950, marginTop: 10}}><AnimatedNumber value={item.percent} suffix=" %" decimals={1} /></div>
              <div style={{fontSize: 30, fontWeight: 750, color: '#5CFF9A', marginTop: 12}}><AnimatedNumber value={value} suffix={` ${currency}`} /></div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
