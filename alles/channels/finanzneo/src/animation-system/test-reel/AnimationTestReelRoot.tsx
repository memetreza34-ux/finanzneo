import React from 'react';
import {Composition} from 'remotion';
import {
  AnimationFallbackPreview,
  AnimationTestReel,
  FINANCE_ANIMATION_TEST_REEL_DURATION,
  FINANCE_ANIMATION_TEST_SCENE_DURATION,
} from './AnimationTestReel';

/**
 * Vollständig isolierte Test-Compositions.
 * Sie sind nicht im produktiven FinanzNeoRoot registriert.
 */
export const FinanceAnimationTestReelRoot: React.FC = () => (
  <>
    <Composition
      id="FinanceAnimationTestReel"
      component={AnimationTestReel}
      durationInFrames={FINANCE_ANIMATION_TEST_REEL_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanceAnimationFallbackPreview"
      component={AnimationFallbackPreview}
      durationInFrames={FINANCE_ANIMATION_TEST_SCENE_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
