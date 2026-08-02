import React from 'react';
import {Composition} from 'remotion';
import {
  AnimationTestReel,
  FINANCE_ANIMATION_TEST_REEL_DURATION,
} from './AnimationTestReel';

/**
 * Vollständig isolierte Test-Reel-Composition.
 * Sie ist nicht im produktiven FinanzNeoRoot registriert.
 */
export const FinanceAnimationTestReelRoot: React.FC = () => (
  <Composition
    id="FinanceAnimationTestReel"
    component={AnimationTestReel}
    durationInFrames={FINANCE_ANIMATION_TEST_REEL_DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
);
