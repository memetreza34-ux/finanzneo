#!/usr/bin/env node
import {copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const reelRoot = resolve(
  repositoryRoot,
  'reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_drei-konten-system',
);
const sourceRoot = resolve(reelRoot, '03-szenen/EINZELNE-SZENEN');
const publicRoot = resolve(repositoryRoot, 'public/reels/drei-konten-system');
const manifestPath = resolve(repositoryRoot, 'src/reels/drei-konten/asset-manifest.json');
const imageScenes = ['scene-01', 'scene-02', 'scene-03', 'scene-05', 'scene-07', 'scene-10'];
const finalExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);

mkdirSync(publicRoot, {recursive: true});
const manifest = {};
let copied = 0;
let centralFallbacks = 0;

for (const scene of imageScenes) {
  const directory = resolve(sourceRoot, scene);
  if (!existsSync(directory)) throw new Error(`Szenenordner fehlt: ${directory}`);

  const finalImages = readdirSync(directory).filter((file) => {
    if (file.toLowerCase() === 'placeholder.svg') {
      throw new Error(`${scene}: placeholder.svg ist im Szenenordner verboten.`);
    }
    return finalExtensions.has(extname(file).toLowerCase());
  });

  if (finalImages.length > 1) {
    throw new Error(`${scene}: Mehr als ein finales Bild gefunden: ${finalImages.join(', ')}`);
  }

  if (finalImages.length === 1) {
    for (const file of readdirSync(publicRoot)) {
      if (file.startsWith(`${scene}.`)) rmSync(resolve(publicRoot, file));
    }

    const sourceName = finalImages[0];
    const extension = extname(sourceName).toLowerCase();
    const targetName = `${scene}${extension}`;
    copyFileSync(resolve(directory, sourceName), resolve(publicRoot, targetName));
    manifest[scene] = `reels/drei-konten-system/${targetName}`;
    copied += 1;
    continue;
  }

  const existingFallback = readdirSync(publicRoot).find((file) => file.startsWith(`${scene}.`));
  if (!existingFallback) {
    throw new Error(`${scene}: Kein finales Bild und kein zentraler technischer Fallback unter public/ vorhanden.`);
  }

  manifest[scene] = `reels/drei-konten-system/${existingFallback}`;
  centralFallbacks += 1;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`✓ ${copied} finale Bilddateien synchronisiert.`);
console.log(`  ${centralFallbacks} zentrale technische Fallbacks bleiben aktiv; keine Platzhalter liegen in Szenenordnern.`);
