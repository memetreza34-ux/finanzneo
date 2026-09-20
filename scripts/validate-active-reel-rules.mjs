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
  'config/finanzneo-production-standard.json',
  'docs/IMAGE-SYSTEM.md',
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
  '.agents/rules/finanzneo-reel-safety.md',
  '.agents/skills/finanzneo-reel/SKILL.md',
  '.agents/workflows/build-finanzneo-reel.md',
  '.agents/plugins/finanzneo-motion/rules/mechanic-selection.md',
  '.agents/plugins/finanzneo-motion/rules/remotion-production.md',
  '.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md',
  '.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md',
  '.agents/plugins/finanzneo-motion/skills/motion-core-curator/SKILL.md',
  'src/brand/tokens.ts',
  'src/brand/index.ts',
  'src/brand/components/ReelStage.tsx',
  'src/brand/components/SceneHeader.tsx',
  'src/design-system/index.ts',
  'src/motion/README.md',
  'src/motion/index.ts',
  'src/motion/mechanics.ts',
  'src/motion/objects.tsx',
  'scripts/scaffold-finanzneo-reel.mjs',
  'scripts/create-finanzneo-reel.mjs',
  'scripts/apply-reel-layout-v5.mjs',
  'scripts/validate-reel-layout-v5.mjs',
  'scripts/apply-stylized-animated-black-world-v9.mjs',
  'scripts/validate-global-image-world.mjs',
  'scripts/apply-future-image-storytelling-v3.mjs',
  'scripts/validate-future-image-storytelling-v3.mjs',
  'scripts/apply-premium-animation-v2.mjs',
  'scripts/apply-future-reel-phase1-motion-direction-v1.mjs',
  'scripts/validate-future-reel-phase1-motion-direction-v1.mjs',
  'scripts/validate-animation-source-quality.mjs',
  'scripts/validate-phase3-preflight.mjs',
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
    [/mindestens\s+zwei[^\n.]{0,100}(?:PhysicalObject|Realwelt-Objekt|Physical\*)/gi, 'alte Zwei-Objekt-Pflicht'],
    [/einziger\s+öffentlicher\s+Importpfad\s+für\s+neue\s+Produktion/gi, 'alten exklusiven Design-System-Importpfad'],
    [/visualBottom\s*:\s*1480/g, 'alten Visual-Bottom 1480'],
    [/Visual(?:zone)?\s*(?:Y\s*=\s*)?320[–-]1480/gi, 'alte Visualzone Y320–1480'],
    [/deep charcoal green-black background/gi, 'alten green-black Background als aktive Regel'],
    [/few particles|wenige Partikel/gi, 'Partikel als aktive Reel-Dekoration'],
  ]) {
    const matches = [...source.matchAll(pattern)];
    for (const match of matches) {
      const start = Math.max(0, match.index - 100);
      const end = Math.min(source.length, match.index + match[0].length + 140);
      const context = source.slice(start, end);
      // Negativ-/Historienhinweise dürfen alte Begriffe benennen, ohne sie aktiv zu machen.
      if (/\b(?:kein|keine|keinen|keiner|nicht|verboten|ungültig|alt|alte|alten|historisch|legacy|entfernt|gibt es keinen|no active|darf nicht|niemals)\b/i.test(context)) continue;
      fail(`${path}: enthält ${label}: "${match[0]}".`);
    }
  }
}

const requiredMarkers = new Map([
  ['README.md', ['3-PHASEN-WORKFLOW.md', 'Produktionsregistry']],
  ['ANLEITUNG.md', ['finanzneo-stylized-3d-animated-black-v9', '#000000', 'phase3Executor']],
  ['CLAUDE.md', ['finanzneo-stylized-3d-animated-black-v9', '#000000', 'Visualzone           Y = 320–1400', 'Header Text          56 px', 'Keine feste Support-Objekt-Anzahl']],
  ['docs/IMAGE-SYSTEM.md', ['finanzneo-stylized-3d-animated-black-v9', 'keine feste', 'tiefschwarzen Hintergrund']],
  ['docs/PHASE-1-ANIMATION-CODE-STANDARD.md', ['PremiumPhysicalStage', '#000000', 'Y 320–1400', 'keine feste Support-Objekt-Anzahl', 'singleHeroObjectAllowed=true', 'finanzneo-motion-core-v1', 'src/motion/mechanics.ts', 'PhysicalBanknote', 'PhysicalInvoice', 'Motion Art Direction', 'PLAYWRIGHT_VISUAL_QA=PASS', 'Anti-Wiederholung']],
  ['docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md', ['56 px', 'Y = 320–1400', 'SourceNote']],
  ['docs/PHASE-3-COMPLETION-GATE.md', ['Post-Render', 'Caption-/Header-only', 'FINAL_COMPLETE']],
  ['docs/PLATFORM-PUBLISHING.md', ['caption-universal.txt', 'keine separaten Plattform-Captiondateien']],
  ['reels/PRODUKTIONSSTANDARD.md', ['caption-universal.txt', 'Playwright Visual QA', 'Keine separaten Plattform-Captiondateien', 'MOTION_CORE: finanzneo-motion-core-v1', 'CANONICAL_MOTION_SOURCE: src/motion', 'MECHANIC_REGISTRY: src/motion/mechanics.ts', 'MOTION_ART_DIRECTOR', 'PhysicalBanknote', 'PhysicalInvoice', 'MOTION_ART_DIRECTION=PASS', 'PLAYWRIGHT_VISUAL_QA=PASS', 'Mechanik-Ledger']],
  ['config/finanzneo-production-standard.json', ['finanzneo-motion-core-v1', 'src/motion/index.ts', 'mechanic-selection.md', 'remotion-director/SKILL.md']],
  ['CLAUDE.md', ['caption-universal.txt', 'Playwright Visual QA']],
  ['MASTER-PROMPTS.md', ['#000000', 'FNBgParticles', 'customAnimations']],
  ['src/brand/tokens.ts', ['fontSize:56', 'minFontSize:50', 'maxLines:2', 'top:320,bottom:1400', 'sourceNote']],
  ['src/brand/index.ts', ['Legacy Physical API', 'Neue Motion-Core-Reels', '../motion']],
  ['src/brand/components/ReelStage.tsx', ['clipPath', 'Y320–1400', 'visual-only']],
  ['src/brand/components/SceneHeader.tsx', ['WebkitLineClamp', 'H.maxLines', "whiteSpace: 'normal'"]],
  ['src/design-system/index.ts', ['Brand, Layout', "from '../motion'"]],
  ['src/motion/README.md', ['STATE -> MECHANISM -> CHANGE -> RESULT -> HOLD', 'FinanzNeoMotionReferenceV1', 'Primitive Promotion', 'PhysicalBanknote', 'PhysicalInvoice', 'motion-art-director', 'motion-core-curator', 'Lottie']],
  ['src/motion/index.ts', ['PremiumPhysicalStage', 'PhysicalBill', 'PhysicalBanknote', 'PhysicalInvoice', 'FINANZNEO_MECHANICS', 'FN_MOTION']],
  ['src/motion/mechanics.ts', ['FINANZNEO_MECHANICS', 'fn-growth-build', 'fn-cost-extraction', 'fn-account-transfer', 'fn-time-compounding']],
  ['src/motion/objects.tsx', ['PhysicalBanknote', 'PhysicalInvoice', 'compatibility']],
  ['.agents/plugins/finanzneo-motion/rules/mechanic-selection.md', ['src/motion/mechanics.ts', 'Anti-Wiederholungs-Gate', 'fn-account-transfer', 'MECHANIC_ID', 'Ein starkes Hero darf allein reichen', 'PhysicalBanknote', 'PhysicalInvoice', 'motion-core-curator']],
  ['.agents/plugins/finanzneo-motion/rules/remotion-production.md', ['src/motion', 'MECHANIC_ID']],
  ['.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md', ['src/motion/mechanics.ts', 'mechanic-selection.md', 'MECHANIC_ID', 'WARUM NICHT DOPPELT', 'PhysicalBanknote', 'PhysicalInvoice', 'motion-art-director', 'PLAYWRIGHT_VISUAL_QA=PASS']],
  ['.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md', ['hero-object scale', 'RESULT HOLD', 'MOTION_ART_DIRECTION=PASS', 'Playwright Visual QA']],
  ['.agents/plugins/finanzneo-motion/skills/motion-core-curator/SKILL.md', ['Primitive promotion', 'src/motion/mechanics.ts', 'KEEP_LOCAL', 'PROMOTE', 'DEPRECATE_ALIAS']],
  ['scripts/scaffold-finanzneo-reel.mjs', ['visualBottom: 1400', 'fontSize:56', 'visualSafeZone:{top:320,bottom:1400']],
  ['scripts/apply-reel-layout-v5.mjs', ['visualBottom: 1400', 'fontSize: 56', 'hardClipAnimations: true']],
  ['scripts/validate-reel-layout-v5.mjs', ['visualBottom === 1400', 'fontSize === 56', 'hardClipAnimations === true']],
  ['scripts/create-finanzneo-reel.mjs', ['apply-stylized-animated-black-world-v9.mjs', 'apply-future-image-storytelling-v3.mjs', 'apply-future-reel-phase1-motion-direction-v1.mjs', 'Literal first, creative second', 'Visual Y320–1400']],
  ['scripts/apply-premium-animation-v2.mjs', ['ein starkes Hero darf allein reichen', 'PhysicalBanknote', 'PhysicalInvoice', 'niemals als Objektquote']],
  ['scripts/apply-future-reel-phase1-motion-direction-v1.mjs', ['finanzneo-motion-core-v1', "canonicalMotionSource: 'src/motion'", "mechanicRegistry: 'src/motion/mechanics.ts'", 'motionArtDirectorSkill', 'motionCoreCuratorSkill', 'visualQaGateRequiredBeforePhase3Render: true', 'motion-mechanic-ledger.md', 'visual-qa.md']],
  ['scripts/validate-future-reel-phase1-motion-direction-v1.mjs', ['finanzneo-motion-core-v1', 'mechanicRegistry', 'motionArtDirectorSkill', 'motionCoreCuratorSkill', 'visualQaGateRequiredBeforePhase3Render', 'motion-mechanic-ledger.md', 'visual-qa.md', 'src/motion importieren']],
  ['scripts/validate-animation-source-quality.mjs', ['singleHeroObjectAllowed', 'PhysicalBanknote', 'PhysicalInvoice', 'Ein starkes Hero darf allein reichen']],
  ['scripts/validate-phase3-preflight.mjs', ['MOTION_ART_DIRECTION=PASS', 'PLAYWRIGHT_VISUAL_QA=PASS', 'Motion-Core Visual-QA-Gate']],
  ['scripts/apply-future-image-storytelling-v3.mjs', ['finanzneo-image-storytelling-v3', 'Literal first, creative second', 'TRANSFERABILITY_TEST', 'Förderbänder, Schienen, Schranken, Käfige']],
  ['scripts/validate-future-image-storytelling-v3.mjs', ['finanzneo-image-storytelling-v3', 'finanzneo-image-storytelling-v2', 'TRANSFERABILITY_TEST', 'METAPHOR_JUSTIFICATION']],
  ['docs/FUTURE-IMAGE-STORYTELLING-V3.md', ['Literal first, creative second', 'Transferability-Test', 'METAPHOR_JUSTIFICATION']],
]);

for (const [path, markers] of requiredMarkers) {
  if (!existsSync(path)) continue;
  const source = read(path);
  for (const marker of markers) {
    if (!source.includes(marker)) fail(`${path}: aktueller Pflichtmarker fehlt: ${marker}`);
  }
}

if (errors.length) {
  console.error('\nAktive Reel-Regeln widersprechen dem V9/Pure-Black/Final-Layout-/Image-Storytelling-/Motion-Core-Stand:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Aktive Reel-Regelquellen sind auf V9/Pure-Black/Final-Layout/Image-Storytelling-V3/Motion-Core-V1 ausgerichtet.');
console.log('✓ Keine aktive V4/V7/V8-Bildwelt, feste Objektquote, alte Y320–1480-Visualzone oder Partikel-Dekorationsregel gefunden.');
console.log('✓ Motion Core V1 erlaubt ein starkes einzelnes Hero; PhysicalBanknote/PhysicalInvoice trennen Geldschein und Rechnung semantisch.');
console.log('✓ Mechanik-Registry, Motion Art Director und Motion Core Curator sind repo-weit abgesichert.');
console.log('✓ Neue Motion-Core-Reels brauchen vor Phase-3-Render dokumentierte Art Direction + Playwright Visual QA PASS.');
console.log('✓ Header 56 px/max. 2 Zeilen, Visual Y320–1400 und Animation-Safe-Zone sind konsistent.');
console.log('✓ Phase 1, Phase 2 und Phase 3 verweisen auf denselben aktuellen Produktionsstand.');
