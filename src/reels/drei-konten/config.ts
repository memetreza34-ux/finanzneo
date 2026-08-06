import {sec} from '../../brand';

export type AccentTone = 'green' | 'gold';

export type SubtitleCue = {
  fromFrame: number;
  toFrame: number;
  text: string;
};

export type SceneCopy = {
  headline: string;
  accent: string;
  accentTone?: AccentTone;
  subtitles: readonly SubtitleCue[];
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

export const DREI_KONTEN_DURATIONS = [
  sec(6),
  sec(6),
  sec(6),
  sec(6),
  sec(6),
  sec(6),
  sec(6),
  sec(6),
  sec(6),
  sec(6),
] as const;

export const DREI_KONTEN_SYSTEM_FRAMES = DREI_KONTEN_DURATIONS.reduce(
  (total, duration) => total + duration,
  0,
);

export const SCENE_COPY: readonly SceneCopy[] = [
  {
    headline: 'WARUM DEIN KONTOSTAND',
    accent: 'DICH TÄUSCHT',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'Warum gibst du Geld aus, das auf deinem einzigen Konto längst für Miete, Jahreskosten und Rücklagen reserviert ist?',
      },
    ],
  },
  {
    headline: 'DEIN EINKOMMEN IST',
    accent: 'NICHT DAS PROBLEM',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 72,
        text: 'Das Problem ist nicht immer dein Einkommen.',
      },
      {
        fromFrame: 72,
        toFrame: 180,
        text: 'Freies und bereits verplantes Geld erscheint als dieselbe Zahl.',
      },
    ],
  },
  {
    headline: 'WIE VIEL GELD IST',
    accent: 'WIRKLICH FREI?',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'Dadurch wirkt dein Kontostand größer, als dein echtes Wochenbudget tatsächlich ist.',
      },
    ],
  },
  {
    headline: 'TEILE DEIN GELD',
    accent: 'AM ZAHLTAG',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'Teile dein Gehalt direkt in drei Bereiche: Fixkosten, Rücklagen und Wochenbudget.',
      },
    ],
  },
  {
    headline: 'KONTO 1 SCHÜTZT',
    accent: 'DEINE FIXKOSTEN',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'Konto eins bezahlt Miete, Strom, Versicherungen und alle festen Abbuchungen – bevor du etwas kaufst.',
      },
    ],
  },
  {
    headline: 'WAS BLEIBT NACH',
    accent: 'DEN FIXKOSTEN?',
    accentTone: 'gold',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'Bei 1.800 Euro Einkommen und 1.100 Euro Fixkosten bleiben 700 Euro übrig.',
      },
    ],
  },
  {
    headline: 'KONTO 2 BAUT',
    accent: 'DEINE RÜCKLAGE',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 108,
        text: 'Von diesen 700 Euro wandert zuerst deine Rücklage auf Konto zwei.',
      },
      {
        fromFrame: 108,
        toFrame: 180,
        text: 'Sie schützt Notfälle und geplante Anschaffungen.',
      },
    ],
  },
  {
    headline: 'JAHRESKOSTEN',
    accent: 'MONATLICH PLANEN',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: '1.200 Euro Versicherung geteilt durch zwölf ergeben 100 Euro Rücklage pro Monat.',
      },
    ],
  },
  {
    headline: '600 € WERDEN',
    accent: '4 WOCHEN',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'Bleiben danach 600 Euro, sind das geteilt durch vier ungefähr 150 Euro pro Woche.',
      },
    ],
  },
  {
    headline: 'GELD ZUERST',
    accent: 'SCHÜTZEN',
    subtitles: [
      {
        fromFrame: 0,
        toFrame: 180,
        text: 'So sparst du nicht, was zufällig übrig bleibt, sondern schützt dein Geld direkt am Zahltag.',
      },
    ],
  },
] as const;
