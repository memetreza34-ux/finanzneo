// Compatibility lock stays stable so existing sealed reels and the V9 image world
// are not migrated by this animation-only change.
export const PREMIUM_ANIMATION_LOCK = 'finanzneo-premium-physical-animation-v2';

export const premiumAnimationContractFields = () => ({
  premiumVisualLock: PREMIUM_ANIMATION_LOCK,
  visualTargetWorld: 'finanzneo-stylized-3d-animated-black-v9',

  // Finance Motion Library V1: content decides first, library is the preferred
  // implementation when it is a genuine semantic best-fit.
  financeMotionLibraryId: 'finanzneo-finance-motion-library-v1',
  financeMotionLibraryAvailable: true,
  libraryBestFitBeforeCustom: true,
  customAnimationAllowed: true,
  reusableMechanicsPreferred: true,
  libraryReuseMayRepeatAcrossScenes: true,
  libraryParametersMustFollowSceneContent: true,

  // Old physical primitives remain available but are no longer quality gates.
  requirePremiumPhysicalStage: false,
  requirePhysicalObjects: false,
  premiumPhysicalStageOptional: true,
  physicalObjectsOptional: true,

  supportingObjectCountFlexible: true,
  clarityBeforeObjectCount: true,
  requireMaterialDepthLighting: true,
  sameVisualLanguageAsFlowImages: true,
  startMechanismResultRequired: true,
  uniqueMechanismPerAnimationRequired: false,
  semanticMechanismRequired: true,
  focalPathRequired: true,
  primaryActionRequired: true,
  cameraRoleRequired: true,
  payoffRequired: true,
  labelsSupplementalOnly: true,
  genericCardRowsForbidden: true,
  progressBarAsPrimaryStoryForbidden: true,
  pureBlackCanvasRequired: true,
  transparentAnimationStageRequired: true,
  decorativeBackgroundEffectsForbidden: true,
  particlesForbidden: true,
  auroraForbidden: true,
  gridBackgroundForbidden: true,
  dashboardCompositionForbidden: true,
  flowchartMainCompositionForbidden: true,
  smallBoxesThinLinesForbidden: true,
  genericInfoCardsAsMainLanguageForbidden: true,
  decorativeMotionDoesNotCountAsExplanation: true,
  resultHoldFramesMin: 15,
});

export const validatePremiumAnimationSceneMetadata = (scene) => {
  if (scene?.type !== 'animation') return [];
  const errors = [];
  if (scene.animationPremiumVisualLock !== PREMIUM_ANIMATION_LOCK) {
    errors.push(`${scene?.id ?? 'Animation'}: animationPremiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
  }
  return errors;
};
