import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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
import {profilePayoff, profileProgress} from './motion-profiles-v2';

/**
 * FINANZNEO FINANCE MOTION DIRECTION V2
 * Calibration layer for motion quality only.
 * No image-world, Flow, cover, caption, audio or production-layout behavior lives here.
 */

const toneColor = (tone: FinanceTone): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'warning') return ANIMATION_COLORS.warning;
  if (tone === 'money') return ANIMATION_COLORS.money;
  if (tone === 'trust') return C.blueLt;
  return ANIMATION_COLORS.neutralText;
};

const CenterLabel: React.FC<{children: React.ReactNode; tone?: FinanceTone}> = ({children, tone = 'neutral'}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 54,
      padding: '10px 18px',
      borderRadius: 18,
      background: 'rgba(255,255,255,0.055)',
      border: `1.5px solid ${a(toneColor(tone), 0.45)}`,
      color: toneColor(tone),
      fontFamily: FONT.body,
      fontSize: 25,
      fontWeight: 850,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const AccountPlate: React.FC<{
  x: number;
  y: number;
  label: string;
  value: string;
  tone: FinanceTone;
  scale?: number;
  opacity?: number;
}> = ({x, y, label, value, tone, scale = 1, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 310,
      height: 178,
      borderRadius: 36,
      border: `2px solid ${a(toneColor(tone), 0.52)}`,
      background: `linear-gradient(145deg,${a(toneColor(tone), 0.22)},rgba(255,255,255,0.035) 66%,rgba(0,0,0,0.18))`,
      boxShadow: '0 28px 55px rgba(0,0,0,0.42)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT.body,
      color: C.white,
      scale,
      opacity,
    }}
  >
    <div style={{fontSize: 27, fontWeight: 800}}>{label}</div>
    <div style={{fontSize: 41, fontWeight: 950, marginTop: 12, color: toneColor(tone)}}>{value}</div>
  </div>
);

const TransferCoin: React.FC<{x: number; y: number; scale?: number; opacity?: number}> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 74,
      height: 74,
      borderRadius: '50%',
      border: `4px solid ${a(C.goldLt, 0.9)}`,
      background: `radial-gradient(circle at 34% 28%, ${a(C.white, 0.62)}, ${C.gold} 34%, ${a(C.gold, 0.52)} 72%)`,
      boxShadow: `0 18px 34px rgba(0,0,0,0.4),0 0 24px ${a(C.gold, 0.16)}`,
      scale,
      opacity,
    }}
  />
);

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
  const impactFrame = Math.round(durationFrames * 0.56);
  const impact = spring({
    frame: Math.max(0, frame - impactFrame),
    fps,
    config: {damping: 18, stiffness: 190, mass: 0.72},
  });
  const baseY = VISUAL_CENTER_Y - 65;
  const x = interpolate(travel, [0, 1], [337, 746], CLAMP);
  const y = baseY - 34 - 150 * 4 * travel * (1 - travel);
  const launchScale = interpolate(travel, [0, 0.12, 0.82, 1], [0.78, 1.08, 1.03, 0.84], {
    ...CLAMP,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const sourceScale = interpolate(travel, [0, 0.2, 1], [1, 0.985, 0.97], CLAMP);
  const targetScale = 1 + impact * 0.045 - payoff * 0.012;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <AccountPlate x={75} y={baseY - 90} label={fromLabel} value={`− ${amount}`} tone={fromTone} scale={sourceScale} />
      <AccountPlate x={695} y={baseY - 90} label={toLabel} value={`+ ${amount}`} tone={toTone} scale={targetScale} />
      <div
        style={{
          position: 'absolute',
          left: 720,
          top: baseY - 66,
          width: 260,
          height: 130,
          borderRadius: 34,
          border: `4px solid ${a(toneColor(toTone), 0.5)}`,
          opacity: interpolate(impact, [0, 0.35, 1], [0, 0.8, 0], CLAMP),
          scale: interpolate(impact, [0, 1], [0.72, 1.2], CLAMP),
        }}
      />
      <TransferCoin x={x} y={y} scale={launchScale} />
      <div
        style={{
          position: 'absolute',
          left: 394,
          top: baseY + 150,
          width: 292,
          height: 5,
          borderRadius: 999,
          background: a(C.white, 0.08),
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${travel * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg,${C.gold},${toneColor(toTone)})`,
          }}
        />
      </div>
    </div>
  );
};

export const ValueGrowth: React.FC<
  MotionBaseProps & {label?: string; startValue?: string; endValue?: string; tone?: FinanceTone; steps?: number}
> = ({durationFrames = 135, label = 'Vermögen', startValue = '10.000 €', endValue = '18.400 €', tone = 'positive', steps = 6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = profileProgress(frame, durationFrames, 'growth');
  const payoff = profilePayoff(frame, durationFrames, 'growth');
  const top = VISUAL_CENTER_Y - 350;
  const count = Math.max(3, Math.min(8, steps));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
        <CenterLabel tone={tone}>{label}</CenterLabel>
      </div>
      <div style={{position: 'absolute', left: 115, right: 115, top: top + 145, height: 405, display: 'flex', alignItems: 'flex-end', gap: 18}}>
        {Array.from({length: count}, (_, index) => {
          const ratio = (index + 1) / count;
          const localStart = Math.round(durationFrames * (0.14 + index * 0.045));
          const build = spring({
            frame: Math.max(0, frame - localStart),
            fps,
            config: {damping: 22, stiffness: 105 + index * 12, mass: 0.9},
          });
          const acceleration = Math.pow(ratio, 1.75);
          const targetHeight = 82 + 300 * acceleration;
          return (
            <div key={index} style={{flex: 1, height: 390, display: 'flex', alignItems: 'flex-end'}}>
              <div
                style={{
                  width: '100%',
                  height: targetHeight * build,
                  minHeight: 2,
                  borderRadius: '24px 24px 12px 12px',
                  background: `linear-gradient(180deg,${toneColor(tone)},${a(toneColor(tone), 0.28)})`,
                  boxShadow: `0 18px 30px rgba(0,0,0,0.28),0 0 ${10 + index * 2}px ${a(toneColor(tone), 0.08)}`,
                  opacity: interpolate(build, [0, 0.18, 1], [0.15, 0.8, 1], CLAMP),
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 130,
          right: 130,
          top: top + 565,
          height: 3,
          background: `linear-gradient(90deg,${a(C.white, 0.12)},${a(toneColor(tone), 0.5)})`,
          scale: `${Math.max(0.02, progress)} 1`,
          transformOrigin: '0% 50%',
        }}
      />
      <div style={{position: 'absolute', left: 145, top: top + 590, fontFamily: FONT.body, fontSize: 29, fontWeight: 850, color: C.whiteSoft}}>
        {startValue}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 145,
          top: top + 568,
          fontFamily: FONT.title,
          fontSize: 56,
          fontWeight: 950,
          color: toneColor(tone),
          opacity: payoff,
          scale: interpolate(payoff, [0, 1], [0.88, 1], CLAMP),
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
  const top = VISUAL_CENTER_Y - 280;
  const width = interpolate(progress, [0, 0.22, 0.5, 0.78, 1], [720, 680, 625, 565, 520], CLAMP);
  const hit = interpolate(progress, [0, 0.2, 0.28, 0.48, 0.56, 0.75, 0.83, 1], [0, 0, -12, 0, 9, 0, -5, 0], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
        <CenterLabel tone="warning">{drainLabel} ziehen Wert ab</CenterLabel>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 180 + hit,
          top: top + 185,
          width,
          height: 158,
          borderRadius: 36,
          background: `linear-gradient(90deg,${ANIMATION_COLORS.positive},${C.accentDk})`,
          boxShadow: '0 26px 50px rgba(0,0,0,0.38)',
        }}
      />
      {[0, 1, 2].map((index) => {
        const hitStart = 0.2 + index * 0.27;
        const hitProgress = interpolate(progress, [hitStart, hitStart + 0.09, hitStart + 0.2], [0, 1, 1], CLAMP);
        return (
          <React.Fragment key={index}>
            <div
              style={{
                position: 'absolute',
                left: 895 - index * 58,
                top: top + 205 + index * 26,
                width: 30,
                height: 100,
                borderRadius: 8,
                background: ANIMATION_COLORS.warning,
                opacity: hitProgress,
                translate: `${hitProgress * 38}px ${hitProgress * 82}px`,
                rotate: `${12 + index * 8}deg`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 842 - index * 55,
                top: top + 210 + index * 23,
                width: 42,
                height: 112,
                borderRadius: 12,
                border: `3px solid ${a(ANIMATION_COLORS.warning, 0.82)}`,
                opacity: interpolate(hitProgress, [0, 0.55, 1], [0, 0.9, 0], CLAMP),
                scale: interpolate(hitProgress, [0, 1], [0.75, 1.25], CLAMP),
              }}
            />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 180, top: top + 390, fontFamily: FONT.body, fontSize: 30, fontWeight: 850, color: C.whiteSoft}}>
        {label}: {startValue}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 180,
          top: top + 370,
          fontFamily: FONT.title,
          fontSize: 58,
          fontWeight: 950,
          color: ANIMATION_COLORS.warning,
          opacity: payoff,
          scale: interpolate(payoff, [0, 1], [0.88, 1], CLAMP),
        }}
      >
        {endValue}
      </div>
    </div>
  );
};

export const Rebalancing: React.FC<
  MotionBaseProps & {leftLabel?: string; rightLabel?: string; from?: [number, number]; to?: [number, number]}
> = ({durationFrames = 135, leftLabel = 'Aktien', rightLabel = 'Anleihen', from = [82, 18], to = [70, 30]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = profileProgress(frame, durationFrames, 'rebalance');
  const payoff = profilePayoff(frame, durationFrames, 'rebalance');
  const top = VISUAL_CENTER_Y - 330;
  const angle = interpolate(progress, [0, 0.72, 1], [-10, 1.5, 0], CLAMP);
  const transferA = interpolate(progress, [0.08, 0.52], [0, 1], CLAMP);
  const transferB = interpolate(progress, [0.32, 0.76], [0, 1], CLAMP);
  const settle = spring({
    frame: Math.max(0, frame - Math.round(durationFrames * 0.7)),
    fps,
    config: {damping: 24, stiffness: 135, mass: 0.85},
  });
  const leftValue = Math.round(interpolate(progress, [0, 1], [from[0], to[0]], CLAMP));
  const rightValue = Math.round(interpolate(progress, [0, 1], [from[1], to[1]], CLAMP));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: top + 270,
          width: 820,
          height: 28,
          borderRadius: 999,
          background: C.whiteSoft,
          rotate: `${angle}deg`,
          transformOrigin: '50% 50%',
          boxShadow: '0 18px 30px rgba(0,0,0,0.32)',
        }}
      >
        <div style={{position: 'absolute', left: 95, top: -125, fontFamily: FONT.title, fontSize: 48, color: C.accentLt, fontWeight: 950}}>{leftValue}%</div>
        <div style={{position: 'absolute', right: 95, top: -125, fontFamily: FONT.title, fontSize: 48, color: C.blueLt, fontWeight: 950}}>{rightValue}%</div>
      </div>
      <div style={{position: 'absolute', left: 480, top: top + 295, width: 0, height: 0, borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: `130px solid ${C.grayDk}`}} />
      {[transferA, transferB].map((tokenProgress, index) => (
        <TransferCoin
          key={index}
          x={interpolate(tokenProgress, [0, 1], [325 - index * 28, 690 + index * 24], CLAMP)}
          y={top + 190 - 95 * 4 * tokenProgress * (1 - tokenProgress)}
          scale={0.58 + index * 0.05}
          opacity={interpolate(tokenProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0.7], CLAMP)}
        />
      ))}
      <div style={{position: 'absolute', left: 140, right: 140, top: top + 500, display: 'flex', justifyContent: 'space-between', scale: 1 + settle * 0.018}}>
        <CenterLabel tone="positive">{leftLabel}</CenterLabel>
        <CenterLabel tone="trust">{rightLabel}</CenterLabel>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 365,
          top: top + 585,
          width: 350,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 22,
          fontWeight: 850,
          color: C.whiteSoft,
          opacity: payoff,
        }}
      >
        Zielgewicht erreicht
      </div>
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
  const progress = profileProgress(frame, durationFrames, 'comparison');
  const payoff = profilePayoff(frame, durationFrames, 'comparison');
  const top = VISUAL_CENTER_Y - 330;
  const shared = interpolate(progress, [0, 0.18], [0, 1], CLAMP);
  const divergence = interpolate(progress, [0.18, 1], [0, 1], CLAMP);
  const leftHeight = 125 + divergence * 245;
  const rightHeight = 125 + divergence * 128;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 515, top: top + 80, width: 50, height: 50, borderRadius: '50%', background: C.whiteSoft, opacity: shared}} />
      <div style={{position: 'absolute', left: 538, top: top + 125, width: 4, height: 120, background: a(C.white, 0.2), opacity: shared}} />
      <div style={{position: 'absolute', left: 255, top: top + 237, width: 285, height: 4, background: a(toneColor(left.tone ?? 'positive'), 0.5), scale: `${divergence} 1`, transformOrigin: '100% 50%'}} />
      <div style={{position: 'absolute', left: 540, top: top + 237, width: 285, height: 4, background: a(toneColor(right.tone ?? 'warning'), 0.5), scale: `${divergence} 1`, transformOrigin: '0% 50%'}} />
      {[
        {...left, x: 145, height: leftHeight},
        {...right, x: 625, height: rightHeight},
      ].map((scenario) => (
        <React.Fragment key={scenario.label}>
          <div
            style={{
              position: 'absolute',
              left: scenario.x,
              top: top + 510 - scenario.height,
              width: 310,
              height: scenario.height,
              borderRadius: '36px 36px 18px 18px',
              background: `linear-gradient(180deg,${toneColor(scenario.tone ?? 'neutral')},${a(toneColor(scenario.tone ?? 'neutral'), 0.24)})`,
              boxShadow: '0 24px 44px rgba(0,0,0,0.34)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: 30,
              fontFamily: FONT.title,
              fontSize: 41,
              fontWeight: 950,
              color: '#08110B',
              opacity: interpolate(progress, [0.12, 0.3, 1], [0.35, 1, 1], CLAMP),
            }}
          >
            {scenario.value}
          </div>
          <div style={{position: 'absolute', left: scenario.x + 20, top: top + 548, opacity: interpolate(progress, [0.35, 0.58], [0, 1], CLAMP)}}>
            <CenterLabel tone={scenario.tone ?? 'neutral'}>{scenario.label}</CenterLabel>
          </div>
        </React.Fragment>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 390,
          top: top + 650,
          width: 300,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 30,
          fontWeight: 950,
          color: C.white,
          opacity: payoff,
        }}
      >
        gleicher Start · anderes Ergebnis
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
  const top = VISUAL_CENTER_Y - 350;
  const count = Math.min(5, Math.min(periods.length, values.length));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {Array.from({length: count}, (_, index) => {
        const ratio = index / Math.max(1, count - 1);
        const start = Math.round(durationFrames * (0.12 + ratio * 0.42));
        const reveal = spring({
          frame: Math.max(0, frame - start),
          fps,
          config: {damping: 23, stiffness: 95 + index * 24, mass: 0.88},
        });
        const x = 105 + index * (835 / Math.max(1, count - 1));
        const coins = 2 + index * 3;
        const stackLift = index * index * 12;
        return (
          <div key={index} style={{position: 'absolute', left: x - 62, top: top + 340 - stackLift, width: 124, height: 330}}>
            {Array.from({length: coins}, (_, coinIndex) => (
              <div
                key={coinIndex}
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 220 - coinIndex * 19,
                  width: 84,
                  height: 30,
                  borderRadius: '50%',
                  background: `linear-gradient(180deg,${C.goldLt},${C.gold})`,
                  border: `2px solid ${a(C.goldLt, 0.88)}`,
                  boxShadow: '0 8px 14px rgba(0,0,0,0.28)',
                  opacity: interpolate(reveal, [0, 0.15, 1], [0, 0.8, 1], CLAMP),
                  translate: `0 ${interpolate(reveal, [0, 1], [54, 0], CLAMP)}px`,
                  scale: interpolate(reveal, [0, 1], [0.9, 1], CLAMP),
                }}
              />
            ))}
            <div style={{position: 'absolute', top: 255, left: -32, right: -32, textAlign: 'center', fontFamily: FONT.body, fontSize: 21, fontWeight: 850, color: C.whiteSoft}}>{periods[index]}</div>
            <div style={{position: 'absolute', top: 286, left: -32, right: -32, textAlign: 'center', fontFamily: FONT.title, fontSize: 30, fontWeight: 950, color: C.gold, opacity: reveal}}>{values[index]}</div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 118,
          top: top + 250,
          width: 820,
          height: 4,
          background: `linear-gradient(90deg,${a(C.gold, 0.16)},${a(C.goldLt, 0.65)})`,
          scale: `${Math.max(0.01, progress)} 1`,
          transformOrigin: '0% 50%',
          rotate: '-17deg',
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 108,
          top: top + 86,
          fontFamily: FONT.title,
          fontSize: 28,
          fontWeight: 950,
          color: C.goldLt,
          opacity: payoff,
          scale: interpolate(payoff, [0, 1], [0.86, 1], CLAMP),
        }}
      >
        Wachstum beschleunigt
      </div>
    </div>
  );
};

// V2 currently changes motion direction for the six mechanics where identical pacing was most visible.
// The remaining mechanics intentionally keep their proven V1 implementation until their own visual review.
export {AllocationSplit, Diversification, FinanceTimeline, LoanPaydown, MoneySplit, ProtectionLimit};

export const FINANCE_MOTION_DIRECTION_V2_COMPONENTS = {
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
