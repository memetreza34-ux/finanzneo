#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {resolveSceneImageAsset, isSafeRelativePath} from './lib/finance-user-asset-discovery.mjs';
import {loadFinanceReelBuildManifest} from './lib/finance-reel-build-manifest.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/prepare-finance-reel-runtime.mjs <projektordner>');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const loaded = loadFinanceReelBuildManifest({projectRoot, technicalRoot, requireReady: true});
const {manifest, runtime} = loaded;
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
if (!fs.existsSync(packageFile)) throw new Error(`Codex-Reel-Paket fehlt: ${packageFile}`);
const reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
if (reel.slug !== manifest.slug) throw new Error(`Manifest-Slug ${manifest.slug} stimmt nicht mit Reel-Slug ${reel.slug} überein.`);

if (reel.timing?.mode !== 'transcript-aligned' || reel.timing?.status !== 'completed') {
  throw new Error('Transkriptbasierte Zeiten fehlen. Zuerst finance:codex-reel:captions ausführen.');
}
if (!isSafeRelativePath(reel.voiceover?.runtimeAsset)) throw new Error('voiceover.runtimeAsset fehlt oder ist unsicher.');
if (!isSafeRelativePath(reel.captions?.asset)) throw new Error('captions.asset fehlt oder ist unsicher.');

const runtimeAudioSource = path.resolve(projectRoot, reel.voiceover.runtimeAsset);
const captionsSource = path.resolve(projectRoot, reel.captions.asset);
if (!runtimeAudioSource.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(runtimeAudioSource) || !fs.statSync(runtimeAudioSource).isFile()) {
  throw new Error(`Runtime-Voiceover fehlt: ${reel.voiceover.runtimeAsset}`);
}
if (!captionsSource.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(captionsSource) || !fs.statSync(captionsSource).isFile()) {
  throw new Error(`Caption-Datei fehlt: ${reel.captions.asset}`);
}

const captions = JSON.parse(fs.readFileSync(captionsSource, 'utf8'));
if (!Array.isArray(captions) || captions.length === 0) throw new Error('Caption-Datei enthält keine Einträge.');

const publicRuntimeRoot = path.join(technicalRoot, 'channels', 'finanzneo', 'public', 'reels', reel.slug);
const publicImageRoot = path.join(publicRuntimeRoot, 'images');
const publicAudioRoot = path.join(publicRuntimeRoot, 'audio');
fs.rmSync(publicRuntimeRoot, {recursive: true, force: true});
fs.mkdirSync(publicImageRoot, {recursive: true});
fs.mkdirSync(publicAudioRoot, {recursive: true});

const runtimeAudioTarget = path.join(publicAudioRoot, 'voiceover-runtime.wav');
fs.copyFileSync(runtimeAudioSource, runtimeAudioTarget);
const runtimeAudioPublic = `reels/${reel.slug}/audio/voiceover-runtime.wav`;

const assets = [];
const scenes = reel.scenes.map((scene, index) => {
  const timing = scene.timing ?? {};
  const startFrame = Number(timing.startFrame);
  const endFrameExclusive = Number(timing.endFrameExclusive);
  if (!Number.isInteger(startFrame) || !Number.isInteger(endFrameExclusive) || endFrameExclusive <= startFrame) {
    throw new Error(`${scene.id}: gültige transkriptbasierte Framegrenzen fehlen.`);
  }

  let image;
  if (scene.type === 'image') {
    const resolved = resolveSceneImageAsset(projectRoot, scene, index);
    if (!resolved.ok) throw new Error(resolved.message);
    const extension = resolved.extension === '.jpeg' ? '.jpg' : resolved.extension;
    const targetName = `${scene.id}${extension}`;
    const target = path.join(publicImageRoot, targetName);
    fs.copyFileSync(resolved.absoluteFile, target);
    image = `reels/${reel.slug}/images/${targetName}`;
    assets.push({
      sceneId: scene.id,
      kind: 'image',
      source: resolved.relativeFile,
      publicFile: image,
      bytes: fs.statSync(target).size,
    });
  }

  return {
    id: scene.id,
    type: scene.type,
    startFrame,
    endFrameExclusive,
    durationInFrames: endFrameExclusive - startFrame,
    kicker: scene.overlay?.kicker ?? '',
    headline: scene.overlay?.headline ?? '',
    body: scene.overlay?.body ?? '',
    ...(image ? {image} : {}),
    ...(scene.image?.motion ? {motion: scene.image.motion} : {}),
  };
});

const fps = Number(reel.composition?.fps ?? 30);
const width = Number(reel.composition?.width ?? 1080);
const height = Number(reel.composition?.height ?? 1920);
const durationInFrames = Number(reel.composition?.durationInFrames);
if (!Number.isInteger(durationInFrames) || durationInFrames <= 0) throw new Error('composition.durationInFrames fehlt.');
if (scenes[0]?.startFrame !== 0) throw new Error('Die erste Szene muss bei Frame 0 beginnen.');
if (scenes.at(-1)?.endFrameExclusive !== durationInFrames) {
  throw new Error(`Letzte Szene endet bei ${scenes.at(-1)?.endFrameExclusive}; Composition endet bei ${durationInFrames}.`);
}
for (let index = 1; index < scenes.length; index += 1) {
  if (scenes[index].startFrame !== scenes[index - 1].endFrameExclusive) {
    throw new Error(`Szenen ${index} und ${index + 1} sind nicht lückenlos.`);
  }
}

const props = {
  slug: reel.slug,
  title: reel.title,
  fps,
  width,
  height,
  durationInFrames,
  runtimeAudio: runtimeAudioPublic,
  captions,
  scenes,
  debug: false,
};

fs.mkdirSync(path.dirname(runtime.propsFileAbsolute), {recursive: true});
fs.mkdirSync(path.dirname(runtime.manifestFileAbsolute), {recursive: true});
fs.writeFileSync(runtime.propsFileAbsolute, `${JSON.stringify(props, null, 2)}\n`);
fs.writeFileSync(runtime.manifestFileAbsolute, `${JSON.stringify({
  version: 'finanzneo-runtime-v1',
  generatedAt: new Date().toISOString(),
  slug: reel.slug,
  compositionId: manifest.composition.id,
  publicRuntimeRoot: path.relative(technicalRoot, publicRuntimeRoot).split(path.sep).join('/'),
  propsFile: path.relative(projectRoot, runtime.propsFileAbsolute).split(path.sep).join('/'),
  runtimeAudio: {
    source: reel.voiceover.runtimeAsset,
    publicFile: runtimeAudioPublic,
    bytes: fs.statSync(runtimeAudioTarget).size,
  },
  captions: {
    source: reel.captions.asset,
    count: captions.length,
  },
  assets,
  scenes: scenes.map(({id, type, startFrame, endFrameExclusive, durationInFrames: sceneDuration, image}) => ({
    id,
    type,
    startFrame,
    endFrameExclusive,
    durationInFrames: sceneDuration,
    ...(image ? {image} : {}),
  })),
}, null, 2)}\n`);

console.log(`✓ Allgemeine Runtime-Assets vorbereitet: ${path.relative(technicalRoot, publicRuntimeRoot)}`);
console.log(`✓ Remotion-Props: ${path.relative(technicalRoot, runtime.propsFileAbsolute)}`);
console.log(`  Reel: ${reel.slug}`);
console.log(`  Bilder: ${assets.length}`);
console.log(`  Captions: ${captions.length}`);
console.log(`  Frames: ${durationInFrames}`);
