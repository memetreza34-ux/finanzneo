import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FONT, VISUAL_CENTER_Y, a} from '../brand';
import {
  AllocationSplit,
  Diversification,
  FinanceTimeline,
  LoanPaydown,
  MoneySplit,
  ProtectionLimit,
  type FinanceTone,
  type MotionBaseProps,
} from './index';
import {Rebalancing as RebalancingV2} from './direction-v2';
import {profilePayoff, profileProgress} from './motion-profiles-v2';

/**
 * FINANZNEO FINANCE MOTION DIRECTION V2.1
 * Visual-mechanism calibration after human review of the 12-scene motion reel.
 * Animation-only: image world, Flow, cover, captions, audio and production layout stay untouched.
 *
 * V2.1 rules:
 * - payoff is revealed after the explanatory action, never before it
 * - physical cause -> effect is preferred over dashboard/progress-bar language
 * - the main visual uses more of the available stage
 * - labels support the mechanism instead of replacing it
 */

const toneColor = (tone: FinanceTone): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'warning') return ANIMATION_COLORS.warning;
  if (tone === 'money') return ANIMATION_COLORS.money;
  if (tone === 'trust') return C.blueLt;
  return ANIMATION_COLORS.neutralText;
};

const StageLabel: React.FC<{children: React.ReactNode; tone?: FinanceTone; size?: number}> = ({
  children,
  tone = 'neutral',
  size = 24,
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
    }}
  >
    {children}
  </div>
);

const CoinToken: React.FC<{
  x: number;
  y: number;
  size?: number;
  scale?: number;
  opacity?: number;
  text?: string;
}> = ({x, y, size = 96, scale = 1, opacity = 1, text}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      border: `4px solid ${a(C.goldLt, 0.92)}`,
      background: `radial-gradient(circle at 34% 28%, ${a(C.white, 0.68)}, ${C.gold} 34%, ${a(C.gold, 0.5)} 72%)`,
      boxShadow: `0 24px 40px rgba(0,0,0,0.42),0 0 28px ${a(C.gold, 0.18)}`,
      transform: `scale(${scale})`,
      opacity,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#201500',
      fontFamily: FONT.title,
      fontSize: Math.max(17, size * 0.2),
      fontWeight: 950,
    }}
  >
    {text}
  </div>
);

const AccountPedestal: React.FC<{
  x: number;
  y: number;
  label: string;
  tone: FinanceTone;
  scale?: number;
}> = ({x, y, label, tone, scale = 1}) => {
  const color = toneColor(tone);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 300, height: 230, transform: `scale(${scale})`}}>
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 72,
          width: 264,
          height: 118,
          borderRadius: '22px 22px 48px 48px',
          border: `2px solid ${a(color, 0.5)}`,
          background: `linear-gradient(180deg,${a(color, 0.2)},rgba(255,255,255,0.025) 42%,rgba(0,0,0,0.38))`,
          boxShadow: '0 28px 48px rgba(0,0,0,0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 42,
          width: 264,
          height: 76,
          borderRadius: '50%',
          border: `3px solid ${a(color, 0.7)}`,
          background: `radial-gradient(ellipse at center,${a(color, 0.13)},rgba(0,0,0,0.78) 68%)`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.62),0 0 22px ${a(color, 0.09)}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 198,
          textAlign: 'center',
          color: C.white,
          fontFamily: FONT.body,
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        {label}
      </div>
    </div>
  );
};

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
  const travel = profileProgress(frame, durationFrames, 'transfer');
  const payoff = profilePayoff(frame, durationFrames, 'transfer');
  const impact = spring({
    frame: Math.max(0, frame - Math.round(durationFrames * 0.59)),
    fps,
    config: {damping: 17, stiffness: 205, mass: 0.7},
  });
  const launch = interpolate(travel, [0, 0.12, 0.88, 1], [0, 1, 1, 0], CLAMP);
  const sourceDebit = interpolate(travel, [0.08, 0.3], [0, 1], CLAMP);
  const baseY = VISUAL_CENTER_Y - 175;
  const x = interpolate(travel, [0, 1], [238, 760], CLAMP);
  const y = baseY + 20 - 205 * 4 * travel * (1 - travel);
  const coinScale = interpolate(travel, [0, 0.12, 0.82, 1], [0.88, 1.16, 1.08, 0.86], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <AccountPedestal x={60} y={baseY + 85} label={fromLabel} tone={fromTone} scale={1 - sourceDebit * 0.025} />
      <AccountPedestal x={720} y={baseY + 85} label={toLabel} tone={toTone} scale={1 + impact * 0.045 - payoff * 0.015} />

      <CoinToken x={x} y={y} size={116} scale={coinScale} opacity={Math.max(0.08, launch)} text={amount} />

      <div
        style={{
          position: 'absolute',
          left: 118,
          top: baseY + 5,
          width: 220,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 38,
          fontWeight: 950,
          color: ANIMATION_COLORS.warning,
          opacity: sourceDebit,
          transform: `translateY(${-18 * sourceDebit}px) scale(${0.9 + sourceDebit * 0.1})`,
        }}
      >
        − {amount}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 744,
          top: baseY - 2,
          width: 250,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 44,
          fontWeight: 950,
          color: toneColor(toTone),
          opacity: payoff,
          transform: `translateY(${18 - payoff * 18}px) scale(${0.84 + payoff * 0.16})`,
        }}
      >
        + {amount}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 735,
          top: baseY + 100,
          width: 270,
          height: 100,
          borderRadius: '50%',
          border: `4px solid ${a(toneColor(toTone), 0.48)}`,
          opacity: interpolate(impact, [0, 0.3, 1], [0, 0.9, 0], CLAMP),
          transform: `scale(${0.65 + impact * 0.75})`,
        }}
      />
    </div>
  );
};

export const ValueGrowth: React.FC<
  MotionBaseProps & {label?: string; startValue?: string; endValue?: string; tone?: FinanceTone; steps?: number}
> = ({durationFrames = 135, label = 'Vermögen', startValue = '10.000 €', endValue = '18.400 €', tone = 'positive', steps = 6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const payoff = profilePayoff(frame, durationFrames, 'growth');
  const count = Math.max(4, Math.min(8, steps));
  const top = VISUAL_CENTER_Y - 385;
  const color = toneColor(tone);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: top + 4, display: 'flex', justifyContent: 'center'}}>
        <StageLabel tone={tone}>{label}</StageLabel>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 235,
          top: top + 142,
          width: 610,
          height: 520,
          transform: 'perspective(900px) rotateX(3deg)',
        }}
      >
        {Array.from({length: count}, (_, index) => {
          const localStart = Math.round(durationFrames * (0.12 + index * 0.055));
          const build = spring({
            frame: Math.max(0, frame - localStart),
            fps,
            config: {damping: 21, stiffness: 105 + index * 13, mass: 0.88},
          });
          const layerWidth = 410 + index * 20;
          const layerLeft = (610 - layerWidth) / 2;
          const layerY = 392 - index * 54;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: layerLeft,
                top: layerY,
                width: layerWidth,
                height: 62,
                borderRadius: 22,
                border: `2px solid ${a(color, 0.55)}`,
                background: `linear-gradient(180deg,${a(color, 0.72)},${a(color, 0.24)} 58%,rgba(0,0,0,0.32))`,
                boxShadow: `0 18px 30px rgba(0,0,0,0.34),0 0 20px ${a(color, 0.07)}`,
                opacity: interpolate(build, [0, 0.12, 1], [0, 0.85, 1], CLAMP),
                transform: `translateY(${(1 - build) * 72}px) scale(${0.88 + build * 0.12})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 15,
                  right: 15,
                  top: -13,
                  height: 25,
                  borderRadius: '50%',
                  border: `1.5px solid ${a(color, 0.5)}`,
                  background: `linear-gradient(180deg,${a(C.white, 0.18)},${a(color, 0.22)})`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 126,
          top: top + 570,
          fontFamily: FONT.body,
          fontSize: 27,
          fontWeight: 850,
          color: C.whiteSoft,
        }}
      >
        Start · {startValue}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 118,
          top: top + 112,
          textAlign: 'right',
          fontFamily: FONT.title,
          fontSize: 58,
          fontWeight: 950,
          color,
          opacity: payoff,
          transform: `translateY(${22 - payoff * 22}px) scale(${0.86 + payoff * 0.14})`,
        }}
      >
        {endValue}
      </div>
    </div>
  );
};

export const ValueDrain: React.FC<
  MotionBaseProps & {label?: string; startValue?: string; endValue?: string; drainLabel?: string}
> = ({durationFrames = 135, label = 'Rendite', startValue = '100 %', endValue = '82 %', drainLabel = 'Kosten'}) => {
  const frame = useCurrentFrame();
  const progress = profileProgress(frame, durationFrames, 'drain');
  const payoff = profilePayoff(frame, durationFrames, 'drain');
  const top = VISUAL_CENTER_Y - 330;
  const remaining = interpolate(progress, [0, 0.23, 0.48, 0.73, 1], [1, 0.92, 0.84, 0.76, 0.7], CLAMP);
  const bodyWidth = 760 * remaining;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: top + 2, display: 'flex', justifyContent: 'center'}}>
        <StageLabel tone="warning">{drainLabel}</StageLabel>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 155,
          top: top + 190,
          width: bodyWidth,
          height: 215,
          borderRadius: 42,
          border: `2px solid ${a(ANIMATION_COLORS.positive, 0.58)}`,
          background: `linear-gradient(145deg,${ANIMATION_COLORS.positive},${a(C.accentDk, 0.82)} 62%,rgba(0,0,0,0.42))`,
          boxShadow: '0 32px 54px rgba(0,0,0,0.42)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 61,
            color: '#06140B',
            fontFamily: FONT.title,
            fontSize: 52,
            fontWeight: 950,
          }}
        >
          {startValue}
        </div>
      </div>

      {[0, 1, 2].map((index) => {
        const start = 0.18 + index * 0.24;
        const local = interpolate(progress, [start, start + 0.1, start + 0.22], [0, 1, 1], CLAMP);
        const chunkX = 835 - index * 58;
        return (
          <React.Fragment key={index}>
            <div
              style={{
                position: 'absolute',
                left: chunkX,
                top: top + 222 + index * 20,
                width: 70,
                height: 112,
                borderRadius: 16,
                border: `2px solid ${a(ANIMATION_COLORS.warning, 0.7)}`,
                background: `linear-gradient(150deg,${a(ANIMATION_COLORS.positive, 0.82)},${a(ANIMATION_COLORS.warning, 0.72)})`,
                opacity: local,
                transform: `translate(${local * 70}px,${local * 155}px) rotate(${local * (14 + index * 7)}deg) scale(${1 - local * 0.1})`,
                boxShadow: '0 20px 30px rgba(0,0,0,0.36)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: chunkX + 8,
                top: top + 135,
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: `3px solid ${a(ANIMATION_COLORS.warning, 0.86)}`,
                color: ANIMATION_COLORS.warning,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.title,
                fontSize: 24,
                fontWeight: 950,
                opacity: interpolate(local, [0, 0.2, 0.72, 1], [0, 1, 1, 0.15], CLAMP),
                transform: `translateY(${local * 72}px) scale(${0.75 + local * 0.35})`,
              }}
            >
              €
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 155,
          top: top + 452,
          color: C.whiteSoft,
          fontFamily: FONT.body,
          fontSize: 27,
          fontWeight: 850,
        }}
      >
        {label}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 130,
          top: top + 430,
          color: ANIMATION_COLORS.warning,
          fontFamily: FONT.title,
          fontSize: 62,
          fontWeight: 950,
          opacity: payoff,
          transform: `translateY(${18 - payoff * 18}px) scale(${0.84 + payoff * 0.16})`,
        }}
      >
        {endValue}
      </div>
    </div>
  );
};

// Rebalancing was the strongest V2 scene in the visual review, so V2.1 deliberately preserves it.
export const Rebalancing = RebalancingV2;

type Scenario = {label: string; value: string; tone?: FinanceTone};
const DEFAULT_LEFT: Scenario = {label: 'Variante A', value: '91.000 €', tone: 'positive'};
const DEFAULT_RIGHT: Scenario = {label: 'Variante B', value: '69.000 €', tone: 'warning'};

const OutcomeStack: React.FC<{
  x: number;
  y: number;
  tone: FinanceTone;
  progress: number;
  layers: number;
}> = ({x, y, tone, progress, layers}) => {
  const color = toneColor(tone);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 300, height: 350}}>
      {Array.from({length: layers}, (_, index) => {
        const threshold = index / Math.max(1, layers - 1);
        const reveal = interpolate(progress, [threshold * 0.7, Math.min(1, threshold * 0.7 + 0.24)], [0, 1], CLAMP);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 30 - index * 3,
              top: 270 - index * 42,
              width: 240 + index * 6,
              height: 52,
              borderRadius: 18,
              border: `2px solid ${a(color, 0.55)}`,
              background: `linear-gradient(180deg,${a(color, 0.78)},${a(color, 0.24)})`,
              boxShadow: '0 15px 26px rgba(0,0,0,0.32)',
              opacity: reveal,
              transform: `translateY(${(1 - reveal) * 46}px) scale(${0.9 + reveal * 0.1})`,
            }}
          />
        );
      })}
    </div>
  );
};

export const ScenarioComparison: React.FC<
  MotionBaseProps & {left?: Scenario; right?: Scenario}
> = ({durationFrames = 135, left = DEFAULT_LEFT, right = DEFAULT_RIGHT}) => {
  const frame = useCurrentFrame();
  const progress = profileProgress(frame, durationFrames, 'comparison');
  const payoff = profilePayoff(frame, durationFrames, 'comparison');
  const branch = interpolate(progress, [0.1, 0.36], [0, 1], CLAMP);
  const build = interpolate(progress, [0.28, 0.92], [0, 1], CLAMP);
  const top = VISUAL_CENTER_Y - 390;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: 440,
          top: top + 34,
          width: 200,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 28,
          fontWeight: 950,
          color: C.white,
        }}
      >
        GLEICHER START
      </div>
      <div
        style={{
          position: 'absolute',
          left: 505,
          top: top + 92,
          width: 70,
          height: 70,
          borderRadius: '50%',
          border: `3px solid ${a(C.whiteSoft, 0.7)}`,
          background: `radial-gradient(circle,${a(C.white, 0.18)},rgba(0,0,0,0.72))`,
          boxShadow: `0 0 24px ${a(C.white, 0.08)}`,
        }}
      />

      <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} viewBox="0 0 1080 1080">
        <path d={`M 540 ${top + 160} C 520 ${top + 245}, 390 ${top + 250}, 275 ${top + 330}`} fill="none" stroke={a(toneColor(left.tone ?? 'positive'), 0.68)} strokeWidth="8" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - branch} />
        <path d={`M 540 ${top + 160} C 560 ${top + 245}, 690 ${top + 250}, 805 ${top + 330}`} fill="none" stroke={a(toneColor(right.tone ?? 'warning'), 0.68)} strokeWidth="8" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - branch} />
      </svg>

      <OutcomeStack x={110} y={top + 300} tone={left.tone ?? 'positive'} progress={build} layers={6} />
      <OutcomeStack x={670} y={top + 386} tone={right.tone ?? 'warning'} progress={build} layers={4} />

      <div style={{position: 'absolute', left: 125, top: top + 705, width: 270, display: 'flex', justifyContent: 'center'}}>
        <StageLabel tone={left.tone ?? 'positive'} size={22}>{left.label}</StageLabel>
      </div>
      <div style={{position: 'absolute', left: 685, top: top + 705, width: 270, display: 'flex', justifyContent: 'center'}}>
        <StageLabel tone={right.tone ?? 'warning'} size={22}>{right.label}</StageLabel>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 105,
          top: top + 610,
          width: 310,
          textAlign: 'center',
          color: toneColor(left.tone ?? 'positive'),
          fontFamily: FONT.title,
          fontSize: 45,
          fontWeight: 950,
          opacity: payoff,
          transform: `translateY(${16 - payoff * 16}px)`,
        }}
      >
        {left.value}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 665,
          top: top + 610,
          width: 310,
          textAlign: 'center',
          color: toneColor(right.tone ?? 'warning'),
          fontFamily: FONT.title,
          fontSize: 45,
          fontWeight: 950,
          opacity: payoff,
          transform: `translateY(${16 - payoff * 16}px)`,
        }}
      >
        {right.value}
      </div>
    </div>
  );
};

export const CompoundGrowth: React.FC<
  MotionBaseProps & {periods?: string[]; values?: string[]}
> = ({durationFrames = 150, periods = ['Start', '10 J.', '20 J.', '30 J.'], values = ['10k', '16k', '26k', '42k']}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = profileProgress(frame, durationFrames, 'compound');
  const payoff = profilePayoff(frame, durationFrames, 'compound');
  const count = Math.min(5, Math.min(periods.length, values.length));
  const top = VISUAL_CENTER_Y - 410;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg style={{position: 'absolute', left: 0, top: top + 70, width: 1080, height: 650, overflow: 'visible'}} viewBox="0 0 1080 650">
        <path d="M 120 550 C 360 548, 610 470, 930 90" fill="none" stroke={a(C.goldLt, 0.16)} strokeWidth="18" strokeLinecap="round" />
        <path
          d="M 120 550 C 360 548, 610 470, 930 90"
          fill="none"
          stroke={C.goldLt}
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
      </svg>

      {Array.from({length: count}, (_, index) => {
        const ratio = index / Math.max(1, count - 1);
        const localStart = Math.round(durationFrames * (0.1 + ratio * 0.55));
        const reveal = spring({
          frame: Math.max(0, frame - localStart),
          fps,
          config: {damping: 22, stiffness: 96 + index * 22, mass: 0.86},
        });
        const x = 120 + ratio * 810;
        const curveY = 620 - 470 * ratio * ratio;
        const coins = 2 + index * 3;
        return (
          <div key={index} style={{position: 'absolute', left: x - 58, top: top + curveY - 105, width: 116, height: 210}}>
            {Array.from({length: coins}, (_, coinIndex) => (
              <div
                key={coinIndex}
                style={{
                  position: 'absolute',
                  left: 17,
                  top: 108 - coinIndex * 17,
                  width: 82,
                  height: 27,
                  borderRadius: '50%',
                  border: `2px solid ${a(C.goldLt, 0.88)}`,
                  background: `linear-gradient(180deg,${C.goldLt},${C.gold})`,
                  boxShadow: '0 8px 14px rgba(0,0,0,0.3)',
                  opacity: interpolate(reveal, [0, 0.12, 1], [0, 0.82, 1], CLAMP),
                  transform: `translateY(${(1 - reveal) * 44}px) scale(${0.9 + reveal * 0.1})`,
                }}
              />
            ))}
            <div style={{position: 'absolute', left: -42, right: -42, top: 142, textAlign: 'center', color: C.whiteSoft, fontFamily: FONT.body, fontSize: 21, fontWeight: 850}}>{periods[index]}</div>
            <div style={{position: 'absolute', left: -42, right: -42, top: 172, textAlign: 'center', color: C.gold, fontFamily: FONT.title, fontSize: 29, fontWeight: 950, opacity: reveal}}>{values[index]}</div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          right: 78,
          top: top + 52,
          width: 320,
          textAlign: 'right',
          color: C.goldLt,
          fontFamily: FONT.title,
          fontSize: 34,
          fontWeight: 950,
          opacity: payoff,
          transform: `translateY(${18 - payoff * 18}px) scale(${0.88 + payoff * 0.12})`,
        }}
      >
        Wachstum beschleunigt
      </div>
    </div>
  );
};

// V2.1 visually upgrades the five weak V2 scenes and preserves Rebalancing, the strongest V2 mechanism.
// The six V1 control mechanics stay unchanged until their own visual redesign pass.
export {AllocationSplit, Diversification, FinanceTimeline, LoanPaydown, MoneySplit, ProtectionLimit};

export const FINANCE_MOTION_DIRECTION_V2_1_COMPONENTS = {
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
