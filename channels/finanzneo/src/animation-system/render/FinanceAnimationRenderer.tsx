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
import {calculateCompoundInterest, calculateMonthlyInvestment} from '../calculations/financeMath';

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
      const principal = numberValue(scene, 'principal', numberValue(scene, 'startCapital'));
      const monthlyRate = numberValue(scene, 'monthlyRate');
      const annualReturnPercent = numberValue(scene, 'annualReturn');
      const years = numberValue(scene, 'years');
      const annualRate = annualReturnPercent / 100;
      const lumpSum = calculateCompoundInterest({principal, annualRate, years});
      const monthlyPlan = calculateMonthlyInvestment({monthlyRate, annualRate, years});
      return (
        <CompoundGrowthTemplate
          principal={principal}
          finalValue={lumpSum + monthlyPlan.finalValue}
          years={years}
        />
      );
    }
    case 'money-flow':
      return <MoneyFlowTemplate amount={numberValue(scene, 'amount')} fromLabel={stringValue(scene, 'fromLabel', 'Quelle')} toLabel={stringValue(scene, 'toLabel', 'Ziel')} />;
    case 'budget-split':
      return <BudgetSplitTemplate income={numberValue(scene, 'income')} needsPercent={numberValue(scene, 'needsPercent')} wantsPercent={numberValue(scene, 'wantsPercent')} savingsPercent={numberValue(scene, 'savingsPercent')} />;
    case 'inflation-erosion':
      return <InflationErosionTemplate startingValue={numberValue(scene, 'startingValue')} inflationPercent={numberValue(scene, 'inflationPercent')} years={numberValue(scene, 'years')} />;
    case 'portfolio-allocation':
      return <PortfolioAllocationTemplate allocations={Array.isArray(scene.data?.allocations) ? scene.data?.allocations as never : []} />;
    case 'debt-paydown':
      return <DebtPaydownTemplate originalDebt={numberValue(scene, 'originalDebt')} remainingDebt={numberValue(scene, 'remainingDebt')} />;
    case 'monthly-investment':
      return <MonthlyInvestmentTemplate monthlyRate={numberValue(scene, 'monthlyRate')} months={numberValue(scene, 'months')} />;
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
