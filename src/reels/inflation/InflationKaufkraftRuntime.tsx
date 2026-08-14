import React from 'react';
import runtime from './runtime-data.json';
import {InflationKaufkraft} from './InflationKaufkraft';
import type {CaptionWord} from '../../lib/captions';

const sceneStarts = runtime.sceneStarts as number[];
const sceneDurations = runtime.sceneDurations as number[];
const captionWords = runtime.captionWords as CaptionWord[];
const audioSrc = runtime.audioSrc as string | null;

export const INFLATION_FINAL_TOTAL_FRAMES = Math.max(
  1,
  sceneDurations.reduce((sum, value) => sum + value, 0),
);

export const InflationKaufkraftRuntime: React.FC = () => {
  if (runtime.status !== 'ready') {
    throw new Error('BLOCKED: Inflation/Kaufkraft runtime-data.json ist noch nicht final vorbereitet.');
  }
  if (sceneStarts.length !== 10 || sceneDurations.length !== 10 || !audioSrc || !captionWords.length) {
    throw new Error('BLOCKED: finale Inflation/Kaufkraft Runtime-Daten sind unvollständig.');
  }

  return (
    <InflationKaufkraft
      timeline={{sceneStarts, sceneDurations}}
      audioSrc={audioSrc}
      captionWords={captionWords}
      storyboard={false}
    />
  );
};
