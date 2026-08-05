#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const repoRoot = process.cwd();
const validator = path.join(repoRoot, 'scripts', 'verify-finance-codex-reel-package.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'finanzneo-codex-reel-'));
const projectRoot = path.join(tempRoot, 'project');
const projectFile = path.join(projectRoot, '06-projektdateien', 'codex-reel-package.json');

const imageScene = (index) => ({
  id: `scene-${String(index).padStart(2, '0')}-image`,
  type: 'image',
  durationSec: 4,
  voiceText: `Bildszene ${index} erklärt eine eigene konkrete Aussage.`,
  purpose: `Eigener Inhaltsbeat für Bildszene ${index}.`,
  visualFamily: `image-family-${index}`,
  image: {
    asset: `02-bilder/images/scene-${index}.png`,
    promptFile: `02-bilder/prompts/scene-${index}.txt`,
    motion: {type: 'push-in', scaleFrom: 1, scaleTo: 1.04, panX: 0, panY: 0}
  },
  overlay: {kicker: 'FinanzNeo', headline: `Bild ${index}`, body: ''},
  transition: {type: 'cut', durationSec: 0},
  soundCues: []
});

const animationScene = (index) => ({
  id: `scene-${String(index).padStart(2, '0')}-animation`,
  type: 'animation',
  durationSec: 5,
  voiceText: `Animation ${index} zeigt einen eigenen Finanzprozess mit sichtbarer Veränderung.`,
  purpose: `Eigener bewegter Inhaltsbeat für Animation ${index}.`,
  visualFamily: `animation-family-${index}`,
  animation: {
    componentName: `NarrativeAnimation${index}`,
    narrativeAction: `Objekte bewegen sich in Prozess ${index} von Ursache zu sichtbarer Folge.`,
    startState: `Der Prozess ${index} beginnt in einem klaren Ausgangszustand.`,
    endState: `Der Prozess ${index} endet mit einer sichtbar veränderten Finanzlage.`,
    camera: `Sanfte Kamerafahrt für Prozess ${index}.`,
    requiredElements: [`Objekt ${index}`],
    forbiddenPatterns: ['dashboard card']
  },
  overlay: {kicker: 'FinanzNeo', headline: `Prozess ${index}`, body: ''},
  transition: {type: 'object-wipe', durationSec: 0.3},
  soundCues: []
});

const scenes = [
  imageScene(1),
  imageScene(2),
  animationScene(3),
  imageScene(4),
  imageScene(5),
  animationScene(6),
  imageScene(7)
];
const voiceScript = scenes.map((scene) => scene.voiceText).join(' ');
const validPackage = {
  version: 'finanzneo-codex-reel-v1',
  status: 'ready-to-build',
  slug: 'codex-workflow-test',
  title: 'Codex Workflow Test',
  topic: 'Test eines bildgeführten Hybrid-Reels',
  publishDate: '2026-08-04',
  centralQuestion: 'Kann Codex ein bildgeführtes Hybrid-Reel sicher umsetzen?',
  payoff: 'Ja, wenn Paket, Medien und Qualitätsregeln vollständig sind.',
  composition: {id: 'FinanzNeoCodexWorkflowTest', width: 1080, height: 1920, fps: 30},
  creativeRules: {
    mode: 'image-first-hybrid',
    imageScenesMustOutnumberAnimations: true,
    maximumAnimationShare: 0.4,
    maximumDashboardScenes: 0,
    allowConsecutiveAnimations: false,
    subtitleSafeBottomPx: 330
  },
  cover: {text: 'BILDER + ANIMATIONEN', subtext: 'Der sichere Codex-Workflow', sourceSceneId: scenes[0].id},
  voiceover: {script: voiceScript, asset: '01-script-audio/audio/voiceover-final.wav', instruction: 'Deutsch und klar.'},
  captions: {asset: '03-caption/voiceover-final.captions.json', mayGenerateProvisionalTimings: true, style: 'finanzneo-word-captions'},
  scenes,
  deliverables: {
    video: '05-export/final-reel.mp4',
    cover: '05-export/cover.png',
    contactSheet: '05-export/contact-sheet.png',
    qaReport: '06-projektdateien/codex-render-qa.json'
  },
  approval: {
    scriptApprovedByUser: true,
    imagePromptsApprovedByUser: true,
    assetsSuppliedByUser: true,
    finalVideoApprovedByUser: false
  }
};

const writePackage = (value) => {
  fs.mkdirSync(path.dirname(projectFile), {recursive: true});
  fs.writeFileSync(projectFile, JSON.stringify(value, null, 2));
};
const createAssets = (value) => {
  const files = [value.voiceover.asset];
  for (const scene of value.scenes) {
    if (scene.type === 'image') files.push(scene.image.asset, scene.image.promptFile);
  }
  for (const relative of files) {
    const file = path.join(projectRoot, relative);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, 'test');
  }
};
const run = (extra = []) => spawnSync(process.execPath, [validator, projectRoot, ...extra], {
  cwd: repoRoot,
  encoding: 'utf8'
});
const expect = (condition, message, result) => {
  if (condition) return;
  if (result) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
  }
  throw new Error(message);
};

try {
  writePackage(validPackage);
  let result = run();
  expect(result.status === 0, 'Gültiges Strukturpaket wurde abgelehnt.', result);

  createAssets(validPackage);
  result = run(['--require-assets']);
  expect(result.status === 0, 'Gültiges Ready-Paket wurde abgelehnt.', result);

  const invalidRatio = structuredClone(validPackage);
  invalidRatio.scenes = [imageScene(1), imageScene(2), imageScene(3), animationScene(4), animationScene(5), animationScene(6), animationScene(7)];
  invalidRatio.voiceover.script = invalidRatio.scenes.map((scene) => scene.voiceText).join(' ');
  invalidRatio.cover.sourceSceneId = invalidRatio.scenes[0].id;
  writePackage(invalidRatio);
  result = run();
  expect(result.status !== 0 && result.stderr.includes('Bildszenen müssen Animationen überwiegen'), 'Ungültiges Bild-Animations-Verhältnis wurde nicht abgelehnt.', result);

  writePackage(validPackage);
  fs.rmSync(path.join(projectRoot, validPackage.scenes[0].image.asset), {force: true});
  result = run(['--require-assets']);
  expect(result.status !== 0 && result.stderr.includes('Erforderliche Datei fehlt'), 'Fehlendes Bild wurde nicht abgelehnt.', result);

  console.log('✓ Codex-Reel-Workflow-Regressionstests bestanden.');
} finally {
  fs.rmSync(tempRoot, {recursive: true, force: true});
}
