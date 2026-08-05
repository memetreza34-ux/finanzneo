import type {Caption} from '@studio/core';

export type EtfSceneType = 'image' | 'animation';

export type EtfImageMotion = {
  readonly type: string;
  readonly scaleFrom: number;
  readonly scaleTo: number;
  readonly panX: number;
  readonly panY: number;
};

export type EtfRuntimeScene = {
  readonly id: string;
  readonly type: EtfSceneType;
  readonly startFrame: number;
  readonly endFrameExclusive: number;
  readonly durationInFrames: number;
  readonly kicker: string;
  readonly headline: string;
  readonly body?: string;
  readonly image?: string;
  readonly motion?: EtfImageMotion;
};

export type EtfKauf100EuroRenderProps = {
  readonly slug: string;
  readonly title: string;
  readonly fps: number;
  readonly width: number;
  readonly height: number;
  readonly durationInFrames: number;
  readonly runtimeAudio: string;
  readonly captions: Caption[];
  readonly scenes: EtfRuntimeScene[];
  readonly debug?: boolean;
};

export const DEFAULT_ETF_REEL_PROPS: EtfKauf100EuroRenderProps = {
  slug: 'was-passiert-wenn-du-100-euro-in-einen-etf-steckst',
  title: 'Was passiert, wenn du 100 Euro in einen ETF steckst?',
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: 1976,
  runtimeAudio: '',
  captions: [],
  scenes: [
    {
      id: 'scene-01-hook',
      type: 'image',
      startFrame: 0,
      endFrameExclusive: 229,
      durationInFrames: 229,
      kicker: 'ETF EINFACH ERKLÄRT',
      headline: 'Was passiert mit 100 € im ETF?',
      motion: {type: 'two-phase-push-focus', scaleFrom: 1, scaleTo: 1.075, panX: 10, panY: -12},
    },
    {
      id: 'scene-02-order-match',
      type: 'animation',
      startFrame: 229,
      endFrameExclusive: 600,
      durationInFrames: 371,
      kicker: 'DER AUFTRAG',
      headline: 'Die Order sucht ein passendes Angebot',
    },
    {
      id: 'scene-03-settlement',
      type: 'image',
      startFrame: 600,
      endFrameExclusive: 830,
      durationInFrames: 230,
      kicker: 'DER TAUSCH',
      headline: 'Geld raus – ETF-Anteil ins Depot',
      motion: {type: 'two-phase-pan-focus', scaleFrom: 1.035, scaleTo: 1.075, panX: 30, panY: 0},
    },
    {
      id: 'scene-04-fund-basket',
      type: 'image',
      startFrame: 830,
      endFrameExclusive: 1102,
      durationInFrames: 272,
      kicker: 'DEIN BESITZ',
      headline: 'Ein Anteil am ganzen Fonds',
      motion: {type: 'two-phase-pull-focus', scaleFrom: 1.09, scaleTo: 1.015, panX: -8, panY: 8},
    },
    {
      id: 'scene-05-creation',
      type: 'animation',
      startFrame: 1102,
      endFrameExclusive: 1386,
      durationInFrames: 284,
      kicker: 'HINTER DEN KULISSEN',
      headline: 'So können neue ETF-Anteile entstehen',
      body: 'Nur wenn zusätzliche Anteile benötigt werden',
    },
    {
      id: 'scene-06-value-link',
      type: 'image',
      startFrame: 1386,
      endFrameExclusive: 1681,
      durationInFrames: 295,
      kicker: 'DANACH',
      headline: 'Der Anteil folgt dem Fondsvermögen',
      motion: {type: 'two-phase-link-focus', scaleFrom: 1, scaleTo: 1.07, panX: -18, panY: 0},
    },
    {
      id: 'scene-07-payoff',
      type: 'image',
      startFrame: 1681,
      endFrameExclusive: 1976,
      durationInFrames: 295,
      kicker: 'KURZ GESAGT',
      headline: 'Du kaufst einen Fondsanteil',
      body: 'Nicht direkt jede einzelne Aktie',
      motion: {type: 'two-phase-payoff-focus', scaleFrom: 1, scaleTo: 1.06, panX: 0, panY: -6},
    },
  ],
};
