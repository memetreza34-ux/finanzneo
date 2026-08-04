import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_DURATION,
  FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION,
  FinanceAnimationLibraryBatchFourGallery,
  FinanceAnimationLibraryBatchFourOverview,
} from './FinanceAnimationLibraryBatchFourGallery';

/**
 * Isolierte Compositions für Batch 4. Keine Registrierung im produktiven
 * FinanzNeoRoot und keine Aktivierung globaler Feature-Flags.
 */
export const FinanceAnimationLibraryBatchFourRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoAnimationLibraryBatchFour"
      component={FinanceAnimationLibraryBatchFourGallery}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanzNeoAnimationLibraryBatchFourOverview"
      component={FinanceAnimationLibraryBatchFourOverview}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
