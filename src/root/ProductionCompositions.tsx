import React from 'react';
import {Composition} from 'remotion';
import {FORMAT} from '../brand/tokens';
import {EinlagensicherungReel} from '../reels/einlagensicherung-100000/EinlagensicherungReel';
import {TOTAL_FRAMES} from '../reels/einlagensicherung-100000/timeline';

const FPS = FORMAT.fps;
const VERTICAL = FORMAT.vertical;

/** Freigegebene Produktions-Reels. */
export const ProductionCompositions: React.FC = () => (
  <>
    <Composition
      id="Einlagensicherung100000"
      component={EinlagensicherungReel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      {...VERTICAL}
    />
  </>
);
