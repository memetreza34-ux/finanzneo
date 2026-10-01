import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const apply = resolve('scripts/apply-youtube-visual-direction-v1.mjs');
const validator = resolve('scripts/validate-youtube-visual-direction-v1.mjs');

const makeProject = () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-youtube-direction-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  write('04-visuals/visual-index.json', JSON.stringify({
    imageWorld: {id: 'finanzneo-connected-studio-v3'},
    visuals: [{
      id: 'visual-01',
      type: 'image',
      planFile: '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt',
    }],
  }, null, 2));

  const basePrompt = `LITERAL_REAL_WORLD_SITUATION: Eine Person prüft eine Überweisung vor der Freigabe.
REAL_WORLD_CONTEXT_ANCHOR: Online-Banking am Schreibtisch
VOICEOVER_VISUAL_MATCH: Eine falsche IBAN stoppt die Zahlung sichtbar.
TRANSFERABILITY_TEST: PASS - Die konkrete IBAN-Prüfung passt nicht zu fünf anderen Finanzthemen.
VISUAL_STRATEGY: literal
METAPHOR_JUSTIFICATION: none

IMAGE PROMPT:
Show the concrete bank transfer in the existing FinanzNeo YouTube world.

Literal first, creative second.
`;
  write('04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt', basePrompt);
  write('04-visuals/alle-bildprompts.txt', basePrompt);
  write('04-visuals/bildwelt.txt', 'FINANZNEO YOUTUBE IMAGE WORLD\nLiteral first, creative second.\n');
  write('04-visuals/thumbnail-prompt.txt', 'THUMBNAIL PROMPT:\nCreate a concrete finance thumbnail.\n');
  write('06-projektdateien/visual-plan.md', '# Visual Plan\n');
  write('02-script/retention-plan.md', '# Retention Plan\n');
  return root;
};

const fillPlanning = (path: string) => {
  let source = readFileSync(path, 'utf8');
  const replacements: Record<string, string> = {
    '[EINFÜGEN — verstehen / fühlen / vergleichen / Gefahr erkennen / Ergebnis sehen]': 'Gefahr sofort erkennen und die Prüfung verstehen',
    '[cinematic-literal / cause-effect / comparison / scale / object-story / pov / grounded-metaphor]': 'cinematic-literal',
    '[EINFÜGEN — sichtbare Handlung oder Veränderung]': 'Der Finger stoppt über dem Freigabe-Knopf, während die Abweichung sichtbar wird.',
    '[EINFÜGEN — sichtbarer Konflikt, Preis, Risiko, Gegensatz oder Konsequenz]': 'Die Zahlung steht unmittelbar vor einer falschen Freigabe.',
    '[EINFÜGEN — das stärkste sofort sichtbare Element]': 'Die rote IBAN-Abweichung neben dem schwebenden Finger.',
    '[extreme-wide / wide / medium / close-up / extreme-close-up / macro]': 'close-up',
    '[eye-level / low-angle / high-angle / top-down / over-shoulder / pov / dutch-subtle]': 'over-shoulder',
    '[EINFÜGEN — Vordergrund / Hauptmotiv / Hintergrund]': 'Hand im Vordergrund, Überweisung zentral, Person weich im Hintergrund.',
    '[EINFÜGEN — gewünschte Zuschauerreaktion]': 'Spannung vor einem vermeidbaren Fehler',
    '[EINFÜGEN — Ursache und sichtbare Wirkung]': 'Abweichende Daten führen sichtbar zum gestoppten Zahlungsvorgang.',
    '[EINFÜGEN — none oder konkreter Rhythmuswechsel]': 'close-up statt vorheriger weiter Einstellung',
    '[EINFÜGEN — slow push-in / pan / parallax / rack-focus / hold]': 'slow push-in auf die Abweichung',
    '[EINFÜGEN — PASS: konkrete Abwechslung gegenüber den letzten Visuals]': 'PASS - Over-Shoulder-Nähe und gestoppte Hand schaffen eine neue Komposition.',
  };
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(from, to);
  writeFileSync(path, source, 'utf8');
};

test('Apply ergänzt Visual Direction ohne bestehende Bildwelt-Marker zu entfernen', () => {
  const root = makeProject();
  try {
    execFileSync(process.execPath, [apply, root], {stdio: 'pipe'});
    const promptPath = join(root, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt');
    const prompt = readFileSync(promptPath, 'utf8');
    assert.match(prompt, /Literal first, creative second/);
    assert.match(prompt, /YOUTUBE_VISUAL_DIRECTION: finanzneo-youtube-visual-direction-v1/);
    assert.match(prompt, /VISUAL_HOOK:/);
    assert.match(prompt, /SHOT_SCALE:/);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Validator akzeptiert ausgefüllte starke Regie und erhaltene Bildwelt', () => {
  const root = makeProject();
  try {
    execFileSync(process.execPath, [apply, root], {stdio: 'pipe'});
    fillPlanning(join(root, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt'));
    fillPlanning(join(root, '04-visuals/alle-bildprompts.txt'));
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Validator blockiert generische oder nicht ausgefüllte Visual Direction', () => {
  const root = makeProject();
  try {
    execFileSync(process.execPath, [apply, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /VISUAL_MODE|SHOT_SCALE|Platzhalter|novelty/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
