#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';

const args = process.argv.slice(2);
const reelDirArg = args.find((arg) => !arg.startsWith('--'));
if (!reelDirArg) {
  console.error('Nutzung: node scripts/validate-finance-project.mjs <projektordner> [--ingest] [--visual-only]');
  process.exit(1);
}
const reelDir = path.resolve(reelDirArg);
if (!fs.existsSync(reelDir) || !fs.statSync(reelDir).isDirectory()) throw new Error(`Projektordner nicht gefunden: ${reelDir}`);
const paths = financeProjectPaths(reelDir);
const run = (script, scriptArgs) => {
  const result = spawnSync(process.execPath, [script, ...scriptArgs], {stdio: 'inherit', env: process.env});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

if (args.includes('--ingest') || !fs.existsSync(paths.manifest)) {
  console.log('→ Asset-Manifest und Bildanalyse erzeugen …');
  run('scripts/ingest-finance-assets.mjs', [reelDir, `--out=${paths.manifest}`]);
}
for (const file of [paths.scenePlan, paths.status, paths.manifest]) if (!fs.existsSync(file)) throw new Error(`Pflichtdatei fehlt: ${path.relative(reelDir, file)}`);
console.log('→ Exakte Pflichtmedien und Dateinamen prüfen …');
run('scripts/check-finance-required-media.mjs', [reelDir]);
console.log('→ Social-Media-Caption prüfen …');
run('scripts/check-finance-social-caption.mjs', [reelDir]);
console.log('→ Skript, Hook, Payoff und Dramaturgie prüfen …');
run('scripts/run-finance-script-qa.mjs', [paths.scenePlan]);
console.log('→ Zwischenüberschriften, Text-Hierarchie und visuelle Taktung prüfen …');
run('scripts/run-finance-creative-qa.mjs', [paths.scenePlan]);
const qaArgs = [paths.scenePlan, paths.manifest, `--out=${paths.qaReport}`];
if (args.includes('--visual-only')) qaArgs.push('--visual-only');
console.log(`→ Finance-Verträge und Qualitätsregeln prüfen (${args.includes('--visual-only') ? 'Visual-Preflight' : 'Final-QA'}) …`);
run('scripts/run-finance-qa-from-project.mjs', qaArgs);
console.log(`✓ Projekt ist technisch, kreativ, visuell und redaktionell freigegeben: ${reelDir}`);
