import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_ANIMATION_LIBRARY_BATCH_TWO_DURATION,
  FINANCE_ANIMATION_LIBRARY_BATCH_TWO_ITEM_DURATION,
  FinanceAnimationLibraryBatchTwoGallery,
  FinanceAnimationLibraryBatchTwoOverview,
} from './FinanceAnimationLibraryBatchTwoGallery';

export const FinanceAnimationLibraryBatchTwoRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoAnimationLibraryBatchTwo"
      component={FinanceAnimationLibraryBatchTwoGallery}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_TWO_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanzNeoAnimationLibraryBatchTwoOverview"
      component={FinanceAnimationLibraryBatchTwoOverview}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_TWO_ITEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
