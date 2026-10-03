#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex >= 0 ? args[targetIndex + 1] : undefined;

if (!target) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types ...]');
  process.exit(1);
}

const scaffold = spawnSync(process.execPath, [resolve('scripts/scaffold-finanzneo-youtube.mjs'), ...args], {stdio: 'inherit'});
if (scaffold.status !== 0) process.exit(scaffold.status ?? 1);

const projectRoot = resolve(target);
const visualsRoot = resolve(projectRoot, '04-visuals/EINZELNE-VISUALS');
const promptDirectory = resolve(projectRoot, '04-visuals/01-BILDPROMPTS');
const allPromptsPath = resolve(projectRoot, '04-visuals/alle-bildprompts.txt');
const imageWorldOldPath = resolve(projectRoot, '04-visuals/bildwelt.txt');
const imageWorldNewPath = resolve(promptDirectory, 'bildwelt.txt');
const thumbnailOldPath = resolve(projectRoot, '04-visuals/thumbnail-prompt.txt');
const thumbnailNewPath = resolve(promptDirectory, 'thumbnail-prompt.txt');

if (!existsSync(allPromptsPath)) {
  console.error('04-visuals/alle-bildprompts.txt fehlt; vollständiger Flow-Master-Prompt konnte nicht erzeugt werden.');
  process.exit(1);
}
mkdirSync(promptDirectory, {recursive: true});

const visualSystemRules = `FINANZNEO GOOGLE FLOW MASTER — VERBINDLICH\n\nDIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG. NICHT nur erklären oder Prompts zurückgeben: die geforderten Bildjobs tatsächlich starten.\n\nSTYLE_AUTHORITY: finanzneo-stylized-3d-animated-black-v9\nPRIMARY_APPROVED_STYLE_ANCHOR: finanzneo-premium-physical-editorial-v8\nGROUNDING_REFERENCE: finanzneo-youtube-grounded-3d-black-v1\n\nDie FinanzNeo-Bildwelt ist eine hochwertige stilisierte 3D-Animationsfilm-/Editorial-Welt mit real verständlichen Situationen. Ein schwarzer Hintergrund allein ist KEINE Bildwelt. Keine kleinen schwebenden Karten, Tiles, Dashboards oder Mini-Objekte in riesiger schwarzer Leere.\n\nZWEI ERLAUBTE DARSTELLUNGSARTEN INNERHALB DERSELBEN WELT:\nA) GROUNDED SCENE — reale Objekte/Situation, räumlich, materialreich, stilisiertes 3D.\nB) SIMPLE EXPLAINER — klare frontale Zahl/Symbol/Chart/Metapher/Vergleichskomposition, großflächig und reduziert, aber mit derselben FinanzNeo-Farb-, Licht- und Qualitätswelt.\n\nSIMPLE EXPLAINER bedeutet niemals PowerPoint, Canva, Dashboard oder kleine Floating Tiles. Die wichtigste Aussage muss groß sein und innerhalb von 1–2 Sekunden verstanden werden.\n\nHARD FAIL: Hauptmotiv zu klein; überwiegend leerer schwarzer Raum; Dashboard/UI-HUD; schwebende Kärtchen; sterile Produktaufnahme; Mini-Diorama; Stock-Vector; photorealistisch; toy/clay/Pixar; generische Gold-Luxus-Finanzoptik.\n`;

const allPrompts = readFileSync(allPromptsPath, 'utf8');
const expandedVisualForms = allPrompts.replace(
  'VISUAL_FORM: [character-story | object-story | comparison | chart | diagram | editorial | illustration | metaphor | hybrid]',
  'VISUAL_FORM: [grounded-scene | simple-explainer | character-story | object-story | number-focus | symbol-focus | comparison | chart | diagram | editorial | illustration | metaphor | ui-example | asset-group | concept-cluster | quote-card | hybrid]',
);
writeFileSync(allPromptsPath, `${visualSystemRules}\n\n${expandedVisualForms}`);

// Internal prompt sources live together under 04-visuals/01-BILDPROMPTS/.
// The user-facing complete master prompt deliberately stays at 04-visuals/alle-bildprompts.txt.
if (existsSync(imageWorldOldPath)) {
  const existing = readFileSync(imageWorldOldPath, 'utf8');
  writeFileSync(imageWorldOldPath, `${visualSystemRules}\n\n${existing}`);
  renameSync(imageWorldOldPath, imageWorldNewPath);
}
if (existsSync(thumbnailOldPath)) {
  const existing = readFileSync(thumbnailOldPath, 'utf8');
  writeFileSync(thumbnailOldPath, `${visualSystemRules}\n\n${existing}`);
  renameSync(thumbnailOldPath, thumbnailNewPath);
}

if (existsSync(visualsRoot)) {
  for (const entry of readdirSync(visualsRoot, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const oldPromptPath = resolve(visualsRoot, entry.name, 'bildprompt.txt');
    if (!existsSync(oldPromptPath)) continue;
    const newPromptDir = resolve(promptDirectory, entry.name);
    const newPromptPath = resolve(newPromptDir, 'bildprompt.txt');
    mkdirSync(newPromptDir, {recursive: true});
    const existing = readFileSync(oldPromptPath, 'utf8');
    writeFileSync(oldPromptPath, `${visualSystemRules}\n\n${existing}`);
    renameSync(oldPromptPath, newPromptPath);
  }
}

const indexPath = resolve(projectRoot, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld.referencePromptFile = '04-visuals/01-BILDPROMPTS/bildwelt.txt';
index.imageWorld.primaryApprovedStyleAnchor = 'finanzneo-premium-physical-editorial-v8';
index.imageWorld.flowVisualModes = ['grounded-scene', 'simple-explainer'];
index.thumbnail.planFile = '04-visuals/01-BILDPROMPTS/thumbnail-prompt.txt';
for (const visual of index.visuals ?? []) {
  const newImagePrompt = `04-visuals/01-BILDPROMPTS/${visual.id}/bildprompt.txt`;
  if (visual.type === 'image') visual.planFile = newImagePrompt;
  if (visual.type === 'hybrid') visual.imagePlanFile = newImagePrompt;
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — genau eine Datei kopieren\n\nKopiere **genau diese Datei vollständig und 1:1** in den Google-Flow-Agenten:\n\n\`04-visuals/alle-bildprompts.txt\`\n\nDiese Datei ist immer der vollständige ausführbare Master-Prompt. Sie darf niemals durch einen Hinweis, Redirect oder Platzhalter ersetzt werden. Interne Stil-/Thumbnail-/Einzelpromptquellen liegen gesammelt unter \`04-visuals/01-BILDPROMPTS/\`.\n`,
);

console.log('✓ Google Flow: vollständiger Nutzer-Master-Prompt = 04-visuals/alle-bildprompts.txt');
console.log('✓ Kein Redirect/Stub: die Datei enthält die tatsächlichen ausführbaren Bildjobs.');
console.log('✓ Interne Promptquellen liegen gesammelt unter 04-visuals/01-BILDPROMPTS/.');
console.log('✓ Bildwelt: Grounded Scene + Simple Explainer in derselben FinanzNeo-Welt.');
