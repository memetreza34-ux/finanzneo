export const YOUTUBE_MOTION_STANDARD_ID = 'finanzneo-youtube-motion-v3';

export const YOUTUBE_VISUAL_TYPES = ['image', 'animation', 'hybrid', 'data'];
export const YOUTUBE_MOTION_VISUAL_TYPES = new Set(['animation', 'hybrid', 'data']);
export const YOUTUBE_IMAGE_VISUAL_TYPES = new Set(['image', 'hybrid']);
export const YOUTUBE_MOTION_QUALITY_TIERS = ['hero', 'support'];

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
  'process-flow',
  'physical-explainer',
  'custom',
];

export const requiresYouTubeMotion = (visual) => YOUTUBE_MOTION_VISUAL_TYPES.has(visual?.type);
export const requiresYouTubeImage = (visual) => YOUTUBE_IMAGE_VISUAL_TYPES.has(visual?.type);
export const motionSourcePathFor = (visual) => visual?.animationSourceFile ?? '';

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

export const validateYouTubeMotionMetadata = (visual) => {
  if (!requiresYouTubeMotion(visual)) return [];
  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];
  const requiredString = (field) => {
    if (!nonEmpty(visual?.[field])) errors.push(`${id}: ${field} fehlt.`);
  };

  for (const field of [
    'animationIntent',
    'viewerTakeaway',
    'mechanicId',
    'visualTechniqueId',
    'compositionFamilyId',
    'animationSourceFile',
    'animationExport',
    'qualityTier',
  ]) requiredString(field);

  if (visual?.qualityTier && !YOUTUBE_MOTION_QUALITY_TIERS.includes(visual.qualityTier)) {
    errors.push(`${id}: qualityTier muss hero oder support sein.`);
  }
  if (visual?.compositionFamilyId && !YOUTUBE_MOTION_FAMILIES.includes(visual.compositionFamilyId)) {
    errors.push(`${id}: compositionFamilyId ist unbekannt: ${visual.compositionFamilyId}.`);
  }
  if (visual?.animationSourceFile && !visual.animationSourceFile.endsWith('/animation.tsx')) {
    errors.push(`${id}: animationSourceFile muss auf animation.tsx zeigen.`);
  }

  const minChannels = visual?.qualityTier === 'hero' ? 4 : 3;
  const minBeats = visual?.qualityTier === 'hero' ? 5 : 4;
  const minEvents = visual?.qualityTier === 'hero' ? 6 : 4;
  if (!Array.isArray(visual?.motionChannels) || visual.motionChannels.length < minChannels) {
    errors.push(`${id}: ${visual?.qualityTier ?? 'support'} Motion benötigt mindestens ${minChannels} sinnvolle Motion-Channels.`);
  }
  if (!Array.isArray(visual?.visualBeats) || visual.visualBeats.length < minBeats) {
    errors.push(`${id}: ${visual?.qualityTier ?? 'support'} Motion benötigt mindestens ${minBeats} sichtbare Story-Beats.`);
  }
  if (!Array.isArray(visual?.motionEvents) || visual.motionEvents.length < minEvents) {
    errors.push(`${id}: ${visual?.qualityTier ?? 'support'} Motion benötigt mindestens ${minEvents} konkrete Motion-Events.`);
  }

  const previewFrames = Number(visual?.previewDurationFrames);
  if (!Number.isInteger(previewFrames) || previewFrames < 90 || previewFrames > 450) {
    errors.push(`${id}: previewDurationFrames muss ganzzahlig zwischen 90 und 450 liegen.`);
  }
  const maxQuietFrames = Number(visual?.maxQuietFrames);
  if (!Number.isInteger(maxQuietFrames) || maxQuietFrames < 30 || maxQuietFrames > 150) {
    errors.push(`${id}: maxQuietFrames muss ganzzahlig zwischen 30 und 150 liegen.`);
  }

  return errors;
};

export const validateYouTubeMotionVariety = (visuals = []) => {
  const errors = [];
  const motion = visuals.filter(requiresYouTubeMotion);
  const techniqueOwner = new Map();
  const mechanicOwner = new Map();

  for (const visual of motion) {
    const technique = visual?.visualTechniqueId?.trim();
    if (technique) {
      if (techniqueOwner.has(technique) && !visual?.repeatTechniqueReason?.trim()) {
        errors.push(`${visual.id}: visualTechniqueId '${technique}' wird bereits von ${techniqueOwner.get(technique)} verwendet. Wiederholung braucht repeatTechniqueReason.`);
      } else if (!techniqueOwner.has(technique)) techniqueOwner.set(technique, visual.id);
    }

    const mechanic = visual?.mechanicId?.trim();
    if (mechanic) {
      if (mechanicOwner.has(mechanic) && !visual?.repeatTechniqueReason?.trim()) {
        errors.push(`${visual.id}: mechanicId '${mechanic}' wird bereits von ${mechanicOwner.get(mechanic)} verwendet.`);
      } else if (!mechanicOwner.has(mechanic)) mechanicOwner.set(mechanic, visual.id);
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
      errors.push(`${visual.id}: mehr als zwei Motion-Visuals hintereinander aus '${family}'. Nutze eine andere Familie oder begründe die Wiederholung.`);
    }
  }

  const heroCount = motion.filter((visual) => visual?.qualityTier === 'hero').length;
  if (motion.length >= 6 && heroCount < Math.ceil(motion.length * 0.3)) {
    errors.push(`YouTube Longform benötigt mindestens 30 % Hero-Motion. Aktuell ${heroCount}/${motion.length}.`);
  }

  return errors;
};
