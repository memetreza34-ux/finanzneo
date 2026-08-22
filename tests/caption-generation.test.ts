import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {REEL_CAPTION} from '../scripts/lib/reel-contract.mjs';

test('Caption-Generator teilt lange gesprochene Sätze automatisch in kurze Einheiten', () => {
  const program = [
    'import json',
    'from scripts.captions import group_sentences',
    'text = "Nutze die offizielle Rate als Orientierung und deinen eigenen Warenkorb, um zu verstehen, wo dein Geld wirklich an Kaufkraft verliert."',
    'words = [{"word": word, "start": index * 0.2, "end": index * 0.2 + 0.18} for index, word in enumerate(text.split())]',
    'print(json.dumps(group_sentences(words)))',
  ].join('\n');
  const result = spawnSync('python3', ['-c', program], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
  });

  assert.equal(result.status, 0, result.stderr);
  const captions = JSON.parse(result.stdout) as Array<{text: string; words: unknown[]}>;
  assert.ok(captions.length > 1);
  assert.ok(captions.every((caption) => caption.words.length <= REEL_CAPTION.maxWords));
  assert.ok(captions.every((caption) => caption.text.length <= REEL_CAPTION.maxCharacters));
});
