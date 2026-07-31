#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  Captions,
  ScenePlan,
  normalizeWords,
} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const config = loadFinanceConfig();
const args = process.argv.slice(2);
const positionals = args.filter((arg) => !arg.startsWith('--'));
const [planArg, captionsArg, audioArg] = positionals;

if (!planArg || !captionsArg || !audioArg) {
  console.error('Nutzung: node scripts/align-finance-plan.mjs <scene-plan.json> <captions.json> <voiceover-final.wav> [--out=scene-plan.json]');
  process.exit(1);
}

const planFile = path.resolve(planArg);
const captionsFile = path.resolve(captionsArg);
const audioFile = path.resolve(audioArg);
const outArg = args.find((arg) => arg.startsWith('--out='));
const outFile = path.resolve(outArg ? outArg.slice('--out='.length) : planFile);

for (const file of [planFile, captionsFile, audioFile]) {
  if (!fs.existsSync(file)) throw new Error(`Datei fehlt: ${file}`);
}

const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(planFile, 'utf8')));
const captions = Captions.parse(JSON.parse(fs.readFileSync(captionsFile, 'utf8')));
const audioDurationMs = Number(execFileSync('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1',
  audioFile,
], {encoding: 'utf8'}).trim()) * 1000;

if (!Number.isFinite(audioDurationMs) || audioDurationMs <= 0) {
  throw new Error('Audiodauer konnte nicht bestimmt werden.');
}

const transcriptWords = captions.flatMap((caption) => {
  const words = normalizeWords(caption.text);
  if (!words.length) return [];
  const span = Math.max(1, caption.endMs - caption.startMs);
  return words.map((word, index) => ({
    word,
    startMs: caption.startMs + (span * index) / words.length,
    endMs: caption.startMs + (span * (index + 1)) / words.length,
  }));
});

const sceneSpans = [];
const scriptWords = [];
for (const scene of plan.scenes) {
  const words = normalizeWords(scene.voiceText);
  const start = scriptWords.length;
  scriptWords.push(...words);
  sceneSpans.push({sceneId: scene.id, start, end: scriptWords.length - 1});
}

if (!scriptWords.length || !transcriptWords.length) {
  throw new Error('Skript oder Transkript enthält keine ausrichtbaren Wörter.');
}

const levenshtein = (a, b) => {
  if (a === b) return 0;
  const previous = Array.from({length: b.length + 1}, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[b.length];
};

const substitutionCost = (a, b) => {
  if (a === b) return 0;
  if (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a))) return 0.25;
  const distance = levenshtein(a, b);
  if (Math.max(a.length, b.length) >= 4 && distance === 1) return 0.35;
  return 1;
};

const n = scriptWords.length;
const m = transcriptWords.length;
const width = m + 1;
const costs = new Float64Array((n + 1) * (m + 1));
const moves = new Uint8Array((n + 1) * (m + 1));
const gap = 0.9;

for (let i = 1; i <= n; i += 1) {
  costs[i * width] = i * gap;
  moves[i * width] = 1;
}
for (let j = 1; j <= m; j += 1) {
  costs[j] = j * gap;
  moves[j] = 2;
}

for (let i = 1; i <= n; i += 1) {
  for (let j = 1; j <= m; j += 1) {
    const index = i * width + j;
    const diagonal = costs[(i - 1) * width + j - 1] + substitutionCost(scriptWords[i - 1], transcriptWords[j - 1].word);
    const up = costs[(i - 1) * width + j] + gap;
    const left = costs[i * width + j - 1] + gap;
    if (diagonal <= up && diagonal <= left) {
      costs[index] = diagonal;
      moves[index] = 0;
    } else if (up <= left) {
      costs[index] = up;
      moves[index] = 1;
    } else {
      costs[index] = left;
      moves[index] = 2;
    }
  }
}

const mapping = new Array(n).fill(null);
let i = n;
let j = m;
while (i > 0 || j > 0) {
  const move = moves[i * width + j];
  if (i > 0 && j > 0 && move === 0) {
    mapping[i - 1] = j - 1;
    i -= 1;
    j -= 1;
  } else if (i > 0 && (j === 0 || move === 1)) {
    i -= 1;
  } else {
    j -= 1;
  }
}

let goodMatches = 0;
for (let index = 0; index < mapping.length; index += 1) {
  const transcriptIndex = mapping[index];
  if (transcriptIndex !== null && substitutionCost(scriptWords[index], transcriptWords[transcriptIndex].word) <= 0.35) {
    goodMatches += 1;
  }
}
const matchRatio = goodMatches / scriptWords.length;
if (matchRatio < config.alignment.minimumWordMatchRatio) {
  throw new Error(
    `Transkript passt nicht sicher zum Szenenplan: ${(matchRatio * 100).toFixed(1)} % Worttreffer, ` +
    `mindestens ${(config.alignment.minimumWordMatchRatio * 100).toFixed(0)} % erforderlich.`,
  );
}

const mappedRange = (span) => {
  const values = mapping.slice(span.start, span.end + 1).filter((value) => value !== null);
  if (!values.length) throw new Error(`Szene "${span.sceneId}" konnte keinem Transkriptbereich zugeordnet werden.`);
  return {first: values[0], last: values[values.length - 1]};
};

const ranges = sceneSpans.map(mappedRange);
const boundaries = [0];
for (let index = 0; index < ranges.length - 1; index += 1) {
  const previousEnd = transcriptWords[ranges[index].last].endMs;
  const nextStart = transcriptWords[ranges[index + 1].first].startMs;
  const midpoint = nextStart >= previousEnd ? (previousEnd + nextStart) / 2 : previousEnd;
  boundaries.push(Math.max(boundaries.at(-1) + 1, midpoint));
}
boundaries.push(audioDurationMs);

const alignedScenes = plan.scenes.map((scene, index) => ({
  ...scene,
  durationSec: Number(((boundaries[index + 1] - boundaries[index]) / 1000).toFixed(3)),
}));

const alignedPlan = ScenePlan.parse({
  ...plan,
  alignment: {
    method: 'transcript-word-alignment',
    matchRatio: Number(matchRatio.toFixed(4)),
    generatedAt: new Date().toISOString(),
  },
  scenes: alignedScenes,
});

fs.writeFileSync(outFile, JSON.stringify(alignedPlan, null, 2));
console.log(`✓ Szenen semantisch am finalen Transkript ausgerichtet → ${outFile}`);
console.log(`  Worttreffer: ${(matchRatio * 100).toFixed(1)} %`);
console.log(`  Audiodauer: ${(audioDurationMs / 1000).toFixed(3)} s`);
for (const scene of alignedPlan.scenes) {
  console.log(`  ${scene.id}: ${scene.durationSec.toFixed(3)} s`);
}
