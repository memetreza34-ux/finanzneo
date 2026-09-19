#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('.');
const errors = [];
const notes = [];
const warnings = [];

const requiredNodeVersion = [20, 19, 0];
const currentNodeVersion = process.versions.node
  .split('.')
  .slice(0, 3)
  .map((part) => Number(part));

const isAtLeastVersion = (current, required) => {
  if (current.length !== required.length || current.some((part) => !Number.isFinite(part))) {
    return false;
  }

  for (let index = 0; index < required.length; index += 1) {
    if (current[index] > required[index]) return true;
    if (current[index] < required[index]) return false;
  }

  return true;
};

if (!isAtLeastVersion(currentNodeVersion, requiredNodeVersion)) {
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
    errors.push('package-lock.json enthält keinen Root-Eintrag unter packages[""].');
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

// Die offiziellen Remotion Agent Skills liegen unter .agents/skills/ und sind
// bewusst nicht im Git: sie sind gevendorter Fremdinhalt ohne eigene Lizenz.
// Reproduzierbar macht sie allein skills-lock.json. Fehlt sie oder wurden die
// Skills nie wiederhergestellt, zeigen die committeten Symlinks unter
// .claude/skills/ ins Leere und kein Agent findet die offizielle Remotion-Doku.
// Kein harter Fehler: der Restore braucht Netz und darf npm run validate nicht
// auf einer Maschine ohne Verbindung blockieren.
if (!existsSync(resolve(root, 'skills-lock.json'))) {
  warnings.push('skills-lock.json fehlt. Ohne sie sind die Agent Skills nicht reproduzierbar wiederherstellbar.');
} else {
  const lockedSkills = Object.keys(readJson('skills-lock.json')?.skills ?? {});
  const hasSkillFile = (base, name) => existsSync(resolve(root, base, name, 'SKILL.md'));
  const missing = lockedSkills.filter((name) => !hasSkillFile('.agents/skills', name));
  const unreachable = lockedSkills.filter((name) => !hasSkillFile('.claude/skills', name));
  const firstFew = (list) => `${list.slice(0, 3).join(', ')}${list.length > 3 ? ' …' : ''}`;

  if (lockedSkills.length === 0) {
    warnings.push('skills-lock.json enthält keine Skills.');
  } else if (missing.length > 0) {
    warnings.push(`${missing.length} von ${lockedSkills.length} Agent Skills fehlen unter .agents/skills/ (${firstFew(missing)}). Wiederherstellen: npm run skills:install`);
  } else if (unreachable.length > 0) {
    warnings.push(`${unreachable.length} Symlink(s) unter .claude/skills/ zeigen ins Leere (${firstFew(unreachable)}). Wiederherstellen: npm run skills:install`);
  } else {
    notes.push(`${lockedSkills.length} Agent Skills aus skills-lock.json sind installiert und über .claude/skills/ erreichbar.`);
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

if (warnings.length > 0) {
  console.warn('\nOffene Hinweise:');
  for (const warning of warnings) console.warn(`! ${warning}`);
}
