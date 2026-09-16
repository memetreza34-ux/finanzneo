import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildYouTubeTimeline,
  missingYouTubeBindings,
  missingYouTubeImages,
  validateYouTubeTimeline,
  type YouTubeSentence,
  type YouTubeVisual,
} from '../src/youtube/timeline';

const sentences: YouTubeSentence[] = [
  {start: 0, end: 3.2},
  {start: 3.2, end: 5.0},
  {start: 5.0, end: 11.4},
  {start: 11.4, end: 13.1},
];

const visual = (id: string, extra: Partial<YouTubeVisual> = {}): YouTubeVisual => ({
  id,
  type: 'animation',
  animationExport: `${id}Animation`,
  ...extra,
});

test('Timeline: Szenen folgen den Satzgrenzen und werden dadurch ungleich lang', () => {
  const timeline = buildYouTubeTimeline(
    [visual('visual-01', {sentenceSpan: {from: 1, to: 2}}), visual('visual-02', {sentenceSpan: {from: 3, to: 4}})],
    sentences,
    30,
  );
  assert.equal(timeline.scenes.length, 2);
  assert.equal(timeline.scenes[0].durationInFrames, 150); // 0 – 5,0 s
  assert.equal(timeline.scenes[1].durationInFrames, 243); // 5,0 – 13,1 s
  assert.notEqual(timeline.scenes[0].durationInFrames, timeline.scenes[1].durationInFrames);
  assert.equal(timeline.durationInFrames, 393);
  assert.deepEqual(timeline.notes, []);
});

test('Timeline: Szenen schließen lückenlos aneinander an', () => {
  const timeline = buildYouTubeTimeline(
    [visual('visual-01', {sentenceSpan: {from: 1, to: 1}}), visual('visual-02', {sentenceSpan: {from: 2, to: 4}})],
    sentences,
    30,
  );
  assert.equal(timeline.scenes[0].startFrame, 0);
  assert.equal(timeline.scenes[1].startFrame, timeline.scenes[0].durationInFrames);
  assert.deepEqual(validateYouTubeTimeline(timeline), []);
});

test('Timeline: fehlende sentenceSpan wird zugeteilt, aber als Hinweis gemeldet', () => {
  const timeline = buildYouTubeTimeline([visual('visual-01'), visual('visual-02')], sentences, 30);
  assert.equal(timeline.notes.length, 2);
  assert.match(timeline.notes[0], /keine sentenceSpan/);
  assert.match(timeline.notes[0], /Vor dem Render prüfen/);
});

test('Timeline: mehr Visuals als Sätze bricht ab statt zu raten', () => {
  const visuals = Array.from({length: 9}, (_, index) => visual(`visual-0${index + 1}`));
  assert.throws(() => buildYouTubeTimeline(visuals, sentences, 30), /reichen nicht/);
});

test('Timeline: eine sentenceSpan außerhalb der Sätze bricht ab', () => {
  assert.throws(
    () => buildYouTubeTimeline([visual('visual-01', {sentenceSpan: {from: 3, to: 9}})], sentences, 30),
    /außerhalb/,
  );
});

test('Timeline: leere Wortzeiten brechen ab statt ein Raster zu erfinden', () => {
  assert.throws(() => buildYouTubeTimeline([visual('visual-01')], [], 30), /keine satzbasierten/);
});

test('Timeline: pauschal gleich lange Szenen werden abgelehnt', () => {
  const even: YouTubeSentence[] = [
    {start: 0, end: 2},
    {start: 2, end: 4},
    {start: 4, end: 6},
  ];
  const timeline = buildYouTubeTimeline(
    [
      visual('visual-01', {sentenceSpan: {from: 1, to: 1}}),
      visual('visual-02', {sentenceSpan: {from: 2, to: 2}}),
      visual('visual-03', {sentenceSpan: {from: 3, to: 3}}),
    ],
    even,
    30,
  );
  const errors = validateYouTubeTimeline(timeline);
  assert.ok(errors.some((error) => error.includes('exakt gleich lang')));
});

test('Timeline: eine zu kurze Szene trägt keinen Szenenwechsel', () => {
  const tight: YouTubeSentence[] = [
    {start: 0, end: 0.1},
    {start: 0.1, end: 9},
  ];
  const timeline = buildYouTubeTimeline(
    [visual('visual-01', {sentenceSpan: {from: 1, to: 1}}), visual('visual-02', {sentenceSpan: {from: 2, to: 2}})],
    tight,
    30,
  );
  const errors = validateYouTubeTimeline(timeline);
  assert.ok(errors.some((error) => error.includes('zu kurz für einen Szenenwechsel')));
});

test('Timeline: Abweichung zur Audiolänge wird gemeldet', () => {
  const timeline = buildYouTubeTimeline(
    [visual('visual-01', {sentenceSpan: {from: 1, to: 4}})],
    sentences,
    30,
  );
  assert.deepEqual(validateYouTubeTimeline(timeline, 13.1), []);
  assert.ok(validateYouTubeTimeline(timeline, 40).some((error) => error.includes('Abweichung')));
});

test('Bindung: eine Animationsszene ohne Binding bricht den Render ab', () => {
  const timeline = buildYouTubeTimeline(
    [visual('visual-01', {sentenceSpan: {from: 1, to: 2}}), visual('visual-02', {sentenceSpan: {from: 3, to: 4}})],
    sentences,
    30,
  );
  assert.deepEqual(missingYouTubeBindings(timeline, ['visual-01', 'visual-02']), []);
  const missing = missingYouTubeBindings(timeline, ['visual-01']);
  assert.equal(missing.length, 1);
  assert.match(missing[0], /visual-02: animations\["visual-02"\] fehlt/);
});

test('Bindung: eine reine Bildszene braucht keine Animation, aber einen Dateinamen', () => {
  const timeline = buildYouTubeTimeline(
    [
      {id: 'visual-01', type: 'image', googleFlowFileName: 'YouTube Bild 01.png', sentenceSpan: {from: 1, to: 2}},
      {id: 'visual-02', type: 'image', sentenceSpan: {from: 3, to: 4}},
    ],
    sentences,
    30,
  );
  assert.deepEqual(missingYouTubeBindings(timeline, []), []);
  const missing = missingYouTubeImages(timeline);
  assert.equal(missing.length, 1);
  assert.match(missing[0], /visual-02: kein googleFlowFileName/);
});

test('Bindung: ein Hybrid braucht beides', () => {
  const timeline = buildYouTubeTimeline(
    [{id: 'visual-01', type: 'hybrid', animationExport: 'X', sentenceSpan: {from: 1, to: 4}}],
    sentences,
    30,
  );
  assert.deepEqual(missingYouTubeImages(timeline), ['visual-01: kein googleFlowFileName im Visual-Index.']);
  assert.deepEqual(missingYouTubeBindings(timeline, []), ['visual-01: animations["visual-01"] fehlt.']);
});
