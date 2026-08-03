import type {
  FinanceAnimationRenderResult,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import {
  FINANCE_ANIMATION_ALLOWED_DATA,
  FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS,
} from '../templates/allowedTemplateData';
import {getFinanceAnimationTemplate} from '../templates/registry';
import {validateTemplatePresentation} from './validateTemplatePresentation';
import {validateTemplateSemantics} from './validateTemplateSemantics';

const NUMERIC_KEYS: Partial<Record<FinanceAnimationTemplate, readonly string[]>> = {
  'money-flow': ['amount'],
  'budget-split': ['income', 'needsPercent', 'wantsPercent', 'savingsPercent'],
  'compound-growth': ['startCapital', 'monthlyRate', 'annualReturn', 'years'],
  'portfolio-allocation': ['total'],
  'inflation-erosion': ['startingValue', 'inflationPercent', 'years'],
  'debt-paydown': ['originalDebt', 'remainingDebt', 'paidInstallments', 'totalInstallments'],
  'monthly-investment': ['monthlyRate', 'months', 'annualReturn'],
  'before-after-comparison': ['beforeValue', 'afterValue'],
  'risk-return-scale': ['riskPercent', 'returnPercent'],
  'income-expense-balance': ['income', 'expenses'],
  'tax-fee-flow': ['grossAmount', 'taxes', 'fees'],
};

const NON_NEGATIVE_KEYS = new Set([
  'amount',
  'income',
  'needsPercent',
  'wantsPercent',
  'savingsPercent',
  'startCapital',
  'monthlyRate',
  'years',
  'total',
  'startingValue',
  'inflationPercent',
  'originalDebt',
  'remainingDebt',
  'paidInstallments',
  'totalInstallments',
  'months',
  'beforeValue',
  'afterValue',
  'riskPercent',
  'returnPercent',
  'expenses',
  'grossAmount',
  'taxes',
  'fees',
]);

const PERCENT_KEYS = new Set([
  'needsPercent',
  'wantsPercent',
  'savingsPercent',
  'annualReturn',
  'inflationPercent',
  'riskPercent',
  'returnPercent',
]);

const POSITIVE_KEYS = new Set(['years', 'months', 'totalInstallments']);
const INTEGER_KEYS = new Set(['months', 'paidInstallments', 'totalInstallments']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const unknownKeys = (
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): string[] => {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).filter((key) => !allowed.has(key));
};

const structuredArrayErrors = (
  template: FinanceAnimationTemplate,
  value: unknown,
): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return ['Strukturierte Liste fehlt oder ist leer.'];
  }

  if (template === 'portfolio-allocation') {
    const values: number[] = [];
    const errors: string[] = [];
    const invalid = value.some((entry, index) => {
      if (!isRecord(entry) || !isNonEmptyString(entry.label)) return true;

      for (const key of unknownKeys(
        entry,
        FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS['portfolio-allocation'],
      )) {
        errors.push(`Unbekanntes Portfolio-Feld in Position ${index + 1}: ${key}`);
      }

      const numericValue = entry.percent ?? entry.value;
      if (typeof numericValue !== 'number' || !Number.isFinite(numericValue) || numericValue < 0) {
        return true;
      }
      values.push(numericValue);
      return false;
    });
    if (invalid) errors.push('Portfolio-Einträge benötigen Label und nichtnegative Zahl.');
    if (values.reduce((sum, item) => sum + item, 0) <= 0) {
      errors.push('Portfolio-Gewichtungen müssen zusammen größer als null sein.');
    }
    return errors;
  }

  if (template === 'timeline-milestones') {
    const errors: string[] = [];
    const invalid = value.some((entry, index) => {
      if (!isRecord(entry) || !isNonEmptyString(entry.label)) return true;

      for (const key of unknownKeys(
        entry,
        FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS['timeline-milestones'],
      )) {
        errors.push(`Unbekanntes Meilenstein-Feld in Position ${index + 1}: ${key}`);
      }

      return !isNonEmptyString(entry.value) &&
        !(typeof entry.value === 'number' && Number.isFinite(entry.value));
    });
    if (invalid) errors.push('Meilensteine benötigen Label und gültigen Wert.');
    return errors;
  }

  return [];
};

const validateNumericData = (
  template: FinanceAnimationTemplate,
  data: Record<string, unknown>,
  errors: string[],
): void => {
  for (const key of NUMERIC_KEYS[template] ?? []) {
    const value = data[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(`Zahlenwert ist ungültig: ${key}`);
      continue;
    }
    if (NON_NEGATIVE_KEYS.has(key) && value < 0) {
      errors.push(`Zahlenwert darf nicht negativ sein: ${key}`);
    }
    if (PERCENT_KEYS.has(key) && value > 100) {
      errors.push(`Prozentwert liegt über 100: ${key}`);
    }
    if (key === 'annualReturn' && value <= -100) {
      errors.push('Rendite muss größer als -100 Prozent sein.');
    }
    if (POSITIVE_KEYS.has(key) && value <= 0) {
      errors.push(`Zahlenwert muss größer als null sein: ${key}`);
    }
    if (INTEGER_KEYS.has(key) && !Number.isInteger(value)) {
      errors.push(`Zahlenwert muss ganzzahlig sein: ${key}`);
    }
  }
};

const uniqueMessages = (messages: readonly string[]): string[] =>
  [...new Set(messages)];

export const validateTemplateData = (
  scene: FinanceAnimationScene,
): FinanceAnimationRenderResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rawData: unknown = scene.data;
  const data = isRecord(rawData) ? rawData : {};
  const definition = getFinanceAnimationTemplate(scene.template);

  if (rawData !== undefined && !isRecord(rawData)) {
    errors.push('Animationsdaten müssen als strukturiertes Objekt vorliegen.');
  }

  if (!definition) {
    errors.push(`Unbekanntes Animationstemplate: ${scene.template}`);
  } else {
    for (const key of definition.requiredData) {
      const value = data[key];
      if (value === undefined || value === null || value === '') {
        errors.push(`Pflichtwert fehlt: ${key}`);
      }
    }

    for (const key of unknownKeys(
      data,
      FINANCE_ANIMATION_ALLOWED_DATA[scene.template],
    )) {
      errors.push(`Unbekanntes Datenfeld für ${scene.template}: ${key}`);
    }
  }

  validateNumericData(scene.template, data, errors);

  if (scene.template === 'compound-growth') {
    const annualReturn = data.annualReturn;
    if (typeof annualReturn === 'number' && Number.isFinite(annualReturn) && annualReturn < 0) {
      errors.push('Das Zinseszins-Template benötigt eine nichtnegative Rendite.');
    }
  }

  if (scene.template === 'portfolio-allocation') {
    errors.push(...structuredArrayErrors(scene.template, data.allocations));
  }
  if (scene.template === 'timeline-milestones') {
    errors.push(...structuredArrayErrors(scene.template, data.milestones));
    if (Array.isArray(data.milestones) && data.milestones.length === 1) {
      warnings.push('Eine Zeitleiste mit nur einem Meilenstein zeigt keine Entwicklung.');
    }
  }

  if (scene.template === 'budget-split') {
    const values = ['needsPercent', 'wantsPercent', 'savingsPercent']
      .map((key) => data[key])
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    if (values.length === 3) {
      const total = values.reduce((sum, value) => sum + value, 0);
      if (Math.abs(total - 100) > 0.5) {
        errors.push(`Budgetanteile ergeben ${total.toFixed(1)} statt 100 Prozent.`);
      }
    }
  }

  if (scene.template === 'money-flow') {
    if (data.fromLabel === data.toLabel && isNonEmptyString(data.fromLabel)) {
      errors.push('Quelle und Ziel des Geldflusses müssen unterschiedlich sein.');
    }
  }

  if (scene.template === 'debt-paydown') {
    const originalDebt = data.originalDebt;
    const remainingDebt = data.remainingDebt;
    if (typeof originalDebt === 'number' && typeof remainingDebt === 'number' && remainingDebt > originalDebt) {
      errors.push('Die Restschuld darf nicht über der ursprünglichen Schuld liegen.');
    }
    const paid = data.paidInstallments;
    const total = data.totalInstallments;
    if (typeof paid === 'number' && typeof total === 'number' && paid > total) {
      errors.push('Bezahlte Raten überschreiten die Gesamtzahl der Raten.');
    }
  }

  if (scene.template === 'before-after-comparison') {
    if (data.beforeLabel === data.afterLabel && isNonEmptyString(data.beforeLabel)) {
      warnings.push('Vorher- und Nachher-Beschriftung sind identisch.');
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

  const semanticValidation = validateTemplateSemantics(scene);
  errors.push(...semanticValidation.errors);
  warnings.push(...semanticValidation.warnings);

  const presentationValidation = validateTemplatePresentation(scene);
  errors.push(...presentationValidation.errors);
  warnings.push(...presentationValidation.warnings);

  if (!isNonEmptyString(scene.message)) errors.push('Kernaussage fehlt.');
  if (!isNonEmptyString(scene.voiceText)) errors.push('Voiceover-Text fehlt.');
  if (Array.isArray(scene.labels) && scene.labels.length > 5) {
    warnings.push('Mehr als fünf Labels können die Szene überladen.');
  }

  const uniqueErrors = uniqueMessages(errors);
  const uniqueWarnings = uniqueMessages(warnings);

  return {
    ok: uniqueErrors.length === 0,
    template: scene.template,
    errors: uniqueErrors,
    warnings: uniqueWarnings,
  };
};
