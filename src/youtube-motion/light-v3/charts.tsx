import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../../brand';
import {
  DonutPart, RankDatum, TrendPoint, donutSlices, euro,
  mix, polylinePath, progressAt, rankPositions, ringArcPath,
  tracePolyline, trendPositions,
} from './core';

export const LIGHT = {
  paper: '#FFFFFF',
  cream: '#FAF8F2',
  mist: '#F3F6F4',
  lavender: '#F7F5FA',
  ink: '#202A25',
  muted: '#68746D',
  rule: '#DDE4DE',
  green: '#4F8A67',
  blue: '#5E84AE',
  orange: '#D87959',
  purple: '#8971A8',
  gold: '#C5A050',
  teal: '#4F9996',
  red: '#C9615B',
} as const;

export const LightStage: React.FC<{children: React.ReactNode; background?: string}> =
  ({children, background = LIGHT.cream}) =>
    <AbsoluteFill style={{background, overflow: 'hidden', fontFamily: FONT.body, color: LIGHT.ink}}>{children}</AbsoluteFill>;

export const SmallLabel: React.FC<{children: React.ReactNode; x: number; y: number; size?: number; color?: string}> =
  ({children, x, y, size = 26, color = LIGHT.muted}) =>
    <div style={{position: 'absolute', left: x, top: y, fontSize: size, fontWeight: 800, color}}>{children}</div>;

const moneyFormat = (value: number) => euro(value);

export const ReorderingBars: React.FC<{
  data: RankDatum[];
  x?: number; y?: number; width?: number; rowHeight?: number;
  changeStart?: number; changeEnd?: number; maxValue?: number;
  unit?: 'euro' | 'number';
}> = ({
  data, x = 225, y = 225, width = 1470, rowHeight = 150,
  changeStart = 42, changeEnd = 120, maxValue,
  unit = 'euro',
}) => {
  const frame = useCurrentFrame();
  const ranks = rankPositions(data, frame, changeStart, changeEnd, rowHeight);
  const max = maxValue ?? Math.max(...data.map((entry) => Math.max(entry.start, entry.end)), 1);
  const reveal = progressAt(frame, 6, 30);
  return <div style={{position: 'absolute', left: x, top: y, width}}>
    {ranks.map((row) => {
      const barWidth = Math.max(1, (row.value / max) * (width - 520)) * reveal;
      const isWinner = row.toRank === 0;
      return <div key={row.id} style={{
        position: 'absolute', top: row.y, left: 0, right: 0, height: rowHeight - 16,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          width: 280, fontWeight: isWinner ? 900 : 800, fontSize: 30,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{row.label}</div>
        <div style={{flex: 1, height: 56, borderRadius: 13, background: '#E9EEE9', overflow: 'hidden'}}>
          <div style={{
            height: '100%', width: barWidth,
            background: row.color, borderRadius: 13,
          }}/>
        </div>
        <div style={{
          width: 230, textAlign: 'right', fontFamily: FONT.title,
          color: isWinner ? row.color : LIGHT.ink, fontSize: 50, fontWeight: 900,
        }}>{unit === 'euro' ? moneyFormat(row.value) : Math.round(row.value).toLocaleString('de-DE')}</div>
      </div>;
    })}
  </div>;
};

export const ReorderingTable: React.FC<{
  data: RankDatum[]; x?: number; y?: number; width?: number;
  changeStart?: number; changeEnd?: number;
}> = ({data, x = 265, y = 240, width = 1390, changeStart = 42, changeEnd = 122}) => {
  const frame = useCurrentFrame();
  const ranks = rankPositions(data, frame, changeStart, changeEnd, 132);
  const entrance = progressAt(frame, 4, 25);
  return <div style={{position: 'absolute', top: y, left: x, width, height: 780}}>
    <div style={{display: 'grid', gridTemplateColumns: '120px 1fr 270px', alignItems: 'center', background: '#E7EFEB', height: 84, borderRadius: 18, padding: '0 36px', color: LIGHT.muted, fontSize: 24, fontWeight: 900}}>
      <div>Rang</div><div>Unternehmen</div><div style={{textAlign: 'right'}}>Wert</div>
    </div>
    {ranks.map((row) => <div key={row.id} style={{
      position: 'absolute', top: 102 + row.y, left: 0, right: 0, height: 110,
      display: 'grid', gridTemplateColumns: '120px 1fr 270px', alignItems: 'center',
      padding: '0 36px', borderRadius: 19, boxSizing: 'border-box',
      border: '1px solid ' + LIGHT.rule, background: LIGHT.paper,
      boxShadow: '0 8px 20px rgba(32,42,37,.045)',
      opacity: entrance,
    }}>
      <div style={{fontFamily: FONT.title, fontSize: 49, fontWeight: 900, color: row.color}}>{Math.round(mix(row.fromRank, row.toRank, progressAt(frame, changeStart, changeEnd))) + 1}</div>
      <div style={{fontSize: 31, fontWeight: 850}}>{row.label}</div>
      <div style={{textAlign: 'right', fontFamily: FONT.title, fontSize: 52, fontWeight: 900, color: row.color}}>{euro(row.value)}</div>
    </div>)}
  </div>;
};

export const BuildingDonut: React.FC<{
  data: DonutPart[]; start?: number; spacing?: number; buildDuration?: number;
  cx?: number; cy?: number; radius?: number; thickness?: number;
}> = ({
  data, start = 10, spacing = 16, buildDuration = 28,
  cx = 690, cy = 525, radius = 260, thickness = 94,
}) => {
  const frame = useCurrentFrame();
  const slices = donutSlices(data);
  return <>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      {slices.map((slice, index) => {
        const t = progressAt(frame, start + index * spacing, start + index * spacing + buildDuration);
        const end = mix(slice.startAngle, slice.endAngle - 0.9, t);
        return <path key={slice.id} d={ringArcPath(cx, cy, radius, thickness, slice.startAngle, end)}
          fill={slice.color} stroke={LIGHT.cream} strokeWidth={2}/>;
      })}
    </svg>
    <div style={{
      position: 'absolute', left: cx - 160, top: cy - 78, width: 320,
      textAlign: 'center', color: LIGHT.ink, fontFamily: FONT.title, fontSize: 80, fontWeight: 900,
    }}>100%</div>
    {slices.map((slice, index) => {
      const visible = progressAt(frame, start + index * spacing + 6, start + index * spacing + 18);
      return <div key={slice.id} style={{
        position: 'absolute', left: 1140, top: 260 + index * 150,
        width: 600, display: 'flex', alignItems: 'center', gap: 20,
        opacity: visible, transform: 'translateX(' + (1 - visible) * 20 + 'px)',
      }}>
        <div style={{height: 23, width: 23, borderRadius: 6, background: slice.color}}/>
        <div style={{fontSize: 31, fontWeight: 800, width: 300}}>{slice.label}</div>
        <div style={{fontFamily: FONT.title, fontSize: 50, fontWeight: 900, color: slice.color}}>{Math.round(slice.share * 100)} %</div>
      </div>;
    })}
  </>;
};

export const TracedTrendChart: React.FC<{
  data: TrendPoint[]; start?: number; end?: number;
  x?: number; y?: number; width?: number; height?: number;
  color?: string; minValue?: number; maxValue?: number; valueSuffix?: string;
}> = ({
  data, start = 12, end = 110,
  x = 210, y = 245, width = 1470, height = 560,
  color = LIGHT.green, minValue = 0, maxValue,
  valueSuffix = ' €',
}) => {
  const frame = useCurrentFrame();
  const max = maxValue ?? Math.max(1, ...data.map((d) => d.value));
  const positions = trendPositions(data, x, y, width, height, minValue, max);
  const traced = tracePolyline(positions, progressAt(frame, start, end));
  const active = traced[traced.length - 1] ?? positions[0];
  const dataProgress = progressAt(frame, start, end) * (data.length - 1);
  const segment = Math.min(data.length - 2, Math.floor(dataProgress));
  const current = mix(data[segment].value, data[segment + 1].value, dataProgress - segment);
  const path = polylinePath(traced);
  return <>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      {[0, 1, 2, 3, 4].map((step) => <line key={step} x1={x} y1={y + step * height / 4}
        x2={x + width} y2={y + step * height / 4} stroke={LIGHT.rule} strokeWidth={2}/>)}
      <path d={path} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={active.x} cy={active.y} r={14} fill={LIGHT.paper} stroke={color} strokeWidth={7}/>
    </svg>
    <div style={{
      position: 'absolute', left: Math.min(1650, Math.max(150, active.x - 110)), top: Math.max(140, active.y - 102),
      fontFamily: FONT.title, fontSize: 52, fontWeight: 900, color,
    }}>{Math.round(current).toLocaleString('de-DE') + valueSuffix}</div>
    {data.map((point, index) => <div key={point.id} style={{
      position: 'absolute', left: positions[index].x - 76, top: y + height + 36, width: 152, textAlign: 'center',
      fontWeight: 750, color: LIGHT.muted, fontSize: 22,
    }}>{point.label}</div>)}
  </>;
};
