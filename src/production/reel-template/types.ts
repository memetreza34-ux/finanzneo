import type {FinanceBackgroundVariant} from '../../design-system';
import type {CaptionWord} from '../../lib/captions';

export type ReelBeatBase = {
  id: string;
  durationInFrames: number;
  background?: FinanceBackgroundVariant;
  kicker?: string;
  headline?: string;
  sourceNote?: string;
};

export type HookBeat = ReelBeatBase & {
  type: 'hook';
  headline: string;
  subline?: string;
  accent?: string;
};

export type ExplainBeat = ReelBeatBase & {
  type: 'explain';
  headline: string;
  body: string;
  bullets?: string[];
};

export type NumberBeat = ReelBeatBase & {
  type: 'number';
  headline: string;
  label: string;
  value: number;
  format?: 'euro' | 'number' | 'percent';
  detail?: string;
  assumptions?: string;
};

export type CompareBeat = ReelBeatBase & {
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

export type ChecklistBeat = ReelBeatBase & {
  type: 'checklist';
  headline: string;
  items: string[];
};

export type ImageBeat = ReelBeatBase & {
  type: 'image';
  headline: string;
  imageSrc: string;
  alt: string;
  /** 0..1 focal point used by adaptive-safe-fill. */
  focalX?: number;
  /** 0..1 focal point used by adaptive-safe-fill. */
  focalY?: number;
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
  /** Real word-level start/end timestamps from the exact final voiceover. */
  captions?: CaptionWord[];
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

    if (beat.type === 'image') {
      if (!beat.imageSrc.trim()) errors.push(`Image-Beat ${beat.id} besitzt keine Bilddatei.`);
      if (beat.focalX !== undefined && (beat.focalX < 0 || beat.focalX > 1)) {
        errors.push(`Image-Beat ${beat.id}: focalX muss zwischen 0 und 1 liegen.`);
      }
      if (beat.focalY !== undefined && (beat.focalY < 0 || beat.focalY > 1)) {
        errors.push(`Image-Beat ${beat.id}: focalY muss zwischen 0 und 1 liegen.`);
      }
    }

    if (beat.type === 'checklist' && beat.items.length === 0) {
      errors.push(`Checklist-Beat ${beat.id} besitzt keine Punkte.`);
    }
  }

  if (config.beats[0]?.type !== 'hook') {
    errors.push('Der erste Beat muss ein Hook sein.');
  }

  if (config.beats[config.beats.length - 1]?.type !== 'cta') {
    errors.push('Der letzte Beat muss ein CTA sein.');
  }

  if (config.captions) {
    for (let index = 0; index < config.captions.length; index += 1) {
      const word = config.captions[index];
      if (!word.word.trim()) errors.push(`Caption-Wort ${index + 1} ist leer.`);
      if (!Number.isFinite(word.start) || !Number.isFinite(word.end) || word.start < 0 || word.end <= word.start) {
        errors.push(`Caption-Wort ${index + 1} benötigt echte start/end-Zeitstempel.`);
      }
      if (index > 0 && word.start < config.captions[index - 1].start) {
        errors.push('Caption-Wörter müssen chronologisch nach echten Audio-Zeitstempeln sortiert sein.');
      }
    }
  }

  return errors;
};
