export const FINANCE_MOTION_LAB_SEGMENT_FRAMES = 150;

export const FINANCE_MOTION_LAB_IDS = [
  'money-transfer',
  'money-split',
  'value-growth',
  'value-drain',
  'allocation-split',
  'rebalancing',
  'diversification',
  'loan-paydown',
  'protection-limit',
  'scenario-comparison',
  'finance-timeline',
  'compound-growth',
] as const;

export type FinanceMotionLabId = (typeof FINANCE_MOTION_LAB_IDS)[number];

export const FINANCE_MOTION_QA_LOCAL_FRAMES = [18, 72, 132] as const;

export const FINANCE_MOTION_LAB_FRAMES =
  FINANCE_MOTION_LAB_IDS.length * FINANCE_MOTION_LAB_SEGMENT_FRAMES;
