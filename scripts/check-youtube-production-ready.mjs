#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {relative, resolve, sep} from 'node:path';
import {analyzeYouTubeReadiness, isSixteenNineDimensions} from './lib/youtube-readiness.mjs';
import {IMAGE_INBOX} from './lib/youtube-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:ready -- youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const contract = spawnSync(process.execPath, [resolve('scripts/validate-youtube.mjs'), root], {stdio: 'inherit'});
if (contract.status !== 0) process.exit(contract.status ?? 1);

const motion = spawnSync(process.execPath, [resolve('scripts/validate-youtube-animation-quality.mjs'), root], {stdio: 'inherit'});
if (motion.status !== 0) process.exit(motion.status ?? 1);

const result = analyzeYouTubeReadiness(root);
const printBlockers = (title, blockers) => {
  if (blockers.length === 0) return;
  console.error(`\n${title}`);
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
};
printBlockers('Phase 1 ist noch nicht vollständig:', result.phase1Blockers);
printBlockers('Phase 2 ist noch nicht vollständig:', result.phase2Blockers);

if (!result.ready) {
  console.error('\n✗ Phase 3 darf noch nicht starten. Alle Blocker stehen oben; keine Ersatzassets verwenden und versiegelte Motion nicht umgehen.');
  process.exit(1);
}

const ensureProbeSucceeded = (probe, mediaFile) => {
  if (probe.error?.code === 'ENOENT') {
    console.error('\n✗ Phase 3 darf noch nicht starten: ffprobe fehlt für die Medienprüfung.');
    process.exit(1);
  }
  if (probe.status !== 0) {
    console.error(`\n✗ Phase 3 darf noch nicht starten: Medium ist unlesbar oder beschädigt: ${mediaFile}`);
    process.exit(1);
  }
};

const audioFile = resolve(root, '03-audio', result.audioFiles[0]);
const audioProbe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioFile], {encoding: 'utf8'});
ensureProbeSucceeded(audioProbe, audioFile);

for (const fileName of result.expectedImages) {
  const imageFile = resolve(root, IMAGE_INBOX, fileName);
  const imageProbe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', imageFile], {encoding: 'utf8'});
  ensureProbeSucceeded(imageProbe, imageFile);
  let dimensions;
  try { dimensions = JSON.parse(imageProbe.stdout)?.streams?.[0]; }
  catch { dimensions = null; }
  const width = Number(dimensions?.width);
  const height = Number(dimensions?.height);
  if (!isSixteenNineDimensions(width, height)) {
    console.error(`\n✗ Phase 3 darf noch nicht starten: Nutzerbild muss horizontal 16:9 sein, ist aber ${width} × ${height}: ${imageFile}`);
    process.exit(1);
  }
}

console.log('\n✓ YOUTUBE-PHASE 3 STARTKLAR');
console.log(`  ${result.expectedImages.length} horizontale 16:9-Bilder · 1 finales Voiceover · echte Wort-Zeitstempel · versiegelte Motion V2 · vollständiges Publishing-Paket`);
console.log('  Phase 3 integriert jetzt die versiegelten Animationen, retimed sie zum echten Audio und übernimmt QA/Render ohne kreative Mechanik-Ersetzung.');
