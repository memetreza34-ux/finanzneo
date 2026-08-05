#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  resolveSceneImageAsset,
  resolveVoiceoverAsset,
  isSafeRelativePath,
} from './lib/finance-user-asset-discovery.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const requireAssets = args.includes('--require-assets');

if (!projectArg) {
  console.error('Nutzung: node scripts/verify-finance-codex-reel-package.mjs <projektordner> [--require-assets]');
  process.exit(1);
}

const projectRoot = path.resolve(projectArg);
const packageCandidates = [
  path.join(projectRoot, 'timeline', 'codex-reel-package.json'),
  path.join(projectRoot, '06-projektdateien', 'codex-reel-package.json'),
];
const packageFile = packageCandidates.find((candidate) => fs.existsSync(candidate));
const errors = [];
const warnings = [];
const resolvedAssets = {voiceover: null, runtimeVoiceover: null, images: []};
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const isText = (value, min = 1) => typeof value === 'string' && value.trim().length >= min;
const normalized = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const isRelativeSafePath = (value) => isSafeRelativePath(value);

if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
  throw new Error(`Projektordner nicht gefunden: ${projectRoot}`);
}
if (!packageFile) {
  throw new Error(`Codex-Reel-Paket fehlt. Erwartet: ${packageCandidates.join(' oder ')}`);
}

let reel;
try {
  reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
} catch (error) {
  throw new Error(`Codex-Reel-Paket ist kein gültiges JSON: ${error.message}`);
}

if (reel.version !== 'finanzneo-codex-reel-v1') fail('version muss finanzneo-codex-reel-v1 sein.');
if (!isText(reel.slug)) fail('slug fehlt.');
if (!isText(reel.title)) fail('title fehlt.');
if (!isText(reel.topic)) fail('topic fehlt.');
if (!/^\d{4}-\d{2}-\d{2}$/.test(reel.publishDate ?? '')) fail('publishDate muss YYYY-MM-DD verwenden.');
if (!isText(reel.centralQuestion, 8)) fail('centralQuestion ist zu kurz oder fehlt.');
if (!isText(reel.payoff, 5)) fail('payoff ist zu kurz oder fehlt.');

const composition = reel.composition ?? {};
if (!isText(composition.id)) fail('composition.id fehlt.');
if (composition.width !== 1080 || composition.height !== 1920) fail('composition muss 1080 × 1920 sein.');
if (composition.fps !== 30) fail('composition.fps muss 30 sein.');
if (composition.durationInFrames !== undefined && (!Number.isInteger(composition.durationInFrames) || composition.durationInFrames < 1)) {
  fail('composition.durationInFrames muss eine positive ganze Zahl sein.');
}

const cover = reel.cover ?? {};
if (!isText(cover.text, 3)) fail('cover.text fehlt oder ist zu kurz.');
if (typeof cover.text === 'string' && cover.text.length > 60) fail('cover.text darf höchstens 60 Zeichen haben.');
if (!isText(cover.sourceSceneId)) fail('cover.sourceSceneId fehlt.');

const voiceover = reel.voiceover ?? {};
if (!isText(voiceover.script, 20)) fail('voiceover.script fehlt oder ist zu kurz.');
const hasVoiceoverDirectory = isRelativeSafePath(voiceover.directory ?? voiceover.assetDirectory);
const hasLegacyVoiceoverAsset = isRelativeSafePath(voiceover.asset);
if (!hasVoiceoverDirectory && !hasLegacyVoiceoverAsset) {
  fail('voiceover benötigt directory (bevorzugt) oder einen sicheren relativen asset-Pfad.');
}
if (voiceover.selection && voiceover.selection !== 'single-supported-file') {
  fail('voiceover.selection muss single-supported-file sein.');
}
const playbackRate = voiceover.processing?.playbackRate;
if (playbackRate !== undefined && (!Number.isFinite(playbackRate) || playbackRate < 0.85 || playbackRate > 1.25)) {
  fail('voiceover.processing.playbackRate muss zwischen 0.85 und 1.25 liegen.');
}
if (playbackRate !== undefined && playbackRate !== 1 && voiceover.processing?.preservePitch !== true) {
  fail('Bei veränderter Sprechgeschwindigkeit muss preservePitch true sein.');
}
if (voiceover.processing?.timingMode === 'transcript-word-alignment') {
  if (voiceover.processing?.transcription?.engine !== 'whisper.cpp') fail('Transkript-Ausrichtung benötigt whisper.cpp als engine.');
  if (voiceover.processing?.transcription?.language !== 'de') fail('Die Transkriptionssprache muss de sein.');
  if (voiceover.processing?.transcription?.tokenLevelTimestamps !== true) fail('Token-Level-Zeitstempel müssen aktiviert sein.');
}

const rules = reel.creativeRules ?? {};
if (rules.mode !== 'image-first-hybrid') fail('creativeRules.mode muss image-first-hybrid sein.');
const maximumAnimationShare = Number.isFinite(rules.maximumAnimationShare) ? rules.maximumAnimationShare : 0.4;
if (maximumAnimationShare <= 0 || maximumAnimationShare > 0.4) fail('maximumAnimationShare muss größer als 0 und höchstens 0.4 sein.');
if (!Number.isInteger(rules.maximumDashboardScenes) || rules.maximumDashboardScenes < 0 || rules.maximumDashboardScenes > 1) {
  fail('maximumDashboardScenes muss 0 oder 1 sein.');
}
if (!Number.isFinite(rules.subtitleSafeBottomPx) || rules.subtitleSafeBottomPx < 260) {
  fail('subtitleSafeBottomPx muss mindestens 260 Pixel betragen.');
}

const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
if (scenes.length < 5 || scenes.length > 9) fail('Es sind 5 bis 9 Szenen erforderlich.');
const sceneIds = scenes.map((scene) => scene?.id).filter(Boolean);
const duplicateIds = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
if (duplicateIds.length) fail(`Doppelte Szenen-IDs: ${[...new Set(duplicateIds)].join(', ')}.`);
if (cover.sourceSceneId && !sceneIds.includes(cover.sourceSceneId)) fail('cover.sourceSceneId verweist auf keine vorhandene Szene.');

let imageCount = 0;
let animationCount = 0;
let dashboardCount = 0;
let totalDuration = 0;
const visualFamilies = new Map();
const narrativeActions = new Set();

for (let index = 0; index < scenes.length; index += 1) {
  const scene = scenes[index] ?? {};
  const label = scene.id || `Szene ${index + 1}`;
  if (!isText(scene.id)) fail(`${label}: id fehlt.`);
  if (!['image', 'animation'].includes(scene.type)) fail(`${label}: type muss image oder animation sein.`);
  if (!Number.isFinite(scene.durationSec) || scene.durationSec < 2.5 || scene.durationSec > 18) {
    fail(`${label}: durationSec muss zwischen 2.5 und 18 Sekunden liegen.`);
  } else {
    totalDuration += scene.durationSec;
  }
  if (!isText(scene.voiceText, 3)) fail(`${label}: voiceText fehlt.`);
  if (!isText(scene.purpose, 8)) fail(`${label}: purpose fehlt oder ist zu kurz.`);
  if (!isText(scene.visualFamily, 3)) fail(`${label}: visualFamily fehlt.`);
  if (!isText(scene.overlay?.headline, 2)) fail(`${label}: overlay.headline fehlt.`);
  if (!isText(scene.transition?.type)) fail(`${label}: transition.type fehlt.`);
  if (!Array.isArray(scene.soundCues)) fail(`${label}: soundCues muss ein Array sein.`);

  const family = normalized(scene.visualFamily).toLowerCase();
  if (family) visualFamilies.set(family, (visualFamilies.get(family) ?? 0) + 1);
  if ([family, normalized(scene.purpose).toLowerCase(), normalized(scene.animation?.narrativeAction).toLowerCase()].some((value) => value.includes('dashboard'))) {
    dashboardCount += 1;
  }

  if (scene.type === 'image') {
    imageCount += 1;
    const hasImageDirectory = isRelativeSafePath(scene.image?.directory ?? scene.image?.assetDirectory);
    const hasLegacyImageAsset = isRelativeSafePath(scene.image?.asset);
    if (!hasImageDirectory && !hasLegacyImageAsset) {
      fail(`${label}: image benötigt directory (bevorzugt) oder einen sicheren relativen asset-Pfad.`);
    }
    if (scene.image?.selection && scene.image.selection !== 'single-supported-file') {
      fail(`${label}: image.selection muss single-supported-file sein.`);
    }
    if (!isRelativeSafePath(scene.image?.promptFile)) fail(`${label}: image.promptFile muss ein sicherer relativer Projektpfad sein.`);
    if (!isText(scene.image?.motion?.type)) fail(`${label}: image.motion.type fehlt.`);
    for (const key of ['scaleFrom', 'scaleTo', 'panX', 'panY']) {
      if (!Number.isFinite(scene.image?.motion?.[key])) fail(`${label}: image.motion.${key} muss eine Zahl sein.`);
    }
  }

  if (scene.type === 'animation') {
    animationCount += 1;
    const animation = scene.animation ?? {};
    if (!isText(animation.componentName, 3)) fail(`${label}: animation.componentName fehlt.`);
    if (!isText(animation.narrativeAction, 12)) fail(`${label}: animation.narrativeAction ist zu kurz oder fehlt.`);
    if (!isText(animation.startState, 8)) fail(`${label}: animation.startState fehlt.`);
    if (!isText(animation.endState, 8)) fail(`${label}: animation.endState fehlt.`);
    if (!isText(animation.camera, 5)) fail(`${label}: animation.camera fehlt.`);
    if (!Array.isArray(animation.requiredElements) || animation.requiredElements.length === 0) {
      fail(`${label}: animation.requiredElements benötigt mindestens einen Eintrag.`);
    }
    const action = normalized(animation.narrativeAction).toLowerCase();
    if (narrativeActions.has(action)) fail(`${label}: narrativeAction wiederholt eine andere Animationsszene.`);
    narrativeActions.add(action);
    if (index > 0 && scenes[index - 1]?.type === 'animation' && rules.allowConsecutiveAnimations !== true) {
      fail(`${label}: zwei Animationsszenen dürfen nicht direkt aufeinander folgen.`);
    }
  }
}

if (totalDuration < 25 || totalDuration > 90) fail(`Gesamtdauer muss 25–90 Sekunden betragen; gefunden: ${totalDuration.toFixed(2)} s.`);
if (imageCount <= animationCount) fail(`Bildszenen müssen Animationen überwiegen; gefunden: ${imageCount} Bild / ${animationCount} Animation.`);
if (animationCount < 1) fail('Mindestens eine echte Remotion-Animationsszene ist erforderlich.');
if (animationCount > 3) fail('Höchstens drei Remotion-Animationsszenen sind erlaubt.');
if (scenes.length && animationCount / scenes.length > maximumAnimationShare + 1e-9) {
  fail(`Animationsanteil ist zu hoch: ${animationCount}/${scenes.length} > ${maximumAnimationShare}.`);
}
if (dashboardCount > rules.maximumDashboardScenes) {
  fail(`Zu viele Dashboard-Szenen: ${dashboardCount}; erlaubt: ${rules.maximumDashboardScenes}.`);
}
for (const [family, count] of visualFamilies) {
  if (count > 2) fail(`VisualFamily „${family}“ wird ${count}-mal verwendet; maximal zweimal erlaubt.`);
}

const assembledScript = normalized(scenes.map((scene) => scene.voiceText).join(' '));
if (assembledScript && normalized(voiceover.script) !== assembledScript) {
  fail('voiceover.script muss exakt aus den voiceText-Blöcken der Szenen bestehen.');
}

const runtimeDurationSec = voiceover.processing?.runtimeDurationSec;
if (Number.isFinite(runtimeDurationSec) && Math.abs(totalDuration - runtimeDurationSec) > 0.08) {
  fail(`Szenendauer (${totalDuration.toFixed(3)} s) stimmt nicht mit der verarbeiteten Audiodauer (${runtimeDurationSec.toFixed(3)} s) überein.`);
}
if (Number.isFinite(runtimeDurationSec) && Number.isInteger(composition.durationInFrames)) {
  const expectedFrames = Math.ceil(runtimeDurationSec * composition.fps);
  if (composition.durationInFrames !== expectedFrames) {
    fail(`composition.durationInFrames muss ${expectedFrames} sein, gefunden: ${composition.durationInFrames}.`);
  }
}

const packageText = JSON.stringify(reel);
if (requireAssets && packageText.includes('FINANCE_TODO')) fail('Das Build-Paket enthält noch FINANCE_TODO-Platzhalter.');

const verifyExactFile = (relative, label) => {
  if (!isRelativeSafePath(relative)) {
    fail(`${label}: unsicherer oder leerer Dateipfad.`);
    return;
  }
  const absolute = path.resolve(projectRoot, relative);
  if (!absolute.startsWith(`${projectRoot}${path.sep}`)) {
    fail(`${label}: Pfad liegt außerhalb des Projekts: ${relative}.`);
  } else if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    fail(`${label}: Datei fehlt: ${relative}.`);
  }
};

if (requireAssets) {
  if (reel.status !== 'ready-to-build') fail('status muss für den Build ready-to-build sein.');
  if (reel.approval?.scriptApprovedByUser !== true) fail('scriptApprovedByUser muss true sein.');
  if (reel.approval?.imagePromptsApprovedByUser !== true) fail('imagePromptsApprovedByUser muss true sein.');

  if (hasVoiceoverDirectory) {
    const result = resolveVoiceoverAsset(projectRoot, voiceover);
    if (!result.ok) fail(result.message);
    else resolvedAssets.voiceover = result.relativeFile;
  } else {
    verifyExactFile(voiceover.asset, 'Voiceover');
    resolvedAssets.voiceover = voiceover.asset;
  }

  const transcriptAligned = reel.timing?.mode === 'transcript-aligned' || voiceover.processing?.timingMode === 'transcript-word-alignment';
  if (transcriptAligned) {
    if (reel.timing?.status === 'pending-local-transcription') {
      fail('Transkriptbasierte Zeiten fehlen noch. Zuerst `npm run finance:codex-reel:captions -- <projekt>` ausführen.');
    }
    verifyExactFile(voiceover.runtimeAsset, 'Verarbeitetes 1,10×-Voiceover');
    resolvedAssets.runtimeVoiceover = voiceover.runtimeAsset;
    verifyExactFile(reel.timing?.asset, 'Transkriptbasierte Szenenzeiten');
    verifyExactFile(reel.captions?.transcriptAsset, 'Whisper-Transkript');
    for (const scene of scenes) {
      if (!Number.isFinite(scene.timing?.startMs) || !Number.isFinite(scene.timing?.endMs)) {
        fail(`${scene.id}: echte Transkript-Zeitgrenzen fehlen.`);
      }
    }
  }

  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index];
    if (scene.type === 'image') {
      verifyExactFile(scene.image.promptFile, `${scene.id}: Bildprompt`);
      if (isRelativeSafePath(scene.image.directory ?? scene.image.assetDirectory)) {
        const result = resolveSceneImageAsset(projectRoot, scene, index);
        if (!result.ok) fail(result.message);
        else resolvedAssets.images.push({sceneId: scene.id, file: result.relativeFile});
      } else {
        verifyExactFile(scene.image.asset, `${scene.id}: Bild`);
        resolvedAssets.images.push({sceneId: scene.id, file: scene.image.asset});
      }
    }
    for (const cue of scene.soundCues ?? []) {
      if (isText(cue.asset)) verifyExactFile(cue.asset, `${scene.id}: Sound-Cue`);
    }
  }

  const captionAsset = reel.captions?.asset;
  if (isRelativeSafePath(captionAsset) && !fs.existsSync(path.resolve(projectRoot, captionAsset))) {
    if (reel.captions?.mayGenerateProvisionalTimings === true) {
      warn(`Caption-Datei fehlt und darf provisorisch erzeugt werden: ${captionAsset}.`);
    } else {
      fail(`Caption-Datei fehlt: ${captionAsset}.`);
    }
  }
}

if (warnings.length) {
  console.warn('Warnungen:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error('Codex-Reel-Paket ist nicht bereit:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`✓ Codex-Reel-Paket gültig: ${path.relative(process.cwd(), packageFile)}`);
console.log(`  Szenen: ${scenes.length}`);
console.log(`  Bildszenen: ${imageCount}`);
console.log(`  Animationsszenen: ${animationCount}`);
console.log(`  Gesamtdauer: ${totalDuration.toFixed(2)} s`);
if (requireAssets) {
  console.log(`  Original-Voiceover erkannt: ${resolvedAssets.voiceover}`);
  if (resolvedAssets.runtimeVoiceover) console.log(`  Render-Voiceover erkannt: ${resolvedAssets.runtimeVoiceover}`);
  for (const image of resolvedAssets.images) console.log(`  ${image.sceneId}: ${image.file}`);
}
console.log(`  Timing: ${reel.timing?.mode ?? 'planned'}`);
console.log(`  Modus: ${requireAssets ? 'ready-to-build mit automatischer Asset-Erkennung' : 'Struktur- und Kreativprüfung'}`);
