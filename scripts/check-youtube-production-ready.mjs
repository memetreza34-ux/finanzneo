#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {relative, resolve, sep} from 'node:path';
import {analyzeYouTubeReadiness, isSixteenNineDimensions} from './lib/youtube-readiness.mjs';
import {AUDIO_DIR, IMAGE_INBOX} from './lib/youtube-contract.mjs';

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

for (const script of ['scripts/validate-youtube.mjs', 'scripts/validate-youtube-animation-quality.mjs']) {
  const gate = spawnSync(process.execPath, [resolve(script), root], {stdio: 'inherit'});
  if (gate.status !== 0) process.exit(gate.status ?? 1);
}

const result = analyzeYouTubeReadiness(root);
const printBlockers = (title, blockers) => {
  if (!blockers.length) return;
  console.error(`\n${title}`);
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
};
printBlockers('Phase 1 ist noch nicht vollständig:', result.phase1Blockers);
printBlockers('Phase 2 / Timeline ist noch nicht vollständig:', result.phase2Blockers);
if (!result.ready) {
  console.error('\n✗ Phase 3 darf nicht starten. Kein manueller Render-Bypass, keine Ersatzassets, keine 0-Frame-Timeline.');
  process.exit(1);
}

const ensureProbeSucceeded = (probe, mediaFile) => {
  if (probe.error?.code === 'ENOENT') {
    console.error('\n✗ ffprobe fehlt für die Medienprüfung.');
    process.exit(1);
  }
  if (probe.status !== 0) {
    console.error(`\n✗ Medium ist unlesbar oder beschädigt: ${mediaFile}`);
    process.exit(1);
  }
};

const audioFile = resolve(root, AUDIO_DIR, result.audioFiles[0]);
const audioProbe = spawnSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',audioFile], {encoding:'utf8'});
ensureProbeSucceeded(audioProbe, audioFile);

for (const fileName of result.expectedImages) {
  const imageFile = resolve(root, IMAGE_INBOX, fileName);
  const imageProbe = spawnSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',imageFile], {encoding:'utf8'});
  ensureProbeSucceeded(imageProbe, imageFile);
  let dimensions;
  try { dimensions = JSON.parse(imageProbe.stdout)?.streams?.[0]; } catch { dimensions = null; }
  const width = Number(dimensions?.width);
  const height = Number(dimensions?.height);
  if (!isSixteenNineDimensions(width, height)) {
    console.error(`\n✗ Nutzerbild muss horizontal 16:9 sein, ist aber ${width} × ${height}: ${imageFile}`);
    process.exit(1);
  }
}

console.log('\n✓ YOUTUBE PHASE 3 STARTKLAR');
console.log(`  ${result.expectedImages.length} Bilder · 1 finales Voiceover · echte Wort-Timestamps · aufgelöste Timeline · Motion V3 Seal.`);
console.log('  Finalrender ausschließlich über: npm run youtube:render -- <Projekt>');
