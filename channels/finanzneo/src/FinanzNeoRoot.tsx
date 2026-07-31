import React from 'react';
import {Composition, type CalculateMetadataFunction} from 'remotion';
import type {Caption} from '@studio/core';
import {getFinanceReelFrames} from './engine/FinanceReel';
import {FinanceProductionLayer} from './engine/FinanceProductionLayer';
import type {FinanceAssetManifest, FinanceScenePlan} from './engine/contracts';
// @ts-ignore — zentrale FinanzNeo-Produktionskonfiguration.
import financeConfig from '../engine/config/finance-v1.json';

export type FinanzNeoRenderProps = {
  plan: FinanceScenePlan;
  manifest: FinanceAssetManifest;
  captions: Caption[];
  publicBasePath: string;
  debug?: boolean;
};

/**
 * Browser-sichere Studio-Vorschau. Produktionsrenders überschreiben diese Props
 * immer mit dem validierten Szenenplan, Manifest und den finalen Captions.
 */
const defaultPlan: FinanceScenePlan = {
  version: 'finance-v1',
  slug: 'finanzneo-preview',
  title: 'FinanzNeo Vorschau',
  fps: 30,
  centralQuestion: 'Wie sieht die FinanzNeo-Produktionscomposition aus?',
  payoff: 'Produktionsdaten werden beim validierten Render als Props übergeben.',
  sources: [],
  scriptText: 'FinanzNeo Vorschau',
  voiceoverInstruction: 'Studio-Vorschau ohne Voiceover.',
  voiceoverAssetId: 'audio-voiceover-final',
  captionsAssetId: 'captions-voiceover-final-captions',
  scenes: [
    {
      id: 'preview',
      durationSec: 4,
      voiceText: 'FinanzNeo Vorschau',
      layout: 'text-punch',
      variant: 'payoff',
      purpose: 'Die datengetriebene FinanzNeo-Composition im Studio sicher anzeigen.',
      visualAction: 'Titel und Hinweis erscheinen in zwei klaren Phasen.',
      visualPhases: [
        {at: 0, action: 'Titel zeigen'},
        {at: 0.45, action: 'Produktionshinweis ergänzen'},
      ],
      semanticChanges: ['Titel', 'Produktionshinweis'],
      assetIds: [],
      content: {
        icon: 'chart',
        kicker: 'STUDIO-VORSCHAU',
        headline: 'FinanzNeo',
        body: 'Validierte Reel-Daten werden beim Render automatisch geladen.',
      },
      transition: 'cut',
      decorativeOnly: false,
    },
  ],
};

const defaultProps: FinanzNeoRenderProps = {
  plan: defaultPlan,
  manifest: {
    version: 'finance-v1',
    slug: defaultPlan.slug,
    root: '.',
    generatedAt: new Date(0).toISOString(),
    assets: [],
  },
  captions: [],
  publicBasePath: 'reels/finanzneo-preview',
  debug: false,
};

const calculateMetadata: CalculateMetadataFunction<FinanzNeoRenderProps> = ({props}) => ({
  durationInFrames: getFinanceReelFrames(props.plan),
  fps: props.plan.fps,
  width: financeConfig.format.width,
  height: financeConfig.format.height,
});

const FinanzNeoProduction: React.FC<FinanzNeoRenderProps> = (props) => (
  <FinanceProductionLayer
    plan={props.plan}
    manifest={props.manifest}
    captions={props.captions}
    publicBasePath={props.publicBasePath}
    captionBottom={financeConfig.captions.bottom}
    captionSize={financeConfig.captions.fontSize}
    captionWordsPerGroup={financeConfig.captions.perGroup}
    debug={props.debug}
  />
);

/**
 * Einziger Remotion-Root des FinanzNeo-Kanals.
 *
 * `FinanzNeo` ist die datengetriebene Produktionscomposition.
 */
export const FinanzNeoRoot: React.FC = () => (
  <>
    <Composition
      id="FinanzNeo"
      component={FinanzNeoProduction}
      durationInFrames={getFinanceReelFrames(defaultPlan)}
      fps={financeConfig.format.fps}
      width={financeConfig.format.width}
      height={financeConfig.format.height}
      defaultProps={defaultProps}
      calculateMetadata={calculateMetadata}
    />
  </>
);
