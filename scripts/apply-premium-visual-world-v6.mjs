#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK} from './lib/flow-autonomy.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-premium-visual-world-v6.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const PREMIUM_LOCK = 'finanzneo-premium-physical-editorial-v8';
const BASE_WORLD = 'finanzneo-connected-studio-v3';
const SERIES_LOCK = 'finanzneo-same-world-v1';
const STYLIZED_LOCK = 'finanzneo-stylized-3d-editorial-v5';

const PREMIUM_STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${BASE_WORLD}\nFINANZNEO_SERIES_LOCK: ${SERIES_LOCK}\nSTYLIZED_3D_LOCK: ${STYLIZED_LOCK}\nPREMIUM_VISUAL_WORLD_LOCK: ${PREMIUM_LOCK}\nGENERATED_IMAGE_ASPECT_RATIO: 1:1\n\nFORMAT LOCK:\nCreate a square 1:1 source image only. Width and height must be equal. Bild 00 is also 1:1; 9:16 is created only in Remotion.\n\nPREMIUM HERO LOCK:\nUse ONE dominant recognizable physical hero object occupying roughly 45–65% of the useful composition. Supporting objects have NO fixed count. Use only the objects that make the idea clearer, more useful or more visually engaging. One scene may need almost none; another may need several. Clarity decides, not a numeric quota. The idea must read in under two seconds at phone size.\n\nCAMERA + DEPTH:\nUse a medium-close 3/4 camera, not distant isometric. Put the hero close to camera with a strong silhouette and slight perspective exaggeration. Build clear foreground / hero plane / background depth with purposeful overlap, strong soft contact shadows, ambient occlusion and mild depth-of-field on secondary objects only. No tiny subject in a huge empty frame.\n\nPREMIUM MATERIALS:\nUse satin dark-emerald anodized metal or premium polymer for structure, warm ivory/cream ceramic or stone-like surfaces for neutral information objects, brushed brass/sculpted gold only for money/value, warm red-orange enamel only for fee/loss/warning, and restrained smoked glass only as a secondary material. Give objects substantial thickness, rounded industrial bevels and believable weight. Never use flat vector cards pretending to be 3D.\n\nCINEMATIC LIGHTING:\nSoft key light from upper front-left, controlled emerald rim from rear-right, warm practical highlight on money/value objects, readable shadow-side fill, localized reflections and strong contact shadows. Dark background is allowed; dark unreadable subjects are not.\n\nCOLOR BALANCE:\nThe frame should normally contain at least three readable material/color roles: dark emerald/charcoal structure, warm ivory/white neutral information, and one semantic accent (gold OR red-orange OR brighter emerald). Monochrome green-only frames are forbidden.\n\nPHYSICAL STORYTELLING:\nPrefer visible physical cause-and-effect: card entering terminal, fee tag attaching to receipt, token changing path, bank object taking over conversion, gate opening/closing, scale tipping, receipt extending, lock engaging.\n\nTEXT RULE:\nNo headline, subtitle, CTA or explanatory sentence. Only explicitly requested short German labels, normally 1–2 words, attached physically as engraved plaques, paper tags, stickers or embossed signs. The scene must still work without reading them.\n\nALLOWED DEVICE RULE:\nA real ATM, card terminal, phone or calculator is allowed only when it is the topic-specific physical hero object. Its screen may show a minimal state, but the composition must never become a dashboard/UI mockup.\n\nSTRICTLY FORBIDDEN:\nDashboard or control-panel composition. Flowchart as the main composition. Small boxes connected by thin lines. Floating UI cards, tiles, chips, pills, widgets or HUD elements. Generic rectangular info cards as main objects. Thin neon connector lines as the main storytelling device. Four-corner modules. Orbit/satellite layouts. Gameboard. Microchip/circuit-board metaphor. Tiny isometric diorama. Sterile product-ad shot with no explanatory action. Empty black studio with a small centered object. Flat poster composition. Monochrome green-only frame. Photorealistic office/stationery still life. Childish clay, toy or Pixar look.\n\nBACKGROUND:\nUse ONE seamless deep charcoal green-black environment with subtle tonal depth. No visible floor-wall boundary, horizon line, horizontal bands or separate zones.\n\nPREMIUM QA — REJECT AND REGENERATE IF ANY APPLY:\nHero too small. Reads like UI/dashboard/flowchart. Supporting objects add clutter instead of helping the message. Mostly dark empty space. Flat/weightless objects. Weak material contrast. No depth hierarchy. Monochrome green. Idea only works after reading labels.\n`;

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');

const normalizePrefix = (content) => content
  .replaceAll('PHYSICAL_EXPLAINER_LOCK: finanzneo-physical-explainer-editorial-v7', `PREMIUM_VISUAL_WORLD_LOCK: ${PREMIUM_LOCK}`)
  .replaceAll('3–6 supporting recognizable physical objects', 'supporting recognizable physical objects only when they help explain the scene')
  .replaceAll('3-6 supporting recognizable physical objects', 'supporting recognizable physical objects only when they help explain the scene')
  .replaceAll('3–6 concrete supporting objects', 'supporting concrete objects only when they help explain the scene')
  .replaceAll('3-6 concrete supporting objects', 'supporting concrete objects only when they help explain the scene')
  .replaceAll('2–4 supporting recognizable physical objects', 'supporting recognizable physical objects only when they help explain the scene')
  .replaceAll('2-4 supporting recognizable physical objects', 'supporting recognizable physical objects only when they help explain the scene')
  .replaceAll('2–4 concrete supporting objects', 'supporting concrete objects only when they help explain the scene')
  .replaceAll('2-4 concrete supporting objects', 'supporting concrete objects only when they help explain the scene');

const replaceStyleBlock = (content) => {
  const marker = 'FINANZNEO_WORLD_ID:';
  const clean = normalizePrefix(content);
  const markerIndex = clean.indexOf(marker);
  if (markerIndex === -1) return `${clean.trim()}\n\n${PREMIUM_STYLE_BLOCK}`;
  return `${clean.slice(0, markerIndex).trimEnd()}\n\n${PREMIUM_STYLE_BLOCK}`;
};

const index = JSON.parse(read(indexPath));
index.imageWorld = {
  ...(index.imageWorld ?? {}),
  id: BASE_WORLD,
  seriesLockId: SERIES_LOCK,
  stylized3DLockId: STYLIZED_LOCK,
  physicalExplainerLockId: PREMIUM_LOCK,
  premiumVisualWorldLockId: PREMIUM_LOCK,
  style: 'premium-stylized-3d-physical-editorial-v8',
  dominantHeroObjectRequired: true,
  heroUsefulFrameMinRatio: 0.45,
  heroUsefulFrameMaxRatio: 0.65,
  supportingObjectCountFlexible: true,
  supportingObjectsOnlyWhenHelpful: true,
  clarityBeforeObjectCount: true,
  mediumCloseThreeQuarterCameraRequired: true,
  foregroundHeroBackgroundDepthRequired: true,
  purposefulOverlapRequired: true,
  contactShadowsRequired: true,
  ambientOcclusionRequired: true,
  threeMaterialRolesRequired: true,
  nonMonochromeSemanticAccentRequired: true,
  dashboardCompositionForbidden: true,
  flowchartMainCompositionForbidden: true,
  smallBoxesThinLinesForbidden: true,
  genericRectangularInfoCardsAsMainObjectsForbidden: true,
  thinNeonConnectorMainMotifForbidden: true,
  flatPosterCompositionForbidden: true,
  monochromeGreenFrameForbidden: true,
};
delete index.imageWorld.supportingObjectsMin;
delete index.imageWorld.supportingObjectsMax;
write(indexPath, JSON.stringify(index, null, 2));

const worldPath = resolve(root, '03-szenen/bildwelt.txt');
write(worldPath, `FINANZNEO PREMIUM WORLD REFERENCE — WRITTEN STYLE LOCK ONLY\n\n${PREMIUM_STYLE_BLOCK}`);

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (existsSync(coverPath)) write(coverPath, replaceStyleBlock(read(coverPath)));

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
for (const scene of scenes) {
  if (scene?.type !== 'image') continue;
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const promptPath = resolve(root, '03-szenen', plan);
  if (!existsSync(promptPath)) {
    console.error(`Bildprompt fehlt: ${promptPath}`);
    process.exit(1);
  }
  write(promptPath, replaceStyleBlock(read(promptPath)));
}

const sections = [];
for (const scene of scenes) {
  const number = String(scene.id ?? '').match(/(\d+)$/)?.[1] ?? '??';
  if (scene.type === 'animation') {
    sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`);
    continue;
  }
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const promptPath = resolve(root, '03-szenen', plan);
  sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${read(promptPath).trim()}\n`);
}

const cover = existsSync(coverPath) ? read(coverPath).trim() : '';
const allPrompts = `${AUTONOMY_BLOCK}\nFINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN\n\n${FLOW_AGENT_BLOCK}\n\nPREMIUM_VISUAL_WORLD_LOCK: ${PREMIUM_LOCK}\nBILDNUMMERIERUNG:\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert. Jede Bildszene ist eine frische Komposition. Keine Bildreferenz verwenden.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${cover}\n\n${sections.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBeende erst, wenn jedes erwartete Bild EINZELN erzeugt, exakt umbenannt und nach Premium-V8-QA geprüft wurde. Alle finalen Bilder liegen gemeinsam in 03-szenen/00-ALLE-BILDER-HIER-REIN/.\n`;
write(resolve(root, '03-szenen/alle-bildprompts.txt'), allPrompts);

console.log(`✓ Premium Visual World angewendet: ${PREMIUM_LOCK}`);
console.log('  Hero 45–65% · Supporting Objects flexibel · Klarheit vor Objektanzahl · medium-close 3/4.');
console.log('  UI/Dashboard/Flowchart/kleine Boxen + dünne Linien/monochrom-grün als Hauptsprache verboten.');
