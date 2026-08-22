import type {FinanceBackgroundVariant} from '../../design-system';
import {REEL_CAPTION} from '../../design-system';
import type {CaptionSentence} from '../../lib/captions';
import {validateCaptionSentences} from '../../lib/captions';

export type ReelBeatBase = {
  id: string;
  durationInFrames: number;
  background?: FinanceBackgroundVariant;
  kicker?: string;
  headline?: string;
  sourceNote?: string;
};

export type AnimationMechanism = {
  visualMetaphor: string;
  startState: string;
  action: string;
  endState: string;
};

type MotionBeatBase = ReelBeatBase & {
  motion: AnimationMechanism;
};

export type HookBeat = ReelBeatBase & {
  type: 'hook';
  headline: string;
  subline?: string;
  accent?: string;
};

export type ExplainBeat = MotionBeatBase & {
  type: 'explain';
  headline: string;
  body: string;
  bullets?: string[];
};

export type NumberBeat = MotionBeatBase & {
  type: 'number';
  headline: string;
  label: string;
  value: number;
  format?: 'euro' | 'number' | 'percent';
  detail?: string;
  assumptions?: string;
};

export type CompareBeat = MotionBeatBase & {
  type: 'compare';
  headline: string;
  left: {
    label: string;
    value: string;
    detail?: string;
    tone?: 'positive' | 'negative' | 'neutral';
  };
  right: {
    label: string;
    value: string;
    detail?: string;
    tone?: 'positive' | 'negative' | 'neutral';
  };
};

export type ChecklistBeat = MotionBeatBase & {
  type: 'checklist';
  headline: string;
  items: string[];
};

export type ImageBeat = ReelBeatBase & {
  type: 'image';
  headline: string;
  imageSrc: string;
  alt: string;
};

export type CtaBeat = ReelBeatBase & {
  type: 'cta';
  headline: string;
  body: string;
  keyword?: string;
  offer?: string;
};

export type ReelBeat =
  | HookBeat
  | ExplainBeat
  | NumberBeat
  | CompareBeat
  | ChecklistBeat
  | ImageBeat
  | CtaBeat;

export type ReelConfig = {
  id: string;
  title: string;
  fps?: number;
  audioSrc?: string;
  captions?: CaptionSentence[];
  disclaimer?: string;
  showSafeAreaGuide?: boolean;
  beats: ReelBeat[];
};

export const getReelDurationInFrames = (config: ReelConfig): number =>
  config.beats.reduce((sum, beat) => sum + beat.durationInFrames, 0);

export const validateReelConfig = (config: ReelConfig): string[] => {
  const errors: string[] = [];
  const fps = config.fps ?? 30;
  const durationSeconds = getReelDurationInFrames(config) / fps;

  if (!config.id.trim()) errors.push('Reel-ID fehlt.');
  if (!config.title.trim()) errors.push('Reel-Titel fehlt.');
  if (config.beats.length === 0) errors.push('Mindestens ein Beat ist erforderlich.');

  if (config.captions) {
    errors.push(...validateCaptionSentences(config.captions, REEL_CAPTION));
  }

  if (durationSeconds < 60 || durationSeconds > 90) {
    errors.push(`Reel-Dauer muss zwischen 60 und 90 Sekunden liegen, aktuell ${durationSeconds.toFixed(1)} Sekunden.`);
  }

  const ids = new Set<string>();
  for (const beat of config.beats) {
    if (!beat.id.trim()) errors.push('Ein Beat besitzt keine ID.');
    if (ids.has(beat.id)) errors.push(`Doppelte Beat-ID: ${beat.id}.`);
    ids.add(beat.id);

    if (!Number.isInteger(beat.durationInFrames) || beat.durationInFrames <= 0) {
      errors.push(`Beat ${beat.id} hat keine positive ganzzahlige durationInFrames.`);
    }

    if (beat.type === 'image' && !beat.imageSrc.trim()) {
      errors.push(`Image-Beat ${beat.id} besitzt keine Bilddatei.`);
    }

    if (beat.type === 'checklist' && beat.items.length === 0) {
      errors.push(`Checklist-Beat ${beat.id} besitzt keine Punkte.`);
    }

    if (beat.type === 'explain' || beat.type === 'number' || beat.type === 'compare' || beat.type === 'checklist') {
      const motion = beat.motion;
      for (const field of ['visualMetaphor', 'startState', 'action', 'endState'] as const) {
        if (!motion[field].trim()) errors.push(`Beat ${beat.id}: motion.${field} fehlt.`);
      }
    }
  }

  if (config.beats[0]?.type !== 'hook') {
    errors.push('Der erste Beat muss ein Hook sein.');
  }

  if (config.beats[config.beats.length - 1]?.type !== 'cta') {
    errors.push('Der letzte Beat muss ein CTA sein.');
  }

  return errors;
};
