import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber} from '../primitives/AnimatedNumber';

export type DebtPaydownTemplateProps = {
  startingDebt: number;
  remainingDebt: number;
  paidInstallments: number;
  totalInstallments: number;
  currency?: string;
};

export const DebtPaydownTemplate: React.FC<DebtPaydownTemplateProps> = ({
  startingDebt,
  remainingDebt,
  paidInstallments,
  totalInstallments,
  currency = '€',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentDebt = startingDebt + (remainingDebt - startingDebt) * progress;
  const ratio = Math.max(0, Math.min(1, currentDebt / Math.max(1, startingDebt)));
  const installmentProgress = Math.max(0, Math.min(1, paidInstallments / Math.max(1, totalInstallments)));

  return (
    <AbsoluteFill style={{background: '#07120B', padding: 78, fontFamily: 'Inter, sans-serif', color: '#F5F7F4'}}>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 2.5, color: '#5CFF9A'}}>RESTSCHULD</div>
      <div style={{fontSize: 88, fontWeight: 950, marginTop: 20}}><AnimatedNumber value={currentDebt} suffix={` ${currency}`} /></div>
      <div style={{marginTop: 86, height: 420, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 44, background: 'rgba(255,255,255,0.07)', padding: 28, display: 'flex', alignItems: 'flex-end'}}>
          <div style={{width: '100%', height: `${Math.max(4, ratio * 100)}%`, borderRadius: 32, background: 'linear-gradient(180deg, #FF7C83, #A83239)', boxShadow: '0 0 38px rgba(255,92,99,0.24)'}} />
        </div>
      </div>
      <div style={{marginTop: 54}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 800, color: '#AFC0B4'}}>
          <span>Raten bezahlt</span>
          <span>{paidInstallments} / {totalInstallments}</span>
        </div>
        <div style={{height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.09)', overflow: 'hidden', marginTop: 14}}>
          <div style={{height: '100%', width: `${installmentProgress * 100}%`, borderRadius: 999, background: '#5CFF9A', boxShadow: '0 0 28px rgba(92,255,154,0.32)'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
