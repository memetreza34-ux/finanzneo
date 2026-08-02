export type FinanceSceneMode = 'image' | 'hybrid' | 'full-animation';

export type FinanceAnimationTemplate =
  | 'money-flow'
  | 'budget-split'
  | 'compound-growth'
  | 'portfolio-allocation'
  | 'inflation-erosion'
  | 'debt-paydown'
  | 'monthly-investment'
  | 'before-after-comparison'
  | 'risk-return-scale'
  | 'timeline-milestones'
  | 'income-expense-balance'
  | 'tax-fee-flow';

export type FinanceAnimationDecision = {
  mode: FinanceSceneMode;
  template?: FinanceAnimationTemplate;
  confidence: number;
  reason: string;
  blockedReasons?: string[];
};

export type FinanceAnimationRequest = {
  message: string;
  voiceText: string;
  labels?: string[];
  data?: Record<string, number | string | boolean | null>;
  preferredTemplate?: FinanceAnimationTemplate;
};

export type FinanceAnimationScene = FinanceAnimationRequest & {
  mode: Exclude<FinanceSceneMode, 'image'>;
  template: FinanceAnimationTemplate;
};
