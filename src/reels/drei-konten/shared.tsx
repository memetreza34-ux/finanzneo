import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../brand';
import assetManifest from './asset-manifest.json';

type CaptionProps = {
  kicker: string;
  text: string;
  durationInFrames: number;
};

export const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const Caption: React.FC<CaptionProps> = ({kicker, text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = clamp01(spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 180, mass: 0.7},
    durationInFrames: Math.min(22, durationInFrames),
  }));
  const exit = interpolate(
    frame,
    [Math.max(0, durationInFrames - 10), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        bottom: 442,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 34}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          borderRadius: 999,
          padding: '10px 18px',
          background: a(C.accent, 0.18),
          border: `1px solid ${a(C.accentLt, 0.42)}`,
          color: C.accentLt,
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize: 27,
          letterSpacing: 2.2,
          marginBottom: 16,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          borderRadius: 30,
          padding: '25px 28px 27px',
          background: 'rgba(4, 14, 8, 0.86)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.38)',
          backdropFilter: 'blur(18px)',
          color: C.white,
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: 42,
          lineHeight: 1.2,
          textShadow: '0 2px 18px rgba(0,0,0,0.8)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

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
  kicker: string;
  caption: string;
  panX?: number;
  panY?: number;
  durationInFrames: number;
};

export const StillScene: React.FC<StillSceneProps> = ({
  sceneId,
  kicker,
  caption,
  panX = 0,
  panY = -8,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], clamp);
  const scale = 1.015 + progress * 0.028;
  const x = panX * (progress - 0.5);
  const y = panY * (progress - 0.5);

  return (
    <SceneBackground tone="neutral">
      <AbsoluteFill>
        <Img
          src={staticFile(assetManifest[sceneId])}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,10,7,.28) 0%, rgba(4,10,7,.02) 34%, rgba(4,10,7,.08) 58%, rgba(4,10,7,.86) 100%)',
        }}
      />
      <Caption kicker={kicker} text={caption} durationInFrames={durationInFrames} />
    </SceneBackground>
  );
};

