#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {financeProjectPaths, isValidPdfFile, planRequiresPdf} from './lib/finance-project-structure.mjs';

const reelDirArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!reelDirArg) {
  console.error('Nutzung: node scripts/check-finance-required-media.mjs <projektordner>');
  process.exit(1);
}
const reelDir = path.resolve(reelDirArg);
const paths = financeProjectPaths(reelDir);
const config = loadFinanceConfig();
const findings = [];
const requireFile = (file, code) => {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) {
    findings.push(`[${code}] ${path.relative(reelDir, file)} fehlt oder ist leer.`);
    return false;
  }
  return true;
};

requireFile(paths.voiceoverFinal, 'VOICEOVER_WAV_MISSING');
requireFile(paths.captionsFinal, 'CAPTIONS_JSON_MISSING');
requireFile(paths.imagePromptManifest, 'PROMPT_MANIFEST_MISSING');
requireFile(paths.scenePlan, 'SCENE_PLAN_MISSING');

let plan;
if (fs.existsSync(paths.scenePlan)) {
  try {
    plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
  } catch (error) {
    findings.push(`[SCENE_PLAN_INVALID] ${error.message}`);
  }
}
if (fs.existsSync(paths.imagePromptManifest)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(paths.imagePromptManifest, 'utf8'));
    if (!Array.isArray(manifest.prompts)) throw new Error('prompts-Liste fehlt.');
    const seenFiles = new Set();
    const seenAssets = new Set();
    for (const entry of manifest.prompts) {
      if (!entry.expectedImageFile || !entry.imageAssetId || !entry.promptFile) {
        findings.push(`[PROMPT_MANIFEST_ENTRY_INVALID] Unvollständiger Eintrag für Szene ${entry.sceneId ?? 'unbekannt'}.`);
        continue;
      }
      if (seenFiles.has(entry.expectedImageFile)) findings.push(`[DUPLICATE_EXPECTED_IMAGE] ${entry.expectedImageFile} wird mehrfach verwendet.`);
      if (seenAssets.has(entry.imageAssetId)) findings.push(`[DUPLICATE_IMAGE_ASSET_ID] ${entry.imageAssetId} wird mehrfach verwendet.`);
      seenFiles.add(entry.expectedImageFile);
      seenAssets.add(entry.imageAssetId);
      const promptFile = path.resolve(paths.imagePromptsDir, entry.promptFile);
      const imageFile = path.resolve(reelDir, entry.expectedImageFile);
      const imageRelative = path.relative(paths.imagesDir, imageFile);
      if (imageRelative.startsWith('..') || path.isAbsolute(imageRelative)) findings.push(`[IMAGE_PATH_INVALID] ${entry.expectedImageFile} liegt nicht unter images/.`);
      requireFile(promptFile, 'INDIVIDUAL_PROMPT_MISSING');
      if (requireFile(imageFile, 'EXPECTED_IMAGE_MISSING')) {
        try {
          const metadata = await sharp(imageFile).metadata();
          if (!metadata.width || !metadata.height) throw new Error('Breite oder Höhe fehlt.');
          if (metadata.width < 720 || metadata.height < 1280) findings.push(`[IMAGE_RESOLUTION_TOO_LOW] ${entry.expectedImageFile} hat nur ${metadata.width}×${metadata.height}; mindestens 720×1280.`);
          const aspect = metadata.width / metadata.height;
          if (aspect < config.imageAnalysis.portraitAspectMin || aspect > config.imageAnalysis.portraitAspectMax) {
            findings.push(`[IMAGE_ASPECT_INVALID] ${entry.expectedImageFile} hat Seitenverhältnis ${aspect.toFixed(3)}; erwartet ist Hochformat nahe 9:16.`);
          }
        } catch (error) {
          findings.push(`[IMAGE_FILE_INVALID] ${entry.expectedImageFile} ist kein technisch lesbares Bild: ${error.message}`);
        }
      }
    }
  } catch (error) {
    findings.push(`[PROMPT_MANIFEST_INVALID] ${error.message}`);
  }
}

if (plan && planRequiresPdf(plan)) {
  const pdfCandidates = fs.existsSync(paths.pdfDir)
    ? fs.readdirSync(paths.pdfDir).filter((name) => name.toLowerCase().endsWith('.pdf')).map((name) => path.join(paths.pdfDir, name))
    : [];
  if (!pdfCandidates.some(isValidPdfFile)) findings.push('[CTA_PDF_MISSING] PDF/Guide/Checklisten-CTA erkannt, aber unter pdf/ liegt keine gültige PDF-Datei mit %PDF--Header.');
}

if (findings.length) {
  console.error(`✗ Pflichtmedien fehlen oder sind inkonsistent: ${findings.length} Fehler.`);
  for (const finding of findings) console.error(`  ${finding}`);
  process.exit(1);
}
console.log('✓ Pflichtmedien vollständig: WAV, Caption-JSON, Einzelprompts, technisch gültige Hochformatbilder und gegebenenfalls gültige PDF.');
