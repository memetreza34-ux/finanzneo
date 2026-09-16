#!/usr/bin/env node
// Post-Render-QA für YouTube.
//
// Eine vorhandene MP4 beweist nichts. Geprüft wird, ob Format, Länge und Ton
// stimmen und ob jede Szene wirklich Bild zeigt — ein schwarzes oder nur mit
// Überschrift gefülltes Video darf nie als fertig gelten.

import {spawnSync} from 'node:child_process';
import {loadYouTubeProject} from './lib/youtube-project';
import {YOUTUBE_FORMAT} from '../src/youtube/layout';

const [target, videoPath] = process.argv.slice(2);
if (!target || !videoPath) {
  console.error('Nutzung: node --import tsx scripts/youtube-render-qa.ts <Projekt> <video.mp4>');
  process.exit(1);
}

let project;
try {
  project = loadYouTubeProject(target);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const probe = (args: string[]) => {
  const result = spawnSync('ffprobe', args, {encoding: 'utf8'});
  if ((result.error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') {
    console.error('\n✗ ffprobe fehlt. Render-QA kann nicht laufen.');
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`\n✗ Video ist unlesbar: ${videoPath}`);
    process.exit(1);
  }
  return result.stdout.trim();
};

const failures: string[] = [];

const video = JSON.parse(probe(['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,avg_frame_rate,nb_frames', '-of', 'json', videoPath])).streams?.[0] ?? {};
const audioStreams = JSON.parse(probe(['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_type', '-of', 'json', videoPath])).streams ?? [];
const durationSeconds = Number(probe(['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', videoPath]));

if (Number(video.width) !== YOUTUBE_FORMAT.width || Number(video.height) !== YOUTUBE_FORMAT.height) {
  failures.push(`Auflösung ist ${video.width}×${video.height}, erwartet ${YOUTUBE_FORMAT.width}×${YOUTUBE_FORMAT.height}.`);
}
const [num, den] = String(video.avg_frame_rate ?? '0/1').split('/').map(Number);
const fps = den ? num / den : 0;
if (Math.abs(fps - YOUTUBE_FORMAT.fps) > 0.2) {
  failures.push(`Framerate ist ${fps.toFixed(2)}, erwartet ${YOUTUBE_FORMAT.fps}.`);
}
if (audioStreams.length === 0) failures.push('Das Video hat keine Tonspur.');

const expectedSeconds = project.timeline.durationInFrames / project.timeline.fps;
if (Math.abs(durationSeconds - expectedSeconds) > 1.0) {
  failures.push(`Länge ist ${durationSeconds.toFixed(1)} s, die Timeline erwartet ${expectedSeconds.toFixed(1)} s.`);
}

// Pro Szene ein Frame aus der Mitte auf echten Bildinhalt prüfen.
//
// Gemessen wird YMAX, nicht der Durchschnitt: Video-Schwarz liegt bei Y = 16,
// nicht bei 0, deshalb besteht ein komplett schwarzes Bild jede Schwelle, die
// sich am Mittelwert orientiert. Ein Frame mit sichtbarem Inhalt hat dagegen
// helle Pixel — gemessen 223 im echten Render gegen 16 bei Vollschwarz.
const BLACK_LEVEL = 16;
const CONTENT_THRESHOLD = 40;

const dark: string[] = [];
const brightness: number[] = [];
for (const scene of project.timeline.scenes) {
  const middle = (scene.startFrame + scene.durationInFrames / 2) / project.timeline.fps;
  // -v info ist Absicht: metadata=print schreibt die Messwerte auf Info-Level,
  // mit -v error kommt nichts zurück und jede Szene sähe schwarz aus.
  const stats = spawnSync('ffmpeg', [
    '-v', 'info', '-ss', String(middle), '-i', videoPath, '-frames:v', '1',
    '-vf', 'crop=1440:810:240:180,signalstats,metadata=print',
    '-f', 'null', '-',
  ], {encoding: 'utf8'});
  const match = /signalstats\.YMAX=([0-9.]+)/.exec(`${stats.stdout}${stats.stderr}`);
  const peak = match ? Number(match[1]) : BLACK_LEVEL;
  brightness.push(peak);
  if (peak < CONTENT_THRESHOLD) dark.push(`${scene.id} (Spitzenhelligkeit ${peak.toFixed(0)})`);
}
if (dark.length > 0) {
  failures.push(`Szenen ohne sichtbaren Visualinhalt: ${dark.join(', ')}`);
}

console.log(`\nRender-QA ${videoPath}`);
console.log(`  Format      ${video.width}×${video.height} · ${fps.toFixed(0)} fps`);
console.log(`  Länge       ${durationSeconds.toFixed(1)} s (Timeline ${expectedSeconds.toFixed(1)} s)`);
console.log(`  Ton         ${audioStreams.length > 0 ? 'vorhanden' : 'FEHLT'}`);
console.log(`  Szenen      ${project.timeline.scenes.length} geprüft, ${dark.length} ohne Bildinhalt (Spitzen ${Math.min(...brightness).toFixed(0)}–${Math.max(...brightness).toFixed(0)}, Schwarz = ${BLACK_LEVEL})`);

if (failures.length > 0) {
  console.error('\n✗ Render-QA fehlgeschlagen:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\n✓ Render-QA bestanden.');
