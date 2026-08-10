#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const reelsRoot = path.join(root, 'channels', 'finanzneo', 'reels');
const topicHistory = JSON.parse(fs.readFileSync(path.join(root, 'channels/finanzneo/engine/topic-history.json'), 'utf8'));
const topicBySlug = new Map((topicHistory.topics ?? []).map((entry) => [entry.slug, entry]));
const errors = [];
const warnings = [];
const projectArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

const normalize = (value) => String(value ?? '')
  .toLocaleLowerCase('en-US')
  .replace(/[„“”"'’]/g, '')
  .replace(/[^a-z0-9äöüß€%:-]+/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const containsPositiveTerm = (text, term) => String(text ?? '')
  .split(/[.!?;\n]+/)
  .some((sentence) => {
    const normalizedSentence = normalize(sentence);
    if (!normalizedSentence.includes(normalize(term))) return false;
    return !/\b(?:no|without|never|avoid|forbidden|kein|keine|ohne|niemals|vermeiden|verboten)\b/.test(normalizedSentence);
  });

const findFiles = (dir, name) => {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(absolute, name));
    else if (entry.name === name) results.push(absolute);
  }
  return results;
};

let statusFiles;
if (projectArg) {
  const projectDir = path.resolve(projectArg);
  const relative = path.relative(reelsRoot, projectDir);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    console.error('✗ Projektspezifische FinanzNeo-Prüfung ist nur unter channels/finanzneo/reels erlaubt.');
    process.exit(1);
  }
  statusFiles = [financeProjectPaths(projectDir).status];
} else {
  statusFiles = findFiles(reelsRoot, 'production-status.json');
}

const nonProductionStages = new Set(['planning', 'scaffolded', 'draft', 'content-review-required']);
const forbiddenLegacyTerms = [
  'depotordner', 'depotkorb', 'umsatzbehälter', 'gewinnanzeiger', 'sparplan-behälter',
  'gebührenschale', 'kostenschale', 'zeitlandschaft', 'zeitplatte', 'kalenderreifen',
  'kalenderbahn', 'rechenstrecke', 'rechenbogen', 'kurssäule', 'finanzstation',
  'ergebnisstation', 'finanzmaschine', 'finanzbühne', 'finanzwelt', 'wachstumsspur',
  'kostenroute', 'geldstrom', 'verliert nur auf dem papier', 'garantierte rendite',
];

for (const statusFile of statusFiles) {
  if (!fs.existsSync(statusFile)) {
    errors.push(`Produktionsstatus fehlt: ${path.relative(root, statusFile)}`);
    continue;
  }

  const projectDir = path.dirname(path.dirname(statusFile));
  const paths = financeProjectPaths(projectDir);
  const relativeProject = path.relative(root, projectDir);
  const exists = (file) => fs.existsSync(file) && fs.statSync(file).isFile() && fs.statSync(file).size > 0;
  const read = (file) => exists(file) ? fs.readFileSync(file, 'utf8').trim() : '';

  let status;
  let plan;
  try { status = JSON.parse(fs.readFileSync(statusFile, 'utf8')); } catch (error) {
    errors.push(`${relativeProject}: production-status.json ist ungültig: ${error.message}`);
    continue;
  }
  try { plan = ScenePlan.parse(JSON.parse(read(paths.scenePlan))); } catch (error) {
    errors.push(`${relativeProject}: scene-plan.json ist ungültig: ${error.message}`);
    continue;
  }

  if (status.slug !== plan.slug) errors.push(`${relativeProject}: Slug in Status und Szenenplan ist verschieden.`);
  if (status.title !== plan.title) errors.push(`${relativeProject}: Titel in Status und Szenenplan ist verschieden.`);
  if (status.projectPath !== relativeProject.split(path.sep).join('/')) errors.push(`${relativeProject}: projectPath zeigt nicht auf den tatsächlichen Reel-Ordner.`);

  const topic = topicBySlug.get(plan.slug);
  if (!topic) warnings.push(`${relativeProject}: Thema fehlt im Themenregister.`);
  else if (normalize(topic.topic) !== normalize(status.topic)) errors.push(`${relativeProject}: Themenregister und Produktionsstatus verwenden verschiedene Themen.`);

  const strict = Boolean(projectArg) || !nonProductionStages.has(status.stage);
  if (!strict) {
    if (Object.entries(status.approvals ?? {}).some(([key, value]) => key !== 'topicSelected' && value === true)) errors.push(`${relativeProject}: Nicht produktionsfreigegebenes Projekt darf keine Skript-, Design- oder Assetfreigabe besitzen.`);
    if (status.stage === 'content-review-required') warnings.push(`${relativeProject}: quarantänierter Review-Entwurf wird nicht als neue Produktionsvorlage geprüft.`);
    continue;
  }

  const requiredFiles = [
    paths.scriptMarkdown,
    paths.voiceScript,
    paths.voicePrompt,
    paths.socialCaption,
    paths.pdfContent,
    paths.sources,
    paths.storyboard,
    paths.motionDesign,
  ];
  for (const file of requiredFiles) if (!exists(file)) errors.push(`${relativeProject}: Pflichtdatei fehlt oder ist leer: ${path.relative(projectDir, file)}`);

  if (read(paths.voiceScript) !== plan.scriptText.trim()) errors.push(`${relativeProject}: script-fliesstext.txt stimmt nicht mit scene-plan.json überein.`);
  if (!read(paths.voicePrompt).includes(plan.scriptText.trim())) errors.push(`${relativeProject}: voiceover.txt enthält nicht das aktuelle vollständige Skript.`);

  const coveredClaims = new Set((plan.sources ?? []).flatMap((source) => source.claimIds ?? []));
  for (const scene of plan.scenes) for (const claimId of scene.claimIds ?? []) if (!coveredClaims.has(claimId)) errors.push(`${relativeProject}/${scene.id}: Claim ${claimId} besitzt keine Quelle.`);

  if (status.stage === 'ready' && ['scriptApproved', 'designAnchorApproved', 'assetsReviewed'].some((key) => status.approvals?.[key] !== true)) errors.push(`${relativeProject}: READY benötigt alle Freigaben.`);

  const corpus = [read(paths.storyboard), read(paths.motionDesign), read(paths.socialCaption), read(paths.pdfContent), read(paths.sources)].join('\n');
  for (const term of forbiddenLegacyTerms) if (containsPositiveTerm(corpus, term)) errors.push(`${relativeProject}: veralteter oder riskanter Inhalt gefunden: „${term}“.`);
  if (/FINANCE_TODO|AUSFÜLLEN|NOCH NICHT FREIGEGEBEN/i.test(corpus)) errors.push(`${relativeProject}: Inhaltspaket enthält noch einen Platzhalter.`);
}

for (const warning of warnings) console.warn(`⚠ ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`FinanzNeo-Konsistenzprüfung fehlgeschlagen: ${errors.length} Fehler, ${warnings.length} Warnungen.`);
  process.exit(1);
}
console.log(`✓ FinanzNeo-Konsistenzprüfung bestanden: ${statusFiles.length} Projekt(e), 0 Fehler, ${warnings.length} Warnungen. Bildstil-Vorgaben sind aktuell nicht Teil dieser Prüfung (v6-System entfernt).`);
