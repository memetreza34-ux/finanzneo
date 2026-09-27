import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../brand/tokens';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const smooth = (frame: number, from: number, to: number) => interpolate(
  frame,
  [from, to],
  [0, 1],
  {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)},
);

const sprung = (frame: number, fps: number, delay = 0) => spring({
  frame: Math.max(0, frame - delay),
  fps,
  config: {damping: 18, stiffness: 130, mass: 0.9},
});

export type MotionTone = 'neutral' | 'positive' | 'negative' | 'money';

const toneColor = (tone: MotionTone) => {
  if (tone === 'positive') return C.accent;
  if (tone === 'negative') return C.negativeLt;
  if (tone === 'money') return C.gold;
  return C.whiteSoft;
};

export const MotionNumber: React.FC<{
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  tone?: MotionTone;
  startFrame?: number;
  durationFrames?: number;
}> = ({
  from = 0,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  tone = 'neutral',
  startFrame = 0,
  durationFrames = 36,
}) => {
  const frame = useCurrentFrame();
  const progress = smooth(frame, startFrame, startFrame + durationFrames);
  const value = from + (to - from) * progress;

  return (
    <div
      style={{
        fontSize: 118,
        lineHeight: 1,
        fontWeight: 900,
        color: toneColor(tone),
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -3,
      }}
    >
      {prefix}{value.toLocaleString('de-DE', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}{suffix}
    </div>
  );
};

export type ComparisonBarItem = {
  label: string;
  value: number;
  displayValue?: string;
  tone?: MotionTone;
};

export const MotionComparisonBars: React.FC<{
  items: [ComparisonBarItem, ComparisonBarItem];
  maxValue?: number;
  startFrame?: number;
}> = ({items, maxValue, startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = maxValue ?? Math.max(1, ...items.map((item) => item.value));

  return (
    <div style={{width: '100%', display: 'grid', gap: 34}}>
      {items.map((item, index) => {
        const progress = sprung(frame, fps, startFrame + index * 8);
        const width = Math.max(0, Math.min(1, item.value / max)) * progress * 100;
        return (
          <div key={item.label} style={{display: 'grid', gridTemplateColumns: '230px 1fr 170px', alignItems: 'center', gap: 26}}>
            <div style={{fontSize: 34, fontWeight: 800, color: C.whiteSoft}}>{item.label}</div>
            <div style={{height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
              <div
                style={{
                  height: '100%',
                  width: `${width}%`,
                  minWidth: progress > 0.05 ? 8 : 0,
                  borderRadius: 18,
                  backgroundColor: toneColor(item.tone ?? 'neutral'),
                }}
              />
            </div>
            <div style={{fontSize: 36, fontWeight: 900, textAlign: 'right', color: toneColor(item.tone ?? 'neutral'), fontVariantNumeric: 'tabular-nums'}}>
              {item.displayValue ?? item.value.toLocaleString('de-DE')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const MotionLineChart: React.FC<{
  points: number[];
  strokeTone?: MotionTone;
  startFrame?: number;
  durationFrames?: number;
  width?: number;
  height?: number;
}> = ({
  points,
  strokeTone = 'positive',
  startFrame = 0,
  durationFrames = 54,
  width = 1420,
  height = 420,
}) => {
  const frame = useCurrentFrame();
  const progress = smooth(frame, startFrame, startFrame + durationFrames);
  const safePoints = points.length >= 2 ? points : [0, points[0] ?? 0];
  const min = Math.min(...safePoints);
  const max = Math.max(...safePoints);
  const span = Math.max(1e-6, max - min);
  const pad = 26;
  const xStep = (width - pad * 2) / Math.max(1, safePoints.length - 1);
  const d = safePoints.map((value, index) => {
    const x = pad + index * xStep;
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
      <path
        d={d}
        fill="none"
        stroke={toneColor(strokeTone)}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      {safePoints.map((value, index) => {
        const local = smooth(frame, startFrame + 6 + index * 5, startFrame + 18 + index * 5);
        const x = pad + index * xStep;
        const y = height - pad - ((value - min) / span) * (height - pad * 2);
        return <circle key={`${index}-${value}`} cx={x} cy={y} r={8 * local} fill={toneColor(strokeTone)} opacity={local} />;
      })}
    </svg>
  );
};

export const MotionMoneyFlow: React.FC<{
  fromLabel: string;
  toLabel: string;
  amountLabel?: string;
  startFrame?: number;
  tone?: MotionTone;
}> = ({fromLabel, toLabel, amountLabel, startFrame = 0, tone = 'money'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const route = smooth(frame, startFrame, startFrame + 28);
  const result = smooth(frame, startFrame + 34, startFrame + 52);
  const left = 180;
  const right = 1240;
  const centerY = 180;

  return (
    <div style={{position: 'relative', width: 1420, height: 360}}>
      <div style={{position: 'absolute', left: 0, top: 120, width: 260, fontSize: 38, fontWeight: 850, color: C.whiteSoft}}>{fromLabel}</div>
      <div style={{position: 'absolute', right: 0, top: 120, width: 260, textAlign: 'right', fontSize: 38, fontWeight: 850, color: C.whiteSoft, opacity: 0.55 + result * 0.45}}>{toLabel}</div>
      <div style={{position: 'absolute', left, right: 180, top: centerY, height: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.10)'}} />
      <div style={{position: 'absolute', left, top: centerY, height: 4, width: `${(right - left) * route}px`, borderRadius: 4, backgroundColor: toneColor(tone)}} />
      {Array.from({length: 5}, (_, index) => {
        const p = spring({
          frame: Math.max(0, frame - (startFrame + 8 + index * 5)),
          fps,
          config: {damping: 20, stiffness: 110, mass: 0.8},
        });
        const x = left + (right - left) * p;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x - 18,
              top: centerY - 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: toneColor(tone),
              boxShadow: `0 0 22px ${toneColor(tone)}55`,
              opacity: Math.min(1, p * 2),
              scale: 0.82 + Math.min(1, p) * 0.18,
            }}
          />
        );
      })}
      {amountLabel ? (
        <div style={{position: 'absolute', left: 530, top: 220, width: 360, textAlign: 'center', fontSize: 52, fontWeight: 900, color: toneColor(tone), opacity: result, scale: 0.94 + result * 0.06}}>
          {amountLabel}
        </div>
      ) : null}
    </div>
  );
};

export const MotionBeforeAfter: React.FC<{
  beforeLabel: string;
  afterLabel: string;
  beforeValue: string;
  afterValue: string;
  beforeTone?: MotionTone;
  afterTone?: MotionTone;
  startFrame?: number;
}> = ({
  beforeLabel,
  afterLabel,
  beforeValue,
  afterValue,
  beforeTone = 'neutral',
  afterTone = 'positive',
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const before = sprung(frame, fps, startFrame);
  const after = sprung(frame, fps, startFrame + 16);
  const arrow = smooth(frame, startFrame + 8, startFrame + 30);

  const card = (label: string, value: string, tone: MotionTone, progress: number) => (
    <div style={{flex: 1, padding: '42px 46px', borderRadius: 28, border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.045)', opacity: progress, translate: `0 ${24 * (1 - progress)}px`}}>
      <div style={{fontSize: 30, fontWeight: 750, color: C.graySoft, marginBottom: 18}}>{label}</div>
      <div style={{fontSize: 78, lineHeight: 1, fontWeight: 900, color: toneColor(tone), fontVariantNumeric: 'tabular-nums'}}>{value}</div>
    </div>
  );

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 34, width: '100%'}}>
      {card(beforeLabel, beforeValue, beforeTone, before)}
      <div style={{fontSize: 68, fontWeight: 900, color: C.whiteSoft, opacity: arrow, translate: `${-18 * (1 - arrow)}px 0`}}>→</div>
      {card(afterLabel, afterValue, afterTone, after)}
    </div>
  );
};
