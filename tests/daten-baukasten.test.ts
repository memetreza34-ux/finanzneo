import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {euroText, schoeneSkala, skala, wertBeiStationen, zaehlStellen} from '../src/design-system/daten-rechnung';

const read = (path: string) => readFileSync(path, 'utf8');
const kit = read('src/design-system/daten.tsx');

/** Liest die Ziffern eines stehenden Zählwerks ab. */
const ziffern = (einheiten: number, minStellen = 1) => zaehlStellen(einheiten, minStellen).filter((s) => s.sichtbarkeit === 1).map((s) => s.position % 10).join('');

test('Daten-Baukasten exportiert alle Bausteine', () => {
  for (const name of ['DatenBuehne', 'Kopf', 'Text', 'Quelle', 'Legende', 'Zaehlwerk', 'Saeulen', 'ZielLinie', 'Balken', 'Punkteraster', 'Topf', 'LinienDiagramm']) {
    assert.match(kit, new RegExp(`export const ${name}: React\\.FC<`), `${name} fehlt`);
  }
});

test('Baukasten bleibt in der hellen Motion-Welt: Palette, heller Grund, nur Frame-Motion', () => {
  const palette = ['#F9E9CB', '#FFFFFF', '#202A25', '#68746D', '#B9C4BC', '#4F8A67', '#C9615B', '#D87959', '#5E84AE', '#C5A050', '#DDE4DE'];
  for (const match of kit.matchAll(/#[0-9A-Fa-f]{6}\b/g)) assert.ok(palette.includes(match[0].toUpperCase()), `${match[0]} gehört nicht zur Palette`);
  assert.match(kit, /backgroundColor: DATEN\.grund/);
  assert.match(kit, /grund: '#F9E9CB'/);
  assert.doesNotMatch(kit, /#000000/);
  assert.match(kit, /fontFamily: FONT\.body/);
  assert.doesNotMatch(kit, /Math\.(?:random|sin|cos)\s*\(|\btransition\s*:|\banimation\s*:/);
});

test('Größen folgen aus den Werten: 3 Monate sind dreimal so hoch wie 1 Monat', () => {
  const px = skala(9000, 900);
  assert.equal(px(4500), 3 * px(1500));
  assert.equal(px(0), 0);
  assert.equal(skala(0, 500)(100), 0);
});

test('Runde Achsen enthalten den Höchstwert', () => {
  assert.deepEqual(schoeneSkala(10000), {max: 10000, schritt: 2500, striche: [0, 2500, 5000, 7500, 10000]});
  assert.equal(schoeneSkala(119.88).max, 150);
  for (const wert of [7, 83, 640, 1234, 98765]) {
    const {max, striche} = schoeneSkala(wert);
    assert.ok(max >= wert && striche.length >= 3 && striche.length <= 7, `${wert}: ${max} / ${striche.length}`);
  }
});

test('Eurotexte im deutschen Format', () => {
  assert.equal(euroText(119.88, 2), '119,88 €');
  assert.equal(euroText(3000), '3.000 €');
  assert.equal(euroText(-800), '−800 €');
  assert.equal(euroText(250, 0, true), '+250 €');
});

test('Zählwerk steht exakt auf dem Wert — auch mit Cent und führender Null', () => {
  assert.equal(ziffern(11988, 3), '11988');
  assert.equal(ziffern(99, 3), '099');
  assert.equal(ziffern(2200), '2200');
  // Zwischen zwei Werten rollt nur die letzte Stelle.
  const rollend = zaehlStellen(2199.9);
  assert.ok(rollend.some((s) => s.position % 1 !== 0));
});

test('Stationen landen exakt auf ihrem Wert und halten ihn', () => {
  const stationen = [{ab: 30, wert: 9.99}, {ab: 60, wert: 19.98}];
  assert.equal(wertBeiStationen(0, stationen), 0);
  assert.equal(wertBeiStationen(55, stationen, 0, 24), 9.99);
  assert.equal(wertBeiStationen(200, stationen, 0, 24), 19.98);
  const mitte = wertBeiStationen(42, stationen, 0, 24);
  assert.ok(mitte > 0 && mitte < 9.99);
});
