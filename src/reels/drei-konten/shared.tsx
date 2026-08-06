import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT} from '../../brand';
import assetManifest from './asset-manifest.json';
import type {SceneCopy} from './config';

export const REEL_LAYOUT = {
  headlineTop: 92,
  visualTop: 300,
  visualHeight: 1110,
  subtitleBottom: 180,
} as const;

export const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const Headline: React.FC<Pick<SceneCopy, 'headline' | 'accent' | 'accentTone'>> = ({
  headline,
  accent,
  accentTone = 'green',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp01(
    spring({
      frame,
      fps,
      config: {damping: 18, stiffness: 170, mass: 0.72},
      durationInFrames: 24,
    }),
  );
  const totalLength = headline.length + accent.length;
  const compact = totalLength > 33;
  const accentColor = accentTone === 'gold' ? C.gold : C.accentLt;

  return (
    <div
      style={{
        position: 'absolute',
        top: REEL_LAYOUT.headlineTop,
        left: 62,
        right: 62,
        zIndex: 30,
        textAlign: 'center',
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 28}px)`,
        textShadow: '0 5px 28px rgba(0,0,0,.62)',
      }}
    >
      <div
        style={{
          color: C.white,
          fontFamily: FONT.title,
          fontSize: compact ? 62 : 70,
          lineHeight: 0.98,
          letterSpacing: 1.2,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          color: accentColor,
          fontFamily: FONT.title,
          fontSize: compact ? 76 : 86,
          lineHeight: 0.98,
          letterSpacing: 1.4,
          marginTop: 8,
        }}
      >
        {accent}
      </div>
    </div>
  );
};

export const VisualStage: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      top: REEL_LAYOUT.visualTop,
      left: 0,
      right: 0,
      height: REEL_LAYOUT.visualHeight,
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

export const SceneBackground: React.FC<React.PropsWithChildren<{tone?: 'green' | 'neutral'}>> = ({
  children,
  tone = 'green',
}) => (
  <AbsoluteFill
    style={{
      overflow: 'hidden',
      background:
        tone === 'green'
          ? `radial-gradient(110% 72% at 50% 28%, ${C.surfaceStrong} 0%, ${C.bg} 58%, ${C.bgDeep} 100%)`
          : `radial-gradient(110% 72% at 50% 28%, #152019 0%, ${C.bgNeutral} 60%, #05080A 100%)`,
    }}
  >
    <AbsoluteFill
      style={{
        opacity: 0.22,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }}
    />
    {children}
  </AbsoluteFill>
);

type StillSceneProps = {
  sceneId: keyof typeof assetManifest;
  copy: SceneCopy;
  panX?: number;
  panY?: number;
  imageScale?: number;
  durationInFrames: number;
};

export const StillScene: React.FC<StillSceneProps> = ({
  sceneId,
  copy,
  panX = 0,
  panY = -8,
  imageScale = 1,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], clamp);
  const safeScale = Math.max(1, Math.min(1.05, imageScale));
  const scale = safeScale + progress * 0.018;
  const x = panX * (progress - 0.5);
  const y = panY * (progress - 0.5);
  const src = staticFile(assetManifest[sceneId]);

  return (
    <SceneBackground tone="neutral">
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} />
      <VisualStage style={{background: C.bgDeep}}>
        <Img
          src={src}
          style={{
            position: 'absolute',
            inset: -40,
            width: 'calc(100% + 80px)',
            height: 'calc(100% + 80px)',
            objectFit: 'cover',
            filter: 'blur(34px)',
            opacity: 0.24,
            transform: 'scale(1.08)',
          }}
        />
        <Img
          src={src}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center 45%',
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(4,10,7,.42) 0%, rgba(4,10,7,0) 10%, rgba(4,10,7,0) 88%, rgba(4,10,7,.38) 100%)',
          }}
        />
      </VisualStage>
    </SceneBackground>
  );
};
