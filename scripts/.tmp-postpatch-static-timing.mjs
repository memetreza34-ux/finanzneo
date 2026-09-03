import {readFileSync, writeFileSync} from 'node:fs';

const root = 'reels/2026-08-31_bis_2026-09-06/donnerstag/reel-04_kreditkarten-teilzahlung';
const indexPath = `${root}/03-szenen/scene-index.json`;
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const byId = (id) => index.scenes.find((scene) => scene.id === id);

for (const id of ['scene-06', 'scene-10']) {
  const scene = byId(id);
  if (!scene || scene.type !== 'image') throw new Error(`${id} fehlt oder ist keine Bildszene.`);
  scene.durationFrames = 120;
  scene.plannedDurationSeconds = 4;
  scene.targetSeconds = 4;
  for (const beat of scene.visualBeats ?? []) beat.endSecond = Math.min(Number(beat.endSecond ?? 4), 4);
}

let cursor = 0;
for (const scene of index.scenes) {
  scene.startFrame = cursor;
  cursor += Number(scene.durationFrames || 0);
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

const timelinePath = `${root}/05-projektdateien/timeline.json`;
const timeline = JSON.parse(readFileSync(timelinePath, 'utf8'));
for (const scene of timeline.scenes ?? []) {
  const canonical = byId(scene.id);
  if (canonical) scene.plannedDurationSeconds = canonical.plannedDurationSeconds;
}
writeFileSync(timelinePath, `${JSON.stringify(timeline, null, 2)}\n`, 'utf8');

const planPath = `${root}/05-projektdateien/szenenplan.md`;
let plan = readFileSync(planPath, 'utf8');
plan = plan.replace(/(- scene-06 \| image \|[^\n]*\| )4\.1 s( \|)/, '$14.0 s$2');
plan = plan.replace(/(- scene-10 \| image \|[^\n]*\| )4\.2 s( \|)/, '$14.0 s$2');
writeFileSync(planPath, plan, 'utf8');

let visual = `# Visual Beats\n\nVISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v2\n\nLieber ein zusätzliches gutes Bild planen als einen neuen konkreten Gedanken in ein überladenes Stillbild zu pressen.\n\nCover-Regel: scene-01 = 0,1 s / 3 Frames / kein Voiceover.\n\n`;
for (const scene of index.scenes) {
  visual += `## ${scene.id} — ${scene.headline}\n\nSprechtext: ${scene.coverOnly ? '— (Cover ohne Voiceover)' : scene.audioTrigger}\n\nDauer: ${scene.plannedDurationSeconds} s\n\n`;
  for (const [i, beat] of (scene.visualBeats ?? []).entries()) {
    visual += `- Beat ${i + 1}: ${beat.voiceText || '—'} | Sichtbar: ${beat.visualChange} | ${beat.startSecond}–${beat.endSecond} s\n`;
  }
  visual += '\n';
}
writeFileSync(`${root}/05-projektdateien/visual-beats.md`, visual, 'utf8');

console.log('✓ scene-06 und scene-10 auf Future-V3-Maximum 4,0 s gesetzt.');
