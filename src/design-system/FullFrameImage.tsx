import React from 'react';
import {AbsoluteFill, Img} from 'remotion';

export type FullFrameImageProps = {
  src: string;
  mode?: 'full-frame-no-crop' | 'fit-between-text';
};

/**
 * Image presentation for user-provided vertical 9:16 images.
 * Supports full-frame or fitting between headline and subtitles.
 */
export const FullFrameImage: React.FC<FullFrameImageProps> = ({src, mode = 'full-frame-no-crop'}) => {
  const isFit = mode === 'fit-between-text';
  if (isFit) {
    return (
      <Img
        src={src}
        style={{
          position: 'absolute',
          top: 220,
          bottom: 430, // 1920 - 1490 = 430
          left: 0,
          right: 0,
          width: '100%',
          height: 1270, // 1920 - 220 - 430 = 1270
          objectFit: 'contain',
          objectPosition: 'center center',
          background: '#020805', // Match the WorldStage dark bg
        }}
      />
    );
  }
  // full-frame-no-crop: covers the entire 1080×1920 canvas — inset: 0
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center center',
        background: 'transparent',
      }}
    />
  );
};

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
