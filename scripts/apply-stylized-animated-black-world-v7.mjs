#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK} from './lib/flow-autonomy.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-stylized-animated-black-world-v7.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const BASE_WORLD = 'finanzneo-connected-studio-v3';
const SERIES_LOCK = 'finanzneo-same-world-v1';

const WORLD_HEADER = `FINANZNEO_WORLD_ID: ${BASE_WORLD}\nFINANZNEO_SERIES_LOCK: ${SERIES_LOCK}\nPREMIUM_VISUAL_WORLD_LOCK: ${WORLD_LOCK}\nGENERATED_IMAGE_ASPECT_RATIO: 1:1`;

const STYLE_SUFFIX = `STYLE:\nCreate a clearly non-realistic stylized 3D animated finance scene. Use soft rounded geometry, simplified recognizable details, clean materials and a premium but slightly playful animated-movie feel. Keep the main idea easy to understand within 1–2 seconds.\n\nBACKGROUND:\nA seamless deep black background is mandatory. Keep it clean, minimal and uninterrupted.\n\nCOMPOSITION:\nContent and clarity come first. Use a clear main subject or main action. Supporting objects have no fixed count; add only what genuinely helps the explanation. Avoid clutter.\n\nCOLORS + LIGHT:\nUse emerald green for positive elements, warm ivory and soft gray for neutral surfaces, subtle gold for money/value and warm red-orange only for warnings or cost. Use soft studio lighting, clear highlights, readable shadows and soft contact shadows.\n\nTEXT:\nOnly the explicitly requested short German labels may appear. No headline, subtitle, CTA or long explanatory text.\n\nFORBIDDEN:\nNo realism or photorealism, no product-photo look, no dashboard, no app UI, no flowchart, no tiny boxes, no floating info cards, no microchip/circuit look, no miniature diorama and no clutter.`;

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');

const extractLabels = (content) => {
  const match = content.match(/EXACT SHORT GERMAN OBJECT LABELS:\s*\n([\s\S]*?)(?=\n\s*\n(?:IMAGE PROMPT:|STYLE:|WRITTEN SAME-WORLD LOCK:|BACKGROUND))/i);
  return match ? `EXACT SHORT GERMAN OBJECT LABELS:\n${match[1].trim()}` : '';
};

const extractScenePrompt = (content) => {
  const marker = 'IMAGE PROMPT:';
  const index = content.indexOf(marker);
  if (index === -1) return '';
  const after = content.slice(index + marker.length).trim();
  const stopMarkers = [
    '\n\nWRITTEN SAME-WORLD LOCK:',
    '\n\nSTYLE:',
    '\n\nKeep the same written',
    '\n\nUse ONE single',
    '\n\nBACKGROUND RULE:',
    '\n\nBACKGROUND:',
    '\n\nTEXT RULE:',
    '\n\nFORBIDDEN:',
  ];
  const positions = stopMarkers.map((m) => after.indexOf(m)).filter((p) => p >= 0);
  const end = positions.length ? Math.min(...positions) : after.length;
  return after.slice(0, end).trim();
};

const rewritePrompt = (content) => {
  const firstWorldMarker = [
    content.indexOf('FINANZNEO_WORLD_ID:'),
    content.indexOf('PREMIUM_VISUAL_WORLD_LOCK:'),
    content.indexOf('PHYSICAL_EXPLAINER_LOCK:'),
  ].filter((p) => p >= 0).sort((a, b) => a - b)[0];
  const prefix = (firstWorldMarker === undefined ? content.split('IMAGE PROMPT:')[0] : content.slice(0, firstWorldMarker)).trim();
  const labels = extractLabels(content);
  const scenePrompt = extractScenePrompt(content) || 'Describe the scene-specific financial idea clearly with a simple stylized 3D animated composition.';
  return [prefix, WORLD_HEADER, labels, `IMAGE PROMPT:\n${scenePrompt}`, STYLE_SUFFIX].filter(Boolean).join('\n\n');
};

const index = JSON.parse(read(indexPath));
index.imageWorld = {
  ...(index.imageWorld ?? {}),
  id: BASE_WORLD,
  seriesLockId: SERIES_LOCK,
  physicalExplainerLockId: WORLD_LOCK,
  premiumVisualWorldLockId: WORLD_LOCK,
  animatedWorldLockId: WORLD_LOCK,
  generatedImageAspectRatio: '1:1',
  style: 'stylized-3d-animated-black-v9',
  nonPhotorealisticRequired: true,
  stylized3DAnimatedRequired: true,
  softRoundedGeometryRequired: true,
  simplifiedDetailsRequired: true,
  premiumPlayfulBalanceRequired: true,
  clearMainSubjectOrActionRequired: true,
  contentFirstCompositionRequired: true,
  supportingObjectCountFlexible: true,
  supportingObjectsOnlyWhenHelpful: true,
  clarityBeforeObjectCount: true,
  deepBlackBackgroundRequired: true,
  cleanMinimalBackgroundRequired: true,
  subjectSeparationLightingRequired: true,
  softContactShadowsRequired: true,
  dashboardCompositionForbidden: true,
  appUiCompositionForbidden: true,
  flowchartMainCompositionForbidden: true,
  smallBoxesThinLinesForbidden: true,
  floatingUiTilesForbidden: true,
  microchipVisualLanguageForbidden: true,
  miniatureDioramaForbidden: true,
  photorealismForbidden: true,
  productPhotoLookForbidden: true,
  clutterForbidden: true,
};
delete index.imageWorld.heroUsefulFrameMinRatio;
delete index.imageWorld.heroUsefulFrameMaxRatio;
delete index.imageWorld.supportingObjectsMin;
delete index.imageWorld.supportingObjectsMax;
delete index.imageWorld.mediumCloseThreeQuarterCameraRequired;
delete index.imageWorld.foregroundHeroBackgroundDepthRequired;
delete index.imageWorld.purposefulOverlapRequired;
delete index.imageWorld.ambientOcclusionRequired;
delete index.imageWorld.threeMaterialRolesRequired;
delete index.imageWorld.nonMonochromeSemanticAccentRequired;
delete index.imageWorld.flatPosterCompositionForbidden;
delete index.imageWorld.monochromeGreenFrameForbidden;
write(indexPath, JSON.stringify(index, null, 2));

const worldPath = resolve(root, '03-szenen/bildwelt.txt');
write(worldPath, `FINANZNEO STYLIZED 3D ANIMATED BLACK WORLD — V9\n\n${WORLD_HEADER}\n\n${STYLE_SUFFIX}\n\nPROMPT POLICY:\nKeep individual image prompts medium length. Scene idea first, style second. Do not add a fixed supporting-object quota.`);

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (existsSync(coverPath)) write(coverPath, rewritePrompt(read(coverPath)));

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
for (const scene of scenes) {
  if (scene?.type !== 'image') continue;
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const promptPath = resolve(root, '03-szenen', plan);
  if (!existsSync(promptPath)) {
    console.error(`Bildprompt fehlt: ${promptPath}`);
    process.exit(1);
  }
  write(promptPath, rewritePrompt(read(promptPath)));
}

const sections = [];
for (const scene of scenes) {
  const number = String(scene.id ?? '').match(/(\d+)$/)?.[1] ?? '??';
  if (scene.type === 'animation') {
    sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`);
    continue;
  }
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${read(resolve(root, '03-szenen', plan)).trim()}\n`);
}

const cover = existsSync(coverPath) ? read(coverPath).trim() : '';
const allPrompts = `${AUTONOMY_BLOCK}\nFINANZNEO — GOOGLE FLOW MASTERDATEI\n\n${FLOW_AGENT_BLOCK}\n\nPREMIUM_VISUAL_WORLD_LOCK: ${WORLD_LOCK}\nBILDWELT: nicht realistische stylized 3D animation · deep black background · clarity first · keine feste Objektanzahl · mittel-lange Prompts.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${cover}\n\n${sections.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBeende erst, wenn jedes erwartete Bild EINZELN erzeugt, exakt umbenannt und nach V9-QA geprüft wurde.\n`;
write(resolve(root, '03-szenen/alle-bildprompts.txt'), allPrompts);

console.log(`✓ Stylized Animated Black World angewendet: ${WORLD_LOCK}`);
console.log('  Nicht realistisch · soft rounded 3D · deep black Pflicht · Klarheit vor Objektzahl · mittel-lange Prompts.');
console.log('  Dashboard/UI/Flowchart/Produktfoto-Look/Clutter verboten.');
