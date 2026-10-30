import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error -- plain ESM module without types
import {pruefeYouTubeQualitaet} from '../scripts/lib/youtube-quality.mjs';
// @ts-expect-error -- plain ESM module without types
import {berechneBelegTeile, pruefeBelegAufnahme, pruefeBelegPlan, youtubeBelegSoll} from '../scripts/lib/youtube-beleg.mjs';

const woerter = (n: number, wort = 'wort') => Array.from({length: n}, () => wort).join(' ');

const beleg = (patch: Record<string, unknown> = {}) => ({
  id: 'visual-02',
  type: 'beleg',
  quelle: 'Deutscher Bundestag',
  quellenArt: 'behoerde',
  url: 'https://www.bundestag.de/dokumente/textarchiv/2026/kw12-pa-finanzen-1152002',
  markierungen: [{text: 'Kostendeckel von 1,5 Prozent', cue: 'eineinhalb'}],
  ...patch,
});

test('Beleg-Plan: Quelle, Quellenart, https-URL und 1–3 Markierungen mit Wortlaut und Cue', () => {
  assert.deepEqual(pruefeBelegPlan(beleg()), []);
  assert.ok(pruefeBelegPlan(beleg({url: 'http://example.de'})).some((f: string) => f.includes('https')));
  assert.ok(pruefeBelegPlan(beleg({quellenArt: 'blog'})).some((f: string) => f.includes('quellenArt')));
  assert.ok(pruefeBelegPlan(beleg({quelle: '[QUELLE]'})).some((f: string) => f.includes('quelle fehlt')));
  assert.ok(pruefeBelegPlan(beleg({markierungen: []})).some((f: string) => f.includes('markierungen[] fehlt')));
  assert.ok(pruefeBelegPlan(beleg({markierungen: [{text: 'a', cue: 'a'}, {text: 'b', cue: 'b'}, {text: 'c', cue: 'c'}, {text: 'd', cue: 'd'}]})).some((f: string) => f.includes('höchstens 3')));
  assert.ok(pruefeBelegPlan(beleg({markierungen: [{text: 'Kostendeckel'}]})).some((f: string) => f.includes('cue fehlt')));
});

test('Beleg-Aufnahme: jede geplante Markierung muss auf der Seite gefunden sein; Presse nur kurzer Auszug', () => {
  const daten = {
    standard: 'finanzneo-youtube-beleg-v1',
    url: beleg().url,
    teile: [{art: 'text', x: 100, y: 1000, w: 700, h: 240}],
    markierungen: [{text: 'Kostendeckel von 1,5 Prozent', rects: [{x: 212, y: 1176, w: 207, h: 22}]}],
    auszugZeichen: 640,
  };
  assert.deepEqual(pruefeBelegAufnahme(beleg(), daten), []);
  assert.ok(pruefeBelegAufnahme(beleg(), null)[0].includes('youtube:belege'));
  assert.ok(pruefeBelegAufnahme(beleg(), {...daten, markierungen: [{text: 'Kostendeckel von 1,5 Prozent', rects: []}]}).some((f: string) => f.includes('nicht belegt')));
  assert.ok(pruefeBelegAufnahme(beleg(), {...daten, url: 'https://andere.de/'}).some((f: string) => f.includes('erneut')));
  assert.ok(pruefeBelegAufnahme(beleg({quellenArt: 'presse'}), {...daten, auszugZeichen: 1500}).some((f: string) => f.includes('Presse-Ausschnitt')));
});

test('Beleg-Ausschnitte: Kopf mit Logo, Titel und Textblock; große Lücken (Video) fallen weg', () => {
  const teile = berechneBelegTeile({
    kopf: {x: 0, y: 0, w: 1440, h: 135},
    titel: {x: 135, y: 436, w: 682, h: 86},
    bloecke: [{x: 135, y: 1044, w: 683, h: 208}],
  });
  assert.deepEqual(teile.map((t: {art: string}) => t.art), ['kopf', 'titel', 'text']);
  assert.ok(teile.every((t: {w: number}) => t.w === teile[0].w));
  assert.equal(teile[2].y, 1024);
  // Titel direkt über dem Text: ein zusammenhängender Ausschnitt.
  const nah = berechneBelegTeile({kopf: null, titel: {x: 135, y: 900, w: 682, h: 86}, bloecke: [{x: 135, y: 1044, w: 683, h: 208}]});
  assert.equal(nah.length, 1);
  assert.equal(nah[0].art, 'text');
});

test('Qualitätsregel V3: genug Belege, der erste früh, Markierungs-Cue im eigenen Abschnitt', () => {
  assert.equal(youtubeBelegSoll(120), 3);
  assert.equal(youtubeBelegSoll(600), 6);
  const skript = [
    'Jonas spart jeden Monat', woerter(7),
    'Der Bundestag hat das Gesetz beschlossen', woerter(7),
    'Geplant waren sogar eineinhalb Prozent', woerter(7),
    'Schreib es mir in die Kommentare', woerter(7),
    'Das Finanzamt prüft die Steuer', woerter(7),
    'Am Ende zählt der Vergleich', woerter(7),
  ].join(' ');
  const visuals = [
    {id: 'visual-01', type: 'image', chapter: 'Hook', startCue: 'Jonas spart', keyword: 'Monat', expectedVisual: 'Jonas', objectLabels: ['Sparschwein']},
    {...beleg({id: 'visual-02', markierungen: [{text: 'beschlossen', cue: 'Gesetz'}]}), chapter: 'Was ist das', startCue: 'Der Bundestag hat'},
    {...beleg({id: 'visual-03'}), chapter: 'Kosten', startCue: 'Geplant waren'},
    {id: 'visual-04', type: 'image', chapter: 'Kosten', startCue: 'Schreib es mir', keyword: 'Kommentare', expectedVisual: 'Sprechblase', objectLabels: ['Sprechblase']},
    {...beleg({id: 'visual-05', markierungen: [{text: 'Günstigerprüfung', cue: 'Finanzamt'}]}), chapter: 'Steuer', startCue: 'Das Finanzamt prüft'},
    {id: 'visual-06', type: 'folie', chapter: 'Fazit', startCue: 'Am Ende zählt', folie: {zeilen: [{text: 'Anbieter vergleichen', cue: 'Vergleich'}]}},
  ];
  const index = (vs: unknown[]) => ({qualityRules: 'finanzneo-youtube-quality-v3', story: {protagonist: 'Jonas', reason: 'x'}, thumbnail: {googleFlowFileName: 'T.png'}, imageWorld: {}, visuals: vs});
  const pruefe = (vs: unknown[]) => (pruefeYouTubeQualitaet({index: index(vs), scriptText: skript, prompts: '', bildprompt: () => ''}).fehler as string[]).filter((f) => !f.includes('Kommentarfrage'));

  assert.deepEqual(pruefe(visuals), []);
  const zuWenig = visuals.map((v) => (v.id === 'visual-05' ? {...v, type: 'folie', folie: {zeilen: [{text: 'Steuer', cue: 'Finanzamt'}]}} : v));
  assert.ok(pruefe(zuWenig).some((f) => f.startsWith('Nur 2 Beleg-Szene(n)')));
  const spaet = visuals.map((v) => (v.id === 'visual-02' ? {...v, type: 'folie', folie: {zeilen: [{text: 'Gesetz', cue: 'Gesetz'}]}} : v));
  assert.ok(pruefe(spaet).some((f) => f.startsWith('Erster Beleg kommt erst nach Kapitel')));
  const falscherCue = visuals.map((v) => (v.id === 'visual-03' ? {...v, markierungen: [{text: 'x', cue: 'Finanzamt'}]} : v));
  assert.ok(pruefe(falscherCue).some((f) => f.startsWith('visual-03: Markierungs-cue „Finanzamt“')));
  // V2-Projekte verlangen keine Belege.
  assert.equal((pruefeYouTubeQualitaet({index: {...index(zuWenig), qualityRules: 'finanzneo-youtube-quality-v2'}, scriptText: skript, prompts: '', bildprompt: () => ''}).fehler as string[]).some((f) => f.includes('Beleg')), false);
});
