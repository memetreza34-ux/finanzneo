#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = 'reels/2026-08-31_bis_2026-09-06/montag/reel-01_girokonto-oder-tagesgeld';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

const labels = {
  'scene-01':['Girokonto','Tagesgeld'],
  'scene-02':['Girokonto','Gehalt','Miete'],
  'scene-04':['Tagesgeld','Rücklage'],
  'scene-05':['Notgroschen','Später'],
  'scene-07':['Tagesgeld','Zinsen'],
  'scene-08':['Girokonto','Tagesgeld'],
};

index.scenes = index.scenes.map((scene) => labels[scene.id]
  ? {...scene, objectLabels: labels[scene.id]}
  : scene);
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
let cover = readFileSync(coverPath, 'utf8');
if (!cover.toLowerCase().includes('deep black background')) {
  cover += '\nBACKGROUND:\nUse one seamless deep black background exactly as in scene-01. The background must remain clean, minimal and uninterrupted.\n';
}
writeFileSync(coverPath, cover, 'utf8');

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
let master = readFileSync(masterPath, 'utf8');
if (!master.includes('03-szenen/00-ALLE-BILDER-HIER-REIN/')) {
  master += '\nFINALER BILDERORDNER:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\nAlle sechs fertig geprüften Einzelbilder werden ausschließlich dort gesammelt.\n';
}
writeFileSync(masterPath, master, 'utf8');

console.log('✓ Reel-Vertragsdetails korrigiert: objectLabels, Cover-Background und finaler Bilderordner.');
