import {sec} from '../../brand';

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

export const SCENE_COPY = [
  {
    kicker: 'DAS PROBLEM',
    caption:
      'Warum gibst du Geld aus, das auf deinem einzigen Konto längst für Miete, Jahreskosten und Rücklagen reserviert ist?',
  },
  {
    kicker: 'EINE ZAHL',
    caption:
      'Das Problem ist nicht immer dein Einkommen. Freies und bereits verplantes Geld erscheint als dieselbe Zahl.',
  },
  {
    kicker: 'DIE ILLUSION',
    caption:
      'Dadurch wirkt dein Kontostand größer, als dein echtes Wochenbudget tatsächlich ist.',
  },
  {
    kicker: 'AM ZAHLTAG',
    caption:
      'Teile dein Gehalt direkt in drei Bereiche: Fixkosten, Rücklagen und Wochenbudget.',
  },
  {
    kicker: 'KONTO 1',
    caption:
      'Konto eins bezahlt Miete, Strom, Versicherungen und alle festen Abbuchungen – bevor du etwas kaufst.',
  },
  {
    kicker: 'RESTBETRAG',
    caption:
      'Bei 1.800 Euro Einkommen und 1.100 Euro Fixkosten bleiben 700 Euro übrig.',
  },
  {
    kicker: 'KONTO 2',
    caption:
      'Von diesen 700 Euro wandert zuerst deine Rücklage auf Konto zwei. Sie schützt Notfälle und geplante Anschaffungen.',
  },
  {
    kicker: 'JAHRESKOSTEN',
    caption:
      '1.200 Euro Versicherung geteilt durch zwölf ergeben 100 Euro Rücklage pro Monat.',
  },
  {
    kicker: 'KONTO 3',
    caption:
      'Bleiben danach 600 Euro, sind das geteilt durch vier ungefähr 150 Euro pro Woche.',
  },
  {
    kicker: 'DER PAYOFF',
    caption:
      'So sparst du nicht, was zufällig übrig bleibt, sondern schützt dein Geld direkt am Zahltag.',
  },
] as const;
