import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from 'recharts';
import { C, E, prog, a } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUM-CHARTS (Recharts) — Profi-Qualität, frame-gesteuert.
//  Recharts-Eigenanimation AUS; Animation via Remotion (clip-path reveal / Daten).
// ════════════════════════════════════════════════════════════════════════════

const tickStyle = { fill: C.gray, fontSize: 24, fontFamily: FONT.body } as const;

// ─── AREA / WACHSTUM ──────────────────────────────────────────────────────────
export const AreaPremium: React.FC<{
  data: { x: string | number; y: number }[];
  width: number; height: number; drawStart: number; drawEnd: number;
  color?: string; yMax?: number; hideAxes?: boolean;
}> = ({ data, width, height, drawStart, drawEnd, color = C.accent, yMax, hideAxes = false }) => {
  const f = useCurrentFrame();
  const reveal = prog(f, drawStart, drawEnd, E.inOut);
  const gradId = `areaPrem-${color.replace('#', '')}`;
  return (
    <div style={{ width, height, position: 'relative' }}>
      <div style={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <AreaChart width={width} height={height} data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {!hideAxes && <CartesianGrid stroke={a(C.gray, 0.12)} vertical={false} />}
          {/* Achsen bleiben immer im Layout (gleiche Plot-Geometrie); bei hideAxes nur unsichtbar */}
          <XAxis dataKey="x" tick={hideAxes ? false : tickStyle} axisLine={hideAxes ? false : { stroke: a(C.gray, 0.3) }} tickLine={false} height={30}
            interval="preserveStartEnd" minTickGap={90} />
          <YAxis tick={hideAxes ? false : tickStyle} axisLine={false} tickLine={false}
            domain={yMax ? [0, yMax] : undefined}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} width={70} />
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={5}
            fill={`url(#${gradId})`} isAnimationActive={false}
            dot={false} activeDot={false}
            style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.7)})` }} />
        </AreaChart>
      </div>
    </div>
  );
};

// ─── BALKEN ───────────────────────────────────────────────────────────────────
export const BarsPremium: React.FC<{
  data: { name: string; value: number; color?: string }[];
  width: number; height: number; growStart: number; growEnd: number;
}> = ({ data, width, height, growStart, growEnd }) => {
  const f = useCurrentFrame();
  const p = prog(f, growStart, growEnd, E.out);
  const animated = data.map((d) => ({ ...d, value: d.value * p }));
  return (
    <BarChart width={width} height={height} data={animated} margin={{ top: 30, right: 20, left: 10, bottom: 10 }}>
      <CartesianGrid stroke={a(C.gray, 0.1)} vertical={false} />
      <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 30 }} axisLine={{ stroke: a(C.gray, 0.3) }} tickLine={false} />
      <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v))} width={70} />
      <Bar dataKey="value" radius={[12, 12, 0, 0]} isAnimationActive={false}>
        {animated.map((d, i) => <Cell key={i} fill={d.color ?? C.accent} />)}
      </Bar>
    </BarChart>
  );
};

// ─── DONUT / TORTE ────────────────────────────────────────────────────────────
export const PiePremium: React.FC<{
  data: { name: string; value: number; color: string }[];
  width: number; height: number; drawStart: number; drawEnd: number;
  donut?: boolean; centerLabel?: string;
}> = ({ data, width, height, drawStart, drawEnd, donut = true, centerLabel }) => {
  const f = useCurrentFrame();
  const p = prog(f, drawStart, drawEnd, E.out);
  const r = Math.min(width, height) * 0.42;
  return (
    <div style={{ width, height, position: 'relative' }}>
      <PieChart width={width} height={height}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
          innerRadius={donut ? r * 0.6 : 0} outerRadius={r}
          startAngle={90} endAngle={90 - 360 * p}
          isAnimationActive={false} stroke={C.bg} strokeWidth={4}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
      {centerLabel && donut && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT.title, fontSize: r * 0.42, color: C.white }}>{centerLabel}</div>
      )}
    </div>
  );
};

// ─── RADAR (Profil-Vergleich, z. B. Risiko/Rendite/Liquidität) ────────────────
export const RadarPremium: React.FC<{
  data: { axis: string; value: number }[]; width: number; height: number;
  drawStart: number; drawEnd: number; color?: string;
}> = ({ data, width, height, drawStart, drawEnd, color = C.accent }) => {
  const f = useCurrentFrame();
  const p = prog(f, drawStart, drawEnd, E.out);
  const animated = data.map((d) => ({ ...d, value: d.value * p }));
  return (
    <RadarChart width={width} height={height} data={animated} cx="50%" cy="50%" outerRadius="72%">
      <PolarGrid stroke={a(C.gray, 0.25)} />
      <PolarAngleAxis dataKey="axis" tick={{ ...tickStyle, fontSize: 26 }} />
      <Radar dataKey="value" stroke={color} strokeWidth={4} fill={color} fillOpacity={0.35}
        isAnimationActive={false} />
    </RadarChart>
  );
};
