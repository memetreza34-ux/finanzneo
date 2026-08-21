import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, a } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  WACHSTUMSKURVE (Line/Area Chart)
// ════════════════════════════════════════════════════════════════════════════
export const GrowthChart: React.FC<{
  width: number; height: number;
  box?: { left: number; right: number; top: number; bottom: number };
  maxX?: number; maxY?: number;
  fn?: (x: number) => number;            // y-Wert pro x (0..maxX)
  drawStart: number; drawEnd: number;    // Frames für das Zeichnen
  xLabels?: { x: number; label: string }[];
  yLabels?: { y: number; label: string }[];
  markers?: { x: number; appear: number; color?: string; label?: string; sub?: string }[];
  color?: string;
}> = ({
  width, height, box, maxX = 30, maxY = 120000, fn,
  drawStart, drawEnd, xLabels = [], yLabels = [], markers = [], color = C.accent,
}) => {
  const f = useCurrentFrame();
  const b = box ?? { left: 130, right: width - 70, top: height * 0.42, bottom: height * 0.8 };
  const cw = b.right - b.left, ch = b.bottom - b.top;
  const grow = fn ?? ((x: number) => maxY * Math.pow(x / maxX, 2.1));
  const tx = (x: number) => b.left + (x / maxX) * cw;
  const ty = (y: number) => b.bottom - (y / maxY) * ch;
  const draw = prog(f, drawStart, drawEnd, E.inOut);

  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) { const t = i / 120, x = t * maxX * draw; pts.push(`${tx(x).toFixed(1)},${ty(grow(x)).toFixed(1)}`); }
  const path = `M ${pts.join(' L ')}`;
  const area = `M ${b.left},${b.bottom} L ${pts.join(' L ')} L ${tx(maxX * draw)},${b.bottom} Z`;
  const gid = `fnArea_${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* axes */}
      <line x1={b.left} y1={b.top} x2={b.left} y2={b.bottom} stroke={C.gray} strokeWidth={2} opacity={0.3} />
      <line x1={b.left} y1={b.bottom} x2={b.right} y2={b.bottom} stroke={C.gray} strokeWidth={2} opacity={0.4} />
      {yLabels.map((yl, i) => (
        <g key={i}>
          <line x1={b.left} y1={ty(yl.y)} x2={b.right} y2={ty(yl.y)} stroke={C.gray} strokeWidth={1} strokeDasharray="14 9" opacity={0.15} />
          <text x={b.left - 14} y={ty(yl.y) + 6} textAnchor="end" fill={C.gray} fontSize={28} fontFamily={FONT.body} opacity={0.6}>{yl.label}</text>
        </g>
      ))}
      {xLabels.map((xl, i) => (
        <text key={i} x={tx(xl.x)} y={b.bottom + 46} textAnchor="middle" fill={C.gray} fontSize={30} fontFamily={FONT.body} opacity={0.65}>{xl.label}</text>
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={9} style={{ filter: `drop-shadow(0 0 12px ${a(color, 0.8)})` }} />
      {markers.map((m, i) => {
        const ap = prog(f, m.appear, m.appear + 12, E.spring);
        if (ap <= 0) return null;
        const mc = m.color ?? color;
        const mx = tx(m.x), my = ty(grow(m.x));
        const pulse = 1 + Math.sin(f * 0.28) * 0.12;
        const lx = Math.min(width - 326, Math.max(12, mx - 155));
        return (
          <g key={i} opacity={ap}>
            <line x1={mx} y1={b.bottom} x2={mx} y2={my} stroke={mc} strokeWidth={2.5} strokeDasharray="13 8" opacity={0.6} />
            <circle cx={mx} cy={my} r={20 * pulse} fill={mc} opacity={0.2} />
            <circle cx={mx} cy={my} r={12} fill={mc} style={{ filter: `drop-shadow(0 0 14px ${mc})` }} />
            {m.label && (
              <g transform={`translate(${lx}, ${my - 124})`}>
                <rect width={310} height={108} rx={18} fill={C.bgDeep} opacity={0.92} />
                <rect width={310} height={108} rx={18} fill="none" stroke={mc} strokeWidth={2.5} />
                <text x={155} y={50} textAnchor="middle" fill={mc} fontSize={48} fontFamily={FONT.title} letterSpacing={1}>{m.label}</text>
                {m.sub && <text x={155} y={86} textAnchor="middle" fill={C.gray} fontSize={26} fontFamily={FONT.body}>{m.sub}</text>}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  BALKENDIAGRAMM (Vergleich)
// ════════════════════════════════════════════════════════════════════════════
export const Bars: React.FC<{
  width: number; baseY: number; maxBarH: number; barW?: number;
  items: { x: number; valuePct: number; color: string; label: string; topText?: string; appear: number }[];
}> = ({ width, baseY, maxBarH, barW = 240, items }) => {
  const f = useCurrentFrame();
  return (
    <svg width={width} height={baseY + 120} style={{ position: 'absolute', left: 0, top: 0 }}>
      {items.map((it, i) => {
        const p = prog(f, it.appear, it.appear + 30, E.out);
        const h = maxBarH * it.valuePct * p;
        const gid = `bar_${i}`;
        return (
          <g key={i}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={it.color} /><stop offset="100%" stopColor={it.color} stopOpacity="0.65" />
              </linearGradient>
            </defs>
            <rect x={it.x + 8} y={baseY - h + 8} width={barW} height={h} rx={18} fill="rgba(0,0,0,0.4)" />
            <rect x={it.x} y={baseY - h} width={barW} height={h} rx={18} fill={`url(#${gid})`} />
            <rect x={it.x + 14} y={baseY - h + 12} width={barW * 0.2} height={h * 0.78} rx={9} fill="white" opacity={0.1} />
            {it.topText && p > 0.15 && (
              <text x={it.x + barW / 2} y={baseY - h + 66} textAnchor="middle" fill={C.white}
                fontSize={56} fontFamily={FONT.title} letterSpacing={1}
                style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.9))' }}>{it.topText}</text>
            )}
            <text x={it.x + barW / 2} y={baseY + 56} textAnchor="middle" fill={it.color}
              fontSize={42} fontFamily={FONT.body} fontWeight={700}>{it.label}</text>
          </g>
        );
      })}
    </svg>
  );
};
