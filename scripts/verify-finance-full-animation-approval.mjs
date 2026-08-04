import {readFile} from 'node:fs/promises';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const manifestPath = 'channels/finanzneo/src/animation-system/full-animation-reel/full-animation-reel-quality.json';
const manifest = JSON.parse(await readFile(new URL(manifestPath, root), 'utf8'));
const evidence = manifest.manualEvidence ?? {};
const failures = [];

if (manifest.status !== 'approved') failures.push(`Qualitätsstatus ist ${manifest.status ?? 'unbekannt'} statt approved.`);
if (evidence.fullVideoReviewed !== true) failures.push('Das vollständige MP4 wurde nicht bestätigt.');
if (evidence.contactSheetReviewed !== true) failures.push('Der Kontaktbogen wurde nicht bestätigt.');
if (evidence.minimumThreeFramesPerSceneReviewed !== true) failures.push('Es wurden nicht mindestens drei Frames pro Szene geprüft.');
if (evidence.voiceoverPresent !== true) failures.push('Finales Voiceover fehlt.');
if (evidence.soundDesignPresent !== true) failures.push('Sounddesign fehlt.');
if (evidence.approvedByHuman !== true) failures.push('Es fehlt eine ausdrückliche menschliche Freigabe.');

if (failures.length > 0) {
  console.error('Full-animation reel approval blocked.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Full-animation reel approval gate passed.');
}
