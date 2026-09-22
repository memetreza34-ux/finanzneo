#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  COVER_ANCHOR_BLOCK_SIZE,
  COVER_ANCHOR_FLOW_ID,
  COVER_ANCHOR_OUTPUT_DIR,
  assignCoverAnchorSlots,
  coverAnchorPlanningMarkerText,
} from './lib/cover-anchor-flow-v1.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-cover-anchor-flow-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
if (imageScenes.length === 0 || imageScenes[0]?.id !== 'scene-01') {
  console.error('Cover-Anchor V1 verlangt scene-01 als erste IMAGE-Szene.');
  process.exit(1);
}
const anchorScene = imageScenes[0];
if (typeof anchorScene.googleFlowFileName !== 'string' || !anchorScene.googleFlowFileName.trim()) {
  console.error('scene-01.googleFlowFileName fehlt.');
  process.exit(1);
}

const assignments = new Map(assignCoverAnchorSlots(imageScenes).map((item) => [item.sceneId, item]));
index.coverAnchorFlow = {
  id: COVER_ANCHOR_FLOW_ID,
  sourceSceneId: 'scene-01',
  sourceFileName: anchorScene.googleFlowFileName,
  blockSize: COVER_ANCHOR_BLOCK_SIZE,
  firstSceneIsCoverAndMasterAnchor: true,
  anchorMustPassVisionQaBeforeFollowups: true,
  followupsMustUseApprovedAnchorImageReference: true,
  planningOccursInFiveImageBlocks: true,
  generationRemainsStrictSingleJob: true,
  renameImmediatelyAfterEachImage: true,
  unifiedOutputDirectory: COVER_ANCHOR_OUTPUT_DIR,
  onlyScene01MayBePersistentGenerationReference: true,
};

for (const scene of imageScenes) {
  const assignment = assignments.get(scene.id);
  const meta = scene.imageStorytelling ?? {};
  Object.assign(meta, {
    coverAnchorRole: assignment.role,
    coverAnchorReferenceFile: anchorScene.googleFlowFileName,
    coverAnchorBlock: assignment.block,
    coverAnchorBlockSlot: assignment.slot,
  });
  if (assignment.role === 'MASTER') {
    Object.assign(meta, {
      coverAnchorVisualDna: '[EINFÜGEN — präzise Gesamt-DNA der gewünschten Bildwelt: Formensprache, Stil, Abstraktionsgrad, Stimmung]',
      coverAnchorCharacterLanguage: '[EINFÜGEN — Gesichter, Körperproportionen, Kleidung, Ausdruck, Wiedererkennbarkeit]',
      coverAnchorEnvironmentLanguage: '[EINFÜGEN — wie reale Räume/Umgebungen vereinfacht und in die FinanzNeo-Welt integriert werden]',
      coverAnchorMaterialLanguage: '[EINFÜGEN — matte/glänzende Materialien, Kanten, Oberflächen, Objektwirkung]',
      coverAnchorLightingLanguage: '[EINFÜGEN — Key/Fill/Rim, Kontrast, Schatten, Lichtstimmung]',
      coverAnchorColorLanguage: '[EINFÜGEN — neutrale Basis plus Emerald/Rot-Orange/Gold Rollen innerhalb V9]',
      coverAnchorTextureLanguage: '[EINFÜGEN — Texturgrad, Körnung/Glätte, Detaildichte, keine generische KI-Plastikoptik]',
      coverAnchorQualityBar: '[EINFÜGEN — was an diesem Cover sichtbar hochwertig und serienprägend sein muss]',
    });
  } else {
    for (const key of [
      'coverAnchorVisualDna', 'coverAnchorCharacterLanguage', 'coverAnchorEnvironmentLanguage',
      'coverAnchorMaterialLanguage', 'coverAnchorLightingLanguage', 'coverAnchorColorLanguage',
      'coverAnchorTextureLanguage', 'coverAnchorQualityBar',
    ]) delete meta[key];
  }
  scene.imageStorytelling = meta;
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

const anchorMarkers = new Set([
  'COVER_ANCHOR_ROLE', 'COVER_ANCHOR_REFERENCE_FILE', 'COVER_ANCHOR_BLOCK', 'COVER_ANCHOR_BLOCK_SLOT',
  'COVER_ANCHOR_VISUAL_DNA', 'COVER_ANCHOR_CHARACTER_LANGUAGE', 'COVER_ANCHOR_ENVIRONMENT_LANGUAGE',
  'COVER_ANCHOR_MATERIAL_LANGUAGE', 'COVER_ANCHOR_LIGHTING_LANGUAGE', 'COVER_ANCHOR_COLOR_LANGUAGE',
  'COVER_ANCHOR_TEXTURE_LANGUAGE', 'COVER_ANCHOR_QUALITY_BAR',
]);
const stripAnchorMarkers = (source) => source.split(/\r?\n/)
  .filter((line) => ![...anchorMarkers].some((marker) => line.startsWith(`${marker}:`)))
  .join('\n');
const addMarkersBeforePrompt = (source, meta) => {
  const cleaned = stripAnchorMarkers(source);
  const marker = 'IMAGE PROMPT:';
  const idx = cleaned.indexOf(marker);
  if (idx === -1) return cleaned;
  return `${cleaned.slice(0, idx)}${coverAnchorPlanningMarkerText(meta)}\n\n${cleaned.slice(idx)}`;
};

for (const scene of imageScenes) {
  if (typeof scene.planFile !== 'string') continue;
  const planPath = resolve(root, '03-szenen', scene.planFile.replace(/^03-szenen\//, ''));
  if (!existsSync(planPath)) continue;
  writeFileSync(planPath, addMarkersBeforePrompt(readFileSync(planPath, 'utf8'), scene.imageStorytelling), 'utf8');
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (existsSync(masterPath)) {
  let master = stripAnchorMarkers(readFileSync(masterPath, 'utf8'));
  for (const scene of imageScenes) {
    const fileName = scene.googleFlowFileName;
    const fileIndex = master.indexOf(fileName);
    if (fileIndex === -1) continue;
    const promptIndex = master.indexOf('IMAGE PROMPT:', fileIndex);
    if (promptIndex === -1) continue;
    const markers = coverAnchorPlanningMarkerText(scene.imageStorytelling);
    master = `${master.slice(0, promptIndex)}${markers}\n\n${master.slice(promptIndex)}`;
  }
  const header = `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}\nCOVER_ANCHOR_SOURCE: scene-01 / ${anchorScene.googleFlowFileName}\nCOVER_ANCHOR_BLOCK_SIZE: ${COVER_ANCHOR_BLOCK_SIZE}\nCOVER_ANCHOR_OUTPUT_DIR: ${COVER_ANCHOR_OUTPUT_DIR}\n\n`;
  if (!master.includes(`COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`)) master = `${header}${master}`;
  writeFileSync(masterPath, master, 'utf8');
}

const coverAliasPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (existsSync(coverAliasPath)) {
  let coverAlias = readFileSync(coverAliasPath, 'utf8');
  if (!coverAlias.includes(`COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`)) {
    coverAlias += `\n\nCOVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}\nDieses scene-01-Bild ist nach bestandener Pixel-/Vision-QA die verbindliche visuelle Referenz für alle späteren Google-Flow-Bilder. Kein separater Cover-Job.\n`;
    writeFileSync(coverAliasPath, coverAlias, 'utf8');
  }
}

const planDir = resolve(root, '05-projektdateien');
mkdirSync(planDir, {recursive: true});
const rows = imageScenes.map((scene) => {
  const a = assignments.get(scene.id);
  return `| ${scene.id} | ${a.role} | ${a.block} | ${a.slot} | ${scene.googleFlowFileName} |`;
});
writeFileSync(resolve(planDir, 'COVER-ANCHOR-PLAN.md'), `# Cover Anchor Flow V1\n\n- Contract: \`${COVER_ANCHOR_FLOW_ID}\`\n- scene-01 ist gleichzeitig erste Szene, Cover und Master-Referenz.\n- scene-01 wird zuerst extrem detailliert geplant, erzeugt, exakt umbenannt und per echter Pixel-/Vision-QA freigegeben.\n- Erst nach PASS darf die Referenz für Folge-Bilder verwendet werden.\n- Folge-Bilder werden in Planblöcken zu maximal ${COVER_ANCHOR_BLOCK_SIZE} Bildern organisiert, aber weiterhin strikt einzeln generiert.\n- Jedes Folge-Bild nutzt ausschließlich das freigegebene scene-01-Bild als persistente Generierungsreferenz.\n- Das Referenzbild steuert Art Direction und Serienidentität, NICHT Inhalt/Kamera/Komposition der Folge-Szene.\n- Jede fertige Datei wird sofort umbenannt und in \`${COVER_ANCHOR_OUTPUT_DIR}/\` gelegt.\n\n| Szene | Rolle | 5er-Block | Slot | Datei |\n|---|---|---:|---:|---|\n${rows.join('\n')}\n`, 'utf8');

console.log(`✓ Cover Anchor Flow gesetzt: ${COVER_ANCHOR_FLOW_ID}`);
console.log(`✓ scene-01 = Cover + Master-Referenz: ${anchorScene.googleFlowFileName}`);
console.log(`✓ Folge-Bilder: Planblöcke à ${COVER_ANCHOR_BLOCK_SIZE}, Generierung weiterhin strikt einzeln.`);
console.log(`✓ Alle finalen Bilder gemeinsam in ${COVER_ANCHOR_OUTPUT_DIR}/.`);
