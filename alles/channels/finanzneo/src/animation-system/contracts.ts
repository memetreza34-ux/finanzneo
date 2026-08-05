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

/**
 * Untrusted scene data may contain explicit `undefined` values. Validators
 * treat them exactly like missing fields instead of forcing unsafe casts at
 * ingestion boundaries.
 */
export type FinanceAnimationScalar = number | string | boolean | null | undefined;
export type FinanceAnimationData = Record<string, FinanceAnimationScalar | unknown[]>;

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
  data?: FinanceAnimationData;
  preferredTemplate?: FinanceAnimationTemplate;
};

export type FinanceAnimationScene = FinanceAnimationRequest & {
  mode: Exclude<FinanceSceneMode, 'image'>;
  template: FinanceAnimationTemplate;
};

export type FinanceAnimationRenderResult = {
  ok: boolean;
  template: FinanceAnimationTemplate;
  errors: string[];
  warnings: string[];
};
