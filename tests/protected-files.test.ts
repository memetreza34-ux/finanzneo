import assert from 'node:assert/strict';
import test from 'node:test';
import {isDirectMainPushLine, isProtectedPath} from '../scripts/lib/protected-files.mjs';

test('Kritische Verträge und Produktionsskripte sind geschützt', () => {
  assert.equal(isProtectedPath('CLAUDE.md'), true);
  assert.equal(isProtectedPath('youtube/PRODUKTIONSSTANDARD.md'), true);
  assert.equal(isProtectedPath('scripts/lib/youtube-contract.mjs'), true);
  assert.equal(isProtectedPath('scripts/validate-youtube.mjs'), true);
  assert.equal(isProtectedPath('tests/youtube-readiness.test.ts'), true);
  assert.equal(isProtectedPath('src/finance/calculations.ts'), true);
  assert.equal(isProtectedPath('src/brand/reel-contract.json'), true);
  assert.equal(isProtectedPath('scripts/check-reel-final-export.mjs'), true);
  assert.equal(isProtectedPath('scripts/lib/reel-final-export.mjs'), true);
  assert.equal(isProtectedPath('youtube/neues-projekt/README.md'), false);
});

test('Pre-Push-Schutz erkennt nur das Remote-Ziel main', () => {
  const sha = '1234567890123456789012345678901234567890';
  assert.equal(isDirectMainPushLine(`refs/heads/topic ${sha} refs/heads/main ${sha}`), true);
  assert.equal(isDirectMainPushLine(`refs/heads/topic ${sha} refs/heads/codex/topic ${sha}`), false);
});
