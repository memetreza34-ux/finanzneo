import assert from 'node:assert/strict';
import {rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const validate = (target: string) => spawnSync(process.execPath, [resolve('scripts/validate-youtube.mjs'), target], {encoding:'utf8'});

test('youtube:validate erkennt eine PHASENSTATUS.md, die eine falsche Zahl an Flow-Bildern nennt', () => {
  const target = `youtube/.tmp-phase-status-${process.pid}-${Date.now()}`;
  const status = resolve(target, '06-projektdateien/PHASENSTATUS.md');
  try {
    const run = spawnSync(process.execPath, [
      resolve('scripts/create-finanzneo-youtube.mjs'),
      '--target', target,
      '--title', 'Phasenstatus Test',
      '--types', 'image,hybrid,animation,data',
    ], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);

    writeFileSync(status, '# Phasenstatus\n\n- Phase 2: wartet auf Thumbnail, fünf Flow-Bilder und ein finales Voiceover\n');
    const stale = validate(target);
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /PHASENSTATUS\.md nennt „fünf Flow-Bilder“, 04-visuals\/visual-index\.json plant aber 2 Flow-Szenenbild/);

    writeFileSync(status, '# Phasenstatus\n\n- Phase 2: wartet auf Thumbnail, zwei Flow-Bilder und ein finales Voiceover\n');
    // Ein frisches Gerüst hat noch Motion-Platzhalter; hier zählt nur, dass der Status nicht mehr widerspricht.
    const synced = validate(target);
    assert.doesNotMatch(synced.stderr, /PHASENSTATUS/);
  } finally {
    rmSync(resolve(target), {recursive:true, force:true});
  }
});
