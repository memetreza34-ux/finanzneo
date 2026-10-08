#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-finanzneo-image-world-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const IMAGE_WORLD = 'finanzneo-editorial-finance-v1';
const SERIES = 'finanzneo-editorial-consistency-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');

if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld = {
  id: IMAGE_WORLD,
  seriesLockId: SERIES,
  authority: 'docs/FINANZNEO-IMAGE-WORLD.md',
  generatedImageAspectRatio: '1:1',
  promptLanguage: 'en',
  primaryStyle: 'clean-editorial-finance-illustration',
  flexibleBackgrounds: true,
  fixedBlackBackgroundForbidden: true,
  fixed3DRenderingForbidden: true,
  twoDAllowed: true,
  subtleTwoPointFiveDAllowed: true,
  selectiveSimple3DAllowed: true,
  firstGlanceUnderstandingRequired: true,
  oneCoreIdeaPerImageRequired: true,
  progressiveSequencesAllowed: true,
  approvedPriorImageReferenceAllowed: true,
  continuationReferenceRequiredWhenDeclared: true,
  genericHeadlineByDefault: false,
  aiSlopAvoidanceRequired: true
};

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const worldPath = resolve(root, '03-szenen/bildwelt.txt');
writeFileSync(worldPath, `FINANZNEO_IMAGE_WORLD: ${IMAGE_WORLD}
FINANZNEO_IMAGE_SERIES: ${SERIES}
GENERATED_IMAGE_ASPECT_RATIO: 1:1

CORE
One spoken thought -> one simple visual idea -> understandable at first glance.

STYLE
Clean editorial finance illustration. Prefer 2D or subtle 2.5D. Simple 3D is allowed only when it genuinely helps. Use matte, restrained colors, clear shapes, large readable elements and low-to-moderate detail.

BACKGROUND
Flexible. Warm off-white, cream, light gray, muted color, dark charcoal or black may all be used. Choose what makes the specific image clearest.

VISUAL FORMS
Metaphor, number + object, illustration, chart, process, timeline, comparison, document, quote + illustration, company/brand illustration or another simple form that fits better.

TEXT
No automatic headline. Numbers, short labels, dates, quotes and document text are allowed when useful.

ANTI-AI-SLOP
Avoid decorative neon finance glow, holograms, floating coin showers, futuristic dashboards, generic UI cards, miniature cities, glowing networks, podiums, cinematic finance spectacle and toy-like glossy 3D blocks unless the actual subject requires them.

PROGRESSIVE SEQUENCES
When a later scene should preserve the same composition with one addition/change, attach the exact approved prior scene image as reference. The new prompt must still repeat the full composition and specify the one intended change.
`, 'utf8');

console.log(`✓ Image world applied: ${IMAGE_WORLD}`);
console.log('✓ Flexible editorial illustration · simple first-glance visuals · references allowed for progressive sequences.');
