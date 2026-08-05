import React from 'react';
import {Composition} from 'remotion';
import {
  AnimationGallery,
  FINANCE_ANIMATION_CARD_DURATION,
  FINANCE_ANIMATION_GALLERY_DURATION,
} from './AnimationGallery';
import {AnimationFrameMatrix} from './AnimationFrameMatrix';
import {AnimationGalleryOverview} from './AnimationGalleryOverview';

/**
 * Isolierte Galerie-Compositions für die vorbereiteten Finanzanimationen.
 * Diese Root-Datei wird absichtlich nicht im produktiven FinanzNeoRoot registriert.
 */
export const FinanceAnimationGalleryRoot: React.FC = () => (
  <>
    <Composition
      id="FinanceAnimationGallery"
      component={AnimationGallery}
      durationInFrames={FINANCE_ANIMATION_GALLERY_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FinanceAnimationGalleryOverview"
      component={AnimationGalleryOverview}
      durationInFrames={FINANCE_ANIMATION_CARD_DURATION}
      fps={30}
      width={2160}
      height={3840}
    />
    <Composition
      id="FinanceAnimationFrameMatrix"
      component={AnimationFrameMatrix}
      durationInFrames={1}
      fps={30}
      width={2160}
      height={3840}
    />
  </>
);
