#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const [script, reelDir, ...rest] = process.argv.slice(2);
if (!script || !reelDir) {
  console.error('Nutzung: node scripts/run-finance-with-folder-check.mjs <script> <reel-ordner> [...args]');
  process.exit(1);
}

const root = process.cwd();
const run = (target, args) => {
  const result = spawnSync(process.execPath, [target, ...args], {cwd: root, stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run('scripts/check-finance-project-folder.mjs', [reelDir]);
run(path.normalize(script), [reelDir, ...rest]);
