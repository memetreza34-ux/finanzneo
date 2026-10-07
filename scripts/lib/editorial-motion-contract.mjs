export const EDITORIAL_MOTION_LOCK = 'finanzneo-editorial-motion-v1';
export const EDITORIAL_MOTION_LIBRARY_ID = 'finanzneo-editorial-motion-library-v1';
export const EDITORIAL_IMAGE_WORLD_ID = 'finanzneo-editorial-finance-v1';

export const editorialMotionContractFields = () => ({
  visualMotionLock: EDITORIAL_MOTION_LOCK,
  visualTargetWorld: EDITORIAL_IMAGE_WORLD_ID,
  financeMotionLibraryId: EDITORIAL_MOTION_LIBRARY_ID,
  financeMotionLibraryAvailable: true,

  contentFirstRequired: true,
  libraryBestFitBeforeCustom: true,
  customAnimationAllowed: true,
  libraryUseNeverForced: true,
  reusableMechanicsPreferred: true,
  libraryReuseMayRepeatAcrossScenes: true,
  libraryParametersMustFollowSceneContent: true,
  requirePremiumPhysicalStage: false,
  requirePhysicalObjects: false,

  editorialTwoDPreferred: true,
  subtleTwoPointFiveDAllowed: true,
  selectiveSimple3DAllowed: true,
  fixed3DStyleForbidden: true,
  physicalObjectsOptional: true,
  supportingObjectCountFlexible: true,
  clarityBeforeObjectCount: true,
  materialDepthLightingRequired: false,

  flexibleAnimationSurface: true,
  lightSurfacePreferred: true,
  pureBlackAnimationSurfaceRequired: false,
  sceneSurfaceAllowedInsideVisualZone: true,

  minimumMotionNeededPreferred: true,
  onePrimaryChangeMayBeEnough: true,
  multipleMotionChannelsRequired: false,
  cameraMovementRequired: false,
  defaultCameraRole: 'still',

  startMechanismResultRequired: true,
  semanticMechanismRequired: true,
  focalPathRequired: true,
  primaryActionRequired: true,
  payoffRequired: true,
  labelsSupplementalOnly: true,
  resultHoldFramesMin: 15,

  glossyPhysicalLookAsDefaultForbidden: true,
  pedestalAsDefaultForbidden: true,
  neonGlowAsDefaultForbidden: true,
  hologramAsDefaultForbidden: true,
  floatingCoinShowerForbidden: true,
  decorativeBackgroundEffectsForbidden: true,
  particlesForbidden: true,
  auroraForbidden: true,
  gridBackgroundForbidden: true,
  dashboardCompositionForbidden: true,
  genericInfoCardsAsMainLanguageForbidden: true,
  decorativeMotionDoesNotCountAsExplanation: true,
});

export const validateEditorialMotionSceneMetadata = (scene) => {
  if (scene?.type !== 'animation') return [];
  const errors = [];
  if (scene.animationVisualMotionLock !== EDITORIAL_MOTION_LOCK) {
    errors.push(`${scene?.id ?? 'Animation'}: animationVisualMotionLock muss ${EDITORIAL_MOTION_LOCK} sein.`);
  }
  return errors;
};
