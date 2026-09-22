export const COVER_ANCHOR_FLOW_ID = 'finanzneo-cover-anchor-flow-v1';
export const COVER_ANCHOR_BLOCK_SIZE = 5;
export const COVER_ANCHOR_OUTPUT_DIR = '03-szenen/00-ALLE-BILDER-HIER-REIN';

export const COVER_ANCHOR_MARKERS = [
  ['COVER_ANCHOR_ROLE', 'coverAnchorRole'],
  ['COVER_ANCHOR_REFERENCE_FILE', 'coverAnchorReferenceFile'],
  ['COVER_ANCHOR_BLOCK', 'coverAnchorBlock'],
  ['COVER_ANCHOR_BLOCK_SLOT', 'coverAnchorBlockSlot'],
  ['COVER_ANCHOR_VISUAL_DNA', 'coverAnchorVisualDna'],
  ['COVER_ANCHOR_CHARACTER_LANGUAGE', 'coverAnchorCharacterLanguage'],
  ['COVER_ANCHOR_ENVIRONMENT_LANGUAGE', 'coverAnchorEnvironmentLanguage'],
  ['COVER_ANCHOR_MATERIAL_LANGUAGE', 'coverAnchorMaterialLanguage'],
  ['COVER_ANCHOR_LIGHTING_LANGUAGE', 'coverAnchorLightingLanguage'],
  ['COVER_ANCHOR_COLOR_LANGUAGE', 'coverAnchorColorLanguage'],
  ['COVER_ANCHOR_TEXTURE_LANGUAGE', 'coverAnchorTextureLanguage'],
  ['COVER_ANCHOR_QUALITY_BAR', 'coverAnchorQualityBar'],
];

const clean = (value) => String(value ?? '').trim();

export const assignCoverAnchorSlots = (imageScenes) => imageScenes.map((scene, index) => {
  if (index === 0) return {sceneId: scene.id, role: 'MASTER', block: 0, slot: 0};
  const followupIndex = index - 1;
  return {
    sceneId: scene.id,
    role: 'FOLLOWUP',
    block: Math.floor(followupIndex / COVER_ANCHOR_BLOCK_SIZE) + 1,
    slot: (followupIndex % COVER_ANCHOR_BLOCK_SIZE) + 1,
  };
});

export const coverAnchorDirectionText = (meta) => {
  const role = clean(meta.coverAnchorRole);
  if (!role) return '';
  const reference = clean(meta.coverAnchorReferenceFile);

  if (role === 'MASTER') {
    return `COVER / MASTER VISUAL ANCHOR — MANDATORY\n` +
      `This first image is simultaneously scene 01, the cover and the canonical visual reference for every later generated image. Render it with unusually high specificity and finish quality.\n` +
      `Visual DNA: ${clean(meta.coverAnchorVisualDna)}\n` +
      `Character language: ${clean(meta.coverAnchorCharacterLanguage)}\n` +
      `Environment language: ${clean(meta.coverAnchorEnvironmentLanguage)}\n` +
      `Material language: ${clean(meta.coverAnchorMaterialLanguage)}\n` +
      `Lighting language: ${clean(meta.coverAnchorLightingLanguage)}\n` +
      `Color language: ${clean(meta.coverAnchorColorLanguage)}\n` +
      `Texture language: ${clean(meta.coverAnchorTextureLanguage)}\n` +
      `Quality bar: ${clean(meta.coverAnchorQualityBar)}\n` +
      `The approved pixels of ${reference} become the visual template for later images. Do not create a style sheet, collage or multi-panel output.\n`;
  }

  return `ANCHOR-REFERENCED FOLLOWUP — MANDATORY\n` +
    `Generation block: ${clean(meta.coverAnchorBlock)}, slot ${clean(meta.coverAnchorBlockSlot)} of ${COVER_ANCHOR_BLOCK_SIZE}.\n` +
    `Before generating this image, use the approved scene-01 file ${reference} as the direct visual reference/template. Match its art-direction DNA: character design language, face abstraction, geometry, materials, texture treatment, lighting character, color treatment, environment rendering, black-world integration and overall finish quality.\n` +
    `Do NOT copy the anchor's subject, camera, composition, pose or props unless the current scene independently requires them. The current scene concept and camera remain primary; the anchor controls visual identity, not content.\n` +
    `Only the approved scene-01 anchor may be used as the persistent generation reference. Other previous images are QA comparison material only.\n`;
};

export const coverAnchorPlanningMarkerText = (meta) => {
  const lines = [
    `COVER_ANCHOR_ROLE: ${clean(meta.coverAnchorRole)}`,
    `COVER_ANCHOR_REFERENCE_FILE: ${clean(meta.coverAnchorReferenceFile)}`,
    `COVER_ANCHOR_BLOCK: ${clean(meta.coverAnchorBlock)}`,
    `COVER_ANCHOR_BLOCK_SLOT: ${clean(meta.coverAnchorBlockSlot)}`,
  ];
  if (meta.coverAnchorRole === 'MASTER') {
    lines.push(
      `COVER_ANCHOR_VISUAL_DNA: ${clean(meta.coverAnchorVisualDna)}`,
      `COVER_ANCHOR_CHARACTER_LANGUAGE: ${clean(meta.coverAnchorCharacterLanguage)}`,
      `COVER_ANCHOR_ENVIRONMENT_LANGUAGE: ${clean(meta.coverAnchorEnvironmentLanguage)}`,
      `COVER_ANCHOR_MATERIAL_LANGUAGE: ${clean(meta.coverAnchorMaterialLanguage)}`,
      `COVER_ANCHOR_LIGHTING_LANGUAGE: ${clean(meta.coverAnchorLightingLanguage)}`,
      `COVER_ANCHOR_COLOR_LANGUAGE: ${clean(meta.coverAnchorColorLanguage)}`,
      `COVER_ANCHOR_TEXTURE_LANGUAGE: ${clean(meta.coverAnchorTextureLanguage)}`,
      `COVER_ANCHOR_QUALITY_BAR: ${clean(meta.coverAnchorQualityBar)}`,
    );
  }
  return lines.join('\n');
};
