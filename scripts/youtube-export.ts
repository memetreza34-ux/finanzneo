#!/usr/bin/env node
// Legt das fertige Upload-Paket in 03-export/ ab.
//
// Der Ordner ist der einzige Ort, an dem du nach dem Lauf nachsehen musst:
// Video, Thumbnail und die Texte, die beim Hochladen gebraucht werden.

import {copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadYouTubeProject} from './lib/youtube-project';

const [target, videoPath] = process.argv.slice(2);
if (!target || !videoPath) {
  console.error('Nutzung: node --import tsx scripts/youtube-export.ts <Projekt> <video.mp4>');
  process.exit(1);
}

let project;
try {
  project = loadYouTubeProject(target);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

if (!existsSync(videoPath)) {
  console.error(`\n✗ Video fehlt: ${videoPath}`);
  process.exit(1);
}

const exportDirectory = resolve(project.root, '03-export');
mkdirSync(exportDirectory, {recursive: true});

const videoName = `${project.slug.split('/').pop()}.mp4`;
copyFileSync(videoPath, resolve(exportDirectory, videoName));

const thumbnailName = (project.index as {thumbnail?: {googleFlowFileName?: string}}).thumbnail?.googleFlowFileName;
let thumbnailCopied = false;
if (thumbnailName) {
  const source = resolve(project.root, '02-bilder/00-ALLE-BILDER-HIER-REIN', thumbnailName);
  if (existsSync(source)) {
    copyFileSync(source, resolve(exportDirectory, `thumbnail${thumbnailName.slice(thumbnailName.lastIndexOf('.'))}`));
    thumbnailCopied = true;
  }
}

// Kapitel-Zeitstempel aus der echten Timeline, nicht aus einer Schätzung.
const chapters: string[] = [];
let lastChapter = '';
for (const scene of project.timeline.scenes) {
  const visual = project.index.visuals.find((entry) => entry.id === scene.id);
  const chapter = typeof visual?.chapter === 'string' ? visual.chapter : '';
  if (!chapter || chapter === lastChapter) continue;
  const seconds = Math.floor(scene.startFrame / project.timeline.fps);
  const stamp = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  chapters.push(`${stamp} ${chapter}`);
  lastChapter = chapter;
}
if (chapters.length > 0) {
  writeFileSync(resolve(exportDirectory, 'kapitel.txt'), `${chapters.join('\n')}\n`);
}

const size = statSync(resolve(exportDirectory, videoName)).size;
const durationSeconds = project.timeline.durationInFrames / project.timeline.fps;

const summary = [
  `# Export ${project.slug}`,
  '',
  `- Video: ${videoName} (${(size / 1_000_000).toFixed(1)} MB, ${durationSeconds.toFixed(1)} s)`,
  `- Thumbnail: ${thumbnailCopied ? 'übernommen' : 'FEHLT'}`,
  `- Kapitel: ${chapters.length > 0 ? `${chapters.length} aus der Timeline erzeugt` : 'keine chapter-Felder im Visual-Index'}`,
  `- Composition: ${project.compositionId}`,
  '',
  'Titel, Beschreibung, Keywords, Hashtags und Social-Texte liegen unverändert in diesem Ordner.',
  '',
].join('\n');
writeFileSync(resolve(exportDirectory, 'EXPORT.md'), summary);

console.log(`\n✓ Export in ${project.slug}/03-export/`);
console.log(`  ${videoName} · ${(size / 1_000_000).toFixed(1)} MB`);
console.log(`  Thumbnail ${thumbnailCopied ? '✓' : '✗'} · Kapitel ${chapters.length}`);
