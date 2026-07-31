import React, {createContext, useContext} from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Captions,
  LivingBackground,
  PremiumGrade,
  ThemeProvider,
  Voiceover,
  type Caption,
} from '@studio/core';
import {BRAND} from '../../brand/brand';
import type {
  FinanceAsset,
  FinanceAssetManifest,
  FinanceFocusPoint,
  FinanceScene,
  FinanceScenePlan,
} from './contracts';

const ACCENT = BRAND.accent;
const RED = '#FF5C63';
const GOLD = '#F2C14E';
const WHITE = '#F5F7F4';
const MUTED = '#AFC0B4';
const PANEL = 'rgba(7, 24, 13, 0.88)';
const BORDER = 'rgba(92, 255, 154, 0.24)';
const font = BRAND.font.body;
const display = BRAND.font.display;
const DebugContext = createContext(false);

export type FinanceReelProps = {
  plan: FinanceScenePlan;
  manifest: FinanceAssetManifest;
  captions: Caption[];
  publicBasePath: string;
  captionBottom?: number;
  showCaptions?: boolean;
  debug?: boolean;
};

export const getFinanceReelFrames = (plan: FinanceScenePlan): number =>
  Math.round(plan.scenes.reduce((sum, scene) => sum + scene.durationSec, 0) * plan.fps);

const joinPublicPath = (base: string, file: string): string =>
  [base.replace(/^\/+|\/+$/g, ''), file.replace(/^\/+/, '')].filter(Boolean).join('/');

const fitTextSize = (text: string | undefined, max: number, min: number, softLimit: number): number => {
  const length = text?.trim().length ?? 0;
  if (length <= softLimit) return max;
  const reduction = Math.ceil((length - softLimit) / 8) * 4;
  return Math.max(min, max - reduction);
};

const phaseProgress = (
  scene: FinanceScene,
  phaseIndex: number,
  frame: number,
  fps: number,
  fallbackAt: number,
): number => {
  const at = scene.visualPhases?.[phaseIndex]?.at ?? fallbackAt;
  const start = Math.round(scene.durationSec * fps * at);
  const revealFrames = Math.max(7, Math.round(fps * 0.28));
  return interpolate(frame, [start, start + revealFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const SceneFrame: React.FC<{scene: FinanceScene; children: React.ReactNode}> = ({scene, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, Math.max(6, Math.round(fps * 0.28))], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const transform = (() => {
    switch (scene.transition) {
      case 'push': return `translateX(${(1 - p) * 160}px)`;
      case 'wipe': return `translateY(${(1 - p) * 120}px)`;
      case 'zoom-through': return `scale(${0.88 + p * 0.12})`;
      case 'match-move': return `translateX(${(1 - p) * -90}px) scale(${0.95 + p * 0.05})`;
      default: return 'none';
    }
  })();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform, transformOrigin: '50% 50%'}}>{children}</div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{scene: FinanceScene; center?: boolean; compact?: boolean}> = ({scene, center = false, compact = false}) => {
  const headlineSize = fitTextSize(scene.content.headline, compact ? 58 : center ? 80 : 66, compact ? 42 : 48, compact ? 34 : 38);
  return (
    <div style={{position: 'absolute', top: compact ? 72 : 86, left: 58, right: 58, zIndex: 5, textAlign: center ? 'center' : 'left'}}>
      {scene.content.kicker && (
        <div style={{color: ACCENT, fontFamily: font, fontSize: compact ? 27 : 30, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16}}>
          {scene.content.kicker}
        </div>
      )}
      {scene.content.headline && (
        <div style={{color: WHITE, fontFamily: display, fontSize: headlineSize, lineHeight: 0.98, fontWeight: 900, textWrap: 'balance', textShadow: '0 8px 30px rgba(0,0,0,0.55)'}}>
          {scene.content.headline}
        </div>
      )}
    </div>
  );
};

const MissingAsset: React.FC = () => (
  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, rgba(14,43,24,0.82), rgba(5,14,8,0.95))', color: MUTED, fontFamily: font, fontSize: 30, fontWeight: 750, textAlign: 'center', padding: 24, boxSizing: 'border-box'}}>
    Asset fehlt
  </div>
);

const AssetImage: React.FC<{
  asset?: FinanceAsset;
  publicBasePath: string;
  mode: 'cover' | 'contain';
  durationSec: number;
  motion?: 'drift' | 'detail-focus' | 'still';
  focus?: FinanceFocusPoint;
}> = ({asset, publicBasePath, mode, durationSec, motion = 'drift', focus}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!asset) return <MissingAsset />;
  const progress = interpolate(frame, [0, Math.max(1, Math.round(durationSec * fps))], [0, 1], {extrapolateRight: 'clamp'});
  const drift = motion === 'still' ? 0 : interpolate(progress, [0, 1], [-10, 12]);
  const targetScale = focus?.scale ?? 1.17;
  const scale = motion === 'detail-focus'
    ? interpolate(progress, [0, 0.45, 1], [1.02, 1.06, targetScale])
    : motion === 'still' ? 1 : interpolate(progress, [0, 1], [1.015, 1.065]);
  return (
    <Img
      src={staticFile(joinPublicPath(publicBasePath, asset.file))}
      style={{
        width: '100%',
        height: '100%',
        objectFit: mode,
        objectPosition: focus ? `${focus.x * 100}% ${focus.y * 100}%` : '50% 50%',
        transform: `translate3d(${drift}px, 0, 0) scale(${scale})`,
      }}
    />
  );
};

const LayeredAssetImage: React.FC<{
  scene: FinanceScene;
  assets: FinanceAsset[];
  base: string;
  mode: 'cover' | 'contain';
  motion?: 'drift' | 'detail-focus' | 'still';
}> = ({scene, assets, base, mode, motion}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const focus = scene.visualPhases?.find((phase) => phase.focus)?.focus;
  const phaseLayers = (scene.visualPhases ?? [])
    .map((phase, index) => ({phase, index, asset: phase.assetId ? assets.find((item) => item.id === phase.assetId) : undefined}))
    .filter((layer) => layer.asset);
  return (
    <AbsoluteFill>
      <AssetImage asset={assets[0]} publicBasePath={base} mode={mode} durationSec={scene.durationSec} motion={motion} focus={focus} />
      {phaseLayers.map(({phase, index, asset}) => {
        const opacity = phaseProgress(scene, index, frame, fps, phase.at);
        return (
          <AbsoluteFill key={`${phase.assetId}-${index}`} style={{opacity}}>
            <AssetImage asset={asset} publicBasePath={base} mode={mode} durationSec={scene.durationSec} motion={motion} focus={phase.focus ?? focus} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const PhaseMarker: React.FC<{scene: FinanceScene}> = ({scene}) => {
  const debug = useContext(DebugContext);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phases = scene.visualPhases ?? [];
  if (!debug || phases.length < 2) return null;
  return (
    <div style={{position: 'absolute', right: 62, bottom: 430, display: 'flex', gap: 10, zIndex: 20}}>
      {phases.map((phase, index) => {
        const p = phaseProgress(scene, index, frame, fps, index / phases.length);
        return <div key={`${phase.at}-${index}`} style={{width: p > 0.5 ? 34 : 12, height: 10, borderRadius: 999, background: p > 0.5 ? ACCENT : 'rgba(255,255,255,0.22)'}} />;
      })}
    </div>
  );
};

const FullBleed: React.FC<{scene: FinanceScene; assets: FinanceAsset[]; base: string}> = ({scene, assets, base}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const detail = scene.variant === 'detail-focus';
  const second = phaseProgress(scene, 1, frame, fps, 0.5);
  const third = phaseProgress(scene, 2, frame, fps, 0.75);
  const focus = scene.visualPhases?.find((phase) => phase.focus)?.focus;
  const radius = (focus?.radius ?? 0.2) * 1080;
  return (
    <SceneFrame scene={scene}>
      <AbsoluteFill>
        <LayeredAssetImage scene={scene} assets={assets} base={base} mode="cover" motion={detail ? 'detail-focus' : 'drift'} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,8,4,0.08) 0%, rgba(2,8,4,0.16) 44%, rgba(2,8,4,0.94) 100%)'}} />
        {detail && focus && (
          <div style={{position: 'absolute', left: `${focus.x * 100}%`, top: `${focus.y * 100}%`, width: radius * 2, height: radius * 2, borderRadius: '50%', border: `5px solid ${ACCENT}`, boxShadow: '0 0 0 999px rgba(0,0,0,0.22), 0 0 60px rgba(61,255,132,0.38)', opacity: second, transform: `translate(-50%, -50%) scale(${0.78 + second * 0.22})`}} />
        )}
        <Header scene={scene} />
        {scene.content.body && (
          <div style={{position: 'absolute', left: 72, right: 72, bottom: 590, color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.body, 39, 31, 90), lineHeight: 1.18, fontWeight: 700, maxWidth: 850, textShadow: '0 5px 24px rgba(0,0,0,0.78)', opacity: detail ? third : second, transform: `translateY(${(1 - (detail ? third : second)) * 28}px)`}}>
            {scene.content.body}
          </div>
        )}
        <PhaseMarker scene={scene} />
      </AbsoluteFill>
    </SceneFrame>
  );
};

const SplitImageText: React.FC<{scene: FinanceScene; assets: FinanceAsset[]; base: string; imageSide: 'left' | 'right'}> = ({scene, assets, base, imageSide}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const second = phaseProgress(scene, 1, frame, fps, 0.52);
  const imageLeft = imageSide === 'left';
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} compact />
      <div style={{position: 'absolute', top: 320, left: 58, right: 58, bottom: 500, display: 'grid', gridTemplateColumns: imageLeft ? '1.16fr 0.84fr' : '0.84fr 1.16fr', gap: 24}}>
        <div style={{order: imageLeft ? 0 : 1, borderRadius: 42, overflow: 'hidden', border: `2px solid ${BORDER}`, boxShadow: '0 24px 70px rgba(0,0,0,0.42)', position: 'relative'}}>
          <LayeredAssetImage scene={scene} assets={assets} base={base} mode="cover" motion="detail-focus" />
        </div>
        <div style={{order: imageLeft ? 1 : 0, borderRadius: 42, border: `1px solid ${BORDER}`, background: PANEL, padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 0.35 + second * 0.65, transform: `translateX(${(1 - second) * (imageLeft ? 55 : -55)}px)`}}>
          {scene.content.primaryNumber !== undefined && <div style={{fontFamily: display, fontSize: fitTextSize(String(scene.content.primaryNumber), 86, 58, 12), color: ACCENT, fontWeight: 950, lineHeight: 0.95}}>{scene.content.primaryNumber}</div>}
          <div style={{fontFamily: font, fontSize: fitTextSize(String(scene.content.body ?? scene.content.secondaryNumber ?? ''), 36, 28, 70), color: WHITE, fontWeight: 760, lineHeight: 1.16, marginTop: 24}}>{scene.content.body ?? scene.content.secondaryNumber}</div>
        </div>
      </div>
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const MultiPanel: React.FC<{scene: FinanceScene; assets: FinanceAsset[]; base: string; count: 2 | 3 | 4}> = ({scene, assets, base, count}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} compact />
      <div style={{position: 'absolute', top: 320, left: 58, right: 58, bottom: 500, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: count === 2 ? '1fr' : '1fr 1fr', gap: 20}}>
        {Array.from({length: count}).map((_, index) => {
          const reveal = phaseProgress(scene, Math.min(index, 2), frame, fps, index / Math.max(1, count));
          const isWideLast = count === 3 && index === 2;
          return (
            <div key={index} style={{gridColumn: isWideLast ? '1 / 3' : undefined, borderRadius: 34, overflow: 'hidden', border: `2px solid ${index === count - 1 ? `${ACCENT}88` : BORDER}`, background: PANEL, opacity: reveal, transform: `translateY(${(1 - reveal) * 50}px) scale(${0.94 + reveal * 0.06})`, position: 'relative'}}>
              <AssetImage asset={assets[index]} publicBasePath={base} mode="cover" durationSec={scene.durationSec} motion="still" />
              <div style={{position: 'absolute', left: 20, top: 20, width: 54, height: 54, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: index === count - 1 ? ACCENT : 'rgba(4,15,8,0.82)', color: index === count - 1 ? '#06120A' : WHITE, fontFamily: display, fontSize: 28, fontWeight: 950}}>{index + 1}</div>
            </div>
          );
        })}
      </div>
      {scene.content.body && <div style={{position: 'absolute', left: 90, right: 90, bottom: 410, color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.body, 35, 28, 100), lineHeight: 1.18, fontWeight: 700, textAlign: 'center'}}>{scene.content.body}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const FramedImage: React.FC<{scene: FinanceScene; assets: FinanceAsset[]; base: string}> = ({scene, assets, base}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 18, stiffness: 130}});
  if (scene.variant === 'split-left' || scene.variant === 'split-right') return <SplitImageText scene={scene} assets={assets} base={base} imageSide={scene.variant === 'split-left' ? 'left' : 'right'} />;
  if (scene.variant === 'multi-2') return <MultiPanel scene={scene} assets={assets} base={base} count={2} />;
  if (scene.variant === 'multi-3') return <MultiPanel scene={scene} assets={assets} base={base} count={3} />;
  if (scene.variant === 'multi-4') return <MultiPanel scene={scene} assets={assets} base={base} count={4} />;
  const second = phaseProgress(scene, 1, frame, fps, 0.55);
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} />
      <div style={{position: 'absolute', top: 300, left: 78, right: 78, height: 1090, borderRadius: 44, overflow: 'hidden', border: `2px solid ${BORDER}`, background: PANEL, boxShadow: '0 0 54px rgba(44,255,123,0.16), 0 26px 80px rgba(0,0,0,0.50)', transform: `scale(${0.94 + pop * 0.06})`}}>
        <LayeredAssetImage scene={scene} assets={assets} base={base} mode="cover" />
        <div style={{position: 'absolute', inset: 0, border: `6px solid rgba(61,255,132,${second * 0.22})`, borderRadius: 42}} />
      </div>
      {scene.content.body && <div style={{position: 'absolute', left: 90, right: 90, top: 1420, color: MUTED, fontFamily: font, fontSize: fitTextSize(scene.content.body, 35, 28, 100), lineHeight: 1.22, fontWeight: 650, textAlign: 'center', opacity: second}}>{scene.content.body}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const BigNumber: React.FC<{scene: FinanceScene; asset?: FinanceAsset; base: string}> = ({scene, asset, base}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 15, stiffness: 120}});
  const calculation = scene.variant === 'calculation';
  const first = phaseProgress(scene, 0, frame, fps, 0);
  const second = phaseProgress(scene, 1, frame, fps, 0.4);
  const third = phaseProgress(scene, 2, frame, fps, 0.72);
  return (
    <SceneFrame scene={scene}>
      {asset && <AbsoluteFill style={{opacity: 0.16}}><AssetImage asset={asset} publicBasePath={base} mode="cover" durationSec={scene.durationSec} /></AbsoluteFill>}
      <Header scene={scene} center />
      {(scene.content.formula || calculation) && <div style={{position: 'absolute', top: 390, left: 80, right: 80, border: `1px solid ${BORDER}`, borderRadius: 28, background: PANEL, color: MUTED, fontFamily: font, fontSize: fitTextSize(scene.content.formula ?? scene.content.body, 40, 30, 70), lineHeight: 1.1, fontWeight: 800, padding: '24px 30px', textAlign: 'center', opacity: first, transform: `translateY(${(1 - first) * 28}px)`}}>{scene.content.formula ?? scene.content.body ?? 'Ausgangswert × Veränderung'}</div>}
      <div style={{position: 'absolute', inset: calculation || scene.content.formula ? '520px 44px 450px' : '420px 44px 450px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{color: ACCENT, fontFamily: display, fontSize: fitTextSize(String(scene.content.primaryNumber ?? ''), 190, 110, 10), fontWeight: 950, lineHeight: 0.9, textAlign: 'center', opacity: calculation ? second : first, transform: `scale(${0.72 + p * 0.28})`, textShadow: '0 0 34px rgba(61,255,132,0.42), 0 18px 70px rgba(0,0,0,0.75)'}}>
          {scene.content.primaryNumber}
          {scene.content.secondaryNumber !== undefined && <div style={{fontSize: fitTextSize(String(scene.content.secondaryNumber), 68, 44, 22), color: WHITE, marginTop: 34, opacity: calculation ? third : second}}>{scene.content.secondaryNumber}</div>}
        </div>
      </div>
      {scene.content.body && !calculation && <div style={{position: 'absolute', left: 92, right: 92, bottom: 510, color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.body, 39, 30, 100), lineHeight: 1.16, fontWeight: 700, textAlign: 'center', opacity: second}}>{scene.content.body}</div>}
      {calculation && scene.content.outcome && <div style={{position: 'absolute', left: 92, right: 92, bottom: 500, color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.outcome, 39, 30, 100), lineHeight: 1.16, fontWeight: 800, textAlign: 'center', opacity: third}}>{scene.content.outcome}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const SplitComparison: React.FC<{scene: FinanceScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 17, stiffness: 115}});
  const second = phaseProgress(scene, 1, frame, fps, 0.42);
  const third = phaseProgress(scene, 2, frame, fps, 0.74);
  const beforeAfter = scene.variant === 'before-after';
  const panels = [
    {label: scene.content.leftLabel, value: scene.content.leftValue, color: beforeAfter ? MUTED : RED, x: -1},
    {label: scene.content.rightLabel, value: scene.content.rightValue, color: ACCENT, x: 1},
  ];
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} center />
      <div style={{position: 'absolute', top: 390, left: 46, right: 46, bottom: 540, display: 'flex', gap: 30}}>
        {panels.map((panel, index) => (
          <div key={index} style={{flex: 1, borderRadius: 42, border: `2px solid ${panel.color}66`, background: `linear-gradient(180deg, ${panel.color}22, ${PANEL})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateX(${panel.x * (1 - p) * 130}px)`, boxShadow: '0 22px 70px rgba(0,0,0,0.42)', position: 'relative', opacity: index === 0 ? 1 : 0.25 + second * 0.75}}>
            <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, borderRadius: '42px 0 0 42px', background: panel.color, opacity: 0.75}} />
            {beforeAfter && <div style={{position: 'absolute', top: 36, fontFamily: font, fontSize: 27, fontWeight: 900, letterSpacing: 3, color: panel.color}}>{index === 0 ? 'VORHER' : 'NACHHER'}</div>}
            <div style={{fontFamily: font, fontSize: fitTextSize(panel.label, 37, 28, 18), fontWeight: 850, color: panel.color, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center'}}>{panel.label}</div>
            <div style={{fontFamily: display, fontSize: fitTextSize(String(panel.value ?? ''), 112, 70, 10), fontWeight: 950, color: WHITE, marginTop: 34, textAlign: 'center'}}>{panel.value}</div>
          </div>
        ))}
      </div>
      {beforeAfter && <div style={{position: 'absolute', left: '50%', top: 850, transform: `translate(-50%, -50%) scale(${0.7 + third * 0.3})`, color: ACCENT, fontFamily: display, fontSize: 78, fontWeight: 950, opacity: third}}>→</div>}
      {scene.content.body && <div style={{position: 'absolute', left: 90, right: 90, top: 1405, color: MUTED, fontFamily: font, fontSize: fitTextSize(scene.content.body, 38, 30, 100), fontWeight: 700, lineHeight: 1.16, textAlign: 'center', opacity: third}}>{scene.content.body}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const Process: React.FC<{scene: FinanceScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = scene.content.steps ?? [];
  const checklist = scene.variant === 'checklist';
  const outcomeP = phaseProgress(scene, 2, frame, fps, 0.72);
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} />
      <div style={{position: 'absolute', top: 360, left: 76, right: 76, display: 'flex', flexDirection: 'column', gap: 38}}>
        {!checklist && <div style={{position: 'absolute', left: 42, top: 68, bottom: 68, width: 4, background: `linear-gradient(180deg, ${ACCENT}, rgba(61,255,132,0.12))`, borderRadius: 999}} />}
        {steps.map((step, index) => {
          const reveal = phaseProgress(scene, Math.min(index, 2), frame, fps, steps.length <= 1 ? 0 : index / steps.length);
          return <div key={step} style={{display: 'grid', gridTemplateColumns: '96px 1fr', gap: 30, alignItems: 'center', transform: `translateX(${(1 - reveal) * 100}px)`, opacity: reveal, position: 'relative'}}><div style={{width: 88, height: 88, borderRadius: checklist ? 44 : 28, background: ACCENT, color: '#051008', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontSize: checklist ? 40 : 44, fontWeight: 950, zIndex: 2}}>{checklist ? '✓' : index + 1}</div><div style={{borderRadius: 30, border: `1px solid ${BORDER}`, background: PANEL, padding: '36px', color: WHITE, fontFamily: font, fontSize: fitTextSize(step, 39, 30, 48), lineHeight: 1.12, fontWeight: 780}}>{step}</div></div>;
        })}
      </div>
      {(scene.content.outcome || scene.content.body) && <div style={{position: 'absolute', top: 1100, left: 112, right: 112, borderRadius: 30, border: `1px solid ${BORDER}`, background: 'rgba(15,72,35,0.50)', color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.outcome ?? scene.content.body, 38, 30, 100), fontWeight: 800, lineHeight: 1.18, padding: '30px 34px', textAlign: 'center', opacity: outcomeP, transform: `translateY(${(1 - outcomeP) * 34}px)`}}>{scene.content.outcome ?? scene.content.body}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const Timeline: React.FC<{scene: FinanceScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const values = scene.content.chartValues ?? [];
  const labels = scene.content.chartLabels ?? [];
  const count = Math.max(values.length, labels.length, 2);
  const second = phaseProgress(scene, 1, frame, fps, 0.38);
  const third = phaseProgress(scene, 2, frame, fps, 0.72);
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} />
      <div style={{position: 'absolute', top: 470, left: 78, right: 78, height: 650}}>
        <div style={{position: 'absolute', left: 50, right: 50, top: 260, height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.12)'}}><div style={{height: '100%', width: `${second * 100}%`, borderRadius: 999, background: ACCENT, boxShadow: '0 0 28px rgba(61,255,132,0.35)'}} /></div>
        {Array.from({length: count}).map((_, index) => {
          const x = count === 1 ? 50 : 6 + (index / (count - 1)) * 88;
          const reveal = interpolate(second, [index / count, Math.min(1, index / count + 0.2)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const isLast = index === count - 1;
          return <div key={index} style={{position: 'absolute', left: `${x}%`, top: 210, transform: 'translateX(-50%)', opacity: reveal}}><div style={{width: isLast ? 42 : 30, height: isLast ? 42 : 30, borderRadius: '50%', background: isLast ? GOLD : ACCENT, border: '7px solid #06120A', boxShadow: isLast ? '0 0 32px rgba(242,193,78,0.46)' : 'none'}} /><div style={{position: 'absolute', top: index % 2 === 0 ? -120 : 72, left: '50%', transform: 'translateX(-50%)', minWidth: 120, textAlign: 'center'}}><div style={{fontFamily: display, fontSize: 42, color: isLast ? GOLD : WHITE, fontWeight: 950}}>{values[index] ?? ''}</div><div style={{fontFamily: font, fontSize: 28, color: MUTED, fontWeight: 750, marginTop: 8}}>{labels[index] ?? ''}</div></div></div>;
        })}
      </div>
      {scene.content.body && <div style={{position: 'absolute', left: 100, right: 100, top: 1270, color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.body, 38, 30, 100), fontWeight: 700, lineHeight: 1.18, textAlign: 'center', opacity: third}}>{scene.content.body}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const Chart: React.FC<{scene: FinanceScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (scene.variant === 'timeline') return <Timeline scene={scene} />;
  const values = scene.content.chartValues?.length ? scene.content.chartValues : [0, 1];
  const labels = scene.content.chartLabels ?? [];
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const width = 850;
  const height = 620;
  const points = values.map((value, index) => ({x: values.length === 1 ? width / 2 : (index / (values.length - 1)) * width, y: height - ((value - min) / range) * height}));
  const second = phaseProgress(scene, 1, frame, fps, 0.35);
  const third = phaseProgress(scene, 2, frame, fps, 0.72);
  const visible = Math.max(1, Math.ceil(points.length * second));
  const polyline = points.slice(0, visible).map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <SceneFrame scene={scene}>
      <Header scene={scene} />
      <div style={{position: 'absolute', top: 360, left: 76, width: 928, height: 850, borderRadius: 42, background: PANEL, border: `2px solid ${BORDER}`, padding: 34, boxSizing: 'border-box', boxShadow: '0 24px 70px rgba(0,0,0,0.35)'}}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height + 130}`}>
          {[0, 1, 2, 3].map((index) => <line key={index} x1="0" x2={width} y1={(height / 3) * index} y2={(height / 3) * index} stroke="rgba(255,255,255,0.10)" strokeWidth="2" />)}
          <polyline points={polyline} fill="none" stroke={ACCENT} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          {points.slice(0, visible).map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={index === points.length - 1 ? 18 : 13} fill={index === points.length - 1 ? GOLD : ACCENT} opacity={index === points.length - 1 ? third : 1} />)}
          {labels.map((label, index) => <text key={`${label}-${index}`} x={points[index]?.x ?? 0} y={height + 70} fill={MUTED} fontFamily={font} fontSize="28" textAnchor="middle">{label}</text>)}
        </svg>
      </div>
      {scene.content.body && <div style={{position: 'absolute', left: 100, right: 100, top: 1270, color: WHITE, fontFamily: font, fontSize: fitTextSize(scene.content.body, 38, 30, 100), fontWeight: 700, lineHeight: 1.18, textAlign: 'center', opacity: third}}>{scene.content.body}</div>}
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const TextPunch: React.FC<{scene: FinanceScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13, stiffness: 150}});
  const payoff = scene.variant === 'payoff';
  const second = phaseProgress(scene, 1, frame, fps, 0.44);
  const third = phaseProgress(scene, 2, frame, fps, 0.76);
  return (
    <SceneFrame scene={scene}>
      <div style={{position: 'absolute', inset: '160px 70px 420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        {scene.content.kicker && <div style={{color: ACCENT, fontFamily: font, fontSize: 34, fontWeight: 850, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 38}}>{scene.content.kicker}</div>}
        <div style={{color: WHITE, fontFamily: display, fontSize: fitTextSize(scene.content.headline, 104, 62, 34), lineHeight: 0.96, fontWeight: 950, transform: `scale(${0.78 + p * 0.22})`, textShadow: '0 18px 60px rgba(0,0,0,0.60)'}}>{scene.content.headline}</div>
        {payoff && <div style={{width: `${second * 72}%`, height: 12, background: ACCENT, borderRadius: 999, marginTop: 34, boxShadow: '0 0 30px rgba(61,255,132,0.34)'}} />}
        {scene.content.body && <div style={{color: payoff ? WHITE : MUTED, fontFamily: font, fontSize: fitTextSize(scene.content.body, 42, 31, 100), lineHeight: 1.18, fontWeight: payoff ? 760 : 650, marginTop: 46, opacity: payoff ? third : second}}>{scene.content.body}</div>}
      </div>
      <PhaseMarker scene={scene} />
    </SceneFrame>
  );
};

const Cta: React.FC<{scene: FinanceScene; asset?: FinanceAsset; base: string}> = ({scene, asset, base}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 15, stiffness: 135}});
  const second = phaseProgress(scene, 1, frame, fps, 0.55);
  return (
    <SceneFrame scene={scene}>
      {asset && <AbsoluteFill style={{opacity: 0.13}}><AssetImage asset={asset} publicBasePath={base} mode="cover" durationSec={scene.durationSec} /></AbsoluteFill>}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,16,8,0.30), rgba(3,16,8,0.86))'}} />
      <div style={{position: 'absolute', inset: '260px 64px 210px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{color: WHITE, fontFamily: display, fontWeight: 950, fontSize: fitTextSize(scene.content.headline ?? 'Hol dir die Übersicht', 82, 54, 42), lineHeight: 0.98, maxWidth: 900}}>{scene.content.headline ?? 'Hol dir die Übersicht'}</div>
        <div style={{marginTop: 62, padding: '32px 54px', borderRadius: 34, background: ACCENT, color: '#06120A', fontFamily: display, fontWeight: 950, fontSize: fitTextSize(scene.content.ctaKeyword ?? 'FINANZEN', 64, 44, 12), transform: `scale(${0.85 + p * 0.15 + Math.sin(frame / 4) * 0.02 * second})`, boxShadow: '0 0 48px rgba(61,255,132,0.35)'}}>{scene.content.ctaKeyword ?? 'FINANZEN'}</div>
        {scene.content.ctaBenefit && <div style={{marginTop: 38, color: WHITE, fontFamily: font, fontWeight: 720, fontSize: fitTextSize(scene.content.ctaBenefit, 36, 28, 90), lineHeight: 1.2, maxWidth: 900, opacity: second}}>{scene.content.ctaBenefit}</div>}
      </div>
    </SceneFrame>
  );
};

const FinanceSceneRenderer: React.FC<{scene: FinanceScene; manifest: FinanceAssetManifest; publicBasePath: string}> = ({scene, manifest, publicBasePath}) => {
  const requestedIds = [...new Set([
    ...scene.assetIds,
    ...(scene.visualPhases ?? []).flatMap((phase) => phase.assetId ? [phase.assetId] : []),
  ])];
  const assets = requestedIds.map((id) => manifest.assets.find((item) => item.id === id)).filter((asset): asset is FinanceAsset => Boolean(asset));
  const asset = assets[0];
  switch (scene.layout) {
    case 'full-bleed': return <FullBleed scene={scene} assets={assets} base={publicBasePath} />;
    case 'framed-image': return <FramedImage scene={scene} assets={assets} base={publicBasePath} />;
    case 'big-number': return <BigNumber scene={scene} asset={asset} base={publicBasePath} />;
    case 'split-comparison': return <SplitComparison scene={scene} />;
    case 'process': return <Process scene={scene} />;
    case 'chart': return <Chart scene={scene} />;
    case 'text-punch': return <TextPunch scene={scene} />;
    case 'cta': return <Cta scene={scene} asset={asset} base={publicBasePath} />;
  }
};

export const FinanceReel: React.FC<FinanceReelProps> = ({
  plan,
  manifest,
  captions,
  publicBasePath,
  captionBottom = 235,
  showCaptions = true,
  debug = false,
}) => {
  const globalFrame = useCurrentFrame();
  let cursorFrames = 0;
  const startsMs: number[] = [];
  const voiceover = manifest.assets.find((asset) => asset.id === plan.voiceoverAssetId);
  let activeScene: FinanceScene | undefined;
  const sequences = plan.scenes.map((scene, index) => {
    const from = cursorFrames;
    const durationInFrames = Math.round(scene.durationSec * plan.fps);
    if (globalFrame >= from && globalFrame < from + durationInFrames) activeScene = scene;
    if (index > 0) startsMs.push((from / plan.fps) * 1000);
    cursorFrames += durationInFrames;
    return <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={`${index + 1}. ${scene.id}`} premountFor={15}><FinanceSceneRenderer scene={scene} manifest={manifest} publicBasePath={publicBasePath} /></Sequence>;
  });
  const captionsVisible = showCaptions && captions.length > 0 && activeScene?.layout !== 'cta';
  return (
    <DebugContext.Provider value={debug}>
      <ThemeProvider value={BRAND}>
        <LivingBackground speed={0.55} />
        {sequences}
        {captionsVisible && <Captions captions={captions} perGroup={4} bottom={captionBottom} size={62} hardBreaksMs={startsMs} instant />}
        {voiceover && <Voiceover src={joinPublicPath(publicBasePath, voiceover.file)} playbackRate={1} />}
        <PremiumGrade intensity="subtle" bloomColor="80,255,140" />
      </ThemeProvider>
    </DebugContext.Provider>
  );
};
