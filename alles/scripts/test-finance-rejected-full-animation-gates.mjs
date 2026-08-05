import {spawnSync} from 'node:child_process';
import process from 'node:process';

const run = (scriptPath) => spawnSync(process.execPath, [scriptPath], {
  cwd: process.cwd(),
  encoding: 'utf8',
});

const storyboard = run('scripts/verify-finance-narrative-plan.mjs');
const approval = run('scripts/verify-finance-full-animation-approval.mjs');
const failures = [];

if (storyboard.status === 0) {
  failures.push('Der abgelehnte Storyboard-Plan wurde unerwartet akzeptiert.');
}
if (!`${storyboard.stdout}\n${storyboard.stderr}`.includes('Narrative storyboard rejected')) {
  failures.push('Der Storyboard-Blocker liefert keine klare Ablehnungsdiagnose.');
}
if (approval.status === 0) {
  failures.push('Der abgelehnte Render wurde unerwartet freigegeben.');
}
if (!`${approval.stdout}\n${approval.stderr}`.includes('Full-animation reel approval blocked')) {
  failures.push('Der Freigabe-Blocker liefert keine klare Ablehnungsdiagnose.');
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`Rejected reel gate test failed: ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Rejected reel gate test passed.');
  console.log('Confirmed that the current storyboard and render cannot pass final validation.');
}
