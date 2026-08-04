import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_ANIMATION_LIBRARY_BATCH_FIVE_DURATION,
  FINANCE_ANIMATION_LIBRARY_BATCH_FIVE_ITEM_DURATION,
  FinanceAnimationLibraryBatchFiveGallery,
  FinanceAnimationLibraryBatchFiveOverview,
} from './FinanceAnimationLibraryBatchFiveGallery';

/**
 * Isolierte Compositions für Batch 5. Keine Registrierung im produktiven
 * FinanzNeoRoot und keine Aktivierung globaler Feature-Flags.
 */
export const FinanceAnimationLibraryBatchFiveRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoAnimationLibraryBatchFive"
      component={FinanceAnimationLibraryBatchFiveGallery}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_FIVE_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanzNeoAnimationLibraryBatchFiveOverview"
      component={FinanceAnimationLibraryBatchFiveOverview}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_FIVE_ITEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
