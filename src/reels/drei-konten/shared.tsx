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
import type {HeadlineIconName, SceneCopy} from './config';

export const REEL_LAYOUT = {
  headlineTop: 78,
  visualTop: 270,
  visualHeight: 1080,
  subtitleBottom: 320,
  subtitleLeft: 62,
  subtitleRight: 150,
} as const;

export const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const Icon: React.FC<{name: HeadlineIconName; size: number; color: string}> = ({name, size, color}) => {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const content = (() => {
    switch (name) {
      case 'wallet':
        return <><rect x="8" y="15" width="48" height="35" rx="7" {...stroke} /><path d="M39 27h17v13H39a6.5 6.5 0 0 1 0-13Z" {...stroke} /><circle cx="43" cy="33.5" r="1.8" fill="currentColor" /></>;
      case 'coins':
        return <><ellipse cx="32" cy="17" rx="17" ry="7" {...stroke} /><path d="M15 17v12c0 4 7.6 7 17 7s17-3 17-7V17" {...stroke} /><path d="M15 29v12c0 4 7.6 7 17 7s17-3 17-7V29" {...stroke} /></>;
      case 'eye':
        return <><path d="M6 32s9-15 26-15 26 15 26 15-9 15-26 15S6 32 6 32Z" {...stroke} /><circle cx="32" cy="32" r="7" {...stroke} /></>;
      case 'split':
        return <><path d="M32 10v15M32 25 14 41M32 25l18 16M32 25v16" {...stroke} /><circle cx="32" cy="9" r="4" {...stroke} /><circle cx="14" cy="47" r="5" {...stroke} /><circle cx="32" cy="47" r="5" {...stroke} /><circle cx="50" cy="47" r="5" {...stroke} /></>;
      case 'house':
        return <><path d="m8 31 24-20 24 20" {...stroke} /><path d="M14 28v25h36V28" {...stroke} /><path d="M27 53V37h10v16" {...stroke} /></>;
      case 'calculator':
        return <><rect x="13" y="7" width="38" height="50" rx="6" {...stroke} /><rect x="19" y="14" width="26" height="10" rx="2" {...stroke} /><path d="M21 33h4M32 33h4M43 33h1M21 42h4M32 42h4M43 42h1M21 51h4M32 51h12" {...stroke} /></>;
      case 'shield':
        return <><path d="M32 7 51 15v15c0 13-8 22-19 27C21 52 13 43 13 30V15l19-8Z" {...stroke} /><path d="m23 32 6 6 13-14" {...stroke} /></>;
      case 'calendar':
        return <><rect x="8" y="13" width="48" height="43" rx="6" {...stroke} /><path d="M8 25h48M20 8v10M44 8v10M18 35h7M31 35h7M44 35h2M18 46h7M31 46h7M44 46h2" {...stroke} /></>;
      case 'weeks':
        return <><rect x="8" y="10" width="20" height="18" rx="4" {...stroke} /><rect x="36" y="10" width="20" height="18" rx="4" {...stroke} /><rect x="8" y="36" width="20" height="18" rx="4" {...stroke} /><rect x="36" y="36" width="20" height="18" rx="4" {...stroke} /></>;
      case 'lock':
        return <><rect x="12" y="27" width="40" height="29" rx="6" {...stroke} /><path d="M21 27v-8a11 11 0 0 1 22 0v8" {...stroke} /><circle cx="32" cy="41" r="3" fill="currentColor" /><path d="M32 44v5" {...stroke} /></>;
      default:
        return null;
    }
  })();

  return <svg viewBox="0 0 64 64" width={size} height={size} style={{color, flex: '0 0 auto'}}>{content}</svg>;
};

export const Headline: React.FC<Pick<SceneCopy, 'headline' | 'accent' | 'accentTone' | 'icon'>> = ({
  headline,
  accent,
  icon,
  accentTone = 'green',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp01(spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 170, mass: 0.72},
    durationInFrames: 24,
  }));
  const compact = headline.length + accent.length > 33;
  const accentColor = accentTone === 'gold' ? C.gold : C.accentLt;
  const accentSize = compact ? 67 : 74;

  return (
    <div
      style={{
        position: 'absolute',
        top: REEL_LAYOUT.headlineTop,
        left: 54,
        right: 54,
        zIndex: 30,
        textAlign: 'center',
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 22}px)`,
        textShadow: '0 5px 28px rgba(0,0,0,.62)',
      }}
    >
      <div style={{color: C.white, fontFamily: FONT.title, fontSize: compact ? 55 : 61, lineHeight: 0.98, letterSpacing: 1.1}}>
        {headline}
      </div>
      <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 14, color: accentColor, marginTop: 7}}>
        <Icon name={icon} size={accentSize} color={accentColor} />
        <span style={{fontFamily: FONT.title, fontSize: accentSize, lineHeight: 0.98, letterSpacing: 1.25}}>{accent}</span>
      </div>
    </div>
  );
};

export const VisualStage: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div style={{position: 'absolute', top: REEL_LAYOUT.visualTop, left: 0, right: 0, height: REEL_LAYOUT.visualHeight, overflow: 'hidden', ...style}}>
    {children}
  </div>
);

export const SceneBackground: React.FC<React.PropsWithChildren<{tone?: 'green' | 'neutral'}>> = ({children, tone = 'green'}) => (
  <AbsoluteFill
    style={{
      overflow: 'hidden',
      background: tone === 'green'
        ? `radial-gradient(110% 72% at 50% 28%, ${C.surfaceStrong} 0%, ${C.bg} 58%, ${C.bgDeep} 100%)`
        : `radial-gradient(110% 72% at 50% 28%, #152019 0%, ${C.bgNeutral} 60%, #05080A 100%)`,
    }}
  >
    <AbsoluteFill style={{opacity: 0.22, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '72px 72px'}} />
    {children}
  </AbsoluteFill>
);

type StillSceneProps = {
  sceneId: keyof typeof assetManifest;
  copy: SceneCopy;
  panX?: number;
  panY?: number;
  imageScale?: number;
  sourceCropTop?: number;
  sourceCropBottom?: number;
  durationInFrames: number;
};

export const StillScene: React.FC<StillSceneProps> = ({
  sceneId,
  copy,
  panX = 0,
  panY = -4,
  imageScale = 1.02,
  sourceCropTop = 0,
  sourceCropBottom = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], clamp);
  const top = Math.max(0, Math.min(0.22, sourceCropTop));
  const bottom = Math.max(0, Math.min(0.22, sourceCropBottom));
  const total = Math.min(0.36, top + bottom);
  const ratio = top + bottom === 0 ? 0 : total / (top + bottom);
  const safeTop = top * ratio;
  const safeBottom = bottom * ratio;
  const visibleFraction = Math.max(0.64, 1 - safeTop - safeBottom);
  const elementHeight = 100 / visibleFraction;
  const elementTop = -(safeTop / visibleFraction) * 100;
  const safeScale = Math.max(1, Math.min(1.06, imageScale));
  const scale = Math.min(1.06, safeScale + progress * 0.006);
  const x = panX * (progress - 0.5);
  const y = panY * (progress - 0.5);
  const src = staticFile(assetManifest[sceneId]);

  return (
    <SceneBackground tone="neutral">
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} icon={copy.icon} />
      <VisualStage style={{background: C.bgDeep}}>
        <Img
          src={src}
          style={{position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', filter: 'blur(34px)', opacity: 0.2, transform: 'scale(1.08)'}}
        />
        <Img
          src={src}
          style={{
            position: 'absolute',
            left: 0,
            top: `${elementTop}%`,
            width: '100%',
            height: `${elementHeight}%`,
            objectFit: 'contain',
            objectPosition: 'center center',
            filter: 'drop-shadow(0 22px 34px rgba(0,0,0,.28))',
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          }}
        />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,10,7,.34) 0%, rgba(4,10,7,0) 9%, rgba(4,10,7,0) 92%, rgba(4,10,7,.28) 100%)'}} />
      </VisualStage>
    </SceneBackground>
  );
};
