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

export type IncomeExpenseBalance = {
  income: number;
  expenses: number;
  balance: number;
  status: 'surplus' | 'deficit' | 'balanced';
  accent: string;
  scale: number;
};

export const resolveIncomeExpenseBalance = (
  income: number,
  expenses: number,
): IncomeExpenseBalance => {
  const safeIncome = Math.max(0, Number.isFinite(income) ? income : 0);
  const safeExpenses = Math.max(0, Number.isFinite(expenses) ? expenses : 0);
  const balance = safeIncome - safeExpenses;
  return {
    income: safeIncome,
    expenses: safeExpenses,
    balance,
    status: balance > 0 ? 'surplus' : balance < 0 ? 'deficit' : 'balanced',
    accent: balance > 0 ? '#5CFF9A' : balance < 0 ? '#FF7C83' : '#AFC0B4',
    scale: Math.max(safeIncome, safeExpenses, 1),
  };
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
  const resolved = resolveIncomeExpenseBalance(income, expenses);
  const statusLabel = resolved.status === 'surplus'
    ? 'Überschuss'
    : resolved.status === 'deficit'
      ? 'Defizit'
      : 'Ausgeglichen';

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
            <AnimatedNumber value={resolved.income} suffix={` ${currency}`} />
          </div>
          <ProgressBar progress={resolved.income / resolved.scale} fill="#5CFF9A" />
        </div>

        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, marginBottom: 16}}>
            <span>{expenseLabel}</span>
            <AnimatedNumber value={resolved.expenses} suffix={` ${currency}`} />
          </div>
          <ProgressBar progress={resolved.expenses / resolved.scale} fill="#FF7C83" />
        </div>
      </div>

      <div
        style={{
          marginTop: 80,
          borderRadius: 34,
          padding: '36px 42px',
          background: `${resolved.accent}14`,
          border: `1px solid ${resolved.accent}55`,
          transform: `translateY(${(1 - reveal) * 32}px)`,
          opacity: reveal,
        }}
      >
        <div style={{fontSize: 28, opacity: 0.72, marginBottom: 10}}>{statusLabel}</div>
        <div style={{fontSize: 72, fontWeight: 950, color: resolved.accent}}>
          <AnimatedNumber value={Math.abs(resolved.balance)} suffix={` ${currency}`} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
