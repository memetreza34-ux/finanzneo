// Zeitplan für "100.000 € Einlagensicherung: pro Konto oder pro Bank?"
// Quelle: reels/2026-08-24_bis_2026-08-30/donnerstag/reel-01_einlagensicherung-100000/03-szenen/scene-index.json
// Alle Startframes stammen aus den echten Wort-Timings (04-caption/word-timings.json, sentences[].start * 30fps).
import type {IconName, SceneHeaderTone} from '../../brand';

export const FPS = 30;
export const TOTAL_FRAMES = 2855; // 94.98s Voiceover + kurzer Nachlauf

export type SceneMeta = {
  id: string;
  type: 'image' | 'animation';
  startFrame: number;
  durationFrames: number;
  headline: string;
  icon: IconName;
  tone: SceneHeaderTone;
  audioTrigger: string;
  image?: string; // staticFile-Pfad
  objectLabels?: string[];
};

export const SCENES: SceneMeta[] = [
  {
    id: 'scene-01', type: 'image', startFrame: 0, durationFrames: 213,
    headline: 'JEDES KONTO EINZELN? FALSCH', icon: 'cross', tone: 'warning',
    audioTrigger: '100.000 Euro Einlagensicherung klingt',
    image: 'reels/einlagensicherung-100000/images/scene-01.png',
    objectLabels: ['NICHT PRO KONTO', '100.000 €', 'EINE BANK'],
  },
  {
    id: 'scene-02', type: 'animation', startFrame: 213, durationFrames: 156,
    headline: 'DIE GRENZE GILT PRO PERSON UND BANK', icon: 'shield', tone: 'positive',
    audioTrigger: 'Die gesetzliche Grenze gilt grundsätzlich',
  },
  {
    id: 'scene-03', type: 'image', startFrame: 369, durationFrames: 215,
    headline: 'DAS ZÄHLT ALS EINLAGE', icon: 'list', tone: 'default',
    audioTrigger: 'Geschützt sind typischerweise Einlagen',
    image: 'reels/einlagensicherung-100000/images/scene-03.png',
    objectLabels: ['GIRO', 'TAGESGELD', 'FESTGELD', 'SPAREN', 'SPARBRIEF'],
  },
  {
    id: 'scene-04', type: 'animation', startFrame: 584, durationFrames: 125,
    headline: 'MEHRERE KONTEN WERDEN ADDIERT', icon: 'bank', tone: 'warning',
    audioTrigger: 'Hast du bei derselben Bank mehrere Konten',
  },
  {
    id: 'scene-05', type: 'image', startFrame: 709, durationFrames: 253,
    headline: 'ZUSAMMEN SIND ES 110.000 €', icon: 'coins', tone: 'money',
    audioTrigger: 'Beispiel: 60.000 Euro Tagesgeld',
    image: 'reels/einlagensicherung-100000/images/scene-05.png',
    objectLabels: ['60.000 €', '50.000 €', '110.000 €', 'GLEICHE BANK'],
  },
  {
    id: 'scene-06', type: 'animation', startFrame: 962, durationFrames: 237,
    headline: '10.000 € LIEGEN ÜBER DER GRENZE', icon: 'warning', tone: 'warning',
    audioTrigger: 'Gesetzlich geschützt sind regelmäßig',
  },
  {
    id: 'scene-07', type: 'image', startFrame: 1199, durationFrames: 150,
    headline: 'JEDE BANK SCHÜTZT SEPARAT', icon: 'lock', tone: 'positive',
    audioTrigger: 'Bei zwei unterschiedlichen Banken',
    image: 'reels/einlagensicherung-100000/images/scene-07.png',
    objectLabels: ['BANK A', 'BANK B', '100.000 € JE BANK'],
  },
  {
    id: 'scene-08', type: 'animation', startFrame: 1349, durationFrames: 244,
    headline: 'BEIDE BETRÄGE BLEIBEN GESCHÜTZT', icon: 'check', tone: 'positive',
    audioTrigger: 'Zum Beispiel können 80.000 Euro',
  },
  {
    id: 'scene-09', type: 'image', startFrame: 1593, durationFrames: 128,
    headline: 'GEMEINSCHAFTSKONTO WIRD GETEILT', icon: 'wallet', tone: 'default',
    audioTrigger: 'Bei Gemeinschaftskonten',
    image: 'reels/einlagensicherung-100000/images/scene-09.png',
    objectLabels: ['GEMEINSCHAFT', 'PERSON A', 'PERSON B', 'JE 100.000 €'],
  },
  {
    id: 'scene-10', type: 'animation', startFrame: 1721, durationFrames: 212,
    headline: 'ZU ZWEIT BIS 200.000 € GESCHÜTZT', icon: 'shield', tone: 'positive',
    audioTrigger: 'Bei zwei Personen können dadurch',
  },
  {
    id: 'scene-11', type: 'image', startFrame: 1933, durationFrames: 282,
    headline: 'SONDERFALL: BIS 500.000 € MÖGLICH', icon: 'euro', tone: 'money',
    audioTrigger: 'In bestimmten besonderen Lebenssituationen',
    image: 'reels/einlagensicherung-100000/images/scene-11.png',
    objectLabels: ['BESONDERER FALL', 'BIS 500.000 €', 'ZEITLICH BEGRENZT'],
  },
  {
    id: 'scene-12', type: 'animation', startFrame: 2215, durationFrames: 171,
    headline: 'NUR SECHS MONATE LANG', icon: 'calendar', tone: 'warning',
    audioTrigger: 'Dieser erhöhte Schutz kann',
  },
  {
    id: 'scene-13', type: 'image', startFrame: 2386, durationFrames: 181,
    headline: 'AKTIEN UND ETFs ZÄHLEN NICHT DAZU', icon: 'trending', tone: 'default',
    audioTrigger: 'Aktien und ETFs sind keine Einlagen',
    image: 'reels/einlagensicherung-100000/images/scene-13.png',
    objectLabels: ['EINLAGEN', 'AKTIE', 'ETF', 'NICHT DIESE 100.000 €'],
  },
  {
    id: 'scene-14', type: 'image', startFrame: 2567, durationFrames: 187,
    headline: 'PRÜFE, WO DEIN GELD WIRKLICH LIEGT', icon: 'search', tone: 'positive',
    audioTrigger: 'Prüfe deshalb, bei welcher rechtlichen Bank',
    image: 'reels/einlagensicherung-100000/images/scene-14.png',
    objectLabels: ['WELCHE BANK?', 'GESAMTGUTHABEN', 'PRÜFEN'],
  },
  {
    id: 'scene-15', type: 'image', startFrame: 2754, durationFrames: 101,
    headline: 'MERKE: PRO PERSON, PRO BANK', icon: 'target', tone: 'positive',
    audioTrigger: 'Denk immer pro Person und pro Bank',
    image: 'reels/einlagensicherung-100000/images/scene-15.png',
    objectLabels: ['PRO PERSON', 'PRO BANK', 'NICHT PRO KONTO', '100.000 €'],
  },
];

export const AUDIO_SRC = 'reels/einlagensicherung-100000/audio/voiceover.wav';
