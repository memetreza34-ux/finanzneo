import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
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
  calculateCompoundInterest,
  calculateInflationAdjustedValue,
  calculateMonthlyInvestment,
  normalizePortfolioAllocation,
} from '../calculations/financeMath';

export const FINANCE_ANIMATION_CARD_DURATION = 180;
const principal = 1000;
const years = 20;
const annualRate = 0.07;
const compoundFinalValue =
  calculateCompoundInterest({principal, annualRate, years}) +
  calculateMonthlyInvestment({monthlyRate: 200, annualRate, years}).finalValue;
const monthlyPlan = calculateMonthlyInvestment({monthlyRate: 250, annualRate: 0.06, years: 1});
const inflationEndValue = calculateInflationAdjustedValue({amount: 100, inflationRate: 0.025, years: 10});
const portfolioAllocations = normalizePortfolioAllocation([
  {label: 'Welt-ETF', value: 70},
  {label: 'Anleihen', value: 20},
  {label: 'Cash', value: 10},
]);

export type FinanceAnimationGalleryItem = {
  readonly name: string;
  readonly render: () => React.ReactNode;
};

export const FINANCE_ANIMATION_GALLERY_ITEMS: readonly FinanceAnimationGalleryItem[] = [
  {
    name: 'Zinseszins',
    render: () => <CompoundGrowthTemplate principal={principal} finalValue={compoundFinalValue} years={years} />,
  },
  {
    name: 'Geldfluss',
    render: () => (
      <MoneyFlowTemplate
        incomeLabel="Gehalt"
        incomeValue="3.000 €"
        items={[
          {label: 'Fixkosten', value: '1.500 €', share: 0.5},
          {label: 'Freizeit', value: '900 €', share: 0.3},
          {label: 'ETF', value: '600 €', share: 0.2},
        ]}
      />
    ),
  },
  {
    name: 'Budget-Aufteilung',
    render: () => (
      <BudgetSplitTemplate
        income={2500}
        categories={[
          {label: 'Fixkosten', value: 1250},
          {label: 'Freizeit', value: 750},
          {label: 'Sparen', value: 500},
        ]}
      />
    ),
  },
  {
    name: 'Inflation',
    render: () => <InflationErosionTemplate startValue={100} endValue={inflationEndValue} years={10} />,
  },
  {
    name: 'Portfolio',
    render: () => <PortfolioAllocationTemplate total={25000} allocations={portfolioAllocations} />,
  },
  {
    name: 'Schuldenabbau',
    render: () => (
      <DebtPaydownTemplate
        startingDebt={12000}
        remainingDebt={4200}
        paidInstallments={26}
        totalInstallments={40}
      />
    ),
  },
  {
    name: 'Sparplan',
    render: () => (
      <MonthlyInvestmentTemplate
        monthlyAmount={250}
        months={12}
        finalValue={monthlyPlan.finalValue}
      />
    ),
  },
  {
    name: 'Vorher-Nachher',
    render: () => (
      <BeforeAfterComparisonTemplate
        beforeLabel="Nur sparen"
        afterLabel="Sparen + investieren"
        beforeValue={12000}
        afterValue={17800}
      />
    ),
  },
  {
    name: 'Risiko und Rendite',
    render: () => <RiskReturnScaleTemplate risk={0.45} returnPotential={0.65} />,
  },
  {
    name: 'Meilensteine',
    render: () => (
      <TimelineMilestonesTemplate
        milestones={[
          {label: 'Start', value: '0 €'},
          {label: '5 Jahre', value: '18.000 €'},
          {label: '10 Jahre', value: '42.000 €'},
          {label: '20 Jahre', value: '118.000 €'},
        ]}
      />
    ),
  },
  {
    name: 'Einnahmen und Ausgaben',
    render: () => <IncomeExpenseBalanceTemplate income={2800} expenses={2100} />,
  },
  {
    name: 'Steuern und Gebühren',
    render: () => <TaxFeeFlowTemplate gross={3000} taxes={620} fees={30} />,
  },
];

export const FINANCE_ANIMATION_GALLERY_DURATION =
  FINANCE_ANIMATION_GALLERY_ITEMS.length * FINANCE_ANIMATION_CARD_DURATION;

export const AnimationGallery: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#06110A'}}>
    {FINANCE_ANIMATION_GALLERY_ITEMS.map((item, index) => (
      <Sequence
        key={item.name}
        from={index * FINANCE_ANIMATION_CARD_DURATION}
        durationInFrames={FINANCE_ANIMATION_CARD_DURATION}
        name={item.name}
      >
        {item.render()}
      </Sequence>
    ))}
  </AbsoluteFill>
);
