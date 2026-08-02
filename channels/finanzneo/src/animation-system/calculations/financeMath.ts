export type CompoundInterestInput = {
  principal: number;
  annualRate: number;
  years: number;
};

export type MonthlyInvestmentInput = {
  monthlyRate: number;
  annualRate: number;
  years: number;
};

export type InflationInput = {
  amount: number;
  inflationRate: number;
  years: number;
};

export type LoanBalanceInput = {
  principal: number;
  annualRate: number;
  monthlyPayment: number;
  months: number;
};

export type PortfolioAllocationInput = {
  label: string;
  value: number;
};

const finiteOrZero = (value: number): number =>
  Number.isFinite(value) ? value : 0;

const nonNegativeFinite = (value: number): number =>
  Math.max(0, finiteOrZero(value));

const safeAnnualRate = (value: number): number =>
  Math.max(-0.999999, finiteOrZero(value));

const safeYears = (value: number): number =>
  nonNegativeFinite(value);

export const futureValueLumpSum = (
  principal: number,
  annualRate: number,
  years: number,
): number => {
  const safePrincipal = nonNegativeFinite(principal);
  return safePrincipal * (1 + safeAnnualRate(annualRate)) ** safeYears(years);
};

export const futureValueMonthlyInvestment = (
  monthlyContribution: number,
  annualRate: number,
  years: number,
): number => {
  const contribution = nonNegativeFinite(monthlyContribution);
  const months = Math.max(0, Math.round(safeYears(years) * 12));
  const monthlyRate = safeAnnualRate(annualRate) / 12;
  if (months === 0 || contribution === 0) return 0;
  if (Math.abs(monthlyRate) < Number.EPSILON) return contribution * months;
  return contribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
};

export const inflationAdjustedValue = (
  nominalValue: number,
  annualInflation: number,
  years: number,
): number => {
  const amount = nonNegativeFinite(nominalValue);
  return amount / (1 + safeAnnualRate(annualInflation)) ** safeYears(years);
};

export const remainingLoanBalance = (
  principal: number,
  annualRate: number,
  monthlyPayment: number,
  paidMonths: number,
): number => {
  const safePrincipal = nonNegativeFinite(principal);
  const payment = nonNegativeFinite(monthlyPayment);
  const months = Math.max(0, Math.round(nonNegativeFinite(paidMonths)));
  const monthlyRate = safeAnnualRate(annualRate) / 12;
  if (months === 0) return safePrincipal;
  if (Math.abs(monthlyRate) < Number.EPSILON) {
    return Math.max(0, safePrincipal - payment * months);
  }
  const growth = (1 + monthlyRate) ** months;
  return Math.max(0, safePrincipal * growth - payment * ((growth - 1) / monthlyRate));
};

export const normalizeAllocation = (values: number[]): number[] => {
  const safeValues = values.map(nonNegativeFinite);
  const total = safeValues.reduce((sum, value) => sum + value, 0);
  if (total === 0) return safeValues.map(() => 0);
  return safeValues.map((value) => value / total);
};

export const calculateCompoundInterest = ({
  principal,
  annualRate,
  years,
}: CompoundInterestInput): number => futureValueLumpSum(principal, annualRate, years);

export const calculateMonthlyInvestment = ({
  monthlyRate,
  annualRate,
  years,
}: MonthlyInvestmentInput): {
  totalContributions: number;
  finalValue: number;
  earnings: number;
} => {
  const contribution = nonNegativeFinite(monthlyRate);
  const months = Math.max(0, Math.round(safeYears(years) * 12));
  const totalContributions = contribution * months;
  const finalValue = futureValueMonthlyInvestment(contribution, annualRate, years);
  return {
    totalContributions,
    finalValue,
    earnings: finalValue - totalContributions,
  };
};

export const calculateInflationAdjustedValue = ({
  amount,
  inflationRate,
  years,
}: InflationInput): number => inflationAdjustedValue(amount, inflationRate, years);

export const calculateLoanBalance = ({
  principal,
  annualRate,
  monthlyPayment,
  months,
}: LoanBalanceInput): {
  remainingBalance: number;
  totalPaid: number;
} => {
  const safeMonths = Math.max(0, Math.round(nonNegativeFinite(months)));
  const payment = nonNegativeFinite(monthlyPayment);
  return {
    remainingBalance: remainingLoanBalance(principal, annualRate, payment, safeMonths),
    totalPaid: payment * safeMonths,
  };
};

export const normalizePortfolioAllocation = (
  allocations: PortfolioAllocationInput[],
): Array<PortfolioAllocationInput & {percent: number}> => {
  const normalized = normalizeAllocation(allocations.map((item) => item.value));
  return allocations.map((item, index) => ({
    ...item,
    value: nonNegativeFinite(item.value),
    percent: normalized[index] * 100,
  }));
};
