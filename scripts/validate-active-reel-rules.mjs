#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';

const ACTIVE_RULE_FILES = [
  'README.md',
  'ANLEITUNG.md',
  'AGENTS.md',
  'CLAUDE.md',
  'MASTER-PROMPTS.md',
  'START-HIER.md',
  'reels/PRODUKTIONSSTANDARD.md',
  'docs/IMAGE-SYSTEM.md',
  'docs/IMAGE-VISION-QA-V1.md',
  'docs/IMAGE-CREATIVE-CONCEPT-V1.md',
  'docs/COVER-ANCHOR-FLOW-V1.md',
  'docs/GLOBAL-IMAGE-WORLD-LOCK.md',
  'docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md',
  'docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md',
  'docs/COMPONENT-CATALOG.md',
  'docs/PHASE-1-BRIEFING.md',
  'docs/PHASE-1-ANIMATION-CODE-STANDARD.md',
  'docs/3-PHASEN-WORKFLOW.md',
  'docs/PHASE-3-COMPLETION-GATE.md',
  'docs/PLATFORM-PUBLISHING.md',
  'docs/SCENE-INDEX-SCHEMA.md',
  'docs/FUTURE-IMAGE-STORYTELLING-V3.md',
  'docs/FUTURE-IMAGE-STORYTELLING-V5.md',
  '.agents/rules/finanzneo-reel-safety.md',
  '.agents/skills/finanzneo-reel/SKILL.md',
  '.agents/workflows/build-finanzneo-reel.md',
  'config/finanzneo-production-standard.json',
  'src/brand/tokens.ts',
  'src/brand/components/ReelStage.tsx',
  'src/brand/components/SceneHeader.tsx',
  'scripts/scaffold-finanzneo-reel.mjs',
  'scripts/create-finanzneo-reel.mjs',
  'scripts/apply-reel-layout-v5.mjs',
  'scripts/validate-reel-layout-v5.mjs',
  'scripts/apply-stylized-animated-black-world-v9.mjs',
  'scripts/validate-global-image-world.mjs',
  'scripts/apply-cover-anchor-flow-v1.mjs',
  'scripts/validate-cover-anchor-flow-v1.mjs',
  'scripts/lib/cover-anchor-flow-v1.mjs',
  'scripts/lib/flow-autonomy.mjs',
  'scripts/validate-flow-autonomous-contract.mjs',
  // V3/V4 bleiben Legacy-kompatibel; neue Produktionen nutzen V5 + Hardening + Creative Concept V1.
  'scripts/apply-future-image-storytelling-v3.mjs',
  'scripts/validate-future-image-storytelling-v3.mjs',
  'scripts/apply-future-image-storytelling-v4.mjs',
  'scripts/validate-future-image-storytelling-v4.mjs',
  'scripts/apply-future-image-storytelling-v5.mjs',
  'scripts/apply-future-image-storytelling-v5-hardening.mjs',
  'scripts/apply-image-creative-concept-v1.mjs',
  'scripts/compile-future-image-prompts-v5.mjs',
  'scripts/validate-future-image-storytelling-v5.mjs',
  'scripts/validate-future-image-storytelling-v5-hardening.mjs',
  'scripts/validate-image-creative-concept-v1.mjs',
  'scripts/lib/image-storytelling-v5-hardening.mjs',
  'scripts/lib/image-creative-concept-v1.mjs',
  'scripts/lib/image-vision-qa.mjs',
  'scripts/prepare-image-vision-qa.mjs',
  'scripts/validate-image-vision-qa.mjs',
  'scripts/check-reel-production-ready.mjs',
  'scripts/validate-animation-source-quality.mjs',
];

const errors = [];
const fail = (message) => errors.push(message);
const read = (path) => readFileSync(path, 'utf8');

for (const path of ACTIVE_RULE_FILES) {
  if (!existsSync(path)) {
    fail(`Aktive Regelquelle fehlt: ${path}`);
    continue;
  }
  const source = read(path);

  for (const [pattern, label] of [
    [/finanzneo-physical-explainer-editorial-v7/g, 'alten Physical-Explainer-V7-Lock'],
    [/finanzneo-premium-physical-editorial-v8/g, 'alten Premium-Physical-V8-Lock'],
    [/finanzneo-physical-explainer-v4/g, 'alten Physical-Explainer-V4-Lock'],
    [/\b(?:2|3)[–-](?:4|5|6)\s+(?:supporting|unterstützende)/gi, 'feste Support-Objekt-Anzahl'],
    [/supportingObjectsMin\s*:/g, 'supportingObjectsMin'],
    [/supportingObjectsMax\s*:/g, 'supportingObjectsMax'],
    [/mindestens\s+zwei[^\n.]{0,80}PhysicalObject/gi, 'alte Zwei-PhysicalObject-Pflicht'],
    [/visualBottom\s*:\s*1480/g, 'alten Visual-Bottom 1480'],
    [/Visual(?:zone)?\s*(?:Y\s*=\s*)?320[–-]1480/gi, 'alte Visualzone Y320–1480'],
    [/deep charcoal green-black background/gi, 'alten green-black Background als aktive Regel'],
    [/few particles|wenige Partikel/gi, 'Partikel als aktive Reel-Dekoration'],
  ]) {
    const matches = [...source.matchAll(pattern)];
    for (const match of matches) {
      const start = Math.max(0, match.index - 100);
      const end = Math.min(source.length, match.index + match[0].length + 120);
      const context = source.slice(start, end);
      if (/\b(?:kein|keine|keinen|keiner|nicht|verboten|ungültig|alt|alte|alten|historisch|legacy|entfernt|gibt es keinen|no active)\b/i.test(context)) continue;
      fail(`${path}: enthält ${label}: "${match[0]}".`);
    }
  }
}

const requiredMarkers = new Map([
  ['README.md', ['3-PHASEN-WORKFLOW.md', 'Produktionsregistry']],
  ['ANLEITUNG.md', ['finanzneo-stylized-3d-animated-black-v9', '#000000', 'phase3Executor']],
  ['CLAUDE.md', [
    'finanzneo-stylized-3d-animated-black-v9',
    'finanzneo-image-storytelling-v5-hardening-v1',
    'V5_COMPILED_DIRECTION',
    'reel:image-prompts:compile',
    'finanzneo-cover-anchor-flow-v1',
    'FOLLOWUP_PLAN_BLOCK_SIZE: 5',
    'einzige persistente visuelle Generierungsreferenz',
    '#000000',
    'Visualzone           Y = 320–1400',
    'Header Text          56 px',
    'Keine feste Support-Objekt-Anzahl',
    'caption-universal.txt',
    'Playwright Visual QA',
  ]],
  ['docs/IMAGE-SYSTEM.md', ['finanzneo-stylized-3d-animated-black-v9', 'finanzneo-image-storytelling-v5-hardening-v1', 'V5_COMPILED_DIRECTION', '1,8–3,0 s', 'keine feste', 'tiefschwarzen Hintergrund']],
  ['docs/IMAGE-VISION-QA-V1.md', ['finanzneo-image-vision-qa-v1', 'SHA-256', 'multimodalen Evaluator', 'Prompt-', 'REGENERATE', 'Phase-3-Gate']],
  ['docs/IMAGE-CREATIVE-CONCEPT-V1.md', ['finanzneo-image-creative-concept-v1', 'Die stärkste passende Bildidee gewinnt', 'single-iconic-object', 'kontrollierte Fantasie', 'entertainmentValue', 'memorability']],
  ['docs/COVER-ANCHOR-FLOW-V1.md', ['finanzneo-cover-anchor-flow-v1', 'scene-01', '5', 'Strict Single Job', 'persistente']],
  ['docs/PHASE-1-ANIMATION-CODE-STANDARD.md', ['PremiumPhysicalStage', '#000000', 'Y 320–1400', 'keine feste Support-Objekt-Anzahl']],
  ['docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md', ['56 px', 'Y = 320–1400', 'SourceNote']],
  ['docs/PHASE-3-COMPLETION-GATE.md', ['Post-Render', 'Caption-/Header-only', 'FINAL_COMPLETE']],
  ['docs/PLATFORM-PUBLISHING.md', ['caption-universal.txt', 'keine separaten Plattform-Captiondateien']],
  ['reels/PRODUKTIONSSTANDARD.md', ['caption-universal.txt', 'Playwright Visual QA', 'Keine separaten Plattform-Captiondateien', 'finanzneo-image-vision-qa-v1', 'reel:image-vision:prepare', 'reel:image-vision:validate', 'SHA-256']],
  ['MASTER-PROMPTS.md', ['#000000', 'FNBgParticles', 'customAnimations']],
  ['config/finanzneo-production-standard.json', ['finanzneo-image-creative-concept-v1', 'apply-image-creative-concept-v1.mjs', 'validate-image-creative-concept-v1.mjs', 'finanzneo-cover-anchor-flow-v1', 'coverAnchorBlockSize', 'followupPlanBlockSize']],
  ['src/brand/tokens.ts', ['fontSize:56', 'minFontSize:50', 'maxLines:2', 'top:320,bottom:1400', 'sourceNote']],
  ['src/brand/components/ReelStage.tsx', ['clipPath', 'Y320–1400', 'visual-only']],
  ['src/brand/components/SceneHeader.tsx', ['WebkitLineClamp', 'H.maxLines', "whiteSpace: 'normal'"]],
  ['scripts/scaffold-finanzneo-reel.mjs', ['visualBottom: 1400', 'fontSize:56', 'visualSafeZone:{top:320,bottom:1400']],
  ['scripts/apply-reel-layout-v5.mjs', ['visualBottom: 1400', 'fontSize: 56', 'hardClipAnimations: true']],
  ['scripts/validate-reel-layout-v5.mjs', ['visualBottom === 1400', 'fontSize === 56', 'hardClipAnimations === true']],
  ['scripts/create-finanzneo-reel.mjs', ['apply-stylized-animated-black-world-v9.mjs', 'apply-future-image-storytelling-v5.mjs', 'apply-future-image-storytelling-v5-hardening.mjs', 'apply-image-creative-concept-v1.mjs', 'apply-cover-anchor-flow-v1.mjs', 'reel:image-prompts:compile', 'Creative Concept V1', 'Visual Y320–1400']],
  ['scripts/apply-cover-anchor-flow-v1.mjs', ['COVER_ANCHOR_FLOW_ID', 'COVER_ANCHOR_BLOCK_SIZE', 'followupsMustUseApprovedAnchorImageReference', 'onlyScene01MayBePersistentGenerationReference', 'COVER-ANCHOR-PLAN.md']],
  ['scripts/validate-cover-anchor-flow-v1.mjs', ['COVER_ANCHOR_FLOW_ID', 'followupsMustUseApprovedAnchorImageReference', 'onlyScene01MayBePersistentGenerationReference', 'Generierung bleibt strikt einzeln']],
  ['scripts/lib/cover-anchor-flow-v1.mjs', ['finanzneo-cover-anchor-flow-v1', 'COVER_ANCHOR_BLOCK_SIZE = 5', 'ANCHOR-REFERENCED FOLLOWUP', 'Only the approved scene-01 anchor may be used as the persistent generation reference']],
  ['scripts/lib/flow-autonomy.mjs', ['POST_GENERATION_VISION_QA', 'finanzneo-image-vision-qa-v1', 'COVER_ANCHOR_FLOW', 'FOLLOWUP_PLAN_BLOCK_SIZE', 'SHA-256-Hash', 'reel:image-vision:prepare', 'reel:image-vision:validate', 'approvedCoverImageReferenceRequiredForFollowups', 'onlyCoverMayBePersistentGenerationReference', 'promptOnlyQaForbidden']],
  ['scripts/validate-flow-autonomous-contract.mjs', ['IMAGE_VISION_QA_ID', 'multimodalPixelInspectionRequired', 'visionQaBoundToImageSha256', 'nextStepLockedUntilVisionQaPass', 'approvedCoverImageReferenceRequiredForFollowups', 'onlyCoverMayBePersistentGenerationReference']],
  ['scripts/apply-future-image-storytelling-v3.mjs', ['finanzneo-image-storytelling-v3', 'Literal first, creative second', 'TRANSFERABILITY_TEST', 'Förderbänder, Schienen, Schranken, Käfige']],
  ['scripts/validate-future-image-storytelling-v3.mjs', ['finanzneo-image-storytelling-v3', 'finanzneo-image-storytelling-v2', 'finanzneo-image-storytelling-v4', 'finanzneo-image-storytelling-v5', 'TRANSFERABILITY_TEST', 'METAPHOR_JUSTIFICATION']],
  ['scripts/apply-future-image-storytelling-v4.mjs', ['finanzneo-image-storytelling-v4', 'finanzneo-stylized-3d-animated-black-v9', 'Grounded first, not literal-only', 'VISUAL_HOOK', 'NOVELTY_CHECK']],
  ['scripts/validate-future-image-storytelling-v4.mjs', ['finanzneo-image-storytelling-v4', 'finanzneo-stylized-3d-animated-black-v9', 'maxSameVisualModeInRow', 'noveltyCheck']],
  ['scripts/apply-future-image-storytelling-v5.mjs', ['finanzneo-image-storytelling-v5', 'finanzneo-visual-sequence-plan-v1', 'sequencePlanningRequiredBeforePrompts', 'maxTableDocumentScenesPerSixImages', 'cameraDirectionOverridesGenericStyleFraming']],
  ['scripts/apply-future-image-storytelling-v5-hardening.mjs', ['V5_HARDENING_ID', 'compiledDirectionInsideImagePromptRequired', 'minDistinctCameraAnglesPerSixImages', 'LABEL_BUDGET']],
  ['scripts/apply-image-creative-concept-v1.mjs', ['IMAGE_CREATIVE_CONCEPT_ID', 'singleIconicObjectAllowed: true', 'controlledFantasyAllowed: true', 'conceptTypeQuotaForbidden: true', 'ENTERTAINMENT_HOOK']],
  ['scripts/compile-future-image-prompts-v5.mjs', ['V5_HARDENING_ID', 'IMAGE_CREATIVE_CONCEPT_ID', 'compileOnePromptSource', 'compileAllPromptBlocksFromMarkers', 'lastCompiledAt']],
  ['scripts/validate-future-image-storytelling-v5.mjs', ['finanzneo-image-storytelling-v5', 'finanzneo-visual-sequence-plan-v1', 'maxSameCompositionFamilyInRow', 'maxImagesWithoutPatternInterrupt', 'tableDocumentScene']],
  ['scripts/validate-future-image-storytelling-v5-hardening.mjs', ['V5_HARDENING_ID', 'minDistinctCameraAnglesPerSixImages', 'V5_COMPILED_DIRECTION', 'TABLE_DOCUMENT_SCENE=false']],
  ['scripts/validate-image-creative-concept-v1.mjs', ['IMAGE_CREATIVE_CONCEPT_ID', 'CONCEPT_MODES', 'fantasyLevel', 'CREATIVE_CONCEPT_START']],
  ['scripts/lib/image-storytelling-v5-hardening.mjs', ['finanzneo-image-storytelling-v5-hardening-v1', 'V5_COMPILED_DIRECTION_START', 'CREATIVE_CONCEPT_MARKERS', 'buildCompiledDirection']],
  ['scripts/lib/image-creative-concept-v1.mjs', ['finanzneo-image-creative-concept-v1', 'single-iconic-object', 'controlled-fantasy', 'VIEWER_THOUGHT', 'ENTERTAINMENT_HOOK']],
  ['scripts/lib/image-vision-qa.mjs', ['finanzneo-image-vision-qa-v1', 'coverHookStrength', 'sequenceNovelty', 'entertainmentValue', 'memorability', 'CREATIVE_CONCEPT_HARD_FAIL_FLAGS', 'sha256Hex']],
  ['scripts/prepare-image-vision-qa.mjs', ['IMAGE_VISION_QA_REQUESTS_DIR', 'IMAGE_CREATIVE_CONCEPT_ID', 'imageSha256', 'entertainmentValue', 'memorability', 'actual image pixels']],
  ['scripts/validate-image-vision-qa.mjs', ['imageSha256', 'comparedImageSha256', 'REGENERATE_SAME_SCENE', 'creativeConceptRequired', 'evaluateVisionQaResult', 'aktuellen Pixeln']],
  ['scripts/check-reel-production-ready.mjs', ['validate-image-vision-qa.mjs', 'Pixel-Vision-QA', 'SHA-256']],
  ['docs/FUTURE-IMAGE-STORYTELLING-V3.md', ['Literal first, creative second', 'Transferability-Test', 'METAPHOR_JUSTIFICATION']],
  ['docs/FUTURE-IMAGE-STORYTELLING-V5.md', ['Erst die gesamte visuelle Sequenz planen', 'finanzneo-image-storytelling-v5-hardening-v1', 'V5_COMPILED_DIRECTION', 'LABEL_BUDGET', 'ENERGY_LEVEL', 'VISUAL_ARCHETYPE']],
  ['.agents/skills/finanzneo-reel/SKILL.md', ['finanzneo-image-storytelling-v5-hardening-v1', 'reel:image-prompts:compile', 'finanzneo-cover-anchor-flow-v1', 'FOLLOWUP_PLAN_BLOCK_SIZE: 5', 'only persistent visual generation reference', 'A-B-A-B-A-B']],
]);

for (const [path, markers] of requiredMarkers) {
  if (!existsSync(path)) continue;
  const source = read(path);
  for (const marker of markers) {
    if (!source.includes(marker)) fail(`${path}: aktueller Pflichtmarker fehlt: ${marker}`);
  }
}

if (errors.length) {
  console.error('\nAktive Reel-Regeln widersprechen dem V9/Pure-Black/Final-Layout-/Image-Storytelling-Stand:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Aktive Reel-Regelquellen sind auf V9/Pure-Black/Final-Layout/Image-Storytelling-V5 ausgerichtet.');
console.log('✓ Legacy Storytelling V3/V4 bleibt prüfbar; neue Reels nutzen V5 + Hardening + Creative Concept V1.');
console.log('✓ Creative Concept V1 erlaubt Einzelobjekt, reale Szene, Metapher, Thought Visualization und kontrollierte Fantasie ohne starre Bildtyp-Quote.');
console.log('✓ Cover Anchor V1 ist als aktive Regel geschützt: scene-01 zuerst, QA-PASS, danach einzige persistente Referenz; Folge-Bilder bleiben Strict Single Job in 5er-Planblöcken.');
console.log('✓ V5-Hardening, Prompt-Compiler und der kompilierte Director-Brief sind als aktive Produktionsregeln geschützt.');
console.log('✓ Neue Reels verlangen nach Flow eine hashgebundene multimodale Pixel-Vision-QA vor dem nächsten Bild und vor Phase 3.');
console.log('✓ V9 bleibt unverändert: Deep Black, stylized 3D, Farbrollen, Materialgefühl, 1:1 und Single-Job bleiben gesperrt.');
console.log('✓ Header 56 px/max. 2 Zeilen, Visual Y320–1400 und Animation-Safe-Zone sind konsistent.');
console.log('✓ Phase 1, Phase 2 und Phase 3 verweisen auf denselben aktuellen Produktionsstand.');