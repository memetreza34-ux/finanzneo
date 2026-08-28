#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK} from './lib/flow-autonomy.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-stylized-animated-black-world-v9.mjs <Reel-Pfad>');
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

const STYLE_SUFFIX = `STYLE:\nCreate a premium real-world-grounded stylized 3D explanatory scene. Everyday objects must keep believable proportions, recognizable construction and useful material detail, while the final rendering remains clearly stylized and never photorealistic. The result should feel polished and high quality, not like a toy, icon pack or stock photograph.\n\nBACKGROUND:\nA seamless deep black background is mandatory. A small believable local environment such as part of a laundry area, kitchen, desk, counter or banking context may appear when it helps explain the situation, but it must visually dissolve into the deep-black world. Keep the background clean and non-distracting.\n\nCOMPOSITION:\nThe image must visually explain the spoken point, not merely symbolize it. Build one coherent real-life situation with the necessary context and make cause and effect readable in the same frame whenever possible. Use familiar everyday objects that directly match the content. Supporting objects have no fixed count: include what is needed for immediate understanding and remove decorative clutter. The viewer should understand the intended meaning within 1–2 seconds without audio or interpretation. Abstract finance symbols such as shields, arrows, coins or vaults may only support the real situation; they must never replace it.\n\nBRANDS + LOGOS:\nIf a brand, bank, app or logo is relevant, keep it recognizable but reinterpret it in the same stylized 3D world. Use matching materials and lighting. Never paste a flat real-world logo, website screenshot, app screenshot or photorealistic branded UI into the scene.\n\nCOLORS + LIGHT:\nUse emerald green for positive elements, warm ivory and soft gray for neutral surfaces, subtle gold for money/value and warm red-orange only for warnings or cost. Use clean soft studio lighting, clear highlights, readable shadows, believable material cues and soft contact shadows.\n\nTEXT:\nOnly explicitly requested short German labels may appear. Use short German labels when they remove ambiguity and attach them clearly to the exact object or state they describe. No headline, subtitle, CTA or long explanatory sentence.\n\nFORBIDDEN:\nNo photorealism or stock-photo look, no generic finance-icon composition as the main explanation, no isolated vault + shield + coins + arrow scene without real-life context, no abstract visual riddle, no flat pasted real-world logo, no screenshot-like branded UI, no dashboard or app UI as the main composition, no flowchart as the main composition, no tiny floating info cards, no microchip/circuit look, no tiny unreadable miniature scene and no decorative clutter.`;

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');

const extractLabels = (content) => {
  const match = content.match(/(?:EXACT SHORT GERMAN OBJECT LABELS|BESCHRIFTUNGEN – EXAKT SO):\s*\n([\s\S]*?)(?=\n\s*\n(?:IMAGE PROMPT:|BILDPROMPT:|STYLE:|FINANZNEO_WORLD_ID:|WRITTEN SAME-WORLD LOCK:|BACKGROUND))/i);
  return match ? `EXACT SHORT GERMAN OBJECT LABELS:\n${match[1].trim()}` : '';
};

const extractScenePrompt = (content) => {
  const marker = content.includes('IMAGE PROMPT:') ? 'IMAGE PROMPT:' : 'BILDPROMPT:';
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) return '';
  const after = content.slice(markerIndex + marker.length).trim();
  const stopMarkers = [
    '\n\nFINANZNEO_WORLD_ID:',
    '\n\nPREMIUM_VISUAL_WORLD_LOCK:',
    '\n\nPHYSICAL_EXPLAINER_LOCK:',
    '\n\nSTYLIZED_3D_LOCK:',
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
  const worldPositions = [
    content.indexOf('FINANZNEO_WORLD_ID:'),
    content.indexOf('PREMIUM_VISUAL_WORLD_LOCK:'),
    content.indexOf('PHYSICAL_EXPLAINER_LOCK:'),
    content.indexOf('STYLIZED_3D_LOCK:'),
  ].filter((p) => p >= 0).sort((a, b) => a - b);
  const firstWorldMarker = worldPositions[0];
  const promptMarker = content.includes('IMAGE PROMPT:') ? 'IMAGE PROMPT:' : 'BILDPROMPT:';
  const promptPosition = content.indexOf(promptMarker);
  const prefixEnd = firstWorldMarker === undefined
    ? (promptPosition >= 0 ? promptPosition : content.length)
    : firstWorldMarker;
  const prefix = content.slice(0, prefixEnd).replace(/(?:IMAGE PROMPT:|BILDPROMPT:)\s*$/i, '').trim();
  const labels = extractLabels(content);
  const scenePrompt = extractScenePrompt(content) || 'Describe one complete real-life financial situation with visible cause and effect so the spoken point is understandable without interpretation.';
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
  squareGeneratedImagesRequired: true,
  referencePromptFile: '03-szenen/bildwelt.txt',
  styleReferenceStrategy: 'written-style-lock-only',
  referenceImageUse: 'forbidden',
  sameWorldAcrossSeriesRequired: true,
  seamlessSingleBackgroundRequired: true,
  percentageZonesForbidden: true,
  floorWallBoundaryForbidden: true,
  horizonLineForbidden: true,
  backgroundBandsForbidden: true,
  objectLabelsOnly: true,
  visibleFaceRequiredWhenPersonPresent: true,
  style: 'stylized-3d-animated-black-v9',
  nonPhotorealisticRequired: true,
  stylized3DAnimatedRequired: true,
  softRoundedGeometryRequired: true,
  simplifiedDetailsRequired: true,
  premiumPlayfulBalanceRequired: true,
  realWorldGroundedSituationRequired: true,
  believableObjectProportionsRequired: true,
  recognizableEverydayDetailsRequired: true,
  completeExplanatorySceneRequired: true,
  causeEffectReadableRequired: true,
  understandableWithoutAudioRequired: true,
  germanObjectLabelsWhenHelpfulRequired: true,
  individuallyWrittenPromptRequired: true,
  genericPromptShorthandForbidden: true,
  clearMainSubjectOrActionRequired: true,
  contentFirstCompositionRequired: true,
  supportingObjectCountFlexible: true,
  supportingObjectsOnlyWhenHelpful: true,
  clarityBeforeObjectCount: true,
  deepBlackBackgroundRequired: true,
  cleanMinimalBackgroundRequired: true,
  subjectSeparationLightingRequired: true,
  softContactShadowsRequired: true,
  brandMarksRecognizableButStylizedRequired: true,
  abstractSymbolOnlyCompositionForbidden: true,
  genericFinanceIconCompositionForbidden: true,
  visualMetaphorInterpretationRequiredForbidden: true,
  flatPastedRealLogoForbidden: true,
  screenshotLikeBrandUiForbidden: true,
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
for (const obsolete of [
  'heroUsefulFrameMinRatio',
  'heroUsefulFrameMaxRatio',
  'supportingObjectsMin',
  'supportingObjectsMax',
  'mediumCloseThreeQuarterCameraRequired',
  'foregroundHeroBackgroundDepthRequired',
  'purposefulOverlapRequired',
  'ambientOcclusionRequired',
  'threeMaterialRolesRequired',
  'nonMonochromeSemanticAccentRequired',
  'flatPosterCompositionForbidden',
  'monochromeGreenFrameForbidden',
]) delete index.imageWorld[obsolete];
write(indexPath, JSON.stringify(index, null, 2));

const worldPath = resolve(root, '03-szenen/bildwelt.txt');
write(worldPath, `FINANZNEO STYLIZED 3D ANIMATED BLACK WORLD — V9\n\n${WORLD_HEADER}\n\n${STYLE_SUFFIX}\n\nPROMPT POLICY:\nEvery image prompt must be individually and completely written for the exact spoken point. Start with the concrete real-life situation and visible cause/effect, add exact short German labels when they improve understanding, then give style/background/composition/forbidden rules. Do not use shorthand, generic keyword lists or a fixed supporting-object quota.`);

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
const allPrompts = `${AUTONOMY_BLOCK}\nFINANZNEO — GOOGLE FLOW MASTERDATEI\n\n${FLOW_AGENT_BLOCK}\n\nPREMIUM_VISUAL_WORLD_LOCK: ${WORLD_LOCK}\nBILDWELT: realitätsnahe Alltagssituation als vollständige Erklärszene · klar stylized 3D statt fotorealistisch · deep black · Ursache/Wirkung direkt sichtbar · kurze deutsche Labels wenn hilfreich · keine Symbolrätsel · jeder Prompt individuell vollständig geschrieben.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${cover}\n\n${sections.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBeende erst, wenn jedes erwartete Bild EINZELN erzeugt, exakt umbenannt und nach V9-QA geprüft wurde. Verwerfe Bilder, die nur hübsche Finanzsymbole zeigen, aber den gesprochenen Inhalt nicht direkt erklären.\n`;
write(resolve(root, '03-szenen/alle-bildprompts.txt'), allPrompts);

console.log(`✓ Stylized Animated Black World angewendet: ${WORLD_LOCK}`);
console.log('  Realitätsnaher Inhalt · klar stylized 3D · niemals fotorealistisch · deep black Pflicht.');
console.log('  Vollständige Erklärszene + sichtbare Ursache/Wirkung · deutsche Objektlabels wenn sie Klarheit schaffen.');
console.log('  Symbolrätsel/isolierte Finance-Icons als Haupterklärung sind verboten.');
console.log('  Jeder konkrete Phase-1-Bildprompt muss individuell und vollständig geschrieben sein.');
console.log('  Google Flow Reihenfolge/Single-Job/Dateinamenlogik bleibt unverändert.');
