import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import {zaehlwerkStellen} from '../src/design-system/zaehlwerk';

const kitSource = readFileSync(resolve('src/design-system/flache-daten.tsx'), 'utf8');
const indexSource = readFileSync(resolve('src/design-system/index.ts'), 'utf8');
const labSource = readFileSync(resolve('src/reels-test/FinanceMotionFlatLab.tsx'), 'utf8');
const standardSource = readFileSync(resolve('docs/PHASE-1-DATA-SCENE-STANDARD.md'), 'utf8');

const ablesen = (wert: number) =>
  Number(zaehlwerkStellen(wert).filter((stelle) => stelle.sichtbarkeit === 1).map((stelle) => stelle.position % 10).join(''));

test('Zählwerk zeigt ganze Zahlen ohne halb gedrehte Ziffer', () => {
  for (const wert of [0, 7, 55, 100, 180000, 246363, 609985, 1250000]) {
    const stellen = zaehlwerkStellen(wert);
    assert.ok(stellen.every((stelle) => Number.isInteger(stelle.position)), `${wert}: alle Positionen ganzzahlig`);
    assert.ok(stellen.every((stelle) => stelle.sichtbarkeit === 1), `${wert}: keine halb sichtbare Stelle`);
    assert.equal(ablesen(wert), wert);
  }
});

test('Zählwerk dreht höhere Stellen nur beim echten Überlauf mit', () => {
  // 609.985 hat unten 9.985 — früher rollte die Zehntausenderstelle hier schon halb.
  const zehntausender = zaehlwerkStellen(609985).find((stelle) => stelle.stelle === 4);
  assert.equal(zehntausender?.position, 0);

  // Kurz vor 100: Einer, Zehner und die neue Hunderterstelle rollen gemeinsam.
  const kurzVorHundert = zaehlwerkStellen(99.9);
  const hunderter = kurzVorHundert.find((stelle) => stelle.stelle === 2);
  const zehner = kurzVorHundert.find((stelle) => stelle.stelle === 1);
  assert.ok(hunderter && hunderter.sichtbarkeit > 0 && hunderter.sichtbarkeit < 1);
  assert.ok(zehner && zehner.position > 9 && zehner.position < 10);
});

test('Design-System exportiert den flachen Datenbaukasten', () => {
  assert.match(indexSource, /export \* from '\.\/flache-daten';/);
  for (const name of ['Zaehlwerk', 'Ueberzeile', 'WerteReihe', 'JahresBalken', 'Punkteraster', 'IconReihe', 'ZielBalken']) {
    assert.match(kitSource, new RegExp(`export const ${name}: React\\.FC<`), `${name} fehlt`);
  }
  assert.doesNotMatch(kitSource, /Math\.(?:sin|cos)\s*\(/);
});

test('Zählwerk rundet im Stand wie euroText', () => {
  assert.match(kitSource, /const wert = tempo === 0 \? Math\.round\(roh\) : roh;/);
});

test('Referenz holt alle Zahlen aus der Zentralrechnung statt sie einzutippen', () => {
  assert.match(labSource, /sparplanFuerAnimation\(/);
  assert.match(labSource, /kaufkraftFuerAnimation\(/);
  assert.match(labSource, /from '\.\.\/design-system';/);
  // Ergebniswerte dürfen nicht als Zahl im Quelltext stehen.
  for (const ergebnis of ['609985', '609.985', '429985', '429.985', '246363', '246.363', '55,2']) {
    assert.ok(!labSource.includes(ergebnis), `${ergebnis} ist eingetippt statt gerechnet`);
  }
  assert.match(labSource, /note: SPARPLAN\.hinweis/);
  assert.match(labSource, /note: KAUFKRAFT\.hinweis/);
});

test('Datenszenen-Standard beschreibt den flachen Baukasten', () => {
  assert.match(standardSource, /flache-daten\.tsx/);
  assert.match(standardSource, /ReelsTestFinanceMotionFlat/);
});
