import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error -- plain ESM module without types
import {pruefeYouTubeQualitaet} from '../scripts/lib/youtube-quality.mjs';
// @ts-expect-error -- plain ESM module without types
import {folieCues, folieIcons, folieSticker, folieText, pruefeFoliePlan} from '../scripts/lib/youtube-folie.mjs';
// @ts-expect-error -- plain ESM module without types
import {YOUTUBE_STICKER_STIL, youtubeStickerFlowDatei} from '../scripts/lib/youtube-sticker.mjs';
// @ts-expect-error -- plain ESM module without types
import {YOUTUBE_ICONS, youtubeIconDatei} from '../scripts/lib/youtube-icons.mjs';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
// @ts-expect-error -- plain ESM module without types
import {coverHtml, pruefeCover} from '../scripts/lib/youtube-cover.mjs';

const woerter = (n: number, wort = 'wort') => Array.from({length: n}, () => wort).join(' ');

test('Folie: Liste mit Cue je Zeile oder eine große Zahl, kurz und mit betontem Teil aus dem Text', () => {
  const ok = {id: 'visual-03', folie: {titel: 'Staatliche Förderung', zeilen: [{text: 'Erste 360 € → 50 % Zulage', cue: 'ersten', betont: '50 %'}]}};
  assert.deepEqual(pruefeFoliePlan(ok), []);
  assert.deepEqual(pruefeFoliePlan({id: 'v', folie: {zahl: {wert: '540 €', label: 'Zulage pro Jahr', cue: 'fünfhundertvierzig'}}}), []);
  assert.ok(pruefeFoliePlan({id: 'v'})[0].includes('folie fehlt'));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {zeilen: [{text: 'x'.repeat(60), cue: 'a'}]}}).some((f: string) => f.includes('kürzen')));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {zeilen: [{text: 'Erste 360 €', cue: 'a', betont: '50 %'}]}}).some((f: string) => f.includes('betont')));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {zeilen: [{text: 'a'}]}}).some((f: string) => f.includes('cue fehlt')));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {zeilen: Array.from({length: 6}, () => ({text: 'a', cue: 'a'}))}}).some((f: string) => f.includes('1–5')));
  assert.deepEqual(folieCues({zeilen: [{text: 'a', cue: 'eins'}, {text: 'b', cue: 'zwei'}]}), ['eins', 'zwei']);
});

test('Folie V2: Icon-Formen begriff, ablauf, vergleich; Icons nur aus dem Katalog, genau eine Form', () => {
  const begriff = {icon: 'behoerde', begriff: {text: 'Staatlich gefördertes Depot', cue: 'gefördert', betont: 'gefördertes'}};
  const ablauf = {ablauf: {von: {icon: 'chart_hoch', text: 'Ansparphase', cue: 'sparst'}, nach: {icon: 'seniorin', text: 'Rente', cue: 'Rente'}, punkte: [{text: 'Förderung', cue: 'Förderung'}]}};
  const vergleich = {vergleich: [{icon: 'computer', oben: 'Selbstverwaltetes', text: 'Depot', cue: 'selbst'}, {icon: 'bank', oben: 'Standard-', text: 'Depot', hinweis: 'max. 1 % Kosten', cue: 'Standard'}]};
  for (const folie of [begriff, ablauf, vergleich, {icon: 'geldsack', zahl: {wert: '+300 €', label: 'pro Kind', cue: 'Kind', ton: 'gruen'}}]) {
    assert.deepEqual(pruefeFoliePlan({id: 'v', folie}), []);
  }
  assert.deepEqual(folieCues(ablauf), ['sparst', 'Rente', 'Förderung']);
  assert.deepEqual(folieIcons(vergleich), ['computer', 'bank']);
  assert.ok(folieText(begriff).includes('Staatlich'));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {...begriff, icon: 'sparschwein'}}).some((f: string) => f.includes('nicht im Icon-Katalog')));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {begriff: begriff.begriff}}).some((f: string) => f.includes('Pflicht')));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {...begriff, ...vergleich}}).some((f: string) => f.includes('genau eine Form')));
  assert.ok(pruefeFoliePlan({id: 'v', folie: {vergleich: vergleich.vergleich.slice(0, 1)}}).some((f: string) => f.includes('2–3')));
  // Metapher-Sticker: Motiv nur Pflicht, solange der Sticker nicht in der Bibliothek liegt.
  const metapher = {metapher: {sticker: 'gluehbirne-idee', cue: 'Idee', text: 'Die ersten 100.000 € sind die schwersten', betont: '100.000 €'}};
  assert.deepEqual(pruefeFoliePlan({id: 'v', folie: metapher}, {stickerVorhanden: () => true}), []);
  assert.ok(pruefeFoliePlan({id: 'v', folie: metapher}, {stickerVorhanden: () => false}).some((f: string) => f.includes('motiv')));
  assert.deepEqual(pruefeFoliePlan({id: 'v', folie: {metapher: {...metapher.metapher, motiv: 'a glowing light bulb with rays'}}}, {stickerVorhanden: () => false}), []);
  assert.ok(pruefeFoliePlan({id: 'v', folie: {metapher: {...metapher.metapher, sticker: 'Glühbirne'}}}).some((f: string) => f.includes('kleinbuchstaben')));
  const wolke = {wolke: {sticker: 'motor', woerter: ['Kosten', 'Inflation', 'Rendite'].map((text) => ({text, cue: text}))}};
  assert.deepEqual(pruefeFoliePlan({id: 'v', folie: wolke}), []);
  assert.ok(pruefeFoliePlan({id: 'v', folie: {wolke: {...wolke.wolke, woerter: wolke.wolke.woerter.slice(0, 2)}}}).some((f: string) => f.includes('3–6')));
  assert.deepEqual(folieCues(wolke), ['Kosten', 'Inflation', 'Rendite']);
  assert.deepEqual(folieSticker({...metapher}).map((s: {name: string}) => s.name), ['gluehbirne-idee']);
  assert.deepEqual(pruefeFoliePlan({id: 'v', folie: {zitat: {text: 'Die ersten 100.000 € sind hart.', von: 'Charlie Munger', cue: 'Munger', betont: 'hart'}}}), []);
  assert.equal(youtubeStickerFlowDatei('motor'), 'YouTube Sticker - motor.png');
  assert.ok(YOUTUBE_STICKER_STIL.includes('pure flat white background'));
  // Jedes Katalog-Icon liegt als PNG im Repo.
  for (const name of Object.keys(YOUTUBE_ICONS)) assert.ok(existsSync(resolve(import.meta.dirname, '..', 'public', youtubeIconDatei(name))), `Icon ${name} fehlt`);
});

test('Cover V1: höchstens 5 Wörter, kurze Zeilen, Marker aus dem Text; HTML enthält den exakten Text', () => {
  assert.deepEqual(pruefeCover({zeilen: ['Kostet Jonas', '40.000 €'], marker: '40.000 €', ton: 'rot'}), []);
  assert.ok(pruefeCover(undefined)[0].includes('thumbnail.cover fehlt'));
  assert.ok(pruefeCover({zeilen: ['Das ist viel zu viel Text', 'hier'], marker: 'Text'}).some((f: string) => f.includes('Wörter') || f.includes('Zeichen')));
  assert.ok(pruefeCover({zeilen: ['Kostet Jonas'], marker: '40.000 €'}).some((f: string) => f.includes('marker')));
  assert.ok(pruefeCover({zeilen: ['A', 'B', 'C'], marker: 'A'}).some((f: string) => f.includes('eine oder zwei')));
  const html = coverHtml({bildUrl: 'file:///x.png', zeilen: ['Kostet Jonas', '40.000 €'], marker: '40.000 €'});
  assert.ok(html.includes('<span class="marker">40.000 €</span>'));
  assert.ok(html.includes('Kostet Jonas'));
});

test('V3 Bildmix: gezeichnete Bilder höchstens 40 % der Sprechzeit, Standbild höchstens 6 s', () => {
  const skript = ['Eins beginnt', woerter(12), 'Zwei beginnt', woerter(12), 'Drei beginnt', woerter(12), 'Vier beginnt', woerter(12)].join(' ');
  const bild = (id: string, cue: string) => ({id, type: 'image', chapter: 'K', startCue: cue});
  const folie = (id: string, cue: string) => ({id, type: 'folie', chapter: 'K', startCue: cue, folie: {zeilen: [{text: 'x', cue}]}});
  const pruefe = (visuals: unknown[], text = skript) => (pruefeYouTubeQualitaet({index: {qualityRules: 'finanzneo-youtube-quality-v3', thumbnail: {}, imageWorld: {}, visuals}, scriptText: text, prompts: '', bildprompt: () => ''}).fehler as string[]);

  assert.ok(pruefe([bild('visual-01', 'Eins beginnt'), bild('visual-02', 'Zwei beginnt'), folie('visual-03', 'Drei beginnt'), folie('visual-04', 'Vier beginnt')]).some((f) => f.startsWith('Gezeichnete Bilder tragen 50 %')));
  assert.equal(pruefe([bild('visual-01', 'Eins beginnt'), folie('visual-02', 'Zwei beginnt'), folie('visual-03', 'Drei beginnt'), folie('visual-04', 'Vier beginnt')]).some((f) => f.startsWith('Gezeichnete Bilder')), false);
  // 14 Wörter ≈ 5,9 s geht, 20 Wörter ≈ 8,5 s ist unter V3 zu lang (unter V2 noch erlaubt bis 8 s nicht).
  const lang = ['Eins beginnt', woerter(18), 'Zwei beginnt', woerter(4)].join(' ');
  assert.ok(pruefe([folie('visual-01', 'Eins beginnt'), folie('visual-02', 'Zwei beginnt')], lang).some((f) => f.startsWith('visual-01: Standbild steht geschätzt') && f.includes('max. 6 s')));
});
