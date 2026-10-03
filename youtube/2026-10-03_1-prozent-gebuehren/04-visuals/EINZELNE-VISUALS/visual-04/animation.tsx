import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'dual-growth-curve-divergence-v1';
export const VISUAL_TECHNIQUE_ID = 'svg-dual-line-reveal-v1';
export const COMPOSITION_FAMILY_ID = 'data-viz';

export const ANIMATION_NARRATIVE = {
  START: 'Beide Kostenvarianten starten beim gleichen Vermögen.',
  MECHANISM: 'Zwei Datenkurven werden gleichzeitig über 30 Jahre gezeichnet und driften zunehmend auseinander.',
  RESULT: 'Die günstigere Variante endet bei rund 410.000 Euro, die teurere bei rund 336.000 Euro.',
};

const lowCost = [10000, 35150, 70096, 118653, 186123, 279872, 410135];
const highCost = [10000, 34001, 65818, 107996, 163909, 238030, 336289];
const years = [0, 5, 10, 15, 20, 25, 30];
const maxValue = 430000;

const pathFor = (values: number[]) => values.map((value, index) => {
  const x = 120 + (index / (values.length - 1)) * 1420;
  const y = 720 - (value / maxValue) * 560;
  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
}).join(' ');

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 135], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dash = 2200 * (1 - progress);
  const gapProgress = interpolate(progress, [0.72, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
      <svg width="1680" height="820" viewBox="0 0 1680 820">
        <line x1="120" y1="720" x2="1560" y2="720" stroke="#6E7477" strokeWidth="3" />
        <line x1="120" y1="110" x2="120" y2="720" stroke="#6E7477" strokeWidth="3" />
        {years.map((year, index) => {
          const x = 120 + (index / (years.length - 1)) * 1420;
          return (
            <g key={year}>
              <line x1={x} y1="720" x2={x} y2="734" stroke="#6E7477" strokeWidth="3" />
              <text x={x} y="775" textAnchor="middle" fill="#C8C8C2" fontSize="28">{year}</text>
            </g>
          );
        })}
        <text x="1548" y="812" textAnchor="end" fill="#8F9496" fontSize="26">Jahre</text>
        <path d={pathFor(lowCost)} fill="none" stroke="#1ED79B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2200" strokeDashoffset={dash} />
        <path d={pathFor(highCost)} fill="none" stroke="#FF6B45" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2200" strokeDashoffset={dash} />
        <g opacity={gapProgress}>
          <text x="1540" y="165" textAnchor="end" fill="#1ED79B" fontSize="38" fontWeight="700">0,2 % Kosten ≈ 410.000 €</text>
          <text x="1540" y="315" textAnchor="end" fill="#FF8B70" fontSize="38" fontWeight="700">1,2 % Kosten ≈ 336.000 €</text>
          <line x1="1515" y1="205" x2="1515" y2="292" stroke="#F4F1E8" strokeWidth="4" />
          <text x="1488" y="260" textAnchor="end" fill="#F4F1E8" fontSize="34" fontWeight="700">≈ 74.000 € Unterschied</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
