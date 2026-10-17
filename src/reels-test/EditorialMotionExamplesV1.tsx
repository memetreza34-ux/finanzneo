import React from 'react';
import {
  AllocationSplit,
  CompoundGrowth,
  Diversification,
  DocumentCostIncrease,
  FinanceTimeline,
  LoanPaydown,
  MoneySplit,
  MoneyTransfer,
  MountainProgress,
  ProtectionLimit,
  Rebalancing,
  ScenarioComparison,
  ValueDrain,
  ValueGrowth,
} from '../finance-motion/editorial-v1';

export const EDITORIAL_EXAMPLE_FRAMES = 150;

export const EditorialMotion01Transfer: React.FC = () => (
  <MoneyTransfer
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    fromLabel="Girokonto"
    toLabel="Notgroschen"
    amount="400 €"
  />
);

export const EditorialMotion02BudgetSplit: React.FC = () => (
  <MoneySplit
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    sourceLabel="Nettoeinkommen"
    amount="2.600 €"
    parts={[
      {label:'Fixkosten',share:55,tone:'neutral'},
      {label:'Leben',share:25,tone:'blue'},
      {label:'Investieren',share:20,tone:'green'},
    ]}
  />
);

export const EditorialMotion03SalaryGrowth: React.FC = () => (
  <ValueGrowth
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    label="Monatsgehalt"
    startValue="3.000 €"
    endValue="3.800 €"
    tone="green"
    steps={6}
  />
);

export const EditorialMotion04FeeDrag: React.FC = () => (
  <ValueDrain
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    label="Anlagewert"
    startValue="100 %"
    endValue="86 %"
    drainLabel="Gebühren"
  />
);

export const EditorialMotion05PortfolioSplit: React.FC = () => (
  <AllocationSplit
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    title="Portfolio"
    parts={[
      {label:'Welt-ETF',value:70,tone:'green'},
      {label:'Tagesgeld',value:20,tone:'blue'},
      {label:'Gold',value:10,tone:'gold'},
    ]}
  />
);

export const EditorialMotion06Rebalancing: React.FC = () => (
  <Rebalancing
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    leftLabel="Aktien"
    rightLabel="Anleihen"
    from={[85,15]}
    to={[70,30]}
  />
);

export const EditorialMotion07Diversification: React.FC = () => (
  <Diversification
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    sourceLabel="ETF"
    destinations={[
      {label:'Technologie',tone:'blue'},
      {label:'Gesundheit',tone:'green'},
      {label:'Industrie',tone:'neutral'},
      {label:'Konsum',tone:'gold'},
    ]}
  />
);

export const EditorialMotion08LoanPaydown: React.FC = () => (
  <LoanPaydown
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    label="Restschuld"
    startDebt="24.000 €"
    endDebt="15.000 €"
    payments={5}
  />
);

export const EditorialMotion09DepositProtection: React.FC = () => (
  <ProtectionLimit
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    entityLabel="Bank"
    items={['Girokonto','Tagesgeld','Festgeld']}
    limit="100.000 €"
  />
);

export const EditorialMotion10ScenarioCompare: React.FC = () => (
  <ScenarioComparison
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    left={{label:'Investieren',value:'91.000 €',tone:'green'}}
    right={{label:'Nur sparen',value:'69.000 €',tone:'orange'}}
  />
);

export const EditorialMotion11Timeline: React.FC = () => (
  <FinanceTimeline
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    milestones={[
      {label:'20 Jahre',value:'Start',tone:'neutral'},
      {label:'25 Jahre',value:'10k',tone:'blue'},
      {label:'30 Jahre',value:'30k',tone:'green'},
      {label:'35 Jahre',value:'65k',tone:'gold'},
    ]}
  />
);

export const EditorialMotion12CompoundGrowth: React.FC = () => (
  <CompoundGrowth
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    periods={['Start','10 J.','20 J.','30 J.']}
    values={['10k','18k','34k','64k']}
  />
);

export const EditorialMotion13MountainGoal: React.FC = () => (
  <MountainProgress
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    flagLabel="100.000 €"
  />
);

export const EditorialMotion14LateFee: React.FC = () => (
  <DocumentCostIncrease
    durationFrames={EDITORIAL_EXAMPLE_FRAMES}
    startAmount="100 €"
    fee="+ 5 €"
    endAmount="105 €"
  />
);

export const EDITORIAL_MOTION_EXAMPLES = [
  {id:'EditorialMotion01Transfer',component:EditorialMotion01Transfer,file:'01-transfer.mp4'},
  {id:'EditorialMotion02BudgetSplit',component:EditorialMotion02BudgetSplit,file:'02-budget-split.mp4'},
  {id:'EditorialMotion03SalaryGrowth',component:EditorialMotion03SalaryGrowth,file:'03-salary-growth.mp4'},
  {id:'EditorialMotion04FeeDrag',component:EditorialMotion04FeeDrag,file:'04-fee-drag.mp4'},
  {id:'EditorialMotion05PortfolioSplit',component:EditorialMotion05PortfolioSplit,file:'05-portfolio-split.mp4'},
  {id:'EditorialMotion06Rebalancing',component:EditorialMotion06Rebalancing,file:'06-rebalancing.mp4'},
  {id:'EditorialMotion07Diversification',component:EditorialMotion07Diversification,file:'07-diversification.mp4'},
  {id:'EditorialMotion08LoanPaydown',component:EditorialMotion08LoanPaydown,file:'08-loan-paydown.mp4'},
  {id:'EditorialMotion09DepositProtection',component:EditorialMotion09DepositProtection,file:'09-deposit-protection.mp4'},
  {id:'EditorialMotion10ScenarioCompare',component:EditorialMotion10ScenarioCompare,file:'10-scenario-compare.mp4'},
  {id:'EditorialMotion11Timeline',component:EditorialMotion11Timeline,file:'11-timeline.mp4'},
  {id:'EditorialMotion12CompoundGrowth',component:EditorialMotion12CompoundGrowth,file:'12-compound-growth.mp4'},
  {id:'EditorialMotion13MountainGoal',component:EditorialMotion13MountainGoal,file:'13-mountain-goal.mp4'},
  {id:'EditorialMotion14LateFee',component:EditorialMotion14LateFee,file:'14-late-fee.mp4'},
] as const;
