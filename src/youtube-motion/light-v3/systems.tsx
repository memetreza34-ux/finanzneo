import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../../brand';
import {cubicPoint, euro, mix, progressAt} from './core';
import {LIGHT} from './charts';

export type CashBucket = {id: string; label: string; amount: number; color: string};
export const CASHFLOW_TOTAL = (sinks: CashBucket[]) => sinks.reduce((sum, sink) => sum + sink.amount, 0);

export const CashFlowSystem: React.FC<{
  sinks: CashBucket[];
  xLeft?: number; xRight?: number;
  start?: number; end?: number;
}> = ({sinks, xLeft = 165, xRight = 1370, start = 20, end = 126}) => {
  const frame = useCurrentFrame();
  const flow = progressAt(frame, start, end);
  const total = CASHFLOW_TOTAL(sinks);
  const source = {x: xLeft + 335, y: 560};
  const sinkPositions = sinks.map((_, index) => ({x: xRight, y: 258 + index * 258}));
  return <>
    <svg style={{position: 'absolute', inset: 0}} viewBox="0 0 1920 1080" width="1920" height="1080">
      {sinks.map((sink, index) => {
        const goal = sinkPositions[index];
        return <g key={sink.id}>
          <path d={'M ' + source.x + ' ' + source.y + ' C 835 ' + source.y + ' 1050 ' + goal.y + ' ' + goal.x + ' ' + goal.y}
            fill="none" stroke={sink.color} strokeWidth={Math.max(12, 32 * sink.amount / total)}
            strokeOpacity={0.2 + 0.3 * flow} strokeLinecap="round"/>
          {Array.from({length: 5}, (_, token) => {
            const launch = start + index * 8 + token * 17;
            const time = progressAt(frame, launch, launch + 54);
            if (frame < launch || (frame > launch + 59)) return null;
            const pos = cubicPoint(source, {x: 855, y: source.y}, {x: 1080, y: goal.y}, goal, time);
            return <circle key={token} cx={pos.x} cy={pos.y} r={11} fill={sink.color} stroke={LIGHT.paper} strokeWidth={3}/>;
          })}
        </g>;
      })}
    </svg>
    <div style={{
      position: 'absolute', left: xLeft, top: 420, width: 335, height: 280,
      borderRadius: 35, border: '2px solid ' + LIGHT.rule, background: LIGHT.paper,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
    }}>
      <div style={{fontSize: 26, fontWeight: 850, color: LIGHT.muted}}>Einkommen</div>
      <div style={{fontFamily: FONT.title, fontSize: 82, fontWeight: 900, color: LIGHT.ink}}>{euro(total)}</div>
    </div>
    {sinks.map((sink, index) => {
      const progress = progressAt(frame, start + 14 + index * 8, end);
      return <div key={sink.id} style={{
        position: 'absolute', left: xRight, top: sinkPositions[index].y - 78,
        width: 375, height: 160, borderRadius: 28,
        border: '2px solid ' + sink.color + '55',
        background: LIGHT.paper, boxSizing: 'border-box',
      }}>
        <div style={{position: 'absolute', left: 25, top: 24, fontSize: 25, fontWeight: 800, color: LIGHT.muted}}>{sink.label}</div>
        <div style={{position: 'absolute', left: 25, bottom: 17, fontFamily: FONT.title, fontSize: 61, fontWeight: 900, color: sink.color}}>
          {euro(sink.amount * progress)}
        </div>
        <div style={{position: 'absolute', right: 0, bottom: 0, height: 8,
          width: (100 * sink.amount / total) + '%', background: sink.color, borderRadius: 5}}/>
      </div>;
    })}
  </>;
};

export const HeatmapTransition: React.FC<{
  values: number[][]; labels?: string[];
  x?: number; y?: number; cellWidth?: number; cellHeight?: number; gap?: number;
  start?: number; step?: number;
}> = ({
  values, labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
  x = 355, y = 200, cellWidth = 160, cellHeight = 110, gap = 15,
  start = 15, step = 3,
}) => {
  const frame = useCurrentFrame();
  return <>
    {values.map((row, rowIndex) => <React.Fragment key={rowIndex}>
      <div style={{
        position: 'absolute', left: x - 100, top: y + rowIndex * (cellHeight + gap) + 38,
        fontWeight: 800, color: LIGHT.muted, fontSize: 23,
      }}>{labels[rowIndex] ?? 'Tag ' + (rowIndex + 1)}</div>
      {row.map((value, colIndex) => {
        const t = progressAt(frame, start + (rowIndex * row.length + colIndex) * step, start + (rowIndex * row.length + colIndex) * step + 24);
        const normalized = Math.max(0, Math.min(1, value));
        const strength = mix(0, normalized, t);
        const r = Math.round(mix(235, 80, strength));
        const g = Math.round(mix(242, 145, strength));
        const b = Math.round(mix(236, 104, strength));
        return <div key={colIndex} style={{
          position: 'absolute', left: x + colIndex * (cellWidth + gap),
          top: y + rowIndex * (cellHeight + gap),
          width: cellWidth, height: cellHeight,
          background: 'rgb(' + r + ',' + g + ',' + b + ')',
          borderRadius: 18,
          border: '1px solid rgba(45,80,55,.06)',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT.title, fontSize: 32, fontWeight: 900,
          color: strength > .65 ? '#FFFFFF' : LIGHT.ink,
        }}>{Math.round(strength * 100) + '%'}</div>;
      })}
    </React.Fragment>)}
  </>;
};

export const WaffleProgress: React.FC<{
  from: number; to: number; start?: number; end?: number;
  x?: number; y?: number; cellSize?: number; gap?: number;
  color?: string; label?: string;
}> = ({
  from, to, start = 16, end = 125,
  x = 560, y = 195, cellSize = 63, gap = 10,
  color = LIGHT.green, label = 'Sparquote',
}) => {
  const frame = useCurrentFrame();
  const t = progressAt(frame, start, end);
  const value = mix(from, to, t);
  return <>
    <div style={{
      position: 'absolute', left: 230, top: 420, width: 300,
      fontSize: 33, fontWeight: 850, color: LIGHT.muted,
    }}>{label}</div>
    <div style={{
      position: 'absolute', left: 225, top: 470, width: 350,
      fontFamily: FONT.title, fontSize: 108, fontWeight: 900, color,
    }}>{Math.round(value)}%</div>
    {Array.from({length: 100}, (_, i) => {
      const row = Math.floor(i / 10), col = i % 10;
      const filled = Math.max(0, Math.min(1, value - i));
      return <div key={i} style={{
        position: 'absolute', left: x + col * (cellSize + gap),
        top: y + row * (cellSize + gap), width: cellSize, height: cellSize,
        borderRadius: 11, background: '#E3EAE5',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, bottom: 0, right: 0,
          height: filled * 100 + '%', background: color,
        }}/>
      </div>;
    })}
  </>;
};

export const ComparisonDelta: React.FC<{
  first: number; second: number; labels?: [string, string];
  start?: number; end?: number; x?: number; y?: number;
}> = ({
  first, second, labels = ['Vorher', 'Nachher'],
  start = 25, end = 112, x = 240, y = 270,
}) => {
  const frame = useCurrentFrame();
  const t = progressAt(frame, start, end);
  const max = Math.max(first, second, 1);
  const secondAnimated = mix(first, second, t);
  return <>
    {[
      {label: labels[0], value: first, color: LIGHT.blue, row: 0},
      {label: labels[1], value: secondAnimated, color: LIGHT.green, row: 1},
    ].map((item) => <div key={item.row} style={{position: 'absolute', left: x, top: y + item.row * 280}}>
      <div style={{fontSize: 30, fontWeight: 850, color: LIGHT.muted}}>{item.label}</div>
      <div style={{marginTop: 24, width: 1060, height: 92, borderRadius: 18, background: '#E7EEE9', overflow: 'hidden'}}>
        <div style={{width: 100 * item.value / max + '%', background: item.color, height: '100%', borderRadius: 18}}/>
      </div>
      <div style={{position: 'absolute', left: 1100, top: 47, fontFamily: FONT.title,
        fontWeight: 900, fontSize: 66, color: item.color, whiteSpace: 'nowrap'}}>{euro(item.value)}</div>
    </div>)}
    <div style={{
      position: 'absolute', right: 175, bottom: 110,
      borderRadius: 20, padding: '16px 26px', background: '#E0EFE5',
      color: LIGHT.green, fontFamily: FONT.title, fontWeight: 900, fontSize: 46,
      opacity: progressAt(frame, end - 28, end - 8),
    }}>{(second >= first ? '+' : '') + euro(second - first)}</div>
  </>;
};
