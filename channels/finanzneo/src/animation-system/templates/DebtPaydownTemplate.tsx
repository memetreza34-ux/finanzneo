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

export type DebtPaydownFrame = {
  currentDebt: number;
  debtRatio: number;
  currentPaidInstallments: number;
  installmentProgress: number;
};

const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export const resolveDebtPaydownFrame = ({
  startingDebt,
  remainingDebt,
  paidInstallments,
  totalInstallments,
  progress,
}: Omit<DebtPaydownTemplateProps, 'currency'> & {progress: number}): DebtPaydownFrame => {
  const safeStartingDebt = Math.max(0, Number.isFinite(startingDebt) ? startingDebt : 0);
  const safeRemainingDebt = Math.max(0, Number.isFinite(remainingDebt) ? remainingDebt : 0);
  const safePaidInstallments = Math.max(0, Math.round(Number.isFinite(paidInstallments) ? paidInstallments : 0));
  const safeTotalInstallments = Math.max(1, Math.round(Number.isFinite(totalInstallments) ? totalInstallments : 1));
  const frameProgress = clamp01(progress);
  const currentDebt = safeStartingDebt + (safeRemainingDebt - safeStartingDebt) * frameProgress;
  const currentPaidInstallments = Math.min(
    safeTotalInstallments,
    Math.round(safePaidInstallments * frameProgress),
  );

  return {
    currentDebt,
    debtRatio: safeStartingDebt > 0 ? clamp01(currentDebt / safeStartingDebt) : 0,
    currentPaidInstallments,
    installmentProgress: clamp01(currentPaidInstallments / safeTotalInstallments),
  };
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
  const resolved = resolveDebtPaydownFrame({
    startingDebt,
    remainingDebt,
    paidInstallments,
    totalInstallments,
    progress,
  });

  return (
    <AbsoluteFill style={{background: '#07120B', padding: 78, fontFamily: 'Inter, sans-serif', color: '#F5F7F4'}}>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 2.5, color: '#5CFF9A'}}>RESTSCHULD</div>
      <div style={{fontSize: 88, fontWeight: 950, marginTop: 20}}><AnimatedNumber value={resolved.currentDebt} suffix={` ${currency}`} /></div>
      <div style={{marginTop: 86, height: 420, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 44, background: 'rgba(255,255,255,0.07)', padding: 28, display: 'flex', alignItems: 'flex-end'}}>
          <div style={{width: '100%', height: `${resolved.debtRatio * 100}%`, borderRadius: 32, background: 'linear-gradient(180deg, #FF7C83, #A83239)', boxShadow: resolved.debtRatio > 0 ? '0 0 38px rgba(255,92,99,0.24)' : 'none'}} />
        </div>
      </div>
      <div style={{marginTop: 54}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 800, color: '#AFC0B4'}}>
          <span>Raten bezahlt</span>
          <span>{resolved.currentPaidInstallments} / {totalInstallments}</span>
        </div>
        <div style={{height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.09)', overflow: 'hidden', marginTop: 14}}>
          <div style={{height: '100%', width: `${resolved.installmentProgress * 100}%`, borderRadius: 999, background: '#5CFF9A', boxShadow: resolved.installmentProgress > 0 ? '0 0 28px rgba(92,255,154,0.32)' : 'none'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
