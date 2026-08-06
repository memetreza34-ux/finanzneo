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
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);

mkdirSync(publicRoot, {recursive: true});
const manifest = {};

for (const scene of imageScenes) {
  const directory = resolve(sourceRoot, scene);
  if (!existsSync(directory)) throw new Error(`Szenenordner fehlt: ${directory}`);

  const candidates = readdirSync(directory).filter((file) => supported.has(extname(file).toLowerCase()));
  const finalImages = candidates.filter((file) => file !== 'placeholder.svg');

  if (finalImages.length > 1) {
    throw new Error(`${scene}: Mehr als ein finales Bild gefunden: ${finalImages.join(', ')}`);
  }

  const sourceName = finalImages[0] ?? (candidates.includes('placeholder.svg') ? 'placeholder.svg' : null);
  if (!sourceName) throw new Error(`${scene}: Kein Bild und kein placeholder.svg vorhanden.`);

  for (const file of readdirSync(publicRoot)) {
    if (file.startsWith(`${scene}.`)) rmSync(resolve(publicRoot, file));
  }

  const extension = extname(sourceName).toLowerCase();
  const targetName = `${scene}${extension}`;
  copyFileSync(resolve(directory, sourceName), resolve(publicRoot, targetName));
  manifest[scene] = `reels/drei-konten-system/${targetName}`;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`✓ ${imageScenes.length} Bildszenen synchronisiert.`);
