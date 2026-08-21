#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {relative, resolve, sep} from 'node:path';
import {analyzeReelReadiness} from './lib/reel-readiness.mjs';
import {IMAGE_INBOX} from './lib/reel-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('reels'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein Reel-Projekt unter reels/ sein.');
  process.exit(1);
}

const contract = spawnSync(process.execPath, [resolve('scripts/validate-reel.mjs'), root], {stdio: 'inherit'});
if (contract.status !== 0) process.exit(contract.status ?? 1);

const result = analyzeReelReadiness(root);

const printBlockers = (title, blockers) => {
  if (blockers.length === 0) return;
  console.error(`\n${title}`);
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
};

printBlockers('Phase 1 ist noch nicht vollständig:', result.phase1Blockers);
printBlockers('Phase 2 ist noch nicht vollständig:', result.phase2Blockers);

if (!result.ready) {
  console.error('\n✗ Phase 3 darf noch nicht starten. Alle Blocker stehen oben; keine Ersatzassets verwenden.');
  process.exit(1);
}

const mediaFiles = [
  resolve(root, '02-audio', result.audioFiles[0]),
  ...result.expectedImages.map((fileName) => resolve(root, IMAGE_INBOX, fileName)),
];
for (const mediaFile of mediaFiles) {
  const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', mediaFile], {encoding: 'utf8'});
  if (probe.error?.code === 'ENOENT') {
    console.error('\n✗ Phase 3 darf noch nicht starten: ffprobe fehlt für die Medienprüfung.');
    process.exit(1);
  }
  if (probe.status !== 0) {
    console.error(`\n✗ Phase 3 darf noch nicht starten: Medium ist unlesbar oder beschädigt: ${mediaFile}`);
    process.exit(1);
  }
}

console.log('\n✓ PHASE 3 STARTKLAR');
console.log(`  ${result.expectedImages.length} Bilder · 1 finales Voiceover · echte Wort-Zeitstempel`);
console.log('  Antigravity beginnt jetzt ohne Zwischenfragen mit Asset-Sync, Remotion, QA und Render.');
