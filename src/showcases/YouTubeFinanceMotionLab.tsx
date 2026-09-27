import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  MotionBeforeAfter,
  MotionBudgetAllocation,
  MotionComparisonBars,
  MotionCompoundGrowth,
  MotionLoanPaydown,
  MotionMoneyFlow,
  MotionNumber,
  MotionPurchasingPower,
  MotionTimeline,
} from '../design-system';
import {C} from '../brand/tokens';

const SCENE = 120;
export const YOUTUBE_FINANCE_MOTION_LAB_FRAMES = SCENE * 9;

const Frame: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <AbsoluteFill style={{backgroundColor: '#000', padding: '72px 96px', color: C.whiteSoft}}>
    <div style={{fontSize: 34, fontWeight: 800, color: C.graySoft, letterSpacing: 1.2, marginBottom: 58}}>{title}</div>
    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </AbsoluteFill>
);

export const YouTubeFinanceMotionLab: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Sequence from={0} durationInFrames={SCENE}>
      <Frame title="01 · ZAHL">
        <MotionNumber from={0} to={12500} suffix=" €" tone="money" startFrame={8} durationFrames={48} />
      </Frame>
    </Sequence>

    <Sequence from={SCENE} durationInFrames={SCENE}>
      <Frame title="02 · VERGLEICH">
        <div style={{width: 1420}}>
          <MotionComparisonBars
            startFrame={8}
            maxValue={3200}
            items={[
              {label: 'Gehalt', value: 3200, displayValue: '3.200 €', tone: 'positive'},
              {label: 'Kosten', value: 2740, displayValue: '2.740 €', tone: 'negative'},
            ]}
          />
        </div>
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 2} durationInFrames={SCENE}>
      <Frame title="03 · GELDFLUSS / PATHS">
        <MotionMoneyFlow fromLabel="Gehalt" toLabel="Fixkosten" amountLabel="1.850 €" startFrame={8} />
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 3} durationInFrames={SCENE}>
      <Frame title="04 · BUDGETAUFTEILUNG / SHAPES">
        <MotionBudgetAllocation
          startFrame={8}
          items={[
            {label: 'Wohnen', amount: 1200, tone: 'negative'},
            {label: 'Leben', amount: 850, tone: 'money'},
            {label: 'Sparen', amount: 650, tone: 'positive'},
            {label: 'Frei', amount: 500, tone: 'trust'},
          ]}
        />
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 4} durationInFrames={SCENE}>
      <Frame title="05 · ZINSESZINS">
        <MotionCompoundGrowth contributionPerPeriod={100} annualReturnRate={0.07} years={30} startFrame={6} />
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 5} durationInFrames={SCENE}>
      <Frame title="06 · KREDIT / TILGUNG">
        <MotionLoanPaydown principal={15000} annualInterestRate={0.065} termMonths={48} startFrame={6} />
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 6} durationInFrames={SCENE}>
      <Frame title="07 · INFLATION / KAUFKRAFT">
        <MotionPurchasingPower amount={100} annualInflationRate={0.025} years={10} startFrame={8} />
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 7} durationInFrames={SCENE}>
      <Frame title="08 · TIMELINE">
        <MotionTimeline
          startFrame={8}
          steps={[
            {label: 'Monat 1', detail: 'Start'},
            {label: 'Monat 6', detail: 'Reserve wächst', tone: 'money'},
            {label: 'Jahr 1', detail: 'Puffer', tone: 'trust'},
            {label: 'Jahr 2', detail: 'Ziel erreicht', tone: 'positive'},
          ]}
        />
      </Frame>
    </Sequence>

    <Sequence from={SCENE * 8} durationInFrames={SCENE}>
      <Frame title="09 · VORHER / NACHHER">
        <div style={{width: 1420}}>
          <MotionBeforeAfter beforeLabel="Vorher" beforeValue="120 €" afterLabel="Nachher" afterValue="82 €" beforeTone="money" afterTone="negative" startFrame={8} />
        </div>
      </Frame>
    </Sequence>
  </AbsoluteFill>
);
