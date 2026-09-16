// Gemeinsame Basis der YouTube-Phase-3-Skripte.
//
// Bewusst TypeScript, damit hier dieselbe Timeline-Ableitung läuft wie im
// Render: `src/youtube/timeline.ts` ist die einzige Implementierung. Eine zweite
// Kopie in .mjs würde genau so auseinanderlaufen wie früher die Bildprompts.

import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {basename, extname, relative, resolve, sep} from 'node:path';
import {
  buildYouTubeTimeline,
  validateYouTubeTimeline,
  type YouTubeTimeline,
  type YouTubeVisual,
} from '../../src/youtube/timeline';

export const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.aiff', '.aif', '.m4a'];
export const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

export type YouTubeProject = {
  /** Absoluter Projektpfad. */
  root: string;
  /** Pfad relativ zu youtube/, z. B. '2026-09-14_bis_2026-09-20/notgroschen'. */
  slug: string;
  /** Ordner unter public/, identisch mit dem Slug unter youtube/. */
  assetBase: string;
  /** Remotion-Composition-ID. */
  compositionId: string;
  index: {visuals: YouTubeVisual[]; [key: string]: unknown};
  timeline: YouTubeTimeline;
  audioFileName: string | null;
  audioDurationSeconds: number | null;
};

export const resolveProjectRoot = (target: string) => {
  const root = resolve(target);
  const relativeTarget = relative(resolve('youtube'), root);
  if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
    throw new Error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  }
  if (!existsSync(root)) throw new Error(`Projekt existiert nicht: ${target}`);
  return {root, slug: relativeTarget.split(sep).join('/')};
};

/** Remotion erlaubt nur Buchstaben, Ziffern und Bindestriche in einer ID. */
export const compositionIdFor = (slug: string) => `YouTube-${slug.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;

const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

export const listFiles = (directory: string, extensions: string[]) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((entry) => extensions.includes(extname(entry).toLowerCase()))
    .filter((entry) => statSync(resolve(directory, entry)).isFile())
    .sort();
};

export const loadYouTubeProject = (target: string): YouTubeProject => {
  const {root, slug} = resolveProjectRoot(target);

  const indexPath = resolve(root, '04-projekt/visual-index.json');
  if (!existsSync(indexPath)) throw new Error('04-projekt/visual-index.json fehlt.');
  const index = readJson(indexPath);

  const timingsPath = resolve(root, '01-script/word-timings.json');
  if (!existsSync(timingsPath)) throw new Error('01-script/word-timings.json fehlt.');
  const timings = readJson(timingsPath);

  const sentences = Array.isArray(timings.sentences) ? timings.sentences : [];
  const fps = Number(index?.video?.fps) || 30;

  const timeline = buildYouTubeTimeline(index.visuals ?? [], sentences, fps);

  const audioFiles = listFiles(resolve(root, '01-script'), AUDIO_EXTENSIONS);
  const audioFileName = audioFiles.length === 1 ? audioFiles[0] : null;
  const audioDurationSeconds = typeof timings.duration === 'number' && timings.duration > 0 ? timings.duration : null;

  const problems = validateYouTubeTimeline(timeline, audioDurationSeconds ?? undefined);
  if (problems.length > 0) {
    throw new Error(`Timeline ist nicht renderbar:\n- ${problems.join('\n- ')}`);
  }

  return {
    root,
    slug,
    assetBase: `youtube/${slug}`,
    compositionId: compositionIdFor(slug),
    index,
    timeline,
    audioFileName,
    audioDurationSeconds,
  };
};

/** Erwartete Bilddateien laut Visual-Index, inklusive Thumbnail. */
export const expectedImages = (index: YouTubeProject['index']) => {
  const names: string[] = [];
  const thumbnail = (index as {thumbnail?: {googleFlowFileName?: string}}).thumbnail?.googleFlowFileName;
  if (typeof thumbnail === 'string') names.push(thumbnail);
  for (const visual of index.visuals ?? []) {
    if (visual.type === 'image' && visual.googleFlowFileName) {
      names.push(visual.googleFlowFileName);
    }
  }
  return names;
};

export const projectRelative = (project: YouTubeProject, path: string) => (
  `${project.slug}/${basename(path)}`
);
