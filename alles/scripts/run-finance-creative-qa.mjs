#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan, normalizeWords} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const config = loadFinanceConfig();
const planFile = path.resolve(process.argv[2] || 'scene-plan.json');
if (!fs.existsSync(planFile)) throw new Error(`scene-plan.json fehlt: ${planFile}`);

const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(planFile, 'utf8')));
const usesVisualQualityV2 = plan.visualQualityProfile === 'finanzneo-process-v2';
const findings = [];
const add = (severity, code, message, sceneId) => findings.push({severity, code, message, sceneId});
const normalizedPhrase = (value) => normalizeWords(String(value ?? '')).join(' ');
const wordCount = (value) => normalizeWords(String(value ?? '')).length;
let textOnlyScenes = 0;
let imageLedScenes = 0;
let animationScenes = 0;

if (!usesVisualQualityV2 && config.visuals.productionMode !== 'image-first-lite') {
  add('error', 'PRODUCTION_MODE_INVALID', 'Legacy-Reels müssen im Modus image-first-lite arbeiten.');
}

for (const [sceneIndex, scene] of plan.scenes.entries()) {
  const {content} = scene;
  const voice = normalizedPhrase(scene.voiceText);
  const headline = normalizedPhrase(content.headline);
  const body = normalizedPhrase(content.body);
  const visibleText = normalizedPhrase([
    content.kicker,
    content.headline,
    content.body,
    content.ctaKeyword,
    content.ctaBenefit,
  ].filter(Boolean).join(' '));

  const imageLed = usesVisualQualityV2
    ? scene.type === 'image'
    : scene.layout === 'full-bleed' || scene.layout === 'framed-image';
  const animated = usesVisualQualityV2 && scene.type === 'animation';

  if (imageLed) {
    imageLedScenes += 1;
    if (!scene.imagePrompt?.trim()) add('warning', 'SCENE_IMAGE_PROMPT_PENDING', 'Bildprompt fehlt noch; wird nach Designfreigabe erzeugt.', scene.id);
    if ((scene.assetIds ?? []).length === 0) add('error', 'SCENE_IMAGE_REFERENCE_MISSING', 'Bildszene benötigt eine geplante Asset-ID.', scene.id);
  }
  if (animated) animationScenes += 1;

  if (config.visuals.sceneHeader.required && !String(content.kicker ?? '').trim()) {
    add('error', 'SCENE_HEADER_MISSING', 'Jede Szene benötigt oben eine kurze Zwischenüberschrift.', scene.id);
  }
  if (config.visuals.sceneHeader.iconRequired && !content.icon) {
    add('error', 'SCENE_ICON_MISSING', 'Jede Zwischenüberschrift benötigt ein passendes Icon.', scene.id);
  }
  if (wordCount(content.kicker) > config.visuals.sceneHeader.kickerWordsMax) {
    add('error', 'SCENE_HEADER_TOO_LONG', `Zwischenüberschrift hat mehr als ${config.visuals.sceneHeader.kickerWordsMax} Wörter.`, scene.id);
  }
  if (!String(content.headline ?? '').trim()) {
    add('error', 'HEADLINE_MISSING', 'Jede Szene benötigt eine kurze Hauptaussage.', scene.id);
  }
  if (wordCount(content.headline) > config.textQuality.headlineWordsMax) {
    add('warning', 'HEADLINE_TOO_LONG', `Headline hat mehr als ${config.textQuality.headlineWordsMax} Wörter.`, scene.id);
  }
  if (wordCount(content.body) > config.textQuality.bodyWordsMax) {
    add('warning', 'BODY_TOO_LONG', `Sichtbarer Begleittext hat mehr als ${config.textQuality.bodyWordsMax} Wörter.`, scene.id);
  }

  const minimumDuplicateWords = config.textQuality.duplicatePhraseMinimumWords;
  if (wordCount(content.headline) >= minimumDuplicateWords && voice.includes(headline)) {
    add('error', 'HEADLINE_DUPLICATES_VOICE', 'Die Headline wiederholt den gesprochenen Satz statt ihn zu verdichten.', scene.id);
  }
  if (wordCount(content.body) >= minimumDuplicateWords && voice.includes(body)) {
    add('warning', 'BODY_DUPLICATES_VOICE', 'Der Begleittext wiederholt die Captions nahezu wörtlich.', scene.id);
  }

  for (const phrase of config.textQuality.vaguePhrases) {
    const normalized = normalizedPhrase(phrase);
    if (normalized && visibleText.includes(normalized)) {
      add('error', 'VAGUE_VISIBLE_TEXT', `Zu allgemeiner Platzhaltertext: „${phrase}“.`, scene.id);
    }
  }

  const supportDetails = content.steps ?? [];
  if (supportDetails.length > config.visuals.supportDetails.maximumPerScene) {
    add('error', 'SUPPORT_DETAILS_OVERLOAD', `${supportDetails.length} Zusatzinfos geplant; maximal ${config.visuals.supportDetails.maximumPerScene} erlaubt.`, scene.id);
  }
  const normalizedDetails = supportDetails.map(normalizedPhrase);
  if (new Set(normalizedDetails).size !== normalizedDetails.length) {
    add('error', 'SUPPORT_DETAILS_DUPLICATE', 'Zusatzinfos wiederholen sich innerhalb derselben Szene.', scene.id);
  }

  if (usesVisualQualityV2) {
    if (content.profile !== 'finanzneo-scene-header-v2') {
      add('error', 'V2_HEADER_PROFILE_MISSING', 'Scene Header V2 ist Pflicht.', scene.id);
    }
    if ((content.headlineMinPx ?? 0) < 72) {
      add('error', 'V2_HEADLINE_TOO_SMALL', 'Hauptüberschrift muss mindestens 72 px groß sein.', scene.id);
    }
    if ((content.maxLines ?? 3) > 2) {
      add('error', 'V2_HEADLINE_TOO_MANY_LINES', 'Hauptüberschrift darf höchstens zwei Zeilen nutzen.', scene.id);
    }
    if (content.textTone !== 'light') {
      add('error', 'V2_HEADLINE_NOT_LIGHT', 'Hauptüberschrift muss sehr hell sein.', scene.id);
    }
    if (content.topGradient !== true) {
      add('error', 'V2_TOP_GRADIENT_MISSING', 'Weicher dunkler Verlauf hinter der Überschrift ist Pflicht.', scene.id);
    }

    if (imageLed) {
      if (!scene.processImage) add('error', 'V2_PROCESS_IMAGE_MISSING', 'Bildszene benötigt Ausgangslage, Prozessweg und Ergebnis.', scene.id);
      if (scene.processImage?.decorativeOnly !== false) add('error', 'V2_DECORATIVE_IMAGE_FORBIDDEN', 'Reine Dekorationsbilder sind verboten.', scene.id);
      if ((scene.processImage?.instantReadabilitySeconds ?? Infinity) > 1) add('error', 'V2_PROCESS_IMAGE_TOO_SLOW', 'Prozessbild muss innerhalb einer Sekunde verständlich sein.', scene.id);
      if ((scene.visualPhases ?? []).length < 2) add('error', 'V2_IMAGE_PHASES_MISSING', 'Prozessbild benötigt mindestens zwei kontrollierte Bewegungsphasen.', scene.id);
    }

    if (animated) {
      if (!scene.animation) add('error', 'V2_ANIMATION_CONTRACT_MISSING', 'Animation benötigt Startzustand, Handlung und Endzustand.', scene.id);
      if ((scene.visualPhases ?? []).length < 3) add('error', 'V2_ANIMATION_PHASES_MISSING', 'Animation benötigt mindestens drei Ablaufphasen.', scene.id);
    }
  } else {
    if (scene.transition !== 'cut') {
      add('error', 'LITE_TRANSITION_NOT_CUT', `Übergang „${scene.transition}“ ist im Legacy-Bildmodus deaktiviert; nur cut ist erlaubt.`, scene.id);
    }
    if ((scene.visualPhases ?? []).length > 1) {
      add('error', 'LITE_MULTIPLE_PHASES', 'Im Legacy-Bildmodus ist nur ein statischer Zustand ab Frame 0 erlaubt.', scene.id);
    }
  }

  if ((scene.soundCues ?? []).length > 0) {
    add('error', 'SFX_DISABLED', 'SFX sind im aktuellen FinanzNeo-Standard deaktiviert.', scene.id);
  }

  const hasOwnImage = imageLed && scene.assetIds.length > 0;
  const textOnly = !hasOwnImage && !animated && sceneIndex === 0;
  if (textOnly) textOnlyScenes += 1;
}

if (usesVisualQualityV2) {
  const total = plan.scenes.length;
  const imageShare = imageLedScenes / total;
  const animationShare = animationScenes / total;
  if (imageShare < 0.55 || imageShare > 0.65) {
    add('error', 'V2_IMAGE_SHARE_INVALID', `Bildanteil muss 55–65 Prozent betragen; gefunden: ${(imageShare * 100).toFixed(1)} Prozent.`);
  }
  if (animationShare < 0.35 || animationShare > 0.45) {
    add('error', 'V2_ANIMATION_SHARE_INVALID', `Animationsanteil muss 35–45 Prozent betragen; gefunden: ${(animationShare * 100).toFixed(1)} Prozent.`);
  }
  if (animationScenes > 4) add('error', 'V2_TOO_MANY_ANIMATIONS', 'Höchstens vier hochwertige Animationen sind erlaubt.');

  const families = plan.scenes
    .filter((scene) => scene.type === 'animation')
    .map((scene) => scene.visualFamily)
    .filter(Boolean);
  if (new Set(families).size !== families.length) {
    add('error', 'V2_ANIMATION_FAMILY_DUPLICATE', 'Animationen benötigen unterschiedliche Raum- oder Bewegungslogiken.');
  }
} else {
  const targetImages = config.visuals.targetImageLedScenes;
  if (imageLedScenes < targetImages.min) {
    add('error', 'TOO_FEW_IMAGE_LED_SCENES', `Nur ${imageLedScenes} eigenständige Bilder geplant; mindestens ${targetImages.min} sind im Legacy-Modus Pflicht.`);
  }
  if (imageLedScenes > targetImages.max) {
    add('error', 'TOO_MANY_IMAGE_LED_SCENES', `${imageLedScenes} Bilder geplant; maximal ${targetImages.max} sind im Legacy-Modus vorgesehen.`);
  }
}

if (textOnlyScenes > config.visuals.maximumTextOnlyScenesPerReel) {
  add('error', 'TOO_MANY_TEXT_ONLY_SCENES', 'Das Reel darf nicht ohne sichtbares Hauptmotiv beginnen.');
}

for (const finding of findings) {
  const prefix = finding.severity === 'error' ? '✗' : '⚠';
  console.log(`${prefix} [${finding.code}]${finding.sceneId ? ` ${finding.sceneId}` : ''}: ${finding.message}`);
}

const errors = findings.filter((finding) => finding.severity === 'error');
if (errors.length) {
  console.error(`Creative QA fehlgeschlagen: ${errors.length} Fehler, ${findings.length - errors.length} Warnungen.`);
  process.exit(1);
}

if (usesVisualQualityV2) {
  console.log(`✓ Creative QA bestanden: Visual Quality V2, ${plan.scenes.length} Szenen, ${imageLedScenes} Prozessbilder, ${animationScenes} Animationen.`);
  console.log('✓ Header: helle große Überschrift, passendes Icon und weicher oberer Kontrastverlauf.');
} else {
  console.log(`✓ Creative QA bestanden: Legacy image-first-lite, ${plan.scenes.length} Szenen, ${imageLedScenes} eigenständige Bilder.`);
}
