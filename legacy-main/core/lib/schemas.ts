// ════════════════════════════════════════════════════════════════════════
//  @studio/core/lib — gemeinsame, kanalübergreifende Zod-Schemas.
//  Kanalverträge bleiben in ihrem Kanal. Finance V1 wird ausschließlich
//  durch scripts/lib/finance-contracts.mjs validiert.
// ════════════════════════════════════════════════════════════════════════
import {z} from 'zod';

/** Ein Caption-Token im @remotion/captions-Format. */
export const Caption = z.object({
  text: z.string(),
  startMs: z.number().nonnegative(),
  endMs: z.number().nonnegative(),
  timestampMs: z.number().nullable().optional(),
  confidence: z.number().nullable().optional(),
});
export type Caption = z.infer<typeof Caption>;

export const Captions = z.array(Caption);

/** Minimale kanalübergreifende Szenen-Konfiguration. */
export const SceneConfig = z.object({
  id: z.string(),
  title: z.string(),
  durationInFrames: z.number().int().positive(),
  fps: z.number().int().positive().default(30),
  audio: z.string().optional(),
  accent: z.string().optional(),
});
export type SceneConfig = z.infer<typeof SceneConfig>;

export const Fact = z.object({
  claim: z.string(),
  source: z.string().optional(),
});
export type Fact = z.infer<typeof Fact>;

export const Source = z.object({
  title: z.string().optional(),
  url: z.string(),
});
export type Source = z.infer<typeof Source>;

export const Brief = z.object({
  topic: z.string(),
  channel: z.string().optional(),
  title: z.string().optional(),
  angle: z.string().optional(),
  audience: z.string().default('DE, Anfänger, „du"'),
  targetLengthSec: z.number().int().positive().optional(),
  keyMessages: z.array(z.string()).default([]),
  facts: z.array(Fact).default([]),
  questions: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  sources: z.array(Source).default([]),
  createdAt: z.string().optional(),
});
export type Brief = z.infer<typeof Brief>;

export const ClipSource = z.enum([
  'flow', 'higgsfield', 'veo', 'sora', 'seedance', 'wan',
  'pexels', 'pixabay', 'mixkit',
  'manual', 'other',
]);
export type ClipSource = z.infer<typeof ClipSource>;

export const Clip = z.object({
  id: z.string(),
  file: z.string(),
  source: ClipSource,
  prompt: z.string().optional(),
  license: z.string().optional(),
  durationSec: z.number().positive().optional(),
  note: z.string().optional(),
});
export type Clip = z.infer<typeof Clip>;

export const ClipManifest = z.array(Clip);
export type ClipManifest = z.infer<typeof ClipManifest>;

/** Helfer: parst und wirft eine klare Fehlermeldung. */
export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, label = 'JSON'): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${label} ungültig:\n${JSON.stringify(result.error.issues, null, 2)}`);
  }
  return result.data;
}
