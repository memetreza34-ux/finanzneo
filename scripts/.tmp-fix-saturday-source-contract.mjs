#!/usr/bin/env node

import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-08-31_bis_2026-09-06/samstag/reel-06_tagesgeld-aktionszins');
const scenesRoot = resolve(root, '03-szenen');
const COVER_HOOK_ID = 'finanzneo-cover-hook-v2';

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = resolve(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.txt')) {
      const before = readFileSync(path, 'utf8');
      const after = before.replace(/deep-black background/gi, 'deep black background');
      if (after !== before) writeFileSync(path, after, 'utf8');
    }
  }
};
walk(scenesRoot);

const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const iconMap = {
  'scene-03': 'document',
  'scene-08': 'coins',
  'scene-09': 'repeat',
  'scene-10': 'chart-bar',
  'scene-13': 'repeat',
};
for (const scene of index.scenes ?? []) {
  if (iconMap[scene.id]) scene.icon = iconMap[scene.id];
  if (scene.id === 'scene-08') scene.headline = '10.000 €: rund 75 € Zinsen';
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const scene08Md = resolve(root, '03-szenen/EINZELNE-SZENEN/scene-08/szene.md');
if (existsSync(scene08Md)) {
  const source = readFileSync(scene08Md, 'utf8').replace('10.000 € für 3 Monate: grob 75 €', '10.000 €: rund 75 € Zinsen');
  writeFileSync(scene08Md, source, 'utf8');
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) throw new Error('Master-Prompt fehlt');
let master = readFileSync(masterPath, 'utf8');
const masterMarkers = `

FINAL_COLLECTION_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/
COVER = SZENE 01
KEIN separates Cover erzeugen
KEIN Bild 00 erzeugen
`;
if (!master.includes('COVER = SZENE 01')) master += masterMarkers;
writeFileSync(masterPath, master, 'utf8');

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (!existsSync(coverPath)) throw new Error('Cover-Alias fehlt');
let cover = readFileSync(coverPath, 'utf8');
const coverMarkers = `

COVER_HOOK_CONTRACT: ${COVER_HOOK_ID}
TECHNISCHER COVER-ALIAS — KEIN SEPARATER BILDJOB
No separate cover generation.
no Bild 00.
`;
if (!cover.includes(COVER_HOOK_ID)) cover += coverMarkers;
writeFileSync(coverPath, cover, 'utf8');

const scene01Path = resolve(root, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt');
if (!existsSync(scene01Path)) throw new Error('scene-01 Bildprompt fehlt');
let scene01 = readFileSync(scene01Path, 'utf8');
if (!scene01.includes(COVER_HOOK_ID)) {
  scene01 += `\n\nCOVER_HOOK_CONTRACT: ${COVER_HOOK_ID}\n`;
  writeFileSync(scene01Path, scene01, 'utf8');
}

const research = `# Recherche und Quellen – Tagesgeld-Aktionszins

Stand: 05.09.2026

## Geprüfte Kernaussagen

- Tagesgeld-Angebote mit besonders hohem Zinssatz richten sich häufig an Neukunden und der höhere Zinssatz ist oft zeitlich begrenzt.
- Nach Ablauf einer solchen Aktion kann für das bestehende Tagesgeldkonto ein niedrigerer Bestandskunden- beziehungsweise Standardzins gelten.
- Bei Angebotsvergleichen sollen deshalb nicht nur der beworbene Aktionszins, sondern auch Aktionsdauer und Anschlusskonditionen berücksichtigt werden.
- Topkonditionen können außerdem an Bedingungen wie Neukundenstatus oder neues Geld geknüpft sein.
- Das Rechenbeispiel 10.000 € × 3 % p.a. × 3/12 = 75 € ist ausdrücklich eine vereinfachte proportionale Illustration und keine konkrete Bankkondition.

## Quellen

1. Verbraucherzentrale – „Zinsen für Tagesgeld und Festgeld: So finden Sie sicher das beste Angebot“, Stand 20.01.2026
   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/zinsen-fuer-tagesgeld-und-festgeld-so-finden-sie-sicher-das-beste-angebot-102422
2. Verbraucherzentrale – „Geldanlage und Inflation: Wie lege ich Geld bei geringen Zinsen an?“, Stand 26.01.2026
   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/geldanlage-und-inflation-wie-lege-ich-geld-bei-geringen-zinsen-an-11534

Keine konkrete Bankempfehlung. Keine individuelle Finanzberatung.
`;
writeFileSync(resolve(root, '05-projektdateien/recherche-quellen.md'), research, 'utf8');

console.log('✓ Exakte Source-Contract-Marker ergänzt: deep black background + finaler Bilderordner.');
console.log('✓ Kanonische scene-01 Cover-/Alias-Marker und Cover-Hook V2 erhalten.');
console.log('✓ Alle Szenen verwenden gültige FinanzNeo-Icons; scene-08-Headline gekürzt.');
console.log('✓ Kanonische recherche-quellen.md mit geprüften Aussagen befüllt.');
