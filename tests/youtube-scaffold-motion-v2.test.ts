import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('YouTube-Scaffolder erzeugt Hybrid/Data/Motion ohne feste Quote', () => {
  const target = `youtube/.tmp-motion-v2-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = spawnSync(process.execPath, [
      resolve('scripts/scaffold-finanzneo-youtube.mjs'),
      '--target', target,
      '--title', 'Motion V2 Test',
      '--types', 'image,hybrid,animation,data',
    ], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-04/data-notes.md')), true);
    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.fixedVisualCount, false);
    assert.equal(index.fixedImageAnimationRatio, false);
    assert.equal(index.motionStandard.id, 'finanzneo-youtube-motion-v2');
    assert.deepEqual(index.visuals.map((visual: {type:string}) => visual.type), ['image','hybrid','animation','data']);
    const prompt = readFileSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt'), 'utf8');
    assert.match(prompt, /Literal first, creative second/);
    assert.match(prompt, /TRANSFERABILITY_TEST:/);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
