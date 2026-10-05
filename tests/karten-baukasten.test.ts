import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const kit = read('src/design-system/karten.tsx');

test('Design-System exportiert den Karten-Baukasten', () => {
  assert.match(read('src/design-system/index.ts'), /export \* from '\.\/karten';/);
  for (const name of ['KartenBuehne', 'StichwortKarte', 'ZitatKarte', 'TabellenKarte', 'IconAblauf', 'Zeitstrahl', 'KartenHinweis']) {
    assert.match(kit, new RegExp(`export const ${name}: React\\.FC<`), `${name} fehlt`);
  }
});

test('Karten bewegen sich nur über die Remotion-Timeline', () => {
  assert.match(kit, /useCurrentFrame\(\)/);
  assert.match(kit, /\bprog\(/);
  assert.doesNotMatch(kit, /Math\.(?:random|sin|cos)\s*\(|\btransition\s*:|\banimation\s*:/);
  assert.match(kit, /backgroundColor: KARTE\.hintergrund/);
  assert.match(kit, /hintergrund: '#000000'/);
});

test('YouTube-Animationsprüfung erkennt Karten-Szenen gezielt, ohne die Motion-Pflicht sonst aufzuweichen', () => {
  const validator = read('scripts/validate-youtube-animation-quality.mjs');
  assert.match(validator, /const nutztKarten = /);
  assert.match(validator, /StichwortKarte\|ZitatKarte\|TabellenKarte\|IconAblauf\|Zeitstrahl/);
  assert.match(validator, /if \(!nutztKarten && !\/useCurrentFrame/);
  assert.match(validator, /if \(!nutztKarten && !\/\\b\(interpolate\|spring\)/);
});

test('Regeln erlauben die Karten ausdrücklich', () => {
  const brain = read('CLAUDE.md');
  const standard = read('youtube/PRODUKTIONSSTANDARD.md');
  assert.match(brain, /### Karten \(Remotion\) — erlaubter eigener Visual-Typ/);
  assert.match(brain, /reine Texttafel mit Fade\/Scale ohne Editorial-Idee — außer Stichwort-\/Zitat-Karten aus dem Karten-Baukasten/);
  assert.match(standard, /## Karten\b/);
  assert.match(standard, /src\/design-system\/karten\.tsx/);
  for (const name of ['StichwortKarte', 'ZitatKarte', 'TabellenKarte', 'IconAblauf', 'Zeitstrahl']) {
    assert.match(standard, new RegExp(name));
  }
});
