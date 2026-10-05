import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const project = 'youtube/2026-10-05_rabatt-kostet-trotzdem';
const run = (script: string) => spawnSync(process.execPath, [script, project], {encoding: 'utf8'});

test('Rabatt-V5-Projekt erfüllt YouTube-, Layout- und Visual-Freedom-Verträge', () => {
  for (const script of [
    'scripts/validate-youtube.mjs',
    'scripts/validate-youtube-layout.mjs',
    'scripts/validate-youtube-visual-freedom.mjs',
    'scripts/validate-youtube-animation-quality.mjs',
  ]) {
    const result = run(script);
    assert.equal(result.status, 0, `${script} failed:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
});

test('Rabatt-V5-Projekt bleibt meaning-first und rendert keine Captions', () => {
  const index = JSON.parse(readFileSync(`${project}/04-visuals/visual-index.json`, 'utf8'));
  const layout = JSON.parse(readFileSync(`${project}/06-projektdateien/layout.json`, 'utf8'));
  const timings = JSON.parse(readFileSync(`${project}/03-audio/word-timings.json`, 'utf8'));
  const master = readFileSync(`${project}/04-visuals/alle-bildprompts.txt`, 'utf8');

  assert.equal(index.imageWorld.visualDecisionPolicy, 'meaning-first-free-visual-v2');
  assert.equal(index.imageWorld.sceneFirst, false);
  assert.equal(index.imageWorld.peopleRequired, false);
  assert.equal(index.imageWorld.placeRequired, false);
  assert.equal(index.imageWorld.semanticObjectCompositionsAllowed, true);
  assert.equal(index.imageWorld.visualMetaphorsAllowed, true);
  assert.equal(layout.captions.burnedIn, false);
  assert.equal(timings.renderCaptions, false);
  assert.equal(timings.subtitleMode, 'external-srt-only');
  assert.match(master, /BEDEUTUNG ZUERST — FORM FREI/);
  assert.match(master, /kein scene-first/i);
});
