import {existsSync, readFileSync} from 'node:fs';
import {basename, relative, resolve, sep} from 'node:path';

export const VOICEOVER_PROCESSING_CONTRACT_ID = 'finanzneo-narration-pacing-v1';
export const AUDIO_STANDARD_PATH = 'config/finanzneo-audio-standard.json';
export const SUPPORTED_AUDIO_EXTENSIONS = new Set(['.wav', '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.opus']);

const normalizeSlashes = (value) => String(value).split(sep).join('/').replaceAll('\\', '/');

const isInside = (base, target) => {
  const rel = relative(base, target);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${sep}`) && !resolve(target).startsWith(`${resolve(base)}${sep}..`);
};

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

export const readVoiceoverStandard = () => {
  const path = resolve(AUDIO_STANDARD_PATH);
  if (!existsSync(path)) throw new Error(`Audio-Standard fehlt: ${AUDIO_STANDARD_PATH}`);
  const standard = readJson(path);
  if (standard.id !== VOICEOVER_PROCESSING_CONTRACT_ID) {
    throw new Error(`Unbekannter Audio-Standard: ${String(standard.id)}`);
  }
  return standard;
};

export const resolveVoiceoverProject = (rootInput, explicitKind = null) => {
  const root = resolve(rootInput);
  let kind = explicitKind;

  if (!kind) {
    if (isInside(resolve('reels'), root)) kind = 'reel';
    else if (isInside(resolve('youtube'), root)) kind = 'youtube';
  }

  if (!['reel', 'youtube'].includes(kind)) {
    throw new Error('Projekt muss unter reels/ oder youtube/ liegen.');
  }

  const audioDirectory = kind === 'reel' ? '02-audio' : '03-audio';
  const timingsRelative = kind === 'reel' ? '04-caption/word-timings.json' : '03-audio/word-timings.json';
  const standard = readVoiceoverStandard();

  return {
    root,
    kind,
    standard,
    audioDir: resolve(root, audioDirectory),
    rawDir: resolve(root, audioDirectory, 'raw'),
    outputPath: resolve(root, audioDirectory, standard.voiceover.outputFile),
    metadataPath: resolve(root, audioDirectory, standard.voiceover.metadataFile),
    timingsPath: resolve(root, timingsRelative),
    outputFile: standard.voiceover.outputFile,
    metadataFile: standard.voiceover.metadataFile,
    timingsRelative,
  };
};

export const isSupportedAudioFile = (fileName) => {
  const index = String(fileName).lastIndexOf('.');
  if (index < 0) return false;
  return SUPPORTED_AUDIO_EXTENSIONS.has(String(fileName).slice(index).toLowerCase());
};

const sameNumber = (a, b) => Number.isFinite(Number(a)) && Math.abs(Number(a) - Number(b)) < 1e-9;

export const validateVoiceoverProcessing = (rootInput, {kind = null} = {}) => {
  const project = resolveVoiceoverProject(rootInput, kind);
  const {standard} = project;
  const errors = [];
  let metadata = null;
  let timings = null;

  if (!existsSync(project.metadataPath)) {
    errors.push(`${project.metadataFile} fehlt. Zuerst npm run audio:process -- <Projektpfad> ausführen.`);
  } else {
    try {
      metadata = readJson(project.metadataPath);
    } catch (error) {
      errors.push(`${project.metadataFile} ist ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (!existsSync(project.outputPath)) {
    errors.push(`Verarbeitetes Voiceover fehlt: ${project.outputFile}`);
  }

  if (metadata) {
    if (metadata.contractId !== standard.id) errors.push(`contractId muss ${standard.id} sein.`);
    if (metadata.processedFile !== project.outputFile) errors.push(`processedFile muss ${project.outputFile} sein.`);
    if (metadata.timingAuthority !== 'processed-voiceover') errors.push('timingAuthority muss processed-voiceover sein.');
    if (!sameNumber(metadata.speed, standard.voiceover.playbackSpeed)) errors.push(`speed muss ${standard.voiceover.playbackSpeed} sein.`);
    if (!sameNumber(metadata.silenceThresholdDb, standard.voiceover.silenceThresholdDb)) errors.push(`silenceThresholdDb muss ${standard.voiceover.silenceThresholdDb} sein.`);
    if (!sameNumber(metadata.minimumLongPauseSeconds, standard.voiceover.minimumSilenceSeconds)) errors.push(`minimumLongPauseSeconds muss ${standard.voiceover.minimumSilenceSeconds} sein.`);
    if (!sameNumber(metadata.retainedPauseSeconds, standard.voiceover.targetLongPauseSeconds)) errors.push(`retainedPauseSeconds muss ${standard.voiceover.targetLongPauseSeconds} sein.`);
    if (!Number.isFinite(Number(metadata.durationAfter)) || Number(metadata.durationAfter) <= 0) errors.push('durationAfter muss > 0 sein.');

    const sourceFile = normalizeSlashes(metadata.sourceFile ?? '');
    if (!sourceFile.startsWith('raw/') || sourceFile.includes('../')) {
      errors.push('sourceFile muss auf eine Datei innerhalb des raw/-Ordners zeigen.');
    } else if (!existsSync(resolve(project.audioDir, sourceFile))) {
      errors.push(`Raw-Voiceover fehlt: ${sourceFile}`);
    }
  }

  if (!existsSync(project.timingsPath)) {
    errors.push(`${project.timingsRelative} fehlt.`);
  } else {
    try {
      timings = readJson(project.timingsPath);
      if (basename(String(timings.source ?? '')) !== project.outputFile) {
        errors.push(`word-timings.json muss aus ${project.outputFile} erzeugt sein; aktuell: ${String(timings.source ?? '<leer>')}.`);
      }

      if (metadata && Number.isFinite(Number(metadata.durationAfter)) && Number.isFinite(Number(timings.duration))) {
        const tolerance = Number(standard.timingAuthority.durationToleranceSeconds ?? 0.35);
        if (Math.abs(Number(timings.duration) - Number(metadata.durationAfter)) > tolerance) {
          errors.push(`Timing-Dauer (${timings.duration}s) passt nicht zum verarbeiteten Voiceover (${metadata.durationAfter}s), Toleranz ${tolerance}s.`);
        }
      } else if (!Number.isFinite(Number(timings.duration)) || Number(timings.duration) <= 0) {
        errors.push('word-timings.json benötigt eine gültige duration > 0.');
      }
    } catch (error) {
      errors.push(`${project.timingsRelative} ist ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {ok: errors.length === 0, errors, project, metadata, timings};
};
