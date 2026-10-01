// Compatibility lock stays stable so existing sealed reels and the V9 image world
// are not migrated by this animation-only hardening.
export const PREMIUM_ANIMATION_LOCK = 'finanzneo-premium-physical-animation-v2';

export const premiumAnimationContractFields = () => ({
  premiumVisualLock: PREMIUM_ANIMATION_LOCK,
  visualTargetWorld: 'finanzneo-stylized-3d-animated-black-v9',

  // The Finance Motion Library is a semantic mechanism toolbox, not an art-style
  // reference. Direct reuse is allowed only when the rendered mechanism still
  // looks like the same grounded FinanzNeo world as the Flow images.
  financeMotionLibraryId: 'finanzneo-finance-motion-library-v1',
  financeMotionLibraryAvailable: true,
  financeMotionLibraryRole: 'mechanism-tool-not-style-reference',
  libraryBestFitBeforeCustom: true,
  directLibraryRenderRequiresSameWorldPass: true,
  customAnimationAllowed: true,
  reusableMechanicsPreferred: true,
  libraryReuseMayRepeatAcrossScenes: true,
  libraryParametersMustFollowSceneContent: true,

  // Physical primitives remain optional. Grounding is about understandable
  // real-world meaning, not about forcing one component family.
  requirePremiumPhysicalStage: false,
  requirePhysicalObjects: false,
  premiumPhysicalStageOptional: true,
  physicalObjectsOptional: true,
  realWorldGroundingPreferred: true,
  abstractValueGeometryAsDefaultForbidden: true,
  recognizableFinanceOrEverydayObjectsPreferred: true,

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

  // Layout ownership is global. animation.tsx supplies only transparent visual
  // content inside AnimationStage; it must not duplicate the reel shell.
  pureBlackCanvasRequired: true,
  transparentAnimationStageRequired: true,
  globalHeaderOwnedByReelLayout: true,
  globalCaptionsOwnedByReelLayout: true,
  localSceneShellForbidden: true,
  localBlackBackgroundForbidden: true,

  genericCardRowsForbidden: true,
  progressBarAsPrimaryStoryForbidden: true,
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
