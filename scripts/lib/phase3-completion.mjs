import {createHash} from 'node:crypto';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {basename, isAbsolute, relative, resolve} from 'node:path';

export const PHASE3_CONTRACT_ID = 'finanzneo-phase3-completion-v1';
export const PHASE3_MANIFEST_RELATIVE = '05-projektdateien/phase3-production-manifest.json';
export const PHASE3_QA_RELATIVE = '05-projektdateien/phase3-render-qa.json';

const PROJECT_ROOT = resolve('.');
const PLACEHOLDER = /\[|EINFÜGEN|TODO|TBD|PLACEHOLDER/i;

export const phase3CompletionContractFields = () => ({
  id: PHASE3_CONTRACT_ID,
  required: true,
  productionManifest: PHASE3_MANIFEST_RELATIVE,
  renderQa: PHASE3_QA_RELATIVE,
  allScenesMustBeImplemented: true,
  imageVisualRequired: true,
  animationVisualRequired: true,
  captionOnlySceneForbidden: true,
  postRenderVisualQaRequired: true,
  exportRequiresPassedRenderQa: true,
  exactVideoHashRequiredForExport: true,
  finalVideoExistsOnlyAfterQaPass: true,
  visualQa: {
    sampleImageRatios: [0.5],
    sampleAnimationRatios: [0.2, 0.5, 0.8],
    minStdDev: 4,
    minContrastP90P10: 12,
    minEdgeMean: 0.5,
    minAnimationMeanAbsDiff: 1,
  },
});

export const normalizeRepoPath = (path) => String(path).replaceAll('\\', '/').replace(/^\.\//, '');

export const resolveProjectPath = (input) => {
  const absolute = isAbsolute(input) ? resolve(input) : resolve(PROJECT_ROOT, input);
  const rel = relative(PROJECT_ROOT, absolute);
  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`Pfad liegt außerhalb des Projekts: ${input}`);
  }
  return absolute;
};

const readJson = (path, label) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`${label} ist kein gültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const ensureFile = (path, label, minBytes = 1) => {
  if (!existsSync(path)) throw new Error(`${label} fehlt: ${normalizeRepoPath(relative(PROJECT_ROOT, path))}`);
  const stat = statSync(path);
  if (!stat.isFile()) throw new Error(`${label} ist keine Datei: ${normalizeRepoPath(relative(PROJECT_ROOT, path))}`);
  if (stat.size < minBytes) throw new Error(`${label} ist zu klein/leer: ${normalizeRepoPath(relative(PROJECT_ROOT, path))}`);
};

export const sha256File = (path) => {
  const hash = createHash('sha256');
  hash.update(readFileSync(path));
  return hash.digest('hex');
};

export const createPhase3ManifestSkeleton = (reelRoot, {composition, entryPoint = 'src/index.ts', output} = {}) => {
  const root = resolve(reelRoot);
  const indexPath = resolve(root, '03-szenen/scene-index.json');
  ensureFile(indexPath, 'scene-index.json');
  const index = readJson(indexPath, 'scene-index.json');
  const scenes = Array.isArray(index.scenes) ? index.scenes : [];
  if (scenes.length === 0) throw new Error('scene-index.json enthält keine Szenen.');

  const reelProject = normalizeRepoPath(relative(PROJECT_ROOT, root));
  const reelName = basename(root);

  return {
    version: 1,
    contractId: PHASE3_CONTRACT_ID,
    name: index.title ?? reelName,
    reelProject,
    composition: composition ?? '',
    compositionSourcePath: '',
    entryPoint,
    output: output ?? `out/${reelName}.mp4`,
    status: 'IMPLEMENTING',
    globalLayers: {
      audioImplemented: false,
      captionsImplemented: false,
      sceneHeadersImplemented: false,
    },
    assets: [],
    scenes: scenes.map((scene) => ({
      id: scene.id,
      type: scene.type,
      implemented: false,
      visualKind: scene.type,
      visualLayerRequired: true,
      captionOnlyForbidden: true,
      startFrame: null,
      durationFrames: null,
      ...(scene.type === 'image'
        ? {sourceImageFileName: scene.googleFlowFileName ?? '', assetPath: ''}
        : {componentPath: '', componentExport: ''}),
    })),
  };
};

export const validatePhase3Manifest = (reelRoot, manifestOverride = null) => {
  const root = resolve(reelRoot);
  const indexPath = resolve(root, '03-szenen/scene-index.json');
  ensureFile(indexPath, 'scene-index.json');
  const index = readJson(indexPath, 'scene-index.json');
  const contract = index.phase3CompletionContract;

  if (contract?.id !== PHASE3_CONTRACT_ID || contract?.required !== true) {
    throw new Error(`scene-index.json benötigt den Phase-3-Vertrag ${PHASE3_CONTRACT_ID}.`);
  }

  const manifestPath = manifestOverride
    ? resolveProjectPath(manifestOverride)
    : resolve(root, contract.productionManifest ?? PHASE3_MANIFEST_RELATIVE);
  ensureFile(manifestPath, 'Phase-3-Produktionsmanifest');
  const manifest = readJson(manifestPath, 'Phase-3-Produktionsmanifest');
  const failures = [];
  const expectedScenes = Array.isArray(index.scenes) ? index.scenes : [];
  const actualScenes = Array.isArray(manifest.scenes) ? manifest.scenes : [];
  const expectedProject = normalizeRepoPath(relative(PROJECT_ROOT, root));

  const fail = (message) => failures.push(message);
  if (manifest.contractId !== PHASE3_CONTRACT_ID) fail(`contractId muss ${PHASE3_CONTRACT_ID} sein.`);
  if (normalizeRepoPath(manifest.reelProject) !== expectedProject) fail(`reelProject muss ${expectedProject} sein.`);
  if (manifest.status !== 'READY_TO_RENDER') fail('status muss READY_TO_RENDER sein.');
  if (typeof manifest.composition !== 'string' || !manifest.composition.trim() || PLACEHOLDER.test(manifest.composition)) fail('composition fehlt oder ist Platzhalter.');
  if (typeof manifest.compositionSourcePath !== 'string' || !manifest.compositionSourcePath.trim() || PLACEHOLDER.test(manifest.compositionSourcePath)) fail('compositionSourcePath fehlt oder ist Platzhalter.');
  if (typeof manifest.entryPoint !== 'string' || !manifest.entryPoint.trim()) fail('entryPoint fehlt.');
  if (typeof manifest.output !== 'string' || !manifest.output.trim() || !manifest.output.toLowerCase().endsWith('.mp4')) fail('output muss auf eine MP4 zeigen.');

  for (const [key, label] of [
    ['audioImplemented', 'Audio-Layer'],
    ['captionsImplemented', 'Caption-Layer'],
    ['sceneHeadersImplemented', 'SceneHeader-Layer'],
  ]) {
    if (manifest.globalLayers?.[key] !== true) fail(`${label} ist nicht als implementiert bestätigt.`);
  }

  try {
    ensureFile(resolveProjectPath(manifest.entryPoint), 'Remotion entryPoint', 20);
    ensureFile(resolveProjectPath(manifest.compositionSourcePath), 'Composition-Quelldatei', 100);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  if (actualScenes.length !== expectedScenes.length) {
    fail(`Produktionsmanifest hat ${actualScenes.length} Szenen, erwartet ${expectedScenes.length}.`);
  }

  let expectedStart = 0;
  const validatedScenes = [];

  expectedScenes.forEach((expected, position) => {
    const actual = actualScenes[position];
    if (!actual) return;
    const label = expected.id ?? `scene-${position + 1}`;

    if (actual.id !== expected.id) fail(`${label}: Reihenfolge/ID stimmt nicht mit scene-index.json überein.`);
    if (actual.type !== expected.type) fail(`${label}: type muss ${expected.type} sein.`);
    if (actual.visualKind !== expected.type) fail(`${label}: visualKind muss ${expected.type} sein.`);
    if (actual.implemented !== true) fail(`${label}: Visual ist nicht als implemented=true markiert.`);
    if (actual.visualLayerRequired !== true) fail(`${label}: visualLayerRequired muss true sein.`);
    if (actual.captionOnlyForbidden !== true) fail(`${label}: captionOnlyForbidden muss true sein.`);

    const startFrame = Number(actual.startFrame);
    const durationFrames = Number(actual.durationFrames);
    if (!Number.isInteger(startFrame) || startFrame < 0) fail(`${label}: startFrame fehlt/ist ungültig.`);
    if (!Number.isInteger(durationFrames) || durationFrames <= 0) fail(`${label}: durationFrames fehlt/ist ungültig.`);
    if (Number.isInteger(startFrame) && startFrame !== expectedStart) fail(`${label}: startFrame ${startFrame} ist nicht lückenlos; erwartet ${expectedStart}.`);
    if (Number.isInteger(durationFrames) && durationFrames > 0) expectedStart = startFrame + durationFrames;

    if (expected.type === 'image') {
      if (actual.sourceImageFileName !== expected.googleFlowFileName) fail(`${label}: sourceImageFileName stimmt nicht mit googleFlowFileName überein.`);
      if (typeof actual.assetPath !== 'string' || !actual.assetPath.trim() || PLACEHOLDER.test(actual.assetPath)) {
        fail(`${label}: assetPath fehlt.`);
      } else {
        try { ensureFile(resolveProjectPath(actual.assetPath), `${label} Bild-Asset`, 100); } catch (error) { fail(error instanceof Error ? error.message : String(error)); }
      }
    } else if (expected.type === 'animation') {
      if (typeof actual.componentPath !== 'string' || !actual.componentPath.trim() || PLACEHOLDER.test(actual.componentPath)) {
        fail(`${label}: componentPath fehlt.`);
      } else if (typeof actual.componentExport !== 'string' || !actual.componentExport.trim() || PLACEHOLDER.test(actual.componentExport)) {
        fail(`${label}: componentExport fehlt.`);
      } else {
        try {
          const componentPath = resolveProjectPath(actual.componentPath);
          ensureFile(componentPath, `${label} Animationskomponente`, 150);
          const source = readFileSync(componentPath, 'utf8');
          if (!source.includes(actual.componentExport)) fail(`${label}: componentExport ${actual.componentExport} ist in ${actual.componentPath} nicht auffindbar.`);
          if (PLACEHOLDER.test(source)) fail(`${label}: Animationskomponente enthält TODO/Platzhalter.`);
        } catch (error) {
          fail(error instanceof Error ? error.message : String(error));
        }
      }
    }

    validatedScenes.push({...actual, startFrame, durationFrames});
  });

  if (expectedStart <= 0) fail('Gesamttimeline hat keine positive Dauer.');

  if (failures.length > 0) {
    throw new Error(`Phase-3-Preflight nicht erfüllt:\n- ${failures.join('\n- ')}`);
  }

  return {root, index, manifest, manifestPath, scenes: validatedScenes, totalFrames: expectedStart};
};
