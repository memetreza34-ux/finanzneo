#!/usr/bin/env node

import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const sourceRoot = resolve('src');
const allowedRegistryFiles = new Set([
  'src/root/ProductionCompositions.tsx',
  'src/root/ExperimentCompositions.tsx',
  'src/root/ShowcaseCompositions.tsx',
]);

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = walk(sourceRoot).filter((path) => /\.(tsx?|jsx?)$/.test(path));
const compositionPattern = /<Composition\b[^>]*\bid=["']([^"']+)["'][^>]*\/>/g;
const registrations = [];
const errors = [];

for (const absolutePath of sourceFiles) {
  const file = relative(resolve('.'), absolutePath).replaceAll('\\', '/');
  const content = readFileSync(absolutePath, 'utf8');

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
