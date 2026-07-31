#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan, normalizeWords} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const config = loadFinanceConfig();
const planArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!planArg) {
  console.error('Nutzung: node scripts/run-finance-script-qa.mjs <scene-plan.json>');
  process.exit(1);
}
const planFile = path.resolve(planArg);
if (!fs.existsSync(planFile)) throw new Error(`Szenenplan nicht gefunden: ${planFile}`);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(planFile, 'utf8')));

const findings = [];
const add = (severity, code, message, sceneId) => findings.push({severity, code, message, ...(sceneId ? {sceneId} : {})});
const words = (value) => normalizeWords(String(value ?? ''));
const normalize = (value) => words(value).join(' ');
const stopwords = new Set([
  'warum', 'wieso', 'weshalb', 'wie', 'was', 'welche', 'welcher', 'welches', 'wann',
  'dein', 'deine', 'deiner', 'dir', 'dich', 'der', 'die', 'das', 'ein', 'eine',
  'einer', 'einem', 'einen', 'und', 'oder', 'mit', 'für', 'von', 'auf', 'bei', 'im',
  'in', 'zu', 'ist', 'sind', 'wird', 'werden', 'kann', 'können', 'wirklich',
]);
const meaningfulTokens = (value) => new Set(words(value).filter((word) => word.length >= 4 && !stopwords.has(word)));
const relatedToken = (left, right) => left === right || (
  left.length >= 5 && right.length >= 5 && (
    left.startsWith(right) || right.startsWith(left) || left.endsWith(right) || right.endsWith(left)
  )
);
const overlapCount = (left, right) => {
  const a = meaningfulTokens(left);
  const b = meaningfulTokens(right);
  return [...a].filter((leftToken) => [...b].some((rightToken) => relatedToken(leftToken, rightToken))).length;
};
const sentenceParts = (value) => String(value ?? '')
  .split(/(?<=[.!?])\s+/)
  .map((sentence) => sentence.trim())
  .filter(Boolean);

const greetingPatterns = [
  /^hallo\b/,
  /^hi\b/,
  /^willkommen\b/,
  /in diesem video/,
  /in diesem reel/,
  /heute zeige ich dir/,
];
const vagueHookPatterns = [
  /^stell dir vor\b/,
  /^hast du dich (schon )?mal gefragt\b/,
  /^die meisten menschen wissen nicht\b/,
  /^kaum jemand weiß\b/,
  /^das kann teuer werden\b/,
  /^das musst du wissen\b/,
];
const fillerPatterns = [
  /wie du sicher weißt/,
  /im grunde genommen/,
  /sozusagen/,
  /an dieser stelle/,
  /lass uns gemeinsam/,
  /eigentlich kann man sagen/,
];
const metaNarrationPatterns = [
  /hier steht (die|eine) (starke )?hook/,
  /danach (erklärst|erkläre|zeigen wir|zeigst)\b/,
  /jetzt (zeigst|zeige|rechnest|rechne)\b/,
  /anschließend (erklärst|erkläre|zeigen wir|zeigst)\b/,
  /ein konkretes beispiel verbindet\b/,
  /diese szene zeigt\b/,
  /der zuschauer (sieht|erfährt|versteht)\b/,
  /der payoff (ist|beantwortet|lautet)\b/,
  /zum schluss folgt\b/,
  /zum schluss verweist\b/,
  /hier wird (gezeigt|erklärt)\b/,
  /\[(hook|relevanz|basis|mechanismus|beispiel|vergleich|entwicklung|rechnung|payoff|cta)\b/,
];
const weakSequenceOpenings = /^(danach|jetzt|anschließend|als nächstes|zum schluss)\b/;
const strongHookAction = /(kostet|kosten|verlier|fehl|spar|zahl|wächst|steigt|sinkt|fällt|schrumpft|verdoppelt|halbiert|teurer|günstiger|weniger|mehr|kauft|kaufen|bleibt)/;
const concreteFinanceTerms = /(euro|cent|prozent|konto|etf|aktie|fonds|kredit|rate|sparplan|warenkorb|miete|gebühr|kosten|steuer|depot|rendite|inflation|kaufkraft|zins|schulden|dividende|einzahlung|auszahlung|kapital|preis|budget|gehalt|vermögen|bank|unternehmen)/;
const visibleActionTerms = /(wächst|steigt|sinkt|fällt|schrumpft|fließt|verteilt|abgezogen|zahlt|spart|kauft|kostet|verdoppelt|halbiert|verliert|gewinnt|füllt|trennt|wandert|bleibt|erhöht|reduziert|senkt|vergleicht)/;
const comparisonTerms = /(heute|später|morgen|vorher|nachher|während|dagegen|statt|option a|option b|mehr als|weniger als|teurer|günstiger|gleich viel|unterschied)/;
const timeOrNumber = /(\d|euro|prozent|jahr|jahre|monat|monate|woche|wochen|tag|tage|jährlich|monatlich)/;

const scriptWordCount = words(plan.scriptText).length;
if (scriptWordCount < config.script.words.min || scriptWordCount > config.script.words.max) {
  add('error', 'SCRIPT_WORD_COUNT', `Skript enthält ${scriptWordCount} Wörter; erlaubt sind ${config.script.words.min}–${config.script.words.max}.`);
}

const hook = plan.scenes[0];
const hookWords = words(hook.voiceText);
const normalizedHook = hookWords.join(' ');
if (hookWords.length < 8) add('error', 'HOOK_TOO_SHORT', `Hook enthält nur ${hookWords.length} Wörter.`, hook.id);
if (hookWords.length > 24) add('error', 'HOOK_TOO_LONG', `Hook enthält ${hookWords.length} Wörter; Thema und Geldfolge schneller nennen.`, hook.id);
for (const pattern of greetingPatterns) {
  if (pattern.test(normalizedHook)) add('error', 'HOOK_META_OPENING', 'Hook beginnt mit Begrüßung oder Meta-Einleitung statt direkt mit dem Finanzthema.', hook.id);
}
for (const pattern of vagueHookPatterns) {
  if (pattern.test(normalizedHook)) add('error', 'HOOK_VAGUE_OPENING', 'Hook beginnt mit einer allgemeinen Social-Media-Floskel statt mit dem konkreten Finanzthema.', hook.id);
}
const topicReference = `${plan.title} ${plan.centralQuestion}`;
if (overlapCount(hook.voiceText, topicReference) < 1) {
  add('error', 'HOOK_TOPIC_NOT_CLEAR', 'Die Hook übernimmt keinen konkreten Themenbegriff aus Titel oder zentraler Zuschauerfrage.', hook.id);
}
if (!hook.voiceText.includes('?') && !strongHookAction.test(normalizedHook)) {
  add('error', 'HOOK_NO_CLEAR_QUESTION_OR_CONSEQUENCE', 'Hook braucht eine klare Frage oder eine sichtbare Geldfolge als starke Aussage.', hook.id);
}
if (sentenceParts(hook.voiceText).length > 2) {
  add('error', 'HOOK_TOO_MANY_SENTENCES', 'Hook enthält mehr als zwei Sätze und startet dadurch zu langsam.', hook.id);
}

const imageScenes = plan.scenes.filter((scene) => scene.layout === 'full-bleed' || scene.layout === 'framed-image');
const targetImages = config.visuals.targetImageLedScenes ?? {min: 6, ideal: 7, max: 9};
if (imageScenes.length < targetImages.min || imageScenes.length > targetImages.max) {
  add('error', 'SCRIPT_VISUAL_IMAGE_COUNT', `${imageScenes.length} Bildbeats geplant; für ein normales Reel sind ${targetImages.min}–${targetImages.max} erforderlich.`);
}

const imageAssetOwners = new Map();
let consecutiveWeakVisuals = 0;
for (const scene of plan.scenes) {
  const sceneWords = words(scene.voiceText);
  const normalized = sceneWords.join(' ');
  const sentences = sentenceParts(scene.voiceText);

  if (sceneWords.length < 6) add('warning', 'SCENE_TEXT_TOO_SHORT', `Szene besitzt nur ${sceneWords.length} gesprochene Wörter.`, scene.id);
  if (sceneWords.length > 30) add('error', 'SCENE_TEXT_TOO_LONG', `Szene besitzt ${sceneWords.length} Wörter; auf eine Aussage reduzieren.`, scene.id);
  if (sentences.length > 2) add('error', 'TOO_MANY_SENTENCES_PER_SCENE', `${sentences.length} Sätze in einer Szene; normalerweise genau einen Satz verwenden.`, scene.id);
  if (sentences.length === 2) add('warning', 'TWO_SENTENCES_ONE_SCENE', 'Zwei Sätze nur behalten, wenn beide exakt dieselbe Bildidee tragen.', scene.id);

  for (const sentence of sentences) {
    const length = words(sentence).length;
    if (length > 32) add('error', 'SENTENCE_FAR_TOO_LONG', `Ein Satz enthält ${length} Wörter und bündelt zu viele Gedanken.`, scene.id);
    else if (length > 24) add('warning', 'SENTENCE_TOO_LONG', `Ein Satz enthält ${length} Wörter; kürzer und bildhafter formulieren.`, scene.id);
  }

  for (const pattern of fillerPatterns) {
    if (pattern.test(normalized)) add('warning', 'FILLER_PHRASE', `Vermeidbare Füllformulierung erkannt: ${pattern}.`, scene.id);
  }
  for (const pattern of metaNarrationPatterns) {
    if (pattern.test(normalized)) add('error', 'META_SCRIPT_LANGUAGE', 'Voiceover enthält eine Planungsanweisung statt der eigentlichen Finanzgeschichte.', scene.id);
  }
  if (weakSequenceOpenings.test(normalized)) {
    add('warning', 'WEAK_SEQUENCE_OPENING', 'Szene startet mit einem Produktionsübergang. Besser direkt mit Objekt, Zahl oder Geldfolge beginnen.', scene.id);
  }

  const concreteSignals = [
    concreteFinanceTerms.test(normalized),
    visibleActionTerms.test(normalized),
    comparisonTerms.test(normalized),
    timeOrNumber.test(normalized),
  ].filter(Boolean).length;
  if (concreteSignals < 2 && scene.layout !== 'cta') {
    add('warning', 'SCENE_HARD_TO_VISUALIZE', 'Satz enthält zu wenige konkrete Objekte, Zahlen, Aktionen oder Vergleiche für eine schnelle Visualisierung.', scene.id);
  }

  const connectorCount = (normalized.match(/\b(und|aber|während|obwohl|dadurch|deshalb|sodass|wobei|hingegen)\b/g) ?? []).length;
  if (connectorCount >= 3) add('warning', 'TOO_MANY_IDEAS_IN_SCENE', 'Satz verbindet vermutlich mehr als zwei Gedanken. Auf neue Szene oder Mehrfachbild aufteilen.', scene.id);

  const visualReference = [
    scene.visualAction,
    scene.purpose,
    scene.content?.headline,
    scene.content?.body,
    scene.imagePrompt,
  ].filter(Boolean).join(' ');
  if (scene.layout !== 'cta' && overlapCount(scene.voiceText, visualReference) < 1) {
    add('warning', 'VOICE_VISUAL_MISMATCH', 'Voiceover und geplante Visualisierung teilen keinen konkreten Begriff.', scene.id);
  }

  if ((comparisonTerms.test(normalized) || /gegen|versus|unterschied/.test(normalized)) && scene.layout === 'text-punch') {
    add('warning', 'COMPARISON_NEEDS_VISUAL_FORMAT', 'Direkter Vergleich sollte als Vorher/Nachher, 2-in-1, Split-Vergleich oder Diagramm visualisiert werden.', scene.id);
  }
  if (/drei (schritte|stufen|teile|wege)/.test(normalized) && !(scene.content?.steps?.length === 3 || scene.imagePrompt?.trim())) {
    add('warning', 'THREE_STAGE_VISUAL_MISSING', 'Dreistufige Aussage benötigt 3-in-1-Bild, Prozess oder drei Remotion-Schritte.', scene.id);
  }
  if (/vier (punkte|regeln|gründe|schritte|fehler)/.test(normalized) && !(scene.content?.steps?.length === 4 || scene.imagePrompt?.trim())) {
    add('warning', 'FOUR_STAGE_VISUAL_MISSING', 'Vier gleichwertige Punkte benötigen 4-in-1-Bild oder vier klar gestaffelte Remotion-Elemente.', scene.id);
  }

  const strongVisual = ['full-bleed', 'framed-image', 'big-number', 'split-comparison', 'process', 'chart'].includes(scene.layout);
  consecutiveWeakVisuals = strongVisual ? 0 : consecutiveWeakVisuals + 1;
  if (consecutiveWeakVisuals > 2) add('error', 'TOO_MANY_SCENES_WITHOUT_NEW_VISUAL', 'Mehr als zwei Szenen ohne neues Bild oder gleichwertige datengetriebene Visualisierung.', scene.id);

  for (const assetId of (scene.assetIds ?? []).filter((id) => id.startsWith('images-'))) {
    const owner = imageAssetOwners.get(assetId);
    if (owner && owner !== scene.id) add('error', 'IMAGE_REUSED_ACROSS_DIFFERENT_IDEAS', `Bild-Asset ${assetId} wird für mehrere Szenen verwendet (${owner}, ${scene.id}).`, scene.id);
    else imageAssetOwners.set(assetId, scene.id);
  }

  const isDateSensitive = config.financialSafety.dateSensitiveTerms.some((term) => normalized.includes(normalize(term)));
  if (isDateSensitive) {
    for (const phrase of config.financialSafety.absoluteClaimPhrases ?? []) {
      const normalizedPhrase = normalize(phrase);
      if (normalizedPhrase && normalized.includes(normalizedPhrase)) {
        add('warning', 'ABSOLUTE_CLAIM_WORDING', `Zeit- oder quellensensitive Aussage ist zu absolut formuliert: „${phrase}“. Wortlaut enger an die Quelle anpassen.`, scene.id);
      }
    }
  }
}

const jaccard = (left, right) => {
  const a = meaningfulTokens(left);
  const b = meaningfulTokens(right);
  const intersection = [...a].filter((word) => b.has(word)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
};
for (let index = 1; index < plan.scenes.length; index += 1) {
  const similarity = jaccard(plan.scenes[index - 1].voiceText, plan.scenes[index].voiceText);
  if (similarity > 0.62) add('warning', 'ADJACENT_REPETITION', `Aufeinanderfolgende Szenen wiederholen sich stark (${Math.round(similarity * 100)} % Wortüberschneidung).`, plan.scenes[index].id);
}

const cta = plan.scenes.at(-1);
if (cta.layout !== 'cta') add('error', 'CTA_NOT_LAST', 'Die letzte Szene muss das CTA-Layout verwenden.', cta.id);
if ((cta.claimIds ?? []).length > 0) add('error', 'CTA_NEW_CLAIM', 'Die CTA-Szene darf keine neue Finanzbehauptung einführen.', cta.id);
if (/\d/.test(cta.voiceText)) add('warning', 'CTA_NEW_NUMBER', 'Die CTA-Szene enthält eine Zahl; prüfen, ob neue Information eingeführt wird.', cta.id);

const payoffScene = plan.scenes.at(-2);
if (payoffScene.layout !== 'text-punch' || payoffScene.variant !== 'payoff') {
  add('error', 'PAYOFF_POSITION', 'Die vorletzte Szene muss den klaren Text-Punch-Payoff liefern.', payoffScene.id);
}
const payoffTokens = meaningfulTokens(plan.payoff);
const payoffVoiceTokens = meaningfulTokens(payoffScene.voiceText);
const payoffOverlap = payoffTokens.size
  ? [...payoffTokens].filter((word) => [...payoffVoiceTokens].some((token) => relatedToken(word, token))).length / payoffTokens.size
  : 0;
if (payoffOverlap < 0.3) add('warning', 'PAYOFF_TEXT_MISMATCH', 'Gesprochener Payoff greift die geplante Kernaussage nur schwach auf.', payoffScene.id);

const questionTokens = meaningfulTokens(plan.centralQuestion);
const fullScriptTokens = meaningfulTokens(plan.scriptText);
const questionCoverage = questionTokens.size
  ? [...questionTokens].filter((word) => [...fullScriptTokens].some((token) => relatedToken(word, token))).length / questionTokens.size
  : 0;
if (questionCoverage < 0.45) add('warning', 'CENTRAL_QUESTION_DRIFT', 'Skript entfernt sich sprachlich stark von der zentralen Zuschauerfrage.');

const errors = findings.filter((finding) => finding.severity === 'error');
const warnings = findings.filter((finding) => finding.severity === 'warning');
console.log(`${errors.length ? '✗' : '✓'} Finance-Skript-QA: ${errors.length} Fehler, ${warnings.length} Warnungen`);
for (const finding of findings) {
  console.log(`${finding.severity.toUpperCase()} ${finding.code}${finding.sceneId ? ` [${finding.sceneId}]` : ''}: ${finding.message}`);
}
process.exitCode = errors.length ? 1 : 0;
