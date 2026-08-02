import type {FinanceAnimationScene} from '../contracts';

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

export const validateTemplatePresentation = (
  scene: FinanceAnimationScene,
): TemplatePresentationValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data = scene.data ?? {};

  if (scene.template === 'portfolio-allocation' && Array.isArray(data.allocations)) {
    if (data.allocations.length > 6) {
      errors.push('Das Portfolio-Template unterstützt höchstens sechs Positionen.');
    }

    const labels = normalizedEntryLabels(data.allocations);
    if (hasDuplicates(labels)) {
      warnings.push('Doppelte Portfolio-Labels erschweren die visuelle Zuordnung.');
    }

    const percentageValues = data.allocations
      .filter(isRecord)
      .map((entry) => entry.percent);
    const numericPercentages = percentageValues.filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value),
    );
    if (numericPercentages.length === data.allocations.length) {
      const total = numericPercentages.reduce((sum, value) => sum + value, 0);
      if (Math.abs(total - 100) > 0.5) {
        warnings.push(`Portfolio-Prozentwerte ergeben ${total.toFixed(1)} statt 100 Prozent.`);
      }
    }
  }

  if (scene.template === 'timeline-milestones' && Array.isArray(data.milestones)) {
    if (data.milestones.length > 5) {
      errors.push('Das Zeitleisten-Template unterstützt höchstens fünf Meilensteine.');
    }

    const labels = normalizedEntryLabels(data.milestones);
    if (hasDuplicates(labels)) {
      warnings.push('Doppelte Meilenstein-Labels erschweren die zeitliche Zuordnung.');
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
