import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error -- plain ESM module without types
import {pruefeYouTubeQualitaet, schaetzeHaltezeiten} from '../scripts/lib/youtube-quality.mjs';

const woerter = (n: number, wort = 'wort') => Array.from({length: n}, () => wort).join(' ');

// 154 Wörter/Minute → 20 Wörter ≈ 7,8 s, 30 Wörter ≈ 11,7 s.
const skript = [
  'Hook beginnt hier', woerter(17),
  'Kapitel eins startet', woerter(27),
  'Bild drei', woerter(17), 'Schreib mir in die Kommentare welcher Trick', woerter(17),
  'Schluss kommt', woerter(20),
].join(' ');

const index = (extra: Record<string, unknown> = {}) => ({
  thumbnail: {googleFlowFileName: 'YouTube Thumbnail - Test.png'},
  imageWorld: {},
  visuals: [
    {id: 'visual-01', type: 'image', chapter: 'Hook', startCue: 'Hook beginnt hier'},
    {id: 'visual-02', type: 'image', chapter: 'Kapitel 1', startCue: 'Kapitel eins startet'},
    {id: 'visual-03', type: 'image', chapter: 'Kapitel 1', startCue: 'Bild drei'},
    {id: 'visual-04', type: 'animation', chapter: 'Fazit', startCue: 'Schluss kommt'},
  ],
  ...extra,
});

test('Haltezeit wird aus dem Skript geschätzt und durch Akzente geteilt', () => {
  const {ergebnis} = schaetzeHaltezeiten(skript, index().visuals);
  assert.ok(ergebnis[1].laengsteHaltung > 11);
  const mitAkzent = index().visuals.map((v) => (v.id === 'visual-02' ? {...v, akzente: [{cue: 'marke'}]} : v));
  const geteilt = schaetzeHaltezeiten(skript.replace(`startet ${woerter(14)}`, `startet ${woerter(14)} marke`), mitAkzent);
  assert.ok(geteilt.ergebnis[1].laengsteHaltung < ergebnis[1].laengsteHaltung);
});

test('Zu lange Standbilder, langer Hook und fehlende Kommentarfrage werden gemeldet', () => {
  const {fehler} = pruefeYouTubeQualitaet({index: index(), scriptText: skript, prompts: '', bildprompt: () => ''});
  assert.ok(fehler.some((f: string) => f.startsWith('visual-02: Standbild steht')));
  assert.ok(!fehler.some((f: string) => f.startsWith('visual-01: Standbild')));
  assert.ok(!fehler.some((f: string) => f.startsWith('visual-04')), 'Animationen haben kein Standbild-Limit');
  assert.ok(!fehler.some((f: string) => f.startsWith('Hook')), '20 Wörter Hook ≈ 8 s ist erlaubt');
  assert.ok(!fehler.some((f: string) => f.includes('Kommentarfrage')), 'Kommentarfrage steht in der Mitte');

  const ohneCta = skript.replace('Schreib mir in die Kommentare welcher Trick', 'Und weiter geht es jetzt');
  const zweiter = pruefeYouTubeQualitaet({index: index(), scriptText: ohneCta, prompts: '', bildprompt: () => ''});
  assert.ok(zweiter.fehler.some((f: string) => f.includes('keine Kommentarfrage')));

  const langerHook = skript.replace('Hook beginnt hier', `Hook beginnt hier ${woerter(40)}`);
  const dritter = pruefeYouTubeQualitaet({index: index(), scriptText: langerHook, prompts: '', bildprompt: () => ''});
  assert.ok(dritter.fehler.some((f: string) => f.startsWith('Hook dauert')));
});

test('Stilvorlage: Batch 1 nur Thumbnail und Thumbnail an jedem Bild', () => {
  const idx = index({imageWorld: {styleMaster: 'thumbnail'}});
  const gut = pruefeYouTubeQualitaet({
    index: idx,
    scriptText: skript,
    prompts: 'BATCH 1 — START ALL TOGETHER: Thumbnail\n',
    bildprompt: () => 'STYLE_REFERENCE:\nYouTube Thumbnail - Test.png — attach',
  });
  assert.ok(!gut.fehler.some((f: string) => f.includes('Thumbnail')));
  const schlecht = pruefeYouTubeQualitaet({
    index: idx,
    scriptText: skript,
    prompts: 'BATCH 1 — START ALL TOGETHER: Thumbnail, Bild 01\n',
    bildprompt: () => 'REFERENCE_IMAGE:\nNONE',
  });
  assert.ok(schlecht.fehler.some((f: string) => f.startsWith('Batch 1 muss allein')));
  assert.ok(schlecht.fehler.some((f: string) => f.startsWith('visual-01: Bildprompt hängt')));
});
