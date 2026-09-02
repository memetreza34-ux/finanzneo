import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const baselinePath = path.join(repoRoot, 'config', 'reel-regression-baseline.json');
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

if (baseline.version !== 1 || !Array.isArray(baseline.protectedObjects)) {
  throw new Error('Invalid reel regression baseline format.');
}

const failures = [];

for (const object of baseline.protectedObjects) {
  if (!object.path || !object.sha || object.type !== 'tree') {
    failures.push(`${object.path ?? '<unknown>'}: invalid baseline entry`);
    continue;
  }

  let actualSha;
  try {
    actualSha = execFileSync('git', ['rev-parse', `HEAD:${object.path}`], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    failures.push(`${object.path}: missing or no longer tracked`);
    continue;
  }

  if (actualSha !== object.sha) {
    failures.push(`${object.path}: expected ${object.sha}, got ${actualSha}`);
  }
}

if (failures.length > 0) {
  console.error('\nReel regression baseline FAILED.');
  console.error('Already-working reel directories changed unexpectedly:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error('\nNew reel directories are allowed. Changes to a protected reel require an explicit baseline update after review.');
  process.exit(1);
}

console.log(`Reel regression baseline OK: ${baseline.protectedObjects.length} protected production states are unchanged.`);
console.log(`Baseline source: ${baseline.sourceCommit}`);
