import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber, ProgressBar} from '../primitives';

export type IncomeExpenseBalanceTemplateProps = {
  income: number;
  expenses: number;
  currency?: string;
  incomeLabel?: string;
  expenseLabel?: string;
};

export const IncomeExpenseBalanceTemplate: React.FC<IncomeExpenseBalanceTemplateProps> = ({
  income,
  expenses,
  currency = '€',
  incomeLabel = 'Einnahmen',
  expenseLabel = 'Ausgaben',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, fps * 0.45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const surplus = income - expenses;
  const max = Math.max(income, expenses, 1);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #07120B 0%, #0B1B11 100%)',
        color: '#F5F7F4',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: 72,
        boxSizing: 'border-box',
      }}
    >
      <div style={{fontSize: 58, fontWeight: 900, marginBottom: 56}}>Einnahmen gegen Ausgaben</div>

      <div style={{display: 'grid', gap: 42}}>
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, marginBottom: 16}}>
            <span>{incomeLabel}</span>
            <AnimatedNumber value={income} suffix={` ${currency}`} />
          </div>
          <ProgressBar progress={income / max} />
        </div>

        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, marginBottom: 16}}>
            <span>{expenseLabel}</span>
            <AnimatedNumber value={expenses} suffix={` ${currency}`} />
          </div>
          <ProgressBar progress={expenses / max} />
        </div>
      </div>

      <div
        style={{
          marginTop: 80,
          borderRadius: 34,
          padding: '36px 42px',
          background: 'rgba(8, 33, 18, 0.88)',
          border: '1px solid rgba(92, 255, 154, 0.24)',
          transform: `translateY(${(1 - reveal) * 32}px)`,
          opacity: reveal,
        }}
      >
        <div style={{fontSize: 28, opacity: 0.72, marginBottom: 10}}>{surplus >= 0 ? 'Überschuss' : 'Defizit'}</div>
        <div style={{fontSize: 72, fontWeight: 950}}>
          <AnimatedNumber value={Math.abs(surplus)} suffix={` ${currency}`} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
