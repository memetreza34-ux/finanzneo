import {execFileSync} from 'node:child_process';
import {test} from 'node:test';

const reel = 'reels/2026-09-07_bis_2026-09-13/samstag/reel-01_was-3-prozent-inflation-mit-100-euro';

test('neues Inflation-Reel erfüllt den vollständigen Phase-1-Reel-Vertrag', () => {
  execFileSync(process.execPath, ['scripts/validate-reel.mjs', reel], {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  });
});
