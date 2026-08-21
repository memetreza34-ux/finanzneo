#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {isProtectedPath} from './lib/protected-files.mjs';

if (process.env.FINANZNEO_ALLOW_PROTECTED_CHANGES === '1') {
  console.log('Geschützte Dateien: bewusste Einmalfreigabe erkannt.');
  process.exit(0);
}

const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMRD'], {encoding:'utf8'})
  .split('\n')
  .map((path) => path.trim())
  .filter(Boolean);
const protectedChanges = staged.filter(isProtectedPath);

if (protectedChanges.length === 0) process.exit(0);

console.error('\nCommit blockiert: geschützte FinanzNeo-Kerndateien wurden geändert.');
protectedChanges.forEach((path) => console.error(`- ${path}`));
console.error('\nWenn diese Änderungen ausdrücklich beabsichtigt und geprüft sind:');
console.error('FINANZNEO_ALLOW_PROTECTED_CHANGES=1 git commit');
process.exit(1);
