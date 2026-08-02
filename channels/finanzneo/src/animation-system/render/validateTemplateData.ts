import type {
  FinanceAnimationRenderResult,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import {getFinanceAnimationTemplate} from '../templates/registry';

const NUMERIC_KEYS: Partial<Record<FinanceAnimationTemplate, readonly string[]>> = {
  'money-flow': ['amount'],
  'budget-split': ['income', 'needsPercent', 'wantsPercent', 'savingsPercent'],
  'compound-growth': ['startCapital', 'monthlyRate', 'annualReturn', 'years'],
  'inflation-erosion': ['startingValue', 'inflationPercent', 'years'],
  'debt-paydown': ['originalDebt', 'remainingDebt'],
  'monthly-investment': ['monthlyRate', 'months'],
  'before-after-comparison': ['beforeValue', 'afterValue'],
  'risk-return-scale': ['riskPercent', 'returnPercent'],
  'income-expense-balance': ['income', 'expenses'],
  'tax-fee-flow': ['grossAmount', 'taxes', 'fees'],
};

const PERCENT_KEYS = new Set([
  'needsPercent',
  'wantsPercent',
  'savingsPercent',
  'inflationPercent',
  'riskPercent',
  'returnPercent',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const validateStructuredArray = (
  template: FinanceAnimationTemplate,
  value: unknown,
): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return ['Strukturierte Liste fehlt oder ist leer.'];
  }

  if (template === 'portfolio-allocation') {
    const invalid = value.some((entry) => {
      if (!isRecord(entry) || !isNonEmptyString(entry.label)) return true;
      const numericValue = entry.percent ?? entry.value;
      return typeof numericValue !== 'number' || !Number.isFinite(numericValue) || numericValue < 0;
    });
    return invalid ? ['Portfolio-Einträge benötigen Label und nichtnegative Zahl.'] : [];
  }

  if (template === 'timeline-milestones') {
    const invalid = value.some((entry) => {
      if (!isRecord(entry) || !isNonEmptyString(entry.label)) return true;
      return !isNonEmptyString(entry.value) &&
        !(typeof entry.value === 'number' && Number.isFinite(entry.value));
    });
    return invalid ? ['Meilensteine benötigen Label und gültigen Wert.'] : [];
  }

  return [];
};

export const validateTemplateData = (
  scene: FinanceAnimationScene,
): FinanceAnimationRenderResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data = scene.data ?? {};
  const definition = getFinanceAnimationTemplate(scene.template);

  if (!definition) {
    errors.push(`Unbekanntes Animationstemplate: ${scene.template}`);
  } else {
    for (const key of definition.requiredData) {
      const value = data[key];
      if (value === undefined || value === null || value === '') {
        errors.push(`Pflichtwert fehlt: ${key}`);
      }
    }
  }

  for (const key of NUMERIC_KEYS[scene.template] ?? []) {
    const value = data[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(`Zahlenwert ist ungültig: ${key}`);
      continue;
    }
    if (value < 0) errors.push(`Zahlenwert darf nicht negativ sein: ${key}`);
    if (PERCENT_KEYS.has(key) && value > 100) {
      errors.push(`Prozentwert liegt über 100: ${key}`);
    }
  }

  if (scene.template === 'portfolio-allocation') {
    errors.push(...validateStructuredArray(scene.template, data.allocations));
  }
  if (scene.template === 'timeline-milestones') {
    errors.push(...validateStructuredArray(scene.template, data.milestones));
  }

  if (scene.template === 'budget-split') {
    const values = ['needsPercent', 'wantsPercent', 'savingsPercent']
      .map((key) => data[key])
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    if (values.length === 3) {
      const total = values.reduce((sum, value) => sum + value, 0);
      if (Math.abs(total - 100) > 0.5) {
        warnings.push(`Budgetanteile ergeben ${total.toFixed(1)} statt 100 Prozent.`);
      }
    }
  }

  if (scene.template === 'debt-paydown') {
    const originalDebt = data.originalDebt;
    const remainingDebt = data.remainingDebt;
    if (typeof originalDebt === 'number' && typeof remainingDebt === 'number' && remainingDebt > originalDebt) {
      warnings.push('Die Restschuld liegt über der ursprünglichen Schuld.');
    }
  }

  if (scene.template === 'tax-fee-flow') {
    const gross = data.grossAmount;
    const taxes = data.taxes;
    const fees = data.fees;
    if (typeof gross === 'number' && typeof taxes === 'number' && typeof fees === 'number' && taxes + fees > gross) {
      errors.push('Steuern und Gebühren überschreiten den Bruttobetrag.');
    }
  }

  if (!scene.message.trim()) errors.push('Kernaussage fehlt.');
  if (!scene.voiceText.trim()) errors.push('Voiceover-Text fehlt.');
  if ((scene.labels?.length ?? 0) > 5) {
    warnings.push('Mehr als fünf Labels können die Szene überladen.');
  }

  return {
    ok: errors.length === 0,
    template: scene.template,
    errors,
    warnings,
  };
};
