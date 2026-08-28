import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, a} from '../tokens';

/**
 * Legacy-compatible background primitive.
 *
 * Reel rule: the canvas is always static pure black. `grid` and `glow` stay in
 * the signature only so older components compile; they are intentionally
 * ignored. No gradient, grid, particles, aurora, vignette or background motion.
 */
export const Background: React.FC<{grid?: boolean; glow?: boolean}> = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}} />
);

/**
 * Vignette is intentionally disabled for reels. Kept as a no-op export for
 * backwards compatibility with older components.
 */
export const Vignette: React.FC = () => null;

// Dünner Fortschrittsbalken oben. Dies ist Inhalt/UI, kein Hintergrundeffekt.
export const Progress: React.FC<{totalFrames: number; width: number}> = ({totalFrames, width}) => {
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
