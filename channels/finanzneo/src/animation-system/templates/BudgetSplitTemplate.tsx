import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber} from '../primitives/AnimatedNumber';

export type BudgetSplitTemplateProps = {
  income: number;
  categories: Array<{label: string; value: number}>;
  currency?: string;
};

export const BudgetSplitTemplate: React.FC<BudgetSplitTemplateProps> = ({
  income,
  categories,
  currency = '€',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const total = Math.max(1, categories.reduce((sum, item) => sum + item.value, 0));

  return (
    <AbsoluteFill style={{background: '#07120B', padding: 76, fontFamily: 'Inter, sans-serif', color: '#F5F7F4'}}>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 2.5, color: '#5CFF9A'}}>BUDGETAUFTEILUNG</div>
      <div style={{fontSize: 84, fontWeight: 950, marginTop: 18}}>
        <AnimatedNumber value={income} suffix={` ${currency}`} />
      </div>
      <div style={{marginTop: 80, display: 'grid', gap: 26}}>
        {categories.map((item, index) => {
          const start = index * 8;
          const progress = interpolate(frame, [start, Math.min(durationInFrames - 1, start + 24)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const width = Math.max(6, (item.value / total) * 100 * progress);
          return (
            <div key={`${item.label}-${index}`}>
              <div style={{display: 'flex', justifyContent: 'space-between', gap: 30, fontSize: 34, fontWeight: 800}}>
                <span>{item.label}</span>
                <span><AnimatedNumber value={item.value} suffix={` ${currency}`} /></span>
              </div>
              <div style={{height: 38, borderRadius: 999, marginTop: 14, background: 'rgba(255,255,255,0.09)', overflow: 'hidden'}}>
                <div style={{width: `${width}%`, height: '100%', borderRadius: 999, background: '#5CFF9A', boxShadow: '0 0 28px rgba(92,255,154,0.34)'}} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
