import React from 'react';
import type {FinanceAnimationScene} from '../contracts';
import {
  BeforeAfterComparisonTemplate,
  BudgetSplitTemplate,
  CompoundGrowthTemplate,
  DebtPaydownTemplate,
  IncomeExpenseBalanceTemplate,
  InflationErosionTemplate,
  MoneyFlowTemplate,
  MonthlyInvestmentTemplate,
  PortfolioAllocationTemplate,
  RiskReturnScaleTemplate,
  TaxFeeFlowTemplate,
  TimelineMilestonesTemplate,
} from '../templates';
import {
  futureValueLumpSum,
  futureValueMonthlyInvestment,
  inflationAdjustedValue,
  normalizeAllocation,
} from '../calculations/financeMath';

export type FinanceAnimationRendererProps = {
  scene: FinanceAnimationScene;
};

const numberValue = (scene: FinanceAnimationScene, key: string, fallback = 0): number => {
  const value = scene.data?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const stringValue = (scene: FinanceAnimationScene, key: string, fallback = ''): string => {
  const value = scene.data?.[key];
  return typeof value === 'string' ? value : fallback;
};

export const FinanceAnimationRenderer: React.FC<FinanceAnimationRendererProps> = ({scene}) => {
  switch (scene.template) {
    case 'compound-growth': {
      const principal = numberValue(scene, 'startCapital', numberValue(scene, 'principal'));
      const monthlyRate = numberValue(scene, 'monthlyRate', numberValue(scene, 'monthlyContribution'));
      const annualReturn = numberValue(scene, 'annualReturn', numberValue(scene, 'annualRate')) / 100;
      const years = numberValue(scene, 'years');
      const finalValue = futureValueLumpSum(principal, annualReturn, years)
        + futureValueMonthlyInvestment(monthlyRate, annualReturn, years);
      return <CompoundGrowthTemplate principal={principal} finalValue={finalValue} years={years} />;
    }
    case 'money-flow': {
      const amount = numberValue(scene, 'amount');
      const fromLabel = stringValue(scene, 'fromLabel', 'Gehalt');
      const toLabel = stringValue(scene, 'toLabel', 'Ziel');
      return <MoneyFlowTemplate incomeLabel={fromLabel} incomeValue={`${amount.toLocaleString('de-DE')} €`} items={[{label: toLabel, value: `${amount.toLocaleString('de-DE')} €`, share: 1}]} />;
    }
    case 'budget-split': {
      const income = numberValue(scene, 'income');
      const needsPercent = numberValue(scene, 'needsPercent');
      const wantsPercent = numberValue(scene, 'wantsPercent');
      const savingsPercent = numberValue(scene, 'savingsPercent');
      return <BudgetSplitTemplate income={income} categories={[
        {label: 'Fixkosten', value: income * needsPercent / 100},
        {label: 'Wünsche', value: income * wantsPercent / 100},
        {label: 'Sparen', value: income * savingsPercent / 100},
      ]} />;
    }
    case 'inflation-erosion': {
      const startValue = numberValue(scene, 'startingValue', numberValue(scene, 'startValue'));
      const inflationPercent = numberValue(scene, 'inflationPercent');
      const years = numberValue(scene, 'years');
      const endValue = inflationAdjustedValue(startValue, inflationPercent / 100, years);
      return <InflationErosionTemplate startValue={startValue} endValue={endValue} years={years} />;
    }
    case 'portfolio-allocation': {
      const raw = Array.isArray(scene.data?.allocations) ? scene.data?.allocations : [];
      const labels = raw.map((item) => typeof item === 'object' && item !== null && 'label' in item ? String(item.label) : 'Anlage');
      const values = raw.map((item) => typeof item === 'object' && item !== null && 'value' in item && typeof item.value === 'number' ? item.value : 0);
      const normalized = normalizeAllocation(values);
      return <PortfolioAllocationTemplate total={numberValue(scene, 'total', 10000)} allocations={labels.map((label, index) => ({label, percent: normalized[index] * 100}))} />;
    }
    case 'debt-paydown':
      return <DebtPaydownTemplate startingDebt={numberValue(scene, 'originalDebt', numberValue(scene, 'startingDebt'))} remainingDebt={numberValue(scene, 'remainingDebt')} paidInstallments={numberValue(scene, 'paidInstallments', 12)} totalInstallments={numberValue(scene, 'totalInstallments', 36)} />;
    case 'monthly-investment': {
      const monthlyAmount = numberValue(scene, 'monthlyRate', numberValue(scene, 'monthlyAmount'));
      const months = numberValue(scene, 'months');
      const annualRate = numberValue(scene, 'annualReturn', numberValue(scene, 'annualRate')) / 100;
      const finalValue = futureValueMonthlyInvestment(monthlyAmount, annualRate, months / 12);
      return <MonthlyInvestmentTemplate monthlyAmount={monthlyAmount} months={months} finalValue={finalValue} />;
    }
    case 'before-after-comparison':
      return <BeforeAfterComparisonTemplate beforeLabel={stringValue(scene, 'beforeLabel', 'Vorher')} afterLabel={stringValue(scene, 'afterLabel', 'Nachher')} beforeValue={numberValue(scene, 'beforeValue')} afterValue={numberValue(scene, 'afterValue')} />;
    case 'risk-return-scale':
      return <RiskReturnScaleTemplate riskPercent={numberValue(scene, 'riskPercent')} returnPercent={numberValue(scene, 'returnPercent')} />;
    case 'timeline-milestones':
      return <TimelineMilestonesTemplate milestones={Array.isArray(scene.data?.milestones) ? scene.data?.milestones as never : []} />;
    case 'income-expense-balance':
      return <IncomeExpenseBalanceTemplate income={numberValue(scene, 'income')} expenses={numberValue(scene, 'expenses')} />;
    case 'tax-fee-flow':
      return <TaxFeeFlowTemplate grossAmount={numberValue(scene, 'grossAmount')} taxes={numberValue(scene, 'taxes')} fees={numberValue(scene, 'fees')} />;
    default:
      return null;
  }
};
