#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan, normalizeWords} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const config = loadFinanceConfig();
const planFile = path.resolve(process.argv[2] || 'scene-plan.json');
if (!fs.existsSync(planFile)) throw new Error(`scene-plan.json fehlt: ${planFile}`);

const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(planFile, 'utf8')));
const findings = [];
const add = (severity, code, message, sceneId) => findings.push({severity, code, message, sceneId});
const normalizedPhrase = (value) => normalizeWords(String(value ?? '')).join(' ');
const wordCount = (value) => normalizeWords(String(value ?? '')).length;
let textOnlyScenes = 0;
let imageLedScenes = 0;

if (config.visuals.productionMode !== 'image-first-lite') {
  add('error', 'PRODUCTION_MODE_INVALID', 'FinanzNeo muss aktuell im Modus image-first-lite arbeiten.');
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

  const imageLed = scene.layout === 'full-bleed' || scene.layout === 'framed-image';
  if (imageLed) {
    imageLedScenes += 1;
    if (!scene.imagePrompt?.trim()) add('warning', 'SCENE_IMAGE_PROMPT_PENDING', 'Bildprompt fehlt noch; wird nach Designfreigabe erzeugt.', scene.id);
    if ((scene.assetIds ?? []).length === 0) add('error', 'SCENE_IMAGE_REFERENCE_MISSING', 'Bildszene benötigt eine geplante Asset-ID.', scene.id);
  }

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
    add('error', 'SUPPORT_DETAILS_OVERLOAD', `${supportDetails.length} Zusatzinfos geplant; im einfachen Bildmodus sind maximal ${config.visuals.supportDetails.maximumPerScene} erlaubt.`, scene.id);
  }
  const normalizedDetails = supportDetails.map(normalizedPhrase);
  if (new Set(normalizedDetails).size !== normalizedDetails.length) {
    add('error', 'SUPPORT_DETAILS_DUPLICATE', 'Zusatzinfos wiederholen sich innerhalb derselben Szene.', scene.id);
  }

  if (scene.transition !== 'cut') {
    add('error', 'LITE_TRANSITION_NOT_CUT', `Übergang „${scene.transition}“ ist im image-first-lite-Modus deaktiviert; nur cut ist erlaubt.`, scene.id);
  }
  if ((scene.visualPhases ?? []).length > 1) {
    add('error', 'LITE_MULTIPLE_PHASES', 'Im einfachen Bildmodus ist nur ein statischer Zustand ab Frame 0 erlaubt.', scene.id);
  }
  if ((scene.soundCues ?? []).length > 0) {
    add('error', 'LITE_SFX_DISABLED', 'SFX sind im aktuellen Bild-Reel-Modus deaktiviert.', scene.id);
  }

  const hasOwnImage = imageLed && scene.assetIds.length > 0;
  const textOnly = !hasOwnImage && sceneIndex === 0;
  if (textOnly) textOnlyScenes += 1;
}

const targetImages = config.visuals.targetImageLedScenes;
if (imageLedScenes < targetImages.min) {
  add('error', 'TOO_FEW_IMAGE_LED_SCENES', `Nur ${imageLedScenes} eigenständige Bilder geplant; mindestens ${targetImages.min} sind Pflicht.`);
}
if (imageLedScenes > targetImages.max) {
  add('error', 'TOO_MANY_IMAGE_LED_SCENES', `${imageLedScenes} Bilder geplant; maximal ${targetImages.max} bleiben für die erste Produktionsphase übersichtlich.`);
}
if (textOnlyScenes > config.visuals.maximumTextOnlyScenesPerReel) {
  add('error', 'TOO_MANY_TEXT_ONLY_SCENES', 'Das Reel darf nicht ohne sichtbares Bild beginnen.');
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

console.log(`✓ Creative QA bestanden: image-first-lite, ${plan.scenes.length} Szenen, ${imageLedScenes} eigenständige Bilder, nur harte Schnitte, statische Header und Untertitel.`);
