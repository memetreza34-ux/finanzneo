import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  CompoundGrowth,
  LoanPaydown,
  MoneySplit,
  ScenarioComparison,
  ValueDrain,
  ValueGrowth,
} from '../finance-motion';
import {
  FINANCE_MOTION_CORE_IDS,
  FINANCE_MOTION_CORE_LAB_FRAMES,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  type FinanceMotionCoreLabId,
} from '../finance-motion/lab-config';
import {AnimationStage} from '../brand/components/ReelStage';
import {C, FONT} from '../brand';

// Rendert die Kern-Mechaniken über den kanonischen Import, also genau so, wie
// ein Reel sie bekommt. Die Werte sind realistische Beispiel-Sprechpunkte.
const renderMotion = (id: FinanceMotionCoreLabId): React.ReactNode => {
  const durationFrames = FINANCE_MOTION_LAB_SEGMENT_FRAMES;

  switch (id) {
    case 'value-growth':
      return <ValueGrowth durationFrames={durationFrames} label="Depotwert" startValue={10000} endValue={21600} />;
    case 'value-drain':
      return <ValueDrain durationFrames={durationFrames} label="Endvermögen" startValue={100000} endValue={74000} drainLabel="Gebühren" />;
    case 'compound-growth':
      return <CompoundGrowth durationFrames={durationFrames} periods={['Start', '10 J.', '20 J.', '30 J.']} values={[10000, 16000, 26000, 42000]} />;
    case 'scenario-comparison':
      return (
        <ScenarioComparison
          durationFrames={durationFrames}
          startValue={10000}
          left={{label: '0,2 % Kosten', value: 91000, tone: 'positive'}}
          right={{label: '1,5 % Kosten', value: 69000, tone: 'warning'}}
        />
      );
    case 'loan-paydown':
      return <LoanPaydown durationFrames={durationFrames} startDebt={28000} endDebt={18500} payments={5} />;
    case 'money-split':
      return (
        <MoneySplit
          durationFrames={durationFrames}
          amount={2800}
          sourceLabel="netto"
          parts={[
            {label: 'Fixkosten', share: 55, tone: 'neutral'},
            {label: 'Leben', share: 25, tone: 'trust'},
            {label: 'Sparen', share: 20, tone: 'positive'},
          ]}
        />
      );
  }
};

export const FinanceMotionCoreLab: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {FINANCE_MOTION_CORE_IDS.map((id, index) => (
      <Sequence key={id} from={index * FINANCE_MOTION_LAB_SEGMENT_FRAMES} durationInFrames={FINANCE_MOTION_LAB_SEGMENT_FRAMES}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 72, right: 72, top: 154, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.body}}>
            <div style={{fontSize: 52, fontWeight: 800, color: C.white}}>{id}</div>
            <div style={{fontSize: 28, fontWeight: 800, color: C.gray}}>
              CORE V3 · {index + 1}/{FINANCE_MOTION_CORE_IDS.length}
            </div>
          </div>
          <AnimationStage>{renderMotion(id)}</AnimationStage>
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export {FINANCE_MOTION_CORE_LAB_FRAMES};
