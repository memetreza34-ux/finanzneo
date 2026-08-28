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
  'docs/GLOBAL-IMAGE-WORLD-LOCK.md',
  'docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md',
  'docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md',
  'docs/COMPONENT-CATALOG.md',
  'docs/PHASE-1-BRIEFING.md',
  'docs/PHASE-1-ANIMATION-CODE-STANDARD.md',
  'docs/3-PHASEN-WORKFLOW.md',
  'docs/PHASE-3-COMPLETION-GATE.md',
  'docs/SCENE-INDEX-SCHEMA.md',
  '.agents/rules/finanzneo-reel-safety.md',
  '.agents/skills/finanzneo-reel/SKILL.md',
  '.agents/workflows/build-finanzneo-reel.md',
  'src/brand/tokens.ts',
  'src/brand/components/ReelStage.tsx',
  'src/brand/components/SceneHeader.tsx',
  'scripts/scaffold-finanzneo-reel.mjs',
  'scripts/create-finanzneo-reel.mjs',
  'scripts/apply-reel-layout-v5.mjs',
  'scripts/validate-reel-layout-v5.mjs',
  'scripts/apply-stylized-animated-black-world-v9.mjs',
  'scripts/validate-global-image-world.mjs',
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
      // Negativ-/Historienhinweise dürfen alte Begriffe benennen, ohne sie aktiv zu machen.
      if (/\b(?:kein|keine|keinen|keiner|nicht|verboten|ungültig|alt|alte|alten|historisch|legacy|entfernt|gibt es keinen|no active)\b/i.test(context)) continue;
      fail(`${path}: enthält ${label}: "${match[0]}".`);
    }
  }
}

const requiredMarkers = new Map([
  ['README.md', ['3-PHASEN-WORKFLOW.md', 'Produktionsregistry']],
  ['ANLEITUNG.md', ['finanzneo-stylized-3d-animated-black-v9', '#000000', 'phase3Executor']],
  ['CLAUDE.md', ['finanzneo-stylized-3d-animated-black-v9', '#000000', 'Visualzone           Y = 320–1400', 'Header Text          56 px', 'Keine feste Support-Objekt-Anzahl']],
  ['docs/IMAGE-SYSTEM.md', ['finanzneo-stylized-3d-animated-black-v9', 'keine feste', 'tiefschwarzen Hintergrund']],
  ['docs/PHASE-1-ANIMATION-CODE-STANDARD.md', ['PremiumPhysicalStage', '#000000', 'Y 320–1400', 'keine feste Support-Objekt-Anzahl']],
  ['docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md', ['56 px', 'Y = 320–1400', 'SourceNote']],
  ['docs/PHASE-3-COMPLETION-GATE.md', ['Post-Render', 'Caption-/Header-only', 'FINAL_COMPLETE']],
  ['MASTER-PROMPTS.md', ['#000000', 'FNBgParticles', 'customAnimations']],
  ['src/brand/tokens.ts', ['fontSize:56', 'minFontSize:50', 'maxLines:2', 'top:320,bottom:1400', 'sourceNote']],
  ['src/brand/components/ReelStage.tsx', ['clipPath', 'Y320–1400', 'visual-only']],
  ['src/brand/components/SceneHeader.tsx', ['WebkitLineClamp', 'H.maxLines', "whiteSpace: 'normal'"]],
  ['scripts/scaffold-finanzneo-reel.mjs', ['visualBottom: 1400', 'fontSize:56', 'visualSafeZone:{top:320,bottom:1400']],
  ['scripts/apply-reel-layout-v5.mjs', ['visualBottom: 1400', 'fontSize: 56', 'hardClipAnimations: true']],
  ['scripts/validate-reel-layout-v5.mjs', ['visualBottom === 1400', 'fontSize === 56', 'hardClipAnimations === true']],
  ['scripts/create-finanzneo-reel.mjs', ['apply-stylized-animated-black-world-v9.mjs', 'Visual Y320–1400']],
]);

for (const [path, markers] of requiredMarkers) {
  if (!existsSync(path)) continue;
  const source = read(path);
  for (const marker of markers) {
    if (!source.includes(marker)) fail(`${path}: aktueller Pflichtmarker fehlt: ${marker}`);
  }
}

if (errors.length) {
  console.error('\nAktive Reel-Regeln widersprechen dem V9/Pure-Black/Final-Layout-Stand:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Aktive Reel-Regelquellen sind auf V9/Pure-Black/Final-Layout ausgerichtet.');
console.log('✓ Keine aktive V4/V7/V8-Bildwelt, feste Objektquote, alte Y320–1480-Visualzone oder Partikel-Dekorationsregel gefunden.');
console.log('✓ Header 56 px/max. 2 Zeilen, Visual Y320–1400 und Animation-Safe-Zone sind konsistent.');
console.log('✓ Phase 1, Phase 2 und Phase 3 verweisen auf denselben aktuellen Produktionsstand.');
