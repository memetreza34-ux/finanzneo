#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const files = [
  'scripts/lib/load-finance-config.mjs',
  'scripts/lib/create-finance-scene-plan-template.mjs',
  'scripts/lib/create-finance-test-plan.mjs',
  'scripts/new-finance-reel.mjs',
  'scripts/new-finance-week-reel.mjs',
  'scripts/safe-new-finance-week-reel.mjs',
  'scripts/test-finance-scaffold-transaction.mjs',
  'scripts/check-finance-content-package.mjs',
  'scripts/check-finance-readiness.mjs',
  'scripts/run-finance-qa.mjs',
  'scripts/run-finance-qa-from-project.mjs',
  'scripts/validate-finance-project.mjs',
  'scripts/validate-finance-template.mjs',
  'scripts/validate-finanzneo-consistency.mjs',
  'scripts/validate-finanzneo-system.mjs',
  'scripts/test-finance-e2e.mjs',
  'scripts/render-finance-reel.mjs',
  'scripts/export-finance-deliverables.mjs',
];
const errors = [];
for (const relative of files) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    errors.push(`${relative} fehlt.`);
    continue;
  }
  const result = spawnSync(process.execPath, ['--check', absolute], {cwd: root, encoding: 'utf8'});
  if (result.error || result.status !== 0) errors.push(`${relative}: ${result.error?.message ?? result.stderr ?? result.stdout}`.trim());
}
if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log(`✓ Syntaxprüfung bestanden: ${files.length} kritische FinanzNeo-Skripte.`);
