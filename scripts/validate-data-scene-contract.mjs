#!/usr/bin/env node
// Prüft, ob die Zahlen einer Datenszene wirklich belegt sind.
//
// Eine Datenszene hat nur einen Daseinsgrund: Sie zeigt eine Zahl, die eine
// Bildszene nicht zeigen könnte. Damit steht und fällt sie mit der Herkunft der
// Zahl. Ein Chart, dessen Reihe nirgends liegt, ist eine Behauptung mit Achsen.
//
// Geprüft wird deshalb nicht der Code, sondern die Kette dahinter:
//
//   dataOrigin sagt, ob gemessen oder gerechnet wurde
//   dataSource zeigt auf die Datei bzw. die Rechenfunktion
//   sourceNote ist der Satz, der das im Bild offenlegt
//   die TSX enthält diesen Satz wirklich
//
// Der letzte Punkt ist der wichtigste. Eine Quellenzeile, die nur im
// scene-index steht, sieht im Video niemand.

import {existsSync, readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DATA_ORIGINS, canonicalSceneDirectory, sceneIsData} from './lib/reel-scene-schema.mjs';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const target = process.argv[2];
if (!target) {
  console.error('Aufruf: npm run reel:data:validate -- <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error(`scene-index.json fehlt: ${indexPath}`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const datenszenen = scenes.filter(sceneIsData);

const errors = [];
const fail = (message) => errors.push(message);

/** Ein Datum in irgendeiner lesbaren Schreibweise. */
const HAT_DATUM = /\b(?:\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\.\s*[A-Za-zÄÖÜäöü]+\s*\d{4})\b/;

for (const scene of datenszenen) {
  const id = scene?.id ?? 'unbekannte Szene';
  const herkunft = typeof scene.dataOrigin === 'string' ? scene.dataOrigin.trim() : '';
  const quelle = typeof scene.dataSource === 'string' ? scene.dataSource.trim() : '';
  const hinweis = typeof scene.sourceNote === 'string' ? scene.sourceNote.trim() : '';

  if (!DATA_ORIGINS.includes(herkunft)) {
    fail(`${id}.dataOrigin muss ${DATA_ORIGINS.join(' oder ')} sein.`);
    continue;
  }

  if (herkunft === 'measured') {
    // Eine gemessene Reihe liegt als Datei im Repo. Sonst ist sie beim nächsten
    // Render eine andere Reihe, und die Zahl im Skript stimmt nicht mehr.
    if (!quelle.startsWith('public/data/')) {
      fail(`${id}.dataSource muss bei measured auf eine Datei unter public/data/ zeigen.`);
    } else if (!existsSync(resolve(PROJECT_ROOT, quelle))) {
      fail(`${id}.dataSource zeigt auf eine Datei, die es nicht gibt: ${quelle}`);
    } else {
      try {
        const datei = JSON.parse(readFileSync(resolve(PROJECT_ROOT, quelle), 'utf8'));
        if (!datei.fetchedAt) fail(`${id}: ${quelle} hat kein fetchedAt; eine Reihe ohne Abrufdatum ist kein Stand.`);
        if (!Array.isArray(datei.chart) || datei.chart.length === 0) {
          fail(`${id}: ${quelle} enthält keine verwertbare Reihe.`);
        }
      } catch (error) {
        fail(`${id}: ${quelle} ist kein lesbares JSON (${error instanceof Error ? error.message : String(error)}).`);
      }
    }

    if (!HAT_DATUM.test(hinweis)) {
      fail(`${id}.sourceNote muss den Stand nennen; eine gemessene Reihe ohne Datum behauptet Gegenwart.`);
    }
  }

  if (herkunft === 'calculated') {
    // Eine Rechnung braucht keine Datei, aber sie muss sagen, dass sie eine
    // Annahme ist. "6 % p. a." ohne dieses Wort liest sich wie eine Zusage.
    if (!quelle) fail(`${id}.dataSource muss die Rechenfunktion nennen, z. B. sparplanFuerAnimation.`);
    if (!/annahme|beispiel|angenommen/i.test(hinweis)) {
      fail(`${id}.sourceNote muss die Annahme als Annahme kennzeichnen.`);
    }
  }

  // Die Quellenzeile muss im Bild landen, nicht nur im Index.
  const ordner = canonicalSceneDirectory(scene);
  const tsxPfad = typeof scene.animationSourceFile === 'string'
    ? resolve(root, '03-szenen', scene.animationSourceFile.replace(/^03-szenen\//, ''))
    : resolve(root, '03-szenen', ordner, 'animation.tsx');

  if (!existsSync(tsxPfad)) {
    fail(`${id}: kanonische Datenszenen-Komponente fehlt: ${tsxPfad}`);
    continue;
  }

  const source = readFileSync(tsxPfad, 'utf8');
  if (hinweis && !source.includes(hinweis)) {
    fail(`${id}: sourceNote steht nicht in der Komponente; eine Quellenzeile, die nur im Index steht, sieht niemand.`);
  }
  if (herkunft === 'measured' && quelle && !source.includes(quelle.replace('public/', ''))) {
    fail(`${id}: die Komponente liest ${quelle} nicht; die Szene zeigt andere Zahlen als der Index behauptet.`);
  }
}

if (errors.length) {
  console.error(`Datenszenen-Vertrag verletzt (${datenszenen.length} Datenszene(n) geprüft):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Datenszenen-Vertrag erfüllt: ${datenszenen.length} Datenszene(n) belegt.`);
