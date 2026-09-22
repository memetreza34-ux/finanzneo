export const IMAGE_VISION_QA_ID = 'finanzneo-image-vision-qa-v1';
export const IMAGE_VISION_QA_DIR = '03-szenen/vision-qa';
export const IMAGE_VISION_QA_REQUESTS_DIR = `${IMAGE_VISION_QA_DIR}/requests`;
export const IMAGE_VISION_QA_RESULTS_DIR = `${IMAGE_VISION_QA_DIR}/results`;

export const IMAGE_VISION_QA_THRESHOLDS = Object.freeze({
  planAlignment: 80,
  cameraCompliance: 75,
  actionReadability: 75,
  hookStrength: 72,
  coverHookStrength: 82,
  visualInterest: 72,
  worldConsistency: 85,
  compositionClarity: 75,
  sequenceNovelty: 70,
});

export const HARD_FAIL_FLAGS = Object.freeze([
  'photorealistic',
  'genericFinanceIconMain',
  'staticCatalogLike',
  'wrongBackground',
  'headlineOrSentenceInsideImage',
  'labelBudgetExceeded',
  'sceneMismatch',
]);

export const sha256Hex = async (buffer) => {
  const {createHash} = await import('node:crypto');
  return createHash('sha256').update(buffer).digest('hex');
};

export const expectedVisionQaForScene = (scene, {isCover = false} = {}) => ({
  sceneId: scene.id,
  imageFile: scene.googleFlowFileName,
  isCover,
  expected: {
    visualMode: scene.imageStorytelling?.visualMode ?? '',
    visualArchetype: scene.imageStorytelling?.visualArchetype ?? '',
    cameraAngle: scene.imageStorytelling?.cameraAngle ?? '',
    shotScale: scene.imageStorytelling?.shotScale ?? '',
    locationClass: scene.imageStorytelling?.locationClass ?? '',
    mainSubjectClass: scene.imageStorytelling?.mainSubjectClass ?? '',
    humanPresence: scene.imageStorytelling?.humanPresence ?? '',
    storyAction: scene.imageStorytelling?.storyAction ?? '',
    tensionOrConsequence: scene.imageStorytelling?.tensionOrConsequence ?? '',
    visualHook: scene.imageStorytelling?.visualHook ?? '',
    causeEffect: scene.imageStorytelling?.causeEffect ?? '',
    labelBudget: Number(scene.imageStorytelling?.labelBudget ?? 0),
  },
});

const validScore = (value) => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100;

export const evaluateVisionQaResult = (result, {isCover = false} = {}) => {
  const errors = [];
  if (result?.contractId !== IMAGE_VISION_QA_ID) errors.push(`contractId muss ${IMAGE_VISION_QA_ID} sein.`);
  if (result?.evaluatorMode !== 'multimodal-pixel-review') errors.push('evaluatorMode muss multimodal-pixel-review sein.');
  if (!Array.isArray(result?.evidence) || result.evidence.length < 3 || result.evidence.some((item) => String(item).trim().length < 12)) {
    errors.push('Mindestens 3 konkrete Pixel-Beobachtungen unter evidence erforderlich.');
  }

  const scores = result?.scores ?? {};
  const requiredScores = [
    ['planAlignment', IMAGE_VISION_QA_THRESHOLDS.planAlignment],
    ['cameraCompliance', IMAGE_VISION_QA_THRESHOLDS.cameraCompliance],
    ['actionReadability', IMAGE_VISION_QA_THRESHOLDS.actionReadability],
    ['hookStrength', isCover ? IMAGE_VISION_QA_THRESHOLDS.coverHookStrength : IMAGE_VISION_QA_THRESHOLDS.hookStrength],
    ['visualInterest', IMAGE_VISION_QA_THRESHOLDS.visualInterest],
    ['worldConsistency', IMAGE_VISION_QA_THRESHOLDS.worldConsistency],
    ['compositionClarity', IMAGE_VISION_QA_THRESHOLDS.compositionClarity],
    ['sequenceNovelty', IMAGE_VISION_QA_THRESHOLDS.sequenceNovelty],
  ];
  for (const [key, threshold] of requiredScores) {
    if (!validScore(scores[key])) errors.push(`scores.${key} muss 0–100 sein.`);
    else if (Number(scores[key]) < threshold) errors.push(`scores.${key}=${scores[key]} liegt unter ${threshold}.`);
  }

  const flags = result?.flags ?? {};
  for (const flag of HARD_FAIL_FLAGS) {
    if (flags[flag] === true) errors.push(`Hard-Fail-Flag aktiv: ${flag}.`);
    else if (flags[flag] !== false) errors.push(`flags.${flag} muss explizit true oder false sein.`);
  }

  if (flags.genericDeskScene === true && Number(scores.visualInterest) < 85) {
    errors.push('genericDeskScene=true braucht visualInterest >= 85 oder Regeneration.');
  }
  if (flags.deadSpaceDominant === true && Number(scores.compositionClarity) < 85) {
    errors.push('deadSpaceDominant=true braucht compositionClarity >= 85 oder Regeneration.');
  }

  const expectedVerdict = errors.length === 0 ? 'PASS' : 'REGENERATE';
  if (result?.verdict !== expectedVerdict) errors.push(`verdict muss ${expectedVerdict} sein.`);
  if (expectedVerdict === 'REGENERATE' && String(result?.regenerationInstruction ?? '').trim().length < 25) {
    errors.push('Bei REGENERATE ist eine konkrete regenerationInstruction erforderlich.');
  }
  return {errors, expectedVerdict};
};
