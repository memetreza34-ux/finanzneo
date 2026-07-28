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

export type InflationInput = {
  amount: number;
  annualInflationRate: number;
  years: number;
};

export type LoanInput = {
  principal: number;
  annualInterestRate: number;
  termMonths: number;
};

export type LoanSummary = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export type LoanSchedulePoint = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
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

const assertFinitePositive = (name: string, value: number): void => {
  assertFinite(name, value);

  if (value <= 0) {
    throw new Error(`${name} muss größer als 0 sein.`);
  }
};

const normalizePeriodsPerYear = (periodsPerYear = 12): number => {
  if (!Number.isInteger(periodsPerYear) || periodsPerYear <= 0) {
    throw new Error('periodsPerYear muss eine positive ganze Zahl sein.');
  }

  return periodsPerYear;
};

const validateAnnualRateAboveMinusOne = (name: string, value: number): void => {
  assertFinite(name, value);

  if (value <= -1) {
    throw new Error(`${name} muss größer als -100 % sein.`);
  }
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

/** Erzeugt eine jährliche Reihe inklusive Einzahlungen und Wachstum. */
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

const validateInflationInput = ({
  amount,
  annualInflationRate,
  years,
}: InflationInput): void => {
  assertFiniteNonNegative('amount', amount);
  validateAnnualRateAboveMinusOne('annualInflationRate', annualInflationRate);
  assertFiniteNonNegative('years', years);
};

/**
 * Heutige Kaufkraft eines unveränderten nominalen Betrags nach Inflation.
 * Beispiel: 1.000 € bei 2 % Inflation über 10 Jahre → rund 820,35 € Kaufkraft.
 */
export const calculateInflationAdjustedValue = (input: InflationInput): number => {
  validateInflationInput(input);
  return input.amount / Math.pow(1 + input.annualInflationRate, input.years);
};

/** Betrag, der künftig für denselben Warenkorb benötigt würde. */
export const calculateFutureCost = (input: InflationInput): number => {
  validateInflationInput(input);
  return input.amount * Math.pow(1 + input.annualInflationRate, input.years);
};

/** Prozentualer Kaufkraftverlust eines unveränderten nominalen Betrags. */
export const calculatePurchasingPowerLossPercent = (input: InflationInput): number => {
  validateInflationInput(input);
  if (input.amount === 0) return 0;

  const adjusted = calculateInflationAdjustedValue(input);
  return (1 - adjusted / input.amount) * 100;
};

const validateLoanInput = ({
  principal,
  annualInterestRate,
  termMonths,
}: LoanInput): void => {
  assertFiniteNonNegative('principal', principal);
  assertFiniteNonNegative('annualInterestRate', annualInterestRate);

  if (!Number.isInteger(termMonths)) {
    throw new Error('termMonths muss eine ganze Zahl sein.');
  }
  assertFinitePositive('termMonths', termMonths);
};

/** Monatliche Annuitätenrate bei gleichbleibendem Sollzins. */
export const calculateMonthlyLoanPayment = (input: LoanInput): number => {
  validateLoanInput(input);

  if (input.principal === 0) return 0;

  const monthlyRate = input.annualInterestRate / 12;
  if (monthlyRate === 0) return input.principal / input.termMonths;

  const factor = Math.pow(1 + monthlyRate, input.termMonths);
  return input.principal * ((monthlyRate * factor) / (factor - 1));
};

export const calculateLoanSummary = (input: LoanInput): LoanSummary => {
  const monthlyPayment = calculateMonthlyLoanPayment(input);
  const totalPayment = monthlyPayment * input.termMonths;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - input.principal,
  };
};

/** Monatlicher Tilgungsplan. Rundung erfolgt erst für die Ausgabe. */
export const calculateLoanSchedule = (input: LoanInput): LoanSchedulePoint[] => {
  validateLoanInput(input);

  const regularPayment = calculateMonthlyLoanPayment(input);
  const monthlyRate = input.annualInterestRate / 12;
  let balance = input.principal;

  return Array.from({length: input.termMonths}, (_, index) => {
    const month = index + 1;
    const interest = balance * monthlyRate;
    const scheduledPrincipal = regularPayment - interest;
    const principal = month === input.termMonths
      ? balance
      : Math.min(balance, scheduledPrincipal);
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);

    return {
      month,
      payment,
      interest,
      principal,
      balance,
    };
  });
};

export const roundMoney = (value: number): number => Math.round(value * 100) / 100;
