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

export const futureValueLumpSum = (
  principal: number,
  annualRate: number,
  years: number,
): number => principal * (1 + annualRate) ** years;

export const futureValueMonthlyInvestment = (
  monthlyContribution: number,
  annualRate: number,
  years: number,
): number => {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRate / 12;
  if (months === 0) return 0;
  if (monthlyRate === 0) return monthlyContribution * months;
  return monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
};

export const inflationAdjustedValue = (
  nominalValue: number,
  annualInflation: number,
  years: number,
): number => nominalValue / (1 + annualInflation) ** years;

export const remainingLoanBalance = (
  principal: number,
  annualRate: number,
  monthlyPayment: number,
  paidMonths: number,
): number => {
  const monthlyRate = annualRate / 12;
  if (paidMonths <= 0) return principal;
  if (monthlyRate === 0) return Math.max(0, principal - monthlyPayment * paidMonths);
  const growth = (1 + monthlyRate) ** paidMonths;
  return Math.max(0, principal * growth - monthlyPayment * ((growth - 1) / monthlyRate));
};

export const normalizeAllocation = (values: number[]): number[] => {
  const safeValues = values.map((value) => Math.max(0, value));
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
  const months = Math.max(0, Math.round(years * 12));
  const totalContributions = monthlyRate * months;
  const finalValue = futureValueMonthlyInvestment(monthlyRate, annualRate, years);
  return {
    totalContributions,
    finalValue,
    earnings: Math.max(0, finalValue - totalContributions),
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
} => ({
  remainingBalance: remainingLoanBalance(principal, annualRate, monthlyPayment, months),
  totalPaid: monthlyPayment * Math.max(0, months),
});

export const normalizePortfolioAllocation = (
  allocations: PortfolioAllocationInput[],
): Array<PortfolioAllocationInput & {percent: number}> => {
  const normalized = normalizeAllocation(allocations.map((item) => item.value));
  return allocations.map((item, index) => ({
    ...item,
    percent: normalized[index] * 100,
  }));
};
