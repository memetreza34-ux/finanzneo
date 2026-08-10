import React from 'react';
import {Img} from 'remotion';

export type AdaptiveSafeFillImageProps = {
  src: string;
  focalX?: number;
  focalY?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/**
 * FinanzNeo image presentation for vertical Reel scenes.
 *
 * The source image fills the complete visual stage. Cropping is intentional and
 * should consume empty seamless background before important content. Per-scene
 * focal points keep the face, hero object, labels and money/value in frame.
 * This intentionally replaces the old inset `contain` presentation.
 */
export const AdaptiveSafeFillImage: React.FC<AdaptiveSafeFillImageProps> = ({
  src,
  focalX = 0.5,
  focalY = 0.5,
  scale = 1,
  translateX = 0,
  translateY = 0,
}) => (
  <Img
    src={src}
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: `${clamp(focalX) * 100}% ${clamp(focalY) * 100}%`,
      transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${Math.max(1, scale)})`,
      transformOrigin: `${clamp(focalX) * 100}% ${clamp(focalY) * 100}%`,
    }}
  />
);
