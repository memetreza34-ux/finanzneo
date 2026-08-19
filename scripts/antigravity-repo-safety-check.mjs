#!/usr/bin/env node
import {execFileSync} from 'node:child_process';

const base = process.argv[2];
if (!base) {
  console.error('Nutzung: npm run antigravity:safety -- <starting-head>');
  process.exit(1);
}
const git = (...args) => execFileSync('git', args, {encoding: 'utf8'}).trim();
const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
const deleted = git('diff', '--name-status', `${base}...HEAD`).split('\n').filter((line) => /^D\s/.test(line));
const protectedExact = new Set(['CLAUDE.md','package-lock.json','npm-shrinkwrap.json','yarn.lock','pnpm-lock.yaml']);
const protectedPrefixes = ['docs/FINANZNEO-IMAGE-WORLD-V3.md','src/brand/','src/finance/','.github/workflows/'];
const protectedChanges = changed.filter((path) => protectedExact.has(path) || protectedPrefixes.some((prefix) => path.startsWith(prefix)));
console.log(`Starting HEAD: ${base}`);
console.log(`Current HEAD:  ${git('rev-parse', 'HEAD')}`);
console.log(`Changed files: ${changed.length}`);
const status = git('status', '--short');
if (status) console.log(`\nWorking tree:\n${status}`);
if (deleted.length) {
  console.error('\nSafety check failed: tracked deletions detected:');
  deleted.forEach((line) => console.error(`- ${line}`));
  process.exitCode = 1;
}
if (protectedChanges.length) {
  console.error('\nSafety check failed: protected shared files changed:');
  protectedChanges.forEach((path) => console.error(`- ${path}`));
  process.exitCode = 1;
}
if (!deleted.length && !protectedChanges.length) console.log('\n✓ Antigravity repository safety check passed.');
