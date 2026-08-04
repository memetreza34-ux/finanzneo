import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_ANIMATION_LIBRARY_BATCH_THREE_DURATION,
  FINANCE_ANIMATION_LIBRARY_BATCH_THREE_ITEM_DURATION,
  FinanceAnimationLibraryBatchThreeGallery,
  FinanceAnimationLibraryBatchThreeOverview,
} from './FinanceAnimationLibraryBatchThreeGallery';

/**
 * Isolierte Vorschau-Compositions für Batch 3. Keine Registrierung im
 * produktiven FinanzNeoRoot und keine Aktivierung globaler Feature-Flags.
 */
export const FinanceAnimationLibraryBatchThreeRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoAnimationLibraryBatchThree"
      component={FinanceAnimationLibraryBatchThreeGallery}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_THREE_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanzNeoAnimationLibraryBatchThreeOverview"
      component={FinanceAnimationLibraryBatchThreeOverview}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_THREE_ITEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
