import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, a } from '../tokens';

// Statischer dunkler FinanzNeo-Hintergrund (+ optional dezentes, langsames Grid).
// Regel aus Schritt 0: Hintergrund statisch dunkel, Animation ist der Fokus.
export const Background: React.FC<{ grid?: boolean; glow?: boolean }> = ({
  grid = true, glow = true,
}) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{
        background: glow
          ? `radial-gradient(120% 70% at 50% -5%, ${a(C.accent, 0.10)} 0%, transparent 55%),
             radial-gradient(90% 60% at 50% 110%, ${a(C.accentDk, 0.12)} 0%, transparent 50%),
             ${C.bg}`
          : C.bg,
      }} />
      {grid && (
        <AbsoluteFill style={{
          backgroundImage:
            `linear-gradient(${a(C.gray, 0.04)} 1px, transparent 1px),
             linear-gradient(90deg, ${a(C.gray, 0.04)} 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          transform: `translateY(${(f * 0.2) % 90}px)`,
        }} />
      )}
    </>
  );
};

// Vignette — immer ganz oben drauf, damit Ränder dunkler werden.
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(130% 90% at 50% 45%, transparent 42%, rgba(0,0,0,0.62) 100%)',
    pointerEvents: 'none',
  }} />
);

// Dünner Fortschrittsbalken oben (Gold→Grün).
export const Progress: React.FC<{ totalFrames: number; width: number }> = ({ totalFrames, width }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, height: 6,
      width: Math.min((f / totalFrames) * width, width),
      background: `linear-gradient(90deg, ${C.gold}, ${C.accent})`,
      boxShadow: `0 0 14px ${a(C.accent, 0.5)}`, zIndex: 100,
    }} />
  );
};
