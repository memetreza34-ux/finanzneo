#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';

const ACTIVE_RULE_FILES = [
  'README.md','ANLEITUNG.md','AGENTS.md','CLAUDE.md','MASTER-PROMPTS.md','START-HIER.md',
  'reels/PRODUKTIONSSTANDARD.md','docs/IMAGE-SYSTEM.md','docs/GLOBAL-IMAGE-WORLD-LOCK.md',
  'docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md','docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md',
  'docs/COMPONENT-CATALOG.md','docs/PHASE-1-BRIEFING.md','docs/PHASE-1-ANIMATION-CODE-STANDARD.md',
  'docs/3-PHASEN-WORKFLOW.md','docs/PHASE-3-COMPLETION-GATE.md','docs/PLATFORM-PUBLISHING.md',
  'docs/SCENE-INDEX-SCHEMA.md','docs/FUTURE-IMAGE-STORYTELLING-V3.md','docs/VISUAL-SYSTEM-CONSOLIDATION-V1.md',
  '.agents/rules/finanzneo-reel-safety.md','.agents/skills/finanzneo-reel/SKILL.md','.agents/workflows/build-finanzneo-reel.md',
  'src/brand/tokens.ts','src/brand/components/ReelStage.tsx','src/brand/components/SceneHeader.tsx',
  'scripts/scaffold-finanzneo-reel.mjs','scripts/create-finanzneo-reel.mjs','scripts/apply-reel-layout-v5.mjs',
  'scripts/validate-reel-layout-v5.mjs','scripts/apply-stylized-animated-black-world-v9.mjs','scripts/validate-global-image-world.mjs',
  'scripts/apply-future-image-storytelling-v3.mjs','scripts/validate-future-image-storytelling-v3.mjs','scripts/validate-animation-source-quality.mjs',
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
  for (const [pattern,label] of [
    [/finanzneo-physical-explainer-editorial-v7/g,'alten Physical-Explainer-V7-Lock'],
    [/finanzneo-premium-physical-editorial-v8/g,'alten Premium-Physical-V8-Lock'],
    [/finanzneo-physical-explainer-v4/g,'alten Physical-Explainer-V4-Lock'],
    [/\b(?:2|3)[–-](?:4|5|6)\s+(?:supporting|unterstützende)/gi,'feste Support-Objekt-Anzahl'],
    [/supportingObjectsMin\s*:/g,'supportingObjectsMin'],[/supportingObjectsMax\s*:/g,'supportingObjectsMax'],
    [/mindestens\s+zwei[^\n.]{0,80}PhysicalObject/gi,'alte Zwei-PhysicalObject-Pflicht'],
    [/visualBottom\s*:\s*1480/g,'alten Visual-Bottom 1480'],[/Visual(?:zone)?\s*(?:Y\s*=\s*)?320[–-]1480/gi,'alte Visualzone Y320–1480'],
    [/deep charcoal green-black background/gi,'alten green-black Background als aktive Regel'],[/few particles|wenige Partikel/gi,'Partikel als aktive Reel-Dekoration'],
  ]) {
    const matches = [...source.matchAll(pattern)];
    for (const match of matches) {
      const start = Math.max(0,(match.index ?? 0)-100);
      const end = Math.min(source.length,(match.index ?? 0)+match[0].length+120);
      const context = source.slice(start,end);
      if (/\b(?:kein|keine|keinen|keiner|nicht|verboten|ungültig|alt|alte|alten|historisch|legacy|entfernt|gibt es keinen|no active)\b/i.test(context)) continue;
      fail(`${path}: enthält ${label}: "${match[0]}".`);
    }
  }
}

const requiredMarkers = new Map([
  ['README.md',['3-PHASEN-WORKFLOW.md','Produktionsregistry']],
  ['ANLEITUNG.md',['finanzneo-stylized-3d-animated-black-v9','#000000','phase3Executor']],
  ['CLAUDE.md',['finanzneo-stylized-3d-animated-black-v9','#000000','Visualzone           Y = 320–1400','Header Text          56 px','finanzneo-free-visual-form-v1','Form frei']],
  ['docs/IMAGE-SYSTEM.md',['finanzneo-stylized-3d-animated-black-v9','keine feste','tiefschwarzen Hintergrund']],
  ['docs/PHASE-1-ANIMATION-CODE-STANDARD.md',['Finance Motion Library','#000000','Y320–1400','transparenten visuellen Inhalt']],
  ['docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md',['56 px','Y = 320–1400','SourceNote']],
  ['docs/PHASE-3-COMPLETION-GATE.md',['Post-Render','Caption-/Header-only','FINAL_COMPLETE']],
  ['docs/PLATFORM-PUBLISHING.md',['caption-universal.txt','keine separaten Plattform-Captiondateien']],
  ['reels/PRODUKTIONSSTANDARD.md',['caption-universal.txt','Playwright Visual QA','Keine separaten Plattform-Captiondateien']],
  ['CLAUDE.md',['caption-universal.txt','Playwright Visual QA']],
  ['MASTER-PROMPTS.md',['#000000','FNBgParticles','customAnimations']],
  ['src/brand/tokens.ts',['fontSize:56','minFontSize:50','maxLines:2','top:320,bottom:1400','sourceNote']],
  ['src/brand/components/ReelStage.tsx',['clipPath','Y320–1400','visual-only']],
  ['src/brand/components/SceneHeader.tsx',['WebkitLineClamp','H.maxLines',"whiteSpace: 'normal'"]],
  ['scripts/scaffold-finanzneo-reel.mjs',['visualBottom: 1400','fontSize:56','visualSafeZone:{top:320,bottom:1400']],
  ['scripts/apply-reel-layout-v5.mjs',['visualBottom: 1400','fontSize: 56','hardClipAnimations: true']],
  ['scripts/validate-reel-layout-v5.mjs',['visualBottom === 1400','fontSize === 56','hardClipAnimations === true']],
  ['scripts/create-finanzneo-reel.mjs',['apply-stylized-animated-black-world-v9.mjs','apply-future-image-storytelling-v3.mjs','Form frei','Visual Y320–1400']],
  ['scripts/apply-future-image-storytelling-v3.mjs',['finanzneo-image-storytelling-v3','finanzneo-free-visual-form-v1','TRANSFERABILITY_TEST','DATA_INTEGRITY_TEST','POWERPOINT-/EXCEL-DEFAULT']],
  ['scripts/validate-future-image-storytelling-v3.mjs',['finanzneo-image-storytelling-v3','finanzneo-image-storytelling-v2','finanzneo-free-visual-form-v1','DATA_INTEGRITY_TEST','ALLOWED_VISUAL_FORMS']],
  ['docs/FUTURE-IMAGE-STORYTELLING-V3.md',['finanzneo-free-visual-form-v1','Form frei, Bildwelt fest.','DATA_INTEGRITY_TEST','POWERPOINT-/EXCEL-DEFAULT']],
  ['docs/VISUAL-SYSTEM-CONSOLIDATION-V1.md',['FORM FREI','BILDWELT FEST','chart','editorial-quote']],
]);

for (const [path,markers] of requiredMarkers) {
  if (!existsSync(path)) continue;
  const source = read(path);
  for (const marker of markers) if (!source.includes(marker)) fail(`${path}: aktueller Pflichtmarker fehlt: ${marker}`);
}

if (errors.length) {
  console.error('\nAktive Reel-Regeln widersprechen dem V9/Pure-Black/Final-Layout-/Free-Visual-Form-Stand:\n');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Aktive Reel-Regelquellen sind auf V9/Pure-Black/Final-Layout/Free-Visual-Form-V1 ausgerichtet.');
console.log('✓ Form frei: character-story, object-story, comparison, chart, diagram, editorial-quote, illustration, metaphor oder hybrid.');
console.log('✓ Bildwelt fest: V9/Deep Black; echte Charts brauchen Datenintegrität und dürfen nicht in PowerPoint-/Excel-Default abrutschen.');
console.log('✓ Header 56 px/max. 2 Zeilen, Visual Y320–1400 und Animation-Safe-Zone sind konsistent.');
console.log('✓ Phase 1, Phase 2 und Phase 3 verweisen auf denselben aktuellen Produktionsstand.');
