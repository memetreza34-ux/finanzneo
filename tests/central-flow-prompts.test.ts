import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const validator = resolve('scripts/validate-central-flow-prompts.mjs');

test('Reel-Erstellung verankert den zentralen 5er-Flow mit Cover-Auswahl dauerhaft', () => {
  const scaffold = readFileSync(resolve('scripts/scaffold-finanzneo-reel.mjs'), 'utf8');
  const createReel = readFileSync(resolve('scripts/create-finanzneo-reel.mjs'), 'utf8');
  const reelValidator = readFileSync(resolve('scripts/validate-reel.mjs'), 'utf8');
  const applyFlow = readFileSync(resolve('scripts/apply-flow-five-pack-reference-v1.mjs'), 'utf8');

  assert.match(scaffold, /write\('03-szenen\/alle-bildprompts\.txt'/);
  assert.match(createReel, /apply-flow-five-pack-reference-v1\.mjs/);
  assert.match(reelValidator, /validate-central-flow-prompts\.mjs/);
  assert.match(applyFlow, /COVER_VARIANT_COUNT = 3/);
  assert.match(applyFlow, /BLOCKGRÖSSE = 5/);
  assert.match(applyFlow, /STYLE-REFERENZ = GEWÄHLTES COVER/);
  assert.match(applyFlow, /MAX_CONCURRENT_GENERATIONS = 1/);
});

test('Zentrale Flow-Datei verlangt 3 Cover-Varianten, Nutzerwahl, Style-Referenz und 5er-Blöcke', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-central-flow-'));
  const scenesRoot = join(root, '03-szenen');
  const imageDir = join(scenesRoot, 'EINZELNE-SZENEN', 'scene-01');
  mkdirSync(imageDir, {recursive: true});

  const prompt = 'FLOW_AGENT_PROTOCOL: test\nIMAGE PROMPT:\nCreate one exact test image.';
  writeFileSync(join(imageDir, 'bildprompt.txt'), prompt, 'utf8');
  writeFileSync(join(scenesRoot, 'scene-index.json'), JSON.stringify({
    cover: {type: 'scene-image', sourceSceneId: 'scene-01', separateGenerationForbidden: true},
    scenes: [
      {id: 'scene-01', type: 'image', planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt'},
      {id: 'scene-02', type: 'animation'},
    ],
  }), 'utf8');
  writeFileSync(join(scenesRoot, 'alle-bildprompts.txt'), [
    'FINANZNEO — ZENTRALE GOOGLE-FLOW-PROMPTDATEI',
    'DIES IST KEIN BATCH-AUFTRAG',
    'BLOCKGRÖSSE = 5',
    'MAX_CONCURRENT_GENERATIONS = 1',
    'COVER_VARIANT_COUNT = 3',
    'COVER-AUSWAHL ERFORDERLICH = JA',
    'STYLE-REFERENZ = GEWÄHLTES COVER',
    'COVER-VARIANTE A',
    'COVER-VARIANTE B',
    'COVER-VARIANTE C',
    'STOPP. Nutzer entscheidet A, B oder C.',
    'Das gewählte Cover dient danach als Style-Referenz.',
    '5ER-BLOCK 1',
    prompt,
    'SZENE 02 – REMOTION-ANIMATION',
    'KEIN BILD 02 ERZEUGEN.',
  ].join('\n\n'), 'utf8');

  const pass = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
  assert.equal(pass.status, 0, `${pass.stdout}\n${pass.stderr}`);

  rmSync(join(scenesRoot, 'alle-bildprompts.txt'));
  const fail = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
  assert.notEqual(fail.status, 0);
  assert.match(fail.stderr, /alle-bildprompts\.txt fehlt/);

  rmSync(root, {recursive: true, force: true});
});
