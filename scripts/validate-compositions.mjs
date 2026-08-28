#!/usr/bin/env node

import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const sourceRoot = resolve('src');
const allowedRegistryFiles = new Set([
  'src/root/ProductionCompositions.tsx',
  'src/root/ExperimentCompositions.tsx',
  'src/root/ShowcaseCompositions.tsx',
]);
const productionRegistry = 'src/root/ProductionCompositions.tsx';

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = walk(sourceRoot).filter((path) => /\.(tsx?|jsx?)$/.test(path));
const compositionPattern = /<Composition\b[^>]*\bid=["']([^"']+)["'][^>]*\/>/g;

// Dokumentation darf Beispiel-Registrierungen zeigen, ohne die Prüfung auszulösen.
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
const registrations = [];
const errors = [];

for (const absolutePath of sourceFiles) {
  const file = relative(resolve('.'), absolutePath).replaceAll('\\', '/');
  const content = stripComments(readFileSync(absolutePath, 'utf8'));

  for (const match of content.matchAll(compositionPattern)) {
    registrations.push({id: match[1], file});

    if (!allowedRegistryFiles.has(file)) {
      errors.push(
        `Composition "${match[1]}" ist außerhalb der erlaubten Registry-Dateien registriert: ${file}`,
      );
    }
  }
}

if (registrations.length === 0) {
  errors.push('Keine Composition-Registrierungen gefunden.');
}

const byId = new Map();
for (const registration of registrations) {
  const existing = byId.get(registration.id) ?? [];
  existing.push(registration.file);
  byId.set(registration.id, existing);
}

for (const [id, files] of byId) {
  if (files.length > 1) {
    errors.push(`Composition-ID "${id}" ist mehrfach registriert: ${files.join(', ')}`);
  }
}

// Produktions-Registry ist eine Freigabeliste, keine Demo-Sammlung.
// Pre-V9-/Legacy-Reels dürfen dort nicht wieder auftauchen. Sie bleiben in
// ExperimentCompositions sichtbar, bis ein aktuelles Reel den vollständigen
// Phase-3-Fertigkeitsweg bestanden hat.
const productionPath = resolve(productionRegistry);
const productionSource = readFileSync(productionPath, 'utf8');
for (const [pattern, label] of [
  [/\bLegacy[A-Za-z0-9_]*/, 'Legacy-Komponente/-ID'],
  [/einlagensicherung-100000/i, 'pre-V9 Einlagensicherung-Reel'],
  [/<Background\b[^>]*(?:grid|glow)/, 'Legacy Background mit Grid/Glow'],
  [/<Vignette\b/, 'Legacy Vignette'],
  [/FNBg(?:Aurora|Particles|Grid|Radial)/, 'dekorativer FNBg-Hintergrund'],
]) {
  if (pattern.test(productionSource)) {
    errors.push(`${productionRegistry} enthält verbotene Produktionsreferenz: ${label}.`);
  }
}

const productionRegistrations = registrations.filter((entry) => entry.file === productionRegistry);
for (const registration of productionRegistrations) {
  if (/legacy|demo|test|mock|experiment/i.test(registration.id)) {
    errors.push(`Production-Composition-ID "${registration.id}" sieht nach Legacy/Demo/Test aus.`);
  }
}

if (errors.length > 0) {
  console.error('\nComposition-Validierung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const counts = registrations.reduce((result, registration) => {
  result[registration.file] = (result[registration.file] ?? 0) + 1;
  return result;
}, {});

console.log(`\n✓ ${registrations.length} eindeutige Composition-IDs gefunden.`);
for (const [file, count] of Object.entries(counts)) {
  console.log(`  ${count.toString().padStart(2, ' ')} · ${file}`);
}
console.log(`✓ ${productionRegistry} enthält keine Legacy-/Demo-/dekorativen Background-Referenzen.`);
