import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';

// ─── MINDMAP — Zentral-Knoten + Äste radial ───────────────────────────────────
export const Mindmap: React.FC<{
  width: number; height: number; center: string;
  nodes: { label: string; appear: number; color?: string }[];
  centerAt?: number; radius?: number;
}> = ({ width, height, center, nodes, centerAt = 0, radius = 360 }) => {
  const f = useCurrentFrame();
  const cx = width / 2, cy = height / 2;
  const cP = prog(f, centerAt, centerAt + 14, E.spring);
  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      {nodes.map((n, i) => {
        const ang = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const nx = cx + Math.cos(ang) * radius;
        const ny = cy + Math.sin(ang) * radius;
        const p = prog(f, n.appear, n.appear + 12, E.spring);
        const col = n.color ?? C.accent;
        const ex = cx + (nx - cx) * E.out(p);
        const ey = cy + (ny - cy) * E.out(p);
        return (
          <g key={i} opacity={p}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={a(col, 0.5)} strokeWidth={4} />
            <g transform={`translate(${ex},${ey})`}>
              <rect x={-130} y={-44} width={260} height={88} rx={44} fill={a(col, 0.16)} stroke={col} strokeWidth={2.5} />
              <text x={0} y={8} textAnchor="middle" fill={C.white} fontSize={34} fontFamily={FONT.body} fontWeight={700}>{n.label}</text>
            </g>
          </g>
        );
      })}
      {/* center */}
      <g transform={`translate(${cx},${cy}) scale(${cP})`}>
        <circle r={110} fill={C.accent} opacity={0.18} />
        <circle r={92} fill={C.bgDeep} stroke={C.accent} strokeWidth={3} />
        <text y={10} textAnchor="middle" fill={C.accentLt} fontSize={40} fontFamily={FONT.title}>{center}</text>
      </g>
    </svg>
  );
};

// ─── FLOWCHART — Boxen mit Pfeilen (Prozess) ──────────────────────────────────
export const Flowchart: React.FC<{
  steps: { label: string; appear: number; color?: string }[];
  width: number; y: number; vertical?: boolean;
}> = ({ steps, width, y, vertical = false }) => {
  const f = useCurrentFrame();
  const n = steps.length;
  const boxW = vertical ? 520 : Math.min(300, (width - 120) / n - 40);
  const boxH = 120;
  return (
    <svg width={width} height={vertical ? n * 200 : 360} style={{ position: 'absolute', left: 0, top: y }}>
      {steps.map((s, i) => {
        const p = prog(f, s.appear, s.appear + 12, E.spring);
        const col = s.color ?? C.accent;
        const bx = vertical ? width / 2 - boxW / 2 : 80 + i * ((width - 160) / n);
        const by = vertical ? i * 200 : 100;
        const arrP = prog(f, s.appear + 8, s.appear + 18, E.out);
        return (
          <g key={i}>
            {i > 0 && (
              vertical
                ? <line x1={width / 2} y1={by - 80} x2={width / 2} y2={by} stroke={C.accent}
                    strokeWidth={5} markerEnd="url(#fcA)" opacity={arrP} strokeDasharray={`${arrP * 80} 80`} />
                : <line x1={bx - ((width - 160) / n) + boxW} y1={by + boxH / 2} x2={bx} y2={by + boxH / 2}
                    stroke={C.accent} strokeWidth={5} markerEnd="url(#fcA)" opacity={arrP} strokeDasharray={`${arrP * 60} 60`} />
            )}
            <g opacity={p} transform={`translate(0, ${lerpF(f, 20, 0, s.appear, s.appear + 12)})`}>
              <rect x={bx} y={by} width={boxW} height={boxH} rx={20} fill={a(col, 0.16)} stroke={col} strokeWidth={2.5} />
              <text x={bx + boxW / 2} y={by + boxH / 2 + 10} textAnchor="middle" fill={C.white}
                fontSize={34} fontFamily={FONT.body} fontWeight={700}>{s.label}</text>
            </g>
          </g>
        );
      })}
      <defs>
        <marker id="fcA" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <polygon points="0 0, 10 4, 0 8" fill={C.accent} /></marker>
      </defs>
    </svg>
  );
};

// ─── PYRAMIDE / FUNNEL — Ebenen (Hierarchie) ──────────────────────────────────
export const Pyramid: React.FC<{
  levels: { label: string; appear: number; color?: string }[];
  cx: number; topY: number; baseW?: number; levelH?: number; funnel?: boolean;
}> = ({ levels, cx, topY, baseW = 720, levelH = 130, funnel = false }) => {
  const f = useCurrentFrame();
  const n = levels.length;
  return (
    <svg width={cx * 2} height={topY + n * (levelH + 14) + 40} style={{ position: 'absolute', left: 0, top: 0 }}>
      {levels.map((lv, i) => {
        const idx = funnel ? i : (n - 1 - i);     // pyramid: schmal oben
        const wTop = baseW * ((idx + 0.4) / n);
        const wBot = baseW * ((idx + 1.4) / n);
        const yy = topY + i * (levelH + 14);
        const p = prog(f, lv.appear, lv.appear + 12, E.spring);
        const col = lv.color ?? [C.accent, C.blue, C.gold, C.purple, C.negative][i % 5];
        const pts = `${cx - wTop / 2},${yy} ${cx + wTop / 2},${yy} ${cx + wBot / 2},${yy + levelH} ${cx - wBot / 2},${yy + levelH}`;
        return (
          <g key={i} opacity={p} transform={`scale(${0.9 + p * 0.1})`} style={{ transformOrigin: `${cx}px ${yy + levelH / 2}px` }}>
            <polygon points={pts} fill={a(col, 0.7)} stroke={col} strokeWidth={2} />
            <text x={cx} y={yy + levelH / 2 + 12} textAnchor="middle" fill={C.white} fontSize={38} fontFamily={FONT.body} fontWeight={800}>{lv.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── KREISLAUF / CYCLE — Knoten im Kreis mit Pfeilen (Zinseszins) ─────────────
export const Cycle: React.FC<{
  width: number; height: number; nodes: { label: string; appear: number }[];
  radius?: number; color?: string; centerLabel?: string;
}> = ({ width, height, nodes, radius = 320, color = C.accent, centerLabel }) => {
  const f = useCurrentFrame();
  const cx = width / 2, cy = height / 2;
  const n = nodes.length;
  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      {/* loop arrows */}
      {nodes.map((_, i) => {
        const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
        const x0 = cx + Math.cos(a0) * radius, y0 = cy + Math.sin(a0) * radius;
        const x1 = cx + Math.cos(a1) * radius, y1 = cy + Math.sin(a1) * radius;
        const p = prog(f, nodes[i].appear + 6, nodes[i].appear + 18, E.out);
        return <path key={`a${i}`} d={`M ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`}
          fill="none" stroke={a(color, 0.5)} strokeWidth={5} markerEnd="url(#cyA)"
          opacity={p} strokeDasharray={`${p * radius} ${radius * 3}`} />;
      })}
      {nodes.map((nd, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const nx = cx + Math.cos(ang) * radius, ny = cy + Math.sin(ang) * radius;
        const p = prog(f, nd.appear, nd.appear + 12, E.spring);
        return (
          <g key={i} opacity={p} transform={`translate(${nx},${ny}) scale(${p})`}>
            <circle r={78} fill={a(color, 0.16)} stroke={color} strokeWidth={2.5} />
            <text y={8} textAnchor="middle" fill={C.white} fontSize={30} fontFamily={FONT.body} fontWeight={700}>{nd.label}</text>
          </g>
        );
      })}
      {centerLabel && <text x={cx} y={cy + 14} textAnchor="middle" fill={C.accentLt} fontSize={48} fontFamily={FONT.title}>{centerLabel}</text>}
      <defs>
        <marker id="cyA" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <polygon points="0 0, 10 4, 0 8" fill={color} /></marker>
      </defs>
    </svg>
  );
};
