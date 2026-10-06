#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  YOUTUBE_APPROVED_STYLE_REFERENCES,
  YOUTUBE_FLOW_IMAGE_POLICY_ID,
  YOUTUBE_FLOW_MEANING_FIRST_MARKER,
  YOUTUBE_FLOW_NATURAL_LOOK_MARKER,
  YOUTUBE_FLOW_PROMPT_CLOSING,
  YOUTUBE_FLOW_PROMPT_MAX_WORDS,
  YOUTUBE_FLOW_PROMPT_OPENING,
  YOUTUBE_FLOW_VISUAL_MODES,
  YOUTUBE_IMAGE_WORLD_FILE,
  YOUTUBE_IMAGE_WORLD_LOCK,
} from './lib/youtube-contract.mjs';

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

const visualSystemRules = `FINANZNEO GOOGLE FLOW MASTER — VERBINDLICH

DIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG. NICHT nur erklären oder Prompts zurückgeben: die geforderten Bildjobs tatsächlich starten.

STYLE_AUTHORITY: ${YOUTUBE_IMAGE_WORLD_LOCK}
SOURCE_VISUAL_LANGUAGE: finanzneo-stylized-3d-animated-black-v9
APPROVED_STYLE_REFERENCES: ${YOUTUBE_APPROVED_STYLE_REFERENCES}
FLOW_IMAGE_POLICY: ${YOUTUBE_FLOW_IMAGE_POLICY_ID}
PRECISION_GRAPHICS_OWNER: REMOTION

${YOUTUBE_FLOW_MEANING_FIRST_MARKER}.
Vor jedem Bild zuerst den gesprochenen Gedanken verstehen. Danach die visuell stärkste Form wählen. Es gibt KEIN scene-first, KEIN people-first, KEIN object-first und KEINE Orts-Pflicht.

GLEICHBERECHTIGTE FORMEN:
- isolated object / object detail
- hands in action
- character moment
- everyday scene
- comparison
- semantic object composition
- visual metaphor
- creative idea
- hybrid scene plate

SEMANTISCHE ANORDNUNG:
Objekte dürfen frei im Raum stehen oder schweben, wenn ihre Position etwas erklärt: Ursache/Wirkung, vorher/nachher, Vergleich, Wahl, Wiederholung, Hierarchie. Keine dekorativen Spiralen, S-Kurven, Trails oder Objektwolken ohne Bedeutung. Kein Tisch, Raum oder Mensch nur als Lückenfüller.

LOOK — IMMER:
- stylized 3D animated-feature-film rendering, never photorealistic
- soft natural light, gentle rim, believable materials, deep seamless black
- Emerald = positiv/Lösung, Red-Orange = Kosten/Warnung, Gold nur kleiner Wertakzent, Ivory/Soft Gray neutral

${YOUTUBE_FLOW_NATURAL_LOOK_MARKER}:
Ruhig, klar, absichtlich gestaltet. Kein KI-Poster. Keine Glas-/Leuchtbalken, Value Blocks, Neon, Rauch, Funken, Lens Flares, Geldberge oder generische Finanzcollage. Keine Deko ohne Erklärwert.

MENSCHEN / ORT / MOMENT:
Alles optional. Person nur wenn Gesicht/Körpersprache Bedeutung trägt. Ort nur wenn der Ort Bedeutung trägt. Entscheidender Moment nur wenn die Handlung wichtig ist.

PRÄZISION:
Exakte Charts, Achsen, Tabellen, Checklisten, UI und mathematisch präzise Daten gehören zu Remotion. Flow darf eine konzeptuelle Bildidee liefern, aber keine Präzision vortäuschen.

TEXT:
Kurze deutsche Objektlabels nur wenn nötig. Keine eingebrannten Untertitel, keine langen Sätze, kein Logo.

EINHEITLICHER STILRAHMEN — INHALTLICH FLEXIBEL:
FORM: ${YOUTUBE_FLOW_PROMPT_OPENING} <BEST VISUAL IDEA FOR THIS SPOKEN BEAT: object, detail, action, scene, comparison, semantic object composition or visual metaphor>. <OPTIONAL LOCATION ONLY IF IT ADDS MEANING>. Only text: "<max two short German labels>" (or: No text.). ${YOUTUBE_FLOW_PROMPT_CLOSING}
Die optionale Ortszeile darf komplett entfallen. Höchstens ${YOUTUBE_FLOW_PROMPT_MAX_WORDS} Wörter. Keine Stilwörter wie premium, cinematic, epic, dramatic, hyper-detailed.

MEANING QA:
PASS nur wenn die Aussage in ca. zwei Sekunden klar ist, jedes Element einen Grund hat und die Komposition erklärt statt dekoriert.

HARD FAIL — DENSELBEN JOB NEU GENERIEREN:
unklare Aussage; dekorative Objektanordnung; Person/Tisch/Raum ohne Grund; schwebende Objekte ohne semantische Beziehung; fotorealistisch; alte grün-goldene Symbolwelt; KI-Slop; generiertes Dashboard/UI/Chart; erfundener Text; Hauptinformation zu klein; Wiederholung der letzten Bildform ohne Grund.
`;

const oldImagePrompt = 'Show [THE EXACT CONTENT-SPECIFIC VISUAL]. If this is a chart or diagram, show it straight-on from the front with undistorted axes/labels/proportions. Include only these short German object labels if needed: [LABELS].';
const imagePromptTemplate = `IMAGE PROMPT
${YOUTUBE_FLOW_PROMPT_OPENING} [BEST VISUAL IDEA FOR THIS SPOKEN BEAT — OBJECT, DETAIL, ACTION, SCENE, COMPARISON, SEMANTIC OBJECT COMPOSITION OR VISUAL METAPHOR]. [OPTIONAL LOCATION ONLY IF IT ADDS MEANING — OMIT OTHERWISE]. Only text: "[MAX TWO SHORT GERMAN LABELS — OR WRITE: No text.]". ${YOUTUBE_FLOW_PROMPT_CLOSING}

QA
PASS only if the visual meaning is clear in about two seconds, every element has a reason, and no person, place, surface or decorative object was added just to fill the frame.`;

const allPrompts = readFileSync(allPromptsPath, 'utf8');
const master = allPrompts.replaceAll(oldImagePrompt, imagePromptTemplate);
writeFileSync(allPromptsPath, `${visualSystemRules}\n\n${master}`);

if (existsSync(imageWorldOldPath)) {
  const existing = readFileSync(imageWorldOldPath, 'utf8').replaceAll(oldImagePrompt, imagePromptTemplate);
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
    const existing = readFileSync(oldPromptPath, 'utf8').replaceAll(oldImagePrompt, imagePromptTemplate);
    writeFileSync(oldPromptPath, `${visualSystemRules}\n\n${existing}`);
    renameSync(oldPromptPath, newPromptPath);
  }
}

const indexPath = resolve(projectRoot, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld.referencePromptFile = '04-visuals/01-BILDPROMPTS/bildwelt.txt';
index.imageWorld.imageWorldFile = YOUTUBE_IMAGE_WORLD_FILE;
index.imageWorld.primaryApprovedStyleAnchor = 'finanzneo-stylized-3d-animated-black-v9';
index.imageWorld.approvedStyleReferences = YOUTUBE_APPROVED_STYLE_REFERENCES;
delete index.imageWorld.legacyPromptDna;
index.imageWorld.flowVisualModes = [...YOUTUBE_FLOW_VISUAL_MODES];
index.imageWorld.visualDecisionPolicy = YOUTUBE_FLOW_IMAGE_POLICY_ID;
index.imageWorld.meaningFirstRequired = true;
index.imageWorld.sceneFirst = false;
index.imageWorld.placeRequired = false;
index.imageWorld.realSceneRequired = false;
index.imageWorld.peopleRequired = false;
index.imageWorld.semanticObjectCompositionsAllowed = true;
index.imageWorld.visualMetaphorsAllowed = true;
index.imageWorld.decisiveMomentRequired = false;
index.imageWorld.sceneSpecificColorsAllowed = true;
index.imageWorld.peopleAllowedWhenUseful = true;
index.imageWorld.precisionGraphicsOwner = 'remotion';
index.imageWorld.flowInfographicLayoutsForbidden = true;
index.thumbnail.planFile = '04-visuals/01-BILDPROMPTS/thumbnail-prompt.txt';
index.thumbnail.timelineEligible = false;
for (const visual of index.visuals ?? []) {
  const newImagePrompt = `04-visuals/01-BILDPROMPTS/${visual.id}/bildprompt.txt`;
  if (visual.type === 'image') {
    visual.planFile = newImagePrompt;
    visual.renderComponent = 'YouTubeFramedImage';
    visual.objectFit = 'contain';
    visual.fullScreen = false;
    visual.thumbnailEligible = false;
  }
  if (visual.type === 'hybrid') visual.imagePlanFile = newImagePrompt;
  if (['animation', 'data', 'hybrid'].includes(visual.type)) {
    visual.renderComponent = 'YouTubeSectionFrame';
    visual.fullScreen = false;
  }
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const layoutPath = resolve(projectRoot, '06-projektdateien/layout.json');
const layout = {
  version: 2,
  standardId: 'finanzneo-youtube-framed-v1',
  canvas: {width: 1920, height: 1080, fps: 30, background: '#000000'},
  visualFrame: {fullScreenForbidden: true, outerX: 120, top: 66, bottom: 78, headerHeight: 112, gap: 26, borderRadius: 30},
  sectionHeader: {required: true, iconRequired: true, maxLines: 1, style: 'calm-icon-plus-title'},
  captions: {burnedIn: false, wordTimingsUsage: ['cuts', 'srt-export', 'timestamp-script-export']},
  imagePolicy: {
    meaningFirst: true,
    sceneFirst: false,
    peopleRequired: false,
    placeRequired: false,
    realSceneRequired: false,
    contentFreeWithinWorld: true,
    forcePeopleForbidden: true,
    sameWorldNotSameScene: true,
    semanticObjectCompositionsAllowed: true,
    visualMetaphorsAllowed: true,
    isolatedObjectsAllowed: true,
    floatingObjectsAllowedWhenMeaningful: true,
    decorativeFloatingObjectsForbidden: true,
  },
  visuals: (index.visuals ?? []).map((visual) => ({id: visual.id, title: '[HEADER]', icon: '[ICON]'})),
};
writeFileSync(layoutPath, `${JSON.stringify(layout, null, 2)}\n`);

const renderContractPath = resolve(projectRoot, '06-projektdateien/render-contract.json');
const headerById = new Map((layout.visuals ?? []).map((visual) => [visual.id, visual]));
const renderContract = {
  version: 1,
  standardId: 'finanzneo-youtube-framed-v1',
  fullScreenVisualsForbidden: true,
  thumbnail: {
    sourceFile: index.thumbnail.googleFlowFileName,
    timelineEligible: false,
  },
  visuals: (index.visuals ?? []).map((visual) => {
    const header = headerById.get(visual.id) ?? {title: '[HEADER]', icon: '[ICON]'};
    if (visual.type === 'image') {
      return {
        id: visual.id,
        title: header.title,
        icon: header.icon,
        fullScreen: false,
        component: 'YouTubeFramedImage',
        sourceFile: visual.googleFlowFileName,
        objectFit: 'contain',
      };
    }
    return {
      id: visual.id,
      title: header.title,
      icon: header.icon,
      fullScreen: false,
      component: 'YouTubeSectionFrame',
      sourceFile: visual.animationSourceFile ?? null,
    };
  }),
};
writeFileSync(renderContractPath, `${JSON.stringify(renderContract, null, 2)}\n`);

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — genau eine Datei kopieren\n\nKopiere **genau diese Datei vollständig und 1:1** in den Google-Flow-Agenten:\n\n\`04-visuals/alle-bildprompts.txt\`\n\nDiese Datei ist der vollständige ausführbare Master-Prompt. Bildlogik: **Bedeutung zuerst, Form frei**. Eine Person, ein Ort oder eine reale Szene sind niemals Pflicht. Ein Bild darf aus einem einzelnen Objekt, Detail, einer Handlung, einer echten Szene, einem Vergleich, einer semantischen Objektanordnung oder einer sofort verständlichen visuellen Metapher bestehen. Fest bleibt nur die FinanzNeo-Bildwelt; präzise Daten/UI bleiben Remotion-owned.\n`,
);

console.log('✓ Google Flow: vollständiger Nutzer-Master-Prompt = 04-visuals/alle-bildprompts.txt');
console.log(`✓ Bildlogik: ${YOUTUBE_FLOW_IMAGE_POLICY_ID} — Bedeutung zuerst, Form frei, Ort/Mensch optional.`);
console.log('✓ Layout: layout.json + render-contract.json erzwingen Frame, Header+Icon, Caption-Off und Thumbnail-Trennung.');
console.log(`✓ Bildwelt: ${YOUTUBE_IMAGE_WORLD_LOCK} — Animationsfilm-Look auf Schwarz; Präzisionsgrafiken gehören Remotion.`);
