#!/usr/bin/env node

import {readFileSync, statSync} from 'node:fs';
import {dirname, isAbsolute, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const normalizeWords = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.words)) return data.words;
  if (Array.isArray(data?.segments)) {
    return data.segments.flatMap((segment) => Array.isArray(segment?.words) ? segment.words : []);
  }
  return [];
};

const safeProjectPath = (input) => {
  const absolute = isAbsolute(input) ? resolve(input) : resolve(ROOT, input);
  const rel = relative(ROOT, absolute);

  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`Asset liegt außerhalb des Projekts: ${input}`);
  }

  return absolute;
};

const validateFile = (asset) => {
  const absolute = safeProjectPath(asset.path);
  const stat = statSync(absolute);

  if (!stat.isFile()) throw new Error('Pfad ist keine Datei.');

  const minBytes = Number(asset.minBytes ?? 1);
  if (stat.size < minBytes) {
    throw new Error(`Datei ist zu klein (${stat.size} Bytes, erwartet mindestens ${minBytes}).`);
  }
};

const validateCaption = (asset) => {
  const absolute = safeProjectPath(asset.path);
  const raw = readFileSync(absolute, 'utf8');
  const data = JSON.parse(raw);
  const words = normalizeWords(data).filter((word) =>
    word && typeof word.word === 'string' && Number.isFinite(Number(word.start)) && Number.isFinite(Number(word.end)),
  );

  if (data?.generatedAt === 'placeholder') {
    throw new Error('Caption-Datei ist nur ein Platzhalter. Erzeuge echte Captions mit scripts/captions.py.');
  }

  const minWords = Number(asset.minWords ?? 1);
  if (words.length < minWords) {
    throw new Error(`Zu wenige gültige Wörter (${words.length}, erwartet mindestens ${minWords}).`);
  }
};

export const validateManifest = (manifestPath) => {
  const absoluteManifest = safeProjectPath(manifestPath);
  const manifest = JSON.parse(readFileSync(absoluteManifest, 'utf8'));
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
  const failures = [];

  for (const asset of assets) {
    try {
      if (!asset?.path) throw new Error('Asset-Pfad fehlt.');
      if (asset.type === 'caption') validateCaption(asset);
      else validateFile(asset);
      console.log(`✓ ${asset.path}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${asset?.path ?? '<unbekannt>'}: ${message}`);
      console.error(`✗ ${asset?.path ?? '<unbekannt>'} — ${message}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Noch nicht renderbereit — ${failures.length} Pflicht-Asset(s) fehlen oder sind Platzhalter.\n` +
        '  Voiceover legst du selbst unter public/audio/ ab (bleibt lokal, siehe .gitignore).\n' +
        '  Captions danach mit: python scripts/captions.py <audio.mp3> <captions.json>',
    );
  }

  console.log(`\n✓ ${manifest.name ?? manifest.composition ?? 'Produktion'} ist renderbereit.`);
  return manifest;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifestPath = process.argv[2];

  if (!manifestPath) {
    console.error('Nutzung: node scripts/validate-assets.mjs <manifest.json>');
    process.exit(1);
  }

  try {
    validateManifest(manifestPath);
  } catch (error) {
    console.error(`\n${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
