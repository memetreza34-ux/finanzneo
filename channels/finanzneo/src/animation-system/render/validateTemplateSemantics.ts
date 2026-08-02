import type {FinanceAnimationScene} from '../contracts';

export type TemplateSemanticValidation = {
  errors: string[];
  warnings: string[];
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const trimmedString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value.trim() : undefined;

const requireVisibleLabel = (
  value: unknown,
  fieldName: string,
  errors: string[],
): void => {
  const label = trimmedString(value);
  if (!label) {
    errors.push(`Beschriftung muss ein sichtbarer Text sein: ${fieldName}`);
  }
};

export const validateTemplateSemantics = (
  scene: FinanceAnimationScene,
): TemplateSemanticValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data = scene.data ?? {};

  switch (scene.template) {
    case 'money-flow': {
      if (isFiniteNumber(data.amount) && data.amount <= 0) {
        errors.push('Der Geldfluss-Betrag muss größer als null sein.');
      }
      requireVisibleLabel(data.fromLabel, 'fromLabel', errors);
      requireVisibleLabel(data.toLabel, 'toLabel', errors);
      const source = trimmedString(data.fromLabel)?.toLocaleLowerCase('de-DE');
      const target = trimmedString(data.toLabel)?.toLocaleLowerCase('de-DE');
      if (source && target && source === target && data.fromLabel !== data.toLabel) {
        errors.push('Quelle und Ziel des Geldflusses sind auch nach Normalisierung identisch.');
      }
      break;
    }
    case 'budget-split':
      if (isFiniteNumber(data.income) && data.income <= 0) {
        errors.push('Das verfügbare Budget muss größer als null sein.');
      }
      break;
    case 'compound-growth': {
      const principal = isFiniteNumber(data.startCapital) ? data.startCapital : 0;
      const contribution = isFiniteNumber(data.monthlyRate) ? data.monthlyRate : 0;
      const annualReturn = isFiniteNumber(data.annualReturn) ? data.annualReturn : 0;
      if (principal <= 0 && contribution <= 0) {
        errors.push('Zinseszins benötigt Startkapital oder eine positive monatliche Einzahlung.');
      } else if (contribution <= 0 && annualReturn <= 0) {
        errors.push('Das Wachstumstemplate benötigt eine positive Einzahlung oder Rendite.');
      }
      break;
    }
    case 'portfolio-allocation':
      if (isFiniteNumber(data.total) && data.total <= 0) {
        errors.push('Der dargestellte Portfoliowert muss größer als null sein.');
      }
      break;
    case 'inflation-erosion':
      if (isFiniteNumber(data.startingValue) && data.startingValue <= 0) {
        errors.push('Der Ausgangswert für die Kaufkraft muss größer als null sein.');
      }
      if (isFiniteNumber(data.inflationPercent) && data.inflationPercent <= 0) {
        errors.push('Das Kaufkraftverlust-Template benötigt eine positive Inflationsrate.');
      }
      break;
    case 'debt-paydown': {
      if (isFiniteNumber(data.originalDebt) && data.originalDebt <= 0) {
        errors.push('Die ursprüngliche Schuld muss größer als null sein.');
      }
      const originalDebt = data.originalDebt;
      const remainingDebt = data.remainingDebt;
      const paidInstallments = data.paidInstallments;
      if (
        isFiniteNumber(originalDebt) &&
        isFiniteNumber(remainingDebt) &&
        isFiniteNumber(paidInstallments)
      ) {
        if (paidInstallments === 0 && remainingDebt < originalDebt) {
          errors.push('Die Restschuld ist gesunken, obwohl keine Raten bezahlt wurden.');
        }
        if (paidInstallments > 0 && remainingDebt >= originalDebt) {
          errors.push('Schuldenabbau benötigt nach bezahlten Raten eine niedrigere Restschuld.');
        }
      }
      break;
    }
    case 'monthly-investment':
      if (isFiniteNumber(data.monthlyRate) && data.monthlyRate <= 0) {
        errors.push('Die monatliche Sparrate muss größer als null sein.');
      }
      break;
    case 'before-after-comparison':
      requireVisibleLabel(data.beforeLabel, 'beforeLabel', errors);
      requireVisibleLabel(data.afterLabel, 'afterLabel', errors);
      break;
    case 'risk-return-scale':
      if (data.riskPercent === 0 && data.returnPercent === 0) {
        warnings.push('Risiko und Renditechance sind beide null; die Skala zeigt keinen Unterschied.');
      }
      break;
    case 'income-expense-balance':
      if (data.income === 0 && data.expenses === 0) {
        warnings.push('Einnahmen und Ausgaben sind beide null; es entsteht keine sichtbare Balance.');
      }
      break;
    case 'tax-fee-flow':
      if (isFiniteNumber(data.grossAmount) && data.grossAmount <= 0) {
        errors.push('Der Bruttobetrag muss größer als null sein.');
      }
      break;
    case 'timeline-milestones':
      break;
    default:
      break;
  }

  return {errors, warnings};
};
