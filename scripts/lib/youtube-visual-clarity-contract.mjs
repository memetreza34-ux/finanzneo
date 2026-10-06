export const YOUTUBE_VISUAL_CLARITY_STANDARD_ID = 'finanzneo-youtube-clarity-v1';
export const YOUTUBE_VISUAL_CLARITY_MIN_RESULT_HOLD_FRAMES = 30;

export const YOUTUBE_VISUAL_CLARITY_REQUIRED_FIELDS = [
  'coreMessage',
  'visualForm',
  'twoSecondTakeaway',
  'whyThisForm',
];

const text = (value) => typeof value === 'string' && value.trim().length > 0;

export const validateYouTubeVisualClarity = (visual) => {
  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];

  for (const field of YOUTUBE_VISUAL_CLARITY_REQUIRED_FIELDS) {
    if (!text(visual?.[field])) errors.push(`${id}: ${field} fehlt.`);
  }

  if (!Array.isArray(visual?.essentialElements) || visual.essentialElements.length < 1 || visual.essentialElements.some((item) => !text(item))) {
    errors.push(`${id}: essentialElements braucht mindestens ein wirklich notwendiges Element.`);
  }

  if (Array.isArray(visual?.essentialElements) && visual.essentialElements.length > 6) {
    errors.push(`${id}: mehr als 6 essentialElements. Szene vermutlich zu voll; auf den Kerngedanken reduzieren.`);
  }

  if (['animation', 'hybrid', 'data'].includes(visual?.type)) {
    const plan = visual?.clarityPlan;
    for (const field of ['start', 'change', 'result']) {
      if (!text(plan?.[field])) errors.push(`${id}: clarityPlan.${field} fehlt.`);
    }
    if (!Number.isFinite(Number(plan?.resultHoldFrames)) || Number(plan.resultHoldFrames) < YOUTUBE_VISUAL_CLARITY_MIN_RESULT_HOLD_FRAMES) {
      errors.push(`${id}: clarityPlan.resultHoldFrames muss mindestens ${YOUTUBE_VISUAL_CLARITY_MIN_RESULT_HOLD_FRAMES} Frames betragen.`);
    }
  }

  return errors;
};
