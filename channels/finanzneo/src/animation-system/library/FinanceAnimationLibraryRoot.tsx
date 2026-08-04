import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_ANIMATION_LIBRARY_GALLERY_DURATION,
  FINANCE_ANIMATION_LIBRARY_ITEM_DURATION,
  FinanceAnimationLibraryGallery,
  FinanceAnimationLibraryOverview,
} from './FinanceAnimationLibraryGallery';

/**
 * Isolierte Bibliotheks-Compositions. Keine Registrierung im produktiven
 * FinanzNeoRoot und keine Aktivierung der globalen Animation-Feature-Flags.
 */
export const FinanceAnimationLibraryRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoAnimationLibraryBatchOne"
      component={FinanceAnimationLibraryGallery}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_GALLERY_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanzNeoAnimationLibraryOverview"
      component={FinanceAnimationLibraryOverview}
      durationInFrames={FINANCE_ANIMATION_LIBRARY_ITEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
