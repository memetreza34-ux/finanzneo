import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error -- plain ESM module without types
import {diagnose, eintragAusWerten, faelligeMesstage, offeneZahlen, parseDauer, pruefeEintrag, verbesserungsZeile} from '../scripts/lib/youtube-zahlen.mjs';

const basis = {tag: '7', impressionen: '2000', ctr: '4,1', aufrufe: '80', dauer: '3:00', halten30: '62'};

test('Zahlen: Dauer und deutsche Kommazahlen werden gelesen, Prozent angesehen aus der Videolänge berechnet', () => {
  assert.equal(parseDauer('2:10'), 130);
  assert.equal(parseDauer('1:02:05'), 3725);
  assert.ok(Number.isNaN(parseDauer('zwei')));
  const eintrag = eintragAusWerten(basis, 600);
  assert.equal(eintrag.ctr, 4.1);
  assert.equal(eintrag.durchschnittDauerSek, 180);
  assert.equal(eintrag.prozentAngesehen, 30);
  assert.equal(eintragAusWerten({...basis, prozent: '28'}, 600).prozentAngesehen, 28);
  assert.equal(eintragAusWerten(basis, null).prozentAngesehen, undefined);
});

test('Zahlen: Pflichtwerte und Prozentgrenzen werden geprüft', () => {
  assert.deepEqual(pruefeEintrag(eintragAusWerten(basis, 600)), []);
  assert.ok(pruefeEintrag(eintragAusWerten({...basis, ctr: undefined}, 600)).some((f: string) => f.includes('--ctr')));
  assert.ok(pruefeEintrag(eintragAusWerten({...basis, dauer: undefined}, 600)).some((f: string) => f.includes('--dauer')));
  assert.ok(pruefeEintrag(eintragAusWerten({...basis, halten30: '140'}, 600)).some((f: string) => f.includes('100')));
});

test('Zahlen: Engpass folgt dem Trichter Reichweite → Klickrate → Hook → Mitte', () => {
  const e = (werte: object) => eintragAusWerten({...basis, ...werte}, 600);
  assert.equal(diagnose(e({impressionen: '120', ctr: '1,0'})).engpass, 'Reichweite');
  assert.equal(diagnose(e({ctr: '1,5', halten30: '30'})).engpass, 'Klickrate');
  assert.equal(diagnose(e({halten30: '40'})).engpass, 'Hook');
  assert.equal(diagnose(e({dauer: '1:00'})).engpass, 'Mitte');
  assert.equal(diagnose(e({})).engpass, null);
  assert.ok(diagnose(e({impressionen: '120', suche: '5'})).hinweise.some((h: string) => h.includes('Suche')));
});

test('Zahlen: Messtage 7 und 28 werden fällig, erledigte nicht', () => {
  assert.deepEqual(faelligeMesstage(null, [], '2026-10-31'), []);
  assert.deepEqual(faelligeMesstage('2026-10-28', [], '2026-10-31'), []);
  assert.deepEqual(faelligeMesstage('2026-10-17', [], '2026-10-31'), [7]);
  assert.deepEqual(faelligeMesstage('2026-10-01', [{tag: 7}], '2026-10-31'), [28]);
  assert.ok(verbesserungsZeile('2026-10-31', 'x', eintragAusWerten({...basis, ctr: '1'}, 600)).includes('Engpass: Klickrate'));
});

test('Zahlen: offene Punkte nur für gerenderte Videos ohne Datum und für fällige Messtage', () => {
  assert.deepEqual(offeneZahlen([{video: 'a', veroeffentlicht: null, gerendert: false, faellig: []}]), []);
  assert.ok(offeneZahlen([{video: 'a', veroeffentlicht: null, gerendert: true, faellig: []}])[0].includes('Veröffentlichungsdatum'));
  assert.deepEqual(offeneZahlen([{video: 'b', veroeffentlicht: '2026-10-01', faellig: [7, 28]}]), ['b: Zahlen für Tag 7 fällig', 'b: Zahlen für Tag 28 fällig']);
});
