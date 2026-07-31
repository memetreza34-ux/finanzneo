import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {PremiumGrade, ThemeProvider, Voiceover} from '@studio/core';
import {BRAND} from '../../brand/brand';
import type {FinanceAsset, FinanceAssetManifest, FinanceScenePlan} from './contracts';
// @ts-ignore — zentrale FinanzNeo-Produktionskonfiguration.
import financeConfig from '../../engine/config/finance-v1.json';

export type FinanceImageFirstReelProps = {
  plan: FinanceScenePlan;
  manifest: FinanceAssetManifest;
  publicBasePath: string;
};

const joinPublicPath = (base: string, file: string): string =>
  [base.replace(/^\/+|\/+$/g, ''), file.replace(/^\/+/, '')].filter(Boolean).join('/');

const findSceneImage = (
  scene: FinanceScenePlan['scenes'][number],
  manifest: FinanceAssetManifest,
): FinanceAsset | undefined => {
  for (const assetId of scene.assetIds ?? []) {
    const asset = manifest.assets.find((item) => item.id === assetId && item.kind === 'image');
    if (asset) return asset;
  }
  return undefined;
};

const resolveImages = (plan: FinanceScenePlan, manifest: FinanceAssetManifest): Array<FinanceAsset | undefined> => {
  const resolved: Array<FinanceAsset | undefined> = [];
  let previous: FinanceAsset | undefined;

  for (const scene of plan.scenes) {
    const current = findSceneImage(scene, manifest) ?? previous;
    resolved.push(current);
    if (current) previous = current;
  }

  let next: FinanceAsset | undefined;
  for (let index = resolved.length - 1; index >= 0; index -= 1) {
    if (resolved[index]) next = resolved[index];
    else if (next) resolved[index] = next;
  }

  return resolved;
};

const motion = financeConfig.visuals.minimalMotion;

const ImageBeat: React.FC<{
  asset?: FinanceAsset;
  publicBasePath: string;
  durationInFrames: number;
  sceneIndex: number;
}> = ({asset, publicBasePath, durationInFrames, sceneIndex}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(1, durationInFrames - 1);
  const direction = sceneIndex % 2 === 0 ? 1 : -1;
  const verticalDirection = sceneIndex % 3 === 0 ? -1 : 1;

  const scale = interpolate(
    frame,
    [0, endFrame],
    [motion.imageScaleStart, motion.imageScaleEnd],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const translateX = interpolate(
    frame,
    [0, endFrame],
    [-motion.imagePanPixels * direction, motion.imagePanPixels * direction],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const translateY = interpolate(
    frame,
    [0, endFrame],
    [-motion.imagePanPixels * 0.35 * verticalDirection, motion.imagePanPixels * 0.35 * verticalDirection],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#07120B', overflow: 'hidden'}}>
      {asset ? (
        <Img
          src={staticFile(joinPublicPath(publicBasePath, asset.file))}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
            transformOrigin: '50% 50%',
          }}
        />
      ) : (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #0B1B11 0%, #050B07 100%)'}} />
      )}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,7,4,0.62) 0%, rgba(2,7,4,0.08) 25%, rgba(2,7,4,0.08) 62%, rgba(2,7,4,0.82) 100%)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 120px rgba(0,0,0,0.28)'}} />
    </AbsoluteFill>
  );
};

export const FinanceImageFirstReel: React.FC<FinanceImageFirstReelProps> = ({
  plan,
  manifest,
  publicBasePath,
}) => {
  const resolvedImages = resolveImages(plan, manifest);
  const voiceover = manifest.assets.find((asset) => asset.id === plan.voiceoverAssetId);
  let cursorFrames = 0;

  const sequences = plan.scenes.map((scene, index) => {
    const from = cursorFrames;
    const durationInFrames = Math.round(scene.durationSec * plan.fps);
    cursorFrames += durationInFrames;

    return (
      <Sequence
        key={scene.id}
        from={from}
        durationInFrames={durationInFrames}
        name={`${index + 1}. ${scene.id} — Bild-Reel`}
        premountFor={Math.round(plan.fps * 0.5)}
      >
        <ImageBeat
          asset={resolvedImages[index]}
          publicBasePath={publicBasePath}
          durationInFrames={durationInFrames}
          sceneIndex={index}
        />
      </Sequence>
    );
  });

  return (
    <ThemeProvider value={BRAND}>
      {sequences}
      {voiceover && <Voiceover src={joinPublicPath(publicBasePath, voiceover.file)} playbackRate={1} />}
      <PremiumGrade intensity="subtle" bloomColor="80,255,140" />
    </ThemeProvider>
  );
};
