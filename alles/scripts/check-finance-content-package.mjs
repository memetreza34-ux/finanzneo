#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const projectArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Projektordner fehlt.');
const root = process.cwd();
const reelDir = path.resolve(projectArg);
const paths = financeProjectPaths(reelDir);
const config = loadFinanceConfig();
const reportFile = path.join(paths.projectFilesDir, 'content-package-report.json');
const findings = [];
const add = (code, message) => findings.push({code, message});
const exists = (file) => fs.existsSync(file) && fs.statSync(file).isFile() && fs.statSync(file).size > 0;
const read = (file) => exists(file) ? fs.readFileSync(file, 'utf8').trim() : '';
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2));
  fs.renameSync(temporary, file);
};
const run = (script, args, code) => {
  const result = spawnSync(process.execPath, [script, ...args], {cwd: root, stdio: 'inherit'});
  if (result.error || result.status !== 0) add(code, `${script} ist fehlgeschlagen.`);
};

fs.rmSync(paths.readyReport, {force: true});
const required = [
  paths.scriptMarkdown, paths.voiceScript, paths.voicePrompt,
  paths.socialCaption, paths.pdfContent, paths.sources, paths.storyboard,
  paths.motionDesign, paths.scenePlan, paths.status,
];
for (const file of required) if (!exists(file)) add('REQUIRED_FILE_MISSING', `Pflichtdatei fehlt: ${path.relative(reelDir, file)}`);

let plan;
let status;
try { plan = ScenePlan.parse(JSON.parse(read(paths.scenePlan))); } catch (error) { add('SCENE_PLAN_INVALID', error.message); }
try { status = JSON.parse(read(paths.status)); } catch (error) { add('STATUS_INVALID', error.message); }

if (status) {
  if (status.approvals?.scriptApproved !== true) add('SCRIPT_NOT_APPROVED', 'scriptApproved=true fehlt.');
  if (status.approvals?.designAnchorApproved !== true) add('DESIGN_NOT_APPROVED', 'designAnchorApproved=true fehlt.');
}

const usesVisualQualityV2 = plan?.visualQualityProfile === 'finanzneo-process-v2';
const productionMode = usesVisualQualityV2 ? 'process-hybrid-v2' : 'image-first-lite';

if (plan) {
  if (read(paths.voiceScript) !== plan.scriptText.trim()) add('VOICE_SCRIPT_OUT_OF_SYNC', 'Szenenplan und Fließtext sind nicht synchron.');
  if (!read(paths.voicePrompt).includes(plan.scriptText.trim())) add('VOICEOVER_OUT_OF_SYNC', 'voiceover.txt enthält nicht den vollständigen Sprechtext.');
  if ((plan.sources ?? []).length === 0) add('SOURCES_EMPTY', 'Quellen fehlen.');

  const imageScenes = usesVisualQualityV2
    ? plan.scenes.filter((scene) => scene.type === 'image')
    : plan.scenes.filter((scene) => scene.layout === 'full-bleed' || scene.layout === 'framed-image');

  if (usesVisualQualityV2) {
    const animationScenes = plan.scenes.filter((scene) => scene.type === 'animation');
    const imageShare = imageScenes.length / plan.scenes.length;
    const animationShare = animationScenes.length / plan.scenes.length;
    if (imageShare < 0.55 || imageShare > 0.65) add('V2_IMAGE_SHARE_INVALID', `${imageScenes.length}/${plan.scenes.length} Bildszenen; benötigt werden 55–65 Prozent.`);
    if (animationShare < 0.35 || animationShare > 0.45) add('V2_ANIMATION_SHARE_INVALID', `${animationScenes.length}/${plan.scenes.length} Animationen; benötigt werden 35–45 Prozent.`);
    if (animationScenes.length > 4) add('V2_TOO_MANY_ANIMATIONS', 'Visual Quality V2 erlaubt höchstens vier Animationen.');

    for (const scene of imageScenes) {
      if (!String(scene.imagePrompt ?? '').trim()) add('IMAGE_PROMPT_MISSING', `Bildprompt fehlt: ${scene.id}`);
      if (!scene.processImage) add('V2_PROCESS_IMAGE_MISSING', `${scene.id}: Ausgangslage, Prozessweg und Ergebnis fehlen.`);
      if ((scene.visualPhases ?? []).length < 2) add('V2_IMAGE_PHASES_MISSING', `${scene.id}: Prozessbild benötigt mindestens zwei Bewegungsphasen.`);
    }
    for (const scene of animationScenes) {
      if (!scene.animation) add('V2_ANIMATION_CONTRACT_MISSING', `${scene.id}: Animationsvertrag fehlt.`);
      if ((scene.visualPhases ?? []).length < 3) add('V2_ANIMATION_PHASES_MISSING', `${scene.id}: Animation benötigt mindestens drei Phasen.`);
    }
    for (const scene of plan.scenes) {
      if (scene.content?.profile !== 'finanzneo-scene-header-v2') add('V2_HEADER_PROFILE_MISSING', `${scene.id}: Scene Header V2 fehlt.`);
      if (!scene.content?.icon) add('V2_HEADER_ICON_MISSING', `${scene.id}: passendes Icon fehlt.`);
      if ((scene.content?.headlineMinPx ?? 0) < 72) add('V2_HEADLINE_TOO_SMALL', `${scene.id}: Hauptüberschrift ist kleiner als 72 px.`);
      if (scene.content?.textTone !== 'light' || scene.content?.topGradient !== true) add('V2_HEADER_CONTRAST_INVALID', `${scene.id}: helle Schrift und oberer Kontrastverlauf sind Pflicht.`);
      if ((scene.soundCues ?? []).length > 0) add('SFX_DISABLED', `${scene.id}: SFX sind deaktiviert.`);
    }
  } else {
    const target = config.visuals.targetImageLedScenes;
    if (imageScenes.length < target.min || imageScenes.length > target.max) add('IMAGE_COUNT_INVALID', `${imageScenes.length} Bilder geplant; erlaubt sind ${target.min}–${target.max}.`);
    for (const scene of imageScenes) {
      if (!String(scene.imagePrompt ?? '').trim()) add('IMAGE_PROMPT_MISSING', `Bildprompt fehlt: ${scene.id}`);
    }
    for (const scene of plan.scenes) {
      if (scene.transition !== 'cut') add('COMPLEX_TRANSITION_DISABLED', `${scene.id}: im Legacy-Modus ist nur cut erlaubt.`);
      if ((scene.visualPhases ?? []).length > 1) add('MULTIPLE_PHASES_DISABLED', `${scene.id}: im Legacy-Modus ist nur ein statischer Zustand erlaubt.`);
      if ((scene.soundCues ?? []).length > 0) add('SFX_DISABLED', `${scene.id}: SFX sind deaktiviert.`);
    }
  }
}

if (plan && findings.length === 0) {
  run('scripts/run-finance-script-qa.mjs', [paths.scenePlan], 'SCRIPT_QA_FAILED');
  run('scripts/run-finance-creative-qa.mjs', [paths.scenePlan], 'CREATIVE_QA_FAILED');
  if (!usesVisualQualityV2) run('scripts/validate-finanzneo-consistency.mjs', [reelDir], 'CONSISTENCY_FAILED');
}

const passed = findings.length === 0;
if (passed && status) {
  status.stage = 'content-ready';
  status.productionMode = productionMode;
  status.lastContentReadyAt = new Date().toISOString();
  writeJson(paths.status, status);
}
writeJson(reportFile, {version: 'finance-content-package-v3', productionMode, passed, generatedAt: new Date().toISOString(), findings});
if (!passed) {
  for (const finding of findings) console.error(`✗ [${finding.code}] ${finding.message}`);
  process.exit(1);
}
if (usesVisualQualityV2) {
  console.log('✓ V2-Inhaltspaket vollständig: Prozessbilder, vorgeplante Animationen, heller Scene Header, Icons und Untertitel.');
} else {
  console.log('✓ Legacy-Inhaltspaket vollständig: Bilder, Voiceover, statische Überschriften, Icons und Untertitel.');
}
