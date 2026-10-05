import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'personal-reserve-context-drivers';
export const VISUAL_TECHNIQUE_ID = 'concrete-life-factor-reveal';
export const COMPOSITION_FAMILY_ID = 'editorial-context-explainer';

export const ANIMATION_NARRATIVE = {
  START: 'Nicht jeder Alltag hat dieselben laufenden Verpflichtungen.',
  MECHANISM: 'Wohnen, Mobilität und Familie erscheinen als drei konkrete Lebensfaktoren.',
  RESULT: 'Die passende Reserve hängt von der eigenen Situation ab.',
};

const reveal = (frame: number, start: number) =>
  interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const LineIcon: React.FC<{kind: 'home' | 'mobility' | 'family'; progress: number}> = ({kind, progress}) => {
  const common = {
    fill: 'none',
    stroke: '#F4F0E8',
    strokeWidth: 5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    opacity: progress,
  };
  if (kind === 'home') {
    return (
      <svg width={180} height={150} viewBox="0 0 180 150">
        <path {...common} d="M28 72 L90 24 L152 72 V132 H28 Z" />
        <path {...common} d="M70 132 V88 H110 V132" />
        <path {...common} d="M46 52 V30 H68" />
      </svg>
    );
  }
  if (kind === 'mobility') {
    return (
      <svg width={190} height={150} viewBox="0 0 190 150">
        <path {...common} d="M34 92 L48 58 H142 L158 92" />
        <path {...common} d="M24 92 H166 V124 H24 Z" />
        <circle {...common} cx="58" cy="124" r="15" />
        <circle {...common} cx="132" cy="124" r="15" />
        <path {...common} d="M66 58 L78 38 H112 L124 58" />
      </svg>
    );
  }
  return (
    <svg width={180} height={150} viewBox="0 0 180 150">
      <circle {...common} cx="90" cy="38" r="20" />
      <path {...common} d="M58 132 V94 C58 72 70 60 90 60 C110 60 122 72 122 94 V132" />
      <path {...common} d="M58 92 L32 116 M122 92 L148 116" />
      <path {...common} d="M72 132 L62 146 M108 132 L118 146" />
    </svg>
  );
};

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const first = reveal(frame, 4);
  const second = reveal(frame, 28);
  const third = reveal(frame, 52);
  const result = reveal(frame, 78);

  const items = [
    {kind: 'home' as const, label: 'Wohnen & Fixkosten', p: first},
    {kind: 'mobility' as const, label: 'Mobilität', p: second},
    {kind: 'family' as const, label: 'Familie & Verpflichtungen', p: third},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial, sans-serif', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: 112, fontSize: 54, fontWeight: 700}}>Was bestimmt deinen Reservebedarf?</div>
      <div style={{display: 'flex', gap: 130, alignItems: 'flex-start', marginTop: 30}}>
        {items.map((item) => (
          <div key={item.label} style={{width: 360, textAlign: 'center', opacity: item.p, transform: `translateY(${(1 - item.p) * 24}px)`}}>
            <div style={{height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><LineIcon kind={item.kind} progress={item.p} /></div>
            <div style={{fontSize: 34, lineHeight: 1.2, color: '#D8D4CC'}}>{item.label}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 118, fontSize: 58, fontWeight: 800, color: '#2FCB8B', opacity: result, transform: `translateY(${(1 - result) * 18}px)`}}>
        Deine Reserve ist individuell.
      </div>
    </AbsoluteFill>
  );
};
