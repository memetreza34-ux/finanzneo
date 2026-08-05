import type {FinanceAnimationScene} from '../contracts';
import {FINANCE_ANIMATION_DOMAIN_LIMITS} from '../domainLimits';

export type TemplatePresentationValidation = {
  errors: string[];
  warnings: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizedEntryLabels = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((entry) => entry.label)
    .filter((label): label is string => typeof label === 'string')
    .map((label) => label.trim().toLocaleLowerCase('de-DE'))
    .filter(Boolean);
};

const hasDuplicates = (values: readonly string[]): boolean =>
  new Set(values).size !== values.length;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const portfolioValueTolerance = (total: number): number =>
  Math.max(0.01, Math.abs(total) * 0.0001);

const validateVisibleTextLength = (
  value: unknown,
  fieldName: string,
  errors: string[],
): void => {
  if (
    typeof value === 'string' &&
    value.trim().length > FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength
  ) {
    errors.push(
      `Sichtbarer Text ist länger als ${FINANCE_ANIMATION_DOMAIN_LIMITS.maxVisibleLabelLength} Zeichen: ${fieldName}`,
    );
  }
};

const visibleDataLabelKeys = (
  scene: FinanceAnimationScene,
): readonly string[] => {
  switch (scene.template) {
    case 'money-flow':
      return ['fromLabel', 'toLabel'];
    case 'before-after-comparison':
      return ['beforeLabel', 'afterLabel'];
    default:
      return [];
  }
};

export const validateTemplatePresentation = (
  scene: FinanceAnimationScene,
): TemplatePresentationValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data = scene.data ?? {};

  for (const key of visibleDataLabelKeys(scene)) {
    validateVisibleTextLength(data[key], key, errors);
  }
  if (Array.isArray(scene.labels)) {
    scene.labels.forEach((label, index) => {
      validateVisibleTextLength(label, `labels[${index}]`, errors);
    });
  }

  if (scene.template === 'portfolio-allocation' && Array.isArray(data.allocations)) {
    if (data.allocations.length > 6) {
      errors.push('Das Portfolio-Template unterstützt höchstens sechs Positionen.');
    }

    const entries = data.allocations.filter(isRecord);
    if (
      entries.some(
        (entry) => entry.percent !== undefined && entry.value !== undefined,
      )
    ) {
      errors.push('Portfolio-Positionen dürfen nicht gleichzeitig value und percent enthalten.');
    }

    const labels = normalizedEntryLabels(data.allocations);
    if (hasDuplicates(labels)) {
      errors.push('Doppelte Portfolio-Labels sind nicht eindeutig darstellbar.');
    }

    const percentageValues = entries.map((entry) => entry.percent);
    const numericPercentages = percentageValues.filter(isFiniteNumber);
    const valueValues = entries.map((entry) => entry.value);
    const numericValues = valueValues.filter(isFiniteNumber);

    const usesPercentages = numericPercentages.length > 0;
    const usesValues = numericValues.length > 0;
    if (usesPercentages && usesValues) {
      errors.push(
        'Portfolio-Positionen müssen einheitlich entweder percent oder value verwenden.',
      );
    }

    if (numericPercentages.length === data.allocations.length) {
      const total = numericPercentages.reduce((sum, value) => sum + value, 0);
      if (Math.abs(total - 100) > 0.5) {
        errors.push(`Portfolio-Prozentwerte ergeben ${total.toFixed(1)} statt 100 Prozent.`);
      }
    }

    if (
      numericValues.length === data.allocations.length &&
      isFiniteNumber(data.total)
    ) {
      const allocationTotal = numericValues.reduce((sum, value) => sum + value, 0);
      if (
        Math.abs(allocationTotal - data.total) >
        portfolioValueTolerance(data.total)
      ) {
        errors.push(
          `Portfolio-Werte ergeben ${allocationTotal.toFixed(2)} statt ${data.total.toFixed(2)} Gesamtwert.`,
        );
      }
    }
  }

  if (scene.template === 'timeline-milestones' && Array.isArray(data.milestones)) {
    if (data.milestones.length > 5) {
      errors.push('Das Zeitleisten-Template unterstützt höchstens fünf Meilensteine.');
    }

    const entries = data.milestones.filter(isRecord);
    entries.forEach((entry, index) => {
      validateVisibleTextLength(entry.value, `milestones[${index}].value`, errors);
    });

    const labels = normalizedEntryLabels(data.milestones);
    if (hasDuplicates(labels)) {
      errors.push('Doppelte Meilenstein-Labels sind zeitlich nicht eindeutig.');
    }
  }

  if (scene.template === 'before-after-comparison') {
    const beforeValue = data.beforeValue;
    const afterValue = data.afterValue;
    if (
      typeof beforeValue === 'number' &&
      typeof afterValue === 'number' &&
      Number.isFinite(beforeValue) &&
      Number.isFinite(afterValue) &&
      beforeValue === afterValue
    ) {
      warnings.push('Vorher- und Nachher-Wert sind identisch; der Vergleich zeigt keinen Unterschied.');
    }
  }

  return {errors, warnings};
};
