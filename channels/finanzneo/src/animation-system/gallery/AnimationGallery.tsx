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

const CARD_DURATION = 180;
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

const galleryItems = [
  <CompoundGrowthTemplate key="compound" principal={principal} finalValue={compoundFinalValue} years={years} />,
  <MoneyFlowTemplate
    key="flow"
    incomeLabel="Gehalt"
    incomeValue="3.000 €"
    items={[
      {label: 'Fixkosten', value: '1.500 €', share: 0.5},
      {label: 'Freizeit', value: '900 €', share: 0.3},
      {label: 'ETF', value: '600 €', share: 0.2},
    ]}
  />,
  <BudgetSplitTemplate
    key="budget"
    income={2500}
    categories={[
      {label: 'Fixkosten', value: 1250},
      {label: 'Freizeit', value: 750},
      {label: 'Sparen', value: 500},
    ]}
  />,
  <InflationErosionTemplate key="inflation" startValue={100} endValue={inflationEndValue} years={10} />,
  <PortfolioAllocationTemplate key="portfolio" total={25000} allocations={portfolioAllocations} />,
  <DebtPaydownTemplate
    key="debt"
    startingDebt={12000}
    remainingDebt={4200}
    paidInstallments={26}
    totalInstallments={40}
  />,
  <MonthlyInvestmentTemplate
    key="monthly"
    monthlyAmount={250}
    months={12}
    finalValue={monthlyPlan.finalValue}
  />,
  <BeforeAfterComparisonTemplate
    key="before-after"
    beforeLabel="Nur sparen"
    afterLabel="Sparen + investieren"
    beforeValue={12000}
    afterValue={17800}
  />,
  <RiskReturnScaleTemplate key="risk" risk={0.45} returnPotential={0.65} />,
  <TimelineMilestonesTemplate
    key="timeline"
    milestones={[
      {label: 'Start', value: '0 €'},
      {label: '5 Jahre', value: '18.000 €'},
      {label: '10 Jahre', value: '42.000 €'},
      {label: '20 Jahre', value: '118.000 €'},
    ]}
  />,
  <IncomeExpenseBalanceTemplate key="income-expense" income={2800} expenses={2100} />,
  <TaxFeeFlowTemplate key="tax-fee" gross={3000} taxes={620} fees={30} />,
] as const;

export const FINANCE_ANIMATION_GALLERY_DURATION = galleryItems.length * CARD_DURATION;

export const AnimationGallery: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#06110A'}}>
    {galleryItems.map((item, index) => (
      <Sequence
        key={index}
        from={index * CARD_DURATION}
        durationInFrames={CARD_DURATION}
        name={`Animation ${index + 1}`}
      >
        {item}
      </Sequence>
    ))}
  </AbsoluteFill>
);
