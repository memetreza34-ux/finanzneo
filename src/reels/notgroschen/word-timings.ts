import timingData from '../../../reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan/04-caption/word-timings.json';

export type TimedSentence = {id: string; text: string; frames: readonly number[]};

type TimingFile = {
  version: number;
  fps: number;
  subtitleMode: string;
  activeWordColor: string;
  timingStatus: string;
  timingMethod?: string;
  sentences: TimedSentence[];
};

const data = timingData as TimingFile;

if (data.timingStatus !== 'final-audio-aligned') {
  throw new Error(
    'BLOCKED: Notgroschen word-timings.json is not aligned to the final audio. Generate real word-level timings from the final voiceover before rendering.',
  );
}

if (data.timingMethod === 'equal-distribution' || data.timingMethod === 'estimated-even-spacing') {
  throw new Error('BLOCKED: evenly distributed subtitle timings are forbidden. Use real audio word boundaries.');
}

export const NOTGROSCHEN_WORD_TIMINGS: readonly TimedSentence[] = data.sentences;
