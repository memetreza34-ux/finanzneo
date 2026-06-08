import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, a } from '../tokens';
import { FONT } from '../fonts';

// Donut-/Tortendiagramm — Segmente bauen sich nacheinander auf.
export const Donut: React.FC<{
  cx: number; cy: number; radius?: number; thickness?: number;
  segments: { value: number; color: string; label?: string }[];
  drawStart: number; drawPerSeg?: number; centerLabel?: string; centerSub?: string;
}> = ({ cx, cy, radius = 220, thickness = 60, segments, drawStart, drawPerSeg = 14, centerLabel, centerSub }) => {
  const f = useCurrentFrame();
  const total = segments.reduce((s, x) => s + x.value, 0);
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width={cx * 2} height={cy * 2} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={a(C.gray, 0.12)} strokeWidth={thickness} />
      {segments.map((seg, i) => {
        const frac = seg.value / total;
        const segLen = circ * frac;
        const p = prog(f, drawStart + i * drawPerSeg, drawStart + i * drawPerSeg + drawPerSeg + 6, E.out);
        const dash = `${segLen * p} ${circ}`;
        const rot = (offset / circ) * 360 - 90;
        offset += segLen;
        return (
          <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
            stroke={seg.color} strokeWidth={thickness} strokeDasharray={dash} strokeLinecap="round"
            transform={`rotate(${rot} ${cx} ${cy})`}
            style={{ filter: `drop-shadow(0 0 8px ${a(seg.color, 0.6)})` }} />
        );
      })}
      {centerLabel && (
        <text x={cx} y={cy - 4} textAnchor="middle" fill={C.white} fontSize={radius * 0.42} fontFamily={FONT.title}>{centerLabel}</text>
      )}
      {centerSub && (
        <text x={cx} y={cy + radius * 0.28} textAnchor="middle" fill={C.gray} fontSize={radius * 0.13} fontFamily={FONT.body}>{centerSub}</text>
      )}
    </svg>
  );
};

// Prozent-Kreis (radialer Fortschritt) — z. B. „7 % Rendite".
export const PercentRing: React.FC<{
  cx: number; cy: number; radius?: number; thickness?: number;
  percent: number; color?: string; start: number; end: number; label?: string;
}> = ({ cx, cy, radius = 180, thickness = 28, percent, color = C.accent, start, end, label }) => {
  const f = useCurrentFrame();
  const circ = 2 * Math.PI * radius;
  const p = prog(f, start, end, E.out);
  const shown = percent * p;
  return (
    <svg width={cx * 2} height={cy * 2} style={{ position: 'absolute', left: 0, top: 0 }}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={a(C.gray, 0.14)} strokeWidth={thickness} />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"
        strokeDasharray={`${circ * (shown / 100)} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.7)})` }} />
      <text x={cx} y={cy + radius * 0.12} textAnchor="middle" fill={color} fontSize={radius * 0.55} fontFamily={FONT.title}>{Math.round(shown)}%</text>
      {label && <text x={cx} y={cy + radius * 0.5} textAnchor="middle" fill={C.gray} fontSize={radius * 0.16} fontFamily={FONT.body}>{label}</text>}
    </svg>
  );
};
