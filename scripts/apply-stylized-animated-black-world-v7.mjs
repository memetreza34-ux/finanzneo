#!/usr/bin/env node

// Legacy compatibility alias only.
// The active visual-world migration is V9. Keep this thin wrapper so older
// local commands fail forward into the canonical implementation instead of
// carrying a second, diverging rule set.

import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

console.warn('Hinweis: apply-stylized-animated-black-world-v7.mjs ist veraltet; verwende V9.');
const result = spawnSync(
  process.execPath,
  [resolve('scripts/apply-stylized-animated-black-world-v9.mjs'), ...process.argv.slice(2)],
  {stdio: 'inherit'},
);

process.exit(result.status ?? 1);
