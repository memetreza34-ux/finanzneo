#!/usr/bin/env node

import {existsSync, mkdirSync, renameSync, rmSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validateManifest} from './validate-assets.mjs';

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error('Nutzung: node scripts/render-validated.mjs <manifest.json>');
  process.exit(1);
}

let manifest;
try {
  manifest = validateManifest(manifestPath);
} catch (error) {
  console.error(`\nRender abgebrochen: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const composition = manifest.composition;
const entryPoint = manifest.entryPoint ?? 'src/index.ts';
const output = manifest.output;
const reelProject = typeof manifest.reelProject === 'string' && manifest.reelProject.trim() ? manifest.reelProject : null;

if (!composition || !output) {
  console.error('Render abgebrochen: Manifest benötigt "composition" und "output".');
  process.exit(1);
}

if (reelProject) {
  const preflight = spawnSync(process.execPath, [
    resolve('scripts/validate-phase3-preflight.mjs'),
    reelProject,
    manifestPath,
  ], {stdio: 'inherit'});
  if (preflight.status !== 0) {
    console.error('\n✗ Render nicht gestartet. Phase-3-Preflight ist nicht grün.');
    process.exit(preflight.status ?? 1);
  }
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const premiumDefaults = [
  '--codec=h264',
  '--crf=14',
  '--audio-bitrate=320k',
  '--pixel-format=yuv420p',
  '--image-format=png',
];

const finalOutput = resolve(output);
const candidateOutput = reelProject
  ? finalOutput.replace(/\.mp4$/i, '.phase3-candidate.mp4')
  : finalOutput;

mkdirSync(dirname(candidateOutput), {recursive: true});
if (reelProject) {
  // Kein altes finales MP4 darf nach einem fehlgeschlagenen neuen Build weiter
  // wie ein aktueller Erfolg aussehen.
  if (existsSync(finalOutput)) rmSync(finalOutput, {force: true});
  if (existsSync(candidateOutput)) rmSync(candidateOutput, {force: true});
}

const args = ['remotion', 'render', entryPoint, composition, candidateOutput, ...premiumDefaults];
if (Array.isArray(manifest.renderArgs)) args.push(...manifest.renderArgs.map(String));

console.log(`\nStarte Premium-Render: ${composition} → ${candidateOutput}`);
console.log('Qualität: H.264 · CRF 14 · PNG-Zwischenframes · AAC 320k');
if (reelProject) console.log('Status: PHASE3_CANDIDATE — noch NICHT final freigegeben.\n');
else console.log('');

const result = spawnSync(npx, args, {
  cwd: resolve('.'),
  stdio: 'inherit',
});

if (result.error) {
  if (reelProject && existsSync(candidateOutput)) rmSync(candidateOutput, {force: true});
  console.error(`Render konnte nicht gestartet werden: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  if (reelProject && existsSync(candidateOutput)) rmSync(candidateOutput, {force: true});
  console.error('\n✗ Render fehlgeschlagen. Kein finales MP4 wurde freigegeben.');
  process.exit(result.status ?? 1);
}

if (!reelProject) process.exit(0);

// Future Production V3 normalisiert ausschließlich neue Reels mit explizitem
// Marker. Für alle Legacy/V1/V2-Reels ist dieses Skript ein harmloser No-op.
const audioMaster = spawnSync(process.execPath, [
  resolve('scripts/normalize-future-reel-audio-v3.mjs'),
  reelProject,
  candidateOutput,
], {stdio: 'inherit'});

if (audioMaster.status !== 0) {
  if (existsSync(candidateOutput)) rmSync(candidateOutput, {force: true});
  console.error('\n✗ Candidate-Audio konnte nicht vertragskonform finalisiert werden.');
  console.error('  Candidate wurde entfernt; es existiert KEIN neu freigegebenes finales MP4.');
  process.exit(audioMaster.status ?? 1);
}

const qa = spawnSync(process.execPath, [
  resolve('scripts/validate-render-completeness.mjs'),
  reelProject,
  candidateOutput,
  manifestPath,
], {stdio: 'inherit'});

if (qa.status !== 0) {
  if (existsSync(candidateOutput)) rmSync(candidateOutput, {force: true});
  console.error('\n✗ Candidate hat die Phase-3-Render-QA nicht bestanden.');
  console.error('  Candidate wurde entfernt; es existiert KEIN neu freigegebenes finales MP4.');
  process.exit(qa.status ?? 1);
}

// Zusätzliche V3-QA prüft am echten Candidate die zwei Qualitätshebel, die
// normale Render-QA bewusst nicht für ältere Reels erzwingt: Audio-Lautheit
// und ausreichend große/füllende Animations-Hauptmechanik.
const futureQa = spawnSync(process.execPath, [
  resolve('scripts/validate-future-production-render-v3.mjs'),
  reelProject,
  candidateOutput,
], {stdio: 'inherit'});

if (futureQa.status !== 0) {
  if (existsSync(candidateOutput)) rmSync(candidateOutput, {force: true});
  console.error('\n✗ Candidate hat die Future-Production-V3-Render-QA nicht bestanden.');
  console.error('  Candidate wurde entfernt; es existiert KEIN neu freigegebenes finales MP4.');
  process.exit(futureQa.status ?? 1);
}

if (existsSync(finalOutput)) rmSync(finalOutput, {force: true});
renameSync(candidateOutput, finalOutput);

console.log('\n✓ FINAL_RENDER_QA_PASSED');
console.log(`  Freigegebenes Final-MP4: ${finalOutput}`);
console.log('  Starte jetzt automatisch den finalen Export nach 06-export/.');

const exportResult = spawnSync(process.execPath, [
  resolve('scripts/export-reel.mjs'),
  reelProject,
  finalOutput,
], {stdio: 'inherit'});

if (exportResult.error) {
  console.error(`\n✗ Automatischer Export konnte nicht gestartet werden: ${exportResult.error.message}`);
  process.exit(1);
}
if (exportResult.status !== 0) {
  console.error('\n✗ Render-QA war erfolgreich, aber der automatische 06-export ist fehlgeschlagen.');
  console.error('  Das Reel gilt erst als FINAL_COMPLETE, wenn 06-export vollständig erstellt wurde.');
  process.exit(exportResult.status ?? 1);
}

console.log('\n✓ FINAL_COMPLETE');
console.log('  Finales Reel + universelle Reel-Caption liegen automatisch in 06-export/.');
