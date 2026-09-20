import React from 'react';
import {C} from '../brand/tokens';
import {PhysicalBill, PhysicalObject} from './physical';

/**
 * Semantic name for a banknote/value unit.
 * `PhysicalBill` remains exported for backward compatibility inside Motion Core V1,
 * but new scene code should prefer `PhysicalBanknote` when the object represents money.
 */
export const PhysicalBanknote = PhysicalBill;

/**
 * Concrete invoice/document object. This intentionally separates the English
 * ambiguity of "bill" (banknote vs. invoice) so agents can select objects by meaning.
 */
export const PhysicalInvoice: React.FC<{
  x: number;
  y: number;
  amount: string;
  label?: string;
  progress?: number;
  paid?: boolean;
  role?: 'neutral' | 'warning' | 'positive';
  scale?: number;
  rotate?: number;
}> = ({
  x,
  y,
  amount,
  label = 'RECHNUNG',
  progress = 1,
  paid = false,
  role = paid ? 'positive' : 'warning',
  scale = 1,
  rotate = -3,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <PhysicalObject
      x={x}
      y={y + (1 - p) * 38}
      width={300}
      height={390}
      depth={18}
      radius={28}
      role={role}
      opacity={p}
      scale={(0.94 + p * 0.06) * scale}
      rotate={rotate}
      grounding={p}
    >
      <div style={{position: 'absolute', inset: 0, padding: '38px 34px', color: '#132019'}}>
        <div style={{fontSize: 24, fontWeight: 950, letterSpacing: 2.2}}>{label}</div>
        <div style={{height: 12, width: '78%', marginTop: 34, borderRadius: 999, background: 'rgba(0,0,0,0.24)'}} />
        <div style={{height: 9, width: '92%', marginTop: 14, borderRadius: 999, background: 'rgba(0,0,0,0.15)'}} />
        <div style={{height: 9, width: '64%', marginTop: 12, borderRadius: 999, background: 'rgba(0,0,0,0.15)'}} />
        <div style={{marginTop: 58, fontSize: 52, fontWeight: 950, color: paid ? C.accentDk : C.negativeDk}}>{amount}</div>
        <div
          style={{
            position: 'absolute',
            right: 28,
            bottom: 32,
            padding: '10px 14px',
            borderRadius: 12,
            border: `4px solid ${paid ? C.accentDk : C.negativeDk}`,
            color: paid ? C.accentDk : C.negativeDk,
            fontSize: 22,
            fontWeight: 950,
            transform: 'rotate(-6deg)',
            opacity: paid ? 1 : 0.72,
          }}
        >
          {paid ? 'BEZAHLT' : 'OFFEN'}
        </div>
      </div>
    </PhysicalObject>
  );
};
