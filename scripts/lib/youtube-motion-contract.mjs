export const YOUTUBE_MOTION_STANDARD_ID = 'finanzneo-youtube-motion-v3';

export const YOUTUBE_VISUAL_TYPES = ['image', 'animation', 'hybrid', 'data'];
export const YOUTUBE_MOTION_VISUAL_TYPES = new Set(['animation', 'hybrid', 'data']);
export const YOUTUBE_IMAGE_VISUAL_TYPES = new Set(['image', 'hybrid']);

// Beispiele zur Inspiration, ausdrücklich KEINE Whitelist.
// Neue compositionFamilyId-Werte sind erlaubt, wenn sie die konkrete Szene besser beschreiben.
export const YOUTUBE_MOTION_FAMILY_EXAMPLES = [
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
  'physical-process',
  'material-transformation',
  'map-journey',
  'macro-to-micro',
  'network-simulation',
  'custom',
];

// Kompatibilitätsalias für bestehende Imports. Semantik in V3: Beispiele, keine erlaubte Endmenge.
export const YOUTUBE_MOTION_FAMILIES = YOUTUBE_MOTION_FAMILY_EXAMPLES;
export const YOUTUBE_MOTION_RECENT_WINDOW = 4;
export const YOUTUBE_MOTION_SIGNATURE_FIELDS = ['camera', 'layout', 'transformation'];

export const requiresYouTubeMotion = (visual) => YOUTUBE_MOTION_VISUAL_TYPES.has(visual?.type);
export const requiresYouTubeImage = (visual) => YOUTUBE_IMAGE_VISUAL_TYPES.has(visual?.type);

export const motionSourcePathFor = (visual) => visual?.animationSourceFile ?? '';

const normalized = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validStringArray = (value, minimum) => Array.isArray(value)
  && value.length >= minimum
  && value.every((item) => typeof item === 'string' && item.trim());

export const validateYouTubeMotionMetadata = (visual) => {
  if (!requiresYouTubeMotion(visual)) return [];
  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];
  const requiredString = (field) => {
    if (typeof visual?.[field] !== 'string' || !visual[field].trim()) {
      errors.push(`${id}: ${field} fehlt.`);
    }
  };

  // Content-first: Erst beschreiben, was der Zuschauer tatsächlich sehen soll,
  // danach Mechanik und Technik festlegen.
  requiredString('viewerChange');
  requiredString('animationIntent');
  requiredString('mechanicId');
  requiredString('visualTechniqueId');
  requiredString('techniqueDescription');
  requiredString('compositionFamilyId');
  requiredString('animationSourceFile');
  requiredString('animationExport');

  if (!validStringArray(visual?.toolStack, 1)) {
    errors.push(`${id}: toolStack benötigt mindestens 1 konkretes Werkzeug / Verfahren.`);
  }
  if (!validStringArray(visual?.motionChannels, 2)) {
    errors.push(`${id}: motionChannels benötigt mindestens 2 sinnvolle Kanäle.`);
  }
  if (!validStringArray(visual?.visualBeats, 2)) {
    errors.push(`${id}: visualBeats benötigt mindestens 2 sichtbare Zustände.`);
  }

  const signature = visual?.motionSignature;
  for (const field of YOUTUBE_MOTION_SIGNATURE_FIELDS) {
    if (typeof signature?.[field] !== 'string' || !signature[field].trim()) {
      errors.push(`${id}: motionSignature.${field} fehlt.`);
    }
  }

  // V3 hat bewusst KEINE feste Liste erlaubter compositionFamilyId-Werte.
  if (visual?.animationSourceFile && !visual.animationSourceFile.endsWith('/animation.tsx')) {
    errors.push(`${id}: animationSourceFile muss auf animation.tsx zeigen.`);
  }
  return errors;
};

const sameSignature = (a, b) => YOUTUBE_MOTION_SIGNATURE_FIELDS.every(
  (field) => normalized(a?.motionSignature?.[field])
    && normalized(a?.motionSignature?.[field]) === normalized(b?.motionSignature?.[field]),
);

export const validateYouTubeMotionVariety = (visuals = []) => {
  const errors = [];
  const motion = visuals.filter(requiresYouTubeMotion);
  const techniqueOwner = new Map();
  const mechanicOwner = new Map();
  const descriptionOwner = new Map();

  for (const visual of motion) {
    const repeatReason = visual?.repeatTechniqueReason?.trim();
    const checks = [
      ['visualTechniqueId', normalized(visual?.visualTechniqueId), techniqueOwner],
      ['mechanicId', normalized(visual?.mechanicId), mechanicOwner],
      ['techniqueDescription', normalized(visual?.techniqueDescription), descriptionOwner],
    ];

    for (const [label, value, owners] of checks) {
      if (!value) continue;
      if (owners.has(value) && !repeatReason) {
        errors.push(`${visual.id}: ${label} wiederholt die Motion von ${owners.get(value)}. Wiederholung braucht repeatTechniqueReason.`);
      } else if (!owners.has(value)) {
        owners.set(value, visual.id);
      }
    }
  }

  let runFamily = null;
  let runLength = 0;
  for (const visual of motion) {
    const family = normalized(visual?.compositionFamilyId) || null;
    if (family === runFamily) runLength += 1;
    else {
      runFamily = family;
      runLength = 1;
    }
    if (family && runLength > 2 && !visual?.repeatTechniqueReason?.trim()) {
      errors.push(`${visual.id}: mehr als zwei Motion-Visuals hintereinander aus '${visual.compositionFamilyId}'. Nutze eine passendere andere Umsetzung oder begründe die Wiederholung.`);
    }
  }

  // Anti-Fake-Variation: Ein neuer Technikname reicht nicht, wenn Kamera,
  // räumlicher Aufbau UND Transformation in den letzten vier Motion-Visuals identisch sind.
  for (let index = 0; index < motion.length; index += 1) {
    const visual = motion[index];
    if (visual?.repeatTechniqueReason?.trim()) continue;
    const previous = motion.slice(Math.max(0, index - YOUTUBE_MOTION_RECENT_WINDOW), index);
    const match = previous.find((candidate) => sameSignature(candidate, visual));
    if (match) {
      errors.push(`${visual.id}: motionSignature ist innerhalb der letzten ${YOUTUBE_MOTION_RECENT_WINDOW} Motion-Visuals identisch zu ${match.id}. Ändere die tatsächliche Bewegungslogik oder begründe die Wiederholung.`);
    }
  }

  return errors;
};
