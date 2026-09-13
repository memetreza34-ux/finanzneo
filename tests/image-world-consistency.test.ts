import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const ROOT = resolve('experiments/image-world-consistency-v1');
const PROMPTS = [
  'prompts/01-notgroschen-waschmaschine.txt',
  'prompts/02-inflation-einkauf.txt',
  'prompts/03-kredit-zins-tilgung.txt',
  'prompts/04-versicherung-wasserschaden.txt',
  'prompts/05-etf-diversifikation.txt',
];

const START = 'BEGIN_FINANZNEO_SHARED_STYLE_LOCK_V1';
const END = 'END_FINANZNEO_SHARED_STYLE_LOCK_V1';

const read = (path: string) => readFileSync(resolve(ROOT, path), 'utf8').replace(/\r\n/g, '\n').trim();

const extractStyleLock = (source: string) => {
  const start = source.indexOf(START);
  const end = source.indexOf(END);
  assert.notEqual(start, -1, `Shared style lock start marker fehlt.`);
  assert.notEqual(end, -1, `Shared style lock end marker fehlt.`);
  assert.ok(end > start, 'Shared style lock marker order ist ungültig.');
  return source.slice(start, end + END.length).trim();
};

test('all five image-world prompts contain the exact same frozen style lock', () => {
  const canonical = read('shared-style-lock-v1.txt');
  for (const prompt of PROMPTS) {
    const source = read(prompt);
    assert.equal(
      extractStyleLock(source),
      canonical,
      `${prompt}: gemeinsamer FinanzNeo-Stilblock weicht vom kanonischen Lock ab.`,
    );
  }
});

test('all prompts keep unique scene-specific content before the shared lock', () => {
  const sceneSections = PROMPTS.map((prompt) => {
    const source = read(prompt);
    assert.ok(source.startsWith('SCENE_SPECIFIC_CONTENT\n'), `${prompt}: SCENE_SPECIFIC_CONTENT fehlt.`);
    const specific = source.slice('SCENE_SPECIFIC_CONTENT\n'.length, source.indexOf(START)).trim();
    assert.ok(specific.length >= 300, `${prompt}: individuelle Szenenbeschreibung ist zu kurz.`);
    assert.doesNotMatch(specific, /TODO|TBD|PLACEHOLDER|EINFÜGEN/i, `${prompt}: Platzhalter gefunden.`);
    return specific;
  });

  assert.equal(new Set(sceneSections).size, PROMPTS.length, 'Szenenspezifische Teile müssen wirklich verschieden sein.');
});

test('test pack stays focused on five deliberately different finance situations', () => {
  const requiredSignals = [
    ['01-notgroschen-waschmaschine.txt', ['washing machine', 'Notgroschen', 'Reparatur 280 €']],
    ['02-inflation-einkauf.txt', ['grocery', '100 €', 'higher prices']],
    ['03-kredit-zins-tilgung.txt', ['Kredit', 'Zins', 'Tilgung']],
    ['04-versicherung-wasserschaden.txt', ['water damage', 'Hausrat', 'Schaden 1.200 €']],
    ['05-etf-diversifikation.txt', ['ETF', 'industry', 'healthcare']],
  ] as const;

  for (const [file, signals] of requiredSignals) {
    const source = read(`prompts/${file}`);
    for (const signal of signals) {
      assert.ok(source.includes(signal), `${file}: erwartetes Motivsignal fehlt: ${signal}`);
    }
  }
});
