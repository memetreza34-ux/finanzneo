import type {
  FinanceAnimationRenderResult,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';

const requiredKeys: Record<FinanceAnimationTemplate, string[]> = {
  'money-flow': ['amount', 'fromLabel', 'toLabel'],
  'budget-split': ['income', 'needsPercent', 'wantsPercent', 'savingsPercent'],
  'compound-growth': ['startCapital', 'monthlyRate', 'annualReturn', 'years'],
  'portfolio-allocation': ['allocations'],
  'inflation-erosion': ['startingValue', 'inflationPercent', 'years'],
  'debt-paydown': ['originalDebt', 'remainingDebt'],
  'monthly-investment': ['monthlyRate', 'months'],
  'before-after-comparison': ['beforeLabel', 'afterLabel', 'beforeValue', 'afterValue'],
  'risk-return-scale': ['riskPercent', 'returnPercent'],
  'timeline-milestones': ['milestones'],
  'income-expense-balance': ['income', 'expenses'],
  'tax-fee-flow': ['grossAmount', 'taxes', 'fees'],
};

export const validateTemplateData = (
  scene: FinanceAnimationScene,
): FinanceAnimationRenderResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data = scene.data ?? {};

  for (const key of requiredKeys[scene.template]) {
    if (!(key in data)) errors.push(`Pflichtwert fehlt: ${key}`);
  }

  if (!scene.message.trim()) errors.push('Kernaussage fehlt.');
  if (!scene.voiceText.trim()) errors.push('Voiceover-Text fehlt.');
  if ((scene.labels?.length ?? 0) > 5) warnings.push('Mehr als fünf Labels können die Szene überladen.');

  return {
    ok: errors.length === 0,
    template: scene.template,
    errors,
    warnings,
  };
};
