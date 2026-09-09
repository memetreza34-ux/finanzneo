#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, renameSync, rmSync} from 'node:fs';
import {dirname, relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {analyzeYouTubeReadiness} from './lib/youtube-readiness.mjs';
import {PRODUCTION_MANIFEST} from './lib/youtube-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:render -- youtube/<Projekt>');
  process.exit(1);
}
const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const readiness = analyzeYouTubeReadiness(root);
if (!readiness.ready) {
  console.error('\n✗ YOUTUBE-RENDER BLOCKIERT: Projekt ist nicht vollständig ready.');
  [...readiness.phase1Blockers, ...readiness.phase2Blockers].forEach((blocker) => console.error(`- ${blocker}`));
  process.exit(1);
}

const manifestPath = resolve(root, PRODUCTION_MANIFEST);
if (!existsSync(manifestPath)) {
  console.error(`\n✗ YOUTUBE-RENDER BLOCKIERT: ${PRODUCTION_MANIFEST} fehlt.`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const compositionId = String(manifest.compositionId ?? '').trim();
const entryPoint = String(manifest.entryPoint ?? 'src/index.ts');
const outputFile = resolve(root, String(manifest.outputFile ?? '06-export/final.mp4'));
if (!compositionId) {
  console.error(`${PRODUCTION_MANIFEST}: compositionId fehlt.`);
  process.exit(1);
}

const candidate = outputFile.replace(/\.mp4$/i, '.candidate.mp4');
mkdirSync(dirname(candidate), {recursive: true});
rmSync(candidate, {force: true});
rmSync(outputFile, {force: true});

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = [
  'remotion', 'render', entryPoint, compositionId, candidate,
  '--codec=h264', '--crf=14', '--audio-bitrate=320k', '--pixel-format=yuv420p', '--image-format=png',
];
if (Array.isArray(manifest.renderArgs)) args.push(...manifest.renderArgs.map(String));

console.log(`\nStarte geprüften YouTube-Render: ${compositionId}`);
console.log('Renderziel: Full HD 1920×1080 · 30 fps · H.264 CRF14 · AAC 320k');
const render = spawnSync(npx, args, {cwd: resolve('.'), stdio: 'inherit'});
if (render.error || render.status !== 0) {
  rmSync(candidate, {force: true});
  console.error('\n✗ Render fehlgeschlagen. Kein finales YouTube-MP4 wurde freigegeben.');
  process.exit(render.status ?? 1);
}

const qa = spawnSync(process.execPath, [resolve('scripts/validate-youtube-final-render.mjs'), root, candidate], {stdio: 'inherit'});
if (qa.status !== 0) {
  rmSync(candidate, {force: true});
  console.error('\n✗ Candidate hat die YouTube-Final-QA nicht bestanden und wurde entfernt.');
  process.exit(qa.status ?? 1);
}

renameSync(candidate, outputFile);
console.log('\n✓ YOUTUBE FINAL COMPLETE');
console.log(`  Freigegebenes Finalvideo: ${outputFile}`);
