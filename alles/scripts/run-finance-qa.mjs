#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  AssetManifest,
  Captions,
  QaReport,
  ScenePlan,
  normalizeWords,
  parseJsonFile,
} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const config = loadFinanceConfig();
const args = process.argv.slice(2);
const positionals = args.filter((arg) => !arg.startsWith('--'));
const planFile = path.resolve(positionals[0] || 'scene-plan.json');
const manifestFile = path.resolve(positionals[1] || path.join(path.dirname(planFile), 'asset-manifest.json'));
const outArg = args.find((arg) => arg.startsWith('--out='));
const outFile = path.resolve(outArg ? outArg.slice(6) : path.join(path.dirname(planFile), 'qa-report.json'));
const visualOnly = args.includes('--visual-only');

const plan = await parseJsonFile(planFile, ScenePlan, 'scene-plan.json');
const manifest = await parseJsonFile(manifestFile, AssetManifest, 'asset-manifest.json');
const findings = [];
const error = (code, message, sceneId) => findings.push({severity: 'error', code, message, ...(sceneId ? {sceneId} : {})});
const warning = (code, message, sceneId) => findings.push({severity: 'warning', code, message, ...(sceneId ? {sceneId} : {})});
const info = (code, message, sceneId) => findings.push({severity: 'info', code, message, ...(sceneId ? {sceneId} : {})});

const durationSeconds = plan.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
const layoutTypes = new Set(plan.scenes.map((scene) => scene.layout));
const visiblePatterns = new Set(plan.scenes.map((scene) => `${scene.layout}:${scene.variant ?? 'default'}`));
const assetIds = new Set(manifest.assets.map((asset) => asset.id));
const assetsById = new Map(manifest.assets.map((asset) => [asset.id, asset]));
const scriptWordCount = normalizeWords(plan.scriptText).length;
const duplicateAssetIds = manifest.assets
  .map((asset) => asset.id)
  .filter((id, index, all) => all.indexOf(id) !== index);

const hammingDistance = (left, right) => {
  if (!left || !right || left.length !== right.length) return Number.POSITIVE_INFINITY;
  let distance = 0;
  for (let index = 0; index < left.length; index += 1) if (left[index] !== right[index]) distance += 1;
  return distance;
};

const calculationResult = (calculation) => {
  switch (calculation.operation) {
    case 'multiply': return calculation.input * calculation.operand;
    case 'add': return calculation.input + calculation.operand;
    case 'subtract': return calculation.input - calculation.operand;
    case 'divide': return calculation.operand === 0 ? Number.NaN : calculation.input / calculation.operand;
  }
};

if (plan.slug !== manifest.slug) error('SLUG_MISMATCH', `Plan-Slug "${plan.slug}" und Manifest-Slug "${manifest.slug}" stimmen nicht überein.`);
if (durationSeconds < config.format.durationSeconds.min) error('DURATION_TOO_SHORT', `Gesamtlänge ${durationSeconds.toFixed(2)} s liegt unter ${config.format.durationSeconds.min} s.`);
if (durationSeconds > config.format.durationSeconds.max) error('DURATION_TOO_LONG', `Gesamtlänge ${durationSeconds.toFixed(2)} s überschreitet ${config.format.durationSeconds.max} s.`);
if (plan.scenes.length < config.visuals.beats.min) error('TOO_FEW_BEATS', `Nur ${plan.scenes.length} Beats; mindestens ${config.visuals.beats.min} sind Pflicht.`);
if (plan.scenes.length > config.visuals.beats.max) error('TOO_MANY_BEATS', `${plan.scenes.length} Beats; maximal ${config.visuals.beats.max} sind erlaubt.`);
if (layoutTypes.size < config.visuals.minimumLayoutTypes) error('LAYOUT_VARIETY', `Nur ${layoutTypes.size} technische Layoutarten; mindestens ${config.visuals.minimumLayoutTypes} sind Pflicht.`);
if (visiblePatterns.size < config.visuals.recommendedVisiblePatterns) warning('PATTERN_VARIETY', `Nur ${visiblePatterns.size} sichtbare Layoutmuster; ${config.visuals.recommendedVisiblePatterns} sind meist sinnvoll.`);
if (scriptWordCount < config.script.words.min || scriptWordCount > config.script.words.max) {
  error('SCRIPT_WORD_COUNT', `Skript hat ${scriptWordCount} Wörter; erlaubt sind ${config.script.words.min}–${config.script.words.max}.`);
}
if (!plan.sources.length) warning('SOURCES_EMPTY', 'Keine Quellen im Szenenplan. Zahlen und veränderliche Finanzbehauptungen müssen vor Produktion belegt werden.');
if (duplicateAssetIds.length) error('DUPLICATE_ASSET_IDS', `Doppelte Asset-IDs: ${[...new Set(duplicateAssetIds)].join(', ')}`);
if (!plan.alignment && !visualOnly) error('ALIGNMENT_MISSING', 'Der Szenenplan wurde noch nicht am finalen Transkript ausgerichtet.');
if (plan.alignment && plan.alignment.matchRatio < config.alignment.minimumWordMatchRatio) {
  error('ALIGNMENT_WEAK', `Transkript-Alignment liegt nur bei ${(plan.alignment.matchRatio * 100).toFixed(1)} %.`);
}

const normalizedScript = normalizeWords(plan.scriptText).join(' ');
for (const phrase of config.financialSafety.riskyPhrases) {
  if (normalizedScript.includes(normalizeWords(phrase).join(' '))) {
    error('RISKY_FINANCE_LANGUAGE', `Unzulässige oder zu absolute Finanzformulierung: "${phrase}".`);
  }
}

const coveredClaimIds = new Set();
for (const [index, source] of plan.sources.entries()) {
  if (!source.id) warning('SOURCE_ID_MISSING', `Quelle ${index + 1} besitzt keine stabile ID.`);
  if (!source.url) warning('SOURCE_URL_MISSING', `Quelle "${source.title}" besitzt keine URL.`);
  if (!source.accessedAt) warning('SOURCE_ACCESS_DATE_MISSING', `Quelle "${source.title}" besitzt kein Abrufdatum.`);
  for (const claimId of source.claimIds ?? []) coveredClaimIds.add(claimId);
}

let framedRun = 0;
let previousPattern = '';
let samePatternRun = 0;
for (const scene of plan.scenes) {
  const pattern = `${scene.layout}:${scene.variant ?? 'default'}`;
  samePatternRun = pattern === previousPattern ? samePatternRun + 1 : 1;
  previousPattern = pattern;
  if (samePatternRun > config.visuals.maximumConsecutiveVisiblePatterns) {
    error('VISIBLE_PATTERN_RUN', `Mehr als ${config.visuals.maximumConsecutiveVisiblePatterns} Szenen mit demselben sichtbaren Muster hintereinander.`, scene.id);
  }

  if (scene.layout === 'framed-image' && (scene.variant ?? 'default') === 'default') framedRun += 1;
  else framedRun = 0;
  if (framedRun > config.visuals.maximumConsecutiveFramedImages) {
    error('FRAMED_IMAGE_RUN', `Mehr als ${config.visuals.maximumConsecutiveFramedImages} klassische gerahmte Bildszenen hintereinander.`, scene.id);
  }

  if (scene.decorativeOnly) error('DECORATIVE_SCENE', 'Die Szene ist rein dekorativ und erklärt keinen Inhalt.', scene.id);
  if (scene.durationSec > config.visuals.maximumSecondsWithoutSemanticChange && scene.semanticChanges.length < 2) {
    error('STATIC_TOO_LONG', `${scene.durationSec.toFixed(1)} s mit weniger als zwei semantischen Veränderungen.`, scene.id);
  }

  const sceneClaimIds = scene.claimIds ?? [];
  for (const claimId of sceneClaimIds) {
    if (!coveredClaimIds.has(claimId)) error('UNSOURCED_CLAIM', `Claim "${claimId}" ist keiner Quelle zugeordnet.`, scene.id);
  }
  const sceneText = normalizeWords(`${scene.voiceText} ${scene.content.body ?? ''}`).join(' ');
  const containsNumber = /\d/.test(`${scene.voiceText} ${scene.content.body ?? ''} ${scene.content.primaryNumber ?? ''}`);
  const containsDateSensitiveTerm = config.financialSafety.dateSensitiveTerms.some((term) => sceneText.includes(normalizeWords(term).join(' ')));
  if ((containsNumber || containsDateSensitiveTerm) && sceneClaimIds.length === 0 && plan.sources.length > 0) {
    warning('CLAIM_REFERENCE_MISSING', 'Zahl oder veränderliche Finanzbehauptung besitzt keine claimId.', scene.id);
  }

  const phases = scene.visualPhases ?? [];
  if (scene.durationSec >= config.visuals.minimumPhasesFromSeconds && phases.length < 2) {
    error('MISSING_VISUAL_PHASES', `${scene.durationSec.toFixed(1)} s benötigen mindestens zwei visuelle Phasen.`, scene.id);
  }
  if (scene.durationSec >= config.visuals.recommendedThreePhasesFromSeconds && phases.length < 3) {
    warning('LONG_SCENE_PHASES', `${scene.durationSec.toFixed(1)} s haben nur ${phases.length} Phasen; drei Phasen prüfen.`, scene.id);
  }

  for (const phase of phases) {
    if (phase.assetId && !assetIds.has(phase.assetId)) error('MISSING_PHASE_ASSET', `Phasen-Asset "${phase.assetId}" fehlt.`, scene.id);
  }

  if (scene.variant === 'detail-focus' && !phases.some((phase) => phase.focus)) {
    error('FOCUS_POINT_MISSING', 'Detail-Focus benötigt einen relativen Fokuspunkt mit x, y und Radius.', scene.id);
  }

  const multiCount = scene.variant?.startsWith('multi-') ? Number(scene.variant.slice('multi-'.length)) : 0;
  if (multiCount && scene.assetIds.length < multiCount) {
    error('MULTI_PANEL_ASSETS', `${scene.variant} benötigt mindestens ${multiCount} Assets.`, scene.id);
  }

  for (const cue of scene.soundCues ?? []) {
    const cueAsset = assetsById.get(cue.assetId);
    if (!cueAsset) {
      error('SFX_ASSET_MISSING', `Sound-Cue-Asset "${cue.assetId}" fehlt.`, scene.id);
    } else if (cueAsset.kind !== 'audio' || !config.sound.allowedRoles.includes(cueAsset.role)) {
      error('SFX_ROLE_INVALID', `Asset "${cue.assetId}" ist kein erlaubter Finance-SFX.`, scene.id);
    }
  }

  const calculation = scene.content.calculation;
  if (calculation) {
    const expected = calculationResult(calculation);
    const tolerance = calculation.tolerance ?? 0.01;
    if (!Number.isFinite(expected) || Math.abs(expected - calculation.result) > tolerance) {
      error('CALCULATION_MISMATCH', `Strukturierte Rechnung ergibt ${Number.isFinite(expected) ? expected.toLocaleString('de-DE') : 'ungültig'}, gespeichert ist ${calculation.result.toLocaleString('de-DE')}.`, scene.id);
    }
  }

  if (scene.layout === 'cta' && (scene.durationSec < config.visuals.ctaSeconds.min || scene.durationSec > config.visuals.ctaSeconds.max)) {
    error('CTA_DURATION', `CTA dauert ${scene.durationSec.toFixed(1)} s; erlaubt sind ${config.visuals.ctaSeconds.min}–${config.visuals.ctaSeconds.max} s.`, scene.id);
  }
  if (scene.layout !== 'cta' && scene.content.ctaKeyword) warning('CTA_OUTSIDE_CTA', 'CTA-Keyword steht in einer Nicht-CTA-Szene.', scene.id);

  for (const id of scene.assetIds) {
    if (!assetIds.has(id)) error('MISSING_ASSET', `Referenziertes Asset "${id}" fehlt im Manifest.`, scene.id);
  }
}

const voiceAsset = manifest.assets.find((asset) => asset.id === plan.voiceoverAssetId);
const captionsAsset = manifest.assets.find((asset) => asset.id === plan.captionsAssetId);

if (visualOnly) {
  info('VISUAL_PREFLIGHT', 'Audio-, Transcript- und Caption-Endprüfung folgen in der Final-QA.');
  if (!captionsAsset) warning('FINAL_CAPTIONS_PENDING', `Finale Captions "${plan.captionsAssetId}" fehlen noch.`);
  if (!voiceAsset) warning('FINAL_VOICE_PENDING', `Finale Stimme "${plan.voiceoverAssetId}" fehlt noch.`);
} else {
  if (!voiceAsset) error('MISSING_REQUIRED_ASSET', `Pflicht-Asset "${plan.voiceoverAssetId}" fehlt.`);
  if (!captionsAsset) error('MISSING_REQUIRED_ASSET', `Pflicht-Asset "${plan.captionsAssetId}" fehlt.`);

  if (!voiceAsset?.durationSeconds) {
    error('VOICE_DURATION_MISSING', 'Für die finale Stimme fehlt eine messbare Dauer.');
  } else if (Math.abs(voiceAsset.durationSeconds - durationSeconds) > config.captions.maximumEndDriftMs / 1000) {
    error('AUDIO_PLAN_DRIFT', `Voiceover (${voiceAsset.durationSeconds.toFixed(2)} s) und Plan (${durationSeconds.toFixed(2)} s) weichen zu stark ab.`);
  }

  if (captionsAsset) {
    const captionsPath = path.resolve(path.dirname(manifestFile), captionsAsset.file);
    if (!fs.existsSync(captionsPath)) {
      error('CAPTIONS_FILE_MISSING', `Caption-Datei fehlt physisch: ${captionsAsset.file}`);
    } else {
      const parsed = Captions.safeParse(JSON.parse(fs.readFileSync(captionsPath, 'utf8')));
      if (!parsed.success) {
        error('CAPTIONS_INVALID', 'Caption-Datei entspricht nicht dem erwarteten Wort-Zeitstempel-Format.');
      } else {
        const captions = parsed.data;
        const first = captions[0];
        const last = captions.at(-1);
        if (first.startMs > config.captions.maximumStartDelayMs) {
          warning('CAPTION_START_DELAY', `Erste Caption startet erst nach ${first.startMs.toFixed(0)} ms.`);
        }
        if (voiceAsset?.durationSeconds && Math.abs(voiceAsset.durationSeconds * 1000 - last.endMs) > config.captions.maximumEndDriftMs) {
          error('CAPTION_END_DRIFT', `Letzte Caption und Audioende weichen um ${Math.abs(voiceAsset.durationSeconds * 1000 - last.endMs).toFixed(0)} ms ab.`);
        }
        for (let index = 1; index < captions.length; index += 1) {
          const previous = captions[index - 1];
          const current = captions[index];
          const gap = current.startMs - previous.endMs;
          if (gap > config.captions.maximumGapMs) warning('CAPTION_GAP', `Caption-Lücke von ${gap.toFixed(0)} ms bei Token ${index}.`);
          if (gap < -config.captions.maximumOverlapMs) error('CAPTION_OVERLAP', `Caption-Überlappung von ${Math.abs(gap).toFixed(0)} ms bei Token ${index}.`);
          if (current.endMs < current.startMs) error('CAPTION_NEGATIVE_DURATION', `Caption ${index} endet vor ihrem Start.`);
        }
      }
    }
  }
}

const images = manifest.assets.filter((item) => item.kind === 'image');
for (const asset of images) {
  if (!asset.imageAnalysis) {
    warning('IMAGE_ANALYSIS_MISSING', `Bild "${asset.file}" wurde nicht vollständig analysiert.`);
    continue;
  }
  const analysis = asset.imageAnalysis;
  if (analysis.brightness < config.imageAnalysis.lowBrightness) warning('IMAGE_TOO_DARK', `Bild "${asset.file}" ist sehr dunkel; Motiv und Textkontrast prüfen.`);
  if (analysis.brightness > config.imageAnalysis.highBrightness) warning('IMAGE_TOO_BRIGHT', `Bild "${asset.file}" ist sehr hell; weiße Texte benötigen stärkere Abdunklung.`);
  if (analysis.visualDensity === 'high') warning('IMAGE_HIGH_DENSITY', `Bild "${asset.file}" ist visuell dicht; Overlays reduzieren und contain/crop prüfen.`);
  if (!analysis.safeTop) warning('IMAGE_TOP_BUSY', `Bild "${asset.file}" besitzt oben wenig ruhige Fläche für Überschriften.`);
  if (!analysis.safeBottom) warning('IMAGE_BOTTOM_BUSY', `Bild "${asset.file}" besitzt unten wenig ruhige Fläche für Captions.`);
}
for (let left = 0; left < images.length; left += 1) {
  for (let right = left + 1; right < images.length; right += 1) {
    const distance = hammingDistance(images[left].imageAnalysis?.perceptualHash, images[right].imageAnalysis?.perceptualHash);
    if (distance <= config.imageAnalysis.nearDuplicateMaximumHammingDistance) {
      warning('IMAGE_NEAR_DUPLICATE', `Bilder "${images[left].file}" und "${images[right].file}" wirken nahezu identisch.`);
    }
  }
}

if (!config.sound.musicBedAllowed && manifest.assets.some((asset) => asset.kind === 'audio' && /music|musik|bed/i.test(`${asset.role} ${asset.file}`))) {
  error('MUSIC_BED_NOT_ALLOWED', 'Finance V1 verwendet kein Musikbett; nur gezielte leise SFX sind erlaubt.');
}

info('MANUAL_VISUAL_REVIEW_REQUIRED', 'Frame 0, Textüberlauf, Caption-Kollisionen und echte Motivqualität müssen zusätzlich an Kontrollframes geprüft werden.');

const report = QaReport.parse({
  version: 'finance-v1',
  slug: plan.slug,
  passed: !findings.some((finding) => finding.severity === 'error'),
  generatedAt: new Date().toISOString(),
  metrics: {
    mode: visualOnly ? 'visual-preflight' : 'final',
    durationSeconds: Number(durationSeconds.toFixed(3)),
    scriptWordCount,
    beatCount: plan.scenes.length,
    layoutTypeCount: layoutTypes.size,
    visiblePatternCount: visiblePatterns.size,
    assetCount: manifest.assets.length,
    analyzedImageCount: images.filter((image) => image.imageAnalysis).length,
    alignmentMatchRatio: plan.alignment?.matchRatio ?? 0,
    errorCount: findings.filter((finding) => finding.severity === 'error').length,
    warningCount: findings.filter((finding) => finding.severity === 'warning').length,
  },
  findings,
});

fs.mkdirSync(path.dirname(outFile), {recursive: true});
fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(`${report.passed ? '✓' : '✗'} Finance-QA (${visualOnly ? 'Visual-Preflight' : 'Final'}) → ${outFile}`);
console.log(report.metrics);
for (const finding of findings.filter((item) => item.severity !== 'info')) {
  console.log(`${finding.severity.toUpperCase()} ${finding.code}${finding.sceneId ? ` [${finding.sceneId}]` : ''}: ${finding.message}`);
}
process.exitCode = report.passed ? 0 : 1;
