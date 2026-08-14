#!/usr/bin/env node
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const CONFIG = {
  'drei-konten': {
    reelRoot: 'reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_drei-konten-system',
    publicPath: 'drei-konten-system',
    manifestDir: 'src/reels/drei-konten',
    type: 'legacy'
  },
  'notgroschen': {
    reelRoot: 'reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan',
    publicPath: 'notgroschen',
    manifestDir: 'src/reels/notgroschen',
    type: 'modern'
  },
  'zinseszins': {
    reelRoot: 'reels/2026-08-10_bis_2026-08-16/dienstag/reel-01_zinseszins-zeit',
    publicPath: 'zinseszins',
    manifestDir: 'src/reels/zinseszins',
    type: 'modern'
  },
  'etf-kosten-v2': {
    reelRoot: 'reels/2026-08-10_bis_2026-08-16/mittwoch/reel-01_etf-vs-fonds-kosten-v2',
    publicPath: 'etf-kosten-v2',
    manifestDir: 'src/reels/etf-kosten-v2',
    type: 'modern'
  }
};

const args = process.argv.slice(2);
const reelArg = args[0];

if (!reelArg || reelArg === '--help' || reelArg === '-h') {
  console.log(`Usage: node sync-reel-assets.mjs <reel-name>\n\nAvailable reels:\n${Object.keys(CONFIG).map(name => `  - ${name}`).join('\n')}`);
  process.exit(!reelArg || reelArg === '--help' || reelArg === '-h' ? 0 : 1);
}

const config = CONFIG[reelArg];
if (!config) {
  console.error(`Unknown reel: ${reelArg}`);
  console.log(`Available reels: ${Object.keys(CONFIG).join(', ')}`);
  process.exit(1);
}

const fail = (message) => {
  console.error(`BLOCKED: ${message}`);
  process.exit(1);
};

const imageExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const audioExt = new Set(['.wav', '.mp3', '.m4a', '.aac']);

const reelRoot = resolve(repositoryRoot, config.reelRoot);
const publicRoot = resolve(repositoryRoot, `public/reels/${config.publicPath}`);
const manifestPath = resolve(repositoryRoot, `${config.manifestDir}/asset-manifest.json`);

try {
  mkdirSync(publicRoot, {recursive: true});
  mkdirSync(resolve(repositoryRoot, config.manifestDir), {recursive: true});
  
  if (config.type === 'legacy') {
    const sourceRoot = resolve(reelRoot, '03-szenen/EINZELNE-SZENEN');
    const imageScenes = ['scene-01', 'scene-02', 'scene-03', 'scene-05', 'scene-07', 'scene-10'];
    const manifest = {};
    let copied = 0;
    let centralFallbacks = 0;

    for (const scene of imageScenes) {
      const directory = resolve(sourceRoot, scene);
      if (!existsSync(directory)) fail(`Szenenordner fehlt: ${directory}`);

      const finalImages = readdirSync(directory).filter((file) => {
        if (file.toLowerCase() === 'placeholder.svg') {
          fail(`${scene}: placeholder.svg ist im Szenenordner verboten.`);
        }
        return imageExt.has(extname(file).toLowerCase());
      });

      if (finalImages.length > 1) {
        fail(`${scene}: Mehr als ein finales Bild gefunden: ${finalImages.join(', ')}`);
      }

      if (finalImages.length === 1) {
        for (const file of readdirSync(publicRoot)) {
          if (file.startsWith(`${scene}.`)) rmSync(resolve(publicRoot, file));
        }

        const sourceName = finalImages[0];
        const extension = extname(sourceName).toLowerCase();
        const targetName = `${scene}${extension}`;
        copyFileSync(resolve(directory, sourceName), resolve(publicRoot, targetName));
        manifest[scene] = `reels/${config.publicPath}/${targetName}`;
        copied += 1;
        continue;
      }

      const existingFallback = readdirSync(publicRoot).find((file) => file.startsWith(`${scene}.`));
      if (!existingFallback) {
        fail(`${scene}: Kein finales Bild und kein zentraler technischer Fallback unter public/ vorhanden.`);
      }

      manifest[scene] = `reels/${config.publicPath}/${existingFallback}`;
      centralFallbacks += 1;
    }

    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`✓ ${copied} finale Bilddateien synchronisiert.`);
    console.log(`  ${centralFallbacks} zentrale technische Fallbacks bleiben aktiv; keine Platzhalter liegen in Szenenordnern.`);
  } else {
    const imageRoot = resolve(reelRoot, '03-szenen/00-ALLE-BILDER-HIER-REIN');
    const audioRoot = resolve(reelRoot, '02-audio');
    const indexPath = resolve(reelRoot, '03-szenen/scene-index.json');

    if (!existsSync(indexPath)) fail(`scene-index.json fehlt: ${indexPath}`);
    if (!existsSync(imageRoot)) fail(`Bilderordner fehlt: ${imageRoot}`);
    if (!existsSync(audioRoot)) fail(`Audioordner fehlt: ${audioRoot}`);

    const index = JSON.parse(readFileSync(indexPath, 'utf8'));
    const imageScenes = (index.scenes ?? []).filter((scene) => scene.type === 'image');
    if (imageScenes.length === 0) fail('scene-index.json enthält keine Bildszenen.');

    const expected = imageScenes.map((scene) => ({id: scene.id, file: scene.googleFlowFileName}));
    if (index.coverHeadline && index.coverHeadline.googleFlowFileName) {
      expected.push({id: 'cover', file: index.coverHeadline.googleFlowFileName});
    }

    for (const item of expected) {
      if (!item.file) fail(`${item.id}: googleFlowFileName fehlt im scene-index.json.`);
      const p = resolve(imageRoot, item.file);
      if (!existsSync(p)) fail(`Pflichtbild fehlt: ${p}`);
      if (!imageExt.has(extname(item.file).toLowerCase())) fail(`Nicht unterstütztes Pflichtbild: ${p}`);
    }

    const actualImages = readdirSync(imageRoot).filter((name) => imageExt.has(extname(name).toLowerCase()));
    const expectedNames = new Set(expected.map((item) => item.file));
    const unexpected = actualImages.filter((name) => !expectedNames.has(name));
    if (unexpected.length) fail(`Unerwartete Bilddatei(en) im Zielordner: ${unexpected.join(', ')}. Nur die in scene-index.json erwarteten Nutzerbilder sind erlaubt.`);

    const audioFiles = readdirSync(audioRoot).filter((name) => audioExt.has(extname(name).toLowerCase()));
    if (audioFiles.length === 0) fail(`Finales Voiceover fehlt in ${audioRoot}`);
    if (audioFiles.length > 1) fail(`02-audio muss genau eine finale Audiodatei enthalten; gefunden: ${audioFiles.join(', ')}`);

    for (const old of readdirSync(publicRoot)) {
      if (/^(scene-\d{2}|cover|voiceover)\./.test(old)) rmSync(resolve(publicRoot, old));
    }

    const manifest = {audio: null};
    for (const item of expected) {
      const extension = extname(item.file).toLowerCase();
      const target = `${item.id}${extension}`;
      copyFileSync(resolve(imageRoot, item.file), resolve(publicRoot, target));
      manifest[item.id] = `reels/${config.publicPath}/${target}`;
    }

    const audioExtension = extname(audioFiles[0]).toLowerCase();
    const audioTarget = `voiceover${audioExtension}`;
    copyFileSync(resolve(audioRoot, audioFiles[0]), resolve(publicRoot, audioTarget));
    manifest.audio = `reels/${config.publicPath}/${audioTarget}`;

    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`✓ ${expected.length} Pflichtbilder ausschließlich aus 00-ALLE-BILDER-HIER-REIN synchronisiert.`);
    console.log('✓ Genau ein finales Voiceover ausschließlich aus 02-audio synchronisiert.');
  }
} catch (err) {
  fail(`Unerwarteter Fehler: ${err.message}`);
}
