import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FONT, VISUAL_CENTER_Y, a, prog} from '../brand';

/**
 * FINANZNEO FINANCE MOTION LIBRARY V1
 * Animation-only toolkit. No image prompt, Flow asset, cover, caption, layout
 * or V9 image-world behavior is changed by this module.
 */

export type FinanceMotionCategory =
  | 'money'
  | 'growth'
  | 'costs'
  | 'portfolio'
  | 'credit'
  | 'banking'
  | 'comparison'
  | 'time';

export type FinanceMotionDescriptor = {
  id: string;
  category: FinanceMotionCategory;
  explains: string[];
  suitableFor: string[];
  avoidFor?: string[];
  reusable: true;
};

export type MotionBaseProps = {durationFrames?: number};
export type FinanceTone = 'positive' | 'warning' | 'money' | 'neutral' | 'trust';

const toneColor = (tone: FinanceTone): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'warning') return ANIMATION_COLORS.warning;
  if (tone === 'money') return ANIMATION_COLORS.money;
  if (tone === 'trust') return C.blueLt;
  return ANIMATION_COLORS.neutralText;
};

const Pill: React.FC<{children: React.ReactNode; tone?: FinanceTone; size?: number}> = ({
  children,
  tone = 'neutral',
  size = 26,
}) => {
  const color = toneColor(tone);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 54,
        padding: '10px 18px',
        borderRadius: 18,
        background: 'rgba(255,255,255,0.055)',
        border: `1.5px solid ${a(color, 0.45)}`,
        color,
        fontFamily: FONT.body,
        fontSize: size,
        fontWeight: 850,
        boxShadow: '0 12px 28px rgba(0,0,0,0.28)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

const Slab: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: FinanceTone;
  children?: React.ReactNode;
  scale?: number;
  opacity?: number;
  rotate?: number;
}> = ({x, y, w, h, tone = 'neutral', children, scale = 1, opacity = 1, rotate = 0}) => {
  const color = toneColor(tone);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 34,
        border: `2px solid ${a(color, 0.5)}`,
        background: `linear-gradient(145deg, ${a(color, 0.24)}, rgba(255,255,255,0.035) 64%, rgba(0,0,0,0.18))`,
        boxShadow: `0 28px 55px rgba(0,0,0,0.42), inset 0 1px 0 ${a('#FFFFFF', 0.16)}`,
        color: C.white,
        fontFamily: FONT.body,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: '50% 50%',
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      {children}
    </div>
  );
};

const Coin: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  tone?: FinanceTone;
}> = ({x, y, scale = 1, opacity = 1, tone = 'money'}) => {
  const color = toneColor(tone);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 68,
        height: 68,
        borderRadius: '50%',
        border: `4px solid ${a(color, 0.85)}`,
        background: `radial-gradient(circle at 35% 30%, ${a('#FFFFFF', 0.55)}, ${color} 34%, ${a(color, 0.48)} 72%)`,
        boxShadow: `0 18px 30px rgba(0,0,0,0.36), 0 0 20px ${a(color, 0.16)}`,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};

const centeredTop = (height: number): number => VISUAL_CENTER_Y - height / 2;

const motionWindow = (durationFrames: number) => {
  const actionStart = Math.max(6, Math.round(durationFrames * 0.16));
  const actionEnd = Math.max(actionStart + 18, Math.round(durationFrames * 0.68));
  const settleAt = Math.min(durationFrames - 15, actionEnd + 6);
  return {actionStart, actionEnd, settleAt};
};

const arcY = (progress: number, height: number): number => -4 * progress * (1 - progress) * height;

export const MoneyTransfer: React.FC<
  MotionBaseProps & {
    fromLabel?: string;
    toLabel?: string;
    amount?: string;
    fromTone?: FinanceTone;
    toTone?: FinanceTone;
  }
> = ({
  durationFrames = 120,
  fromLabel = 'Girokonto',
  toLabel = 'Depot',
  amount = '300 €',
  fromTone = 'neutral',
  toTone = 'positive',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {actionStart, actionEnd, settleAt} = motionWindow(durationFrames);
  const travel = prog(frame, actionStart, actionEnd);
  const settle = spring({
    frame: Math.max(0, frame - settleAt),
    fps,
    config: {damping: 22, stiffness: 150, mass: 0.8},
  });
  const baseY = centeredTop(360) + 120;
  const x = interpolate(travel, [0, 1], [330, 750], CLAMP);
  const y = baseY + arcY(travel, 145);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Slab x={90} y={baseY - 90} w={300} h={180} tone={fromTone}>
        <div>
          <div style={{fontSize: 27, fontWeight: 800}}>{fromLabel}</div>
          <div style={{fontSize: 42, fontWeight: 950, marginTop: 12}}>{amount}</div>
        </div>
      </Slab>
      <Slab x={690} y={baseY - 90} w={300} h={180} tone={toTone} scale={1 + settle * 0.035}>
        <div>
          <div style={{fontSize: 27, fontWeight: 800}}>{toLabel}</div>
          <div style={{fontSize: 32, fontWeight: 900, marginTop: 12, color: toneColor(toTone)}}>+ {amount}</div>
        </div>
      </Slab>
      <Coin x={x} y={y} scale={0.9 + travel * 0.12} />
    </div>
  );
};

type SplitPart = {label: string; share: number; tone?: FinanceTone};
const DEFAULT_SPLIT_PARTS: SplitPart[] = [
  {label: 'Fixkosten', share: 50, tone: 'neutral'},
  {label: 'Freizeit', share: 30, tone: 'trust'},
  {label: 'Sparen', share: 20, tone: 'positive'},
];

export const MoneySplit: React.FC<
  MotionBaseProps & {sourceLabel?: string; amount?: string; parts?: SplitPart[]}
> = ({durationFrames = 135, sourceLabel = 'Nettoeinkommen', amount = '2.500 €', parts = DEFAULT_SPLIT_PARTS}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const top = centeredTop(700);
  const visibleParts = parts.slice(0, 4);
  const cols = visibleParts.length <= 3 ? 3 : 2;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Slab x={340} y={top} w={400} h={160} tone="money">
        <div>
          <div style={{fontSize: 25, fontWeight: 800}}>{sourceLabel}</div>
          <div style={{fontSize: 44, fontWeight: 950, marginTop: 8}}>{amount}</div>
        </div>
      </Slab>
      {visibleParts.map((part, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const targetX = cols === 3 ? 80 + col * 340 : 170 + col * 520;
        const targetY = top + 400 + row * 210;
        const local = prog(frame, actionStart + index * 5, actionEnd + index * 5);
        const coinX = interpolate(local, [0, 1], [500, targetX + 115], CLAMP);
        const coinY = interpolate(local, [0, 0.5, 1], [top + 130, top + 245, targetY - 55], CLAMP);
        return (
          <React.Fragment key={part.label}>
            <Coin x={coinX} y={coinY} scale={0.58} tone={part.tone ?? 'money'} />
            <Slab
              x={targetX}
              y={targetY}
              w={280}
              h={150}
              tone={part.tone ?? 'neutral'}
              opacity={interpolate(local, [0.5, 1], [0.25, 1], CLAMP)}
            >
              <div>
                <div style={{fontSize: 25, fontWeight: 850}}>{part.label}</div>
                <div style={{fontSize: 38, fontWeight: 950, marginTop: 8}}>{part.share} %</div>
              </div>
            </Slab>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const ValueGrowth: React.FC<
  MotionBaseProps & {label?: string; startValue?: string; endValue?: string; tone?: FinanceTone; steps?: number}
> = ({durationFrames = 135, label = 'Vermögen', startValue = '10.000 €', endValue = '18.400 €', tone = 'positive', steps = 6}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const top = centeredTop(650);
  const count = Math.max(3, Math.min(8, steps));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
        <Pill tone={tone}>{label}</Pill>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: top + 150, height: 390, display: 'flex', alignItems: 'flex-end', gap: 22}}>
        {Array.from({length: count}, (_, index) => {
          const ratio = (index + 1) / count;
          const reveal = prog(frame, actionStart + index * 5, actionStart + 16 + index * 5);
          const height = (90 + 260 * ratio * ratio) * reveal;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height,
                borderRadius: '22px 22px 12px 12px',
                background: `linear-gradient(180deg,${toneColor(tone)},${a(toneColor(tone), 0.28)})`,
                boxShadow: '0 16px 28px rgba(0,0,0,0.28)',
              }}
            />
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 150, top: top + 570, fontFamily: FONT.body, fontSize: 30, fontWeight: 850, color: C.whiteSoft}}>{startValue}</div>
      <div style={{position: 'absolute', right: 150, top: top + 550, fontFamily: FONT.title, fontSize: 54, fontWeight: 950, color: toneColor(tone), opacity: prog(frame, actionEnd - 12, actionEnd + 2)}}>{endValue}</div>
    </div>
  );
};

export const ValueDrain: React.FC<
  MotionBaseProps & {label?: string; startValue?: string; endValue?: string; drainLabel?: string}
> = ({durationFrames = 135, label = 'Rendite', startValue = '100 %', endValue = '82 %', drainLabel = 'Kosten'}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const progress = prog(frame, actionStart, actionEnd);
  const top = centeredTop(520);
  const width = interpolate(progress, [0, 1], [700, 530], CLAMP);
  const cutX = 190 + width;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
        <Pill tone="warning">{drainLabel} ziehen Wert ab</Pill>
      </div>
      <div style={{position: 'absolute', left: 190, top: top + 180, width, height: 150, borderRadius: 34, background: `linear-gradient(90deg,${ANIMATION_COLORS.positive},${C.accentDk})`, boxShadow: '0 24px 50px rgba(0,0,0,0.36)'}} />
      {[0, 1, 2].map((index) => {
        const cut = prog(frame, actionStart + 10 + index * 12, actionStart + 28 + index * 12);
        return <div key={index} style={{position: 'absolute', left: cutX + 18 + index * 42, top: top + 205 + index * 13, width: 28, height: 96, borderRadius: 8, background: ANIMATION_COLORS.warning, opacity: cut, transform: `translateY(${cut * 65}px) rotate(${8 + index * 8}deg)`}} />;
      })}
      <div style={{position: 'absolute', left: 190, top: top + 370, fontFamily: FONT.body, fontSize: 31, fontWeight: 850, color: C.whiteSoft}}>{label}: {startValue}</div>
      <div style={{position: 'absolute', right: 190, top: top + 360, fontFamily: FONT.title, fontSize: 54, fontWeight: 950, color: ANIMATION_COLORS.warning, opacity: prog(frame, actionEnd - 10, actionEnd)}}>{endValue}</div>
    </div>
  );
};

type AllocationPart = {label: string; value: number; tone?: FinanceTone};
const DEFAULT_ALLOCATION: AllocationPart[] = [
  {label: 'Aktien', value: 70, tone: 'positive'},
  {label: 'Anleihen', value: 30, tone: 'trust'},
];

export const AllocationSplit: React.FC<
  MotionBaseProps & {title?: string; parts?: AllocationPart[]}
> = ({durationFrames = 120, title = 'Aufteilung', parts = DEFAULT_ALLOCATION}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const top = centeredTop(560);
  const progress = prog(frame, actionStart, actionEnd);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}><Pill>{title}</Pill></div>
      <div style={{position: 'absolute', left: 120, right: 120, top: top + 190, height: 160, borderRadius: 36, overflow: 'hidden', display: 'flex', boxShadow: '0 26px 52px rgba(0,0,0,0.36)'}}>
        {parts.map((part, index) => (
          <div
            key={part.label}
            style={{
              height: '100%',
              width: `${part.value * progress}%`,
              background: toneColor(part.tone ?? 'neutral'),
              borderRight: index < parts.length - 1 ? '4px solid rgba(0,0,0,0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#07110B',
              fontFamily: FONT.title,
              fontSize: 36,
              fontWeight: 950,
              overflow: 'hidden',
            }}
          >
            {progress > 0.65 ? `${part.value}%` : ''}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: top + 390, display: 'flex', justifyContent: 'space-between', gap: 18}}>
        {parts.map((part) => <Pill key={part.label} tone={part.tone ?? 'neutral'} size={22}>{part.label}</Pill>)}
      </div>
    </div>
  );
};

export const Rebalancing: React.FC<
  MotionBaseProps & {leftLabel?: string; rightLabel?: string; from?: [number, number]; to?: [number, number]}
> = ({durationFrames = 135, leftLabel = 'Aktien', rightLabel = 'Anleihen', from = [82, 18], to = [70, 30]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {actionStart, actionEnd, settleAt} = motionWindow(durationFrames);
  const progress = prog(frame, actionStart, actionEnd);
  const angle = interpolate(progress, [0, 1], [-9, 0], CLAMP);
  const transfer = interpolate(progress, [0, 1], [-150, 150], CLAMP);
  const settle = spring({frame: Math.max(0, frame - settleAt), fps, config: {damping: 20, stiffness: 140, mass: 0.9}});
  const top = centeredTop(620);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 130, right: 130, top: top + 220, height: 30, borderRadius: 999, background: C.whiteSoft, transform: `rotate(${angle}deg)`, boxShadow: '0 18px 30px rgba(0,0,0,0.3)'}}>
        <div style={{position: 'absolute', left: 75, top: -115, fontFamily: FONT.title, fontSize: 44, color: C.accentLt, fontWeight: 950}}>{Math.round(interpolate(progress, [0, 1], [from[0], to[0]], CLAMP))}%</div>
        <div style={{position: 'absolute', right: 75, top: -115, fontFamily: FONT.title, fontSize: 44, color: C.blueLt, fontWeight: 950}}>{Math.round(interpolate(progress, [0, 1], [from[1], to[1]], CLAMP))}%</div>
        <Coin x={260 + transfer} y={-85 + arcY(progress, 70)} scale={0.75} />
      </div>
      <div style={{position: 'absolute', left: 480, top: top + 250, width: 0, height: 0, borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: `130px solid ${C.grayDk}`}} />
      <div style={{position: 'absolute', left: 140, right: 140, top: top + 460, display: 'flex', justifyContent: 'space-between', transform: `scale(${1 + settle * 0.02})`}}>
        <Pill tone="positive">{leftLabel}</Pill>
        <Pill tone="trust">{rightLabel}</Pill>
      </div>
    </div>
  );
};

type Destination = {label: string; tone?: FinanceTone};
const DEFAULT_DESTINATIONS: Destination[] = [
  {label: 'Technologie', tone: 'trust'},
  {label: 'Gesundheit', tone: 'positive'},
  {label: 'Industrie', tone: 'neutral'},
  {label: 'Konsum', tone: 'money'},
];
const DIVERSIFICATION_TARGETS = [
  {x: 120, y: 430},
  {x: 330, y: 610},
  {x: 610, y: 610},
  {x: 820, y: 430},
  {x: 470, y: 720},
];

export const Diversification: React.FC<
  MotionBaseProps & {sourceLabel?: string; destinations?: Destination[]}
> = ({durationFrames = 135, sourceLabel = 'ETF', destinations = DEFAULT_DESTINATIONS}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const top = centeredTop(760);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Slab x={390} y={top} w={300} h={150} tone="positive"><div style={{fontSize: 40, fontWeight: 950}}>{sourceLabel}</div></Slab>
      {destinations.slice(0, 5).map((destination, index) => {
        const target = DIVERSIFICATION_TARGETS[index];
        const local = prog(frame, actionStart + index * 5, actionEnd + index * 3);
        const x = interpolate(local, [0, 1], [505, target.x], CLAMP);
        const y = interpolate(local, [0, 1], [top + 115, top + target.y], CLAMP);
        return (
          <React.Fragment key={destination.label}>
            <Coin x={x} y={y} scale={0.56} tone={destination.tone ?? 'money'} />
            <div style={{position: 'absolute', left: target.x - 65, top: top + target.y + 80, opacity: prog(frame, actionStart + 12 + index * 5, actionEnd)}}>
              <Pill tone={destination.tone ?? 'neutral'} size={20}>{destination.label}</Pill>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const LoanPaydown: React.FC<
  MotionBaseProps & {label?: string; startDebt?: string; endDebt?: string; payments?: number}
> = ({durationFrames = 150, label = 'Restschuld', startDebt = '20.000 €', endDebt = '12.000 €', payments = 4}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const top = centeredTop(680);
  const blocks = Math.max(4, Math.min(8, payments + 2));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}><Pill tone="warning">{label}</Pill></div>
      <div style={{position: 'absolute', left: 190, right: 190, top: top + 190, height: 360, display: 'flex', alignItems: 'flex-end', gap: 18}}>
        {Array.from({length: blocks}, (_, index) => {
          const remove = index < Math.min(payments, blocks - 1);
          const progress = remove ? prog(frame, actionStart + index * 10, actionStart + 22 + index * 10) : 0;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: 110 + index * 22,
                borderRadius: 22,
                background: `linear-gradient(180deg,${ANIMATION_COLORS.warning},${C.negativeDk})`,
                opacity: remove ? 1 - progress * 0.78 : 1,
                transform: `translateY(${remove ? progress * 120 : 0}px) scale(${remove ? 1 - progress * 0.18 : 1})`,
                boxShadow: '0 18px 32px rgba(0,0,0,0.32)',
              }}
            />
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 170, top: top + 585, fontFamily: FONT.body, fontSize: 28, fontWeight: 850, color: C.whiteSoft}}>{startDebt}</div>
      <div style={{position: 'absolute', right: 170, top: top + 565, fontFamily: FONT.title, fontSize: 50, fontWeight: 950, color: C.accentLt, opacity: prog(frame, actionEnd - 15, actionEnd)}}>{endDebt}</div>
    </div>
  );
};

export const ProtectionLimit: React.FC<
  MotionBaseProps & {entityLabel?: string; items?: string[]; limit?: string}
> = ({durationFrames = 135, entityLabel = 'Bank', items = ['Giro', 'Tagesgeld', 'Festgeld'], limit = '100.000 €'}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const progress = prog(frame, actionStart, actionEnd);
  const top = centeredTop(650);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Slab x={760} y={top + 235} w={220} h={150} tone="trust"><div style={{fontSize: 34, fontWeight: 950}}>{entityLabel}</div></Slab>
      {items.slice(0, 4).map((item, index) => {
        const local = prog(frame, actionStart + index * 6, actionEnd);
        const x = interpolate(local, [0, 1], [100 + index * 180, 570], CLAMP);
        return <div key={item} style={{position: 'absolute', left: x, top: top + 80 + index * 145}}><Pill size={21}>{item}</Pill></div>;
      })}
      <div style={{position: 'absolute', left: 60, top: top + 30, width: 760, height: 570, borderRadius: 48, border: `4px solid ${a(C.accentLt, 0.72)}`, boxShadow: `0 0 44px ${a(C.accent, 0.2)}`, opacity: progress, transform: `scale(${0.92 + progress * 0.08})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: top + 545, textAlign: 'center', fontFamily: FONT.title, fontSize: 58, fontWeight: 950, color: C.gold, opacity: prog(frame, actionEnd - 10, actionEnd)}}>{limit}</div>
    </div>
  );
};

type Scenario = {label: string; value: string; tone?: FinanceTone};
const DEFAULT_LEFT: Scenario = {label: 'Variante A', value: '91.000 €', tone: 'positive'};
const DEFAULT_RIGHT: Scenario = {label: 'Variante B', value: '69.000 €', tone: 'warning'};

export const ScenarioComparison: React.FC<
  MotionBaseProps & {left?: Scenario; right?: Scenario}
> = ({durationFrames = 135, left = DEFAULT_LEFT, right = DEFAULT_RIGHT}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const progress = prog(frame, actionStart, actionEnd);
  const top = centeredTop(620);
  const scenarios = [
    {...left, x: 160, height: interpolate(progress, [0, 1], [120, 350], CLAMP)},
    {...right, x: 610, height: interpolate(progress, [0, 1], [120, 245], CLAMP)},
  ];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {scenarios.map((scenario) => (
        <React.Fragment key={scenario.label}>
          <div style={{position: 'absolute', left: scenario.x, top: top + 430 - scenario.height, width: 310, height: scenario.height, borderRadius: '34px 34px 18px 18px', background: `linear-gradient(180deg,${toneColor(scenario.tone ?? 'neutral')},${a(toneColor(scenario.tone ?? 'neutral'), 0.24)})`, boxShadow: '0 24px 44px rgba(0,0,0,0.34)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 30, fontFamily: FONT.title, fontSize: 40, fontWeight: 950, color: '#08110B'}}>{scenario.value}</div>
          <div style={{position: 'absolute', left: scenario.x, top: top + 470}}><Pill tone={scenario.tone ?? 'neutral'}>{scenario.label}</Pill></div>
        </React.Fragment>
      ))}
    </div>
  );
};

type Milestone = {label: string; value?: string; tone?: FinanceTone};
const DEFAULT_MILESTONES: Milestone[] = [
  {label: 'Heute', value: '10.000 €', tone: 'neutral'},
  {label: '10 Jahre', value: '16.000 €', tone: 'trust'},
  {label: '20 Jahre', value: '26.000 €', tone: 'positive'},
  {label: '30 Jahre', value: '42.000 €', tone: 'money'},
];

export const FinanceTimeline: React.FC<
  MotionBaseProps & {milestones?: Milestone[]}
> = ({durationFrames = 150, milestones = DEFAULT_MILESTONES}) => {
  const frame = useCurrentFrame();
  const {actionStart, actionEnd} = motionWindow(durationFrames);
  const top = centeredTop(500);
  const visible = milestones.slice(0, 5);
  const line = prog(frame, actionStart, actionEnd);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 110, top: top + 210, width: 860, height: 12, borderRadius: 999, background: a(C.white, 0.09), overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${line * 100}%`, background: ANIMATION_COLORS.positive}} />
      </div>
      {visible.map((milestone, index) => {
        const x = 110 + index * (860 / Math.max(1, visible.length - 1));
        const reveal = prog(frame, actionStart + index * 12, actionStart + 18 + index * 12);
        return (
          <div key={milestone.label} style={{position: 'absolute', left: x - 70, top: top + 145, width: 140, textAlign: 'center', opacity: reveal, transform: `translateY(${(1 - reveal) * 18}px)`}}>
            <div style={{width: 34, height: 34, borderRadius: '50%', margin: '0 auto 28px', background: toneColor(milestone.tone ?? 'neutral'), boxShadow: `0 0 18px ${a(toneColor(milestone.tone ?? 'neutral'), 0.22)}`}} />
            <div style={{fontFamily: FONT.body, fontSize: 22, fontWeight: 850, color: C.white}}>{milestone.label}</div>
            {milestone.value ? <div style={{marginTop: 8, fontFamily: FONT.title, fontSize: 25, fontWeight: 950, color: toneColor(milestone.tone ?? 'neutral')}}>{milestone.value}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

export const CompoundGrowth: React.FC<
  MotionBaseProps & {periods?: string[]; values?: string[]}
> = ({durationFrames = 150, periods = ['Start', '10 J.', '20 J.', '30 J.'], values = ['10k', '16k', '26k', '42k']}) => {
  const frame = useCurrentFrame();
  const {actionStart} = motionWindow(durationFrames);
  const top = centeredTop(680);
  const count = Math.min(5, Math.min(periods.length, values.length));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {Array.from({length: count}, (_, index) => {
        const reveal = prog(frame, actionStart + index * 13, actionStart + 24 + index * 13);
        const x = 110 + index * (820 / Math.max(1, count - 1));
        const coins = 2 + index * 2;
        return (
          <div key={index} style={{position: 'absolute', left: x - 60, top: top + 370 - index * 45, width: 120, height: 260}}>
            {Array.from({length: coins}, (_, coinIndex) => (
              <div key={coinIndex} style={{position: 'absolute', left: 20, top: 190 - coinIndex * 22, width: 80, height: 28, borderRadius: '50%', background: C.gold, border: `2px solid ${C.goldLt}`, boxShadow: '0 8px 14px rgba(0,0,0,0.28)', opacity: reveal, transform: `translateY(${(1 - reveal) * 50}px)`}} />
            ))}
            <div style={{position: 'absolute', top: 220, left: -30, right: -30, textAlign: 'center', fontFamily: FONT.body, fontSize: 21, fontWeight: 850, color: C.whiteSoft}}>{periods[index]}</div>
            <div style={{position: 'absolute', top: 250, left: -30, right: -30, textAlign: 'center', fontFamily: FONT.title, fontSize: 28, fontWeight: 950, color: C.gold}}>{values[index]}</div>
          </div>
        );
      })}
    </div>
  );
};

export const FINANCE_MOTION_REGISTRY: FinanceMotionDescriptor[] = [
  {id: 'money-transfer', category: 'money', reusable: true, explains: ['money moves from one place to another', 'payment or contribution'], suitableFor: ['transfer', 'saving plan', 'tax payment', 'loan payment', 'deposit', 'withdrawal']},
  {id: 'money-split', category: 'money', reusable: true, explains: ['one amount is distributed into multiple uses'], suitableFor: ['budget', 'income allocation', 'cashflow allocation', 'portfolio contribution']},
  {id: 'value-growth', category: 'growth', reusable: true, explains: ['value rises over time or stages'], suitableFor: ['returns', 'savings growth', 'revenue growth', 'asset appreciation']},
  {id: 'value-drain', category: 'costs', reusable: true, explains: ['recurring costs reduce value'], suitableFor: ['fees', 'tax drag', 'inflation', 'cost erosion']},
  {id: 'allocation-split', category: 'portfolio', reusable: true, explains: ['one whole consists of weighted parts'], suitableFor: ['portfolio allocation', 'budget split', 'asset allocation']},
  {id: 'rebalancing', category: 'portfolio', reusable: true, explains: ['weights move back to a target allocation'], suitableFor: ['portfolio rebalancing', '70/30', '60/40']},
  {id: 'diversification', category: 'portfolio', reusable: true, explains: ['one investment spreads across multiple exposures'], suitableFor: ['ETF diversification', 'sector spread', 'country spread', 'risk spread']},
  {id: 'loan-paydown', category: 'credit', reusable: true, explains: ['debt decreases through repeated payments'], suitableFor: ['loan repayment', 'mortgage amortization', 'debt reduction']},
  {id: 'protection-limit', category: 'banking', reusable: true, explains: ['multiple items share one protection boundary or limit'], suitableFor: ['deposit insurance', 'bank limit', 'coverage aggregation']},
  {id: 'scenario-comparison', category: 'comparison', reusable: true, explains: ['same or comparable start leads to different outcomes'], suitableFor: ['fee comparison', 'return comparison', 'cost comparison', 'strategy comparison']},
  {id: 'finance-timeline', category: 'time', reusable: true, explains: ['financial values or states change across milestones'], suitableFor: ['deadlines', 'holding periods', 'long-term outcomes', 'age milestones']},
  {id: 'compound-growth', category: 'growth', reusable: true, explains: ['growth accelerates across repeated periods'], suitableFor: ['compound interest', 'reinvested returns', 'long-term saving']},
];

export const FINANCE_MOTION_COMPONENTS = {
  'money-transfer': MoneyTransfer,
  'money-split': MoneySplit,
  'value-growth': ValueGrowth,
  'value-drain': ValueDrain,
  'allocation-split': AllocationSplit,
  rebalancing: Rebalancing,
  diversification: Diversification,
  'loan-paydown': LoanPaydown,
  'protection-limit': ProtectionLimit,
  'scenario-comparison': ScenarioComparison,
  'finance-timeline': FinanceTimeline,
  'compound-growth': CompoundGrowth,
} as const;

export type FinanceMotionId = keyof typeof FINANCE_MOTION_COMPONENTS;

export const getFinanceMotionDescriptor = (id: string): FinanceMotionDescriptor | undefined =>
  FINANCE_MOTION_REGISTRY.find((item) => item.id === id);

export const searchFinanceMotions = (query: string): FinanceMotionDescriptor[] => {
  const words = query.toLowerCase().split(/[^a-z0-9äöüß]+/).filter(Boolean);
  return FINANCE_MOTION_REGISTRY
    .map((item) => {
      const haystack = [item.id, item.category, ...item.explains, ...item.suitableFor, ...(item.avoidFor ?? [])].join(' ').toLowerCase();
      const score = words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
      return {item, score};
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);
};
