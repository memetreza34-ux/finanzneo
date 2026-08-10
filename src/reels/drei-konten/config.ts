export type AccentTone = 'green' | 'gold';
export type HeadlineIconName =
  | 'wallet'
  | 'coins'
  | 'eye'
  | 'split'
  | 'house'
  | 'calculator'
  | 'shield'
  | 'calendar'
  | 'weeks'
  | 'lock';

export type SceneCopy = {
  headline: string;
  accent: string;
  icon: HeadlineIconName;
  accentTone?: AccentTone;
};

export const DREI_KONTEN_SCENE_TYPES = [
  'image',
  'image',
  'image',
  'animation',
  'image',
  'animation',
  'image',
  'animation',
  'animation',
  'image',
] as const;

// Szenenstarts folgen den tatsächlichen Satzanfängen des finalen Voiceovers.
export const DREI_KONTEN_SCENE_STARTS = [
  0,
  203,
  384,
  526,
  714,
  907,
  1080,
  1272,
  1482,
  1611,
] as const;

export const DREI_KONTEN_DURATIONS = [
  203,
  181,
  142,
  188,
  193,
  173,
  192,
  210,
  129,
  189,
] as const;

export const DREI_KONTEN_SYSTEM_FRAMES = DREI_KONTEN_DURATIONS.reduce(
  (total, duration) => total + duration,
  0,
);

// +3.8 dB gegenüber dem analysierten Referenzrender; finale LUFS-Prüfung bleibt Pflicht.
export const DREI_KONTEN_AUDIO_GAIN = 1.55;

export const SCENE_COPY: readonly SceneCopy[] = [
  {
    headline: 'WARUM DEIN KONTOSTAND',
    accent: 'DICH TÄUSCHT',
    icon: 'wallet',
  },
  {
    headline: 'DEIN EINKOMMEN IST',
    accent: 'NICHT DAS PROBLEM',
    icon: 'coins',
  },
  {
    headline: 'WIE VIEL GELD IST',
    accent: 'WIRKLICH FREI?',
    icon: 'eye',
  },
  {
    headline: 'TEILE DEIN GELD',
    accent: 'AM ZAHLTAG',
    icon: 'split',
  },
  {
    headline: 'KONTO 1 SCHÜTZT',
    accent: 'DEINE FIXKOSTEN',
    icon: 'house',
  },
  {
    headline: 'WAS BLEIBT NACH',
    accent: 'DEN FIXKOSTEN?',
    icon: 'calculator',
    accentTone: 'gold',
  },
  {
    headline: 'KONTO 2 BAUT',
    accent: 'DEINE RÜCKLAGE',
    icon: 'shield',
  },
  {
    headline: 'JAHRESKOSTEN',
    accent: 'MONATLICH PLANEN',
    icon: 'calendar',
  },
  {
    headline: '600 € WERDEN',
    accent: '4 WOCHEN',
    icon: 'weeks',
  },
  {
    headline: 'GELD ZUERST',
    accent: 'SCHÜTZEN',
    icon: 'lock',
  },
] as const;
