import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  background: '#06110A',
  panel: 'rgba(15, 31, 20, 0.9)',
  panelSoft: 'rgba(255,255,255,0.055)',
  text: '#F6F3E8',
  muted: '#A8B8AD',
  lime: '#61F59A',
  limeSoft: '#B9FFD0',
  gold: '#F4C95D',
  red: '#FF6B6B',
  blue: '#65B7FF',
  line: 'rgba(255,255,255,0.13)',
} as const;

export const FINANCE_REEL_FPS = 30;
export const EARLY_MONTHLY = 100;
export const LATE_MONTHLY = 200;
export const EARLY_START_AGE = 20;
export const LATE_START_AGE = 30;
export const END_AGE = 60;
export const ANNUAL_RETURN_PERCENT = 7;
export const EARLY_CONTRIBUTIONS = EARLY_MONTHLY * 12 * (END_AGE - EARLY_START_AGE);
export const LATE_CONTRIBUTIONS = LATE_MONTHLY * 12 * (END_AGE - LATE_START_AGE);

export const monthlyFutureValue = (
  monthlyAmount: number,
  annualReturnPercent: number,
  months: number,
): number => {
  if (months <= 0 || monthlyAmount <= 0) return 0;
  const monthlyRate = annualReturnPercent / 100 / 12;
  if (monthlyRate === 0) return monthlyAmount * months;
  return monthlyAmount * ((1 + monthlyRate) ** months - 1) / monthlyRate;
};

export const balanceAtAge = (
  monthlyAmount: number,
  startAge: number,
  age: number,
): number => monthlyFutureValue(
  monthlyAmount,
  ANNUAL_RETURN_PERCENT,
  Math.max(0, Math.round((age - startAge) * 12)),
);

export const EARLY_FINAL = monthlyFutureValue(
  EARLY_MONTHLY,
  ANNUAL_RETURN_PERCENT,
  (END_AGE - EARLY_START_AGE) * 12,
);
export const LATE_FINAL = monthlyFutureValue(
  LATE_MONTHLY,
  ANNUAL_RETURN_PERCENT,
  (END_AGE - LATE_START_AGE) * 12,
);

export const FIRST_FULL_ANIMATION_SCENES = [
  {
    id: 'early-vs-late-race',
    durationSec: 4,
    kicker: 'DAS DUELL',
    title: '100 € ab 20 oder 200 € ab 30?',
    caption: 'Was ist stärker: 100 Euro im Monat ab 20 – oder 200 Euro ab 30?',
  },
  {
    id: 'dual-contribution-timeline',
    durationSec: 5,
    kicker: 'EINZAHLUNGEN',
    title: 'Weniger einzahlen – früher starten',
    caption: 'Bis 60 zahlt Person A nur 48.000 Euro ein. Person B sogar 72.000.',
  },
  {
    id: 'contribution-result-flip',
    durationSec: 5,
    kicker: 'DIE WENDUNG',
    title: 'Trotzdem liegt A vorne',
    caption: 'Trotzdem kann A am Ende vorne liegen.',
  },
  {
    id: 'compound-engine',
    durationSec: 6,
    kicker: 'DER GRUND',
    title: '10 Jahre mehr Zinseszins',
    caption: 'Der Grund: zehn zusätzliche Jahre Zinseszins.',
  },
  {
    id: 'delayed-growth-race',
    durationSec: 8,
    kicker: 'BEISPIELRECHNUNG',
    title: 'Der Zeitvorsprung bleibt',
    caption: 'Bei angenommenen sieben Prozent Rendite wachsen 100 Euro monatlich auf rund 262.000 Euro. 200 Euro ab 30 kommen auf etwa 244.000 Euro.',
  },
  {
    id: 'capital-composition-reveal',
    durationSec: 6,
    kicker: 'WAS WIRKLICH WÄCHST',
    title: 'Zeit erzeugt Rendite auf Rendite',
    caption: 'Nicht weil 100 Euro mehr sind – sondern weil Zeit Rendite auf Rendite erzeugt.',
  },
  {
    id: 'time-advantage-finale',
    durationSec: 6,
    kicker: 'FAZIT',
    title: 'Zeit ist der stärkste Hebel',
    caption: 'Früh anfangen kann wichtiger sein als später doppelt zu sparen.',
  },
] as const;

export type FirstFullAnimationSceneId = typeof FIRST_FULL_ANIMATION_SCENES[number]['id'];

export const FIRST_FULL_ANIMATION_DURATION = FIRST_FULL_ANIMATION_SCENES.reduce(
  (total, scene) => total + Math.round(scene.durationSec * FINANCE_REEL_FPS),
  0,
);

export const getFirstFullAnimationSceneStart = (
  sceneId: FirstFullAnimationSceneId,
): number => {
  let cursor = 0;
  for (const scene of FIRST_FULL_ANIMATION_SCENES) {
    if (scene.id === sceneId) return cursor;
    cursor += Math.round(scene.durationSec * FINANCE_REEL_FPS);
  }
  throw new Error(`Unbekannte Full-Animation-Szene: ${sceneId}`);
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const money = (value: number): string => `${Math.round(value).toLocaleString('de-DE')} €`;

const revealProgress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const pop = (frame: number, delay = 0): number => spring({
  frame: Math.max(0, frame - delay),
  fps: FINANCE_REEL_FPS,
  config: {damping: 16, stiffness: 150, mass: 0.8},
});

const SceneShell: React.FC<{
  kicker: string;
  title: string;
  caption: string;
  accent?: string;
  children: React.ReactNode;
}> = ({kicker, title, caption, accent = COLORS.lime, children}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 35) * 24;
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: `radial-gradient(circle at ${24 + drift / 8}% 18%, rgba(97,245,154,0.16), transparent 34%), radial-gradient(circle at 84% 58%, rgba(244,201,93,0.1), transparent 34%), ${COLORS.background}`,
        color: COLORS.text,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.24,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${frame % 72}px)`,
        }}
      />
      <div style={{position: 'absolute', top: 62, left: 68, right: 68, zIndex: 10}}>
        <div style={{fontSize: 24, fontWeight: 900, letterSpacing: 4, color: accent}}>{kicker}</div>
        <div style={{fontSize: 70, fontWeight: 950, lineHeight: 0.98, marginTop: 14, maxWidth: 920}}>{title}</div>
      </div>
      <div style={{position: 'absolute', top: 282, left: 62, right: 62, bottom: 330}}>
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 62,
          right: 62,
          bottom: 64,
          minHeight: 174,
          borderRadius: 34,
          padding: '28px 34px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 36,
          lineHeight: 1.16,
          fontWeight: 850,
          background: 'rgba(4,13,8,0.92)',
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 22px 70px rgba(0,0,0,0.42)',
          zIndex: 40,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, color = COLORS.lime, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 54,
      padding: '8px 20px',
      borderRadius: 999,
      background: `${color}1F`,
      border: `1px solid ${color}66`,
      color,
      fontSize: 27,
      fontWeight: 900,
      ...style,
    }}
  >
    {children}
  </div>
);

const Metric: React.FC<{
  label: string;
  value: string;
  color?: string;
  scale?: number;
}> = ({label, value, color = COLORS.text, scale = 1}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 30,
      padding: 26,
      background: COLORS.panelSoft,
      border: `1px solid ${COLORS.line}`,
      transform: `scale(${scale})`,
    }}
  >
    <div style={{fontSize: 25, color: COLORS.muted, fontWeight: 800}}>{label}</div>
    <div style={{fontSize: 54, color, fontWeight: 950, marginTop: 8}}>{value}</div>
  </div>
);

const EarlyVsLateRace: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const trackWidth = 770;
  const early = revealProgress(frame, 8, durationInFrames - 12);
  const late = revealProgress(frame, Math.round(durationInFrames * 0.38), durationInFrames - 12);
  const earlyX = early * trackWidth;
  const lateX = late * trackWidth * 0.75 + trackWidth * 0.25;

  const lane = (
    label: string,
    amount: string,
    x: number,
    top: number,
    color: string,
    start: string,
  ) => (
    <div style={{position: 'absolute', top, left: 40, right: 40, height: 240}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Pill color={color}>{label}</Pill>
        <Pill color={color}>{amount}</Pill>
      </div>
      <div style={{position: 'absolute', top: 105, left: 20, width: trackWidth, height: 18, borderRadius: 99, background: 'rgba(255,255,255,0.11)'}}>
        <div style={{height: '100%', width: clamp01(x / trackWidth) * 100 + '%', borderRadius: 99, background: `linear-gradient(90deg, ${color}55, ${color})`, boxShadow: `0 0 28px ${color}77`}} />
      </div>
      <div style={{position: 'absolute', top: 73, left: 18 + x, width: 84, height: 84, marginLeft: -42, borderRadius: 28, background: color, color: '#07110A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, fontWeight: 950, boxShadow: `0 16px 46px ${color}55`}}>
        {amount.replace(' €', '')}
      </div>
      <div style={{position: 'absolute', top: 148, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', color: COLORS.muted, fontSize: 24, fontWeight: 850}}>
        <span>{start}</span><span>Alter 60</span>
      </div>
    </div>
  );

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[0].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[0].title}
      caption={FIRST_FULL_ANIMATION_SCENES[0].caption}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`, overflow: 'hidden'}}>
        {lane('Person A', '100 €', earlyX, 90, COLORS.lime, 'Start 20')}
        {lane('Person B', '200 €', lateX, 430, COLORS.gold, 'Start 30')}
        <div style={{position: 'absolute', left: 355, top: 300, width: 230, textAlign: 'center', fontSize: 28, fontWeight: 950, color: COLORS.limeSoft}}>
          10 JAHRE VORSPRUNG
        </div>
      </div>
    </SceneShell>
  );
};

const DualContributionTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = revealProgress(frame, 8, durationInFrames - 18);
  const earlyValue = EARLY_CONTRIBUTIONS * progress;
  const lateValue = LATE_CONTRIBUTIONS * progress;

  const row = (
    label: string,
    startAge: number,
    amount: number,
    finalValue: number,
    top: number,
    color: string,
  ) => {
    const startShare = (startAge - EARLY_START_AGE) / (END_AGE - EARLY_START_AGE);
    const activeShare = (1 - startShare) * progress;
    return (
      <div style={{position: 'absolute', left: 56, right: 56, top, height: 250}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 30, fontWeight: 950}}>{label}</div>
            <div style={{fontSize: 24, color: COLORS.muted, marginTop: 6}}>{amount} € monatlich · ab {startAge}</div>
          </div>
          <div style={{fontSize: 48, fontWeight: 950, color}}>{money(finalValue * progress)}</div>
        </div>
        <div style={{position: 'absolute', top: 108, left: 0, right: 0, height: 26, borderRadius: 99, background: 'rgba(255,255,255,0.09)'}}>
          <div style={{position: 'absolute', left: `${startShare * 100}%`, width: `${activeShare * 100}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${color}55, ${color})`, boxShadow: `0 0 32px ${color}55`}} />
        </div>
        <div style={{position: 'absolute', top: 154, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', color: COLORS.muted, fontSize: 22, fontWeight: 850}}>
          <span>20</span><span>30</span><span>40</span><span>50</span><span>60</span>
        </div>
        {Array.from({length: 8}, (_, index) => {
          const coinProgress = (progress * 8 - index + 8) % 1;
          const x = (startShare + (1 - startShare) * ((index + 0.4) / 8)) * 820;
          return (
            <div key={`${label}-coin-${index}`} style={{position: 'absolute', left: x, top: 70 - coinProgress * 70, width: 34, height: 34, borderRadius: 99, background: color, opacity: progress > index / 10 ? 0.9 : 0, boxShadow: `0 0 20px ${color}88`}} />
          );
        })}
      </div>
    );
  };

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[1].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[1].title}
      caption={FIRST_FULL_ANIMATION_SCENES[1].caption}
      accent={COLORS.gold}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`}}>
        {row('Person A', 20, 100, EARLY_CONTRIBUTIONS, 80, COLORS.lime)}
        {row('Person B', 30, 200, LATE_CONTRIBUTIONS, 420, COLORS.gold)}
        <div style={{position: 'absolute', left: 58, right: 58, bottom: 40, display: 'flex', gap: 18}}>
          <Metric label="A eingezahlt" value={money(earlyValue)} color={COLORS.lime} />
          <Metric label="B eingezahlt" value={money(lateValue)} color={COLORS.gold} />
        </div>
      </div>
    </SceneShell>
  );
};

const ContributionResultFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const first = revealProgress(frame, 0, durationInFrames * 0.42);
  const flip = revealProgress(frame, durationInFrames * 0.4, durationInFrames * 0.82);
  const earlyHeight = 220 * first + 510 * flip;
  const lateHeight = 330 * first + 350 * flip;
  const earlyGrowth = Math.max(0, earlyHeight - 220);
  const lateGrowth = Math.max(0, lateHeight - 330);
  const balanceRotation = interpolate(flip, [0, 1], [7, -8]);

  const tower = (
    label: string,
    total: string,
    contributionHeight: number,
    growthHeight: number,
    left: number,
    color: string,
  ) => (
    <div style={{position: 'absolute', left, bottom: 155, width: 270, height: 610}}>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: contributionHeight, background: `${COLORS.gold}D9`, borderRadius: '26px 26px 12px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#141006', fontSize: 26, fontWeight: 950}}>Einzahlung</div>
      <div style={{position: 'absolute', bottom: contributionHeight, left: 0, right: 0, height: growthHeight, background: `linear-gradient(180deg, ${color}, ${color}77)`, borderRadius: '26px 26px 8px 8px', overflow: 'hidden', boxShadow: `0 0 42px ${color}44`}}>
        {growthHeight > 70 && <div style={{paddingTop: 26, textAlign: 'center', fontSize: 25, color: '#06110A', fontWeight: 950}}>Wachstum</div>}
      </div>
      <div style={{position: 'absolute', bottom: contributionHeight + growthHeight + 24, width: '100%', textAlign: 'center'}}>
        <div style={{fontSize: 33, fontWeight: 950}}>{label}</div>
        <div style={{fontSize: 43, fontWeight: 950, color, marginTop: 7}}>{total}</div>
      </div>
    </div>
  );

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[2].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[2].title}
      caption={FIRST_FULL_ANIMATION_SCENES[2].caption}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`, overflow: 'hidden'}}>
        {tower('Person A', money(EARLY_FINAL * flip), 220, earlyGrowth, 150, COLORS.lime)}
        {tower('Person B', money(LATE_FINAL * flip), 330, lateGrowth, 570, COLORS.blue)}
        <div style={{position: 'absolute', left: 176, right: 176, bottom: 95, height: 18, borderRadius: 99, background: COLORS.text, transform: `rotate(${balanceRotation}deg)`, transformOrigin: '50% 50%', boxShadow: '0 12px 24px rgba(0,0,0,0.5)'}} />
        <div style={{position: 'absolute', left: 485, bottom: 20, width: 60, height: 105, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', background: COLORS.text}} />
        <div style={{position: 'absolute', top: 34, left: 0, right: 0, textAlign: 'center', opacity: flip}}>
          <Pill color={COLORS.lime}>24.000 € weniger eingezahlt – trotzdem mehr Vermögen</Pill>
        </div>
      </div>
    </SceneShell>
  );
};

const CompoundEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = revealProgress(frame, 6, durationInFrames - 18);
  const rotation = frame * 2.4;
  const coinCount = Math.max(1, Math.floor(1 + progress * 12));

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[3].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[3].title}
      caption={FIRST_FULL_ANIMATION_SCENES[3].caption}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 306, top: 118, width: 390, height: 390, borderRadius: '50%', border: `26px dashed ${COLORS.lime}`, transform: `rotate(${rotation}deg)`, boxShadow: `0 0 80px ${COLORS.lime}33`}} />
        <div style={{position: 'absolute', left: 358, top: 170, width: 286, height: 286, borderRadius: '50%', border: `22px dashed ${COLORS.gold}`, transform: `rotate(${-rotation * 1.35}deg)`}} />
        <div style={{position: 'absolute', left: 414, top: 226, width: 174, height: 174, borderRadius: '50%', background: 'linear-gradient(145deg, #14321F, #07110A)', border: `3px solid ${COLORS.lime}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 40px rgba(97,245,154,0.12)'}}>
          <div style={{fontSize: 26, color: COLORS.muted, fontWeight: 850}}>ZINSESZINS</div>
          <div style={{fontSize: 54, color: COLORS.lime, fontWeight: 950}}>7 %</div>
        </div>
        {Array.from({length: coinCount}, (_, index) => {
          const angle = (index / 12) * Math.PI * 2 + frame / 42;
          const radius = 250 + (index % 3) * 58;
          const x = 501 + Math.cos(angle) * radius;
          const y = 315 + Math.sin(angle) * radius * 0.62;
          const scale = 0.7 + (index % 4) * 0.12;
          return (
            <div key={`engine-coin-${index}`} style={{position: 'absolute', left: x - 32, top: y - 32, width: 64, height: 64, borderRadius: '50%', background: index % 3 === 0 ? COLORS.gold : COLORS.lime, color: '#07110A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 950, transform: `scale(${scale})`, boxShadow: '0 12px 32px rgba(0,0,0,0.34)'}}>€</div>
          );
        })}
        <div style={{position: 'absolute', left: 74, right: 74, bottom: 76, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18}}>
          <Metric label="1" value="Einzahlung" color={COLORS.gold} scale={pop(frame, 10)} />
          <Metric label="2" value="Rendite" color={COLORS.lime} scale={pop(frame, 34)} />
          <Metric label="3" value="Rendite²" color={COLORS.limeSoft} scale={pop(frame, 58)} />
        </div>
        <div style={{position: 'absolute', top: 32, right: 34}}><Pill color={COLORS.lime}>A startet 10 Jahre früher</Pill></div>
      </div>
    </SceneShell>
  );
};

type ChartPoint = {age: number; value: number};

export const getGrowthSeries = (
  monthlyAmount: number,
  startAge: number,
): ChartPoint[] => Array.from({length: END_AGE - EARLY_START_AGE + 1}, (_, index) => {
  const age = EARLY_START_AGE + index;
  return {age, value: balanceAtAge(monthlyAmount, startAge, age)};
});

const DelayedGrowthRace: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = revealProgress(frame, 10, durationInFrames - 36);
  const earlySeries = getGrowthSeries(EARLY_MONTHLY, EARLY_START_AGE);
  const lateSeries = getGrowthSeries(LATE_MONTHLY, LATE_START_AGE);
  const chart = {left: 80, top: 128, width: 790, height: 670};
  const maxValue = 280000;
  const point = (entry: ChartPoint) => ({
    x: chart.left + ((entry.age - EARLY_START_AGE) / (END_AGE - EARLY_START_AGE)) * chart.width,
    y: chart.top + chart.height - (entry.value / maxValue) * chart.height,
  });
  const path = (series: ChartPoint[]) => series.map((entry, index) => {
    const current = point(entry);
    return `${index === 0 ? 'M' : 'L'} ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
  }).join(' ');
  const currentAge = EARLY_START_AGE + progress * (END_AGE - EARLY_START_AGE);
  const earlyCurrent = balanceAtAge(EARLY_MONTHLY, EARLY_START_AGE, currentAge);
  const lateCurrent = balanceAtAge(LATE_MONTHLY, LATE_START_AGE, currentAge);

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[4].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[4].title}
      caption={FIRST_FULL_ANIMATION_SCENES[4].caption}
      accent={COLORS.blue}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`, overflow: 'hidden'}}>
        <svg viewBox="0 0 950 900" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          {[0, 70000, 140000, 210000, 280000].map((value) => {
            const y = chart.top + chart.height - (value / maxValue) * chart.height;
            return <g key={value}><line x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} stroke="rgba(255,255,255,0.09)" strokeWidth="2"/><text x={chart.left - 18} y={y + 8} textAnchor="end" fill={COLORS.muted} fontSize="22" fontWeight="800">{Math.round(value / 1000)}k</text></g>;
          })}
          {[20, 30, 40, 50, 60].map((age) => {
            const x = chart.left + ((age - 20) / 40) * chart.width;
            return <g key={age}><line x1={x} x2={x} y1={chart.top} y2={chart.top + chart.height} stroke={age === 30 ? 'rgba(244,201,93,0.4)' : 'rgba(255,255,255,0.06)'} strokeWidth={age === 30 ? 3 : 2} strokeDasharray={age === 30 ? '12 12' : undefined}/><text x={x} y={chart.top + chart.height + 44} textAnchor="middle" fill={COLORS.muted} fontSize="24" fontWeight="850">{age}</text></g>;
          })}
          <path d={path(earlySeries)} fill="none" stroke={COLORS.lime} strokeWidth="15" strokeLinecap="round" pathLength={100} strokeDasharray={`${progress * 100} 100`} />
          <path d={path(lateSeries)} fill="none" stroke={COLORS.gold} strokeWidth="15" strokeLinecap="round" pathLength={100} strokeDasharray={`${progress * 100} 100`} />
        </svg>
        <div style={{position: 'absolute', left: 74, right: 74, top: 24, display: 'flex', gap: 16}}>
          <Metric label="100 € ab 20" value={money(earlyCurrent)} color={COLORS.lime} />
          <Metric label="200 € ab 30" value={money(lateCurrent)} color={COLORS.gold} />
        </div>
        <div style={{position: 'absolute', left: 74, bottom: 38}}><Pill color={COLORS.gold}>Start Person B</Pill></div>
        <div style={{position: 'absolute', right: 56, bottom: 38, opacity: revealProgress(frame, durationInFrames * 0.72, durationInFrames * 0.9)}}>
          <Pill color={COLORS.lime}>A: {money(EARLY_FINAL)}</Pill>
          <Pill color={COLORS.gold} style={{marginLeft: 12}}>B: {money(LATE_FINAL)}</Pill>
        </div>
      </div>
    </SceneShell>
  );
};

const CapitalCompositionReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = revealProgress(frame, 8, durationInFrames - 18);
  const earlyGrowth = EARLY_FINAL - EARLY_CONTRIBUTIONS;
  const lateGrowth = LATE_FINAL - LATE_CONTRIBUTIONS;

  const stack = (
    label: string,
    contributions: number,
    growth: number,
    total: number,
    top: number,
    color: string,
  ) => {
    const contributionPercent = contributions / total * 100;
    const growthPercent = growth / total * 100;
    return (
      <div style={{position: 'absolute', left: 56, right: 56, top, height: 245}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div style={{fontSize: 34, fontWeight: 950}}>{label}</div>
          <div style={{fontSize: 46, color, fontWeight: 950}}>{money(total * progress)}</div>
        </div>
        <div style={{height: 92, marginTop: 20, display: 'flex', borderRadius: 26, overflow: 'hidden', background: 'rgba(255,255,255,0.08)'}}>
          <div style={{width: `${contributionPercent * progress}%`, background: COLORS.gold, color: '#151006', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 950, overflow: 'hidden', whiteSpace: 'nowrap'}}>Einzahlung</div>
          <div style={{width: `${growthPercent * progress}%`, background: `linear-gradient(90deg, ${color}99, ${color})`, color: '#06110A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 950, overflow: 'hidden', whiteSpace: 'nowrap'}}>Wachstum</div>
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 16}}>
          <Pill color={COLORS.gold}>{money(contributions)} eingezahlt</Pill>
          <Pill color={color}>{money(growth)} Wachstum</Pill>
        </div>
      </div>
    );
  };

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[5].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[5].title}
      caption={FIRST_FULL_ANIMATION_SCENES[5].caption}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`}}>
        {stack('Person A · früh', EARLY_CONTRIBUTIONS, earlyGrowth, EARLY_FINAL, 110, COLORS.lime)}
        {stack('Person B · später', LATE_CONTRIBUTIONS, lateGrowth, LATE_FINAL, 450, COLORS.blue)}
        <div style={{position: 'absolute', left: 56, right: 56, bottom: 48, display: 'flex', justifyContent: 'center', opacity: pop(frame, 80)}}>
          <Pill color={COLORS.lime}>A erzielt rund {money(earlyGrowth - lateGrowth)} mehr Wachstum</Pill>
        </div>
      </div>
    </SceneShell>
  );
};

const TimeAdvantageFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = revealProgress(frame, 8, durationInFrames - 20);
  const handRotation = interpolate(progress, [0, 1], [300, 60]);
  const lineWidth = progress * 650;

  return (
    <SceneShell
      kicker={FIRST_FULL_ANIMATION_SCENES[6].kicker}
      title={FIRST_FULL_ANIMATION_SCENES[6].title}
      caption={FIRST_FULL_ANIMATION_SCENES[6].caption}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: COLORS.panel, border: `1px solid ${COLORS.line}`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 72, top: 120, width: 350, height: 350, borderRadius: '50%', border: `18px solid ${COLORS.lime}`, boxShadow: `0 0 70px ${COLORS.lime}33`, background: 'radial-gradient(circle, rgba(97,245,154,0.12), transparent 68%)'}}>
          {[0, 3, 6, 9].map((tick) => {
            const angle = tick * 30 * Math.PI / 180;
            const x = 166 + Math.sin(angle) * 138;
            const y = 166 - Math.cos(angle) * 138;
            return <div key={tick} style={{position: 'absolute', left: x, top: y, width: 14, height: 14, borderRadius: '50%', background: COLORS.text}} />;
          })}
          <div style={{position: 'absolute', left: 166, top: 62, width: 12, height: 112, borderRadius: 99, background: COLORS.gold, transformOrigin: '50% 100%', transform: `rotate(${handRotation}deg)`}} />
          <div style={{position: 'absolute', left: 166, top: 112, width: 12, height: 62, borderRadius: 99, background: COLORS.text, transformOrigin: '50% 100%', transform: `rotate(${handRotation * 0.45}deg)`}} />
          <div style={{position: 'absolute', left: 154, top: 154, width: 36, height: 36, borderRadius: '50%', background: COLORS.text}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 54, textAlign: 'center', fontSize: 54, fontWeight: 950, color: COLORS.lime}}>20</div>
        </div>
        <div style={{position: 'absolute', left: 445, top: 184, width: 650, height: 260}}>
          <div style={{position: 'absolute', left: 0, bottom: 24, width: lineWidth, height: 20, borderRadius: 99, background: `linear-gradient(90deg, ${COLORS.lime}55, ${COLORS.lime})`, transform: 'rotate(-16deg)', transformOrigin: '0 50%', boxShadow: `0 0 40px ${COLORS.lime}55`}} />
          {Array.from({length: 7}, (_, index) => {
            const itemProgress = pop(frame, 18 + index * 12);
            return <div key={`final-dot-${index}`} style={{position: 'absolute', left: index * 92, bottom: 25 + index * 25, width: 50 + index * 7, height: 50 + index * 7, borderRadius: '50%', background: index < 2 ? COLORS.gold : COLORS.lime, transform: `scale(${itemProgress})`, boxShadow: '0 12px 28px rgba(0,0,0,0.32)'}} />;
          })}
        </div>
        <div style={{position: 'absolute', left: 70, right: 70, top: 560, textAlign: 'center', opacity: progress, transform: `translateY(${(1 - progress) * 42}px)`}}>
          <div style={{fontSize: 88, lineHeight: 0.95, fontWeight: 950}}>ZEIT IST DER</div>
          <div style={{fontSize: 108, lineHeight: 0.95, fontWeight: 950, color: COLORS.lime, marginTop: 10}}>STÄRKSTE HEBEL</div>
          <div style={{fontSize: 28, lineHeight: 1.3, color: COLORS.muted, fontWeight: 750, marginTop: 38}}>Beispielrechnung: 7 % p. a., monatliche Einzahlung, vor Kosten, Steuern und Inflation. Keine Garantie.</div>
        </div>
      </div>
    </SceneShell>
  );
};

const SCENE_COMPONENTS: Record<FirstFullAnimationSceneId, React.FC> = {
  'early-vs-late-race': EarlyVsLateRace,
  'dual-contribution-timeline': DualContributionTimeline,
  'contribution-result-flip': ContributionResultFlip,
  'compound-engine': CompoundEngine,
  'delayed-growth-race': DelayedGrowthRace,
  'capital-composition-reveal': CapitalCompositionReveal,
  'time-advantage-finale': TimeAdvantageFinale,
};

export const FirstFullAnimationReel: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{background: COLORS.background}}>
      {FIRST_FULL_ANIMATION_SCENES.map((scene) => {
        const from = cursor;
        const durationInFrames = Math.round(scene.durationSec * FINANCE_REEL_FPS);
        cursor += durationInFrames;
        const Component = SCENE_COMPONENTS[scene.id];
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
            premountFor={15}
            name={`Full Animation · ${scene.id}`}
          >
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
