import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FONT, VISUAL_CENTER_Y, a} from '../brand';
import type {FinanceTone, MotionBaseProps} from './index';
import {
  CompoundGrowth,
  MoneyTransfer,
  Rebalancing,
  ScenarioComparison,
  ValueDrain,
  ValueGrowth,
} from './direction-v2-1';

/**
 * FINANZNEO FINANCE MOTION DIRECTION V2.2
 * Visual redesign of the six remaining V1 control mechanics.
 * Animation-only. V9 image world, Flow, cover, captions, audio and production layout stay untouched.
 *
 * Direction rules:
 * - cause -> action -> visible consequence -> payoff
 * - mechanism first, labels second
 * - large focal motion, minimal dashboard language
 * - payoff appears after the explanatory action
 */

const toneColor = (tone: FinanceTone): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'warning') return ANIMATION_COLORS.warning;
  if (tone === 'money') return ANIMATION_COLORS.money;
  if (tone === 'trust') return C.blueLt;
  return ANIMATION_COLORS.neutralText;
};

const phase = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], CLAMP);

const Label: React.FC<{children: React.ReactNode; tone?: FinanceTone; size?: number; opacity?: number}> = ({
  children,
  tone = 'neutral',
  size = 24,
  opacity = 1,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 14px',
      borderRadius: 16,
      border: `1.5px solid ${a(toneColor(tone), 0.42)}`,
      background: a(toneColor(tone), 0.07),
      color: toneColor(tone),
      fontFamily: FONT.body,
      fontSize: size,
      fontWeight: 850,
      whiteSpace: 'nowrap',
      opacity,
    }}
  >
    {children}
  </div>
);

const Coin: React.FC<{
  x: number;
  y: number;
  size?: number;
  tone?: FinanceTone;
  opacity?: number;
  scale?: number;
  text?: string;
}> = ({x, y, size = 82, tone = 'money', opacity = 1, scale = 1, text}) => {
  const color = toneColor(tone);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        border: `4px solid ${a(color, 0.88)}`,
        background: `radial-gradient(circle at 34% 28%,${a(C.white, 0.62)},${color} 34%,${a(color, 0.5)} 72%)`,
        boxShadow: `0 20px 34px rgba(0,0,0,0.38),0 0 24px ${a(color, 0.13)}`,
        opacity,
        scale,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#17120A',
        fontFamily: FONT.title,
        fontSize: Math.max(15, size * 0.19),
        fontWeight: 950,
      }}
    >
      {text}
    </div>
  );
};

const Pod: React.FC<{
  x: number;
  y: number;
  width?: number;
  label: string;
  tone?: FinanceTone;
  value?: string;
  opacity?: number;
  scale?: number;
}> = ({x, y, width = 250, label, tone = 'neutral', value, opacity = 1, scale = 1}) => {
  const color = toneColor(tone);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: 150,
        borderRadius: 34,
        border: `2px solid ${a(color, 0.5)}`,
        background: `linear-gradient(155deg,${a(color, 0.2)},rgba(255,255,255,0.025) 58%,rgba(0,0,0,0.42))`,
        boxShadow: '0 28px 46px rgba(0,0,0,0.38)',
        opacity,
        scale,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        color: C.white,
        fontFamily: FONT.body,
      }}
    >
      <div style={{fontSize: 25, fontWeight: 900}}>{label}</div>
      {value ? <div style={{fontFamily: FONT.title, fontSize: 38, fontWeight: 950, color}}>{value}</div> : null}
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
  const {fps} = useVideoConfig();
  const top = VISUAL_CENTER_Y - 360;
  const visible = parts.slice(0, 4);
  const sourceOpen = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 20, stiffness: 130}});
  const splitStart = Math.round(durationFrames * 0.24);
  const splitEnd = Math.round(durationFrames * 0.67);
  const payoffStart = Math.round(durationFrames * 0.72);
  const destinations = visible.length <= 3
    ? [{x: 70, y: top + 470}, {x: 415, y: top + 525}, {x: 760, y: top + 470}]
    : [{x: 90, y: top + 455}, {x: 610, y: top + 455}, {x: 90, y: top + 650}, {x: 610, y: top + 650}];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: top + 5, display: 'flex', justifyContent: 'center'}}>
        <Label tone="money">{sourceLabel}</Label>
      </div>
      <div
        style={{
          position: 'absolute', left: 380, top: top + 112, width: 320, height: 240,
          borderRadius: '50% 50% 42px 42px',
          border: `3px solid ${a(C.gold, 0.62)}`,
          background: `radial-gradient(ellipse at 50% 28%,${a(C.goldLt, 0.22)},${a(C.gold, 0.08)} 42%,rgba(0,0,0,0.52) 76%)`,
          boxShadow: `0 34px 60px rgba(0,0,0,0.46),0 0 28px ${a(C.gold, 0.08)}`,
          scale: 0.9 + sourceOpen * 0.1,
        }}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 83, textAlign: 'center', fontFamily: FONT.title, fontSize: 48, fontWeight: 950, color: C.gold}}>{amount}</div>
      </div>

      {visible.map((part, index) => {
        const start = splitStart + index * 5;
        const move = phase(frame, start, splitEnd + index * 5);
        const destination = destinations[index];
        const originX = 505 + (index - (visible.length - 1) / 2) * 18;
        const originY = top + 260;
        const targetX = destination.x + 92;
        const targetY = destination.y - 92;
        const arc = -145 * 4 * move * (1 - move);
        const arrive = spring({frame: Math.max(0, frame - (splitEnd + index * 5)), fps, config: {damping: 18, stiffness: 180, mass: 0.78}});
        const payoff = phase(frame, payoffStart + index * 3, payoffStart + 13 + index * 3);
        return (
          <React.Fragment key={part.label}>
            <Coin
              x={interpolate(move, [0, 1], [originX, targetX], CLAMP)}
              y={interpolate(move, [0, 1], [originY, targetY], CLAMP) + arc}
              size={78}
              tone={part.tone ?? 'money'}
              scale={0.72 + 0.22 * Math.sin(Math.PI * move)}
              opacity={interpolate(move, [0, 0.04, 0.96, 1], [0, 1, 1, 0], CLAMP)}
            />
            <Pod
              x={destination.x}
              y={destination.y}
              label={part.label}
              tone={part.tone ?? 'neutral'}
              value={payoff > 0 ? `${part.share} %` : undefined}
              opacity={interpolate(move, [0.45, 0.8], [0.35, 1], CLAMP)}
              scale={0.96 + arrive * 0.04}
            />
          </React.Fragment>
        );
      })}
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
  const {fps} = useVideoConfig();
  const top = VISUAL_CENTER_Y - 355;
  const visible = parts.slice(0, 4);
  const fanStart = Math.round(durationFrames * 0.2);
  const fanEnd = Math.round(durationFrames * 0.66);
  const payoffStart = Math.round(durationFrames * 0.72);
  const total = Math.max(1, visible.reduce((sum, part) => sum + Math.max(0, part.value), 0));
  const angles = visible.map((_, index) => -58 + (116 * index) / Math.max(1, visible.length - 1));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: top, display: 'flex', justifyContent: 'center'}}><Label tone="positive">{title}</Label></div>
      <div
        style={{
          position: 'absolute', left: 390, top: top + 165, width: 300, height: 300, borderRadius: '50%',
          border: `3px solid ${a(C.white, 0.26)}`,
          background: `radial-gradient(circle at 36% 28%,${a(C.white, 0.16)},rgba(255,255,255,0.035) 35%,rgba(0,0,0,0.58) 72%)`,
          boxShadow: '0 34px 58px rgba(0,0,0,0.46)',
        }}
      />
      <div style={{position: 'absolute', left: 438, top: top + 267, width: 204, textAlign: 'center', fontFamily: FONT.title, fontSize: 36, fontWeight: 950, color: C.white}}>PORTFOLIO</div>

      {visible.map((part, index) => {
        const move = phase(frame, fanStart + index * 3, fanEnd + index * 3);
        const angle = angles[index] ?? 0;
        const radians = (angle * Math.PI) / 180;
        const distance = 305;
        const x = 500 + Math.sin(radians) * distance;
        const y = top + 285 + Math.cos(radians) * 210;
        const color = toneColor(part.tone ?? 'neutral');
        const thickness = 64 + (Math.max(0, part.value) / total) * 130;
        const settle = spring({frame: Math.max(0, frame - (fanEnd + index * 3)), fps, config: {damping: 20, stiffness: 145}});
        const payoff = phase(frame, payoffStart + index * 2, payoffStart + 12 + index * 2);
        return (
          <div key={part.label}>
            <div
              style={{
                position: 'absolute',
                left: interpolate(move, [0, 1], [500, x], CLAMP),
                top: interpolate(move, [0, 1], [top + 285, y], CLAMP),
                width: thickness,
                height: thickness,
                borderRadius: 28,
                border: `3px solid ${a(color, 0.72)}`,
                background: `linear-gradient(145deg,${a(color, 0.78)},${a(color, 0.24)} 58%,rgba(0,0,0,0.42))`,
                boxShadow: `0 24px 42px rgba(0,0,0,0.4),0 0 20px ${a(color, 0.09)}`,
                translate: '-50% -50%',
                rotate: `${angle * move * 0.45}deg`,
                scale: 0.78 + move * 0.22 + settle * 0.025,
              }}
            />
            <div
              style={{
                position: 'absolute', left: x - 115, top: y + thickness / 2 + 20, width: 230, textAlign: 'center',
                opacity: payoff, fontFamily: FONT.body, color: C.white,
              }}
            >
              <div style={{fontSize: 24, fontWeight: 900}}>{part.label}</div>
              <div style={{fontFamily: FONT.title, fontSize: 39, fontWeight: 950, color}}>{part.value} %</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

type Destination = {label: string; tone?: FinanceTone};
const DEFAULT_DESTINATIONS: Destination[] = [
  {label: 'USA', tone: 'trust'},
  {label: 'Europa', tone: 'positive'},
  {label: 'Asien', tone: 'money'},
  {label: 'Industrie', tone: 'neutral'},
];

export const Diversification: React.FC<
  MotionBaseProps & {sourceLabel?: string; destinations?: Destination[]}
> = ({durationFrames = 135, sourceLabel = 'ETF', destinations = DEFAULT_DESTINATIONS}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = VISUAL_CENTER_Y - 380;
  const visible = destinations.slice(0, 5);
  const branchStart = Math.round(durationFrames * 0.2);
  const branchEnd = Math.round(durationFrames * 0.68);
  const payoffStart = Math.round(durationFrames * 0.72);
  const nodes = [
    {x: 110, y: top + 170}, {x: 760, y: top + 165}, {x: 80, y: top + 570}, {x: 790, y: top + 565}, {x: 415, y: top + 700},
  ];
  const sourceX = 540;
  const sourceY = top + 390;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {visible.map((destination, index) => {
          const node = nodes[index];
          const draw = phase(frame, branchStart + index * 4, branchEnd + index * 4);
          const color = toneColor(destination.tone ?? 'neutral');
          const dx = node.x + 110 - sourceX;
          const dy = node.y + 75 - sourceY;
          const controlX = sourceX + dx * 0.5;
          const controlY = sourceY + dy * 0.18;
          const path = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${node.x + 110} ${node.y + 75}`;
          return (
            <path
              key={destination.label}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - draw}
              opacity={0.72}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute', left: sourceX - 126, top: sourceY - 126, width: 252, height: 252, borderRadius: '50%',
          border: `4px solid ${a(C.gold, 0.7)}`,
          background: `radial-gradient(circle at 34% 26%,${a(C.white, 0.35)},${a(C.gold, 0.42)} 28%,rgba(0,0,0,0.64) 72%)`,
          boxShadow: `0 34px 62px rgba(0,0,0,0.46),0 0 34px ${a(C.gold, 0.12)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          fontFamily: FONT.title, fontSize: 34, fontWeight: 950, color: C.white,
        }}
      >
        {sourceLabel}
      </div>

      {visible.map((destination, index) => {
        const node = nodes[index];
        const arriveFrame = branchEnd + index * 4;
        const arrive = spring({frame: Math.max(0, frame - arriveFrame), fps, config: {damping: 17, stiffness: 175}});
        const payoff = phase(frame, payoffStart + index * 2, payoffStart + 11 + index * 2);
        const color = toneColor(destination.tone ?? 'neutral');
        return (
          <div key={destination.label}>
            <div
              style={{
                position: 'absolute', left: node.x, top: node.y, width: 220, height: 150, borderRadius: 34,
                border: `2px solid ${a(color, 0.55)}`,
                background: `radial-gradient(circle at 50% 38%,${a(color, 0.25)},rgba(0,0,0,0.58) 72%)`,
                boxShadow: `0 26px 46px rgba(0,0,0,0.4),0 0 22px ${a(color, 0.08)}`,
                scale: 0.78 + arrive * 0.22,
                opacity: phase(frame, branchStart + index * 4, arriveFrame),
              }}
            />
            <div style={{position: 'absolute', left: node.x, top: node.y + 50, width: 220, textAlign: 'center', fontFamily: FONT.body, fontSize: 27, fontWeight: 900, color, opacity: payoff}}>{destination.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const LoanPaydown: React.FC<
  MotionBaseProps & {label?: string; startDebt?: string; endDebt?: string; payments?: number}
> = ({durationFrames = 150, label = 'Restschuld', startDebt = '20.000 €', endDebt = '12.000 €', payments = 4}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = VISUAL_CENTER_Y - 385;
  const count = Math.max(3, Math.min(7, payments));
  const actionStart = Math.round(durationFrames * 0.18);
  const spacing = Math.round((durationFrames * 0.5) / count);
  const payoffStart = Math.round(durationFrames * 0.75);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: top, display: 'flex', justifyContent: 'center'}}><Label tone="warning">{label}</Label></div>
      <div style={{position: 'absolute', left: 118, top: top + 135, fontFamily: FONT.body, fontSize: 27, fontWeight: 850, color: C.whiteSoft}}>Start · {startDebt}</div>

      {Array.from({length: count}, (_, index) => {
        const hitFrame = actionStart + index * spacing;
        const hit = spring({frame: Math.max(0, frame - hitFrame), fps, config: {damping: 18, stiffness: 180, mass: 0.75}});
        const removed = phase(frame, hitFrame + 4, hitFrame + 14);
        const y = top + 570 - index * 74;
        return (
          <React.Fragment key={index}>
            <div
              style={{
                position: 'absolute', left: 350, top: y, width: 380, height: 62, borderRadius: 18,
                border: `2px solid ${a(ANIMATION_COLORS.warning, 0.62)}`,
                background: `linear-gradient(180deg,${a(ANIMATION_COLORS.warning, 0.78)},${a(ANIMATION_COLORS.warning, 0.22)})`,
                boxShadow: '0 18px 30px rgba(0,0,0,0.34)',
                opacity: 1 - removed,
                translate: `${removed * 95}px ${removed * 48}px`,
                rotate: `${removed * (index % 2 === 0 ? 8 : -8)}deg`,
                scale: 1 - removed * 0.18,
              }}
            />
            <Coin
              x={105 + phase(frame, hitFrame - 14, hitFrame) * 210}
              y={y - 9}
              size={78}
              tone="money"
              opacity={interpolate(phase(frame, hitFrame - 14, hitFrame + 2), [0, 0.15, 0.88, 1], [0, 1, 1, 0], CLAMP)}
              scale={0.8 + hit * 0.08}
            />
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: 'absolute', right: 105, top: top + 270, width: 235, height: 235, borderRadius: '50%',
          border: `3px solid ${a(ANIMATION_COLORS.positive, 0.58)}`,
          background: `radial-gradient(circle,${a(ANIMATION_COLORS.positive, 0.18)},rgba(0,0,0,0.65) 70%)`,
          opacity: phase(frame, payoffStart, payoffStart + 12),
          scale: interpolate(phase(frame, payoffStart, payoffStart + 12), [0, 1], [0.82, 1], CLAMP),
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          color: C.white, fontFamily: FONT.body,
        }}
      >
        <div style={{fontSize: 23, fontWeight: 850}}>verbleibt</div>
        <div style={{fontFamily: FONT.title, fontSize: 38, fontWeight: 950, color: ANIMATION_COLORS.positive}}>{endDebt}</div>
      </div>
    </div>
  );
};

export const ProtectionLimit: React.FC<
  MotionBaseProps & {entityLabel?: string; items?: string[]; limit?: string}
> = ({durationFrames = 135, entityLabel = 'Bank', items = ['Giro', 'Tagesgeld', 'Festgeld'], limit = '100.000 €'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = VISUAL_CENTER_Y - 370;
  const visible = items.slice(0, 4);
  const enterStart = Math.round(durationFrames * 0.18);
  const enterEnd = Math.round(durationFrames * 0.58);
  const shieldStart = Math.round(durationFrames * 0.58);
  const payoffStart = Math.round(durationFrames * 0.76);
  const lock = spring({frame: Math.max(0, frame - shieldStart), fps, config: {damping: 18, stiffness: 160}});

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: top, display: 'flex', justifyContent: 'center'}}><Label tone="trust">{entityLabel}</Label></div>

      <div
        style={{
          position: 'absolute', left: 160, top: top + 175, width: 760, height: 470,
          borderRadius: '360px 360px 68px 68px',
          border: `5px solid ${a(C.blueLt, 0.72)}`,
          borderBottomWidth: 12,
          background: `radial-gradient(ellipse at 50% 80%,${a(C.blueLt, 0.10)},rgba(0,0,0,0.04) 62%)`,
          boxShadow: `0 0 ${24 + lock * 28}px ${a(C.blueLt, 0.1 + lock * 0.08)},inset 0 0 42px ${a(C.blueLt, 0.05 + lock * 0.06)}`,
          opacity: phase(frame, shieldStart - 8, shieldStart + 8),
          scale: 0.96 + lock * 0.04,
        }}
      />

      {visible.map((item, index) => {
        const local = phase(frame, enterStart + index * 5, enterEnd + index * 5);
        const targetX = 225 + index * (visible.length === 1 ? 0 : 610 / Math.max(1, visible.length - 1));
        const targetY = top + 430 - (index % 2) * 55;
        return (
          <Pod
            key={item}
            x={interpolate(local, [0, 1], [-290 - index * 35, targetX], CLAMP)}
            y={targetY}
            width={190}
            label={item}
            tone={index % 2 === 0 ? 'trust' : 'money'}
            opacity={interpolate(local, [0, 0.15, 1], [0, 1, 1], CLAMP)}
            scale={0.9 + local * 0.1}
          />
        );
      })}

      <div
        style={{
          position: 'absolute', left: 385, top: top + 260, width: 310, textAlign: 'center',
          opacity: phase(frame, payoffStart, payoffStart + 14),
          scale: interpolate(phase(frame, payoffStart, payoffStart + 14), [0, 1], [0.84, 1], CLAMP),
          fontFamily: FONT.body, color: C.white,
        }}
      >
        <div style={{fontSize: 24, fontWeight: 850}}>geschützt bis</div>
        <div style={{fontFamily: FONT.title, fontSize: 52, fontWeight: 950, color: C.blueLt, marginTop: 4}}>{limit}</div>
        <div style={{fontSize: 21, fontWeight: 850, color: C.whiteSoft, marginTop: 8}}>gemeinsamer Schutzbereich</div>
      </div>
    </div>
  );
};

type Milestone = {label: string; value: string; tone?: FinanceTone};
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
  const {fps} = useVideoConfig();
  const top = VISUAL_CENTER_Y - 350;
  const visible = milestones.slice(0, 5);
  const travelStart = Math.round(durationFrames * 0.14);
  const travelEnd = Math.round(durationFrames * 0.74);
  const travel = phase(frame, travelStart, travelEnd);
  const points = visible.map((_, index) => ({
    x: 120 + index * (840 / Math.max(1, visible.length - 1)),
    y: top + 515 - index * index * 22,
  }));
  const path = points.length
    ? `M ${points.map((point, index) => `${index === 0 ? '' : 'L '}${point.x} ${point.y}`).join(' ')}`
    : '';

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={path} fill="none" stroke={a(C.white, 0.15)} strokeWidth="10" strokeLinecap="round" />
        <path d={path} fill="none" stroke={C.gold} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - travel} />
      </svg>

      {visible.map((milestone, index) => {
        const threshold = index / Math.max(1, visible.length - 1);
        const arrived = phase(travel, Math.max(0, threshold - 0.06), Math.min(1, threshold + 0.05));
        const point = points[index];
        const settle = spring({frame: Math.max(0, frame - (travelStart + Math.round((travelEnd - travelStart) * threshold))), fps, config: {damping: 19, stiffness: 150}});
        const color = toneColor(milestone.tone ?? 'neutral');
        return (
          <React.Fragment key={`${milestone.label}-${milestone.value}`}>
            <div
              style={{
                position: 'absolute', left: point.x - 42, top: point.y - 42, width: 84, height: 84, borderRadius: '50%',
                border: `4px solid ${a(color, 0.85)}`, background: `radial-gradient(circle,${color},${a(color, 0.34)} 58%,rgba(0,0,0,0.6))`,
                boxShadow: `0 18px 32px rgba(0,0,0,0.38),0 0 22px ${a(color, 0.13)}`,
                scale: 0.7 + settle * 0.3,
                opacity: arrived,
              }}
            />
            <div
              style={{
                position: 'absolute', left: point.x - 120, top: point.y - 165, width: 240, textAlign: 'center',
                opacity: arrived, translate: `0 ${18 - arrived * 18}px`, fontFamily: FONT.body,
              }}
            >
              <div style={{fontSize: 23, fontWeight: 850, color: C.whiteSoft}}>{milestone.label}</div>
              <div style={{fontFamily: FONT.title, fontSize: 37, fontWeight: 950, color}}>{milestone.value}</div>
            </div>
          </React.Fragment>
        );
      })}

      <Coin
        x={interpolate(travel, points.map((_, index) => index / Math.max(1, points.length - 1)), points.map((point) => point.x - 36), CLAMP)}
        y={interpolate(travel, points.map((_, index) => index / Math.max(1, points.length - 1)), points.map((point) => point.y - 36), CLAMP)}
        size={72}
        tone="money"
        scale={1.03}
      />
    </div>
  );
};

export {
  CompoundGrowth,
  MoneyTransfer,
  Rebalancing,
  ScenarioComparison,
  ValueDrain,
  ValueGrowth,
};

export const FINANCE_MOTION_DIRECTION_V2_2_COMPONENTS = {
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
