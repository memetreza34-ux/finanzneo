import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error -- plain ESM module without types
import {pruefeYouTubeQualitaet, schaetzeHaltezeiten} from '../scripts/lib/youtube-quality.mjs';

const woerter = (n: number, wort = 'wort') => Array.from({length: n}, () => wort).join(' ');

// 142 Wörter/Minute (inkl. Pausen) → 18 Wörter ≈ 7,6 s, 30 Wörter ≈ 12,7 s.
const skript = [
  'Hook beginnt hier', woerter(15),
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
  assert.ok(!fehler.some((f: string) => f.startsWith('Hook')), '18 Wörter Hook ≈ 7,6 s ist erlaubt');
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

test('Nach Phase 3 zählen die echten Haltezeiten mit der 10-s-Grenze', () => {
  const echte = new Map([['visual-01', 6], ['visual-02', 9.5], ['visual-03', 10.4]]);
  const {fehler} = pruefeYouTubeQualitaet({index: index(), scriptText: skript, prompts: '', bildprompt: () => '', echteHaltezeiten: echte});
  assert.ok(!fehler.some((f: string) => f.startsWith('visual-02')), 'geschätzt zu lang, real 9,5 s → ok');
  assert.ok(fehler.some((f: string) => f.startsWith('visual-03: Standbild steht im fertigen Zeitplan')));
});

test('Platzhalterprüfung im Code: Datenfelder und Konstantenlisten sind kein Platzhalter', async () => {
  // @ts-expect-error -- plain ESM module without types
  const {__test} = await import('../scripts/lib/youtube-readiness.mjs');
  const code = "const R = [\n  {id: 'a', label: 'Fernseher', start: 0},\n];\nconst w = interpolate(f, [HOCH_AB, AKTION_AB], [NORMAL, HOCH]);";
  assert.equal(__test.hasCodePlaceholder(code), false);
  assert.equal(__test.hasPlaceholder(code), true, 'die Text-Prüfung würde fälschlich anschlagen');
  assert.equal(__test.hasCodePlaceholder("export const MECHANIC_ID = '[MECHANIC_ID]';"), true);
  assert.equal(__test.hasCodePlaceholder("START: '[START STATE]',"), true);
  assert.equal(__test.hasCodePlaceholder('{/* TODO: Phase 1 requires a real visual mechanism */}'), true);
});

test('V2: Hook ohne Ankündigung, Hauptfigur im Hook, keyword im Abschnitt, bridgeObject im Nachbarbild', () => {
  const skriptV2 = [
    'Lena steht im Laden vor einem Fernseher', woerter(6),
    'Kapitel eins startet mit dem Preisschild', woerter(5),
    'Jetzt rechnen wir die Raten zusammen', woerter(8),
    'Schreib mir in die Kommentare welcher Trick', woerter(6),
    'Am Ende zählt der Gesamtpreis', woerter(4),
  ].join(' ');
  const v2 = (patch: Record<string, unknown> = {}) => ({
    qualityRules: 'finanzneo-youtube-quality-v2',
    story: {protagonist: 'Lena', reason: 'Alltagsfigur'},
    thumbnail: {googleFlowFileName: 'T.png'},
    imageWorld: {},
    visuals: [
      {id: 'visual-01', type: 'image', chapter: 'Hook', startCue: 'Lena steht im Laden', keyword: 'Fernseher', expectedVisual: 'Lena vor Fernseher', objectLabels: ['Fernseher']},
      {id: 'visual-02', type: 'image', chapter: 'Kapitel 1', startCue: 'Kapitel eins startet', keyword: 'Preisschild', expectedVisual: 'Preisschild am Fernseher', objectLabels: ['Preisschild']},
      {id: 'visual-03', type: 'animation', chapter: 'Kapitel 1', startCue: 'Jetzt rechnen wir', bridgeObject: 'Preisschild'},
      {id: 'visual-04', type: 'image', chapter: 'Kapitel 1', startCue: 'Schreib mir in die Kommentare', keyword: 'Kommentare', expectedVisual: 'Sprechblase', objectLabels: ['Sprechblase']},
      {id: 'visual-05', type: 'image', chapter: 'Fazit', startCue: 'Am Ende zählt', keyword: 'Gesamtpreis', expectedVisual: 'Kassenbon Gesamt', objectLabels: ['Kassenbon']},
    ],
    ...patch,
  });
  const pruefe = (index: unknown, text = skriptV2) => pruefeYouTubeQualitaet({index, scriptText: text, prompts: '', bildprompt: () => ''}).fehler as string[];

  assert.deepEqual(pruefe(v2()).filter((f) => !f.includes('Kommentarfrage')), []);
  assert.ok(pruefe(v2(), skriptV2.replace('Lena steht im Laden vor einem Fernseher', 'In diesem Video zeige ich dir Lena Fernseher')).some((f) => f.startsWith('Hook kündigt an')));
  assert.ok(pruefe(v2({story: {protagonist: 'Max', reason: 'x'}})).some((f) => f.includes('„Max“ wird im Hook nicht genannt')));
  assert.ok(pruefe(v2({story: {}})).some((f) => f.startsWith('story.protagonist fehlt')));
  assert.equal(pruefe(v2({story: {protagonist: null, reason: 'Nachrichtenthema ohne Figur'}})).some((f) => f.startsWith('story')), false);

  const falsch = v2();
  (falsch.visuals[1] as Record<string, unknown>).keyword = 'Kreditkarte';
  (falsch.visuals[2] as Record<string, unknown>).bridgeObject = 'Waschmaschine';
  const f = pruefe(falsch);
  assert.ok(f.some((x) => x.startsWith('visual-02: keyword „Kreditkarte“ fällt nicht')));
  assert.ok(f.some((x) => x.startsWith('visual-03: bridgeObject „Waschmaschine“')));
});

test('V2: Bilder mit Hauptfigur hängen das Figur-Bild als CHARACTER_REFERENCE an', () => {
  const index = {
    qualityRules: 'finanzneo-youtube-quality-v2',
    story: {protagonist: 'Lena', reason: 'x', figurBild: 'Thumbnail'},
    thumbnail: {googleFlowFileName: 'T.png'},
    imageWorld: {},
    visuals: [
      {id: 'visual-01', type: 'image', chapter: 'Hook', startCue: 'Lena steht', keyword: 'Lena', figur: true},
      {id: 'visual-02', type: 'image', chapter: 'K1', startCue: 'Dann zahlt', keyword: 'zahlt', figur: true},
    ],
  };
  const text = `Lena steht im Laden ${woerter(5)} Dann zahlt sie ${woerter(4)} Kommentare ${woerter(3)}`;
  const fehler = pruefeYouTubeQualitaet({
    index,
    scriptText: text,
    prompts: '',
    bildprompt: (v: {id: string}) => (v.id === 'visual-01' ? 'CHARACTER_REFERENCE:\nT.png' : 'REFERENCE_IMAGE:\nNONE'),
  }).fehler as string[];
  assert.ok(fehler.some((f) => f.startsWith('visual-02: zeigt Lena, hängt aber das Figur-Bild nicht')));
  assert.ok(!fehler.some((f) => f.startsWith('visual-01: zeigt Lena')));
});
