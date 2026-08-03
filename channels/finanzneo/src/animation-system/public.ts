export type {
  FinanceAnimationData,
  FinanceAnimationDecision,
  FinanceAnimationRenderResult,
  FinanceAnimationRequest,
  FinanceAnimationScalar,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
  FinanceSceneMode,
} from './contracts';

export {
  FINANCE_ANIMATION_DOMAIN_LIMITS,
} from './domainLimits';
export type {FinanceAnimationDomainLimits} from './domainLimits';

export {
  FINANCE_ANIMATION_FEATURES,
  isFinanceAnimationEnabled,
  validateFinanceAnimationFeatureFlags,
} from './featureFlags';
export type {FinanceAnimationFeatureFlags} from './featureFlags';

export {FINANCE_ANIMATION_INPUT_LIMITS} from './inputLimits';
export type {FinanceAnimationInputLimits} from './inputLimits';

export {
  FINANCE_ANIMATION_FORBIDDEN_KEYS,
  parseFinanceAnimationRequest,
  parseFinanceAnimationScene,
} from './ingestion/parseFinanceAnimationInput';
export type {FinanceAnimationParseResult} from './ingestion/parseFinanceAnimationInput';

export {
  planFinanceAnimationInput,
  planFinanceAnimationInputForTemplate,
  planFinanceAnimationInputWithFeatures,
} from './selector/planFinanceAnimationInput';
export type {FinanceAnimationInputPlanResult} from './selector/planFinanceAnimationInput';

export {
  planFinanceAnimationScene,
  planFinanceAnimationSceneForTemplate,
  planFinanceAnimationSceneWithFeatures,
} from './selector/planFinanceAnimationScene';
export type {FinanceAnimationPlanResult} from './selector/planFinanceAnimationScene';

export {
  buildAnimationPlan,
  buildAnimationPlanForTemplate,
  buildAnimationPlanWithFeatures,
} from './planning/buildAnimationPlan';
export type {
  FinanceAnimationPlan,
  FinanceAnimationPlanStatus,
} from './planning/animationPlanTypes';

export {
  SafeFinanceAnimationRenderer,
  resolveFinanceAnimationFallbackContext,
} from './render/SafeFinanceAnimationRenderer';
export type {
  FinanceAnimationFallbackContext,
  SafeFinanceAnimationRendererProps,
} from './render/SafeFinanceAnimationRenderer';

export {
  FINANCE_ANIMATION_ALLOWED_DATA,
  FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS,
  getAllowedTemplateData,
} from './templates/allowedTemplateData';
export {
  FINANCE_ANIMATION_REQUIRED_DATA,
  getRequiredTemplateData,
} from './templates/requiredTemplateData';
export {
  FINANCE_ANIMATION_TEMPLATES,
  getFinanceAnimationTemplate,
} from './templates/registry';

export type {
  FinanceAnimationTemplateData,
  FinanceAnimationTemplateDataMap,
  PortfolioAllocationDatum,
  TimelineMilestoneDatum,
  TypedFinanceAnimationScene,
} from './templateDataContracts';
