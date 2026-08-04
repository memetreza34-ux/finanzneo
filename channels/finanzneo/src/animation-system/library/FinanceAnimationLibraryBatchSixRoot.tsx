import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_ANIMATION_LIBRARY_BATCH_SIX_DURATION,
  FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEM_DURATION,
  FinanceAnimationLibraryBatchSixGallery,
  FinanceAnimationLibraryBatchSixOverview,
} from './FinanceAnimationLibraryBatchSixGallery';

/**
 * Isolierte Compositions für Batch 6. Keine Registrierung im produktiven
 * FinanzNeoRoot und keine Aktivierung globaler Feature-Flags.
 */
export const FinanceAnimationLibraryBatchSixRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoAnimationLibraryBatchSix"
      component={FinanceAnimationLibraryBatchSixGallery}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_SIX_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanzNeoAnimationLibraryBatchSixOverview"
      component={FinanceAnimationLibraryBatchSixOverview}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
