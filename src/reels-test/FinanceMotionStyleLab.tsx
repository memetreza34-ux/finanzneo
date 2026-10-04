import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {E, FONT, prog} from '../brand';

/**
 * STIL-ERKUNDUNG — keine Produktionskomponente.
 *
 * Dieselbe Aussage in vier Bildwelten, damit man sie nebeneinander vergleichen
 * kann: 10.000 € wachsen bei 7 % p. a. in 30 Jahren auf 76.123 €.
 * Für Reels gilt weiterhin FINANZNEO_SERIES_LOCK (V9, #000000); diese Welten
 * sind bewusst außerhalb davon.
 */

const SEGMENT = 150;
const VALUES = [10000, 19672, 38697, 76123];
const PERIODS = ['Start', '10 J.', '20 J.', '30 J.'];
const YEARLY = Array.from({length: 31}, (_, year) => 10000 * 1.07 ** year);
const MULTIPLE = (VALUES[3] / VALUES[0]).toLocaleString('de-DE', {maximumFractionDigits: 1});

const euro = (value: number) => `${Math.round(value).toLocaleString('de-DE')} €`;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Gemeinsamer Takt: Auftritt, Aufbau Periode für Periode, Ergebnis. */
const useTimeline = () => {
  const frame = useCurrentFrame();
  const appear = prog(frame, 0, 14);
  const growth = VALUES.map((_, index) => (index === 0 ? appear : prog(frame, 24 + (index - 1) * 28, 24 + index * 28, E.inOut)));
  const payoff = prog(frame, 108, 122);
  return {frame, appear, growth, payoff};
};

/** Deterministische Streuung ohne Zufall und ohne Winkelfunktionen. */
const jitter = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280 - 0.5;

const WorldTitle: React.FC<{name: string; color: string; sub: string}> = ({name, color, sub}) => (
  <div style={{position: 'absolute', left: 72, right: 72, top: 150, fontFamily: FONT.body}}>
    <div style={{fontSize: 50, fontWeight: 800, color}}>{name}</div>
    <div style={{marginTop: 10, fontSize: 28, fontWeight: 600, color, opacity: 0.6}}>{sub}</div>
  </div>
);

const SUBTITLE = 'Zinseszins · 10.000 € · 7 % p. a. · 30 Jahre';

// ─── A · Isometrisch ─────────────────────────────────────────────────────────

const S = 66;
const ISO_X = 0.8660254;
const iso = (ox: number, oy: number) => (x: number, y: number, z: number) =>
  [ox + (x - y) * ISO_X * S, oy + (x + y) * 0.5 * S - z * S] as const;
const poly = (points: ReadonlyArray<readonly [number, number]>) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const IsometricWorld: React.FC = () => {
  const {appear, growth, payoff} = useTimeline();
  const P = iso(283, 900);
  const cubes = VALUES.map((value) => clamp(Math.round((12 * value) / VALUES[3]), 2, 12));
  const ink = '#13201A';

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #F4F7F5 0%, #E3EAE6 100%)'}}>
      <WorldTitle name="A · Isometrisch" color={ink} sub={SUBTITLE} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g stroke="#C5D1CA" strokeWidth={2} opacity={appear}>
          {Array.from({length: 15}, (_, index) => {
            const [ax, ay] = P(index - 2, -3, 0);
            const [bx, by] = P(index - 2, 4, 0);
            return <line key={`x${index}`} x1={ax} y1={ay} x2={bx} y2={by} />;
          })}
          {Array.from({length: 8}, (_, index) => {
            const [ax, ay] = P(-2, index - 3, 0);
            const [bx, by] = P(12, index - 3, 0);
            return <line key={`y${index}`} x1={ax} y1={ay} x2={bx} y2={by} />;
          })}
        </g>
        {cubes.map((count, index) => {
          const x0 = index * 3;
          const x1 = x0 + 1.4;
          const y0 = 0;
          const y1 = 1.4;
          const height = count * growth[index] * 0.98;
          if (height <= 0.01) return null;
          const top = [P(x0, y0, height), P(x1, y0, height), P(x1, y1, height), P(x0, y1, height)];
          const left = [P(x0, y1, 0), P(x1, y1, 0), P(x1, y1, height), P(x0, y1, height)];
          const right = [P(x1, y0, 0), P(x1, y1, 0), P(x1, y1, height), P(x1, y0, height)];
          const seams = Array.from({length: Math.floor(height)}, (_, level) => level + 1).filter((level) => level < height);
          return (
            <g key={index}>
              <polygon points={poly(left)} fill="#00B85C" />
              <polygon points={poly(right)} fill="#007A3C" />
              <polygon points={poly(top)} fill="#7BFFC0" />
              {seams.map((level) => {
                const a = P(x0, y1, level);
                const b = P(x1, y1, level);
                const c = P(x1, y0, level);
                return <polyline key={level} points={poly([a, b, c])} fill="none" stroke="rgba(0,40,20,0.28)" strokeWidth={2} />;
              })}
            </g>
          );
        })}
      </svg>
      {cubes.map((count, index) => {
        const [lx, ly] = P(index * 3 + 0.7, 0.7, count);
        const [fx, fy] = P(index * 3 + 1.4, 1.4, 0);
        return (
          <React.Fragment key={index}>
            <div style={{position: 'absolute', left: lx, top: ly - 62, transform: 'translateX(-50%)', fontFamily: FONT.body, fontSize: 30, fontWeight: 800, color: ink, opacity: prog(growth[index], 0.8, 1), whiteSpace: 'nowrap'}}>
              {euro(VALUES[index])}
            </div>
            <div style={{position: 'absolute', left: fx + 6, top: fy + 4, fontFamily: FONT.body, fontSize: 26, fontWeight: 700, color: '#5B6B63', opacity: appear}}>{PERIODS[index]}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 90, top: 380, fontFamily: FONT.title, fontSize: 150, lineHeight: 1, color: ink, opacity: payoff}}>×{MULTIPLE}</div>
    </AbsoluteFill>
  );
};

// ─── B · Editorial ───────────────────────────────────────────────────────────

const EditorialWorld: React.FC = () => {
  const {frame, appear, payoff} = useTimeline();
  const ink = '#1C1A17';
  const accent = '#0E7C66';
  const draw = prog(frame, 24, 108, E.inOut);
  const years = draw * 30;
  const chart = {left: 170, right: 930, top: 760, bottom: 1300, max: 80000};
  const px = (year: number) => chart.left + (year / 30) * (chart.right - chart.left);
  const py = (value: number) => chart.bottom - (value / chart.max) * (chart.bottom - chart.top);
  const whole = Math.floor(years);
  const valueAt = (year: number) => {
    const low = Math.floor(year);
    const high = Math.min(30, low + 1);
    return YEARLY[low] + (YEARLY[high] - YEARLY[low]) * (year - low);
  };
  const points: Array<[number, number]> = [];
  for (let year = 0; year <= whole; year++) points.push([px(year), py(YEARLY[year])]);
  points.push([px(years), py(valueAt(years))]);
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L ${px(years).toFixed(1)} ${chart.bottom} L ${chart.left} ${chart.bottom} Z`;
  const tip = points[points.length - 1];
  const current = years >= 30 ? VALUES[3] : valueAt(years);

  return (
    <AbsoluteFill style={{background: '#F4EEE3'}}>
      <WorldTitle name="B · Editorial" color={ink} sub={SUBTITLE} />
      <div style={{position: 'absolute', left: 170, top: 390, fontFamily: FONT.body, color: ink, opacity: appear}}>
        <div style={{fontSize: 34, fontWeight: 600}}>Aus 10.000 € werden</div>
        <div style={{fontSize: 118, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05}}>{euro(years >= 30 ? VALUES[3] : Math.round(current / 100) * 100)}</div>
        <div style={{fontSize: 30, fontWeight: 600, color: accent, opacity: payoff}}>davon {euro(VALUES[3] - VALUES[0])} Zinsen</div>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[0, 20000, 40000, 60000, 80000].map((value) => (
          <g key={value} opacity={appear}>
            <line x1={chart.left} x2={chart.right} y1={py(value)} y2={py(value)} stroke={value === 0 ? ink : '#D8CFBF'} strokeWidth={value === 0 ? 3 : 2} />
            <text x={chart.left - 14} y={py(value) + 8} textAnchor="end" fontFamily={FONT.body} fontSize={24} fontWeight={600} fill="#8A8478">
              {value === 0 ? '0' : `${value / 1000}k`}
            </text>
          </g>
        ))}
        {[0, 10, 20, 30].map((year) => (
          <text key={year} x={px(year)} y={chart.bottom + 44} textAnchor="middle" fontFamily={FONT.body} fontSize={24} fontWeight={600} fill="#8A8478" opacity={appear}>
            {year === 0 ? 'heute' : `${year} J.`}
          </text>
        ))}
        <path d={area} fill={accent} opacity={0.12} />
        <path d={line} fill="none" stroke={accent} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        {[10, 20].map((year) => (
          <g key={year} opacity={prog(years, year, year + 1.5)}>
            <circle cx={px(year)} cy={py(YEARLY[year])} r={9} fill={accent} />
            <text x={px(year) - 16} y={py(YEARLY[year]) - 22} textAnchor="end" fontFamily={FONT.body} fontSize={26} fontWeight={800} fill={ink}>
              {euro(YEARLY[year])}
            </text>
          </g>
        ))}
        <circle cx={tip[0]} cy={tip[1]} r={16} fill="#F4EEE3" stroke="#E4572E" strokeWidth={7} opacity={draw > 0 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};

// ─── C · Neon ────────────────────────────────────────────────────────────────

const NeonWorld: React.FC = () => {
  const {appear, growth, payoff} = useTimeline();
  const cyan = '#22D3EE';
  const magenta = '#FF2BD6';
  const base = 1190;
  const maxHeight = 640;
  const centers = [250, 420, 590, 760];

  return (
    <AbsoluteFill style={{background: '#05010D'}}>
      <WorldTitle name="C · Neon" color="#F5E9FF" sub={SUBTITLE} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="neon-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cyan} stopOpacity={0.45} />
            <stop offset="100%" stopColor={magenta} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <g opacity={appear * 0.55} stroke={magenta} strokeWidth={2}>
          {Array.from({length: 8}, (_, index) => {
            const y = base + 12 + index * index * 7;
            return <line key={`h${index}`} x1={0} x2={1080} y1={y} y2={y} />;
          })}
          {Array.from({length: 13}, (_, index) => {
            const x = -300 + index * 140;
            return <line key={`v${index}`} x1={540 + (x - 540) * 0.15} y1={base + 12} x2={x} y2={base + 420} />;
          })}
        </g>
        <line x1={0} x2={1080} y1={base + 12} y2={base + 12} stroke={cyan} strokeWidth={3} opacity={appear} style={{filter: `drop-shadow(0 0 10px ${cyan})`}} />
        {VALUES.map((value, index) => {
          const height = (maxHeight * value * growth[index]) / VALUES[3];
          if (height < 2) return null;
          return (
            <rect
              key={index}
              x={centers[index] - 52}
              y={base - height}
              width={104}
              height={height}
              rx={14}
              fill="url(#neon-fill)"
              stroke={cyan}
              strokeWidth={5}
              style={{filter: `drop-shadow(0 0 12px ${cyan}) drop-shadow(0 0 28px ${cyan})`}}
            />
          );
        })}
      </svg>
      {VALUES.map((value, index) => (
        <React.Fragment key={index}>
          <div
            style={{
              position: 'absolute',
              left: centers[index],
              top: base - (maxHeight * value) / VALUES[3] - 70,
              transform: 'translateX(-50%)',
              fontFamily: FONT.title,
              fontSize: 54,
              color: '#E0FBFF',
              textShadow: `0 0 12px ${cyan}, 0 0 24px ${cyan}`,
              opacity: prog(growth[index], 0.8, 1),
              whiteSpace: 'nowrap',
            }}
          >
            {euro(value)}
          </div>
          <div style={{position: 'absolute', left: centers[index], top: base + 34, transform: 'translateX(-50%)', fontFamily: FONT.body, fontSize: 24, fontWeight: 800, letterSpacing: 4, color: magenta, opacity: appear}}>
            {PERIODS[index].toUpperCase()}
          </div>
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: 90, top: 390, fontFamily: FONT.title, fontSize: 180, lineHeight: 1, color: '#FFE3FA', textShadow: `0 0 18px ${magenta}, 0 0 40px ${magenta}`, opacity: payoff}}>
        ×{MULTIPLE}
      </div>
    </AbsoluteFill>
  );
};

// ─── D · Papier ──────────────────────────────────────────────────────────────

const PaperTag: React.FC<{x: number; y: number; children: React.ReactNode; rotate: number; opacity: number; color?: string}> = ({
  x,
  y,
  children,
  rotate,
  opacity,
  color = '#FFFDF7',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translateX(-50%) rotate(${rotate}deg)`,
      opacity,
      padding: '12px 18px 10px',
      background: color,
      boxShadow: '0 4px 0 rgba(80,60,30,0.18), 0 10px 18px rgba(80,60,30,0.18)',
      fontFamily: FONT.body,
      fontSize: 28,
      fontWeight: 800,
      color: '#3B3226',
      whiteSpace: 'nowrap',
    }}
  >
    <div style={{position: 'absolute', left: '50%', top: -12, width: 64, height: 22, transform: 'translateX(-50%) rotate(-3deg)', background: 'rgba(255,240,170,0.75)'}} />
    {children}
  </div>
);

const PaperWorld: React.FC = () => {
  const {appear, growth, payoff} = useTimeline();
  const base = 1220;
  const centers = [250, 430, 610, 790];
  const strips = VALUES.map((value) => clamp(Math.round((14 * value) / VALUES[3]), 2, 14));
  const colors = ['#9ED9B8', '#86CFA6', '#6FC493', '#58B880'];

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #F1E8D6 0%, #E2D5BC 100%)'}}>
      <WorldTitle name="D · Papier" color="#3B3226" sub={SUBTITLE} />
      <div style={{position: 'absolute', left: 90, right: 90, top: base, height: 10, background: '#CDBB98', borderRadius: 5, opacity: appear}} />
      {strips.map((count, column) => {
        const visible = count * growth[column];
        return Array.from({length: Math.ceil(visible - 1e-6)}, (_, level) => {
          const land = clamp(visible - level, 0, 1);
          const drop = prog(land, 0, 1, E.spring);
          return (
            <div
              key={`${column}-${level}`}
              style={{
                position: 'absolute',
                left: centers[column] - 78 + jitter(column * 31 + level) * 10,
                top: base - 44 * (level + 1) - (1 - drop) * 70,
                width: 156,
                height: 40,
                borderRadius: 4,
                background: colors[column],
                border: '2px solid rgba(40,90,60,0.25)',
                boxShadow: '0 3px 0 rgba(60,80,50,0.25), 0 6px 10px rgba(60,50,30,0.15)',
                transform: `rotate(${jitter(column * 17 + level * 7) * 6}deg)`,
                opacity: clamp(land * 3, 0, 1),
              }}
            >
              <div style={{position: 'absolute', left: 14, top: 9, width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(40,90,60,0.35)'}} />
            </div>
          );
        });
      })}
      {strips.map((count, column) => (
        <React.Fragment key={column}>
          <PaperTag x={centers[column]} y={base - 44 * count - 82} rotate={jitter(column * 13) * 8} opacity={prog(growth[column], 0.8, 1)}>
            {euro(VALUES[column])}
          </PaperTag>
          <div style={{position: 'absolute', left: centers[column], top: base + 30, transform: 'translateX(-50%)', fontFamily: FONT.body, fontSize: 26, fontWeight: 800, color: '#7A6A52', opacity: appear}}>
            {PERIODS[column]}
          </div>
        </React.Fragment>
      ))}
      <PaperTag x={250} y={420} rotate={-4} opacity={payoff} color="#F28B6B">
        <span style={{fontFamily: FONT.title, fontSize: 120, fontWeight: 400, color: '#FFFDF7', lineHeight: 1}}>×{MULTIPLE}</span>
      </PaperTag>
    </AbsoluteFill>
  );
};

const WORLDS = [IsometricWorld, EditorialWorld, NeonWorld, PaperWorld];

export const FINANCE_MOTION_STYLE_LAB_FRAMES = WORLDS.length * SEGMENT;

export const FinanceMotionStyleLab: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {WORLDS.map((World, index) => (
      <Sequence key={index} from={index * SEGMENT} durationInFrames={SEGMENT}>
        <World />
      </Sequence>
    ))}
  </AbsoluteFill>
);
