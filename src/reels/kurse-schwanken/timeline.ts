// Zeitplan für "Langfristig hoch, aber nie gerade".
//
// Quelle: reels/2026-09-21_bis_2026-09-27/montag/reel-01_kurse-schwanken/03-szenen/scene-index.json
// Alle Startframes stammen aus den echten Wort-Timings in 04-caption/word-timings.json.
// Geschnitten wird an Satzanfängen, nicht an gleichmäßigen Abständen — nur scene-01
// und scene-02 enden vor dem nächsten Satz, weil ein Bildbeat nach Future-V3 hart
// höchstens 4,0 Sekunden stehen darf und die Pausen sonst im Bild hängen blieben.
import type {IconName, SceneHeaderTone} from '../../brand';

export const FPS = 30;
/** 31,17 s Voiceover: Pausen auf 0,25 s gekappt und 1,10x beschleunigt. */
export const TOTAL_FRAMES = 935;

export const AUDIO_SRC = 'reels/kurse-schwanken/voiceover.m4a';

export type SceneMeta = {
  id: string;
  type: 'image' | 'animation' | 'data';
  startFrame: number;
  durationFrames: number;
  headline: string;
  icon: IconName;
  tone: SceneHeaderTone;
  audioTrigger: string;
  image?: string;
};

export const SCENES: SceneMeta[] = [
  {
    id: 'scene-01', type: 'image', startFrame: 0, durationFrames: 102,
    headline: 'Dein Depot ist rot', icon: 'warning', tone: 'warning',
    audioTrigger: 'Dein Depot ist rot',
    image: 'reels/kurse-schwanken/images/scene-01.png',
  },
  {
    id: 'scene-02', type: 'image', startFrame: 102, durationFrames: 67,
    headline: 'Warte kurz', icon: 'clock', tone: 'default',
    audioTrigger: 'Bevor du das machst',
    image: 'reels/kurse-schwanken/images/scene-02.png',
  },
  {
    id: 'scene-03', type: 'data', startFrame: 169, durationFrames: 240,
    headline: 'Zehn Jahre Weltmarkt', icon: 'trending', tone: 'default',
    audioTrigger: 'Zehn Jahre Weltmarkt',
  },
  {
    id: 'scene-04', type: 'image', startFrame: 409, durationFrames: 67,
    headline: 'Genau hier steigen viele aus', icon: 'cross', tone: 'warning',
    audioTrigger: 'Genau da steigen die meisten aus',
    image: 'reels/kurse-schwanken/images/scene-04.png',
  },
  {
    id: 'scene-05', type: 'animation', startFrame: 476, durationFrames: 168,
    headline: 'Verkaufen macht den Verlust echt', icon: 'repeat', tone: 'warning',
    audioTrigger: 'Wer verkauft, macht den Verlust echt',
  },
  {
    id: 'scene-06', type: 'data', startFrame: 644, durationFrames: 194,
    headline: 'Was daraus wachsen kann', icon: 'coins', tone: 'money',
    audioTrigger: 'Und 200 Euro im Monat',
  },
  {
    id: 'scene-07', type: 'image', startFrame: 838, durationFrames: 48,
    headline: 'Nicht weil du clever warst', icon: 'bulb', tone: 'default',
    audioTrigger: 'Nicht weil du clever warst',
    image: 'reels/kurse-schwanken/images/scene-07.png',
  },
  {
    id: 'scene-08', type: 'image', startFrame: 886, durationFrames: 49,
    headline: 'Sondern weil du drin bleibst', icon: 'shield', tone: 'positive',
    audioTrigger: 'sondern weil du drin geblieben bist',
    image: 'reels/kurse-schwanken/images/scene-08.png',
  },
];
