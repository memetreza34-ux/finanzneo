import React from 'react';
import {Composition} from 'remotion';
import {AnimationGallery, FINANCE_ANIMATION_GALLERY_DURATION} from './AnimationGallery';

/**
 * Isolierte Galerie-Composition für die vorbereiteten Finanzanimationen.
 * Diese Root-Datei wird absichtlich nicht im produktiven FinanzNeoRoot registriert.
 */
export const FinanceAnimationGalleryRoot: React.FC = () => (
  <Composition
    id="FinanceAnimationGallery"
    component={AnimationGallery}
    durationInFrames={FINANCE_ANIMATION_GALLERY_DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
);
