import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  AllocationSplit,
  CompoundGrowth,
  Diversification,
  FinanceTimeline,
  LoanPaydown,
  MoneySplit,
  MoneyTransfer,
  ProtectionLimit,
  Rebalancing,
  ScenarioComparison,
  ValueDrain,
  ValueGrowth,
} from '../finance-motion';
import {
  FINANCE_MOTION_LAB_FRAMES,
  FINANCE_MOTION_LAB_IDS,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  type FinanceMotionLabId,
} from '../finance-motion/lab-config';
import {AnimationStage} from '../brand/components/ReelStage';
import {C, FONT} from '../brand';

const renderMotion = (id: FinanceMotionLabId): React.ReactNode => {
  const durationFrames = FINANCE_MOTION_LAB_SEGMENT_FRAMES;

  switch (id) {
    case 'money-transfer':
      return <MoneyTransfer durationFrames={durationFrames} fromLabel="Girokonto" toLabel="ETF-Depot" amount="250 €" />;
    case 'money-split':
      return (
        <MoneySplit
          durationFrames={durationFrames}
          sourceLabel="2.800 € netto"
          amount="2.800 €"
          parts={[
            {label: 'Fixkosten', share: 55, tone: 'neutral'},
            {label: 'Leben', share: 25, tone: 'trust'},
            {label: 'Sparen', share: 20, tone: 'positive'},
          ]}
        />
      );
    case 'value-growth':
      return <ValueGrowth durationFrames={durationFrames} label="Depotwert" startValue="10.000 €" endValue="21.600 €" steps={7} />;
    case 'value-drain':
      return <ValueDrain durationFrames={durationFrames} label="Endvermögen" startValue="100 %" endValue="74 %" drainLabel="Gebühren" />;
    case 'allocation-split':
      return (
        <AllocationSplit
          durationFrames={durationFrames}
          title="ETF-Aufteilung"
          parts={[
            {label: 'Aktien', value: 60, tone: 'positive'},
            {label: 'Anleihen', value: 30, tone: 'trust'},
            {label: 'Cash', value: 10, tone: 'money'},
          ]}
        />
      );
    case 'rebalancing':
      return <Rebalancing durationFrames={durationFrames} leftLabel="Aktien" rightLabel="Anleihen" from={[85, 15]} to={[70, 30]} />;
    case 'diversification':
      return (
        <Diversification
          durationFrames={durationFrames}
          sourceLabel="Welt-ETF"
          destinations={[
            {label: 'USA', tone: 'trust'},
            {label: 'Europa', tone: 'positive'},
            {label: 'Asien', tone: 'money'},
            {label: 'Industrie', tone: 'neutral'},
          ]}
        />
      );
    case 'loan-paydown':
      return <LoanPaydown durationFrames={durationFrames} label="Restschuld" startDebt="28.000 €" endDebt="18.500 €" payments={5} />;
    case 'protection-limit':
      return <ProtectionLimit durationFrames={durationFrames} entityLabel="Bank A" items={['Giro', 'Tagesgeld', 'Festgeld']} limit="100.000 €" />;
    case 'scenario-comparison':
      return (
        <ScenarioComparison
          durationFrames={durationFrames}
          left={{label: '0,2 % Kosten', value: '91.000 €', tone: 'positive'}}
          right={{label: '1,5 % Kosten', value: '69.000 €', tone: 'warning'}}
        />
      );
    case 'finance-timeline':
      return (
        <FinanceTimeline
          durationFrames={durationFrames}
          milestones={[
            {label: 'Heute', value: '10.000 €', tone: 'neutral'},
            {label: '10 Jahre', value: '16.000 €', tone: 'trust'},
            {label: '20 Jahre', value: '26.000 €', tone: 'positive'},
            {label: '30 Jahre', value: '42.000 €', tone: 'money'},
          ]}
        />
      );
    case 'compound-growth':
      return <CompoundGrowth durationFrames={durationFrames} periods={['Start', '10 J.', '20 J.', '30 J.']} values={['10k', '16k', '26k', '42k']} />;
  }
};

export const FinanceMotionLibraryLabV1: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {FINANCE_MOTION_LAB_IDS.map((id, index) => (
      <Sequence
        key={id}
        from={index * FINANCE_MOTION_LAB_SEGMENT_FRAMES}
        durationInFrames={FINANCE_MOTION_LAB_SEGMENT_FRAMES}
      >
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: 72,
              right: 72,
              top: 82,
              zIndex: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 24,
              fontFamily: FONT.body,
            }}
          >
            <div>
              <div style={{fontSize: 22, fontWeight: 800, color: C.whiteSoft, letterSpacing: 1.1}}>
                FINANCE MOTION LIBRARY V1
              </div>
              <div style={{marginTop: 8, fontSize: 42, fontWeight: 950, color: C.white}}>{id}</div>
            </div>
            <div style={{fontSize: 25, fontWeight: 900, color: C.grayLt}}>
              {String(index + 1).padStart(2, '0')} / {FINANCE_MOTION_LAB_IDS.length}
            </div>
          </div>

          <AnimationStage>{renderMotion(id)}</AnimationStage>

          <div
            style={{
              position: 'absolute',
              left: 72,
              bottom: 120,
              fontFamily: FONT.body,
              fontSize: 20,
              fontWeight: 800,
              color: C.grayLt,
              letterSpacing: 0.8,
            }}
          >
            RAW MOTION QA · keine Bildszene · keine Produktionsänderung
          </div>
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export {FINANCE_MOTION_LAB_FRAMES};
