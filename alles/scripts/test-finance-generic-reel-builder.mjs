#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadFinanceReelBuildManifest} from './lib/finance-reel-build-manifest.mjs';

const technicalRoot = process.cwd();
const repositoryRoot = path.resolve(technicalRoot, '..');
const currentProject = path.join(
  repositoryRoot,
  'reels',
  '2026-08-03_bis_2026-08-09',
  'mittwoch',
  'reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst',
);
const verifier = path.join(technicalRoot, 'scripts', 'verify-finance-prebuilt-reel.mjs');

const verified = spawnSync(process.execPath, [verifier, currentProject], {
  cwd: technicalRoot,
  encoding: 'utf8',
});
if (verified.status !== 0) {
  process.stderr.write(verified.stdout || '');
  process.stderr.write(verified.stderr || '');
  throw new Error('Das registrierte ETF-Reel erfüllt den allgemeinen Prebuild-Vertrag nicht.');
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'finanzneo-future-reel-'));
try {
  const timeline = path.join(tempRoot, 'timeline');
  fs.mkdirSync(timeline, {recursive: true});
  fs.writeFileSync(path.join(timeline, 'reel-build-manifest.json'), JSON.stringify({
    version: 'finanzneo-reel-build-v1',
    slug: 'zukuenftiges-test-reel',
    status: 'awaiting-prebuild',
    codexAnimationCodingRequired: false,
    composition: {
      id: 'FINANCE_TODO_COMPOSITION_ID',
      entryPoint: 'channels/finanzneo/src/reels/zukuenftiges-test-reel/index.ts',
      sourceRoot: 'channels/finanzneo/src/reels/zukuenftiges-test-reel',
    },
    runtime: {
      prepareScript: 'scripts/prepare-finance-reel-runtime.mjs',
      propsFile: 'render/reel-render-props.json',
      manifestFile: 'timeline/runtime-manifest.json',
    },
    expectedSourceFiles: [],
    animations: [],
    outputs: {},
    prebuiltApproval: {
      approvedByPlanningAssistant: false,
      animationsImplemented: false,
      compositionImplemented: false,
    },
  }, null, 2));

  let blocked = false;
  try {
    loadFinanceReelBuildManifest({
      projectRoot: tempRoot,
      technicalRoot,
      requireReady: true,
    });
  } catch (error) {
    blocked = String(error.message).includes('noch nicht vorprogrammiert');
  }
  if (!blocked) throw new Error('Ein zukünftiges Reel ohne Vorprogrammierung wurde nicht blockiert.');
} finally {
  fs.rmSync(tempRoot, {recursive: true, force: true});
}

console.log('✓ Allgemeiner Zukunfts-Reel-Builder-Vertrag bestanden.');
console.log('✓ Prebuilt-Reel wird akzeptiert.');
console.log('✓ Reel im Status awaiting-prebuild wird vor Codex-Codegenerierung blockiert.');
