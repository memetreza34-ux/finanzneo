#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadFinanceReelBuildManifest} from './lib/finance-reel-build-manifest.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/verify-finance-prebuilt-reel.mjs <projektordner>');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const errors = [];

let loaded;
try {
  loaded = loadFinanceReelBuildManifest({projectRoot, technicalRoot, requireReady: true});
} catch (error) {
  console.error(`Vorprogrammierter Reel-Build ist nicht bereit:\n- ${error.message}`);
  process.exit(1);
}

const {manifest, composition, expectedSourceFiles, animations} = loaded;
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');

const inspectSource = (file, label) => {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    errors.push(`${label} fehlt: ${path.relative(technicalRoot, file)}`);
    return '';
  }
  const content = fs.readFileSync(file, 'utf8');
  if (/FINANCE_TODO|PREBUILD_TODO/.test(content)) {
    errors.push(`${path.relative(technicalRoot, file)} enthält noch einen Vorarbeits-Platzhalter.`);
  }
  return content;
};

inspectSource(composition.entryPointAbsolute, 'Remotion-Einstiegspunkt');
if (!fs.existsSync(composition.sourceRootAbsolute) || !fs.statSync(composition.sourceRootAbsolute).isDirectory()) {
  errors.push(`Composition-Quellordner fehlt: ${path.relative(technicalRoot, composition.sourceRootAbsolute)}`);
}
for (const source of expectedSourceFiles) inspectSource(source.absolute, 'Erwartete vorprogrammierte Datei');

for (const animation of animations) {
  const source = inspectSource(animation.sourceAbsolute, `Animationsquelle für ${animation.sceneId}`);
  if (source && !source.includes(animation.component)) {
    errors.push(`${animation.sceneId}: Komponente ${animation.component} wurde in ${animation.source} nicht gefunden.`);
  }
}

if (!fs.existsSync(packageFile) || !fs.statSync(packageFile).isFile()) {
  errors.push(`Codex-Reel-Paket fehlt: ${packageFile}`);
} else {
  let reel;
  try {
    reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  } catch (error) {
    errors.push(`Codex-Reel-Paket ist ungültig: ${error.message}`);
  }
  if (reel) {
    if (reel.slug !== manifest.slug) errors.push(`Manifest-Slug ${manifest.slug} stimmt nicht mit Paket-Slug ${reel.slug} überein.`);
    const packageAnimations = (reel.scenes ?? []).filter((scene) => scene.type === 'animation').map((scene) => scene.id);
    const manifestAnimations = animations.map((animation) => animation.sceneId);
    if (JSON.stringify(packageAnimations) !== JSON.stringify(manifestAnimations)) {
      errors.push(`Animationsszenen stimmen nicht überein. Paket: ${packageAnimations.join(', ') || 'keine'}; Manifest: ${manifestAnimations.join(', ') || 'keine'}.`);
    }
    if (manifest.expectedSceneCount !== undefined && (reel.scenes ?? []).length !== manifest.expectedSceneCount) {
      errors.push(`Szenenanzahl muss ${manifest.expectedSceneCount} sein; gefunden: ${(reel.scenes ?? []).length}.`);
    }
  }
}

if (manifest.prebuiltApproval?.approvedByPlanningAssistant !== true) {
  errors.push('prebuiltApproval.approvedByPlanningAssistant muss true sein. Die Vorarbeit ist noch nicht ausdrücklich abgeschlossen.');
}
if (manifest.prebuiltApproval?.animationsImplemented !== true) {
  errors.push('prebuiltApproval.animationsImplemented muss true sein.');
}
if (manifest.prebuiltApproval?.compositionImplemented !== true) {
  errors.push('prebuiltApproval.compositionImplemented muss true sein.');
}

if (errors.length) {
  console.error('Vorprogrammierter Reel-Build ist unvollständig:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`✓ Reel ist vollständig vorprogrammiert: ${manifest.slug}`);
console.log(`✓ Composition vorhanden: ${composition.id}`);
console.log(`✓ Vorprogrammierte Animationen: ${animations.length}`);
console.log('✓ Codex muss keine Animation planen oder programmieren.');
console.log('✓ Allgemeiner Buildbefehl darf ausgeführt werden.');
