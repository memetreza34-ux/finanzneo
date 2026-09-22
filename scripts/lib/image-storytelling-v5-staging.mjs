export const V5_STAGING_ID = 'finanzneo-image-storytelling-v5-staging-v1';

export const FRAME_OCCUPANCY_CLASSES = new Set([
  'tight', 'balanced', 'environmental',
]);

export const STAGING_MODES = new Set([
  'active-collision', 'active-use', 'environmental-action', 'comparison-action', 'reveal', 'payoff-action',
]);

export const CAUSE_EFFECT_STRENGTHS = new Set([
  'explicit', 'implied',
]);

export const HUMAN_REACTIONS = new Set([
  'none', 'pressured', 'concerned', 'surprised', 'decisive', 'relieved', 'neutral-justified',
]);

export const SPATIAL_PRESSURES = new Set([
  'foreground-dominant', 'subject-dominant', 'environmental-depth', 'balanced-depth',
]);

export const IMPACT_COMPOSITIONS = new Set([
  'none', 'extreme-close-up', 'strong-pov', 'low-angle-scale', 'foreground-blocking', 'environment-wide', 'reveal',
]);

export const STAGING_MARKERS = [
  ['FRAME_OCCUPANCY_CLASS', 'frameOccupancyClass'],
  ['STAGING_MODE', 'stagingMode'],
  ['CAUSE_EFFECT_STRENGTH', 'causeEffectStrength'],
  ['HUMAN_REACTION', 'humanReaction'],
  ['HUMAN_REACTION_JUSTIFICATION', 'humanReactionJustification'],
  ['SPATIAL_PRESSURE', 'spatialPressure'],
  ['IMPACT_COMPOSITION', 'impactComposition'],
];

export const isHumanPresent = (humanPresence) => String(humanPresence ?? '').trim() !== 'none';

export const stagingDirectionText = (meta, clean = (value) => String(value ?? '').trim()) => {
  if (!clean(meta.stagingMode)) return '';
  const occupancy = clean(meta.frameOccupancyClass);
  const occupancyInstruction = {
    tight: 'Make the main action dominate roughly 65–85% of the usable square frame; avoid a small isolated subject floating in black.',
    balanced: 'Let action plus local real-world context occupy roughly 55–75% of the usable square frame; black remains the world, not empty dead space.',
    environmental: 'Use a clearly readable real environment across roughly 65–85% of the usable frame and let it dissolve into black; never reduce it to a tiny diorama.',
  }[occupancy] ?? '';

  return `Dynamic staging mode: ${clean(meta.stagingMode)}. Frame occupancy: ${occupancy}. ${occupancyInstruction}\n` +
`Cause/effect strength: ${clean(meta.causeEffectStrength)}. The consequence must be physically visible through pressure, displacement, draining, blocking, crowding, growth, shrinkage, repetition or another concrete real-world change whenever the beat allows it.\n` +
`Human reaction: ${clean(meta.humanReaction)}. ${clean(meta.humanReactionJustification) !== 'none' ? `Reaction justification: ${clean(meta.humanReactionJustification)}. ` : ''}Use readable body language and hand/face posture without melodrama.\n` +
`Spatial pressure: ${clean(meta.spatialPressure)}. Impact composition: ${clean(meta.impactComposition)}. Use foreground/background overlap, near-field objects or environmental depth when planned; do not neatly arrange all explanatory objects side by side like a catalog display.\n`;
};
