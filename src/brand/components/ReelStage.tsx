import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {REEL_STYLE, prog} from '../tokens';

const T = REEL_STYLE.transition;
const V = REEL_STYLE.visual;

export const VISUAL_TOP = V.top;
export const VISUAL_BOTTOM = V.bottom;
export const VISUAL_CENTER_Y = (V.top + V.bottom) / 2;

/**
 * Szenenwechsel für Reels — kurzer Continuity-Schnitt statt Blende.
 *
 * Die Szene setzt in wenigen Frames sauber ein, ohne die audio-synchronisierten
 * Startframes der Folgeszenen zu verschieben. Bewusst kurz: träge Blenden
 * lassen Reels langsam wirken. Fade-to-black ist repo-weit verboten
 * (REEL_STYLE.transition.fadeToBlackForbidden).
 */
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
 * Gemeinsame Bühne für Erklär-Animationen.
 *
 * Animationen sind meist vertikal kompakt aufgebaut und ließen in der
 * Visualzone (Y 390–1560) viel toten Raum stehen — die Grafik wirkte klein und
 * verloren. Der Stage-Wrapper zentriert auf der Visualzone und skaliert
 * einheitlich hoch, ohne dass jede Animation ihr Layout neu rechnen muss.
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
      // Skalierung darf Beschriftungen nie seitlich aus dem Bild schieben.
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);
