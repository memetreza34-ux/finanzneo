#!/usr/bin/env node

import {readdirSync, readFileSync} from 'node:fs';
import {dirname, extname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'public', 'data');

const files = readdirSync(DATA_DIR).filter((file) => extname(file) === '.json').sort();
const errors = [];
const warnings = [];

for (const file of files) {
  const path = join(DATA_DIR, file);
  let data;

  try {
    data = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${file}: ungültiges JSON (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  if (!data.source) errors.push(`${file}: source fehlt`);
  if (!data.fetchedAt) errors.push(`${file}: fetchedAt fehlt`);

  if (data.schemaVersion >= 2) {
    if (!data.kind) errors.push(`${file}: kind fehlt bei schemaVersion >= 2`);
    if (!data.sourceUrl) errors.push(`${file}: sourceUrl fehlt bei schemaVersion >= 2`);
  } else {
    warnings.push(`${file}: Legacy-Snapshot ohne schemaVersion 2; beim nächsten Fetch migrieren.`);
  }

  if (Array.isArray(data.chart)) {
    if (data.chart.length === 0) errors.push(`${file}: chart ist leer`);

    for (const [index, point] of data.chart.entries()) {
      if (point == null || typeof point !== 'object') {
        errors.push(`${file}: chart[${index}] ist kein Objekt`);
        continue;
      }
      if (typeof point.x !== 'string' || point.x.length === 0) errors.push(`${file}: chart[${index}].x fehlt`);
      if (typeof point.y !== 'number' || !Number.isFinite(point.y)) errors.push(`${file}: chart[${index}].y ist keine endliche Zahl`);
    }
  } else if (data.kind === 'timeseries') {
    errors.push(`${file}: timeseries ohne chart[]`);
  }

  if (data.proxyFor && !data.instrumentType) {
    errors.push(`${file}: proxyFor gesetzt, aber instrumentType fehlt`);
  }
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}

console.log(`✓ Daten-Snapshots valide: ${files.length} Datei(en), ${warnings.length} Legacy-Warnung(en).`);
