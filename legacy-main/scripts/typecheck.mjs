#!/usr/bin/env node
// Produktionsrelevanter TypeScript-Check für FinanzNeo.
import {execSync} from 'node:child_process';

const IGNORE_PATTERNS = [
  /\/_archive\//,
  /\/vendor-templates\//,
];

let hadRealErrors = false;
let ignoredCount = 0;
let output = '';
try {
  execSync('npx tsc --noEmit -p channels/finanzneo/tsconfig.json', {encoding: 'utf-8', stdio: 'pipe'});
  console.log('✓ finanzneo: keine Fehler');
  process.exit(0);
} catch (err) {
  output = (err.stdout || '') + (err.stderr || '');
}

const lines = output.split('\n');
const realErrorLines = [];
let currentIsIgnored = false;
for (const line of lines) {
  const isNewErrorLine = /\(\d+,\d+\): error/.test(line);
  if (isNewErrorLine) {
    currentIsIgnored = IGNORE_PATTERNS.some((pattern) => pattern.test(line));
    if (currentIsIgnored) ignoredCount++;
  }
  if (!currentIsIgnored && line.trim()) realErrorLines.push(line);
}

if (realErrorLines.length > 0) {
  hadRealErrors = true;
  console.log(`✗ finanzneo: ${realErrorLines.length} Zeile(n) echter Fehler`);
  console.log(realErrorLines.join('\n'));
} else {
  console.log(`✓ finanzneo: keine produktionsrelevanten Fehler (${ignoredCount} Archiv/Vendor-Fehler ignoriert)`);
}

if (hadRealErrors) {
  console.error('\n❌ typecheck fehlgeschlagen — echte Fehler in aktivem Produktionscode.');
  process.exit(1);
}
console.log('\n✅ typecheck erfolgreich.');
