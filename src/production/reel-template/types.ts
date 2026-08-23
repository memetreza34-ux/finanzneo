import type {
  FinanceBackgroundVariant,
  IconName,
  SceneHeaderTone,
} from '../../design-system';
import type {CaptionWord} from '../../lib/captions';

export type ReelBeatBase = {
  id: string;
  durationInFrames: number;
  background?: FinanceBackgroundVariant;
  kicker?: string;
  headline?: string;
  sourceNote?: string;
  /** Jede Szene braucht ein passendes Linien-Icon für SceneHeader. */
  icon: IconName;
  /** Standard bleibt grün; nur semantisch abweichen. */
  headerTone?: SceneHeaderTone;
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
  objectFit?: 'contain' | 'cover';
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

    if (!beat.icon) {
      errors.push(`Beat ${beat.id} besitzt kein SceneHeader-Icon.`);
    }

    if (beat.type === 'image') {
      if (!beat.imageSrc.trim()) {
        errors.push(`Image-Beat ${beat.id} besitzt keine Bilddatei.`);
      }

      const imageSeconds = beat.durationInFrames / fps;
      if (imageSeconds > 6) {
        errors.push(`Image-Beat ${beat.id} dauert ${imageSeconds.toFixed(1)} s. Maximal 6,0 s; splitten oder animieren.`);
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

  return errors;
};
