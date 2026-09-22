export const IMAGE_CREATIVE_CONCEPT_ID = 'finanzneo-image-creative-concept-v1';
export const CREATIVE_CONCEPT_START = 'CREATIVE_CONCEPT_DIRECTION_START';
export const CREATIVE_CONCEPT_END = 'CREATIVE_CONCEPT_DIRECTION_END';

export const CONCEPT_MODES = new Set([
  'single-iconic-object',
  'object-interaction',
  'character-moment',
  'pov-moment',
  'real-environment',
  'comparison',
  'visual-metaphor',
  'controlled-fantasy',
  'thought-visualization',
  'cause-effect',
  'reveal',
  'payoff',
]);

export const CREATIVE_CONCEPT_MARKERS = [
  ['CONCEPT_MODE', 'conceptMode'],
  ['VIEWER_THOUGHT', 'viewerThought'],
  ['ENTERTAINMENT_HOOK', 'entertainmentHook'],
  ['MEMORABILITY_HOOK', 'memorabilityHook'],
  ['REALITY_ANCHOR', 'realityAnchor'],
  ['FANTASY_LEVEL', 'fantasyLevel'],
  ['FANTASY_JUSTIFICATION', 'fantasyJustification'],
  ['WHY_THIS_CONCEPT', 'whyThisConcept'],
];

const clean = (value) => String(value ?? '').trim();

export const creativeConceptDirectionText = (meta) => {
  if (!meta || !clean(meta.conceptMode)) return '';
  return `${CREATIVE_CONCEPT_START}\n` +
`Creative concept mode: ${clean(meta.conceptMode)}.\n` +
`What the viewer should immediately think or feel: ${clean(meta.viewerThought)}\n` +
`Entertainment / scroll-stop hook: ${clean(meta.entertainmentHook)}\n` +
`Memorable visual idea: ${clean(meta.memorabilityHook)}\n` +
`Reality anchor that keeps the finance meaning obvious: ${clean(meta.realityAnchor)}\n` +
`Fantasy level: ${clean(meta.fantasyLevel)}/3. Fantasy justification: ${clean(meta.fantasyJustification)}\n` +
`Why this concept is the strongest choice for this exact beat: ${clean(meta.whyThisConcept)}\n` +
`Choose the strongest visual idea, not the busiest one. One iconic object is valid. Multiple objects are valid. People are optional. A real scene, visual metaphor, thought-visualization or controlled fantasy is valid when the meaning stays immediate. Do not add props only to satisfy a template. Do not turn a strong minimal concept into a catalog layout.\n` +
`${CREATIVE_CONCEPT_END}\n`;
};
