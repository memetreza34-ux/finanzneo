export type SavingsPlanInput = {
  contributionPerPeriod: number;
  annualReturnRate: number;
  years: number;
  periodsPerYear?: number;
};

export type SavingsPlanPoint = {
  year: number;
  value: number;
  contributions: number;
  growth: number;
};

const assertFinite = (name: string, value: number): void => {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} muss eine endliche Zahl sein.`);
  }
};

const assertFiniteNonNegative = (name: string, value: number): void => {
  assertFinite(name, value);

  if (value < 0) {
    throw new Error(`${name} muss größer oder gleich 0 sein.`);
  }
};

const normalizePeriodsPerYear = (periodsPerYear = 12): number => {
  if (!Number.isInteger(periodsPerYear) || periodsPerYear <= 0) {
    throw new Error('periodsPerYear muss eine positive ganze Zahl sein.');
  }

  return periodsPerYear;
};

/**
 * Endwert eines Sparplans mit Einzahlung jeweils am Periodenende.
 *
 * Renditen werden als Dezimalzahl übergeben: 7 % = 0.07.
 * Die Funktion berücksichtigt keine Steuern, Kosten und Inflation.
 */
export const calculateSavingsPlanFutureValue = ({
  contributionPerPeriod,
  annualReturnRate,
  years,
  periodsPerYear = 12,
}: SavingsPlanInput): number => {
  assertFiniteNonNegative('contributionPerPeriod', contributionPerPeriod);
  assertFinite('annualReturnRate', annualReturnRate);
  assertFiniteNonNegative('years', years);

  const periods = normalizePeriodsPerYear(periodsPerYear);
  const totalPeriods = Math.round(years * periods);
  const periodicRate = annualReturnRate / periods;

  if (periodicRate <= -1) {
    throw new Error('Die Renditeannahme führt zu einem ungültigen Periodenzins von höchstens -100 %.');
  }

  if (totalPeriods === 0) return 0;
  if (periodicRate === 0) return contributionPerPeriod * totalPeriods;

  return contributionPerPeriod * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
};

export const calculateTotalContributions = ({
  contributionPerPeriod,
  years,
  periodsPerYear = 12,
}: Omit<SavingsPlanInput, 'annualReturnRate'>): number => {
  assertFiniteNonNegative('contributionPerPeriod', contributionPerPeriod);
  assertFiniteNonNegative('years', years);

  return contributionPerPeriod * Math.round(years * normalizePeriodsPerYear(periodsPerYear));
};

/**
 * Erzeugt eine jährliche Reihe inklusive Einzahlungen und rechnerischem Wachstum.
 */
export const calculateSavingsPlanSeries = ({
  contributionPerPeriod,
  annualReturnRate,
  years,
  periodsPerYear = 12,
}: SavingsPlanInput): SavingsPlanPoint[] => {
  if (!Number.isInteger(years)) {
    throw new Error('Für eine Jahresreihe muss years eine ganze Zahl sein.');
  }

  return Array.from({length: years + 1}, (_, year) => {
    const input = {
      contributionPerPeriod,
      annualReturnRate,
      years: year,
      periodsPerYear,
    };
    const value = calculateSavingsPlanFutureValue(input);
    const contributions = calculateTotalContributions({
      contributionPerPeriod,
      years: year,
      periodsPerYear,
    });

    return {
      year,
      value,
      contributions,
      growth: value - contributions,
    };
  });
};

export const roundMoney = (value: number): number => Math.round(value * 100) / 100;
