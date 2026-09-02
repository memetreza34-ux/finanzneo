#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v2.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-image-storytelling-v2';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageStorytellingContract = {
  id: CONTRACT_ID,
  practicalEverydaySituationRequired: true,
  directMeaningWithoutCaptionRequired: true,
  visibleActionConflictOrConsequenceRequired: true,
  genericSymbolOnlyForbidden: true,
  isolatedFinanceIconAsMainStoryForbidden: true,
  decorativeObjectPileForbidden: true,
  staticCatalogCompositionForbidden: true,
  entertainmentThroughActionContrastOrConflictRequired: true,
  beforeAfterOrCauseEffectWhenHelpful: true,
  humanContextWhenHelpful: true,
  visualHookUnderOneSecondRequired: true,
  oneImagePerSentenceWhenItImprovesClarity: true,
  extraImagePreferredOverOverloadedStill: true,
  labelsSupplementalOnly: true,
};
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const block = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}

FUTURE IMAGE STORYTELLING V2 — VERBINDLICH:
- Baue zuerst eine konkrete Alltagssituation, sichtbare Handlung, sichtbaren Konflikt oder sichtbare Konsequenz; erst danach Stil/Details.
- Das Motiv muss ohne Untertitel in unter einer Sekunde verständlich und interessant sein.
- Keine stumpfen Symbolbilder als Haupterklärung: kein einzelnes Sparschwein, keine einzelne Münze, kein isoliertes Konto-Icon, wenn eine echte Situation die Aussage besser zeigt.
- Keine dekorative Objektansammlung und kein statisches Katalog-Stillleben. Jedes relevante Objekt braucht eine Funktion in der Aussage.
- Bevorzuge Ursache → Wirkung, Vorher → Nachher, Handlung → Konsequenz oder einen klaren visuellen Kontrast.
- Eine Person oder menschlicher Kontext darf eingesetzt werden, wenn dadurch die Alltagssituation sofort klarer wird; Menschen sind kein Pflicht-Dekor.
- Kurze deutsche Objektlabels sind nur Ergänzung. Das Bild muss die Aussage bereits ohne Label tragen.
- Wenn ein Satz mehrere konkrete visuelle Gedanken enthält, lieber ein zusätzliches Bild / einen zusätzlichen Visual Beat planen als ein überladenes Bild.
- Unterhaltung entsteht durch Handlung, Spannung, Kontrast und sichtbare Veränderung — nicht durch zufällige Deko.`;

const appendOnce = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`)) {
    source += '\n\n' + block + '\n';
    writeFileSync(path, source, 'utf8');
  }
};

appendOnce('03-szenen/alle-bildprompts.txt');
appendOnce('03-szenen/bildwelt.txt');
appendOnce('03-szenen/00-cover/cover.txt');
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene.type === 'image' && typeof scene.planFile === 'string') appendOnce(scene.planFile);
}
appendOnce('05-projektdateien/szenenplan.md');
appendOnce('05-projektdateien/ANTIGRAVITY-AUFTRAG.md');

console.log('✓ Future Image Storytelling gesetzt: ' + CONTRACT_ID);
console.log('  Alltag + Handlung/Konsequenz zuerst · keine stumpfen Symbolbilder · zusätzliche Bilder erlaubt, wenn sie Klarheit und Rhythmus verbessern.');
