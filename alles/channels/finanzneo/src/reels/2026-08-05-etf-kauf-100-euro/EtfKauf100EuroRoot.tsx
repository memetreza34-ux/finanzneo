import React from 'react';
import {Composition, type CalculateMetadataFunction} from 'remotion';
import {EtfKauf100EuroReel} from './EtfKauf100EuroReel';
import {
  DEFAULT_ETF_REEL_PROPS,
  type EtfKauf100EuroRenderProps,
} from './types';

export const ETF_KAUF_COMPOSITION_ID = 'FinanzNeoEtfKauf100Euro';

const calculateMetadata: CalculateMetadataFunction<EtfKauf100EuroRenderProps> = ({props}) => ({
  durationInFrames: props.durationInFrames,
  fps: props.fps,
  width: props.width,
  height: props.height,
});

export const EtfKauf100EuroRoot: React.FC = () => (
  <Composition
    id={ETF_KAUF_COMPOSITION_ID}
    component={EtfKauf100EuroReel}
    durationInFrames={DEFAULT_ETF_REEL_PROPS.durationInFrames}
    fps={DEFAULT_ETF_REEL_PROPS.fps}
    width={DEFAULT_ETF_REEL_PROPS.width}
    height={DEFAULT_ETF_REEL_PROPS.height}
    defaultProps={DEFAULT_ETF_REEL_PROPS}
    calculateMetadata={calculateMetadata}
  />
);
