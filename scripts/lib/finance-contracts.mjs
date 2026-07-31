import {z} from 'zod';
import {loadFinanceConfig} from './load-finance-config.mjs';

const config = loadFinanceConfig();
const limits = config.textLimits;

export const LayoutType = z.enum([
  'full-bleed',
  'framed-image',
  'big-number',
  'split-comparison',
  'process',
  'chart',
  'text-punch',
  'cta',
]);

export const LayoutVariant = z.enum([
  'default',
  'detail-focus',
  'split-left',
  'split-right',
  'multi-2',
  'multi-3',
  'multi-4',
  'calculation',
  'calculation-scene',
  'before-after',
  'timeline',
  'timeline-world',
  'three-stage',
  'checklist',
  'payoff',
]);

export const SceneIcon = z.enum([
  'wallet',
  'bank',
  'cart',
  'trend-down',
  'trend-up',
  'percent',
  'calculator',
  'shield',
  'warning',
  'piggy-bank',
  'scale',
  'clock',
  'euro',
  'document',
  'idea',
  'chart',
  'target',
  'coins',
  'home',
  'check',
  'banknote',
  'money',
]);

export const FocusPoint = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  radius: z.number().min(0.05).max(0.5).default(0.2),
  scale: z.number().min(1).max(2).default(1.16),
});

export const VisualPhase = z.object({
  at: z.number().min(0).max(1),
  action: z.string().min(1).max(180),
  assetId: z.string().min(1).optional(),
  focus: FocusPoint.optional(),
});

export const SoundCue = z.object({
  at: z.number().min(0).max(1),
  assetId: z.string().min(1),
  volume: z.number().min(0).max(config.sound.maximumCueVolume).default(config.sound.defaultCueVolume),
});

export const AssetKind = z.enum(['image', 'audio', 'video', 'captions', 'data', 'other']);

export const ImageAnalysis = z.object({
  brightness: z.number().min(0).max(1),
  entropy: z.number().nonnegative(),
  visualDensity: z.enum(['low', 'medium', 'high']),
  recommendedFit: z.enum(['cover', 'contain']),
  focalPoint: z.object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
  }),
  safeTop: z.boolean(),
  safeBottom: z.boolean(),
  perceptualHash: z.string().regex(/^[01]{64}$/),
});

export const Asset = z.object({
  id: z.string().min(1),
  kind: AssetKind,
  role: z.string().min(1),
  file: z.string().min(1),
  extension: z.string().min(1),
  bytes: z.number().int().nonnegative(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  sha256: z.string().length(64).optional(),
  imageAnalysis: ImageAnalysis.optional(),
});

export const AssetManifest = z.object({
  version: z.literal('finance-v1'),
  slug: z.string().min(1),
  root: z.string().min(1),
  generatedAt: z.string().min(1),
  assets: z.array(Asset),
});

const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss YYYY-MM-DD verwenden.');

export const Source = z.object({
  id: z.string().min(1).max(80).optional(),
  title: z.string().min(1).max(180),
  url: z.string().url().optional(),
  claim: z.string().min(1).max(300).optional(),
  publishedAt: DateString.optional(),
  accessedAt: DateString.optional(),
  claimIds: z.array(z.string().min(1).max(80)).default([]),
});

export const Calculation = z.object({
  input: z.number(),
  operation: z.enum(['multiply', 'add', 'subtract', 'divide']),
  operand: z.number(),
  result: z.number(),
  currency: z.literal('EUR').optional(),
  tolerance: z.number().positive().max(1).default(0.01),
});

export const SceneContent = z.object({
  icon: SceneIcon.optional(),
  kicker: z.string().max(limits.kicker).optional(),
  headline: z.string().max(limits.headline).optional(),
  body: z.string().max(limits.body).optional(),
  formula: z.string().max(limits.formula).optional(),
  outcome: z.string().max(limits.outcome).optional(),
  primaryNumber: z.union([z.string().max(24), z.number()]).optional(),
  secondaryNumber: z.union([z.string().max(40), z.number()]).optional(),
  leftLabel: z.string().max(limits.label).optional(),
  rightLabel: z.string().max(limits.label).optional(),
  leftValue: z.union([z.string().max(30), z.number()]).optional(),
  rightValue: z.union([z.string().max(30), z.number()]).optional(),
  steps: z.array(z.string().min(1).max(limits.step)).max(5).optional(),
  chartValues: z.array(z.number()).max(12).optional(),
  chartLabels: z.array(z.string().max(20)).max(12).optional(),
  ctaKeyword: z.string().max(limits.ctaKeyword).optional(),
  ctaBenefit: z.string().max(limits.ctaBenefit).optional(),
  calculation: Calculation.optional(),
}).default({});

export const Scene = z.object({
  id: z.string().min(1),
  durationSec: z.number().positive(),
  voiceText: z.string().min(1),
  imagePrompt: z.string().max(limits.imagePrompt).optional(),
  claimIds: z.array(z.string().min(1).max(80)).default([]),
  layout: LayoutType,
  variant: LayoutVariant.default('default'),
  purpose: z.string().min(1).max(240),
  visualAction: z.string().min(1).max(300),
  visualPhases: z.array(VisualPhase).max(4).default([]),
  soundCues: z.array(SoundCue).max(config.sound.maximumCuesPerScene).default([]),
  semanticChanges: z.array(z.string().min(1).max(160)).min(1).max(4),
  assetIds: z.array(z.string()).default([]),
  content: SceneContent,
  transition: z.enum(['cut', 'push', 'wipe', 'zoom-through', 'match-move']).default('cut'),
  frameZeroMainMotif: z.boolean().optional(),
  decorativeOnly: z.boolean().default(false),
}).superRefine((scene, ctx) => {
  if (scene.visualPhases.length && scene.visualPhases[0].at !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['visualPhases', 0, 'at'],
      message: 'Die erste visuelle Phase muss bei at: 0 beginnen.',
    });
  }

  for (let index = 1; index < scene.visualPhases.length; index += 1) {
    if (scene.visualPhases[index].at <= scene.visualPhases[index - 1].at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['visualPhases', index, 'at'],
        message: 'visualPhases müssen in aufsteigender Reihenfolge liegen.',
      });
    }
  }

  if (scene.durationSec >= config.visuals.minimumPhasesFromSeconds && scene.visualPhases.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['visualPhases'],
      message: `Szenen ab ${config.visuals.minimumPhasesFromSeconds} Sekunden benötigen mindestens zwei visuelle Phasen.`,
    });
  }
});

const normalizeWords = (value) => value
  .toLocaleLowerCase('de-DE')
  .replace(/[„“”"'’]/g, '')
  .replace(/[^a-z0-9äöüß€%]+/gi, ' ')
  .trim()
  .split(/\s+/)
  .filter(Boolean);

export const ScenePlan = z.object({
  version: z.literal('finance-v1'),
  slug: z.string().min(1),
  title: z.string().min(1).max(140),
  fps: z.literal(config.format.fps).default(config.format.fps),
  centralQuestion: z.string().min(1).max(220),
  payoff: z.string().min(1).max(220),
  sources: z.array(Source).default([]),
  scriptText: z.string().min(1),
  voiceoverInstruction: z.string().min(1).max(limits.voiceoverInstruction),
  voiceoverAssetId: z.string().min(1),
  captionsAssetId: z.string().min(1),
  alignment: z.object({
    method: z.literal('transcript-word-alignment'),
    matchRatio: z.number().min(0).max(1),
    generatedAt: z.string().min(1),
  }).optional(),
  scenes: z.array(Scene)
    .min(config.visuals.beats.min)
    .max(config.visuals.beats.max),
}).superRefine((plan, ctx) => {
  const duration = plan.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
  if (duration < config.format.durationSeconds.min || duration > config.format.durationSeconds.max) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['scenes'],
      message: `Gesamtdauer muss ${config.format.durationSeconds.min}–${config.format.durationSeconds.max} Sekunden betragen.`,
    });
  }

  const layoutCount = new Set(plan.scenes.map((scene) => scene.layout)).size;
  if (layoutCount < config.visuals.minimumLayoutTypes) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['scenes'],
      message: `Mindestens ${config.visuals.minimumLayoutTypes} technische Layoutarten sind Pflicht.`,
    });
  }

  const ids = plan.scenes.map((scene) => scene.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['scenes'],
      message: `Doppelte Szenen-IDs: ${[...new Set(duplicates)].join(', ')}`,
    });
  }

  if (!plan.scenes[0]?.frameZeroMainMotif) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['scenes', 0, 'frameZeroMainMotif'],
      message: 'Die erste Szene muss das Hauptmotiv ab Frame 0 bestätigen.',
    });
  }

  const scriptWords = normalizeWords(plan.scriptText);
  const sceneWords = normalizeWords(plan.scenes.map((scene) => scene.voiceText).join(' '));
  if (scriptWords.join(' ') !== sceneWords.join(' ')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['scriptText'],
      message: 'scriptText muss exakt aus den voiceText-Blöcken der Szenen bestehen.',
    });
  }
});

export const Caption = z.object({
  text: z.string(),
  startMs: z.number().nonnegative(),
  endMs: z.number().nonnegative(),
  timestampMs: z.number().nullable().optional(),
  confidence: z.number().nullable().optional(),
});
export const Captions = z.array(Caption).min(1);

export const QaFinding = z.object({
  severity: z.enum(['error', 'warning', 'info']),
  code: z.string().min(1),
  message: z.string().min(1),
  sceneId: z.string().optional(),
});

export const QaReport = z.object({
  version: z.literal('finance-v1'),
  slug: z.string().min(1),
  passed: z.boolean(),
  generatedAt: z.string().min(1),
  metrics: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  findings: z.array(QaFinding),
});

export const RevisionPatch = z.object({
  version: z.literal('finance-v1'),
  slug: z.string().min(1),
  changes: z.array(z.object({
    sceneId: z.string().optional(),
    target: z.string().min(1),
    reason: z.string().min(1),
    instruction: z.string().min(1),
  })).min(1),
});

export const parseJsonFile = async (file, schema, label) => {
  const {readFile} = await import('node:fs/promises');
  const raw = JSON.parse(await readFile(file, 'utf8'));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`${label} ungültig:\n${JSON.stringify(parsed.error.issues, null, 2)}`);
  }
  return parsed.data;
};

export {normalizeWords};
