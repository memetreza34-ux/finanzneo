#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'finanzneo-scaffold-'));
const reelsRoot = path.join(temporary, 'reels');
const historyFile = path.join(temporary, 'topic-history.json');
fs.mkdirSync(reelsRoot, {recursive: true});
fs.writeFileSync(historyFile, JSON.stringify({version: 'finance-v1', topicSelectionVersion: 3, rules: {}, topics: []}, null, 2));
const env = {...process.env, FINANCE_REELS_ROOT: reelsRoot, FINANCE_TOPIC_HISTORY_FILE: historyFile};
const run = (args, expectedStatus = 0) => {
  const result = spawnSync(process.execPath, ['scripts/safe-new-finance-week-reel.mjs', ...args], {cwd: root, env, encoding: 'utf8'});
  if (result.status !== expectedStatus) throw new Error(`Unerwarteter Exit ${result.status}; erwartet ${expectedStatus}.\n${result.stdout}\n${result.stderr}`);
  return result;
};
const requireFile = (file, label) => {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) throw new Error(`${label} fehlt oder ist leer: ${file}`);
};
try {
  const firstArgs = ['scaffold-test-a', '--topic=ETF-Kosten Test A', '--title=ETF Kosten Test A', '--publish-date=2099-12-28', '--selection-mode=evergreen', '--selection-reason=Transaktionaler Scaffold-Test mit vollständiger Visual-Quality-V2-Metadatenprüfung'];
  run(firstArgs);
  const weekDir = path.join(reelsRoot, '2099-12-28_bis_2100-01-03');
  const weekdayDir = path.join(weekDir, 'montag');
  const firstProject = path.join(weekdayDir, 'reel-01_scaffold-test-a');
  if (!fs.existsSync(firstProject)) throw new Error('Erstes Projekt wurde nicht erstellt.');

  const expectedFolders = ['00-cover', '01-voice-script', '02-audio', '03-szenen', '04-caption', '05-review', '06-video', 'render', 'timeline'];
  for (const folder of expectedFolders) {
    if (!fs.existsSync(path.join(firstProject, folder))) throw new Error(`Pflichtordner fehlt: ${folder}`);
  }
  if (fs.existsSync(path.join(firstProject, '03-szenen', 'BILDER-HIER-EINFUEGEN'))) throw new Error('Veralteter zentraler Bilder-Einfügeordner wurde erneut erzeugt.');

  const scenesRoot = path.join(firstProject, '03-szenen', 'EINZELNE-SZENEN');
  if (!fs.existsSync(scenesRoot)) throw new Error('Einzelne-Szenen-Ordner fehlt.');
  requireFile(path.join(firstProject, '03-szenen', 'alle-bildprompts.txt'), 'Gemeinsame Bildprompt-Datei');
  requireFile(path.join(firstProject, '03-szenen', 'scene-index.json'), 'Szenenindex');
  requireFile(path.join(firstProject, 'timeline', 'scene-plan.json'), 'Szenenplan');
  requireFile(path.join(firstProject, 'timeline', 'visual-quality-profile.json'), 'Visual-Quality-Profil');
  requireFile(path.join(firstProject, 'timeline', 'reel-build-manifest.json'), 'Allgemeines Build-Manifest');
  requireFile(path.join(firstProject, 'AGENTS.md'), 'Reel-spezifische Codex-Sperre');

  const plan = JSON.parse(fs.readFileSync(path.join(firstProject, 'timeline', 'scene-plan.json'), 'utf8'));
  const buildManifest = JSON.parse(fs.readFileSync(path.join(firstProject, 'timeline', 'reel-build-manifest.json'), 'utf8'));
  const visualProfile = JSON.parse(fs.readFileSync(path.join(firstProject, 'timeline', 'visual-quality-profile.json'), 'utf8'));
  const sceneIndex = JSON.parse(fs.readFileSync(path.join(firstProject, '03-szenen', 'scene-index.json'), 'utf8'));

  const imageScenes = plan.scenes.filter((scene) => scene.type === 'image');
  const animationScenes = plan.scenes.filter((scene) => scene.type === 'animation');
  if (plan.visualQualityProfile !== 'finanzneo-process-v2') throw new Error('Visual Quality V2 fehlt im Szenenplan.');
  if (plan.headerProfile !== 'finanzneo-scene-header-v2') throw new Error('Scene Header V2 fehlt im Szenenplan.');
  if (plan.scenes.length !== 9 || imageScenes.length !== 5 || animationScenes.length !== 4) {
    throw new Error(`Unerwartete Verteilung: ${plan.scenes.length} Szenen, ${imageScenes.length} Bilder, ${animationScenes.length} Animationen.`);
  }
  if (buildManifest.status !== 'awaiting-prebuild') throw new Error('Neues Reel muss awaiting-prebuild starten.');
  if (buildManifest.codexAnimationCodingRequired !== false) throw new Error('Codex-Sperre für Animationsentwicklung fehlt.');
  if (buildManifest.expectedDistribution?.imageCount !== 5 || buildManifest.expectedDistribution?.animationCount !== 4) throw new Error('Build-Manifest besitzt nicht die 5/4-Verteilung.');
  if (buildManifest.animations?.length !== 4 || buildManifest.animations.some((animation) => animation.editableByCodex !== false)) throw new Error('Vier gesperrte Animationsslots fehlen im Build-Manifest.');
  if (visualProfile.profile !== 'finanzneo-process-v2' || visualProfile.sceneHeader?.profile !== 'finanzneo-scene-header-v2') throw new Error('Visual-Quality-Profil oder Headerprofil ist inkonsistent.');
  if (sceneIndex.sceneCount !== 9 || sceneIndex.distribution?.imageCount !== 5 || sceneIndex.distribution?.animationCount !== 4) throw new Error('Szenenindex besitzt nicht die 9/5/4-Metadaten.');

  const imageSceneNumbers = new Set([1, 3, 5, 7, 9]);
  for (let sceneNumber = 1; sceneNumber <= 9; sceneNumber += 1) {
    const sceneDir = path.join(scenesRoot, `scene-${String(sceneNumber).padStart(2, '0')}`);
    if (!fs.existsSync(sceneDir)) throw new Error(`Szenenordner fehlt: scene-${String(sceneNumber).padStart(2, '0')}`);
    requireFile(path.join(sceneDir, 'szene.md'), `Szenenbeschreibung ${sceneNumber}`);
    if (imageSceneNumbers.has(sceneNumber)) {
      requireFile(path.join(sceneDir, 'bildprompt.txt'), `Prozess-Bildprompt ${sceneNumber}`);
      if (fs.existsSync(path.join(sceneDir, 'animation.md'))) throw new Error(`Bildszene ${sceneNumber} enthält unerwartet animation.md.`);
    } else {
      requireFile(path.join(sceneDir, 'animation.md'), `Animationsspezifikation ${sceneNumber}`);
      if (fs.existsSync(path.join(sceneDir, 'bildprompt.txt'))) throw new Error(`Animationsszene ${sceneNumber} enthält unerwartet bildprompt.txt.`);
    }
  }

  const statusPath = path.join(firstProject, '05-review', 'production-status.json');
  const firstStatus = fs.statSync(statusPath).mtimeMs;
  run(firstArgs);
  const secondStatus = fs.statSync(statusPath).mtimeMs;
  if (firstStatus !== secondStatus) throw new Error('Idempotenter zweiter Aufruf hat ein bestehendes Reel verändert.');

  const historyBeforeConflict = fs.readFileSync(historyFile, 'utf8');
  const conflict = run(['scaffold-test-b', '--topic=ETF-Kosten Test B', '--title=Anderes Reel', '--publish-date=2099-12-28', '--selection-mode=evergreen', '--selection-reason=Absichtlich belegter Wochentag'], 1);
  if (!/belegt/i.test(`${conflict.stdout}\n${conflict.stderr}`)) throw new Error('Belegter Wochentag wurde nicht klar gemeldet.');
  if (fs.readFileSync(historyFile, 'utf8') !== historyBeforeConflict) throw new Error('Fehlgeschlagene Erstellung hat das Themenregister verändert.');
  if (fs.readdirSync(weekdayDir, {withFileTypes: true}).filter((entry) => entry.isDirectory()).length !== 1) throw new Error('Fehlgeschlagene Erstellung hat einen zusätzlichen Reel-Ordner hinterlassen.');

  const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  if (history.topics.length !== 1 || history.topics[0].slug !== 'scaffold-test-a') throw new Error('Themenregister enthält nach dem Test unerwartete Einträge.');
  console.log('✓ Transaktionaler Finance-Scaffold-Test bestanden: Visual Quality V2, 9/5/4-Struktur, Codex-Sperre, Idempotenz und Rollback.');
} finally {
  fs.rmSync(temporary, {recursive: true, force: true});
}
