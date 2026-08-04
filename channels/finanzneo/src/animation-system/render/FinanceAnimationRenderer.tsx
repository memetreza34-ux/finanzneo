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
import {validateTemplateData} from './validateTemplateData';

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

const arrayValue = <T,>(scene: FinanceAnimationScene, key: string): T[] => {
  const value = scene.data?.[key];
  return Array.isArray(value) ? (value as T[]) : [];
};

/**
 * Szenendaten verwenden Prozentpunkte: 7 bedeutet 7 %, 0.5 bedeutet 0,5 %.
 * Nur Templates, die ausdrücklich mit Verhältnissen arbeiten, erhalten eine
 * Dezimalrate. Finanzberechnungstemplates erhalten die originalen Prozentpunkte
 * und berechnen daraus jeden sichtbaren Zwischenwert selbst.
 */
export const percentagePointsToRatio = (value: number): number => value / 100;

export const FinanceAnimationRenderer: React.FC<FinanceAnimationRendererProps> = ({scene}) => {
  const validation = validateTemplateData(scene);
  if (!validation.ok) return null;

  switch (scene.template) {
    case 'compound-growth':
      return (
        <CompoundGrowthTemplate
          principal={numberValue(scene, 'startCapital')}
          monthlyContribution={numberValue(scene, 'monthlyRate')}
          annualReturnPercent={numberValue(scene, 'annualReturn')}
          years={numberValue(scene, 'years')}
        />
      );
    case 'money-flow': {
      const amount = numberValue(scene, 'amount');
      const fromLabel = stringValue(scene, 'fromLabel', 'Quelle');
      const toLabel = stringValue(scene, 'toLabel', 'Ziel');
      return (
        <MoneyFlowTemplate
          incomeLabel={fromLabel}
          incomeValue={`${amount.toLocaleString('de-DE')} €`}
          items={[{label: toLabel, value: `${amount.toLocaleString('de-DE')} €`, share: 1}]}
        />
      );
    }
    case 'budget-split': {
      const income = numberValue(scene, 'income');
      const needsPercent = numberValue(scene, 'needsPercent');
      const wantsPercent = numberValue(scene, 'wantsPercent');
      const savingsPercent = numberValue(scene, 'savingsPercent');
      return (
        <BudgetSplitTemplate
          income={income}
          categories={[
            {label: 'Fixkosten', value: income * needsPercent / 100},
            {label: 'Wünsche', value: income * wantsPercent / 100},
            {label: 'Sparen', value: income * savingsPercent / 100},
          ]}
        />
      );
    }
    case 'inflation-erosion':
      return (
        <InflationErosionTemplate
          startValue={numberValue(scene, 'startingValue')}
          inflationPercent={numberValue(scene, 'inflationPercent')}
          years={numberValue(scene, 'years')}
        />
      );
    case 'portfolio-allocation': {
      const rawAllocations = arrayValue<{label: string; value?: number; percent?: number}>(scene, 'allocations');
      const total = numberValue(scene, 'total');
      const allocations = rawAllocations.map((item) => ({
        label: item.label,
        weight: typeof item.percent === 'number' ? item.percent : (item.value ?? 0),
      }));
      return <PortfolioAllocationTemplate total={total} allocations={allocations} />;
    }
    case 'debt-paydown':
      return (
        <DebtPaydownTemplate
          startingDebt={numberValue(scene, 'originalDebt')}
          remainingDebt={numberValue(scene, 'remainingDebt')}
          paidInstallments={numberValue(scene, 'paidInstallments')}
          totalInstallments={numberValue(scene, 'totalInstallments')}
        />
      );
    case 'monthly-investment':
      return (
        <MonthlyInvestmentTemplate
          monthlyAmount={numberValue(scene, 'monthlyRate')}
          months={numberValue(scene, 'months')}
          annualReturnPercent={numberValue(scene, 'annualReturn', 0)}
        />
      );
    case 'before-after-comparison':
      return (
        <BeforeAfterComparisonTemplate
          beforeLabel={stringValue(scene, 'beforeLabel', 'Vorher')}
          afterLabel={stringValue(scene, 'afterLabel', 'Nachher')}
          beforeValue={numberValue(scene, 'beforeValue')}
          afterValue={numberValue(scene, 'afterValue')}
        />
      );
    case 'risk-return-scale':
      return (
        <RiskReturnScaleTemplate
          risk={percentagePointsToRatio(numberValue(scene, 'riskPercent'))}
          returnPotential={percentagePointsToRatio(numberValue(scene, 'returnPercent'))}
        />
      );
    case 'timeline-milestones': {
      const milestones = arrayValue<{label: string; value: number | string}>(scene, 'milestones').map((item) => ({
        label: item.label,
        value: typeof item.value === 'number' ? `${item.value.toLocaleString('de-DE')} €` : item.value,
      }));
      return <TimelineMilestonesTemplate milestones={milestones} />;
    }
    case 'income-expense-balance':
      return <IncomeExpenseBalanceTemplate income={numberValue(scene, 'income')} expenses={numberValue(scene, 'expenses')} />;
    case 'tax-fee-flow':
      return <TaxFeeFlowTemplate gross={numberValue(scene, 'grossAmount')} taxes={numberValue(scene, 'taxes')} fees={numberValue(scene, 'fees')} />;
    default:
      return null;
  }
};
