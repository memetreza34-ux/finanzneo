// Pure, deterministic frame mathematics. No React, timers or mutable animation state.
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
export const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * clamp01(progress);
export const progressAt = (frame: number, start: number, end: number) =>
  end <= start ? Number(frame >= end) : smooth((frame - start) / (end - start));
export const between = (frame: number, start: number, end: number, from: number, to: number) =>
  mix(from, to, progressAt(frame, start, end));

export type RankDatum = {id: string; label: string; color: string; start: number; end: number};
export type AnimatedRank = RankDatum & {
  value: number;
  y: number;
  fromRank: number;
  toRank: number;
};

// Stable ordering: if values tie, keep the input order. Never sort the source array in-place.
export const rankOrder = (values: number[]) =>
  values.map((_, index) => index).sort((a, b) => values[b] - values[a] || a - b);

export const rankPositions = (data: RankDatum[], frame: number, changeStart: number, changeEnd: number, rowHeight: number): AnimatedRank[] => {
  const initial = rankOrder(data.map((item) => item.start));
  const final = rankOrder(data.map((item) => item.end));
  const progress = progressAt(frame, changeStart, changeEnd);
  return data.map((datum, index) => {
    const fromRank = initial.indexOf(index);
    const toRank = final.indexOf(index);
    return {
      ...datum,
      fromRank,
      toRank,
      value: mix(datum.start, datum.end, progress),
      y: mix(fromRank, toRank, progress) * rowHeight,
    };
  });
};

export type DonutPart = {id: string; label: string; value: number; color: string};
export type DonutSlice = DonutPart & {startAngle: number; endAngle: number; share: number};

export const donutSlices = (parts: DonutPart[]): DonutSlice[] => {
  if (!parts.length || parts.some((part) => !Number.isFinite(part.value) || part.value < 0)) {
    throw new Error('Donut requires finite nonnegative values and at least one part.');
  }
  const total = parts.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) throw new Error('Donut total must be positive.');
  let angle = -90;
  return parts.map((part) => {
    const startAngle = angle;
    const share = part.value / total;
    angle += 360 * share;
    return {...part, share, startAngle, endAngle: angle};
  });
};

const pointOnCircle = (cx: number, cy: number, r: number, degrees: number) => {
  const rad = degrees * Math.PI / 180;
  return {x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r};
};

// Arc path for a ring segment. Avoid invalid complete-circle SVG arcs.
export const ringArcPath = (cx: number, cy: number, radius: number, thickness: number, start: number, end: number): string => {
  const extent = Math.max(0, Math.min(359.999, end - start));
  if (extent < 0.005) return '';
  const outer = radius;
  const inner = radius - thickness;
  const p1 = pointOnCircle(cx, cy, outer, start);
  const p2 = pointOnCircle(cx, cy, outer, start + extent);
  const p3 = pointOnCircle(cx, cy, inner, start + extent);
  const p4 = pointOnCircle(cx, cy, inner, start);
  const large = extent > 180 ? 1 : 0;
  return 'M ' + p1.x + ' ' + p1.y +
    ' A ' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + p2.x + ' ' + p2.y +
    ' L ' + p3.x + ' ' + p3.y +
    ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + p4.x + ' ' + p4.y + ' Z';
};

export type TrendPoint = {id: string; label: string; value: number};
export type TrendPosition = {id: string; label: string; value: number; x: number; y: number};

export const trendPositions = (
  data: TrendPoint[], x: number, y: number, width: number, height: number,
  minValue = Math.min(...data.map((d) => d.value), 0),
  maxValue = Math.max(...data.map((d) => d.value), 1),
): TrendPosition[] => {
  if (data.length < 2) throw new Error('Trend requires at least two points.');
  const span = Math.max(1e-9, maxValue - minValue);
  return data.map((datum, index) => ({
    ...datum,
    x: x + index * width / (data.length - 1),
    y: y + height - (datum.value - minValue) / span * height,
  }));
};

// Trace a polyline continuously; last point follows the path rather than jumping between samples.
export const tracePolyline = (points: {x: number; y: number}[], progress: number) => {
  if (!points.length) return [];
  if (points.length === 1) return points;
  const t = clamp01(progress) * (points.length - 1);
  const whole = Math.min(points.length - 2, Math.floor(t));
  const fraction = t - whole;
  return [...points.slice(0, whole + 1), {
    x: mix(points[whole].x, points[whole + 1].x, fraction),
    y: mix(points[whole].y, points[whole + 1].y, fraction),
  }];
};

export const polylinePath = (points: {x: number; y: number}[]) =>
  points.map((point, index) => (index ? 'L ' : 'M ') + point.x + ' ' + point.y).join(' ');

// Cubic Bézier interpolation for moving tokens along a semantic money flow.
export const cubicPoint = (
  from: {x: number; y: number}, c1: {x: number; y: number},
  c2: {x: number; y: number}, to: {x: number; y: number}, progress: number,
) => {
  const t = clamp01(progress), u = 1 - t;
  const b0 = u * u * u, b1 = 3 * u * u * t, b2 = 3 * u * t * t, b3 = t * t * t;
  return {
    x: from.x * b0 + c1.x * b1 + c2.x * b2 + to.x * b3,
    y: from.y * b0 + c1.y * b1 + c2.y * b2 + to.y * b3,
  };
};

export const euro = (value: number) => Math.round(value).toLocaleString('de-DE') + ' €';
