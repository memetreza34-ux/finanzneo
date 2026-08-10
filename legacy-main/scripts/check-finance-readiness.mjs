#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {AssetManifest, Captions, ScenePlan} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {financeProjectPaths, FINANCE_STRUCTURE_VERSION, isValidPdfFile, planRequiresPdf} from './lib/finance-project-structure.mjs';

const config = loadFinanceConfig();
const reelDirArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!reelDirArg) {
  console.error('Nutzung: node scripts/check-finance-readiness.mjs <reel-ordner>');
  process.exit(1);
}

const root = process.cwd();
const reelDir = path.resolve(reelDirArg);
const paths = financeProjectPaths(reelDir);
const reportFile = paths.readyReport;
const findings = [];
const add = (code, message, sceneId) => findings.push({code, message, ...(sceneId ? {sceneId} : {})});
const existsFile = (file) => fs.existsSync(file) && fs.statSync(file).isFile() && fs.statSync(file).size > 0;
const writeJsonAtomic = (file, value) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2));
  fs.renameSync(temporary, file);
};
const readJson = (file, code) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    add(code, `${path.basename(file)} ist nicht lesbar: ${error.message}`);
    return undefined;
  }
};
const writeReport = (ready, slug) => writeJsonAtomic(reportFile, {
  version: 'finance-v1',
  slug: slug ?? path.basename(reelDir),
  ready,
  generatedAt: new Date().toISOString(),
  findings,
});
const runGate = (script, args, code, label) => {
  const result = spawnSync(process.execPath, [script, ...args], {cwd: root, stdio: 'inherit', env: process.env});
  if (result.error) {
    add(code, `${label} konnte nicht gestartet werden: ${result.error.message}`);
    return false;
  }
  if (result.status !== 0) {
    add(code, `${label} ist fehlgeschlagen.`);
    return false;
  }
  return true;
};

if (!fs.existsSync(reelDir) || !fs.statSync(reelDir).isDirectory()) {
  console.error(`Reel-Ordner nicht gefunden: ${reelDir}`);
  process.exit(1);
}
// Ein alter grüner Bericht darf einen neuen fehlgeschlagenen Prüfversuch niemals überleben.
fs.rmSync(reportFile, {force: true});

if (!runGate('scripts/check-finance-content-package.mjs', [reelDir], 'CONTENT_PACKAGE_FAILED', 'Inhaltspaket-Prüfung')) {
  writeReport(false, path.basename(reelDir));
  console.error('✗ Finance-Projekt nicht produktionsbereit: Inhaltspaket oder Konsistenzprüfung fehlgeschlagen.');
  process.exit(1);
}

for (const [file, code] of [
  [paths.scenePlan, 'SCENE_PLAN_MISSING'],
  [paths.status, 'PRODUCTION_STATUS_MISSING'],
  [paths.sources, 'SOURCES_MISSING'],
  [paths.scriptMarkdown, 'SCRIPT_MARKDOWN_MISSING'],
  [paths.voiceScript, 'VOICE_SCRIPT_MISSING'],
  [paths.voicePrompt, 'VOICEOVER_PROMPT_MISSING'],
  [paths.imagePromptIndex, 'IMAGE_PROMPT_INDEX_MISSING'],
  [paths.imagePromptManifest, 'IMAGE_PROMPT_MANIFEST_MISSING'],
  [paths.manifest, 'ASSET_MANIFEST_MISSING'],
  [paths.storyboard, 'STORYBOARD_MISSING'],
  [paths.motionDesign, 'MOTION_DESIGN_MISSING'],
]) if (!existsFile(file)) add(code, `Pflichtdatei fehlt oder ist leer: ${path.relative(reelDir, file)}`);

const status = existsFile(paths.status) ? readJson(paths.status, 'PRODUCTION_STATUS_INVALID') : undefined;
if (status) {
  if ((status.folderStructureVersion ?? 0) < FINANCE_STRUCTURE_VERSION) add('FOLDER_STRUCTURE_OUTDATED', `folderStructureVersion muss mindestens ${FINANCE_STRUCTURE_VERSION} sein.`);
  for (const [key, label] of [['topicSelected', 'Thema ausgewählt'], ['scriptApproved', 'Skript freigegeben'], ['designAnchorApproved', 'Designanker freigegeben'], ['assetsReviewed', 'Assets geprüft']]) {
    if (status.approvals?.[key] !== true) add('APPROVAL_MISSING', `${label}: approvals.${key}=true fehlt.`);
  }
}

for (const [file, code, token] of [
  [paths.voiceScript, 'VOICE_SCRIPT_INCOMPLETE', 'FINANCE_TODO_FINAL_SCRIPT'],
  [paths.voicePrompt, 'VOICEOVER_PROMPT_INCOMPLETE', 'FINANCE_TODO_FINAL_SCRIPT'],
  [paths.imagePromptIndex, 'DESIGN_ANCHOR_INCOMPLETE', 'FINANCE_TODO_DESIGN_ANCHOR'],
  [paths.imagePromptIndex, 'IMAGE_PROMPTS_INCOMPLETE', 'FINANCE_TODO_SCENE_PROMPTS'],
]) if (existsFile(file) && fs.readFileSync(file, 'utf8').includes(token)) add(code, `${path.relative(reelDir, file)} enthält noch ${token}.`);

let plan;
if (existsFile(paths.scenePlan)) {
  const rawPlan = readJson(paths.scenePlan, 'SCENE_PLAN_INVALID');
  if (rawPlan) {
    const parsed = ScenePlan.safeParse(rawPlan);
    if (!parsed.success) add('SCENE_PLAN_INVALID', `scene-plan.json verletzt den Vertrag: ${parsed.error.issues[0]?.message ?? 'unbekannter Fehler'}`);
    else plan = parsed.data;
  }
}

const placeholderPatterns = [/hier steht/i, /arbeitstitel/i, /welche eine frage/i, /welche klare erkenntnis/i, /verständlicher vergleichswert/i, /kurze einordnung mit neuer information/i, /option a/i, /option b/i, /FINANCE_TODO/i];
if (plan) {
  if (status?.slug && status.slug !== plan.slug) add('STATUS_SLUG_MISMATCH', 'Status und Szenenplan verwenden unterschiedliche Slugs.');
  const imageLedScenes = plan.scenes.filter((scene) => scene.layout === 'full-bleed' || scene.layout === 'framed-image');
  if (imageLedScenes.length < config.visuals.minimumImageLedScenes) add('TOO_FEW_IMAGE_LED_SCENES', `Mindestens ${config.visuals.minimumImageLedScenes} Bildszenen sind Pflicht.`);
  const searchable = [plan.title, plan.centralQuestion, plan.payoff, plan.scriptText, ...plan.scenes.flatMap((scene) => [scene.voiceText, scene.purpose, scene.visualAction, scene.content?.headline, scene.content?.body, scene.content?.secondaryNumber, scene.content?.outcome, scene.imagePrompt, ...(scene.content?.steps ?? [])])].filter(Boolean).join('\n');
  for (const pattern of placeholderPatterns) if (pattern.test(searchable)) add('PLACEHOLDER_CONTENT', `Szenenplan enthält Platzhaltertext: ${pattern}`);
  if (!plan.alignment) add('ALIGNMENT_MISSING', 'Finales Transkript-Alignment fehlt.');
  else if (plan.alignment.matchRatio < config.alignment.minimumWordMatchRatio) add('ALIGNMENT_WEAK', `Alignment liegt nur bei ${(plan.alignment.matchRatio * 100).toFixed(1)} %.`);

  const voiceScript = existsFile(paths.voiceScript) ? fs.readFileSync(paths.voiceScript, 'utf8').trim() : '';
  if (voiceScript && voiceScript !== plan.scriptText.trim()) add('VOICE_SCRIPT_OUT_OF_SYNC', '01-script-audio/script-fliesstext.txt stimmt nicht exakt mit 06-projektdateien/scene-plan.json überein.');
  if (planRequiresPdf(plan)) {
    const pdfCandidates = fs.existsSync(paths.pdfDir) ? fs.readdirSync(paths.pdfDir).filter((name) => name.toLowerCase().endsWith('.pdf')).map((name) => path.join(paths.pdfDir, name)) : [];
    if (!pdfCandidates.some(isValidPdfFile)) add('CTA_PDF_MISSING', 'PDF-CTA erkannt, aber unter 04-pdf/ liegt keine gültige PDF-Datei.');
  }
}

let manifest;
if (existsFile(paths.manifest)) {
  const rawManifest = readJson(paths.manifest, 'ASSET_MANIFEST_INVALID');
  if (rawManifest) {
    const parsed = AssetManifest.safeParse(rawManifest);
    if (!parsed.success) add('ASSET_MANIFEST_INVALID', `asset-manifest.json ist ungültig: ${parsed.error.issues[0]?.message ?? 'unbekannter Fehler'}`);
    else manifest = parsed.data;
  }
}

if (plan && manifest) {
  if (manifest.slug !== plan.slug) add('MANIFEST_SLUG_MISMATCH', 'Manifest und Szenenplan verwenden unterschiedliche Slugs.');
  const assetsById = new Map(manifest.assets.map((asset) => [asset.id, asset]));
  const verifyAsset = (id, code, sceneId) => {
    const asset = assetsById.get(id);
    if (!asset) {
      add(code, `Asset "${id}" fehlt im Manifest.`, sceneId);
      return undefined;
    }
    const physical = path.resolve(reelDir, asset.file);
    const relative = path.relative(reelDir, physical);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      add('ASSET_OUTSIDE_PROJECT', `Asset "${id}" liegt außerhalb des Projekts.`, sceneId);
      return undefined;
    }
    if (!existsFile(physical)) add(code, `Asset-Datei fehlt oder ist leer: ${asset.file}`, sceneId);
    return asset;
  };

  const voice = verifyAsset(plan.voiceoverAssetId, 'VOICEOVER_FILE_MISSING');
  if (voice && (voice.kind !== 'audio' || voice.role !== 'voiceover-final')) add('VOICEOVER_INVALID', `Asset "${plan.voiceoverAssetId}" ist kein finales Voiceover.`);
  if (voice && !voice.durationSeconds) add('VOICEOVER_DURATION_MISSING', 'Finales Voiceover besitzt keine messbare Dauer.');
  const captionsAsset = verifyAsset(plan.captionsAssetId, 'CAPTIONS_FILE_MISSING');
  if (captionsAsset) {
    const captionsPath = path.resolve(reelDir, captionsAsset.file);
    const captionsRaw = existsFile(captionsPath) ? readJson(captionsPath, 'CAPTIONS_INVALID') : undefined;
    if (captionsRaw && !Captions.safeParse(captionsRaw).success) add('CAPTIONS_INVALID', 'Captions entsprechen nicht dem Wort-Zeitstempel-Format.');
  }

  for (const scene of plan.scenes) {
    const requested = [...new Set([...(scene.assetIds ?? []), ...(scene.visualPhases ?? []).flatMap((phase) => phase.assetId ? [phase.assetId] : [])])];
    const assets = requested.map((id) => verifyAsset(id, 'SCENE_ASSET_MISSING', scene.id)).filter(Boolean);
    if (scene.layout === 'full-bleed' || scene.layout === 'framed-image') {
      if (!assets.some((asset) => asset.kind === 'image' || asset.kind === 'video')) add('SCENE_IMAGE_MISSING', `${scene.layout} benötigt ein echtes Bild oder Video.`, scene.id);
      if (!scene.imagePrompt?.trim()) add('SCENE_IMAGE_PROMPT_MISSING', 'Bildszene besitzt keinen imagePrompt.', scene.id);
    }
  }
}

const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(root, 'channels/finanzneo/engine/topic-history.json'));
let history;
let historyEntry;
if (!existsFile(historyFile)) add('TOPIC_HISTORY_MISSING', 'Zentrales Themenregister fehlt.');
else if (status) {
  history = readJson(historyFile, 'TOPIC_HISTORY_INVALID');
  historyEntry = history?.topics?.find((entry) => entry.slug === status.slug && entry.topic === status.topic && entry.projectPath === status.projectPath);
  if (!historyEntry) add('TOPIC_NOT_REGISTERED', 'Thema, Slug und Projektpfad sind nicht korrekt im Themenregister reserviert.');
}

const slug = plan?.slug ?? status?.slug ?? path.basename(reelDir);
if (findings.length) {
  writeReport(false, slug);
  console.error(`✗ Finance-Projekt nicht produktionsbereit: ${findings.length} Sperre(n).`);
  for (const finding of findings) console.error(`  [${finding.code}]${finding.sceneId ? ` ${finding.sceneId}:` : ''} ${finding.message}`);
  console.error(`  Bericht: ${path.relative(root, reportFile)}`);
  process.exit(1);
}

const validation = spawnSync(process.execPath, ['scripts/validate-finance-project.mjs', reelDir], {cwd: root, stdio: 'inherit', env: process.env});
if (validation.error) throw validation.error;
if (validation.status !== 0) {
  add('FINAL_QA_FAILED', 'Vollständige Finance-Validierung ist fehlgeschlagen.');
  writeReport(false, slug);
  process.exit(validation.status ?? 1);
}

// Alle veränderlichen Metadaten werden vor dem Ready-Bericht geschrieben. Der Bericht ist damit garantiert die neueste Freigabedatei.
if (history && historyEntry) {
  historyEntry.status = 'used';
  historyEntry.lastReadyAt = new Date().toISOString();
  writeJsonAtomic(historyFile, history);
}
if (status) {
  status.stage = 'ready';
  status.lastReadinessAt = new Date().toISOString();
  writeJsonAtomic(paths.status, status);
}
writeReport(true, slug);
console.log('✓ READY: Inhalt, Quellen, Audio, Einzelprompts, Bilder, Captions, PDF-Regel, Alignment und Final-QA sind vollständig.');
console.log(`  Projekt: ${path.relative(root, reelDir)}`);
