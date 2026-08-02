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
import {calculateCompoundInterest, calculateMonthlyInvestment} from '../calculations/financeMath';

const CARD_DURATION = 180;
const principal = 1000;
const years = 20;
const annualRate = 0.07;
const finalValue =
  calculateCompoundInterest({principal, annualRate, years}) +
  calculateMonthlyInvestment({monthlyRate: 200, annualRate, years}).finalValue;

const galleryItems = [
  <CompoundGrowthTemplate key="compound" principal={principal} finalValue={finalValue} years={years} />,
  <MoneyFlowTemplate key="flow" amount={300} fromLabel="Gehalt" toLabel="ETF" />,
  <BudgetSplitTemplate key="budget" income={2500} needsPercent={50} wantsPercent={30} savingsPercent={20} />,
  <InflationErosionTemplate key="inflation" startingValue={100} inflationPercent={2.5} years={10} />,
  <PortfolioAllocationTemplate key="portfolio" allocations={[{label: 'Welt-ETF', value: 70}, {label: 'Anleihen', value: 20}, {label: 'Cash', value: 10}]} />,
  <DebtPaydownTemplate key="debt" originalDebt={12000} remainingDebt={4200} />,
  <MonthlyInvestmentTemplate key="monthly" monthlyRate={250} months={12} />,
  <BeforeAfterComparisonTemplate key="before-after" beforeLabel="Nur sparen" afterLabel="Sparen + investieren" beforeValue={12000} afterValue={17800} />,
  <RiskReturnScaleTemplate key="risk" riskPercent={45} returnPercent={65} />,
  <TimelineMilestonesTemplate key="timeline" milestones={[{label: 'Start', value: 0}, {label: '5 Jahre', value: 18000}, {label: '10 Jahre', value: 42000}, {label: '20 Jahre', value: 118000}]} />,
  <IncomeExpenseBalanceTemplate key="income-expense" income={2800} expenses={2100} />,
  <TaxFeeFlowTemplate key="tax-fee" grossAmount={3000} taxes={620} fees={30} />,
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
