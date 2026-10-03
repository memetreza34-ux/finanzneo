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
const legacyPromptPath = resolve(projectRoot, '04-visuals/alle-bildprompts.txt');
const masterPromptPath = resolve(promptDirectory, 'GOOGLE-FLOW-PROMPT.txt');
const imageWorldOldPath = resolve(projectRoot, '04-visuals/bildwelt.txt');
const imageWorldNewPath = resolve(promptDirectory, 'bildwelt.txt');
const thumbnailOldPath = resolve(projectRoot, '04-visuals/thumbnail-prompt.txt');
const thumbnailNewPath = resolve(promptDirectory, 'thumbnail-prompt.txt');

if (!existsSync(legacyPromptPath)) {
  console.error('Interner Scaffold-Flow-Prompt fehlt; Master-Prompt konnte nicht erzeugt werden.');
  process.exit(1);
}
mkdirSync(promptDirectory, {recursive: true});
renameSync(legacyPromptPath, masterPromptPath);

const routingRules = `FINANZNEO ENGINE ROUTING — VERBINDLICH\n\nGOOGLE FLOW nur für PHYSICAL / EDITORIAL / REAL-LIFE Szenen mit greifbaren Objekten, Material und räumlicher Ursache/Wirkung.\n\nREMOTION / SVG / REACT bevorzugen für exakte Zahlen/Rechenaufteilungen, Charts/Graphen, Checklisten, UI/Settings, Quotes/Key Statements, Timelines, text-/datengetriebene Vergleiche und einfache Symbole, die sauber in Code gebaut werden können.\n\nWICHTIG: Ein einfaches Visual darf einfach bleiben. Nicht künstlich in eine 3D-Tile-, Dashboard- oder Panel-Szene verwandeln.\n\nPRIMARY_APPROVED_STYLE_ANCHOR: finanzneo-premium-physical-editorial-v8\nGROUNDING_REFERENCE: finanzneo-youtube-grounded-3d-black-v1\n\nJeder echte Flow-Szenenjob braucht EIN dominantes physisches Hero-Objekt (ca. 45–65 % der nutzbaren Fläche), medium-close Editorial-Kamera, 0–3 sinnvolle Support-Objekte, echte Materialstärke, Tiefenhierarchie, weiche Kontaktschatten und einen nahtlosen deep-charcoal-green-black Hintergrund mit subtiler Tonalität. Kein kleines Motiv in riesiger schwarzer Leere. Keine Floating Tiles, Dashboards, UI-Panels, Dioramen, Canva-/PowerPoint-Optik oder sterile Produktaufnahme.\n`;

const masterPrompt = readFileSync(masterPromptPath, 'utf8');
const expandedVisualForms = masterPrompt.replace(
  'VISUAL_FORM: [character-story | object-story | comparison | chart | diagram | editorial | illustration | metaphor | hybrid]',
  'VISUAL_FORM: [physical-editorial-scene | character-story | object-story | metaphor | comparison | hybrid]',
);
writeFileSync(masterPromptPath, `${routingRules}\n\n${expandedVisualForms}`);

// Move all prompt-related sources under 04-visuals/01-BILDPROMPTS/.
if (existsSync(imageWorldOldPath)) {
  const existing = readFileSync(imageWorldOldPath, 'utf8');
  writeFileSync(imageWorldOldPath, `${routingRules}\n\n${existing}`);
  renameSync(imageWorldOldPath, imageWorldNewPath);
}
if (existsSync(thumbnailOldPath)) {
  const existing = readFileSync(thumbnailOldPath, 'utf8');
  writeFileSync(thumbnailOldPath, `${routingRules}\n\n${existing}`);
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
    writeFileSync(oldPromptPath, `${routingRules}\n\n${existing}`);
    renameSync(oldPromptPath, newPromptPath);
  }
}

// Rewrite the generated visual-index to the consolidated prompt locations and lock routing metadata.
const indexPath = resolve(projectRoot, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld.referencePromptFile = '04-visuals/01-BILDPROMPTS/bildwelt.txt';
index.imageWorld.primaryApprovedStyleAnchor = 'finanzneo-premium-physical-editorial-v8';
index.imageWorld.engineRouting = 'precision-first-remotion-physical-editorial-flow';
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
  `${readme.trim()}\n\n## Google Flow — Nutzerübergabe\n\nDer Nutzer kopiert **nur eine einzige Datei** vollständig in den Google-Flow-Agenten:\n\n\`04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt\`\n\nAlle Bildprompt-Dateien liegen im selben Ordnerbereich. Präzise Zahlen-, Chart-, Checklist-, UI-, Quote- und Timeline-Visuals werden bevorzugt in Remotion/SVG/React gebaut statt als künstliche Flow-Infografik. \`EINZELNE-VISUALS/\` enthält dadurch primär Motion-/Datenquellen statt verstreuter Bildprompts.\n`,
);

console.log('✓ Google Flow: Master-Prompt liegt in 04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt');
console.log('✓ Alle Bildprompt-Quellen wurden unter 04-visuals/01-BILDPROMPTS/ konsolidiert.');
console.log('✓ Routing: precision-first Remotion · physical/editorial Google Flow.');
console.log('✓ Bildwelt: Premium Physical Editorial V8 ist primärer Flow-Stilanker.');
