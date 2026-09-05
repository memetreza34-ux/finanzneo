export const PREMIUM_ANIMATION_LOCK = 'finanzneo-premium-physical-animation-v2';

export const premiumAnimationContractFields = () => ({
  premiumVisualLock: PREMIUM_ANIMATION_LOCK,
  visualTargetWorld: 'finanzneo-stylized-3d-animated-black-v9',
  requirePremiumPhysicalStage: false,
  requirePhysicalObjects: false,
  creativeRemotionFreedom: true,
  customCompositionAllowed: true,
  physicalPrimitivesOptional: true,
  safeStageRequired: true,
  visualTechniqueIdRequired: true,
  uniqueVisualTechniquePerAnimationRequired: true,
  supportingObjectCountFlexible: true,
  clarityBeforeObjectCount: true,
  requireMaterialDepthLighting: true,
  sameVisualLanguageAsFlowImages: true,
  realWorldMechanismRequired: true,
  startMechanismResultRequired: true,
  uniqueMechanismPerAnimationRequired: true,
  labelsSupplementalOnly: true,
  genericCardRowsForbidden: true,
  progressBarAsPrimaryStoryForbidden: true,
  physicalCauseEffectRequired: true,
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
