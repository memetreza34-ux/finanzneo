#!/usr/bin/env node

import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {
  PHASE3_MANIFEST_RELATIVE,
  createPhase3ManifestSkeleton,
} from './lib/phase3-completion.mjs';

const [target, composition, entryPoint, output] = process.argv.slice(2);
if (!target || !composition) {
  console.error('Nutzung: npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID> [entryPoint] [output.mp4]');
  process.exit(1);
}

const root = resolve(target);
const manifestPath = resolve(root, PHASE3_MANIFEST_RELATIVE);
if (existsSync(manifestPath)) {
  console.error(`\n✗ Phase-3-Manifest existiert bereits: ${PHASE3_MANIFEST_RELATIVE}`);
  console.error('  Nicht überschreiben. Vorhandenes Manifest vervollständigen.');
  process.exit(1);
}

try {
  const manifest = createPhase3ManifestSkeleton(root, {
    composition,
    entryPoint: entryPoint ?? 'src/index.ts',
    output,
  });
  mkdirSync(dirname(manifestPath), {recursive: true});
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`\n✓ Phase-3-Produktionsmanifest angelegt: ${PHASE3_MANIFEST_RELATIVE}`);
  console.log('  Jetzt JEDE Szene implementieren und im Manifest belegen.');
  console.log('  Erst wenn alle Szenen vollständig sind: status = READY_TO_RENDER.');
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
