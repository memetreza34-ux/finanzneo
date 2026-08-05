import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_REEL_FPS,
  FIRST_FULL_ANIMATION_DURATION,
  FirstFullAnimationReel,
} from './FirstFullAnimationReel';

/**
 * Isolierte Composition für das erste vollständig animierte FinanzNeo-Reel.
 * Sie ist nicht im produktiven FinanzNeoRoot registriert und aktiviert keine
 * globalen Animationsflags.
 */
export const FirstFullAnimationReelRoot: React.FC = () => (
  <Composition
    id="FinanzNeoFirstFullAnimationReel"
    component={FirstFullAnimationReel}
    durationInFrames={FIRST_FULL_ANIMATION_DURATION}
    fps={FINANCE_REEL_FPS}
    width={1080}
    height={1920}
  />
);
