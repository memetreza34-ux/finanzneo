export * from './motion-tokens';
export * from './motion-primitives';
export * from './editorial-objects';
export * from './path-motion';
export * from './reveals';
export * from './morphs';
export * from './scene-composer';

export const EDITORIAL_MOTION_V3_REGISTRY = [
  {id:'mortgage-reset',component:'MortgageResetV3'},
  {id:'investment-crossroads',component:'InvestmentCrossroadsV3'},
  {id:'recurring-costs',component:'RecurringCostsV3'},
] as const;
