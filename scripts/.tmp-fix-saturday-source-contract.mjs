#!/usr/bin/env node

import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-08-31_bis_2026-09-06/samstag/reel-06_tagesgeld-aktionszins');
const scenesRoot = resolve(root, '03-szenen');

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

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) throw new Error('Master-Prompt fehlt');
let master = readFileSync(masterPath, 'utf8');
if (!master.includes('00-ALLE-BILDER-HIER-REIN')) {
  master += '\n\nFINAL_COLLECTION_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/\n';
  writeFileSync(masterPath, master, 'utf8');
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
console.log('✓ Kanonische recherche-quellen.md mit geprüften Aussagen befüllt.');
