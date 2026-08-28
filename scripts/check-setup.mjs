#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('.');
const errors = [];
const notes = [];

const requiredNodeVersion = [20, 19, 0];
const currentNodeVersion = process.versions.node
  .split('.')
  .slice(0, 3)
  .map((part) => Number(part));

const hasValidNodeVersion = currentNodeVersion.length === 3
  && currentNodeVersion.every(Number.isFinite)
  && currentNodeVersion.some((part, index) => {
    const requiredPart = requiredNodeVersion[index];
    if (part > requiredPart) return true;
    if (part < requiredPart) return false;
    return false;
  });

const isExactMinimum = currentNodeVersion.every((part, index) => part === requiredNodeVersion[index]);
const isAboveMinimum = (() => {
  for (let index = 0; index < requiredNodeVersion.length; index += 1) {
    if (currentNodeVersion[index] > requiredNodeVersion[index]) return true;
    if (currentNodeVersion[index] < requiredNodeVersion[index]) return false;
  }
  return false;
})();

if (!currentNodeVersion.every(Number.isFinite) || (!isExactMinimum && !isAboveMinimum)) {
  errors.push(`Node.js 20.19.0 oder neuer erforderlich. Gefunden: ${process.versions.node}.`);
} else {
  notes.push(`Node.js ${process.versions.node} erfüllt die Mindestversion 20.19.0.`);
}

const requiredFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'src/index.ts',
  'src/Root.tsx',
  'src/design-system/index.ts',
  'src/finance/calculations.ts',
  'src/finance/examples.ts',
  'public/fonts/BebasNeue-400.woff2',
  'public/fonts/Inter-400.woff2',
  'public/fonts/Inter-600.woff2',
  'public/fonts/Inter-700.woff2',
  'public/fonts/Inter-800.woff2',
  'public/fonts/Inter-900.woff2',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    errors.push(`Pflichtdatei fehlt: ${file}`);
  }
}

const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

if (existsSync(resolve(root, 'package.json')) && existsSync(resolve(root, 'package-lock.json'))) {
  const packageJson = readJson('package.json');
  const packageLock = readJson('package-lock.json');
  const lockRoot = packageLock?.packages?.[''];

  if (!lockRoot) {
    errors.push('package-lock.json enthält keinen Root-Eintrag unter packages[""] .'.replace(' ]', ']'));
  } else {
    const compareDependencies = (label, expected = {}, actual = {}) => {
      const expectedNames = Object.keys(expected).sort();
      const actualNames = Object.keys(actual).sort();

      for (const name of expectedNames) {
        if (!(name in actual)) {
          errors.push(`${label}: ${name} fehlt im Lockfile-Root.`);
          continue;
        }

        if (expected[name] !== actual[name]) {
          errors.push(`${label}: Versionsbereich für ${name} unterscheidet sich: package.json=${expected[name]}, lockfile=${actual[name]}.`);
        }
      }

      for (const name of actualNames) {
        if (!(name in expected)) {
          errors.push(`${label}: ${name} steht nur im Lockfile-Root, nicht in package.json.`);
        }
      }
    };

    compareDependencies('dependencies', packageJson.dependencies, lockRoot.dependencies);
    compareDependencies('devDependencies', packageJson.devDependencies, lockRoot.devDependencies);
  }
}

if (errors.length > 0) {
  console.error('\nFinanzNeo-Setup ist nicht reproduzierbar:\n');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nBehebe die Punkte vor npm ci, Studio oder Render.');
  process.exit(1);
}

console.log('\n✓ FinanzNeo-Setup-Grundlagen sind vollständig.');
for (const note of notes) console.log(`✓ ${note}`);
console.log('✓ package.json und package-lock.json stimmen im Root überein.');
console.log(`✓ ${requiredFiles.length} Pflichtdateien inklusive lokaler Fonts gefunden.`);
