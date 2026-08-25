#!/usr/bin/env node

import {resolve} from 'node:path';
import {validatePhase3Manifest} from './lib/phase3-completion.mjs';

const [target, manifestPath] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run reel:phase3:preflight -- <Reel-Pfad> [phase3-production-manifest.json]');
  process.exit(1);
}

try {
  const result = validatePhase3Manifest(resolve(target), manifestPath ?? null);
  const images = result.scenes.filter((scene) => scene.type === 'image').length;
  const animations = result.scenes.filter((scene) => scene.type === 'animation').length;
  console.log('\n✓ PHASE-3-PREFLIGHT BESTANDEN');
  console.log(`  ${result.scenes.length} Szenen vollständig implementiert · ${images} Bild · ${animations} Animation`);
  console.log(`  Timeline lückenlos: ${result.totalFrames} Frames`);
  console.log('  Caption-only-Szenen sind laut Manifest verboten; Render-QA folgt nach dem Render.');
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  console.error('\nReel ist NICHT renderfertig. Kein finales MP4 ausgeben.');
  process.exit(1);
}
