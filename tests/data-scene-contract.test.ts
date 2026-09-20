import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  DATA_ORIGINS,
  SCENE_TYPES,
  sceneIsData,
  sceneNeedsComponent,
  sceneNeedsFlowImage,
  validateSceneShape,
} from '../scripts/lib/reel-scene-schema.mjs';

// Eine Datenszene behauptet eine Zahl. Geprüft wird deshalb nicht, ob sie hübsch
// ist, sondern ob die Zahl belegt ist und der Beleg im Bild landet.

const WURZEL = 'reels/2099-02-02_datenszene-test';
const REEL = `${WURZEL}/montag/reel-01_daten`;

const basisSzene = (overrides: Record<string, unknown> = {}) => ({
  id: 'scene-02',
  type: 'data',
  headline: 'Zehn Jahre MSCI World',
  icon: 'trending',
  planFile: 'EINZELNE-SZENEN/scene-02/daten.md',
  animationSourceFile: 'EINZELNE-SZENEN/scene-02/animation.tsx',
  animationExport: 'Scene02Kursreihe',
  animationIntent: 'Die gemessene Reihe zeichnet sich und der tiefste Fall bleibt markiert stehen.',
  animationQualityLock: 'finanzneo-phase1-animation-code-v1',
  dataOrigin: 'measured',
  dataSource: 'public/data/msci-world-10y.json',
  dataClaim: 'Zehn Jahre Weltmarkt steigen aufs Dreifache und fallen zwischendurch deutlich.',
  sourceNote: 'Quelle: Yahoo Finance · URTH · 10y, Stand 7.6.2026',
  ...overrides,
});

test('data ist ein gültiger dritter Szenentyp', () => {
  assert.deepEqual(SCENE_TYPES, ['image', 'animation', 'data']);
  assert.equal(validateSceneShape(basisSzene()).length, 0);
});

test('eine Datenszene braucht eine Komponente, aber kein Flow-Bild', () => {
  const szene = basisSzene();
  assert.equal(sceneIsData(szene), true);
  assert.equal(sceneNeedsComponent(szene), true);
  assert.equal(sceneNeedsFlowImage(szene), false);
});

test('ohne Herkunft, Quelle, Aussage oder Quellenzeile ist eine Datenszene ungültig', () => {
  for (const feld of ['dataOrigin', 'dataSource', 'dataClaim', 'sourceNote']) {
    const szene = basisSzene({[feld]: undefined});
    const fehler = validateSceneShape(szene);
    assert.ok(fehler.some((meldung: string) => meldung.includes(`${feld} fehlt`)), `${feld} wurde nicht bemängelt: ${fehler.join(' | ')}`);
  }
});

test('eine unbekannte Herkunft wird abgelehnt', () => {
  const fehler = validateSceneShape(basisSzene({dataOrigin: 'geschaetzt'}));
  assert.ok(fehler.some((meldung: string) => meldung.includes('dataOrigin')), fehler.join(' | '));
  assert.deepEqual(DATA_ORIGINS, ['measured', 'calculated']);
});

test('eine zu vage Aussage zählt nicht als Beleg', () => {
  const fehler = validateSceneShape(basisSzene({dataClaim: 'Kurve'}));
  assert.ok(fehler.some((meldung: string) => meldung.includes('dataClaim')), fehler.join(' | '));
});

test('eine Datenszene darf kein Google-Flow-Bild erwarten', () => {
  const fehler = validateSceneShape(basisSzene({googleFlowFileName: 'Bild 02 - Kurve.png'}));
  assert.ok(fehler.some((meldung: string) => meldung.includes('googleFlowFileName')), fehler.join(' | '));
});

// ── Vertragsprüfer gegen echte Dateien ──────────────────────────────────────

const reelSchreiben = (szene: Record<string, unknown>, tsx: string) => {
  const root = resolve(REEL);
  rmSync(resolve(WURZEL), {recursive: true, force: true});
  mkdirSync(resolve(root, '03-szenen/EINZELNE-SZENEN/scene-02'), {recursive: true});
  writeFileSync(resolve(root, '03-szenen/scene-index.json'), JSON.stringify({title: 'Probe', scenes: [szene]}, null, 2));
  writeFileSync(resolve(root, '03-szenen/EINZELNE-SZENEN/scene-02/animation.tsx'), tsx);
  return root;
};

const pruefen = (root: string) =>
  spawnSync(process.execPath, [resolve('scripts/validate-data-scene-contract.mjs'), root], {encoding: 'utf8'});

const GUTE_TSX = `import serie from '../../../../../public/data/msci-world-10y.json';
export const Scene02Kursreihe = () => (
  <div>
    <span>Quelle: Yahoo Finance · URTH · 10y, Stand 7.6.2026</span>
    <span>{serie.chart.length}</span>
  </div>
);
`;

test('eine belegte Datenszene besteht den Vertrag', () => {
  const root = reelSchreiben(basisSzene(), GUTE_TSX);
  const result = pruefen(root);
  rmSync(resolve(WURZEL), {recursive: true, force: true});
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test('eine Quellenzeile, die nur im Index steht, wird abgelehnt', () => {
  const ohneHinweis = GUTE_TSX.replace('Quelle: Yahoo Finance · URTH · 10y, Stand 7.6.2026', 'Kursverlauf');
  const root = reelSchreiben(basisSzene(), ohneHinweis);
  const result = pruefen(root);
  rmSync(resolve(WURZEL), {recursive: true, force: true});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /sourceNote steht nicht in der Komponente/);
});

test('eine gemessene Reihe ohne existierende Datei wird abgelehnt', () => {
  const root = reelSchreiben(basisSzene({dataSource: 'public/data/gibt-es-nicht.json'}), GUTE_TSX);
  const result = pruefen(root);
  rmSync(resolve(WURZEL), {recursive: true, force: true});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /zeigt auf eine Datei, die es nicht gibt/);
});

test('eine gemessene Reihe ohne Stand im Quellensatz wird abgelehnt', () => {
  const ohneDatum = 'Quelle: Yahoo Finance · URTH · 10y';
  const tsx = GUTE_TSX.replace('Quelle: Yahoo Finance · URTH · 10y, Stand 7.6.2026', ohneDatum);
  const root = reelSchreiben(basisSzene({sourceNote: ohneDatum}), tsx);
  const result = pruefen(root);
  rmSync(resolve(WURZEL), {recursive: true, force: true});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /muss den Stand nennen/);
});

test('eine Rechnung muss sich als Annahme zu erkennen geben', () => {
  const satz = 'Berechnet mit 6 % p. a. über 30 Jahre';
  const tsx = GUTE_TSX.replace('Quelle: Yahoo Finance · URTH · 10y, Stand 7.6.2026', satz);
  const root = reelSchreiben(
    basisSzene({dataOrigin: 'calculated', dataSource: 'sparplanFuerAnimation', sourceNote: satz}),
    tsx,
  );
  const result = pruefen(root);
  rmSync(resolve(WURZEL), {recursive: true, force: true});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Annahme als Annahme/);
});
