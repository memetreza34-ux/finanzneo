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
