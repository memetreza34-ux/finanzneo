import React from 'react';
import {AbsoluteFill, Img} from 'remotion';

export type FullFrameImageProps = {
  src: string;
};

/**
 * Canonical FinanzNeo presentation for user-provided vertical 9:16 images.
 *
 * The source spans the complete 1080x1920 canvas. No intentional crop, no
 * middle image stage, no inset poster and no duplicate/blurred background.
 * Headline and captions are overlays on top of the same image.
 */
export const FullFrameImage: React.FC<FullFrameImageProps> = ({src}) => (
  <Img
    src={src}
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      objectPosition: 'center center',
    }}
  />
);

/**
 * Continuous transparent readability treatment for text overlays.
 * There are deliberately no hard header/footer panels or visible boundaries.
 */
export const FullFrameReadabilityScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'linear-gradient(180deg, rgba(1,6,4,.62) 0%, rgba(1,6,4,.26) 12%, rgba(1,6,4,.06) 25%, rgba(1,6,4,0) 36%, rgba(1,6,4,0) 62%, rgba(1,6,4,.10) 72%, rgba(1,6,4,.34) 84%, rgba(1,6,4,.70) 100%)',
    }}
  />
);
