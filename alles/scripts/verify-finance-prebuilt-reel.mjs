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
const inspectedSources = [];

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
  inspectedSources.push({file, content});
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
  if (animation.editableByCodex !== false) {
    errors.push(`${animation.sceneId}: editableByCodex muss false sein.`);
  }
}

let reel = null;
if (!fs.existsSync(packageFile) || !fs.statSync(packageFile).isFile()) {
  errors.push(`Codex-Reel-Paket fehlt: ${packageFile}`);
} else {
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

    if (reel.creativeRules?.visualQualityProfile === 'finanzneo-process-v2') {
      const combinedSource = inspectedSources.map(({content}) => content).join('\n');
      if (!combinedSource.includes('FinanzNeoSceneHeader')) {
        errors.push('Visual Quality V2 verlangt die gemeinsame Komponente FinanzNeoSceneHeader in der vorprogrammierten Composition.');
      }
      if (!combinedSource.includes('finanzneo-scene-header-v2') && !combinedSource.includes('FINANZNEO_SCENE_HEADER_PROFILE')) {
        errors.push('Der vorprogrammierte Quellcode referenziert das Headerprofil finanzneo-scene-header-v2 nicht.');
      }
      const animationCount = (reel.scenes ?? []).filter((scene) => scene.type === 'animation').length;
      const imageCount = (reel.scenes ?? []).filter((scene) => scene.type === 'image').length;
      const total = imageCount + animationCount;
      if (total > 0) {
        const imageShare = imageCount / total;
        const animationShare = animationCount / total;
        if (imageShare < 0.55 || imageShare > 0.65) {
          errors.push(`Vorprogrammierte Composition verletzt 55–65 % Bildanteil: ${(imageShare * 100).toFixed(1)} %.`);
        }
        if (animationShare < 0.35 || animationShare > 0.45) {
          errors.push(`Vorprogrammierte Composition verletzt 35–45 % Animationsanteil: ${(animationShare * 100).toFixed(1)} %.`);
        }
      }
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
if (reel?.creativeRules?.visualQualityProfile === 'finanzneo-process-v2') {
  console.log('✓ Visual Quality V2: 60/40-Profil, Prozessbilder und gemeinsamer heller Scene Header erkannt.');
}
console.log('✓ Codex muss keine Animation planen oder programmieren.');
console.log('✓ Allgemeiner Buildbefehl darf ausgeführt werden.');
