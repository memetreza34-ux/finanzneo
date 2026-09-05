export const YOUTUBE_MOTION_STANDARD_ID = 'finanzneo-youtube-motion-v2';

export const YOUTUBE_VISUAL_TYPES = ['image', 'animation', 'hybrid', 'data'];
export const YOUTUBE_MOTION_VISUAL_TYPES = new Set(['animation', 'hybrid', 'data']);
export const YOUTUBE_IMAGE_VISUAL_TYPES = new Set(['image', 'hybrid']);

export const YOUTUBE_MOTION_FAMILIES = [
  'spatial-3d',
  'vector-motion',
  'css-3d',
  'kinetic-type',
  'data-viz',
  'timeline',
  'document-motion',
  'image-composite',
  'simulation',
  'comparison',
  'camera-journey',
  'custom',
];

export const requiresYouTubeMotion = (visual) => YOUTUBE_MOTION_VISUAL_TYPES.has(visual?.type);
export const requiresYouTubeImage = (visual) => YOUTUBE_IMAGE_VISUAL_TYPES.has(visual?.type);

export const motionSourcePathFor = (visual) => visual?.animationSourceFile ?? '';

export const validateYouTubeMotionMetadata = (visual) => {
  if (!requiresYouTubeMotion(visual)) return [];
  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];
  const requiredString = (field) => {
    if (typeof visual?.[field] !== 'string' || !visual[field].trim()) {
      errors.push(`${id}: ${field} fehlt.`);
    }
  };

  requiredString('animationIntent');
  requiredString('mechanicId');
  requiredString('visualTechniqueId');
  requiredString('compositionFamilyId');
  requiredString('animationSourceFile');
  requiredString('animationExport');

  if (!Array.isArray(visual?.motionChannels) || visual.motionChannels.length < 2) {
    errors.push(`${id}: motionChannels benötigt mindestens 2 sinnvolle Kanäle.`);
  }
  if (!Array.isArray(visual?.visualBeats) || visual.visualBeats.length < 2) {
    errors.push(`${id}: visualBeats benötigt mindestens 2 sichtbare Zustände.`);
  }
  if (visual?.compositionFamilyId && !YOUTUBE_MOTION_FAMILIES.includes(visual.compositionFamilyId)) {
    errors.push(`${id}: compositionFamilyId ist unbekannt: ${visual.compositionFamilyId}.`);
  }
  if (visual?.animationSourceFile && !visual.animationSourceFile.endsWith('/animation.tsx')) {
    errors.push(`${id}: animationSourceFile muss auf animation.tsx zeigen.`);
  }
  return errors;
};

export const validateYouTubeMotionVariety = (visuals = []) => {
  const errors = [];
  const motion = visuals.filter(requiresYouTubeMotion);
  const techniqueOwner = new Map();

  for (const visual of motion) {
    const technique = visual?.visualTechniqueId?.trim();
    if (!technique) continue;
    if (techniqueOwner.has(technique) && !visual?.repeatTechniqueReason?.trim()) {
      errors.push(`${visual.id}: visualTechniqueId '${technique}' wird bereits von ${techniqueOwner.get(technique)} verwendet. Wiederholung braucht repeatTechniqueReason.`);
    } else if (!techniqueOwner.has(technique)) {
      techniqueOwner.set(technique, visual.id);
    }
  }

  let runFamily = null;
  let runLength = 0;
  for (const visual of motion) {
    const family = visual?.compositionFamilyId?.trim() || null;
    if (family === runFamily) runLength += 1;
    else {
      runFamily = family;
      runLength = 1;
    }
    if (family && runLength > 2 && !visual?.repeatTechniqueReason?.trim()) {
      errors.push(`${visual.id}: mehr als zwei Motion-Visuals hintereinander aus '${family}'. Nutze eine andere visuelle Familie oder begründe die Wiederholung.`);
    }
  }

  return errors;
};
