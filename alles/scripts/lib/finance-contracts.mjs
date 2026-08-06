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
  'shopping-cart',
  'smartphone',
  'workflow',
  'package',
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

export const SceneType = z.enum(['image', 'animation']);

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

export const ProcessImage = z.object({
  startState: z.string().min(8).max(320),
  processPath: z.string().min(8).max(320),
  resultState: z.string().min(8).max(320),
  instantReadabilitySeconds: z.number().positive().max(1),
  decorativeOnly: z.literal(false),
});

export const SceneAnimation = z.object({
  componentName: z.string().min(3).max(160),
  narrativeAction: z.string().min(12).max(500),
  startState: z.string().min(8).max(320),
  endState: z.string().min(8).max(320),
  camera: z.string().min(5).max(320),
  requiredElements: z.array(z.string().min(1).max(180)).min(1).max(12),
  forbiddenPatterns: z.array(z.string().min(1).max(180)).max(12).default([]),
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
  profile: z.literal('finanzneo-scene-header-v2').optional(),
  headlineMinPx: z.number().int().min(72).max(120).optional(),
  maxLines: z.number().int().min(1).max(2).optional(),
  textTone: z.enum(['light', 'dark']).optional(),
  topGradient: z.boolean().optional(),
}).default({});

export const Scene = z.object({
  id: z.string().min(1),
  type: SceneType.optional(),
  durationSec: z.number().positive(),
  voiceText: z.string().min(1),
  imagePrompt: z.string().max(limits.imagePrompt).optional(),
  processImage: ProcessImage.optional(),
  visualFamily: z.string().min(3).max(180).optional(),
  animation: SceneAnimation.optional(),
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

  if (scene.type === 'image' && scene.animation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['animation'],
      message: 'Eine Bildszene darf keinen Animationsvertrag enthalten.',
    });
  }
  if (scene.type === 'animation' && scene.processImage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['processImage'],
      message: 'Eine Animationsszene darf keinen Prozessbildvertrag enthalten.',
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
  visualQualityProfile: z.literal('finanzneo-process-v2').optional(),
  sceneDistribution: z.object({
    targetImageShare: z.number().min(0).max(1),
    targetAnimationShare: z.number().min(0).max(1),
    actualImages: z.number().int().nonnegative(),
    actualAnimations: z.number().int().nonnegative(),
  }).optional(),
  headerProfile: z.literal('finanzneo-scene-header-v2').optional(),
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

  if (plan.visualQualityProfile === 'finanzneo-process-v2') {
    const imageScenes = plan.scenes.filter((scene) => scene.type === 'image');
    const animationScenes = plan.scenes.filter((scene) => scene.type === 'animation');
    const typedScenes = imageScenes.length + animationScenes.length;
    const imageShare = imageScenes.length / plan.scenes.length;
    const animationShare = animationScenes.length / plan.scenes.length;

    if (typedScenes !== plan.scenes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes'],
        message: 'Visual Quality V2 benötigt für jede Szene type: image oder animation.',
      });
    }
    if (plan.headerProfile !== 'finanzneo-scene-header-v2') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['headerProfile'],
        message: 'Visual Quality V2 benötigt headerProfile finanzneo-scene-header-v2.',
      });
    }
    if (imageShare < 0.55 || imageShare > 0.65) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes'],
        message: `Bildanteil muss 55–65 Prozent betragen; gefunden: ${(imageShare * 100).toFixed(1)} Prozent.`,
      });
    }
    if (animationShare < 0.35 || animationShare > 0.45) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes'],
        message: `Animationsanteil muss 35–45 Prozent betragen; gefunden: ${(animationShare * 100).toFixed(1)} Prozent.`,
      });
    }
    if (animationScenes.length > 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes'],
        message: 'Visual Quality V2 erlaubt höchstens vier Animationen.',
      });
    }
    if (plan.sceneDistribution) {
      if (plan.sceneDistribution.targetImageShare !== 0.6 || plan.sceneDistribution.targetAnimationShare !== 0.4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sceneDistribution'],
          message: 'Zielverteilung muss 60 Prozent Bilder und 40 Prozent Animationen sein.',
        });
      }
      if (plan.sceneDistribution.actualImages !== imageScenes.length || plan.sceneDistribution.actualAnimations !== animationScenes.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sceneDistribution'],
          message: 'sceneDistribution stimmt nicht mit den tatsächlichen Szenentypen überein.',
        });
      }
    }

    for (const [index, scene] of plan.scenes.entries()) {
      if (scene.content.profile !== 'finanzneo-scene-header-v2') {
        ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'content', 'profile'], message: 'Scene Header V2 ist Pflicht.'});
      }
      if (!scene.content.icon) {
        ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'content', 'icon'], message: 'Passendes Szenen-Icon ist Pflicht.'});
      }
      if ((scene.content.headlineMinPx ?? 0) < 72) {
        ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'content', 'headlineMinPx'], message: 'Hauptüberschrift muss mindestens 72 px groß sein.'});
      }
      if ((scene.content.maxLines ?? 3) > 2) {
        ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'content', 'maxLines'], message: 'Hauptüberschrift darf höchstens zwei Zeilen nutzen.'});
      }
      if (scene.content.textTone !== 'light' || scene.content.topGradient !== true) {
        ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'content'], message: 'Helle Schrift und oberer Kontrastverlauf sind Pflicht.'});
      }

      if (scene.type === 'image') {
        if (!scene.processImage) {
          ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'processImage'], message: 'Prozessbildvertrag fehlt.'});
        }
        if (scene.visualPhases.length < 2) {
          ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'visualPhases'], message: 'Prozessbilder benötigen mindestens zwei Bewegungsphasen.'});
        }
      }
      if (scene.type === 'animation') {
        if (!scene.animation) {
          ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'animation'], message: 'Animationsvertrag fehlt.'});
        }
        if (scene.visualPhases.length < 3) {
          ctx.addIssue({code: z.ZodIssueCode.custom, path: ['scenes', index, 'visualPhases'], message: 'Animationen benötigen mindestens drei Phasen.'});
        }
      }
    }

    const families = animationScenes.map((scene) => scene.visualFamily).filter(Boolean);
    if (new Set(families).size !== families.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes'],
        message: 'Animationsszenen benötigen unterschiedliche Raum- oder Bewegungslogiken.',
      });
    }
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
