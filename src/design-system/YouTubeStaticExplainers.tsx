import React from 'react';
import {C, FONT} from '../brand';

export type StaticTone = 'neutral' | 'positive' | 'negative' | 'money';

const toneColor = (tone: StaticTone) => {
  if (tone === 'positive') return C.accent;
  if (tone === 'negative') return C.negative;
  if (tone === 'money') return C.gold;
  return C.white;
};

const muted = 'rgba(255,255,255,0.62)';
const panel = 'rgba(255,255,255,0.045)';
const border = 'rgba(255,255,255,0.10)';

export const StaticNumber: React.FC<{
  value: string;
  label?: string;
  subline?: string;
  tone?: StaticTone;
  size?: number;
  style?: React.CSSProperties;
}> = ({value, label, subline, tone = 'neutral', size = 118, style}) => (
  <div style={{textAlign: 'center', ...style}}>
    {label ? (
      <div style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 700, color: muted, marginBottom: 12}}>
        {label}
      </div>
    ) : null}
    <div style={{fontFamily: FONT.title, fontSize: size, lineHeight: 0.95, color: toneColor(tone)}}>
      {value}
    </div>
    {subline ? (
      <div style={{fontFamily: FONT.body, fontSize: 28, fontWeight: 600, color: muted, marginTop: 14}}>
        {subline}
      </div>
    ) : null}
  </div>
);

export const StaticArrow: React.FC<{
  direction?: 'right' | 'left' | 'up' | 'down';
  label?: string;
  tone?: StaticTone;
  size?: number;
  style?: React.CSSProperties;
}> = ({direction = 'right', label, tone = 'neutral', size = 72, style}) => {
  const arrows = {right: '→', left: '←', up: '↑', down: '↓'} as const;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style}}>
      <div style={{fontFamily: FONT.body, fontSize: size, lineHeight: 1, fontWeight: 800, color: toneColor(tone)}}>
        {arrows[direction]}
      </div>
      {label ? (
        <div style={{fontFamily: FONT.body, fontSize: 24, fontWeight: 700, color: muted, marginTop: 8}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

export const StaticLabels: React.FC<{
  items: Array<{text: string; tone?: StaticTone}>;
  style?: React.CSSProperties;
}> = ({items, style}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, ...style}}>
    {items.map((item) => (
      <div
        key={`${item.text}-${item.tone ?? 'neutral'}`}
        style={{
          fontFamily: FONT.body,
          fontSize: 26,
          fontWeight: 750,
          color: toneColor(item.tone ?? 'neutral'),
          background: panel,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: '12px 18px',
        }}
      >
        {item.text}
      </div>
    ))}
  </div>
);

export const StaticCompare: React.FC<{
  left: {label: string; value: string; subline?: string; tone?: StaticTone};
  right: {label: string; value: string; subline?: string; tone?: StaticTone};
  middleLabel?: string;
  style?: React.CSSProperties;
}> = ({left, right, middleLabel = 'vs.', style}) => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'stretch', gap: 26, ...style}}>
    {[left, right].map((item, index) => (
      <React.Fragment key={`${item.label}-${index}`}>
        {index === 1 ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 4}}>
            <div style={{fontFamily: FONT.body, fontSize: 26, fontWeight: 800, color: muted}}>{middleLabel}</div>
          </div>
        ) : null}
        <div style={{background: panel, border: `1px solid ${border}`, borderRadius: 24, padding: '28px 34px', textAlign: 'center'}}>
          <div style={{fontFamily: FONT.body, fontSize: 28, fontWeight: 700, color: muted}}>{item.label}</div>
          <div style={{fontFamily: FONT.title, fontSize: 82, lineHeight: 1, color: toneColor(item.tone ?? 'neutral'), marginTop: 14}}>
            {item.value}
          </div>
          {item.subline ? (
            <div style={{fontFamily: FONT.body, fontSize: 24, fontWeight: 600, color: muted, marginTop: 12}}>{item.subline}</div>
          ) : null}
        </div>
      </React.Fragment>
    ))}
  </div>
);

export const StaticMiniChart: React.FC<{
  data: Array<{label: string; value: number}>;
  width?: number;
  height?: number;
  tone?: StaticTone;
  valueFormatter?: (value: number) => string;
  style?: React.CSSProperties;
}> = ({data, width = 720, height = 320, tone = 'positive', valueFormatter = (value) => String(value), style}) => {
  const safeData = data.length > 0 ? data : [{label: '', value: 0}];
  const values = safeData.map((point) => Number(point.value) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerX = 44;
  const innerTop = 28;
  const innerBottom = 58;
  const chartHeight = Math.max(1, height - innerTop - innerBottom);
  const chartWidth = Math.max(1, width - innerX * 2);
  const points = safeData.map((point, index) => {
    const x = innerX + (safeData.length === 1 ? chartWidth / 2 : (index / (safeData.length - 1)) * chartWidth);
    const y = innerTop + (1 - ((point.value - min) / span)) * chartHeight;
    return {x, y, ...point};
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');
  const color = toneColor(tone);

  return (
    <div style={{background: panel, border: `1px solid ${border}`, borderRadius: 24, padding: 20, ...style}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Statisches Mini-Chart">
        <line x1={innerX} y1={height - innerBottom} x2={width - innerX} y2={height - innerBottom} stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
        <polyline points={line} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle cx={point.x} cy={point.y} r={8} fill={color} />
            <text x={point.x} y={point.y - 18} textAnchor="middle" fill={C.white} fontFamily={FONT.body} fontSize={22} fontWeight={700}>
              {valueFormatter(point.value)}
            </text>
            <text x={point.x} y={height - 20} textAnchor="middle" fill={muted} fontFamily={FONT.body} fontSize={20} fontWeight={600}>
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
