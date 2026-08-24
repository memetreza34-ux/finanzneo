import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';

// Der Szenenqualitäts-Validator ist die Absicherung gegen genau die Fehler,
// die visuell erst im fertigen Render auffallen: fehlende oder nichtssagende
// Zwischenüberschriften, wiederholte Icons und überlange Bildbeats.
// Diese Tests halten ihn scharf.

const basisSzene = (over: Record<string, unknown> = {}) => ({
  id: 'scene-01',
  type: 'image',
  startFrame: 0,
  durationFrames: 120,
  headline: 'MEHRERE KONTEN WERDEN ADDIERT',
  icon: 'bank',
  headerTone: 'warning',
  ...over,
});

const laufe = (scenes: unknown[]) => {
  const dir = mkdtempSync(join(tmpdir(), 'fn-scene-'));
  mkdirSync(join(dir, '03-szenen'), {recursive: true});
  writeFileSync(
    join(dir, '03-szenen/scene-index.json'),
    JSON.stringify({video: {fps: 30}, scenes}),
  );

  const result = spawnSync(
    process.execPath,
    [resolve('scripts/validate-scene-quality.mjs'), dir],
    {encoding: 'utf8'},
  );
  rmSync(dir, {recursive: true, force: true});
  return {status: result.status, output: `${result.stdout}${result.stderr}`};
};

test('Eine saubere Szene besteht die Prüfung', () => {
  const {status} = laufe([basisSzene()]);
  assert.equal(status, 0);
});

test('Reine Zahlen sind keine Zwischenüberschrift', () => {
  const {status, output} = laufe([basisSzene({headline: '80.000 € + 80.000 €'})]);
  assert.equal(status, 1);
  assert.match(output, /keine Aussage/);
});

test('Ein einzelnes Stichwort ist keine Zwischenüberschrift', () => {
  const {status, output} = laufe([basisSzene({headline: 'GEMEINSCHAFTSKONTO'})]);
  assert.equal(status, 1);
  assert.match(output, /Stichwort/);
});

test('Nichtssagende Floskeln werden blockiert', () => {
  const {status, output} = laufe([basisSzene({headline: 'WICHTIG'})]);
  assert.equal(status, 1);
  assert.match(output, /sagt nichts|Stichwort/);
});

test('Fehlende Zwischenüberschrift wird blockiert', () => {
  const {status, output} = laufe([basisSzene({headline: ''})]);
  assert.equal(status, 1);
  assert.match(output, /Zwischenüberschrift fehlt/);
});

test('Platzhalter werden blockiert', () => {
  const {status, output} = laufe([basisSzene({headline: '[EINFÜGEN]'})]);
  assert.equal(status, 1);
  assert.match(output, /Platzhalter/);
});

test('Unbekannte Icons werden blockiert', () => {
  const {status, output} = laufe([basisSzene({icon: 'gibtesnicht'})]);
  assert.equal(status, 1);
  assert.match(output, /existiert nicht/);
});

test('Fehlendes Icon wird blockiert', () => {
  const {status, output} = laufe([basisSzene({icon: ''})]);
  assert.equal(status, 1);
  assert.match(output, /Icon fehlt/);
});

test('Bildbeats über 6 Sekunden werden blockiert', () => {
  const {status, output} = laufe([basisSzene({durationFrames: 200})]);
  assert.equal(status, 1);
  assert.match(output, /Maximal 6,0 s/);
});

test('Doppelte Zwischenüberschriften werden blockiert', () => {
  const {status, output} = laufe([
    basisSzene(),
    basisSzene({id: 'scene-02', startFrame: 120}),
  ]);
  assert.equal(status, 1);
  assert.match(output, /identisch/);
});

test('Lücken in der Timeline werden blockiert', () => {
  const {status, output} = laufe([
    basisSzene(),
    basisSzene({id: 'scene-02', headline: 'JEDE BANK SCHÜTZT SEPARAT', startFrame: 300}),
  ]);
  assert.equal(status, 1);
  assert.match(output, /lückenlos/);
});

test('Ohne Begründung greift die Timing-Ausnahme nicht', () => {
  const dir = mkdtempSync(join(tmpdir(), 'fn-scene-'));
  mkdirSync(join(dir, '03-szenen'), {recursive: true});
  writeFileSync(
    join(dir, '03-szenen/scene-index.json'),
    JSON.stringify({
      video: {fps: 30},
      timingExceptions: {longImageBeats: {allowed: true, reason: 'zu kurz'}},
      scenes: [basisSzene({durationFrames: 200})],
    }),
  );
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/validate-scene-quality.mjs'), dir],
    {encoding: 'utf8'},
  );
  rmSync(dir, {recursive: true, force: true});
  assert.equal(result.status, 1);
  assert.match(`${result.stdout}${result.stderr}`, /aussagekräftige Begründung/);
});
