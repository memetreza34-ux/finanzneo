export const PREMIUM_ANIMATION_LOCK = 'finanzneo-premium-physical-animation-v2';

export const premiumAnimationContractFields = () => ({
  premiumVisualLock: PREMIUM_ANIMATION_LOCK,
  requirePremiumPhysicalStage: true,
  requirePhysicalObjects: true,
  requireLargeHeroObject: true,
  requireMaterialDepthLighting: true,
  sameVisualLanguageAsFlowImages: true,
  dashboardCompositionForbidden: true,
  flowchartMainCompositionForbidden: true,
  smallBoxesThinLinesForbidden: true,
  genericInfoCardsAsMainLanguageForbidden: true,
  monochromeGreenCompositionForbidden: true,
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
