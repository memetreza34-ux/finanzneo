#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {relative, resolve, sep} from 'node:path';
import {analyzeReelReadiness, isSquareImageDimensions} from './lib/reel-readiness.mjs';
import {IMAGE_INBOX} from './lib/reel-contract.mjs';
import {PHASE3_EXECUTORS} from './lib/reel-scene-schema.mjs';

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

const audioFile = resolve(root, '02-audio', result.audioFiles[0]);
const audioProbe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioFile], {encoding: 'utf8'});
ensureProbeSucceeded(audioProbe, audioFile);

for (const fileName of result.expectedImages) {
  const imageFile = resolve(root, IMAGE_INBOX, fileName);
  const imageProbe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', imageFile], {encoding: 'utf8'});
  ensureProbeSucceeded(imageProbe, imageFile);

  let dimensions;
  try {
    dimensions = JSON.parse(imageProbe.stdout)?.streams?.[0];
  } catch {
    dimensions = null;
  }

  const width = Number(dimensions?.width);
  const height = Number(dimensions?.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    console.error(`\n✗ Phase 3 darf noch nicht starten: Bildmaße sind nicht lesbar: ${imageFile}`);
    process.exit(1);
  }
  if (!isSquareImageDimensions(width, height)) {
    console.error(`\n✗ Phase 3 darf noch nicht starten: Nutzerbild muss 1:1 sein, ist aber ${width} × ${height}: ${imageFile}`);
    process.exit(1);
  }
}

// Ab hier ist Phase 1 abgeschlossen. Der kanonische Animationscode wird jetzt
// gehasht und versiegelt. Phase 3 darf ihn danach nicht mehr verändern oder
// durch eigene Platzhalter-/Wackelkomponenten ersetzen.
const seal = spawnSync(process.execPath, [resolve('scripts/seal-phase1-animation-code.mjs'), root], {stdio: 'inherit'});
if (seal.status !== 0) {
  console.error('\n✗ Phase 3 darf noch nicht starten: Phase-1-Animationscode konnte nicht versiegelt werden.');
  process.exit(seal.status ?? 1);
}

const executor = PHASE3_EXECUTORS[result.phase3Executor];
console.log('\n✓ PHASE 3 STARTKLAR');
console.log(`  ${result.expectedImages.length} quadratische 1:1-Bilder · 1 finales Voiceover · echte Wort-Zeitstempel`);
console.log(`  Executor: ${executor.label}`);
console.log(`  Übergabe: ${executor.handoff}`);
console.log('  Phase-1-Animationscode ist versiegelt und darf in Phase 3 nicht ersetzt werden.');
console.log('\n  WICHTIG: STARTKLAR bedeutet NICHT fertig. Eine MP4 allein ist kein Abschluss.');
console.log('  Nächste Pflichtschritte:');
console.log(`  1. npm run reel:phase3:init -- ${target} <Composition-ID>`);
console.log('  2. Bildszenen integrieren; Animationsszenen direkt aus den versiegelten Phase-1-TSX-Dateien verwenden.');
console.log(`  3. npm run reel:phase3:preflight -- ${target}`);
console.log('  4. npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json');
console.log('  5. Post-Render-QA muss PASSED sein; danach startet der kanonische Export automatisch.');
console.log('  6. Playwright Visual QA + Audio/SFX-Prüfung müssen für die finale Freigabe dokumentiert sein.');
console.log('  Ein direkter reel:export-Aufruf ist nur für kontrollierten Re-Export einer bereits geprüften finalen MP4.');
console.log('  Erst ein erfolgreicher Auto-Export nach 06-export erlaubt den Status FINAL_COMPLETE.');
