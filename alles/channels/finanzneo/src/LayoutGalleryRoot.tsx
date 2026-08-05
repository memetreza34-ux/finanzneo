import React from 'react';
import {Composition} from 'remotion';
import {
  FinanceLayoutGallery,
  FINANCE_LAYOUT_GALLERY_FRAMES,
} from './engine/LayoutGallery';

export const LayoutGalleryRoot: React.FC = () => (
  <Composition
    id="FinanceLayoutGallery"
    component={FinanceLayoutGallery}
    durationInFrames={FINANCE_LAYOUT_GALLERY_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
