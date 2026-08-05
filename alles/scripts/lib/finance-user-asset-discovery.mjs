import fs from 'node:fs';
import path from 'node:path';

export const FINANCE_IMAGE_EXTENSIONS = Object.freeze([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
]);

export const FINANCE_AUDIO_EXTENSIONS = Object.freeze([
  '.wav',
  '.mp3',
  '.m4a',
  '.aac',
  '.flac',
  '.ogg',
  '.opus',
  '.mp4',
  '.mov',
  '.m4v',
  '.webm',
]);

const normalizeExtension = (file) => path.extname(file).toLocaleLowerCase('de-DE');

export const isSafeRelativePath = (value) => (
  typeof value === 'string'
  && value.trim().length > 0
  && !path.isAbsolute(value)
  && !value.split(/[\\/]+/).includes('..')
);

export const sceneFolderForIndex = (index) => (
  `03-szenen/EINZELNE-SZENEN/scene-${String(index + 1).padStart(2, '0')}`
);

export const inspectSingleUserAsset = ({
  projectRoot,
  relativeDirectory,
  extensions,
  label,
}) => {
  if (!isSafeRelativePath(relativeDirectory)) {
    return {
      ok: false,
      code: 'unsafe-directory',
      message: `${label}: unsicherer oder leerer Ordnerpfad: ${relativeDirectory ?? 'fehlt'}.`,
      candidates: [],
    };
  }

  const absoluteDirectory = path.resolve(projectRoot, relativeDirectory);
  const safeRoot = `${path.resolve(projectRoot)}${path.sep}`;
  if (!absoluteDirectory.startsWith(safeRoot)) {
    return {
      ok: false,
      code: 'outside-project',
      message: `${label}: Ordner liegt außerhalb des Reel-Projekts: ${relativeDirectory}.`,
      candidates: [],
    };
  }

  if (!fs.existsSync(absoluteDirectory) || !fs.statSync(absoluteDirectory).isDirectory()) {
    return {
      ok: false,
      code: 'missing-directory',
      message: `${label}: Ordner fehlt: ${relativeDirectory}.`,
      candidates: [],
    };
  }

  const allowed = new Set(extensions.map((extension) => extension.toLocaleLowerCase('de-DE')));
  const candidates = fs.readdirSync(absoluteDirectory, {withFileTypes: true})
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.') && allowed.has(normalizeExtension(entry.name)))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, 'de-DE'));

  if (candidates.length === 0) {
    return {
      ok: false,
      code: 'missing-file',
      message: `${label}: keine unterstützte Mediendatei in ${relativeDirectory}. Erlaubt: ${[...allowed].join(', ')}.`,
      candidates,
    };
  }

  if (candidates.length > 1) {
    return {
      ok: false,
      code: 'ambiguous',
      message: `${label}: mehrere passende Dateien in ${relativeDirectory}: ${candidates.join(', ')}. Pro Ordner genau eine Mediendatei ablegen.`,
      candidates,
    };
  }

  const relativeFile = path.posix.join(relativeDirectory.split(path.sep).join('/'), candidates[0]);
  return {
    ok: true,
    code: 'ready',
    relativeDirectory,
    relativeFile,
    absoluteDirectory,
    absoluteFile: path.resolve(projectRoot, relativeFile),
    fileName: candidates[0],
    extension: normalizeExtension(candidates[0]),
    candidates,
  };
};

export const resolveVoiceoverAsset = (projectRoot, voiceover = {}) => {
  const relativeDirectory = voiceover.directory
    ?? voiceover.assetDirectory
    ?? '02-audio';

  return inspectSingleUserAsset({
    projectRoot,
    relativeDirectory,
    extensions: FINANCE_AUDIO_EXTENSIONS,
    label: 'Voiceover',
  });
};

export const resolveSceneImageAsset = (projectRoot, scene, sceneIndex) => {
  const relativeDirectory = scene?.image?.directory
    ?? scene?.image?.assetDirectory
    ?? sceneFolderForIndex(sceneIndex);

  return inspectSingleUserAsset({
    projectRoot,
    relativeDirectory,
    extensions: FINANCE_IMAGE_EXTENSIONS,
    label: scene?.id ? `Bildszene ${scene.id}` : `Bildszene ${sceneIndex + 1}`,
  });
};
