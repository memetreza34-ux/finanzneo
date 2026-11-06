import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

test('Bilder mit Akzent-Karten halten oben links frei (Video 3: Karten lagen auf dem Kopf der Figur)', () => {
  const plan = readFileSync('scripts/youtube-plan-anwenden.mjs', 'utf8');
  assert.match(plan, /const AKZENT_FREIRAUM = 'FREE CORNER: Keep the top-left corner/);
  assert.match(plan, /\$\{v\.akzente\?\.length \? `\\n\$\{AKZENT_FREIRAUM\}\\n` : ''\}/);
});
