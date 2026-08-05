#!/usr/bin/env node
import {execFileSync, spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {resolveVoiceoverAsset, isSafeRelativePath} from './lib/finance-user-asset-discovery.mjs';
import {resolveSceneTimingFromTranscript} from './lib/finance-transcript-alignment.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3).trim() : undefined;
};

if (!projectArg) {
  console.error('Nutzung: node scripts/sync-finance-reel-to-voiceover.mjs <projektordner> [--speed=1.10] [--model=small]');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
if (!fs.existsSync(packageFile)) throw new Error(`Codex-Reel-Paket fehlt: ${packageFile}`);
const reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
if (!scenes.length) throw new Error('Das Codex-Reel-Paket enthält keine Szenen.');

const speed = Number(option('speed') ?? reel.voiceover?.processing?.playbackRate ?? 1.1);
if (!Number.isFinite(speed) || speed < 0.85 || speed > 1.25) {
  throw new Error(`Ungültige Sprechgeschwindigkeit ${speed}. Erlaubt sind 0.85 bis 1.25.`);
}
const model = option('model') ?? reel.voiceover?.processing?.transcription?.model ?? 'small';
const supportedModels = new Set(['tiny', 'base', 'small', 'medium', 'large-v1', 'large-v2', 'large-v3', 'large-v3-turbo']);
if (!supportedModels.has(model)) throw new Error(`Nicht unterstütztes Whisper-Modell: ${model}.`);

const source = resolveVoiceoverAsset(projectRoot, reel.voiceover ?? {});
if (!source.ok) throw new Error(source.message);

const requireBinary = (binary) => {
  const result = spawnSync(binary, ['-version'], {encoding: 'utf8'});
  if (result.error || result.status !== 0) throw new Error(`${binary} ist nicht verfügbar. Bitte zuerst FFmpeg installieren.`);
};
requireBinary('ffmpeg');
requireBinary('ffprobe');

const probeDuration = (file) => {
  const value = Number(execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ], {encoding: 'utf8'}).trim());
  if (!Number.isFinite(value) || value <= 0) throw new Error(`Audiodauer konnte nicht bestimmt werden: ${file}`);
  return value;
};

const renderAudioDir = path.join(projectRoot, 'render', 'audio');
fs.mkdirSync(renderAudioDir, {recursive: true});
const speedLabel = speed.toFixed(2).replace('.', '-');
const runtimeRelative = `render/audio/voiceover-runtime-${speedLabel}x.wav`;
const whisperRelative = `render/audio/voiceover-whisper-${speedLabel}x-16k.wav`;
const runtimeFile = path.resolve(projectRoot, runtimeRelative);
const whisperInputFile = path.resolve(projectRoot, whisperRelative);

console.log(`Audioquelle: ${source.relativeFile}`);
console.log(`Tempo: ${speed.toFixed(2)}×, Tonhöhe bleibt erhalten.`);
execFileSync('ffmpeg', [
  '-y',
  '-i', source.absoluteFile,
  '-vn',
  '-filter:a', `atempo=${speed}`,
  '-ar', '48000',
  '-ac', '1',
  '-c:a', 'pcm_s16le',
  runtimeFile,
], {stdio: 'inherit'});
execFileSync('ffmpeg', [
  '-y',
  '-i', runtimeFile,
  '-vn',
  '-ar', '16000',
  '-ac', '1',
  '-c:a', 'pcm_s16le',
  whisperInputFile,
], {stdio: 'inherit'});

const sourceDurationSec = probeDuration(source.absoluteFile);
const runtimeDurationSec = probeDuration(runtimeFile);
const expectedDurationSec = sourceDurationSec / speed;
if (Math.abs(runtimeDurationSec - expectedDurationSec) > 0.35) {
  throw new Error(`Beschleunigte Audiodauer ist unerwartet: ${runtimeDurationSec.toFixed(3)} s statt ungefähr ${expectedDurationSec.toFixed(3)} s.`);
}

const require = createRequire(import.meta.url);
const whisperPackage = '@remotion/install-whisper-cpp';
const whisperPackageVersion = '4.0.488';
let whisperAvailable = true;
try {
  require.resolve(whisperPackage);
} catch {
  whisperAvailable = false;
}
if (!whisperAvailable) {
  console.log(`Installiere ${whisperPackage}@${whisperPackageVersion} lokal ohne package.json- oder Lockfile-Änderung ...`);
  const install = spawnSync('npm', [
    'install',
    '--no-save',
    '--package-lock=false',
    `${whisperPackage}@${whisperPackageVersion}`,
  ], {cwd: technicalRoot, stdio: 'inherit'});
  if (install.error || install.status !== 0) throw new Error(`Temporäre Installation von ${whisperPackage} fehlgeschlagen.`);
}

const {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} = await import(whisperPackage);

const whisperCppVersion = reel.voiceover?.processing?.transcription?.whisperCppVersion ?? '1.5.5';
const whisperPath = path.join(technicalRoot, '.cache', 'finanzneo-whisper', whisperCppVersion);
fs.mkdirSync(path.dirname(whisperPath), {recursive: true});
console.log(`Whisper.cpp: ${whisperPath}`);
await installWhisperCpp({to: whisperPath, version: whisperCppVersion});
await downloadWhisperModel({model, folder: whisperPath});

console.log(`Transkribiere mit Whisper.cpp, Modell ${model}, Sprache Deutsch ...`);
const whisperCppOutput = await transcribe({
  inputPath: whisperInputFile,
  whisperPath,
  whisperCppVersion,
  model,
  tokenLevelTimestamps: true,
  language: 'de',
  printOutput: false,
  onProgress: (progress) => {
    const percent = Math.round(progress * 100);
    if (percent % 10 === 0) process.stdout.write(`\rTranskription: ${percent}%`);
  },
});
process.stdout.write('\n');
const {captions} = toCaptions({whisperCppOutput});
if (!Array.isArray(captions) || captions.length === 0) throw new Error('Whisper hat keine Wort-Zeitstempel erzeugt.');

const audioDurationMs = Math.round(runtimeDurationSec * 1000);
const resolved = resolveSceneTimingFromTranscript({
  scenes,
  captions,
  audioDurationMs,
  minimumCoverage: 0.72,
});

const captionsRelative = reel.captions?.asset ?? '04-caption/voiceover-final.captions.json';
if (!isSafeRelativePath(captionsRelative)) throw new Error(`Unsicherer Caption-Pfad: ${captionsRelative}.`);
const captionsFile = path.resolve(projectRoot, captionsRelative);
const transcriptRelative = '04-caption/voiceover-transcript.json';
const transcriptFile = path.resolve(projectRoot, transcriptRelative);
const timingRelative = 'timeline/scene-timing.json';
const timingFile = path.resolve(projectRoot, timingRelative);
const timingMarkdownRelative = 'timeline/transcript-timing.md';
const timingMarkdownFile = path.resolve(projectRoot, timingMarkdownRelative);
const reportRelative = '05-review/audio-sync-report.json';
const reportFile = path.resolve(projectRoot, reportRelative);
for (const file of [captionsFile, transcriptFile, timingFile, timingMarkdownFile, reportFile]) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
}

fs.writeFileSync(captionsFile, JSON.stringify(captions, null, 2));
fs.writeFileSync(transcriptFile, JSON.stringify(whisperCppOutput, null, 2));

const fps = Number(reel.composition?.fps ?? 30);
const durationInFrames = Math.ceil(runtimeDurationSec * fps);
const sceneTiming = resolved.sceneTiming.map((timing) => ({
  ...timing,
  startFrame: Math.floor(timing.startMs / 1000 * fps),
  endFrameExclusive: Math.ceil(timing.endMs / 1000 * fps),
}));
fs.writeFileSync(timingFile, JSON.stringify({
  version: 'finanzneo-transcript-timing-v1',
  generatedAt: new Date().toISOString(),
  timingSource: 'whisper.cpp-word-timestamps',
  sourceAudio: source.relativeFile,
  runtimeAudio: runtimeRelative,
  sourceDurationSec: Number(sourceDurationSec.toFixed(3)),
  playbackRate: speed,
  runtimeDurationSec: Number(runtimeDurationSec.toFixed(3)),
  fps,
  durationInFrames,
  transcription: {
    engine: 'whisper.cpp',
    packageVersion: whisperPackageVersion,
    whisperCppVersion,
    model,
    language: 'de',
    tokenLevelTimestamps: true,
  },
  alignment: resolved.alignment,
  scenes: sceneTiming,
}, null, 2));

const formatSeconds = (milliseconds) => (milliseconds / 1000).toFixed(2).replace('.', ',');
const timingRows = sceneTiming.map((timing, index) => (
  `| ${index + 1} | ${formatSeconds(timing.startMs)} s | ${formatSeconds(timing.endMs)} s | ${timing.durationSec.toFixed(3).replace('.', ',')} s | ${timing.startFrame}–${timing.endFrameExclusive - 1} | ${(timing.matchCoverage * 100).toFixed(1).replace('.', ',')} % |`
));
fs.writeFileSync(timingMarkdownFile, `# Transkriptbasierte Reel-Zeiten\n\nDiese Datei wird automatisch aus dem auf **${speed.toFixed(2).replace('.', ',')}×** beschleunigten Voiceover und echten Whisper-Wortzeitstempeln erzeugt. Sie überschreibt alle früheren Schätzzeiten.\n\n- Quelle: \`${source.relativeFile}\`\n- Laufzeitquelle im Render: \`${runtimeRelative}\`\n- Originaldauer: ${sourceDurationSec.toFixed(3).replace('.', ',')} s\n- Renderdauer: ${runtimeDurationSec.toFixed(3).replace('.', ',')} s\n- Frames: ${durationInFrames} bei ${fps} FPS\n- Skriptabdeckung: ${(resolved.alignment.coverage * 100).toFixed(1).replace('.', ',')} %\n\n| Szene | Start | Ende | Dauer | Frames | Wortabdeckung |\n|---:|---:|---:|---:|---:|---:|\n${timingRows.join('\n')}\n\n## Regel\n\nSzenenwechsel richten sich nach den tatsächlich gesprochenen Satzabschnitten. Geplante Zeiten sind nur ein kreativer Richtwert. Codex muss diese Datei und \`scene-timing.json\` als zeitliche Quelle der Wahrheit verwenden.\n`);

const updatedScenes = scenes.map((scene, index) => ({
  ...scene,
  durationSec: sceneTiming[index].durationSec,
  timing: {
    startMs: sceneTiming[index].startMs,
    endMs: sceneTiming[index].endMs,
    startFrame: sceneTiming[index].startFrame,
    endFrameExclusive: sceneTiming[index].endFrameExclusive,
    source: 'whisper.cpp-word-alignment',
  },
}));
const updatedPackage = {
  ...reel,
  composition: {
    ...reel.composition,
    durationInFrames,
  },
  voiceover: {
    ...reel.voiceover,
    runtimeAsset: runtimeRelative,
    processing: {
      ...(reel.voiceover?.processing ?? {}),
      playbackRate: speed,
      preservePitch: true,
      sourceAsset: source.relativeFile,
      sourceDurationSec: Number(sourceDurationSec.toFixed(3)),
      runtimeAsset: runtimeRelative,
      runtimeDurationSec: Number(runtimeDurationSec.toFixed(3)),
      timingMode: 'transcript-word-alignment',
      transcription: {
        engine: 'whisper.cpp',
        packageVersion: whisperPackageVersion,
        whisperCppVersion,
        model,
        language: 'de',
        tokenLevelTimestamps: true,
      },
    },
  },
  captions: {
    ...reel.captions,
    asset: captionsRelative,
    transcriptAsset: transcriptRelative,
    source: 'whisper.cpp-word-timestamps',
    mayGenerateProvisionalTimings: false,
  },
  timing: {
    mode: 'transcript-aligned',
    asset: timingRelative,
    sourceOfTruth: true,
    generatedAt: new Date().toISOString(),
  },
  scenes: updatedScenes,
};
fs.writeFileSync(packageFile, `${JSON.stringify(updatedPackage, null, 2)}\n`);

const report = {
  version: 'finanzneo-audio-sync-v1',
  generatedAt: new Date().toISOString(),
  status: 'transcribed-and-aligned',
  sourceAudio: source.relativeFile,
  sourceDurationSec: Number(sourceDurationSec.toFixed(3)),
  playbackRate: speed,
  preservePitch: true,
  runtimeAudio: runtimeRelative,
  runtimeDurationSec: Number(runtimeDurationSec.toFixed(3)),
  expectedDurationSec: Number(expectedDurationSec.toFixed(3)),
  captions: captionsRelative,
  transcript: transcriptRelative,
  sceneTiming: timingRelative,
  durationInFrames,
  alignment: resolved.alignment,
  scenes: sceneTiming,
  manualChecksStillRequired: [
    'Stimme klingt bei 1.10× natürlich',
    'Szenenwechsel liegen an sinnvollen Satzgrenzen',
    'Captions stimmen sichtbar mit der Stimme überein',
    'Keine Szene wirkt zu statisch oder zu hektisch',
  ],
};
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);

console.log('✓ Voiceover pitch-erhaltend verarbeitet.');
console.log(`  Original: ${sourceDurationSec.toFixed(3)} s`);
console.log(`  ${speed.toFixed(2)}×: ${runtimeDurationSec.toFixed(3)} s`);
console.log(`  Renderframes: ${durationInFrames}`);
console.log(`✓ Echte Wort-Zeitstempel erzeugt: ${captionsRelative}`);
console.log(`✓ Szenen anhand des Transkripts ausgerichtet: ${timingRelative}`);
console.log(`  Skriptabdeckung: ${(resolved.alignment.coverage * 100).toFixed(1)}%`);
console.log(`✓ Codex-Paket aktualisiert: ${path.relative(technicalRoot, packageFile)}`);
console.log(`✓ Prüfbericht: ${reportRelative}`);
