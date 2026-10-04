import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, C, E, FONT, a, prog} from '../brand';
import {PhysicalObject} from '../motion';
import type {FinanceTone, MotionBaseProps, ValueUnit} from './types';

/**
 * FINANZNEO FINANCE MOTION CORE V3
 *
 * Die sechs Mechaniken, die eine Menge über Zeit zeigen — wachsen, abfließen,
 * beschleunigen, auseinanderlaufen, abtragen, aufteilen. Alles, was nur ein
 * Verhältnis oder eine Situation zeigt, gehört in ein Flow-Bild oder eine
 * Datenszene, nicht hierher.
 *
 * Gemeinsame Sprache: Münzen sind Geld, ihre Höhe ist der Betrag. Zahlen zählen
 * mit der Bewegung mit und landen exakt auf dem Wert aus dem Sprechpunkt.
 * Jede Mechanik läuft START → AKTION → ERGEBNIS und hält das Ergebnis bis zum
 * Szenenende.
 */

// Sichtbarer Bereich im nativen 1080×1920-Raster unter AnimationStage:
// Skalierung 1.1 um Y860, Clip Y320–1400, horizontale Safe-Zone X72–1008
// plus perspektivischer Innenabstand.
const SAFE = {left: 140, right: 940, top: 392, bottom: 1336} as const;
const CX = 540;

type MaterialRole = 'neutral' | 'money' | 'warning' | 'positive';

const toneColor = (tone: FinanceTone): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'warning') return C.negativeLt;
  if (tone === 'money') return ANIMATION_COLORS.money;
  if (tone === 'trust') return C.blueLt;
  return C.whiteSoft;
};

const toneRole = (tone: FinanceTone): MaterialRole => (tone === 'trust' ? 'neutral' : tone);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Einheitlicher Takt: Auftritt, Hauptaktion, danach steht das Ergebnis. */
const beats = (durationFrames: number) => {
  const enter = clamp(Math.round(durationFrames * 0.1), 8, 16);
  const actionStart = Math.max(enter + 4, Math.round(durationFrames * 0.16));
  const actionEnd = Math.min(durationFrames - 18, Math.max(actionStart + 30, Math.round(durationFrames * 0.7)));
  return {enter, actionStart, actionEnd};
};

const formatValue = (value: number, unit: ValueUnit, decimals = 0): string => {
  const text = value.toLocaleString('de-DE', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  return unit ? `${text} ${unit}` : text;
};

const signed = (value: number, unit: ValueUnit, decimals = 0): string =>
  `${value < 0 ? '−' : '+'}${formatValue(Math.abs(value), unit, decimals)}`;

/** Zählt in runden Schritten mit und landet exakt auf dem Zielwert. */
const countValue = (from: number, to: number, progress: number, decimals = 0): number => {
  if (progress <= 0) return from;
  if (progress >= 1) return to;
  const raw = from + (to - from) * progress;
  const span = Math.max(Math.abs(from), Math.abs(to));
  const step = span >= 1000 ? 10 ** (Math.floor(Math.log10(span)) - 2) : 10 ** -decimals;
  return Math.round(raw / step) * step;
};

const Text: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  font?: 'body' | 'number';
  opacity?: number;
  maxWidth?: number;
}> = ({x, y, children, size = 30, color = C.whiteSoft, align = 'center', font = 'body', opacity = 1, maxWidth}) => {
  const length = React.Children.toArray(children).join('').length;
  const perChar = font === 'number' ? 0.45 : 0.58;
  const fitted = maxWidth && length > 0 ? Math.min(size, Math.floor(maxWidth / (length * perChar))) : size;
  return (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : undefined,
      whiteSpace: 'nowrap',
      fontFamily: font === 'number' ? FONT.title : FONT.body,
      fontSize: fitted,
      fontWeight: font === 'number' ? 400 : 800,
      letterSpacing: font === 'number' ? 1 : 0,
      lineHeight: 1,
      color,
      opacity,
      textShadow: '0 4px 14px rgba(0,0,0,0.55)',
    }}
  >
    {children}
  </div>
  );
};

const DashedLine: React.FC<{x1: number; x2: number; y: number; color?: string; opacity?: number}> = ({
  x1,
  x2,
  y,
  color = C.gray,
  opacity = 1,
}) => (
  <div style={{position: 'absolute', left: x1, top: y, width: x2 - x1, borderTop: `3px dashed ${a(color, 0.75)}`, opacity}} />
);

const DashedBox: React.FC<{x: number; y: number; width: number; height: number; color?: string; opacity?: number}> = ({
  x,
  y,
  width,
  height,
  color = C.gray,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height: Math.max(0, height),
      border: `3px dashed ${a(color, 0.6)}`,
      borderRadius: 22,
      opacity,
    }}
  />
);

// ─── Münzen ──────────────────────────────────────────────────────────────────

const coinHeight = (width: number) => Math.round(width * 0.25);
const coinStep = (width: number) => Math.round(width * 0.15);
const stackTop = (base: number, count: number, width: number) =>
  base - coinHeight(width) - Math.max(0, count - 1) * coinStep(width);

const markInk: Record<MaterialRole, string> = {
  money: '#4a2d00',
  positive: '#003a1c',
  warning: '#4a0010',
  neutral: '#33413a',
};

const Coin: React.FC<{
  cx: number;
  top: number;
  width: number;
  role?: MaterialRole;
  opacity?: number;
  grounded?: boolean;
}> = ({cx, top, width, role = 'money', opacity = 1, grounded = false}) => {
  const height = coinHeight(width);
  return (
    <PhysicalObject
      x={cx - width / 2}
      y={top}
      width={width}
      height={height}
      depth={Math.max(6, height * 0.2)}
      radius={999}
      role={role}
      opacity={opacity}
      grounding={grounded ? 1 : 0}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: width * 0.28,
          height: height * 0.62,
          borderRadius: 999,
          border: `${Math.max(2, Math.round(width * 0.012))}px solid ${a(markInk[role], 0.35)}`,
          color: markInk[role],
          fontFamily: FONT.body,
          fontSize: height * 0.46,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        €
      </div>
    </PhysicalObject>
  );
};

/** Ein Stapel mit gebrochener Anzahl: die oberste Münze fällt gerade hinein. */
const CoinStack: React.FC<{
  cx: number;
  base: number;
  count: number;
  width: number;
  role?: MaterialRole;
}> = ({cx, base, count, width, role = 'money'}) => {
  const height = coinHeight(width);
  const step = coinStep(width);
  const full = Math.floor(count + 1e-6);
  const partial = count - full;
  const coins: React.ReactNode[] = [];
  for (let index = 0; index < full; index++) {
    coins.push(<Coin key={index} cx={cx} top={base - height - index * step} width={width} role={role} grounded={index === 0} />);
  }
  if (partial > 0.001) {
    const drop = (1 - partial) ** 2 * 90;
    coins.push(
      <Coin
        key="drop"
        cx={cx}
        top={base - height - full * step - drop}
        width={width}
        role={role}
        opacity={Math.min(1, partial * 8)}
        grounded={full === 0}
      />,
    );
  }
  return <>{coins}</>;
};

const arc = (from: {x: number; y: number}, to: {x: number; y: number}, t: number, lift: number) => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t - 4 * t * (1 - t) * lift,
});

// ─── 1. Wert wächst ──────────────────────────────────────────────────────────

/**
 * MECHANIK: value-growth
 * Ein Münzstapel wächst vom Start- auf den Endwert. Die Startmarke bleibt
 * stehen, damit der Abstand zum Ergebnis sichtbar ist.
 */
export const ValueGrowth: React.FC<
  MotionBaseProps & {
    label?: string;
    startValue?: number;
    endValue?: number;
    unit?: ValueUnit;
    decimals?: number;
    startLabel?: string;
    tone?: FinanceTone;
  }
> = ({
  durationFrames = 135,
  label = 'Depotwert',
  startValue = 10000,
  endValue = 21600,
  unit = '€',
  decimals = 0,
  startLabel = 'Start',
  tone = 'positive',
}) => {
  const frame = useCurrentFrame();
  const {enter, actionStart, actionEnd} = beats(durationFrames);
  const appear = prog(frame, 0, enter);
  const grow = prog(frame, actionStart, actionEnd, E.inOut);
  const payoff = prog(frame, actionEnd - 2, actionEnd + 12);

  const width = 280;
  const base = 1300;
  const maxCoins = 15;
  const startCoins = clamp(Math.round((maxCoins * startValue) / Math.max(endValue, 1e-9)), 2, maxCoins - 2);
  const count = Math.min(startCoins * appear, startCoins) + (maxCoins - startCoins) * grow;
  const startTop = stackTop(base, startCoins, width);
  const endTop = stackTop(base, maxCoins, width);
  const color = toneColor(tone);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Text x={CX} y={SAFE.top + 8} size={32} opacity={appear}>{label}</Text>
      <Text x={CX} y={SAFE.top + 52} size={128} font="number" color={color} opacity={appear} maxWidth={760}>
        {formatValue(countValue(startValue, endValue, grow, decimals), unit, decimals)}
      </Text>

      <CoinStack cx={CX} base={base} count={count} width={width} />

      <DashedLine x1={SAFE.left + 10} x2={CX - width / 2 - 16} y={startTop} opacity={appear} />
      <Text x={SAFE.left + 10} y={startTop - 46} size={28} align="left" color={C.gray} opacity={appear} maxWidth={CX - width / 2 - 26 - SAFE.left}>
        {startLabel} · {formatValue(startValue, unit, decimals)}
      </Text>

      <Text x={CX + width / 2 + 24} y={endTop + 6} size={40} align="left" color={color} opacity={payoff} maxWidth={SAFE.right - (CX + width / 2 + 24)}>
        {signed(endValue - startValue, unit, decimals)}
      </Text>
    </div>
  );
};

// ─── 2. Kosten ziehen Wert ab ────────────────────────────────────────────────

/**
 * MECHANIK: value-drain
 * Münzen verlassen den Stapel einzeln und landen rot auf dem Kostenhaufen.
 * Der leere Umriss zeigt, was ohne die Kosten noch da wäre.
 */
export const ValueDrain: React.FC<
  MotionBaseProps & {
    label?: string;
    startValue?: number;
    endValue?: number;
    unit?: ValueUnit;
    decimals?: number;
    drainLabel?: string;
  }
> = ({
  durationFrames = 135,
  label = 'Endvermögen',
  startValue = 100000,
  endValue = 74000,
  unit = '€',
  decimals = 0,
  drainLabel = 'Gebühren',
}) => {
  const frame = useCurrentFrame();
  const {enter, actionStart, actionEnd} = beats(durationFrames);
  const appear = prog(frame, 0, enter);
  const payoff = prog(frame, actionEnd - 2, actionEnd + 12);

  const width = 250;
  const pileWidth = 200;
  const base = 1300;
  const mainX = 360;
  const pileX = 770;
  const startCoins = 14;
  const lost = clamp(Math.round(startCoins * (1 - endValue / Math.max(startValue, 1e-9))), 1, startCoins - 2);
  const flight = Math.max(10, Math.round((actionEnd - actionStart) * 0.32));
  const departAt = (index: number) =>
    actionStart + Math.round((index * (actionEnd - actionStart - flight)) / Math.max(1, lost - 1));

  let departed = 0;
  let landed = 0;
  let travelled = 0;
  const flyers: React.ReactNode[] = [];
  for (let index = 0; index < lost; index++) {
    if (frame < departAt(index)) continue;
    departed++;
    const t = prog(frame, departAt(index), departAt(index) + flight, E.inOut);
    travelled += t;
    if (t >= 1) {
      landed++;
      continue;
    }
    const from = {x: mainX, y: stackTop(base, startCoins - index, width)};
    const to = {x: pileX, y: stackTop(base, index + 1, pileWidth)};
    const point = arc(from, to, t, 220);
    const flyWidth = width + (pileWidth - width) * t;
    flyers.push(
      <React.Fragment key={index}>
        <Coin cx={point.x} top={point.y} width={flyWidth} role="money" opacity={1 - t} />
        <Coin cx={point.x} top={point.y} width={flyWidth} role="warning" opacity={t} />
      </React.Fragment>,
    );
  }

  // Der Zähler läuft mit den Münzen, nicht mit der Uhr.
  const drain = travelled / lost;
  const mainCount = Math.min(startCoins * appear, startCoins - departed);
  const originalTop = stackTop(base, startCoins, width);
  const currentTop = stackTop(base, startCoins - departed, width);
  const loss = startValue - endValue;
  const lossSoFar = countValue(0, loss, drain, decimals);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Text x={mainX} y={SAFE.top + 8} size={30} opacity={appear}>{label}</Text>
      <Text x={mainX} y={SAFE.top + 48} size={88} font="number" color={ANIMATION_COLORS.positive} opacity={appear} maxWidth={2 * (mainX - SAFE.left)}>
        {formatValue(countValue(startValue, endValue, drain, decimals), unit, decimals)}
      </Text>
      <Text x={pileX} y={SAFE.top + 8} size={30} color={C.negativeLt} opacity={prog(frame, actionStart, actionStart + 8)} maxWidth={2 * (SAFE.right - pileX)}>
        {drainLabel}
      </Text>
      <Text x={pileX} y={SAFE.top + 48} size={88} font="number" color={C.negativeLt} opacity={prog(frame, actionStart, actionStart + 8)} maxWidth={2 * (SAFE.right - pileX)}>
        {lossSoFar === 0 ? formatValue(0, unit, decimals) : signed(-lossSoFar, unit, decimals)}
      </Text>

      <DashedBox
        x={mainX - width / 2 - 6}
        y={originalTop - 6}
        width={width + 12}
        height={currentTop - originalTop}
        opacity={prog(frame, departAt(0), departAt(0) + 8)}
      />
      <CoinStack cx={mainX} base={base} count={mainCount} width={width} />
      <CoinStack cx={pileX} base={base} count={landed} width={pileWidth} role="warning" />
      {flyers}

      <Text x={mainX} y={originalTop - 46} size={26} color={C.gray} opacity={payoff} maxWidth={2 * (mainX - SAFE.left)}>
        ohne {drainLabel}: {formatValue(startValue, unit, decimals)}
      </Text>
    </div>
  );
};

// ─── 3. Zinseszins beschleunigt ──────────────────────────────────────────────

/**
 * MECHANIK: compound-growth
 * Pro Zeitraum entsteht ein Stapel; die Kurve durch die Spitzen biegt sich
 * nach oben, und jeder Zuwachs ist größer als der davor.
 */
export const CompoundGrowth: React.FC<
  MotionBaseProps & {
    periods?: string[];
    values?: number[];
    unit?: ValueUnit;
    decimals?: number;
  }
> = ({
  durationFrames = 150,
  periods = ['Start', '10 J.', '20 J.', '30 J.'],
  values = [10000, 16000, 26000, 42000],
  unit = '€',
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const {enter, actionStart, actionEnd} = beats(durationFrames);
  const appear = prog(frame, 0, enter);
  const payoff = prog(frame, actionEnd - 2, actionEnd + 12);

  const n = clamp(Math.min(periods.length, values.length), 2, 5);
  const span = SAFE.right - 10 - (SAFE.left + 10);
  const spacing = span / n;
  const centers = Array.from({length: n}, (_, index) => SAFE.left + 10 + spacing * (index + 0.5));
  const width = Math.min(180, Math.round(spacing * 0.84));
  const base = 1180;
  const maxCoins = 22;
  const last = values[n - 1];
  const coins = values.slice(0, n).map((value) => clamp(Math.round((maxCoins * value) / Math.max(last, 1e-9)), 2, maxCoins));
  const tops = coins.map((count) => stackTop(base, count, width));
  const segment = (actionEnd - actionStart) / (n - 1);
  const growth = coins.map((_, index) =>
    index === 0 ? appear : prog(frame, actionStart + (index - 1) * segment, actionStart + index * segment, E.inOut),
  );
  const valueSize = Math.round(Math.min(54, spacing * 0.235));

  const points = centers.map((x, index) => ({x, y: tops[index] - 18}));
  const tangent = (index: number) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(n - 1, index + 1)];
    return {x: (next.x - prev.x) / 2, y: (next.y - prev.y) / 2};
  };

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {centers.map((x, index) => (
        <CoinStack key={index} cx={x} base={base} count={coins[index] * growth[index]} width={width} />
      ))}

      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {points.slice(1).map((point, offset) => {
          const index = offset + 1;
          const from = points[index - 1];
          const t0 = tangent(index - 1);
          const t1 = tangent(index);
          const d = `M ${from.x} ${from.y} C ${from.x + t0.x / 3} ${from.y + t0.y / 3}, ${point.x - t1.x / 3} ${point.y - t1.y / 3}, ${point.x} ${point.y}`;
          return (
            <path
              key={index}
              d={d}
              pathLength={1}
              fill="none"
              stroke={C.goldLt}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={1}
              // Die Kurve wächst mit der Stapelhöhe: Sie beginnt, wenn der neue
              // Stapel die vorige Spitze erreicht, und endet auf seiner Spitze.
              strokeDashoffset={1 - clamp((coins[index] * growth[index] - coins[index - 1]) / Math.max(1, coins[index] - coins[index - 1]), 0, 1)}
              style={{filter: `drop-shadow(0 0 10px ${a(C.gold, 0.45)})`}}
            />
          );
        })}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={10} fill={C.goldLt} opacity={prog(growth[index], 0.85, 1)} />
        ))}
      </svg>

      {centers.slice(1).map((x, offset) => {
        const index = offset + 1;
        return (
          <Text key={index} x={x - 14} y={points[index].y - 50} size={26} align="right" color={ANIMATION_COLORS.positive} opacity={prog(growth[index], 0.7, 1)} maxWidth={spacing * 0.95}>
            {signed(values[index] - values[index - 1], unit, decimals)}
          </Text>
        );
      })}

      {centers.map((x, index) => (
        <React.Fragment key={index}>
          <Text x={x} y={base + 16} size={valueSize} font="number" color={C.goldLt} opacity={prog(growth[index], 0.6, 1)} maxWidth={spacing - 14}>
            {formatValue(values[index], unit, decimals)}
          </Text>
          <Text x={x} y={base + 24 + valueSize} size={26} color={C.gray} opacity={appear} maxWidth={spacing - 14}>{periods[index]}</Text>
        </React.Fragment>
      ))}

      <Text x={SAFE.left + 10} y={SAFE.top + 20} size={132} font="number" align="left" color={C.goldLt} opacity={payoff}>
        ×{(last / Math.max(values[0], 1e-9)).toLocaleString('de-DE', {maximumFractionDigits: 1})}
      </Text>
      <Text x={SAFE.left + 14} y={SAFE.top + 158} size={28} align="left" color={C.gray} opacity={payoff}>vom Startwert</Text>
    </div>
  );
};

// ─── 4. Gleicher Start, anderes Ergebnis ─────────────────────────────────────

type Scenario = {label: string; value: number; tone?: FinanceTone};

/**
 * MECHANIK: scenario-comparison
 * Zwei Stapel beginnen gleich hoch und wachsen unterschiedlich schnell. Am Ende
 * steht die Lücke zwischen den Spitzen als Zahl da. Höhen bleiben proportional
 * zum Betrag, auch beim Start.
 */
export const ScenarioComparison: React.FC<
  MotionBaseProps & {
    startValue?: number;
    startLabel?: string;
    left?: Scenario;
    right?: Scenario;
    unit?: ValueUnit;
    decimals?: number;
    differenceLabel?: string;
  }
> = ({
  durationFrames = 150,
  startValue = 10000,
  startLabel = 'Gleicher Start',
  left = {label: '0,2 % Kosten', value: 91000, tone: 'positive'},
  right = {label: '1,5 % Kosten', value: 69000, tone: 'warning'},
  unit = '€',
  decimals = 0,
  differenceLabel = 'Differenz',
}) => {
  const frame = useCurrentFrame();
  const {enter, actionStart, actionEnd} = beats(durationFrames);
  const appear = prog(frame, 0, enter);
  const build = prog(frame, actionStart, actionEnd, E.inOut);
  const payoff = prog(frame, actionEnd - 2, actionEnd + 12);

  const width = 210;
  const base = 1240;
  const maxCoins = 16;
  const top = Math.max(left.value, right.value, startValue, 1e-9);
  const startCoins = clamp(Math.round((maxCoins * startValue) / top), 1, maxCoins);
  const sides = [
    {...left, x: 270, tone: left.tone ?? 'positive'},
    {...right, x: 810, tone: right.tone ?? 'warning'},
  ].map((side) => {
    const target = clamp(Math.round((maxCoins * side.value) / top), 1, maxCoins);
    return {...side, target, count: Math.min(startCoins * appear, startCoins) + (target - startCoins) * build};
  });
  const tops = sides.map((side) => stackTop(base, side.target, width));
  const highTop = Math.min(...tops);
  const lowTop = Math.max(...tops);
  const startTop = stackTop(base, startCoins, width);
  const gapLeft = sides[0].x + width / 2 + 10;
  const gapRight = sides[1].x - width / 2 - 10;
  const sideWidth = (x: number) => 2 * (x < CX ? x - SAFE.left : SAFE.right - x);
  const startState = appear * (1 - prog(frame, actionStart, actionStart + 14));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {sides.map((side) => (
        <CoinStack key={side.x} cx={side.x} base={base} count={side.count} width={width} role={toneRole(side.tone)} />
      ))}

      <DashedLine x1={gapLeft} x2={gapRight} y={startTop} color={C.whiteSoft} opacity={startState} />
      <Text x={CX} y={startTop - 76} size={28} color={C.whiteSoft} opacity={startState} maxWidth={gapRight - gapLeft}>
        {startLabel}
      </Text>
      <Text x={CX} y={startTop - 40} size={30} color={C.goldLt} opacity={startState} maxWidth={gapRight - gapLeft}>
        {formatValue(startValue, unit, decimals)}
      </Text>

      {sides.map((side) => (
        <React.Fragment key={`label-${side.x}`}>
          <Text x={side.x} y={SAFE.top + 10} size={30} color={C.whiteSoft} opacity={appear} maxWidth={sideWidth(side.x)}>
            {side.label}
          </Text>
          <Text x={side.x} y={SAFE.top + 50} size={88} font="number" color={toneColor(side.tone)} opacity={appear} maxWidth={sideWidth(side.x)}>
            {formatValue(countValue(startValue, side.value, build, decimals), unit, decimals)}
          </Text>
        </React.Fragment>
      ))}

      <DashedLine x1={gapLeft} x2={gapRight} y={highTop} color={C.whiteSoft} opacity={payoff} />
      <DashedLine x1={gapLeft} x2={gapRight} y={lowTop} color={C.whiteSoft} opacity={payoff} />
      <div
        style={{
          position: 'absolute',
          left: CX - 3,
          top: highTop + 6,
          width: 6,
          height: Math.max(0, lowTop - highTop - 12),
          borderRadius: 3,
          background: C.whiteSoft,
          opacity: payoff,
        }}
      />
      <Text x={CX} y={lowTop + 18} size={26} color={C.gray} opacity={payoff}>{differenceLabel}</Text>
      <Text x={CX} y={lowTop + 52} size={64} font="number" color={C.whiteSoft} opacity={payoff} maxWidth={gapRight - gapLeft}>
        {formatValue(Math.abs(left.value - right.value), unit, decimals)}
      </Text>
    </div>
  );
};

// ─── 5. Schuld wird abgetragen ───────────────────────────────────────────────

/**
 * MECHANIK: loan-paydown
 * Jede Rate fliegt als Münze auf den Schuldblock und schlägt eine Scheibe ab.
 * Der gestrichelte Umriss zeigt die Ausgangsschuld.
 */
export const LoanPaydown: React.FC<
  MotionBaseProps & {
    label?: string;
    startDebt?: number;
    endDebt?: number;
    payments?: number;
    paymentLabel?: string;
    paidLabel?: string;
    debtLabel?: string;
    unit?: ValueUnit;
    decimals?: number;
  }
> = ({
  durationFrames = 150,
  label = 'Restschuld',
  debtLabel = 'Kredit',
  startDebt = 28000,
  endDebt = 18500,
  payments = 5,
  paymentLabel = 'Raten',
  paidLabel = 'getilgt',
  unit = '€',
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const {enter, actionStart, actionEnd} = beats(durationFrames);
  const appear = prog(frame, 0, enter);
  const payoff = prog(frame, actionEnd - 2, actionEnd + 12);

  // Bis zu zwölf Münzen; bei mehr Raten trägt jede Münze mehrere, die Beschriftung bleibt exakt.
  const count = clamp(Math.round(payments), 1, 12);
  const blockX = 620;
  const blockWidth = 320;
  const base = 1250;
  const fullHeight = 600;
  const endHeight = fullHeight * clamp(endDebt / Math.max(startDebt, 1e-9), 0.08, 1);
  const slice = (fullHeight - endHeight) / count;
  const sourceX = 260;
  const sourceWidth = 170;
  const flight = Math.max(10, Math.round((actionEnd - actionStart) * 0.22));
  const departAt = (index: number) =>
    actionStart + Math.round((index * (actionEnd - actionStart - flight)) / Math.max(1, count - 1));

  let hits = 0;
  let departed = 0;
  const flyers: React.ReactNode[] = [];
  const chips: React.ReactNode[] = [];
  for (let index = 0; index < count; index++) {
    const start = departAt(index);
    if (frame < start) continue;
    departed++;
    const t = prog(frame, start, start + flight, E.inOut);
    const impact = prog(frame, start + flight, start + flight + 6);
    hits += impact;
    const heightBefore = fullHeight - slice * index;
    if (t < 1) {
      const from = {x: sourceX, y: stackTop(base, count - index, sourceWidth)};
      const to = {x: blockX, y: base - heightBefore - coinHeight(sourceWidth) * 0.6};
      const point = arc(from, to, t, 200);
      flyers.push(<Coin key={index} cx={point.x} top={point.y} width={sourceWidth} />);
    }
    const chip = prog(frame, start + flight, start + flight + 16);
    if (chip > 0 && chip < 1) {
      chips.push(
        <PhysicalObject
          key={`chip-${index}`}
          x={blockX - blockWidth / 2 + chip * 120}
          y={base - heightBefore - chip * 90}
          width={blockWidth}
          height={Math.max(14, slice)}
          depth={10}
          radius={14}
          role="warning"
          opacity={1 - chip}
          rotate={chip * 12}
          grounding={0}
        />,
      );
    }
  }

  const height = fullHeight - slice * hits;
  const paid = hits / count;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Text x={blockX} y={SAFE.top + 8} size={30} opacity={appear}>{label}</Text>
      <Text x={blockX} y={SAFE.top + 48} size={104} font="number" color={C.negativeLt} opacity={appear} maxWidth={2 * (SAFE.right - blockX)}>
        {formatValue(countValue(startDebt, endDebt, paid, decimals), unit, decimals)}
      </Text>
      <Text x={blockX} y={SAFE.top + 162} size={34} color={ANIMATION_COLORS.positive} opacity={payoff} maxWidth={2 * (SAFE.right - blockX)}>
        {signed(endDebt - startDebt, unit, decimals)} {paidLabel}
      </Text>

      <DashedBox
        x={blockX - blockWidth / 2 - 6}
        y={base - fullHeight - 6}
        width={blockWidth + 12}
        height={fullHeight - height + 6}
        opacity={prog(frame, departAt(0) + flight, departAt(0) + flight + 8)}
      />
      <PhysicalObject
        x={blockX - blockWidth / 2}
        y={base - height}
        width={blockWidth}
        height={height}
        depth={22}
        radius={26}
        role="warning"
        opacity={appear}
        scale={0.94 + appear * 0.06}
      >
        {/* Eine Platte pro Rate: man kann abzählen, wie viel noch fehlt. */}
        {Array.from({length: count}, (_, index) => {
          const fromBottom = endHeight + slice * index;
          const offset = height - fromBottom;
          if (offset <= 6 || offset >= height - 6) return null;
          return <div key={index} style={{position: 'absolute', left: 18, right: 18, top: offset - 2, height: 4, borderRadius: 2, background: 'rgba(70,0,12,0.45)'}} />;
        })}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: Math.max(4, Math.min(endHeight / 2, 120) - 18),
            textAlign: 'center',
            fontFamily: FONT.body,
            fontSize: Math.min(34, Math.floor((blockWidth - 40) / (debtLabel.length * 0.75)), endHeight * 0.5),
            display: endHeight < 44 ? 'none' : undefined,
            fontWeight: 900,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {debtLabel.toUpperCase()}
        </div>
      </PhysicalObject>
      {chips}

      <Text x={sourceX} y={base + 22} size={28} color={C.whiteSoft} opacity={appear} maxWidth={2 * (sourceX - SAFE.left)}>
        {Math.round(payments)} {paymentLabel}
      </Text>
      <CoinStack cx={sourceX} base={base} count={Math.min(count * appear, count - departed)} width={sourceWidth} />
      {flyers}
    </div>
  );
};

// ─── 6. Ein Betrag teilt sich auf ────────────────────────────────────────────

type SplitPart = {label: string; share: number; tone?: FinanceTone};
const DEFAULT_SPLIT_PARTS: SplitPart[] = [
  {label: 'Fixkosten', share: 55, tone: 'neutral'},
  {label: 'Leben', share: 25, tone: 'trust'},
  {label: 'Sparen', share: 20, tone: 'positive'},
];

const Jar: React.FC<{x: number; y: number; width: number; height: number; fill: number; color: string}> = ({
  x,
  y,
  width,
  height,
  fill,
  color,
}) => {
  const level = clamp(fill, 0, 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, width, height}}>
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: -22,
          height: 34,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6), rgba(0,0,0,0) 72%)',
          filter: 'blur(6px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '22px 22px 40px 40px',
          border: '4px solid rgba(255,255,255,0.32)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.06))',
          boxShadow: 'inset 0 -18px 30px rgba(0,0,0,0.5), 0 18px 40px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: `${level * 100}%`,
            background: `repeating-linear-gradient(180deg, ${a(color, 0.95)} 0px, ${a(color, 0.95)} 16px, ${a(color, 0.7)} 16px, ${a(color, 0.7)} 20px)`,
            boxShadow: `inset 0 8px 0 ${a('#FFFFFF', 0.28)}, 0 0 30px ${a(color, 0.25)}`,
          }}
        />
        <div style={{position: 'absolute', left: '12%', top: '8%', bottom: '10%', width: '9%', borderRadius: 999, background: 'rgba(255,255,255,0.16)'}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: -8,
          right: -8,
          top: -14,
          height: 24,
          borderRadius: 12,
          background: 'linear-gradient(180deg, #e8efe9, #9fb0a6)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
};

const distributeNotes = (shares: number[], total: number): number[] => {
  const sum = shares.reduce((acc, share) => acc + share, 0) || 1;
  const exact = shares.map((share) => (share / sum) * total);
  const counts = exact.map((value) => Math.max(1, Math.floor(value)));
  let rest = total - counts.reduce((acc, value) => acc + value, 0);
  const order = exact.map((value, index) => ({index, frac: value - Math.floor(value)})).sort((x, y) => y.frac - x.frac);
  for (let cursor = 0; rest > 0; cursor = (cursor + 1) % order.length, rest--) counts[order[cursor].index]++;
  return counts;
};

/**
 * MECHANIK: money-split
 * Scheine wandern aus dem Bündel in die Gläser; jedes Glas füllt sich auf
 * seinen Anteil, bis das Bündel leer ist.
 */
export const MoneySplit: React.FC<
  MotionBaseProps & {
    amount?: number;
    sourceLabel?: string;
    parts?: SplitPart[];
    unit?: ValueUnit;
  }
> = ({durationFrames = 150, amount = 2800, sourceLabel = 'netto', parts = DEFAULT_SPLIT_PARTS, unit = '€'}) => {
  const frame = useCurrentFrame();
  const {enter, actionStart, actionEnd} = beats(durationFrames);
  const appear = prog(frame, 0, enter);

  const visible = parts.slice(0, 4);
  const n = visible.length;
  const jarWidth = n <= 2 ? 240 : n === 3 ? 210 : 165;
  const gap = n <= 2 ? 120 : n === 3 ? 65 : 45;
  const totalWidth = n * jarWidth + (n - 1) * gap;
  const x0 = CX - totalWidth / 2;
  const jarTop = 720;
  const jarHeight = 360;
  const maxShare = Math.max(...visible.map((part) => part.share), 1e-9);
  const centers = visible.map((_, index) => x0 + index * (jarWidth + gap) + jarWidth / 2);

  const noteTotal = 12;
  const perPart = distributeNotes(visible.map((part) => part.share), noteTotal);
  const order: number[] = [];
  const remaining = [...perPart];
  while (order.length < noteTotal) {
    for (let index = 0; index < n; index++) {
      if (remaining[index] > 0) {
        order.push(index);
        remaining[index]--;
      }
    }
  }
  const flight = Math.max(10, Math.round((actionEnd - actionStart) * 0.2));
  const departAt = (index: number) => actionStart + Math.round((index * (actionEnd - actionStart - flight)) / (noteTotal - 1));

  const landed = new Array<number>(n).fill(0);
  let departed = 0;
  const flyers: React.ReactNode[] = [];
  order.forEach((part, index) => {
    const start = departAt(index);
    if (frame < start) return;
    departed++;
    const t = prog(frame, start, start + flight, E.inOut);
    landed[part] += t;
    if (t >= 1) return;
    const point = arc({x: CX, y: 530}, {x: centers[part], y: jarTop - 40}, t, 40);
    flyers.push(
      <PhysicalObject
        key={index}
        x={point.x - 55}
        y={point.y}
        width={110}
        height={50}
        depth={8}
        radius={10}
        role="money"
        rotate={(centers[part] - CX) * 0.03 * 4 * t * (1 - t)}
        opacity={t > 0.85 ? (1 - t) / 0.15 : 1}
        grounding={0}
      />,
    );
  });

  const bundleNotes = 6;
  const bundleCount = Math.min(bundleNotes * appear, bundleNotes * (1 - departed / noteTotal));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: SAFE.top + 4,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          opacity: appear,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontFamily: FONT.title, fontSize: 92, lineHeight: 1, color: C.goldLt, textShadow: '0 4px 14px rgba(0,0,0,0.55)'}}>
          {formatValue(amount, unit)}
        </span>
        <span style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 800, color: C.whiteSoft}}>{sourceLabel}</span>
      </div>

      {Array.from({length: Math.ceil(bundleCount - 1e-6)}, (_, index) => {
        const partial = clamp(bundleCount - index, 0, 1);
        return (
          <PhysicalObject
            key={index}
            x={CX - 160}
            y={660 - 46 - index * 20}
            width={320}
            height={46}
            depth={8}
            radius={12}
            role="money"
            opacity={partial}
            grounding={index === 0 ? 1 : 0}
          />
        );
      })}

      {visible.map((part, index) => {
        const tone = part.tone ?? 'neutral';
        const filled = landed[index] / perPart[index];
        const target = (part.share / maxShare) * 0.86;
        const partAmount = Math.round((amount * part.share) / 100);
        return (
          <React.Fragment key={part.label}>
            <Jar x={centers[index] - jarWidth / 2} y={jarTop} width={jarWidth} height={jarHeight} fill={target * filled} color={tone === 'neutral' ? C.gray : toneColor(tone)} />
            <Text x={centers[index]} y={jarTop + jarHeight + 24} size={n === 4 ? 24 : 28} opacity={appear} maxWidth={jarWidth + gap - 12}>{part.label}</Text>
            <Text x={centers[index]} y={jarTop + jarHeight + 62} size={n === 4 ? 52 : 62} font="number" color={toneColor(tone)} opacity={prog(filled, 0.05, 0.4)} maxWidth={jarWidth + gap - 12}>
              {formatValue(countValue(0, partAmount, filled), unit)}
            </Text>
            <Text x={centers[index]} y={jarTop + jarHeight + (n === 4 ? 122 : 132)} size={24} color={C.gray} opacity={prog(filled, 0.05, 0.4)}>
              {part.share.toLocaleString('de-DE')} %
            </Text>
          </React.Fragment>
        );
      })}

      {flyers}
    </div>
  );
};

export const FINANCE_MOTION_CORE_COMPONENTS = {
  'value-growth': ValueGrowth,
  'value-drain': ValueDrain,
  'compound-growth': CompoundGrowth,
  'scenario-comparison': ScenarioComparison,
  'loan-paydown': LoanPaydown,
  'money-split': MoneySplit,
} as const;

export type FinanceMotionCoreId = keyof typeof FINANCE_MOTION_CORE_COMPONENTS;
