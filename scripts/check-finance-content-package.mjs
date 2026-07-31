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

if (plan) {
  if (read(paths.voiceScript) !== plan.scriptText.trim()) add('VOICE_SCRIPT_OUT_OF_SYNC', 'Szenenplan und Fließtext sind nicht synchron.');
  if (!read(paths.voicePrompt).includes(plan.scriptText.trim())) add('VOICEOVER_OUT_OF_SYNC', 'voiceover.txt enthält nicht den vollständigen Sprechtext.');
  if ((plan.sources ?? []).length === 0) add('SOURCES_EMPTY', 'Quellen fehlen.');

  const imageScenes = plan.scenes.filter((scene) => scene.layout === 'full-bleed' || scene.layout === 'framed-image');
  const target = config.visuals.targetImageLedScenes;
  if (imageScenes.length < target.min || imageScenes.length > target.max) add('IMAGE_COUNT_INVALID', `${imageScenes.length} Bilder geplant; erlaubt sind ${target.min}–${target.max}.`);
  for (const scene of imageScenes) {
    if (!String(scene.imagePrompt ?? '').trim()) add('IMAGE_PROMPT_MISSING', `Bildprompt fehlt: ${scene.id}`);
  }
  for (const scene of plan.scenes) {
    if (scene.transition !== 'cut') add('COMPLEX_TRANSITION_DISABLED', `${scene.id}: nur cut ist erlaubt.`);
    if ((scene.visualPhases ?? []).length > 1) add('MULTIPLE_PHASES_DISABLED', `${scene.id}: nur ein statischer Zustand ist erlaubt.`);
    if ((scene.soundCues ?? []).length > 0) add('SFX_DISABLED', `${scene.id}: SFX sind deaktiviert.`);
  }
}

if (plan && findings.length === 0) {
  run('scripts/run-finance-script-qa.mjs', [paths.scenePlan], 'SCRIPT_QA_FAILED');
  run('scripts/run-finance-creative-qa.mjs', [paths.scenePlan], 'CREATIVE_QA_FAILED');
  run('scripts/validate-finanzneo-consistency.mjs', [reelDir], 'CONSISTENCY_FAILED');
}

const passed = findings.length === 0;
if (passed && status) {
  status.stage = 'content-ready';
  status.productionMode = 'image-first-lite';
  status.lastContentReadyAt = new Date().toISOString();
  writeJson(paths.status, status);
}
writeJson(reportFile, {version: 'finance-content-package-v2', productionMode: 'image-first-lite', passed, generatedAt: new Date().toISOString(), findings});
if (!passed) {
  for (const finding of findings) console.error(`✗ [${finding.code}] ${finding.message}`);
  process.exit(1);
}
console.log('✓ Inhaltspaket vollständig: Bilder, Voiceover, statische Überschriften, Icons und deutsche Untertitel.');
