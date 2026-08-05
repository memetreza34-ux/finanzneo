import fs from 'node:fs';
import path from 'node:path';

export const FINANCE_REEL_BUILD_MANIFEST = 'timeline/reel-build-manifest.json';
export const FINANCE_REEL_BUILD_VERSION = 'finanzneo-reel-build-v1';

export const isSafeRelativeBuildPath = (value) => (
  typeof value === 'string'
  && value.trim().length > 0
  && !path.isAbsolute(value)
  && !value.split(/[\\/]+/).includes('..')
);

const assertSafePath = (value, label) => {
  if (!isSafeRelativeBuildPath(value)) throw new Error(`${label} muss ein sicherer relativer Pfad sein: ${value ?? 'fehlt'}.`);
  return value;
};

const resolveInside = (root, relative, label) => {
  assertSafePath(relative, label);
  const absoluteRoot = path.resolve(root);
  const absolute = path.resolve(absoluteRoot, relative);
  if (absolute !== absoluteRoot && !absolute.startsWith(`${absoluteRoot}${path.sep}`)) {
    throw new Error(`${label} liegt außerhalb des erlaubten Ordners: ${relative}.`);
  }
  return absolute;
};

const requireText = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} fehlt.`);
  return value.trim();
};

export const loadFinanceReelBuildManifest = ({projectRoot, technicalRoot = process.cwd(), requireReady = false}) => {
  const absoluteProjectRoot = path.resolve(projectRoot);
  const absoluteTechnicalRoot = path.resolve(technicalRoot);
  const manifestFile = path.join(absoluteProjectRoot, FINANCE_REEL_BUILD_MANIFEST);
  if (!fs.existsSync(manifestFile) || !fs.statSync(manifestFile).isFile()) {
    throw new Error(`Allgemeines Reel-Build-Manifest fehlt: ${manifestFile}`);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  } catch (error) {
    throw new Error(`Reel-Build-Manifest ist kein gültiges JSON: ${error.message}`);
  }

  if (manifest.version !== FINANCE_REEL_BUILD_VERSION) {
    throw new Error(`Manifestversion muss ${FINANCE_REEL_BUILD_VERSION} sein.`);
  }
  requireText(manifest.slug, 'slug');
  if (!['awaiting-prebuild', 'prebuilt-ready'].includes(manifest.status)) {
    throw new Error('status muss awaiting-prebuild oder prebuilt-ready sein.');
  }
  if (manifest.codexAnimationCodingRequired !== false) {
    throw new Error('codexAnimationCodingRequired muss false sein. Animationen werden vor Codex programmiert.');
  }
  if (requireReady && manifest.status !== 'prebuilt-ready') {
    throw new Error('Dieses Reel ist noch nicht vorprogrammiert. Die Vorarbeit muss Composition und Animationen fertigstellen und status auf prebuilt-ready setzen. Codex darf sie nicht selbst entwerfen.');
  }

  const composition = manifest.composition ?? {};
  requireText(composition.id, 'composition.id');
  assertSafePath(composition.entryPoint, 'composition.entryPoint');
  assertSafePath(composition.sourceRoot, 'composition.sourceRoot');

  const runtime = manifest.runtime ?? {};
  assertSafePath(runtime.prepareScript ?? 'scripts/prepare-finance-reel-runtime.mjs', 'runtime.prepareScript');
  assertSafePath(runtime.propsFile ?? 'render/reel-render-props.json', 'runtime.propsFile');
  assertSafePath(runtime.manifestFile ?? 'timeline/runtime-manifest.json', 'runtime.manifestFile');

  const outputs = {
    video: manifest.outputs?.video ?? '06-video/final-reel.mp4',
    cover: manifest.outputs?.cover ?? '00-cover/cover.png',
    contactSheet: manifest.outputs?.contactSheet ?? '05-review/contact-sheet.png',
    qaReport: manifest.outputs?.qaReport ?? '05-review/codex-render-qa.json',
    buildReport: manifest.outputs?.buildReport ?? '05-review/build-report.json',
    qaDirectory: manifest.outputs?.qaDirectory ?? '05-review/render-qa',
  };
  for (const [key, value] of Object.entries(outputs)) assertSafePath(value, `outputs.${key}`);

  const expectedSourceFiles = Array.isArray(manifest.expectedSourceFiles) ? manifest.expectedSourceFiles : [];
  for (const [index, source] of expectedSourceFiles.entries()) assertSafePath(source, `expectedSourceFiles[${index}]`);

  const animations = Array.isArray(manifest.animations) ? manifest.animations : [];
  for (const [index, animation] of animations.entries()) {
    requireText(animation.sceneId, `animations[${index}].sceneId`);
    requireText(animation.component, `animations[${index}].component`);
    assertSafePath(animation.source, `animations[${index}].source`);
    if (animation.editableByCodex !== false) throw new Error(`animations[${index}].editableByCodex muss false sein.`);
  }

  return {
    manifest,
    manifestFile,
    projectRoot: absoluteProjectRoot,
    technicalRoot: absoluteTechnicalRoot,
    channelRoot: path.join(absoluteTechnicalRoot, 'channels', 'finanzneo'),
    composition: {
      ...composition,
      entryPointAbsolute: resolveInside(absoluteTechnicalRoot, composition.entryPoint, 'composition.entryPoint'),
      sourceRootAbsolute: resolveInside(absoluteTechnicalRoot, composition.sourceRoot, 'composition.sourceRoot'),
    },
    runtime: {
      ...runtime,
      prepareScript: runtime.prepareScript ?? 'scripts/prepare-finance-reel-runtime.mjs',
      propsFile: runtime.propsFile ?? 'render/reel-render-props.json',
      manifestFile: runtime.manifestFile ?? 'timeline/runtime-manifest.json',
      prepareScriptAbsolute: resolveInside(absoluteTechnicalRoot, runtime.prepareScript ?? 'scripts/prepare-finance-reel-runtime.mjs', 'runtime.prepareScript'),
      propsFileAbsolute: resolveInside(absoluteProjectRoot, runtime.propsFile ?? 'render/reel-render-props.json', 'runtime.propsFile'),
      manifestFileAbsolute: resolveInside(absoluteProjectRoot, runtime.manifestFile ?? 'timeline/runtime-manifest.json', 'runtime.manifestFile'),
    },
    outputs,
    outputFiles: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, resolveInside(absoluteProjectRoot, value, `outputs.${key}`)])),
    expectedSourceFiles: expectedSourceFiles.map((relative) => ({relative, absolute: resolveInside(absoluteTechnicalRoot, relative, 'expectedSourceFiles')})),
    animations: animations.map((animation) => ({
      ...animation,
      sourceAbsolute: resolveInside(absoluteTechnicalRoot, animation.source, 'animation.source'),
    })),
  };
};
