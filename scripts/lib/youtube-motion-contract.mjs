export const YOUTUBE_MOTION_STANDARD_ID = 'finanzneo-youtube-motion-v4-simple';
export const LEGACY_YOUTUBE_MOTION_STANDARD_IDS = ['finanzneo-youtube-motion-v3'];

export const YOUTUBE_VISUAL_TYPES = ['animation', 'data', 'image', 'hybrid', 'real-asset'];
export const YOUTUBE_MOTION_VISUAL_TYPES = new Set(['animation', 'hybrid', 'data']);
export const YOUTUBE_IMAGE_VISUAL_TYPES = new Set(['image', 'hybrid']);
export const YOUTUBE_REAL_ASSET_VISUAL_TYPES = new Set(['real-asset']);

export const YOUTUBE_STANDARD_MOTION_PRESETS = [
  'STATIC',
  'FADE_IN',
  'SLIDE_UP',
  'SLIDE_LEFT',
  'SCALE_IN',
  'COUNT_UP',
  'BAR_GROW',
  'LINE_DRAW',
  'HIGHLIGHT',
  'SLOW_ZOOM',
  'CUSTOM',
];

// Kept as examples/compatibility for older projects. V4 does not require a family.
export const YOUTUBE_MOTION_FAMILY_EXAMPLES = [
  'big-number',
  'comparison',
  'percentage',
  'data-viz',
  'timeline',
  'money-flow',
  'process-steps',
  'simple-diagram',
  'allocation',
  'formula',
  'custom',
];
export const YOUTUBE_MOTION_FAMILIES = YOUTUBE_MOTION_FAMILY_EXAMPLES;
export const YOUTUBE_MOTION_RECENT_WINDOW = 0;
export const YOUTUBE_MOTION_SIGNATURE_FIELDS = ['camera', 'layout', 'transformation'];

export const requiresYouTubeMotion = (visual) => YOUTUBE_MOTION_VISUAL_TYPES.has(visual?.type);
export const requiresYouTubeImage = (visual) => YOUTUBE_IMAGE_VISUAL_TYPES.has(visual?.type);
export const requiresYouTubeRealAsset = (visual) => YOUTUBE_REAL_ASSET_VISUAL_TYPES.has(visual?.type);
export const motionSourcePathFor = (visual) => visual?.animationSourceFile ?? '';
export const isStaticYouTubeVisual = (visual) => visual?.animationDisabled === true
  || String(visual?.motionPreset ?? '').trim().toUpperCase() === 'STATIC';

const nonEmpty = (value) => typeof value === 'string' && value.trim();

export const getYouTubeMotionReason = (visual) => visual?.reason ?? visual?.animationIntent ?? '';
export const getYouTubeMotionPreset = (visual) => {
  if (nonEmpty(visual?.motionPreset)) return visual.motionPreset;
  if (isStaticYouTubeVisual(visual)) return 'STATIC';
  return nonEmpty(visual?.visualTechniqueId) ? 'CUSTOM' : '';
};

export const validateYouTubeMotionMetadata = (visual) => {
  if (!requiresYouTubeMotion(visual)) return [];

  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];
  const isStatic = isStaticYouTubeVisual(visual);

  if (!nonEmpty(visual?.viewerChange)) errors.push(`${id}: viewerChange fehlt.`);
  if (!nonEmpty(getYouTubeMotionReason(visual))) errors.push(`${id}: reason fehlt.`);

  const motionPreset = getYouTubeMotionPreset(visual);
  if (!nonEmpty(motionPreset)) {
    errors.push(`${id}: motionPreset fehlt.`);
  } else if (!YOUTUBE_STANDARD_MOTION_PRESETS.includes(String(motionPreset).trim().toUpperCase())) {
    errors.push(`${id}: motionPreset '${motionPreset}' ist unbekannt. Nutze STATIC, einen Standard-Preset oder CUSTOM.`);
  }

  if (isStatic && String(motionPreset).trim().toUpperCase() !== 'STATIC') {
    errors.push(`${id}: animationDisabled=true braucht motionPreset=STATIC.`);
  }
  if (String(motionPreset).trim().toUpperCase() === 'STATIC' && visual?.animationDisabled !== true) {
    errors.push(`${id}: motionPreset=STATIC braucht animationDisabled=true.`);
  }

  if (!nonEmpty(visual?.animationSourceFile)) errors.push(`${id}: animationSourceFile fehlt.`);
  else if (!visual.animationSourceFile.endsWith('/animation.tsx')) errors.push(`${id}: animationSourceFile muss auf animation.tsx zeigen.`);

  if (!nonEmpty(visual?.animationExport)) errors.push(`${id}: animationExport fehlt.`);

  if (!isStatic && String(motionPreset).trim().toUpperCase() === 'CUSTOM' && !nonEmpty(visual?.advancedReason) && !nonEmpty(visual?.visualTechniqueId)) {
    errors.push(`${id}: CUSTOM braucht advancedReason, außer es handelt sich um ein Legacy-V3-Visual.`);
  }

  return errors;
};

// V4 hat bewusst keine Novelty-/Variety-Quote. Wiederholung einfacher Erklärmuster
// ist erwünscht, wenn sie inhaltlich die klarste Darstellung ist.
export const validateYouTubeMotionVariety = () => [];
