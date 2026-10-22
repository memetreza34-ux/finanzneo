import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import test from 'node:test';

const apply = resolve('scripts/apply-future-cover-hook-v3.mjs');
const validate = resolve('scripts/validate-future-cover-hook-v3.mjs');

const makeReel = () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-cover-frame0-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(dirname(path), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  write('03-szenen/scene-index.json', JSON.stringify({
    title: 'Wie groß sollte dein Notgroschen sein?',
    transitionContract: {imageEnterFrames: 4},
    scenes: [{
      id: 'scene-01',
      type: 'image',
      planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt',
    }],
  }, null, 2));
  write('03-szenen/00-cover/cover.txt', '# Cover\n');
  write('03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt', '# Bildprompt\n');
  write('05-projektdateien/technische-hinweise.md', '# Technische Hinweise\n');

  return root;
};

test('Cover Hook V3 setzt Hero-Bild ab Frame 0 ohne Bild-Fade-in', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [apply, root], {stdio: 'pipe'});
    execFileSync(process.execPath, [validate, root], {stdio: 'pipe'});

    const index = JSON.parse(readFileSync(join(root, '03-szenen/scene-index.json'), 'utf8'));
    assert.equal(index.coverHookContract.heroImageVisibleFromFrame, 0);
    assert.equal(index.coverHookContract.heroImageInitialOpacity, 1);
    assert.equal(index.coverHookContract.coverImageFadeInForbidden, true);
    assert.equal(index.coverHookContract.blackLeadInForbidden, true);
    assert.equal(index.cover.imageEntranceTransition, 'none');
    assert.equal(index.transitionContract.scene01ImageEnterFrames, 0);
    assert.equal(index.scenes[0].imageVisibleFromFrame, 0);
    assert.equal(index.scenes[0].imageInitialOpacity, 1);
    assert.equal(index.scenes[0].imageEnterMode, 'none');
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Cover Hook V3 blockiert eine nachträglich aktivierte Cover-Einblendung', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [apply, root], {stdio: 'pipe'});
    const indexPath = join(root, '03-szenen/scene-index.json');
    const index = JSON.parse(readFileSync(indexPath, 'utf8'));
    index.scenes[0].imageInitialOpacity = 0;
    index.scenes[0].imageEnterMode = 'fade';
    index.transitionContract.scene01ImageEnterFrames = 4;
    writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');

    const result = spawnSync(process.execPath, [validate, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Frame 0|opacity 1|Image-Fade-in|imageEnterMode/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
