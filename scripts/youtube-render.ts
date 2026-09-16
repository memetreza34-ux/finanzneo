#!/usr/bin/env node
// Rendert ein YouTube-Projekt und prüft das Ergebnis.
//
// Eine MP4 allein gilt nicht als fertig. Die Kette ist Preflight → Render →
// Render-QA → Export; jeder Schritt bricht ab, statt ein halbes Video
// weiterzureichen.

import {existsSync, mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {loadYouTubeProject} from './lib/youtube-project';
import {YOUTUBE_FORMAT} from '../src/youtube/layout';

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith('--'));
const skipExport = args.includes('--no-export');

if (!target) {
  console.error('Nutzung: npm run youtube:render -- youtube/<Woche>/<Thema> [--no-export]');
  process.exit(1);
}

const step = (label: string, command: string, commandArgs: string[]) => {
  console.log(`\n── ${label} ──`);
  const result = spawnSync(command, commandArgs, {stdio: 'inherit'});
  if (result.status !== 0) {
    console.error(`\n✗ Abgebrochen bei: ${label}`);
    process.exit(result.status ?? 1);
  }
};

let project;
try {
  project = loadYouTubeProject(target);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

step('Preflight', process.execPath, ['--import', 'tsx', resolve('scripts/youtube-preflight.ts'), project.root]);

const outDirectory = resolve('out/youtube', project.slug);
mkdirSync(outDirectory, {recursive: true});
const outFile = resolve(outDirectory, 'video.mp4');

step('Render', 'npx', [
  'remotion', 'render', 'src/index.ts', project.compositionId, outFile,
  '--codec=h264',
  '--crf=16',
  '--image-format=png',
  `--width=${YOUTUBE_FORMAT.width}`,
  `--height=${YOUTUBE_FORMAT.height}`,
]);

if (!existsSync(outFile)) {
  console.error('\n✗ Render lieferte keine Datei.');
  process.exit(1);
}

step('Render-QA', process.execPath, ['--import', 'tsx', resolve('scripts/youtube-render-qa.ts'), project.root, outFile]);

if (!skipExport) {
  step('Export', process.execPath, ['--import', 'tsx', resolve('scripts/youtube-export.ts'), project.root, outFile]);
}

console.log(`\n✓ FERTIG: ${project.compositionId}`);
