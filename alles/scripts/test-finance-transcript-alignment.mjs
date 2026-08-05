#!/usr/bin/env node
import {resolveSceneTimingFromTranscript} from './lib/finance-transcript-alignment.mjs';

const scenes = [
  {id: 'scene-01', voiceText: 'Was passiert wenn du hundert Euro in einen ETF steckst'},
  {id: 'scene-02', voiceText: 'Der Broker sendet deine Kauforder an einen Handelsplatz'},
  {id: 'scene-03', voiceText: 'Dort trifft sie auf ein passendes Verkaufsangebot'},
];

const transcriptWords = [
  'Was', 'passiert', 'wenn', 'du', 'hundert', 'Euro', 'in', 'einen', 'ETF', 'steckst',
  'Der', 'Broker', 'sendet', 'deine', 'Kauforder', 'an', 'den', 'Handelsplatz',
  'Dort', 'trifft', 'sie', 'auf', 'ein', 'passendes', 'Verkaufs-Angebot',
];

const captions = transcriptWords.map((text, index) => ({
  text,
  startMs: index * 360,
  endMs: index * 360 + 300,
  timestampMs: index * 360,
  confidence: 0.95,
}));

const audioDurationMs = captions.at(-1).endMs + 420;
const result = resolveSceneTimingFromTranscript({
  scenes,
  captions,
  audioDurationMs,
  minimumCoverage: 0.7,
});

if (result.alignment.coverage < 0.9) {
  throw new Error(`Unerwartet niedrige Wortabdeckung: ${result.alignment.coverage}`);
}
if (result.sceneTiming.length !== scenes.length) throw new Error('Szenenanzahl stimmt nicht.');
if (result.sceneTiming[0].startMs !== 0) throw new Error('Erste Szene muss bei 0 ms beginnen.');
if (result.sceneTiming.at(-1).endMs !== audioDurationMs) throw new Error('Letzte Szene muss mit dem Audio enden.');
for (let index = 0; index < result.sceneTiming.length; index += 1) {
  const timing = result.sceneTiming[index];
  if (timing.endMs <= timing.startMs) throw new Error(`Szene ${index + 1} hat keine positive Dauer.`);
  if (index > 0 && timing.startMs !== result.sceneTiming[index - 1].endMs) {
    throw new Error(`Szenen ${index} und ${index + 1} sind nicht lückenlos.`);
  }
}

let mismatchRejected = false;
try {
  resolveSceneTimingFromTranscript({
    scenes,
    captions: [
      {text: 'vollständig', startMs: 0, endMs: 300},
      {text: 'anderer', startMs: 300, endMs: 600},
      {text: 'Inhalt', startMs: 600, endMs: 900},
    ],
    audioDurationMs: 1000,
    minimumCoverage: 0.7,
  });
} catch (error) {
  mismatchRejected = String(error.message).includes('stimmt nicht ausreichend');
}
if (!mismatchRejected) throw new Error('Ein unpassendes Transkript wurde nicht abgelehnt.');

console.log('✓ Transkriptbasierte Szenenausrichtung bestanden.');
