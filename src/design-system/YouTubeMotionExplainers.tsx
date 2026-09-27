import React from 'react';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {Rect} from '@remotion/shapes';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../brand/tokens';
import {
  calculateInflationAdjustedValue,
  calculateLoanSchedule,
  calculateLoanSummary,
  calculatePurchasingPowerLossPercent,
  calculateSavingsPlanSeries,
} from '../finance/calculations';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const smooth = (frame: number, from: number, to: number) => interpolate(
  frame,
  [from, to],
  [0, 1],
  {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)},
);

export const YOUTUBE_MOTION_PHYSICS = {
  chart: {damping: 22, stiffness: 120, mass: 1},
  money: {damping: 18, stiffness: 155, mass: 0.72},
  paper: {damping: 20, stiffness: 105, mass: 0.82},
  heavy: {damping: 24, stiffness: 82, mass: 1.35},
  confirm: {damping: 17, stiffness: 185, mass: 0.68},
} as const;

export type MotionPhysicsPreset = keyof typeof YOUTUBE_MOTION_PHYSICS;

const sprung = (
  frame: number,
  fps: number,
  delay = 0,
  preset: MotionPhysicsPreset = 'chart',
) => spring({
  frame: Math.max(0, frame - delay),
  fps,
  config: YOUTUBE_MOTION_PHYSICS[preset],
});

export type MotionTone = 'neutral' | 'positive' | 'negative' | 'money' | 'trust' | 'premium';

const toneColor = (tone: MotionTone) => {
  if (tone === 'positive') return C.accent;
  if (tone === 'negative') return C.negativeLt;
  if (tone === 'money') return C.gold;
  if (tone === 'trust') return C.blueLt;
  if (tone === 'premium') return C.purpleLt;
  return C.whiteSoft;
};

const euro0 = (value: number) => `${Math.round(value).toLocaleString('de-DE')} €`;

const makeChartPath = ({
  points,
  width,
  height,
  padX,
  padTop,
  padBottom,
  minValue,
  maxValue,
}: {
  points: number[];
  width: number;
  height: number;
  padX: number;
  padTop: number;
  padBottom: number;
  minValue?: number;
  maxValue?: number;
}) => {
  const safePoints = points.length >= 2 ? points : [points[0] ?? 0, points[0] ?? 0];
  const min = minValue ?? Math.min(...safePoints);
  const max = maxValue ?? Math.max(...safePoints);
  const span = Math.max(1e-6, max - min);
  const step = (width - padX * 2) / Math.max(1, safePoints.length - 1);
  const coords = safePoints.map((value, index) => ({
    x: padX + index * step,
    y: height - padBottom - ((value - min) / span) * (height - padTop - padBottom),
  }));
  const path = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  return {coords, path, min, max};
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
        const progress = sprung(frame, fps, startFrame + index * 8, 'chart');
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
  const {coords, path} = makeChartPath({points, width, height, padX: 26, padTop: 26, padBottom: 26});
  const evolution = evolvePath(progress, path);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
      <line x1={26} y1={height - 26} x2={width - 26} y2={height - 26} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
      <path
        d={path}
        fill="none"
        stroke={toneColor(strokeTone)}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={evolution.strokeDasharray}
        strokeDashoffset={evolution.strokeDashoffset}
      />
      {coords.map((point, index) => {
        const local = smooth(frame, startFrame + 6 + index * 5, startFrame + 18 + index * 5);
        return <circle key={`${index}-${point.x}`} cx={point.x} cy={point.y} r={8 * local} fill={toneColor(strokeTone)} opacity={local} />;
      })}
    </svg>
  );
};

export const MotionPathFlow: React.FC<{
  fromLabel: string;
  toLabel: string;
  amountLabel?: string;
  startFrame?: number;
  tone?: MotionTone;
  tokenCount?: number;
}> = ({
  fromLabel,
  toLabel,
  amountLabel,
  startFrame = 0,
  tone = 'money',
  tokenCount = 5,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const path = 'M 210 220 C 450 58 820 338 1210 186';
  const length = getLength(path);
  const draw = smooth(frame, startFrame, startFrame + 34);
  const evolution = evolvePath(draw, path);
  const result = smooth(frame, startFrame + 40, startFrame + 56);

  return (
    <svg width={1420} height={430} viewBox="0 0 1420 430" style={{overflow: 'visible'}}>
      <circle cx={150} cy={220} r={84} fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
      <circle cx={1270} cy={186} r={84} fill="rgba(255,255,255,0.045)" stroke={toneColor(tone)} strokeWidth={3} opacity={0.45 + result * 0.55} />
      <text x={150} y={226} fill={C.whiteSoft} fontSize={32} fontWeight={800} textAnchor="middle">{fromLabel}</text>
      <text x={1270} y={192} fill={C.whiteSoft} fontSize={32} fontWeight={800} textAnchor="middle">{toLabel}</text>
      <path d={path} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={6} strokeLinecap="round" />
      <path
        d={path}
        fill="none"
        stroke={toneColor(tone)}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={evolution.strokeDasharray}
        strokeDashoffset={evolution.strokeDashoffset}
      />
      {Array.from({length: Math.max(1, tokenCount)}, (_, index) => {
        const p = clamp01(sprung(frame, fps, startFrame + 8 + index * 5, 'money'));
        const point = getPointAtLength(path, length * p);
        return (
          <g key={index} opacity={Math.min(1, p * 3)} transform={`translate(${point.x} ${point.y}) scale(${0.72 + p * 0.28})`}>
            <circle r={18} fill={toneColor(tone)} />
            <circle r={8} fill="rgba(0,0,0,0.24)" />
          </g>
        );
      })}
      {amountLabel ? (
        <text x={730} y={390} fill={toneColor(tone)} fontSize={48} fontWeight={900} textAnchor="middle" opacity={result}>
          {amountLabel}
        </text>
      ) : null}
    </svg>
  );
};

export const MotionMoneyFlow: React.FC<{
  fromLabel: string;
  toLabel: string;
  amountLabel?: string;
  startFrame?: number;
  tone?: MotionTone;
}> = (props) => <MotionPathFlow {...props} />;

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
  const before = sprung(frame, fps, startFrame, 'heavy');
  const after = sprung(frame, fps, startFrame + 16, 'confirm');
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

export type BudgetAllocationItem = {
  label: string;
  amount: number;
  tone?: MotionTone;
};

export const MotionBudgetAllocation: React.FC<{
  items: BudgetAllocationItem[];
  totalLabel?: string;
  startFrame?: number;
  width?: number;
}> = ({items, totalLabel = 'Monatsbudget', startFrame = 0, width = 1420}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = Math.max(0, items.reduce((sum, item) => sum + Math.max(0, item.amount), 0));
  const safeTotal = Math.max(1, total);
  let x = 0;

  return (
    <div style={{width}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28}}>
        <div style={{fontSize: 36, fontWeight: 800, color: C.whiteSoft}}>{totalLabel}</div>
        <div style={{fontSize: 46, fontWeight: 900, color: C.whiteSoft, fontVariantNumeric: 'tabular-nums'}}>{euro0(total)}</div>
      </div>
      <div style={{height: 92, position: 'relative', borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.055)', overflow: 'hidden'}}>
        {items.map((item, index) => {
          const finalWidth = (Math.max(0, item.amount) / safeTotal) * width;
          const left = x;
          x += finalWidth;
          const progress = clamp01(sprung(frame, fps, startFrame + index * 7, index === 0 ? 'heavy' : 'chart'));
          return (
            <Rect
              key={`${item.label}-${index}`}
              width={Math.max(0.1, finalWidth * progress)}
              height={92}
              fill={toneColor(item.tone ?? (index === items.length - 1 ? 'positive' : 'neutral'))}
              style={{position: 'absolute', left, top: 0, opacity: 0.9}}
            />
          );
        })}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, items.length)}, minmax(0, 1fr))`, gap: 18, marginTop: 28}}>
        {items.map((item, index) => {
          const reveal = smooth(frame, startFrame + 14 + index * 6, startFrame + 28 + index * 6);
          return (
            <div key={item.label} style={{opacity: reveal}}>
              <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                <span style={{width: 12, height: 12, borderRadius: 999, backgroundColor: toneColor(item.tone ?? (index === items.length - 1 ? 'positive' : 'neutral'))}} />
                <span style={{fontSize: 26, fontWeight: 750, color: C.graySoft}}>{item.label}</span>
              </div>
              <div style={{fontSize: 34, fontWeight: 900, color: C.whiteSoft, marginTop: 8, fontVariantNumeric: 'tabular-nums'}}>{euro0(item.amount)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MotionCompoundGrowth: React.FC<{
  contributionPerPeriod: number;
  annualReturnRate: number;
  years: number;
  periodsPerYear?: number;
  startFrame?: number;
  width?: number;
  height?: number;
}> = ({
  contributionPerPeriod,
  annualReturnRate,
  years,
  periodsPerYear = 12,
  startFrame = 0,
  width = 1420,
  height = 520,
}) => {
  const frame = useCurrentFrame();
  const series = calculateSavingsPlanSeries({contributionPerPeriod, annualReturnRate, years, periodsPerYear});
  const totalValues = series.map((point) => point.value);
  const contributionValues = series.map((point) => point.contributions);
  const max = Math.max(1, ...totalValues, ...contributionValues);
  const totalChart = makeChartPath({points: totalValues, width, height, padX: 64, padTop: 42, padBottom: 74, minValue: 0, maxValue: max});
  const contributionChart = makeChartPath({points: contributionValues, width, height, padX: 64, padTop: 42, padBottom: 74, minValue: 0, maxValue: max});
  const contributionProgress = smooth(frame, startFrame, startFrame + 46);
  const totalProgress = smooth(frame, startFrame + 12, startFrame + 70);
  const contributionEvolution = evolvePath(contributionProgress, contributionChart.path);
  const totalEvolution = evolvePath(totalProgress, totalChart.path);
  const result = smooth(frame, startFrame + 70, startFrame + 88);
  const final = series[series.length - 1];

  return (
    <div style={{width}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={64} y1={height - 74} x2={width - 64} y2={height - 74} stroke="rgba(255,255,255,0.16)" strokeWidth={2} />
        <path d={contributionChart.path} fill="none" stroke={C.graySoft} strokeWidth={7} strokeDasharray={contributionEvolution.strokeDasharray} strokeDashoffset={contributionEvolution.strokeDashoffset} strokeLinecap="round" />
        <path d={totalChart.path} fill="none" stroke={C.accent} strokeWidth={11} strokeDasharray={totalEvolution.strokeDasharray} strokeDashoffset={totalEvolution.strokeDashoffset} strokeLinecap="round" strokeLinejoin="round" />
        <text x={64} y={height - 28} fill={C.graySoft} fontSize={28}>0 Jahre</text>
        <text x={width - 64} y={height - 28} fill={C.graySoft} fontSize={28} textAnchor="end">{years} Jahre</text>
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 28, opacity: result}}>
        <div style={{fontSize: 28, color: C.graySoft}}>Einzahlungen <strong style={{color: C.whiteSoft}}>{euro0(final.contributions)}</strong></div>
        <div style={{fontSize: 34, color: C.accent, fontWeight: 900}}>Endwert {euro0(final.value)}</div>
        <div style={{fontSize: 28, color: C.gold}}>Wachstum {euro0(final.growth)}</div>
      </div>
    </div>
  );
};

export const MotionLoanPaydown: React.FC<{
  principal: number;
  annualInterestRate: number;
  termMonths: number;
  startFrame?: number;
  width?: number;
  height?: number;
}> = ({principal, annualInterestRate, termMonths, startFrame = 0, width = 1420, height = 500}) => {
  const frame = useCurrentFrame();
  const schedule = calculateLoanSchedule({principal, annualInterestRate, termMonths});
  const summary = calculateLoanSummary({principal, annualInterestRate, termMonths});
  const balances = [principal, ...schedule.map((point) => point.balance)];
  const chart = makeChartPath({points: balances, width, height, padX: 64, padTop: 38, padBottom: 72, minValue: 0, maxValue: Math.max(1, principal)});
  const progress = smooth(frame, startFrame, startFrame + 72);
  const evolution = evolvePath(progress, chart.path);
  const result = smooth(frame, startFrame + 68, startFrame + 88);

  return (
    <div style={{width}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={64} y1={height - 72} x2={width - 64} y2={height - 72} stroke="rgba(255,255,255,0.16)" strokeWidth={2} />
        <path d={chart.path} fill="none" stroke={C.negativeLt} strokeWidth={11} strokeDasharray={evolution.strokeDasharray} strokeDashoffset={evolution.strokeDashoffset} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={chart.coords[0].x} cy={chart.coords[0].y} r={12} fill={C.negativeLt} />
        <circle cx={chart.coords[chart.coords.length - 1].x} cy={chart.coords[chart.coords.length - 1].y} r={12 * result} fill={C.accent} />
        <text x={64} y={height - 26} fill={C.graySoft} fontSize={28}>Start: {euro0(principal)}</text>
        <text x={width - 64} y={height - 26} fill={C.graySoft} fontSize={28} textAnchor="end">Monat {termMonths}</text>
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 28, opacity: result}}>
        <div style={{fontSize: 30, color: C.whiteSoft}}>Rate <strong>{euro0(summary.monthlyPayment)}</strong></div>
        <div style={{fontSize: 30, color: C.gold}}>Zinsen gesamt <strong>{euro0(summary.totalInterest)}</strong></div>
        <div style={{fontSize: 34, color: C.accent, fontWeight: 900}}>Restschuld 0 €</div>
      </div>
    </div>
  );
};

export const MotionPurchasingPower: React.FC<{
  amount: number;
  annualInflationRate: number;
  years: number;
  startFrame?: number;
  width?: number;
}> = ({amount, annualInflationRate, years, startFrame = 0, width = 1420}) => {
  const frame = useCurrentFrame();
  const adjusted = calculateInflationAdjustedValue({amount, annualInflationRate, years});
  const loss = calculatePurchasingPowerLossPercent({amount, annualInflationRate, years});
  const targetRatio = amount <= 0 ? 1 : clamp01(adjusted / amount);
  const change = smooth(frame, startFrame + 12, startFrame + 62);
  const ratio = 1 + (targetRatio - 1) * change;
  const result = smooth(frame, startFrame + 58, startFrame + 78);

  return (
    <div style={{width, display: 'grid', gap: 34}}>
      <div style={{display: 'grid', gridTemplateColumns: '240px 1fr 190px', alignItems: 'center', gap: 24}}>
        <div style={{fontSize: 32, color: C.whiteSoft, fontWeight: 800}}>Nominal</div>
        <div style={{height: 68, borderRadius: 18, backgroundColor: C.gold, opacity: 0.9}} />
        <div style={{fontSize: 38, textAlign: 'right', color: C.gold, fontWeight: 900}}>{euro0(amount)}</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '240px 1fr 190px', alignItems: 'center', gap: 24}}>
        <div style={{fontSize: 32, color: C.whiteSoft, fontWeight: 800}}>Kaufkraft</div>
        <div style={{height: 68, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${ratio * 100}%`, borderRadius: 18, backgroundColor: C.negativeLt}} />
        </div>
        <div style={{fontSize: 38, textAlign: 'right', color: C.negativeLt, fontWeight: 900, fontVariantNumeric: 'tabular-nums'}}>{euro0(adjusted)}</div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, opacity: result}}>
        <div style={{fontSize: 30, color: C.graySoft}}>{years} Jahre · {(annualInflationRate * 100).toLocaleString('de-DE', {maximumFractionDigits: 1})} % p. a.</div>
        <div style={{fontSize: 38, color: C.negativeLt, fontWeight: 900}}>-{loss.toLocaleString('de-DE', {maximumFractionDigits: 1})} % Kaufkraft</div>
      </div>
    </div>
  );
};

export type MotionTimelineStep = {
  label: string;
  detail?: string;
  tone?: MotionTone;
};

export const MotionTimeline: React.FC<{
  steps: MotionTimelineStep[];
  startFrame?: number;
  width?: number;
}> = ({steps, startFrame = 0, width = 1420}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = Math.max(1, steps.length);
  const left = 90;
  const right = width - 90;
  const centerY = 92;
  const path = `M ${left} ${centerY} L ${right} ${centerY}`;
  const progress = smooth(frame, startFrame, startFrame + Math.max(42, count * 14));
  const evolution = evolvePath(progress, path);

  return (
    <div style={{width, height: 270, position: 'relative'}}>
      <svg width={width} height={170} viewBox={`0 0 ${width} 170`} style={{position: 'absolute', inset: 0}}>
        <path d={path} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} strokeLinecap="round" />
        <path d={path} fill="none" stroke={C.accent} strokeWidth={7} strokeLinecap="round" strokeDasharray={evolution.strokeDasharray} strokeDashoffset={evolution.strokeDashoffset} />
      </svg>
      {steps.map((step, index) => {
        const x = count === 1 ? width / 2 : left + (index / (count - 1)) * (right - left);
        const reveal = clamp01(sprung(frame, fps, startFrame + 8 + index * 12, index === count - 1 ? 'confirm' : 'chart'));
        return (
          <div key={`${step.label}-${index}`} style={{position: 'absolute', left: x - 110, top: centerY - 22, width: 220, textAlign: 'center', opacity: reveal, translate: `0 ${14 * (1 - reveal)}px`}}>
            <div style={{width: 42, height: 42, borderRadius: 999, backgroundColor: toneColor(step.tone ?? (index === count - 1 ? 'positive' : 'neutral')), margin: '0 auto 20px', border: '6px solid #000'}} />
            <div style={{fontSize: 28, fontWeight: 850, color: C.whiteSoft}}>{step.label}</div>
            {step.detail ? <div style={{fontSize: 23, color: C.graySoft, marginTop: 8}}>{step.detail}</div> : null}
          </div>
        );
      })}
    </div>
  );
};
