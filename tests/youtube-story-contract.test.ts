import assert from 'node:assert/strict';
import {readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {
  resolveCueFrames,
  validateYouTubeMotionSourceStyle,
  validateYouTubeStory,
} from '../scripts/lib/youtube-story-contract.mjs';

// Kurzfassung des ersten echten Skripts (Notgroschen, 2026-10-04).
const script = [
  'Dein Notgroschen hat nur einen Job: Er muss da sein, wenn plötzlich etwas kaputtgeht.',
  'Die Verbraucherzentrale nennt zwei bis drei Monatsgehälter als mögliche Faustregel.',
  'Wie hoch deine Reserve wirklich sein sollte, hängt aber von deiner Situation ab.',
].join(' ');

const image = (id: string, startCue: string) => ({id, type: 'image', startCue});
const motion = (id: string, startCue: string, beatCues: string[]) => ({
  id, type: 'data', startCue, beatCues, visualBeats: beatCues.map((cue) => `Stufe ${cue}`),
});
const person = 'a woman in her thirties with a short dark bob and a mustard sweater';

test('Erzählvertrag erkennt vertauschte Visuals wie Faustregel und Situation im Notgroschen-Video', () => {
  const errors = validateYouTubeStory({
    scriptText: script,
    recurringCharacter: 'none — nur Gegenstände',
    visuals: [
      image('visual-01', 'Dein Notgroschen hat nur einen Job'),
      image('visual-04', 'Wie hoch deine Reserve'),
      motion('visual-05', 'Die Verbraucherzentrale nennt', ['zwei bis drei', 'Faustregel']),
    ],
  });
  assert.ok(errors.some((error) => error.includes('visual-05: steht im Skript vor dem vorigen Visual')), errors.join('\n'));
});

test('Erzählvertrag lässt die richtige Reihenfolge mit passenden Beats durch', () => {
  const errors = validateYouTubeStory({
    scriptText: script,
    recurringCharacter: 'none — nur Gegenstände',
    visuals: [
      image('visual-01', 'Dein Notgroschen hat nur einen Job'),
      motion('visual-02', 'Die Verbraucherzentrale nennt', ['zwei bis drei', 'Faustregel']),
      image('visual-03', 'Wie hoch deine Reserve'),
    ],
  });
  assert.deepEqual(errors, []);
});

test('Erzählvertrag meldet ein Standbild, das zu lange steht', () => {
  const long = `${script} ${'Wohnst du allein und brauchst du ein Auto für die Arbeit oder hast du hohe feste Kosten. '.repeat(3)}`;
  const errors = validateYouTubeStory({
    scriptText: long,
    recurringCharacter: 'none — nur Gegenstände',
    visuals: [
      image('visual-01', 'Dein Notgroschen hat nur einen Job'),
      motion('visual-02', 'Die Verbraucherzentrale nennt', ['zwei bis drei', 'Faustregel']),
      image('visual-03', 'Wie hoch deine Reserve'),
    ],
  });
  assert.ok(errors.some((error) => /visual-03: Bild steht geschätzt \d+\.\d s/.test(error)), errors.join('\n'));
});

test('Erzählvertrag verlangt einen gesprochenen Cue pro Beat in der richtigen Reihenfolge', () => {
  const errors = validateYouTubeStory({
    scriptText: script,
    recurringCharacter: 'none — nur Gegenstände',
    visuals: [
      image('visual-01', 'Dein Notgroschen hat nur einen Job'),
      {...motion('visual-02', 'Die Verbraucherzentrale nennt', ['Faustregel', 'zwei bis drei']), visualBeats: ['a', 'b', 'c']},
    ],
  });
  assert.ok(errors.some((error) => error.includes('beatCues braucht genau einen gesprochenen Cue pro visualBeat (3), gefunden 2')));
  assert.ok(errors.some((error) => error.includes('beatCue „zwei bis drei“ muss wörtlich und in Reihenfolge')));
});

test('Erzählvertrag verlangt dieselbe Hauptfigur in jedem Prompt mit Person', () => {
  const visuals = [image('visual-01', 'Dein Notgroschen hat nur einen Job')];
  const firstSentence = 'Dein Notgroschen hat nur einen Job: Er muss da sein, wenn plötzlich etwas kaputtgeht.';
  const ok = `Stylized 3D animated feature film still, 16:9. ${person} holds a repair bill. Laundry corner. No text. Soft natural light, deep black background. Not photorealistic, no logos.`;
  const drift = 'Stylized 3D animated feature film still, 16:9. A young woman holds a repair bill. Laundry corner. No text. Soft natural light, deep black background. Not photorealistic, no logos.';
  assert.deepEqual(validateYouTubeStory({scriptText: firstSentence, visuals, recurringCharacter: person, promptLines: [ok]}), []);
  assert.ok(validateYouTubeStory({scriptText: firstSentence, visuals, recurringCharacter: person, promptLines: [drift]}).some((error) => error.includes('nutzt nicht die exakte Hauptfigur')));
  assert.ok(validateYouTubeStory({scriptText: firstSentence, visuals, recurringCharacter: '', promptLines: []}).some((error) => error.startsWith('recurringCharacter fehlt')));
});

test('Phase 3 rechnet Cues mit echten Wort-Zeitstempeln in Frames ab Visual-Start um', () => {
  const words = [
    {word: 'Die', start: 10.0}, {word: 'Verbraucherzentrale', start: 10.2}, {word: 'nennt', start: 11.0},
    {word: 'zwei', start: 11.4}, {word: 'bis', start: 11.7}, {word: 'drei', start: 11.9},
    {word: 'Monatsgehälter', start: 12.2}, {word: 'als', start: 13.0}, {word: 'Faustregel.', start: 14.0},
  ];
  const result = resolveCueFrames({words, startCue: 'Die Verbraucherzentrale nennt', beatCues: ['zwei bis drei', 'Faustregel', 'gibt es nicht'], fps: 30});
  assert.equal(result.startSeconds, 10);
  assert.deepEqual(result.beats, [42, 120, null]);
});

test('Motion-Stil: nur Kartenfarben, nur Inter, Timing über beats', () => {
  const good = `const at = (step) => beats?.[step] ?? 0; export const A = ({beats}) => <div style={{fontFamily: 'Inter', color: '#00D26A', background: 'rgba(0, 210, 106, 0.2)'}} />;`;
  assert.deepEqual(validateYouTubeMotionSourceStyle(good, {id: 'visual-02'}), []);

  const notgroschen = `const p = interpolate(frame, [10, 28], [0, 1]); export const A = () => <div style={{fontFamily: 'Arial', color: '#2FCB8B', background: '#173B31'}} />;`;
  const errors = validateYouTubeMotionSourceStyle(notgroschen, {id: 'visual-02'}).join('\n');
  assert.match(errors, /Farbe #2FCB8B gehört nicht zur YouTube-Motion-Palette/);
  assert.match(errors, /Schrift „Arial“ ist nicht erlaubt/);
  assert.match(errors, /Prop `beats`/);
});

test('Neue YouTube-Projekte starten mit Erzählvertrag und einer Animationsvorlage im einheitlichen Stil', () => {
  const target = `youtube/.tmp-story-${process.pid}-${Date.now()}`;
  try {
    const run = spawnSync(process.execPath, [resolve('scripts/create-finanzneo-youtube.mjs'), '--target', target, '--title', 'Story Test', '--types', 'image,animation,data'], {encoding: 'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);
    const index = JSON.parse(readFileSync(resolve(target, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.storyContract, 'finanzneo-youtube-story-v1');
    assert.match(index.recurringCharacter, /EXACT ENGLISH DESCRIPTION/);
    for (const visual of index.visuals) assert.equal(typeof visual.startCue, 'string');
    const animation = index.visuals.find((visual: {type: string}) => visual.type === 'animation');
    assert.equal(animation.beatCues.length, animation.visualBeats.length);
    const source = readFileSync(resolve(target, animation.animationSourceFile), 'utf8');
    assert.deepEqual(validateYouTubeMotionSourceStyle(source, animation), []);
    const flow = readFileSync(resolve(target, '04-visuals/alle-bildprompts.txt'), 'utf8');
    assert.match(flow, /HAUPTFIGUR: Kommt eine Person vor, ist es immer dieselbe Figur/);
  } finally {
    rmSync(resolve(target), {recursive: true, force: true});
  }
});
