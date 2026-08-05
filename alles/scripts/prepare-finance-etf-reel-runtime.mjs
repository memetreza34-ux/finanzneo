#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  resolveSceneImageAsset,
  isSafeRelativePath,
} from './lib/finance-user-asset-discovery.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/prepare-finance-etf-reel-runtime.mjs <projektordner>');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
const timingFile = path.join(projectRoot, 'timeline', 'scene-timing.json');
if (!fs.existsSync(packageFile)) throw new Error(`Codex-Reel-Paket fehlt: ${packageFile}`);
const reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

const expectedSlug = 'was-passiert-wenn-du-100-euro-in-einen-etf-steckst';
if (reel.slug !== expectedSlug) {
  throw new Error(`Dieser Builder ist ausschließlich für ${expectedSlug}; gefunden: ${reel.slug}.`);
}
if (reel.timing?.mode !== 'transcript-aligned' || reel.timing?.status !== 'completed') {
  throw new Error('Transkriptbasierte Zeiten fehlen. Zuerst finance:codex-reel:captions ausführen.');
}
if (!isSafeRelativePath(reel.voiceover?.runtimeAsset)) {
  throw new Error('voiceover.runtimeAsset fehlt oder ist unsicher.');
}
if (!isSafeRelativePath(reel.captions?.asset)) {
  throw new Error('captions.asset fehlt oder ist unsicher.');
}

const runtimeAudioSource = path.resolve(projectRoot, reel.voiceover.runtimeAsset);
const captionsSource = path.resolve(projectRoot, reel.captions.asset);
if (!fs.existsSync(runtimeAudioSource) || !fs.statSync(runtimeAudioSource).isFile()) {
  throw new Error(`Runtime-Voiceover fehlt: ${reel.voiceover.runtimeAsset}`);
}
if (!fs.existsSync(captionsSource) || !fs.statSync(captionsSource).isFile()) {
  throw new Error(`Caption-Datei fehlt: ${reel.captions.asset}`);
}

const captions = JSON.parse(fs.readFileSync(captionsSource, 'utf8'));
if (!Array.isArray(captions) || captions.length === 0) throw new Error('Caption-Datei enthält keine Einträge.');

const fps = Number(reel.composition?.fps ?? 30);
const width = Number(reel.composition?.width ?? 1080);
const height = Number(reel.composition?.height ?? 1920);
const durationInFrames = Number(reel.composition?.durationInFrames);
if (!Number.isFinite(fps) || fps <= 0) throw new Error('composition.fps ist ungültig.');
if (!Number.isInteger(durationInFrames) || durationInFrames <= 0) throw new Error('composition.durationInFrames fehlt.');
if (!Array.isArray(reel.scenes) || reel.scenes.length !== 7) throw new Error('Das vorprogrammierte ETF-Reel benötigt genau sieben Szenen.');

const frameBoundaries = [0];
for (let index = 0; index < reel.scenes.length - 1; index += 1) {
  const endMs = Number(reel.scenes[index]?.timing?.endMs);
  if (!Number.isFinite(endMs) || endMs <= 0) {
    throw new Error(`${reel.scenes[index]?.id ?? `Szene ${index + 1}`}: transcriptbasierte endMs fehlen.`);
  }
  const remainingScenes = reel.scenes.length - index - 1;
  const earliest = frameBoundaries[index] + 1;
  const latest = durationInFrames - remainingScenes;
  const rounded = Math.round(endMs / 1000 * fps);
  frameBoundaries.push(Math.min(latest, Math.max(earliest, rounded)));
}
frameBoundaries.push(durationInFrames);

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
  const startFrame = frameBoundaries[index];
  const endFrameExclusive = frameBoundaries[index + 1];
  const durationInSceneFrames = endFrameExclusive - startFrame;
  if (durationInSceneFrames <= 0) throw new Error(`${scene.id}: normalisierte Szenendauer ist nicht positiv.`);

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
    durationInFrames: durationInSceneFrames,
    kicker: scene.overlay?.kicker ?? '',
    headline: scene.overlay?.headline ?? '',
    body: scene.overlay?.body ?? '',
    ...(image ? {image} : {}),
    ...(scene.image?.motion ? {motion: scene.image.motion} : {}),
  };
});

for (let index = 1; index < scenes.length; index += 1) {
  if (scenes[index].startFrame !== scenes[index - 1].endFrameExclusive) {
    throw new Error(`Szenen ${index} und ${index + 1} sind nach der Normalisierung nicht lückenlos.`);
  }
}
if (scenes[0].startFrame !== 0 || scenes.at(-1).endFrameExclusive !== durationInFrames) {
  throw new Error('Normalisierte Framegrenzen decken die Composition nicht vollständig ab.');
}

const updatedPackage = {
  ...reel,
  scenes: reel.scenes.map((scene, index) => ({
    ...scene,
    durationSec: Number((scenes[index].durationInFrames / fps).toFixed(3)),
    timing: {
      ...(scene.timing ?? {}),
      startFrame: scenes[index].startFrame,
      endFrameExclusive: scenes[index].endFrameExclusive,
      durationInFrames: scenes[index].durationInFrames,
      frameNormalization: 'gapless-rounding',
    },
  })),
};
fs.writeFileSync(packageFile, `${JSON.stringify(updatedPackage, null, 2)}\n`);

if (fs.existsSync(timingFile)) {
  const timing = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
  timing.frameNormalization = 'gapless-rounding';
  timing.durationInFrames = durationInFrames;
  timing.scenes = (timing.scenes ?? []).map((scene, index) => ({
    ...scene,
    startFrame: scenes[index]?.startFrame,
    endFrameExclusive: scenes[index]?.endFrameExclusive,
    durationInFrames: scenes[index]?.durationInFrames,
  }));
  fs.writeFileSync(timingFile, `${JSON.stringify(timing, null, 2)}\n`);
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
  debug: args.includes('--debug'),
};

const propsFile = path.join(projectRoot, 'render', 'etf-kauf-render-props.json');
const manifestFile = path.join(projectRoot, 'timeline', 'etf-kauf-runtime-manifest.json');
fs.mkdirSync(path.dirname(propsFile), {recursive: true});
fs.mkdirSync(path.dirname(manifestFile), {recursive: true});
fs.writeFileSync(propsFile, `${JSON.stringify(props, null, 2)}\n`);
fs.writeFileSync(manifestFile, `${JSON.stringify({
  version: 'finanzneo-etf-runtime-v1',
  generatedAt: new Date().toISOString(),
  slug: reel.slug,
  projectRoot,
  publicRuntimeRoot: path.relative(technicalRoot, publicRuntimeRoot),
  propsFile: path.relative(projectRoot, propsFile),
  frameNormalization: 'gapless-rounding',
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
  scenes: scenes.map(({id, type, startFrame, endFrameExclusive, durationInFrames, image}) => ({
    id,
    type,
    startFrame,
    endFrameExclusive,
    durationInFrames,
    ...(image ? {image} : {}),
  })),
}, null, 2)}\n`);

console.log(`✓ Laufzeit-Assets vorbereitet: ${path.relative(technicalRoot, publicRuntimeRoot)}`);
console.log(`✓ Remotion-Props: ${path.relative(technicalRoot, propsFile)}`);
console.log('✓ Transkriptgrenzen wurden auf lückenlose Renderframes normalisiert.');
console.log(`  Bilder: ${assets.length}`);
console.log(`  Captions: ${captions.length}`);
console.log(`  Frames: ${durationInFrames}`);
