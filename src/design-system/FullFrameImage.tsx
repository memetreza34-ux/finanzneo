import React from 'react';
import {Img} from 'remotion';

export type FullFrameImageProps = {
  src: string;
};

/**
 * Canonical FinanzNeo presentation for user-provided 9:16 images.
 *
 * The image spans the complete 1080x1920 canvas and is never intentionally
 * cropped. Headline and captions are overlaid on top of the image. User images
 * are expected to be vertical 9:16; if an asset is not suitable, production
 * must block instead of cutting off important content.
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
