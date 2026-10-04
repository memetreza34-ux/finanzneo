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

const visualSystemRules = `FINANZNEO GOOGLE FLOW MASTER — VERBINDLICH\n\nDIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG. NICHT nur erklären oder Prompts zurückgeben: die geforderten Bildjobs tatsächlich starten.\n\nSTYLE_AUTHORITY: finanzneo-youtube-v9-front-readable-v2\nSOURCE_VISUAL_LANGUAGE: finanzneo-stylized-3d-animated-black-v9\nPRIMARY_APPROVED_STYLE_ANCHOR: finanzneo-premium-physical-editorial-v8\nLEGACY_PROMPT_DNA: finanzneo-stylized-3d-editorial-v5\nFLOW_IMAGE_POLICY: scene-first-no-infographic-v1\nPRECISION_GRAPHICS_OWNER: REMOTION\n\nDIE ERFOLGREICHE ALTE FINANZNEO-PROMPTLOGIK IST PFLICHT:\nMAIN IDEA -> SCENE -> FULL STYLE LOCK -> BACKGROUND/ENVIRONMENT -> ALLOWED TEXT -> PERSON RULE -> NEGATIVE -> QA.\n\nJedes Flow-Bild ist ein bewusst gestalteter CLEARLY STYLIZED PREMIUM 3D CGI FINANZ-EXPLAINER. Nicht standardmäßig Mensch-am-Tisch, Papierstapel, sterile Produktaufnahme oder generische dunkle Finance-Szene. Erfinde für jeden Sprechbeat eine konkrete visuelle Mechanik: Objekt wird gezogen, gestapelt, geöffnet, gestempelt, geteilt, gewogen, vergrößert, enthüllt, transformiert oder durch eine klare Figur-Aktion erklärt.\n\nFORM FREE — WORLD FIXED: Erlaubt sind grounded-scene, character-story, object-story, physical-metaphor, editorial-3d-illustration, environmental-scene, comparison-scene, transformation-scene und hybrid-scene-plate. Das sind Kompositionsformen derselben Bildwelt.\n\n3D DNA: chunky substantial volumetric forms, simplified slightly exaggerated proportions, smooth rounded geometry, soft bevels, visible thickness, premium materials, cinematic key light, controlled rim light, strong soft contact shadows, clear foreground/midground/background separation, purposeful overlap, mild DOF, polished editorial CGI. Never photorealistic, stock-photo, generic corporate 3D, Pixar, clay or toy.\n\nFARBEN SIND NICHT AUF GRÜN/ORANGE/CREAM/GOLD BESCHRÄNKT. Deep charcoal/green-black bleibt ein wiederkehrender Anker. Emerald kann positiv, red-orange Risiko/Kosten, gold Geld/Wert und cream neutrale Flächen markieren. Zusätzlich sind alle scene-appropriate colors erlaubt: blue, cyan, yellow, orange, red, violet, natural skin tones, clothing colors, environmental colors etc. Nicht jedes Objekt künstlich in Markenfarben umfärben.\n\nMENSCHEN/FIGUREN SIND ERLAUBT, wenn sie die Aussage besser machen: stylized adult CGI, klare Körpersprache, sichtbares Gesicht mit Augen/Nase/Mund wenn im Bild, keine reale identifizierbare Person. Ganze Figur, Teilfigur, Hände oder Silhouette sind erlaubt, wenn sinnvoll.\n\nTEXT: kurze deutsche Objektlabels, Preise, Prozentwerte oder kurze Fragen sind erlaubt, wenn sie in die 3D-Szene integriert sind. Keine langen Sätze/Absätze/CTA. Kein zufälliges FinanzNeo-Logo. Datenintensive Charts, Tabellen, lange Checklisten und exakte UI-Zustände bleiben Remotion/SVG/React.\n\nHARD FAIL: flache Infografik; Social-Media-Card; Poster/Slide; Dashboard/HUD; Settings-Panel; Progress-Bar als Hauptmotiv; schwebende Cards/Tiles; generic finance icon collage; realistisches Büro-/Papier-Stillleben; sterile Produktaufnahme; Mini-Diorama; Hauptmotiv zu klein; überwiegend leerer schwarzer Raum; Stock-Vector; photorealistisch; toy/clay/Pixar; generische Gold-Luxus-Finanzoptik; Prompt paraphrasiert nur Sprechertext statt eine konkrete Bildidee zu erfinden.\n`;

const oldImagePrompt = 'Show [THE EXACT CONTENT-SPECIFIC VISUAL]. If this is a chart or diagram, show it straight-on from the front with undistorted axes/labels/proportions. Include only these short German object labels if needed: [LABELS].';
const legacyImagePrompt = `MAIN IDEA\n[ONE CLEAR SPOKEN IDEA THIS IMAGE MUST EXPLAIN]\n\nSCENE\nCreate a CLEARLY STYLIZED premium 3D CGI editorial composition. Invent the exact content-specific visual mechanism: specify the hero object/figure, supporting props, physical action, scale contrast, depth order and what the viewer sees first. Do not merely restate the narration. Use any fitting objects, figures, environments, materials and colors.\n\nFULL STYLE LOCK\nClearly stylized premium 3D CGI; chunky substantial volumetric forms; simplified slightly exaggerated proportions where useful; smooth rounded geometry; soft bevels; visible thickness; premium scene-appropriate materials; cinematic soft key light; controlled rim light; strong soft contact shadows; foreground/midground/background separation; purposeful overlap; mild depth-of-field; polished high-end editorial CGI. NOT photorealistic. NOT stock photo. NOT generic corporate 3D. NOT Pixar/clay/toy.\n\nBACKGROUND / ENVIRONMENT\nDefault to a premium deep charcoal / green-black FinanzNeo atmosphere, but use a real or stylized environment when it improves the idea. Do not force every scene into an empty black studio.\n\nALLOWED TEXT\n[SHORT GERMAN OBJECT LABELS / PRICES / SHORT QUESTIONS, OR NONE]. No long sentence, paragraph or CTA. No accidental FinanzNeo logo.\n\nPERSON RULE\n[PERSON NOT REQUIRED / OR DESCRIBE THE STYLIZED ADULT CHARACTER AND ACTION]. If a face is visible: eyes, nose and mouth; no real identifiable person.\n\nNEGATIVE\nNo dashboard, no floating tile grid, no flat infographic, no realistic boring office still-life, no tiny diorama, no sterile product pedestal, no generic finance icon collage.\n\nQA\nPASS only if the single idea is understandable in roughly two seconds, the scene unmistakably looks like premium stylized 3D CGI, and the composition has visible action/relationship, depth, overlap or scale contrast.`;

const allPrompts = readFileSync(allPromptsPath, 'utf8');
const legacyMaster = allPrompts
  .replace(
    'VISUAL_FORM: [character-story | object-story | comparison | chart | diagram | editorial | illustration | metaphor | hybrid]',
    'VISUAL_FORM: [grounded-scene | character-story | object-story | physical-metaphor | editorial-3d-illustration | environmental-scene | comparison-scene | transformation-scene | hybrid-scene-plate]',
  )
  .replaceAll(oldImagePrompt, legacyImagePrompt);
writeFileSync(allPromptsPath, `${visualSystemRules}\n\n${legacyMaster}`);

// Internal prompt sources live together under 04-visuals/01-BILDPROMPTS/.
// The user-facing complete master prompt deliberately stays at 04-visuals/alle-bildprompts.txt.
if (existsSync(imageWorldOldPath)) {
  const existing = readFileSync(imageWorldOldPath, 'utf8').replaceAll(oldImagePrompt, legacyImagePrompt);
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
    const existing = readFileSync(oldPromptPath, 'utf8').replaceAll(oldImagePrompt, legacyImagePrompt);
    writeFileSync(oldPromptPath, `${visualSystemRules}\n\n${existing}`);
    renameSync(oldPromptPath, newPromptPath);
  }
}

const indexPath = resolve(projectRoot, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld.referencePromptFile = '04-visuals/01-BILDPROMPTS/bildwelt.txt';
index.imageWorld.primaryApprovedStyleAnchor = 'finanzneo-premium-physical-editorial-v8';
index.imageWorld.legacyPromptDna = 'finanzneo-stylized-3d-editorial-v5';
index.imageWorld.flowVisualModes = [
  'grounded-scene',
  'character-story',
  'object-story',
  'physical-metaphor',
  'editorial-3d-illustration',
  'environmental-scene',
  'comparison-scene',
  'transformation-scene',
  'hybrid-scene-plate',
];
index.imageWorld.sceneSpecificColorsAllowed = true;
index.imageWorld.peopleAllowedWhenUseful = true;
index.imageWorld.precisionGraphicsOwner = 'remotion';
index.imageWorld.flowInfographicLayoutsForbidden = true;
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
  `${readme.trim()}\n\n## Google Flow — genau eine Datei kopieren\n\nKopiere **genau diese Datei vollständig und 1:1** in den Google-Flow-Agenten:\n\n\`04-visuals/alle-bildprompts.txt\`\n\nDiese Datei ist immer der vollständige ausführbare Master-Prompt. Sie darf niemals durch einen Hinweis, Redirect oder Platzhalter ersetzt werden. Jeder Bildjob nutzt die alte erfolgreiche FinanzNeo-Struktur MAIN IDEA → SCENE → FULL STYLE LOCK → BACKGROUND/ENVIRONMENT → ALLOWED TEXT → PERSON RULE → NEGATIVE → QA. Farben, Objekte, Figuren und Umgebungen dürfen frei passend zum Inhalt gewählt werden; die konstante Bildwelt entsteht durch Stylized-3D-Formensprache, Materialqualität, Licht, Tiefe und Editorial-Komposition. Präzise Daten-/UI-Grafiken bleiben Remotion-owned. Interne Stil-/Thumbnail-/Einzelpromptquellen liegen unter \`04-visuals/01-BILDPROMPTS/\`.\n`,
);

console.log('✓ Google Flow: vollständiger Nutzer-Master-Prompt = 04-visuals/alle-bildprompts.txt');
console.log('✓ Prompt-DNA: MAIN IDEA → SCENE → FULL STYLE LOCK → BACKGROUND → TEXT → PERSON → NEGATIVE → QA.');
console.log('✓ Kreative Freiheit: scene-specific Farben, Objekte, Figuren und Umgebungen erlaubt.');
console.log('✓ Bildwelt: premium stylized 3D CGI; Präzisionsgrafiken gehören Remotion.');
