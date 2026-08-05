// Renderer-Typen für Finance V1.
// Einzige Laufzeitvalidierung: scripts/lib/finance-contracts.mjs

export type FinanceLayout =
  | 'full-bleed'
  | 'framed-image'
  | 'big-number'
  | 'split-comparison'
  | 'process'
  | 'chart'
  | 'text-punch'
  | 'cta';

export type FinanceLayoutVariant =
  | 'default'
  | 'detail-focus'
  | 'split-left'
  | 'split-right'
  | 'multi-2'
  | 'multi-3'
  | 'multi-4'
  | 'calculation'
  | 'calculation-scene'
  | 'before-after'
  | 'timeline'
  | 'timeline-world'
  | 'three-stage'
  | 'checklist'
  | 'payoff';

export type FinanceFocusPoint = {
  x: number;
  y: number;
  radius?: number;
  scale?: number;
};

export type FinanceVisualPhase = {
  at: number;
  action: string;
  assetId?: string;
  focus?: FinanceFocusPoint;
};

export type FinanceSoundCue = {
  at: number;
  assetId: string;
  volume?: number;
};

export type FinanceTransition = 'cut' | 'push' | 'wipe' | 'zoom-through' | 'match-move';

export type FinanceSceneIcon =
  | 'wallet'
  | 'bank'
  | 'cart'
  | 'trend-down'
  | 'trend-up'
  | 'percent'
  | 'calculator'
  | 'shield'
  | 'warning'
  | 'piggy-bank'
  | 'scale'
  | 'clock'
  | 'euro'
  | 'document'
  | 'idea'
  | 'chart'
  | 'target'
  | 'coins'
  | 'home'
  | 'check'
  | 'banknote'
  | 'money';

export type FinanceImageAnalysis = {
  brightness: number;
  entropy: number;
  visualDensity: 'low' | 'medium' | 'high';
  recommendedFit: 'cover' | 'contain';
  focalPoint: {x: number; y: number};
  safeTop: boolean;
  safeBottom: boolean;
  perceptualHash: string;
};

export type FinanceAsset = {
  id: string;
  kind: 'image' | 'audio' | 'video' | 'captions' | 'data' | 'other';
  role: string;
  file: string;
  extension: string;
  bytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  sha256?: string;
  imageAnalysis?: FinanceImageAnalysis;
};

export type FinanceAssetManifest = {
  version: 'finance-v1';
  slug: string;
  root: string;
  generatedAt: string;
  assets: FinanceAsset[];
};

export type FinanceSource = {
  id?: string;
  title: string;
  url?: string;
  claim?: string;
  publishedAt?: string;
  accessedAt?: string;
  claimIds?: string[];
};

export type FinanceCalculation = {
  input: number;
  operation: 'multiply' | 'add' | 'subtract' | 'divide';
  operand: number;
  result: number;
  currency?: 'EUR';
  tolerance?: number;
};

export type FinanceSceneContent = {
  icon?: FinanceSceneIcon;
  kicker?: string;
  headline?: string;
  body?: string;
  formula?: string;
  outcome?: string;
  primaryNumber?: string | number;
  secondaryNumber?: string | number;
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string | number;
  rightValue?: string | number;
  steps?: string[];
  chartValues?: number[];
  chartLabels?: string[];
  ctaKeyword?: string;
  ctaBenefit?: string;
  calculation?: FinanceCalculation;
};

export type FinanceScene = {
  id: string;
  durationSec: number;
  voiceText: string;
  imagePrompt?: string;
  claimIds?: string[];
  layout: FinanceLayout;
  variant?: FinanceLayoutVariant;
  purpose: string;
  visualAction: string;
  visualPhases?: FinanceVisualPhase[];
  soundCues?: FinanceSoundCue[];
  semanticChanges: string[];
  assetIds: string[];
  content: FinanceSceneContent;
  transition: FinanceTransition;
  frameZeroMainMotif?: boolean;
  decorativeOnly?: boolean;
};

export type FinanceScenePlan = {
  version: 'finance-v1';
  slug: string;
  title: string;
  fps: 30;
  centralQuestion: string;
  payoff: string;
  sources: FinanceSource[];
  scriptText: string;
  voiceoverInstruction: string;
  voiceoverAssetId: string;
  captionsAssetId: string;
  alignment?: {
    method: 'transcript-word-alignment';
    matchRatio: number;
    generatedAt: string;
  };
  scenes: FinanceScene[];
};
