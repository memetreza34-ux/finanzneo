#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const errors = [];
const requireFile = (path) => {
  const full = resolve(path);
  if (!existsSync(full)) {
    errors.push(`Fehlt: ${path}`);
    return '';
  }
  return readFileSync(full, 'utf8');
};

const pkg = JSON.parse(requireFile('package.json') || '{}');
const visualSystem = JSON.parse(requireFile('config/finanzneo-youtube-visual-system.json') || '{}');
const motion = requireFile('src/design-system/YouTubeMotionExplainers.tsx');
const designIndex = requireFile('src/design-system/index.ts');
const lab = requireFile('src/showcases/YouTubeFinanceMotionLab.tsx');
const createMode = requireFile('scripts/create-finanzneo-youtube-mode.mjs');
const scaffold = requireFile('scripts/scaffold-finanzneo-youtube.mjs');

const requiredComponents = ['MotionNumber','MotionComparisonBars','MotionLineChart','MotionPathFlow','MotionMoneyFlow','MotionBeforeAfter','MotionBudgetAllocation','MotionCompoundGrowth','MotionLoanPaydown','MotionPurchasingPower','MotionTimeline'];
for (const name of requiredComponents) {
  if (!motion.includes(`export const ${name}`)) errors.push(`Motion-Baustein fehlt: ${name}`);
  if (!designIndex.includes(name)) errors.push(`Design-System exportiert ${name} nicht.`);
}
for (const name of requiredComponents.filter((name) => name !== 'MotionPathFlow' && name !== 'MotionLineChart')) {
  if (!lab.includes(name)) errors.push(`Motion-Lab deckt ${name} nicht ab.`);
}

for (const dependency of ['@remotion/paths','@remotion/shapes','@remotion/lottie','@remotion/motion-blur','@remotion/three','@remotion/transitions','@react-three/fiber','recharts','three']) {
  if (!pkg.dependencies?.[dependency]) errors.push(`Dependency fehlt: ${dependency}`);
}
for (const script of ['youtube:create:mode','youtube:animation:validate','youtube:motion:qa','youtube:motion:qa:validate','youtube:motion:lab:smoke','youtube:phase1:seal','youtube:ready']) {
  if (!pkg.scripts?.[script]) errors.push(`npm-Script fehlt: ${script}`);
}
for (const path of ['docs/YOUTUBE-MOTION-QUALITY-V1.md','docs/YOUTUBE-VISUAL-QA-16X9.md','docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md','scripts/render-youtube-motion-qa.mjs','scripts/validate-youtube-motion-qa.mjs','scripts/validate-youtube-animation-quality.mjs','scripts/check-youtube-production-ready.mjs','scripts/smoke-youtube-motion-lab.mjs']) requireFile(path);

if (!motion.includes("from '@remotion/paths'")) errors.push('YouTubeMotionExplainers nutzt @remotion/paths noch nicht.');
if (!motion.includes("from '@remotion/shapes'")) errors.push('YouTubeMotionExplainers nutzt @remotion/shapes noch nicht.');
if (!motion.includes('calculateSavingsPlanSeries')) errors.push('Zinseszins-Motion ist nicht an zentrale Finanzberechnung angebunden.');
if (!motion.includes('calculateLoanSchedule')) errors.push('Kredit-Motion ist nicht an zentrale Finanzberechnung angebunden.');
if (!motion.includes('calculateInflationAdjustedValue')) errors.push('Kaufkraft-Motion ist nicht an zentrale Finanzberechnung angebunden.');
if (!motion.includes('YOUTUBE_MOTION_PHYSICS')) errors.push('Bewegungsphysik-Presets fehlen.');

if (!createMode.includes('START → TRIGGER → ACTION → REACTION/CHANGE → RESULT → HOLD')) errors.push('Hybrid-Scaffolder erzwingt die sichtbare Motion-Mechanik noch nicht.');
if (!createMode.includes('staticAlternative')) errors.push('Hybrid-Scaffolder verlangt keine statische Alternative.');
if (!createMode.includes('representativeStates')) errors.push('Hybrid-Scaffolder verlangt keine Representative States.');
if (!createMode.includes("hybridMotionCanvas: 'full-1920x1080'")) errors.push('Hybrid-Layout erlaubt noch keine Full-Frame-Remotion-Fläche.');
if (!createMode.includes('motionSafeAreaPx: 64')) errors.push('Hybrid-Layout enthält noch keine 64-px-Motion-Safe-Area.');

if (!scaffold.includes('THUMBNAIL_HEADLINE — REQUIRED FINAL TEXT')) errors.push('Thumbnail-Scaffolding verlangt noch keinen direkten finalen Text.');
if (!scaffold.includes('regenerate the SAME thumbnail')) errors.push('Thumbnail-QA erzwingt keine Regeneration bei falschem Text.');
if (visualSystem?.thumbnailContract?.preferredHeadlineOwner !== 'flow-generated-final-thumbnail') errors.push('Globaler Thumbnail-Vertrag setzt den finalen Hook noch nicht direkt im generierten Thumbnail.');
if (visualSystem?.thumbnailContract?.directGeneratedHeadlineRequired !== true) errors.push('Globaler Thumbnail-Vertrag verlangt direkte Headline-Generierung noch nicht hart.');
if (visualSystem?.thumbnailContract?.flowHeadlineMustBeExactOrRegenerated !== true) errors.push('Globaler Thumbnail-Vertrag erzwingt bei falscher Schrift keine Regeneration.');
if (visualSystem?.layoutContract?.hybridMotionCanvas !== 'full-1920x1080') errors.push('Globaler Layout-Vertrag stellt Hybrid-Motion nicht auf Full-Frame.');
if (visualSystem?.layoutContract?.motionSafeAreaPx !== 64) errors.push('Globaler Layout-Vertrag hat nicht die verbindliche 64-px-Safe-Area.');

if (errors.length > 0) {
  console.error('\nYouTube-System ist noch NICHT bereit für ein neues Produktionsvideo:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ YOUTUBE-FINANCE-SYSTEM BEREIT FÜR NEUES VIDEO');
console.log(`  ${requiredComponents.length} wiederverwendbare Motion-Bausteine geprüft.`);
console.log('  Paths/Shapes · Finanzberechnungen · Bewegungsphysik · 16:9 Representative-Frame-QA geprüft.');
console.log('  Earned Motion · statische Alternative · Full-Frame-Motion · 64-px-Safe-Area · direkter Thumbnail-Text geprüft.');
console.log('  Nächster Schritt: echtes Video produzieren; System nur noch bei konkretem Video-Mangel erweitern.');
