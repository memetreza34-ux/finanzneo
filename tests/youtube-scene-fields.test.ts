import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {YOUTUBE_HEADER_TONES, YOUTUBE_ICON_NAMES} from '../scripts/lib/youtube-contract.mjs';

const read = (path: string) => readFileSync(resolve(path), 'utf8');

/**
 * Quelltext lesen statt die Module zu laden: motion-kit zieht SceneHeader und
 * damit fonts.ts nach, das die Browser-API FontFace braucht und in node nicht
 * lädt. Für einen Listenvergleich reicht der Text.
 */
const listFrom = (path: string, constName: string) => {
  const source = read(path);
  const start = source.indexOf(`${constName} = [`);
  const block = source.slice(start, source.indexOf(']', start));
  return [...block.matchAll(/'([a-zA-Z][a-zA-Z0-9-]*)'/g)].map((match) => match[1]).sort();
};

const iconNamesFromComponent = () => {
  const source = read('src/brand/components/Icon.tsx');
  const block = source.slice(source.indexOf('const PATHS'), source.indexOf('\n};', source.indexOf('const PATHS')));
  return [...block.matchAll(/^\s{2}'?([a-zA-Z][a-zA-Z0-9-]*)'?:\s*<>/gm)].map((match) => match[1]).sort();
};

test('Iconliste: Validator, Baukasten und Komponente nennen dieselben Icons', () => {
  // Drei Kopien, weil .mjs kein TSX laden kann und der Baukasten keine .mjs
  // importieren soll. Dieser Test ist die Klammer, die sie zusammenhält.
  const fromComponent = iconNamesFromComponent();
  assert.ok(fromComponent.length > 20, `Nur ${fromComponent.length} Icons in Icon.tsx gefunden — Parser prüfen.`);
  assert.deepEqual([...YOUTUBE_ICON_NAMES].sort(), fromComponent);
  assert.deepEqual(listFrom('src/youtube/motion-kit.tsx', 'YOUTUBE_ICONS'), fromComponent);
});

test('Iconliste: die Tonalitäten entsprechen SceneHeaderTone', () => {
  const source = read('src/brand/components/SceneHeader.tsx');
  const match = /export type SceneHeaderTone = ([^;]+);/.exec(source);
  assert.ok(match, 'SceneHeaderTone nicht gefunden.');
  const tones = [...match[1].matchAll(/'([a-z]+)'/g)].map((entry) => entry[1]).sort();
  assert.deepEqual([...YOUTUBE_HEADER_TONES].sort(), tones);
});

test('Szenenfelder: das Scaffold legt Überschrift, Icon und Satzzuordnung an', () => {
  // Ohne diese Felder rendert die Composition eine leere Kopfbahn und verteilt
  // die Schnitte nur der Reihe nach. Phase 1 muss sie also vorgegeben bekommen.
  const source = read('scripts/scaffold-finanzneo-youtube.mjs');
  assert.match(source, /headline: '\[ZWISCHENUEBERSCHRIFT\]'/);
  assert.match(source, /icon: '\[ICON NAME\]'/);
  assert.match(source, /sentenceSpan: \{from: 0, to: 0\}/);
});
