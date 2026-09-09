import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('YouTube-Scaffolder verlangt einen expliziten Beat-/Typplan', () => {
  const target = `youtube/.tmp-motion-v3-empty-${process.pid}-${Date.now()}`;
  const run = spawnSync(process.execPath, [
    resolve('scripts/scaffold-finanzneo-youtube.mjs'),
    '--target', target,
    '--title', 'Ohne Beatplan',
  ], {encoding:'utf8'});
  assert.notEqual(run.status, 0);
  assert.match(`${run.stderr}${run.stdout}`, /Keine Default-Szenenzahl|--types/);
});

test('YouTube-Scaffolder erzeugt Reel-artige Motion-V3-Struktur ohne feste Quote', () => {
  const target = `youtube/.tmp-motion-v3-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = spawnSync(process.execPath, [
      resolve('scripts/scaffold-finanzneo-youtube.mjs'),
      '--target', target,
      '--title', 'Motion V3 Test',
      '--types', 'image,hybrid,animation,data',
    ], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);

    for (const dir of ['01-script','02-audio','03-szenen','04-caption','05-projektdateien','06-export']) {
      assert.equal(existsSync(resolve(absolute, dir)), true, `${dir} fehlt`);
    }
    for (const old of ['01-recherche','02-script','03-audio','04-visuals','05-publishing','06-projektdateien']) {
      assert.equal(existsSync(resolve(absolute, old)), false, `${old} darf nicht mehr entstehen`);
    }

    assert.equal(existsSync(resolve(absolute, '03-szenen/szene-02/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(absolute, '03-szenen/szene-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(absolute, '03-szenen/szene-04/data-notes.md')), true);
    assert.equal(existsSync(resolve(absolute, '05-projektdateien/production-manifest.json')), true);
    assert.equal(existsSync(resolve(absolute, '05-projektdateien/timeline.json')), true);

    const index = JSON.parse(readFileSync(resolve(absolute, '05-projektdateien/scene-index.json'), 'utf8'));
    assert.equal(index.fixedVisualCount, false);
    assert.equal(index.fixedImageAnimationRatio, false);
    assert.equal(index.motionStandard.id, 'finanzneo-youtube-motion-v3');
    assert.equal(index.motionStandard.renderedFrameQaRequired, true);
    assert.equal(index.captions.required, true);
    assert.equal(index.timelineRules.wordTimestampDriven, true);
    assert.deepEqual(index.visuals.map((visual: {type:string}) => visual.type), ['image','hybrid','animation','data']);
    assert.deepEqual(index.visuals.map((visual: {id:string}) => visual.id), ['szene-01','szene-02','szene-03','szene-04']);

    const prompt = readFileSync(resolve(absolute, '03-szenen/szene-01/bildprompt.txt'), 'utf8');
    assert.match(prompt, /Literal first, creative second/);
    assert.match(prompt, /TRANSFERABILITY_TEST:/);
    const motion = readFileSync(resolve(absolute, '03-szenen/szene-02/animation.tsx'), 'utf8');
    assert.match(motion, /VIEWER_TEXT/);
    assert.match(motion, /MOTION_EVENTS/);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
