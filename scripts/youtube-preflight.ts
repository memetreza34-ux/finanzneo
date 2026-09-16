#!/usr/bin/env node
// Letztes Tor vor dem YouTube-Render.
//
// Prüft, dass nichts zwischen Phase-1-Freigabe und Render verrutscht ist: die
// Composition muss zu den aktuellen Projektdaten passen, die Assets müssen
// gespiegelt sein und jede Motion-Szene braucht ihre Bindung. Ein Render, der
// erst in der Mitte auffällt, kostet mehr als diese Prüfung.

import {existsSync, readFileSync, statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {expectedImages, loadYouTubeProject} from './lib/youtube-project';
import {missingYouTubeBindings, missingYouTubeImages} from '../src/youtube/timeline';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:phase3:preflight -- youtube/<Woche>/<Thema>');
  process.exit(1);
}

let project;
try {
  project = loadYouTubeProject(target);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const blockers: string[] = [];

// 1. Phase 1 und 2 müssen abgenommen sein.
const ready = spawnSync(process.execPath, [resolve('scripts/check-youtube-production-ready.mjs'), project.root], {encoding: 'utf8'});
if (ready.status !== 0) {
  blockers.push(`youtube:ready schlägt fehl. Zuerst: npm run youtube:ready -- youtube/${project.slug}`);
}

// 2. Bindungen und Bilddateinamen.
const animationIds = project.index.visuals
  .filter((visual) => visual.animationExport)
  .map((visual) => visual.id);
blockers.push(...missingYouTubeBindings(project.timeline, animationIds));
blockers.push(...missingYouTubeImages(project.timeline));

// 3. Assets müssen unter public/ liegen — dort liest Remotion.
const publicBase = resolve('public/youtube', project.slug);
for (const name of expectedImages(project.index)) {
  const path = resolve(publicBase, 'images', name);
  if (!existsSync(path) || statSync(path).size === 0) {
    blockers.push(`Asset nicht gespiegelt: public/youtube/${project.slug}/images/${name}`);
  }
}
if (!project.audioFileName) {
  blockers.push('Kein eindeutiges Voiceover in 01-script/.');
} else if (!existsSync(resolve(publicBase, 'audio', project.audioFileName))) {
  blockers.push(`Voiceover nicht gespiegelt: public/youtube/${project.slug}/audio/${project.audioFileName}`);
}
if (blockers.some((entry) => entry.includes('nicht gespiegelt'))) {
  blockers.push(`Assets spiegeln: npm run youtube:phase3:stage -- youtube/${project.slug}`);
}

// 4. Die Composition muss den aktuellen Projektdaten entsprechen.
const fileSafe = project.slug.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const timelineFile = resolve('src/youtube/projects', `${fileSafe}.timeline.json`);
if (!existsSync(timelineFile)) {
  blockers.push(`Composition fehlt. Bauen: npm run youtube:phase3:build -- youtube/${project.slug}`);
} else {
  const onDisk = readFileSync(timelineFile, 'utf8').trim();
  const current = JSON.stringify(project.timeline, null, 2).trim();
  if (onDisk !== current) {
    blockers.push(`Composition ist veraltet — Projektdaten haben sich geändert. Neu bauen: npm run youtube:phase3:build -- youtube/${project.slug}`);
  }
}

if (project.timeline.notes.length > 0) {
  console.log(`\n${project.timeline.notes.length} Hinweis(e) zur Szenenzuordnung:`);
  project.timeline.notes.forEach((note) => console.log(`  - ${note}`));
}

if (blockers.length > 0) {
  console.error('\n✗ Render blockiert:');
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
  process.exit(1);
}

console.log(`\n✓ Preflight bestanden: ${project.compositionId}`);
console.log(`  ${project.timeline.scenes.length} Szenen · ${(project.timeline.durationInFrames / project.timeline.fps).toFixed(1)} s · ${project.audioFileName}`);
