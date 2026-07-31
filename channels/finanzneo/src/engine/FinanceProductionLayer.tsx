import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Captions, type Caption} from '@studio/core';
import {BRAND} from '../../brand/brand';
import {FinanceImageFirstReel} from './FinanceImageFirstReel';
import {FinanceSceneHeader} from './FinanceSceneHeader';
import type {FinanceAssetManifest, FinanceScenePlan} from './contracts';

export type FinanceProductionLayerProps = {
  plan: FinanceScenePlan;
  manifest: FinanceAssetManifest;
  captions: Caption[];
  publicBasePath: string;
  captionBottom?: number;
  captionSize?: number;
  captionWordsPerGroup?: number;
  debug?: boolean;
};

export const FinanceProductionLayer: React.FC<FinanceProductionLayerProps> = ({
  plan,
  manifest,
  captions,
  publicBasePath,
  captionBottom = 285,
  captionSize = 62,
  captionWordsPerGroup = 4,
}) => {
  let cursorFrames = 0;
  const hardBreaksMs: number[] = [];
  const overlayLayers: React.ReactNode[] = [];

  for (const [sceneIndex, scene] of plan.scenes.entries()) {
    const sceneStart = cursorFrames;
    const durationInFrames = Math.round(scene.durationSec * plan.fps);
    if (sceneIndex > 0) hardBreaksMs.push((sceneStart / plan.fps) * 1000);

    overlayLayers.push(
      <Sequence
        key={`${scene.id}-simple-overlay`}
        from={sceneStart}
        durationInFrames={durationInFrames}
        name={`Überschrift ${scene.id}`}
      >
        <AbsoluteFill style={{pointerEvents: 'none', zIndex: 40}}>
          <div style={{position: 'absolute', top: 58, left: 58, right: 58}}>
            <FinanceSceneHeader
              icon={scene.content.icon}
              label={scene.content.kicker}
              headline={scene.content.headline}
              compact
            />
          </div>
          {scene.layout === 'cta' && scene.content.ctaKeyword && (
            <div
              style={{
                position: 'absolute',
                left: 58,
                right: 58,
                bottom: 430,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  padding: '22px 36px',
                  borderRadius: 24,
                  background: BRAND.accent,
                  color: '#06120A',
                  fontFamily: BRAND.font.display,
                  fontSize: 48,
                  fontWeight: 950,
                  lineHeight: 1,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.34)',
                }}
              >
                {scene.content.ctaKeyword}
              </div>
            </div>
          )}
        </AbsoluteFill>
      </Sequence>,
    );

    cursorFrames += durationInFrames;
  }

  return (
    <>
      <FinanceImageFirstReel
        plan={plan}
        manifest={manifest}
        publicBasePath={publicBasePath}
      />
      {overlayLayers}
      {captions.length > 0 && (
        <Captions
          captions={captions}
          perGroup={captionWordsPerGroup}
          bottom={captionBottom}
          size={captionSize}
          highlight={BRAND.accent}
          hardBreaksMs={hardBreaksMs}
          instant
        />
      )}
    </>
  );
};
