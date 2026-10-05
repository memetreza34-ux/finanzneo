import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Icon} from '../brand';
import type {IconName} from '../brand';

export const YOUTUBE_STAGE_ID = 'finanzneo-youtube-framed-v1';

export const YOUTUBE_FRAME = {
  outerX: 120,
  top: 66,
  bottom: 78,
  headerHeight: 112,
  gap: 26,
  radius: 30,
} as const;

type StageProps = {
  title: string;
  icon: IconName;
  children: React.ReactNode;
};

export const YouTubeSectionFrame: React.FC<StageProps> = ({title, icon, children}) => (
  <AbsoluteFill
    style={{
      backgroundColor: '#000000',
      color: '#F4F0E8',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: `${YOUTUBE_FRAME.top}px ${YOUTUBE_FRAME.outerX}px ${YOUTUBE_FRAME.bottom}px`,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        height: YOUTUBE_FRAME.headerHeight,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        flex: '0 0 auto',
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 20,
          border: '1px solid #2B2B2B',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={38} color="#2FCB8B" stroke={1.8} glow={false} />
      </div>
      <div style={{fontSize: 48, fontWeight: 750, letterSpacing: -1.1, lineHeight: 1.05}}>
        {title}
      </div>
    </div>

    <div
      style={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        marginTop: YOUTUBE_FRAME.gap,
        borderRadius: YOUTUBE_FRAME.radius,
        border: '1px solid #272727',
        background: '#070707',
        overflow: 'hidden',
        boxShadow: '0 18px 50px rgba(0,0,0,0.32)',
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

export const YouTubeFramedImage: React.FC<{
  title: string;
  icon: IconName;
  src: string;
  objectFit?: 'cover' | 'contain';
}> = ({title, icon, src, objectFit = 'cover'}) => (
  <YouTubeSectionFrame title={title} icon={icon}>
    <Img
      src={src}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        display: 'block',
      }}
    />
  </YouTubeSectionFrame>
);
