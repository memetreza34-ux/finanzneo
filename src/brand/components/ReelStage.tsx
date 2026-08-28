import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {REEL_STYLE, prog} from '../tokens';

const T = REEL_STYLE.transition;
const V = REEL_STYLE.visual;

export const VISUAL_TOP = V.top;
export const VISUAL_BOTTOM = V.bottom;
export const VISUAL_CENTER_Y = (V.top + V.bottom) / 2;

/** Kurzer V5-Continuity-Schnitt statt träger Blende. */
export const SceneTransition: React.FC<{
  durationFrames: number;
  children: React.ReactNode;
}> = ({durationFrames, children}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, 0, T.continuityFrames);
  const leave = prog(
    frame,
    Math.max(0, durationFrames - T.continuityFrames),
    Math.max(1, durationFrames - 1),
  );
  const opacity = Math.min(1, 0.92 + enter * 0.08 - leave * 0.04);
  const translateY = (1 - enter) * 4 - leave * 2;

  return (
    <AbsoluteFill style={{opacity, transform: `translateY(${translateY}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Gemeinsame transparente Bühne für Erklär-Animationen.
 * Position und Skalierung leiten sich ausschließlich aus REEL_STYLE.visual
 * (V5 aktuell Y320–1480) ab. Der Stage erzeugt keinen Hintergrund; der einzige
 * Reel-Hintergrund ist zentral statisch #000000.
 */
export const AnimationStage: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({children, scale = V.animationScale}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transform: `scale(${scale})`,
      transformOrigin: `50% ${VISUAL_CENTER_Y}px`,
      overflow: 'hidden',
      background: 'transparent',
    }}
  >
    {children}
  </div>
);
