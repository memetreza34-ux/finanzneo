#!/usr/bin/env node
import {execFileSync} from 'node:child_process';

try {
  execFileSync('git', ['rev-parse', '--git-dir'], {stdio:'ignore'});
} catch {
  console.error('Kein Git-Repository gefunden.');
  process.exit(1);
}

execFileSync('git', ['config', 'core.hooksPath', '.githooks']);
console.log('✓ FinanzNeo-Git-Schutz aktiv: geschützte Dateien + Direkt-Push-Sperre für main.');
