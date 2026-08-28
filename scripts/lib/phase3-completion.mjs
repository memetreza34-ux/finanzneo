import {createHash} from 'node:crypto';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {basename, isAbsolute, relative, resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK} from './reel-scene-schema.mjs';

export const PHASE3_CONTRACT_ID = 'finanzneo-phase3-completion-v1';
export const PHASE3_MANIFEST_RELATIVE = '05-projektdateien/phase3-production-manifest.json';
export const PHASE3_QA_RELATIVE = '05-projektdateien/phase3-render-qa.json';
export const PHASE1_ANIMATION_SEAL_RELATIVE = '05-projektdateien/phase1-animation-seal.json';
export const REEL_BACKGROUND_CONTRACT_ID = 'finanzneo-pure-black-background-v1';

const PROJECT_ROOT = resolve('.');
const PLACEHOLDER = /\[|EINFÜGEN|TODO|TBD|PLACEHOLDER|PHASE 1 ANIMATION CODE NOT COMPLETED/i;

export const phase3CompletionContractFields = () => ({
  id: PHASE3_CONTRACT_ID,
  required: true,
  productionManifest: PHASE3_MANIFEST_RELATIVE,
  renderQa: PHASE3_QA_RELATIVE,
  phase1AnimationSeal: PHASE1_ANIMATION_SEAL_RELATIVE,
  reelBackgroundContractId: REEL_BACKGROUND_CONTRACT_ID,
  allScenesMustBeImplemented: true,
  imageVisualRequired: true,
  animationVisualRequired: true,
  captionOnlySceneForbidden: true,
  postRenderVisualQaRequired: true,
  exportRequiresPassedRenderQa: true,
  exactVideoHashRequiredForExport: true,
  finalVideoExistsOnlyAfterQaPass: true,
  canonicalPhase1AnimationRequired: true,
  phase3MayNotReplaceCanonicalAnimation: true,
  phase1AnimationHashMustMatchSeal: true,
  pureBlackBackgroundRequired: true,
  decorativeBackgroundEffectsForbidden: true,
  backgroundMotionDoesNotCountAsAnimation: true,
  blackOrEmptyVisualMustFail: true,
  visualQa: {
    sampleImageRatios: [0.5],
    sampleAnimationRatios: [0.2, 0.5, 0.8],
    sampleBackgroundPerScene: true,
    minStdDev: 4,
    minContrastP90P10: 12,
    minEdgeMean: 0.5,
    minActivePixelRatio: 0.04,
    minAnimationMeanAbsDiff: 1,
    maxBackgroundMean: 12,
    maxBackgroundStdDev: 4,
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
    throw new Error(`${label} ist kein gültiges JSON: ${error instanceof Error ? error.message : String(error)}`, {cause: error});
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

const canonicalAnimationAbsolute = (root, scene) => resolve(
  root,
  '03-szenen',
  String(scene.animationSourceFile ?? '').replace(/^03-szenen\//, ''),
);

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
    version: 2,
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
    scenes: scenes.map((scene) => {
      if (scene.type === 'image') {
        return {
          id: scene.id,
          type: scene.type,
          implemented: false,
          visualKind: scene.type,
          visualLayerRequired: true,
          captionOnlyForbidden: true,
          startFrame: null,
          durationFrames: null,
          sourceImageFileName: scene.googleFlowFileName ?? '',
          assetPath: '',
        };
      }

      const canonicalAbsolute = canonicalAnimationAbsolute(root, scene);
      const canonicalSourcePath = normalizeRepoPath(relative(PROJECT_ROOT, canonicalAbsolute));
      return {
        id: scene.id,
        type: scene.type,
        implemented: false,
        visualKind: scene.type,
        visualLayerRequired: true,
        captionOnlyForbidden: true,
        startFrame: null,
        durationFrames: null,
        canonicalSourcePath,
        canonicalSourceSha256: existsSync(canonicalAbsolute) ? sha256File(canonicalAbsolute) : '',
        componentPath: canonicalSourcePath,
        componentExport: scene.animationExport ?? '',
      };
    }),
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
  if (contract?.reelBackgroundContractId !== REEL_BACKGROUND_CONTRACT_ID) {
    throw new Error(`scene-index.json benötigt den Reel-Background-Vertrag ${REEL_BACKGROUND_CONTRACT_ID}.`);
  }
  if (contract?.pureBlackBackgroundRequired !== true || contract?.decorativeBackgroundEffectsForbidden !== true) {
    throw new Error('Phase-3-Vertrag muss statischen Pure-Black-Hintergrund ohne dekorative Hintergrundeffekte erzwingen.');
  }
  if (contract?.backgroundMotionDoesNotCountAsAnimation !== true || contract?.blackOrEmptyVisualMustFail !== true) {
    throw new Error('Phase-3-Vertrag muss Background-Motion als Animationsnachweis ablehnen und schwarze/leere Visuals blockieren.');
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

  let animationSeal = null;
  const expectedAnimations = expectedScenes.filter((scene) => scene?.type === 'animation');
  if (expectedAnimations.length > 0) {
    const sealPath = resolve(root, contract.phase1AnimationSeal ?? PHASE1_ANIMATION_SEAL_RELATIVE);
    try {
      ensureFile(sealPath, 'Phase-1-Animationsseal', 100);
      animationSeal = readJson(sealPath, 'Phase-1-Animationsseal');
      if (animationSeal.lockId !== ANIMATION_QUALITY_LOCK) fail(`Animationsseal.lockId muss ${ANIMATION_QUALITY_LOCK} sein.`);
      if (animationSeal.sceneIndexSha256 !== sha256File(indexPath)) fail('scene-index.json wurde nach dem Phase-1-Animationsseal verändert.');
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
    }
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
      if (expected.animationQualityLock !== ANIMATION_QUALITY_LOCK) fail(`${label}: scene-index hat keinen gültigen Phase-1-Animationslock.`);
      if (typeof expected.animationSourceFile !== 'string' || !expected.animationSourceFile.trim()) {
        fail(`${label}: animationSourceFile fehlt im scene-index.`);
      } else {
        try {
          const canonicalAbsolute = canonicalAnimationAbsolute(root, expected);
          ensureFile(canonicalAbsolute, `${label} kanonische Phase-1-Animation`, 900);
          const canonicalRepoPath = normalizeRepoPath(relative(PROJECT_ROOT, canonicalAbsolute));
          const canonicalHash = sha256File(canonicalAbsolute);
          const sealed = animationSeal?.sources?.find((entry) => entry?.id === expected.id);

          if (!sealed) fail(`${label}: fehlt im Phase-1-Animationsseal.`);
          else {
            if (sealed.animationSourceFile !== expected.animationSourceFile) fail(`${label}: Seal-Quellpfad stimmt nicht mit scene-index überein.`);
            if (sealed.animationExport !== expected.animationExport) fail(`${label}: Seal-Export stimmt nicht mit scene-index überein.`);
            if (sealed.sha256 !== canonicalHash) fail(`${label}: kanonischer Phase-1-Animationscode wurde nach reel:ready verändert.`);
          }

          if (actual.canonicalSourcePath !== canonicalRepoPath) fail(`${label}: canonicalSourcePath muss direkt auf die Phase-1-Quelle zeigen.`);
          if (actual.componentPath !== canonicalRepoPath) fail(`${label}: Phase 3 darf die Animation nicht ersetzen; componentPath muss die kanonische Phase-1-Quelle sein.`);
          if (actual.componentExport !== expected.animationExport) fail(`${label}: componentExport muss ${expected.animationExport} sein.`);
          if (actual.canonicalSourceSha256 !== canonicalHash) fail(`${label}: canonicalSourceSha256 stimmt nicht mit der versiegelten Phase-1-Quelle überein.`);

          const source = readFileSync(canonicalAbsolute, 'utf8');
          if (!source.includes(expected.animationExport)) fail(`${label}: Export ${expected.animationExport} fehlt in der kanonischen Phase-1-Quelle.`);
          if (PLACEHOLDER.test(source)) fail(`${label}: kanonische Phase-1-Animationsquelle enthält TODO/Platzhalter.`);
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
