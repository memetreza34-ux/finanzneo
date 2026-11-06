#!/usr/bin/env node

// Render-Smoke-Test: rendert von JEDER registrierten Composition einen
// Einzelframe. Findet Laufzeitfehler, die Typecheck und Bundle nicht sehen —
// etwa fehlende Assets, kaputte Props oder Fehler in der Render-Phase.
//
// Nutzung:
//   npm run smoke              alle Compositions
//   npm run smoke -- ReelTemplateDemo nur eine (Teilstring-Filter)

import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, readdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const ENTRY = 'src/index.ts';
const filter = process.argv[2];

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
// Node startet .cmd-Dateien unter Windows nur über die Shell.
const shell = process.platform === 'win32';

console.log('Compositions werden geladen …\n');

// Browser-Installation separat ausführen. So kann deren Fortschrittsausgabe
// nicht versehentlich als Composition-ID interpretiert werden.
const browser = spawnSync(npx, ['remotion', 'browser', 'ensure'], {encoding: 'utf8', shell});
if (browser.status !== 0) {
  console.error('Remotion-Browser konnte nicht vorbereitet werden.');
  console.error(`${browser.stdout ?? ''}${browser.stderr ?? ''}`.trim());
  process.exit(1);
}

let listing;
try {
  listing = execFileSync(npx, ['remotion', 'compositions', ENTRY, '--quiet'], {encoding: 'utf8', shell});
} catch (error) {
  console.error('Compositions konnten nicht geladen werden.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

// `--quiet` gibt ausschließlich die IDs aus, durch Leerzeichen getrennt.
const ids = listing
  .split(/\s+/)
  .map((id) => id.trim())
  .filter(Boolean)
  .filter((id) => (filter ? id.toLowerCase().includes(filter.toLowerCase()) : true))
  .sort();

if (ids.length === 0) {
  console.error(filter ? `Keine Composition passt auf "${filter}".` : 'Keine Compositions gefunden.');
  process.exit(1);
}

const outDir = mkdtempSync(join(tmpdir(), 'finanzneo-smoke-'));
const failures = [];
const skipped = [];

// public/youtube/ liegt absichtlich nicht im Git. Ein Video ohne jedes Bild kann hier nicht rendern;
// das wird sichtbar übersprungen. Sobald Bilder da sind, gilt wieder die volle Prüfung.
const ohneYouTubeBilder = (id) => {
  const treffer = /^YouTube-(\d{4}-\d{2}-\d{2})-(.+)$/.exec(id);
  if (!treffer) return false;
  const ordner = join('public', 'youtube', `${treffer[1]}_${treffer[2]}`, 'bilder');
  return !existsSync(ordner) || readdirSync(ordner).length === 0;
};

console.log(`${ids.length} Compositions werden geprüft …\n`);

for (const [index, id] of ids.entries()) {
  const position = `${String(index + 1).padStart(String(ids.length).length)}/${ids.length}`;
  process.stdout.write(`  ${position}  ${id.padEnd(26)}`);

  if (ohneYouTubeBilder(id)) {
    console.log('ÜBERSPRUNGEN (keine Bilder vorhanden)');
    skipped.push(id);
    continue;
  }

  const result = spawnSync(
    npx,
    ['remotion', 'still', ENTRY, id, join(outDir, `${id}.png`), '--frame=0', '--log=error'],
    {encoding: 'utf8', shell},
  );

  if (result.status === 0) {
    console.log('OK');
  } else {
    console.log('FEHLER');
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
      .split('\n')
      .find((line) => /error|Error|failed/.test(line));
    failures.push({id, reason: output?.trim() ?? 'unbekannter Fehler'});
  }
}

rmSync(outDir, {recursive: true, force: true});

if (failures.length > 0) {
  console.error(`\nSmoke-Test fehlgeschlagen — ${failures.length} von ${ids.length} Compositions rendern nicht:\n`);
  for (const failure of failures) {
    console.error(`- ${failure.id}: ${failure.reason}`);
  }
  process.exit(1);
}

const geprueft = ids.length - skipped.length;
console.log(`\n✓ ${geprueft} von ${ids.length} Compositions rendern fehlerfrei.`);
if (skipped.length > 0) console.log(`Übersprungen, weil die Bilder fehlen: ${skipped.join(', ')}`);
