#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';

const CONFIG = 'config/finanzneo-image-world.json';
const DOC = 'docs/FINANZNEO-IMAGE-WORLD.md';
const APPLY = 'scripts/apply-finanzneo-image-world-v1.mjs';
const EXPECTED = 'finanzneo-editorial-finance-v1';

const errors = [];
const fail = (m) => errors.push(m);
const read = (p) => readFileSync(p, 'utf8');

for (const path of [CONFIG, DOC, APPLY]) {
  if (!existsSync(path)) fail(`Pflichtdatei fehlt: ${path}`);
}

if (existsSync(CONFIG)) {
  try {
    const config = JSON.parse(read(CONFIG));
    if (config.id !== EXPECTED) fail(`config.id muss ${EXPECTED} sein.`);
    if (config.status !== 'active') fail('Image world muss status=active sein.');
    if (config.promptLanguage !== 'en') fail('Bildprompts müssen Englisch bleiben.');
    if (config.style?.fixedBackgroundForbidden !== true) fail('Fester Hintergrund muss verboten sein.');
    if (config.style?.fixed3DStyleForbidden !== true) fail('Fester 3D-Stil muss verboten sein.');
    if (config.simplicity?.firstGlanceUnderstanding !== true) fail('First-glance understanding muss aktiv sein.');
    if (config.progressiveSequences?.referenceImagePreferred !== true) fail('Referenzbilder für progressive Sequenzen müssen bevorzugt sein.');
    if (config.flow?.referencesAllowed !== true) fail('Flow-Referenzbilder müssen erlaubt sein.');
  } catch (error) {
    fail(`${CONFIG} ist ungültig: ${error.message}`);
  }
}

if (existsSync(DOC)) {
  const doc = read(DOC);
  for (const marker of [
    `IMAGE_WORLD: ${EXPECTED}`,
    'ONE SPOKEN THOUGHT',
    'Progressive image sequences',
    'exact approved image file as the visual reference',
    'Anti-AI-slop default',
  ]) {
    if (!doc.includes(marker)) fail(`${DOC}: Pflichtmarker fehlt: ${marker}`);
  }
}

const deprecatedFiles = [
  'config/finanzneo-image-world-lock.json',
  'config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt',
  'config/finanzneo-image-worlds/finanzneo-premium-physical-editorial-v8.txt',
  'config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt',
  'config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt',
  'docs/GLOBAL-IMAGE-WORLD-LOCK.md',
  'docs/IMAGE-PROMPT-BASELINE.md',
  'scripts/apply-stylized-animated-black-world-v9.mjs',
  'scripts/apply-premium-visual-world-v6.mjs',
  'scripts/validate-premium-visual-contract.mjs',
  'scripts/validate-global-image-world.mjs'
];
for (const path of deprecatedFiles) {
  if (existsSync(path)) fail(`Alte Bildwelt-Datei muss entfernt sein: ${path}`);
}

if (existsSync('scripts/create-finanzneo-reel.mjs')) {
  const source = read('scripts/create-finanzneo-reel.mjs');
  if (!source.includes('apply-finanzneo-image-world-v1.mjs')) fail('reel:create muss die neue Bildwelt anwenden.');
  if (/apply-stylized-animated-black-world-v9|apply-premium-visual-world-v6/.test(source)) fail('reel:create enthält noch einen alten Bildwelt-Applier.');
}

if (errors.length) {
  console.error('\nFinanzNeo Image World verletzt:\n');
  errors.forEach((e) => console.error('- ' + e));
  process.exit(1);
}

console.log(`\n✓ Image World aktiv: ${EXPECTED}`);
console.log('✓ Flexible Hintergründe · Editorial 2D/2.5D · selektives 3D · simple first-glance visuals.');
console.log('✓ Progressive Bildfolgen dürfen das freigegebene vorherige Bild als echte Referenz verwenden.');
