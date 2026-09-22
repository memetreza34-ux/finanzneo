export const V5_CONTRACT_ID = 'finanzneo-image-storytelling-v5';
export const V5_HARDENING_ID = 'finanzneo-image-storytelling-v5-hardening-v1';
export const V5_COMPILED_START = 'V5_COMPILED_DIRECTION_START';
export const V5_COMPILED_END = 'V5_COMPILED_DIRECTION_END';

export const LOCATION_CLASSES = new Set([
  'home', 'retail', 'work', 'transport', 'banking', 'street', 'food', 'services', 'leisure', 'other',
]);

export const MAIN_SUBJECT_CLASSES = new Set([
  'money', 'bill', 'purchase', 'account', 'vehicle', 'housing', 'subscription', 'savings', 'person', 'device', 'document', 'other',
]);

export const LIGHTING_VARIATIONS = new Set([
  'soft-key', 'side-key', 'top-light', 'rim-heavy', 'warm-practical', 'dramatic-low-key',
]);

export const PATTERN_INTERRUPT_TYPES = new Set([
  'none', 'camera-change', 'scale-change', 'location-change', 'human-change', 'comparison', 'cause-effect', 'reveal',
]);

export const HARDENING_MARKERS = [
  ['LOCATION_CLASS', 'locationClass'],
  ['MAIN_SUBJECT_CLASS', 'mainSubjectClass'],
  ['LIGHTING_VARIATION', 'lightingVariation'],
  ['LABEL_BUDGET', 'labelBudget'],
  ['LABEL_BUDGET_JUSTIFICATION', 'labelBudgetJustification'],
  ['PATTERN_INTERRUPT_TYPE', 'patternInterruptType'],
];

export const readMarker = (source, marker) => {
  const lines = source.split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].startsWith(marker + ':')) return lines[i].slice(marker.length + 1).trim();
  }
  return '';
};

export const metaFromMarkerText = (source) => {
  const mapping = [
    ['VISUAL_STRATEGY', 'strategy'],
    ['VISUAL_MODE', 'visualMode'],
    ['SEQUENCE_ROLE', 'sequenceRole'],
    ['ENERGY_LEVEL', 'energyLevel'],
    ['VISUAL_ARCHETYPE', 'visualArchetype'],
    ['LOCATION_FAMILY', 'locationFamily'],
    ['LOCATION_CLASS', 'locationClass'],
    ['HUMAN_PRESENCE', 'humanPresence'],
    ['COMPOSITION_FAMILY', 'compositionFamily'],
    ['MAIN_SUBJECT_FAMILY', 'mainSubjectFamily'],
    ['MAIN_SUBJECT_CLASS', 'mainSubjectClass'],
    ['TABLE_DOCUMENT_SCENE', 'tableDocumentScene'],
    ['LITERAL_REAL_WORLD_SITUATION', 'literalSituation'],
    ['REAL_WORLD_CONTEXT_ANCHOR', 'contextAnchor'],
    ['VOICEOVER_VISUAL_MATCH', 'voiceVisualMatch'],
    ['VISUAL_PURPOSE', 'visualPurpose'],
    ['STORY_ACTION', 'storyAction'],
    ['TENSION_OR_CONSEQUENCE', 'tensionOrConsequence'],
    ['VISUAL_HOOK', 'visualHook'],
    ['SHOT_SCALE', 'shotScale'],
    ['CAMERA_ANGLE', 'cameraAngle'],
    ['DEPTH_PLAN', 'depthPlan'],
    ['EMOTIONAL_BEAT', 'emotionalBeat'],
    ['CAUSE_EFFECT', 'causeEffect'],
    ['PATTERN_INTERRUPT', 'patternInterrupt'],
    ['PATTERN_INTERRUPT_TYPE', 'patternInterruptType'],
    ['LIGHTING_VARIATION', 'lightingVariation'],
    ['LABEL_BUDGET', 'labelBudget'],
    ['LABEL_BUDGET_JUSTIFICATION', 'labelBudgetJustification'],
  ];
  return Object.fromEntries(mapping.map(([marker, key]) => [key, readMarker(source, marker)]));
};

const clean = (value) => String(value ?? '').trim();

export const buildCompiledDirection = (meta) => {
  const location = [clean(meta.locationClass), clean(meta.locationFamily)].filter(Boolean).join(' / ');
  const subject = [clean(meta.mainSubjectClass), clean(meta.mainSubjectFamily)].filter(Boolean).join(' / ');
  const interrupt = [clean(meta.patternInterruptType), clean(meta.patternInterrupt)].filter(Boolean).join(' — ');
  return `${V5_COMPILED_START}\n` +
`Treat the following visual-direction decisions as mandatory production instructions, not notes.\n` +
`Sequence role: ${clean(meta.sequenceRole)}. Energy: ${clean(meta.energyLevel)}/5. Visual mode: ${clean(meta.visualMode)}. Archetype: ${clean(meta.visualArchetype)}.\n` +
`Location: ${location}. Human presence: ${clean(meta.humanPresence)}. Composition: ${clean(meta.compositionFamily)}. Main subject: ${subject}.\n` +
`Camera: ${clean(meta.shotScale)}, ${clean(meta.cameraAngle)}. Depth staging: ${clean(meta.depthPlan)}. Lighting variation inside the locked V9 world: ${clean(meta.lightingVariation)}.\n` +
`Exact real-world situation: ${clean(meta.literalSituation)}\n` +
`Context anchor: ${clean(meta.contextAnchor)}\n` +
`Exact voiceover-to-visual match: ${clean(meta.voiceVisualMatch)}\n` +
`Visible story action: ${clean(meta.storyAction)}\n` +
`Visible tension/consequence: ${clean(meta.tensionOrConsequence)}\n` +
`First-second visual hook: ${clean(meta.visualHook)}\n` +
`Cause and effect: ${clean(meta.causeEffect)}\n` +
`Emotional beat: ${clean(meta.emotionalBeat)}\n` +
`Pattern interrupt: ${interrupt}.\n` +
`German object-label budget: maximum ${clean(meta.labelBudget)} label(s). Justification if above 2: ${clean(meta.labelBudgetJustification)}\n` +
`Do not flatten these choices into a generic person-at-desk, generic finance-icon, catalog or stock-like composition. Preserve the exact camera, action, location, subject hierarchy and visual consequence.\n` +
`${V5_COMPILED_END}`;
};

export const removeCompiledDirection = (source) => source.replace(
  new RegExp(`${V5_COMPILED_START}[\\s\\S]*?${V5_COMPILED_END}\\n*`, 'g'),
  '',
);

export const compileOnePromptSource = (source, meta) => {
  const cleaned = removeCompiledDirection(source);
  const marker = 'IMAGE PROMPT:';
  const index = cleaned.indexOf(marker);
  if (index === -1) return cleaned;
  const before = cleaned.slice(0, index + marker.length);
  const after = cleaned.slice(index + marker.length).replace(/^\s*/, '\n');
  return `${before}\n${buildCompiledDirection(meta)}\n${after.replace(/^\n+/, '')}`;
};

export const compileAllPromptBlocksFromMarkers = (source) => {
  let cursor = 0;
  let output = '';
  while (true) {
    const index = source.indexOf('IMAGE PROMPT:', cursor);
    if (index === -1) {
      output += source.slice(cursor);
      break;
    }
    output += source.slice(cursor, index);
    const before = source.slice(0, index);
    const meta = metaFromMarkerText(before);
    const tail = source.slice(index);
    const cleanedTail = removeCompiledDirection(tail);
    const markerLength = 'IMAGE PROMPT:'.length;
    output += `IMAGE PROMPT:\n${buildCompiledDirection(meta)}\n`;
    cursor = index + markerLength;
    const originalAfter = source.slice(cursor);
    const compiledMatch = originalAfter.match(/^\s*V5_COMPILED_DIRECTION_START[\s\S]*?V5_COMPILED_DIRECTION_END\s*/);
    if (compiledMatch) cursor += compiledMatch[0].length;
  }
  return output;
};
