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
import {AnimationStage, C, FONT, REEL_STYLE, SceneHeader, SceneTransition} from '../brand';
import type {IconName, SceneHeaderTone} from '../brand';

// Showcase der Kern-Mechaniken im echten Reel-Layout: Header + Icon oben,
// Animation in der Visualzone, Quellhinweis über der Caption-Zone.
// Beispielrechnung: 10.000 € Einmalanlage, 7 % p. a. vor Kosten,
// 0,2 % bzw. 1,5 % laufende Kosten (also 6,8 % bzw. 5,5 % netto).

const SCENE_FRAMES = 150;

type ShowcaseScene = {
  title: string;
  icon: IconName;
  tone: SceneHeaderTone;
  note?: string;
  render: (durationFrames: number) => React.ReactNode;
};

const SCENES: ShowcaseScene[] = [
  {
    title: 'Erst den Kredit abbauen',
    icon: 'receipt',
    tone: 'warning',
    note: 'Beispiel: 12 Raten à 500 €, ohne Zinsen gerechnet',
    render: (d) => <LoanPaydown durationFrames={d} startDebt={12000} endDebt={6000} payments={12} paymentLabel="Raten" />,
  },
  {
    title: 'Jeder Euro bekommt einen Topf',
    icon: 'wallet',
    tone: 'money',
    render: (d) => (
      <MoneySplit
        durationFrames={d}
        amount={2800}
        sourceLabel="netto"
        parts={[
          {label: 'Fixkosten', share: 55, tone: 'neutral'},
          {label: 'Leben', share: 25, tone: 'trust'},
          {label: 'Sparen', share: 20, tone: 'positive'},
        ]}
      />
    ),
  },
  {
    title: 'Das Depot wächst mit',
    icon: 'chart-up',
    tone: 'positive',
    note: 'Beispielrechnung: 10.000 €, 7 % p. a., 10 Jahre',
    render: (d) => <ValueGrowth durationFrames={d} label="Depot nach 10 Jahren" startValue={10000} endValue={19672} />,
  },
  {
    title: 'Zinseszins beschleunigt',
    icon: 'trending',
    tone: 'positive',
    note: 'Beispielrechnung: 10.000 €, 7 % p. a.',
    render: (d) => <CompoundGrowth durationFrames={d} periods={['Start', '10 J.', '20 J.', '30 J.']} values={[10000, 19672, 38697, 76123]} />,
  },
  {
    title: 'Kosten fressen Rendite',
    icon: 'percent',
    tone: 'warning',
    note: 'Beispielrechnung: 30 Jahre, 7 % p. a., 1,5 % Kosten',
    render: (d) => <ValueDrain durationFrames={d} label="Nach Kosten" startValue={76123} endValue={49840} drainLabel="Kosten 1,5 %" />,
  },
  {
    title: 'Gleicher Start, anderes Ergebnis',
    icon: 'target',
    tone: 'default',
    note: 'Beispielrechnung: 10.000 €, 30 Jahre, 7 % p. a. vor Kosten',
    render: (d) => (
      <ScenarioComparison
        durationFrames={d}
        startValue={10000}
        left={{label: '0,2 % Kosten', value: 71968, tone: 'positive'}}
        right={{label: '1,5 % Kosten', value: 49840, tone: 'warning'}}
      />
    ),
  },
];

export const FINANCE_MOTION_SHOWCASE_FRAMES = SCENES.length * SCENE_FRAMES;

export const FinanceMotionShowcase: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {SCENES.map((scene, index) => (
      <Sequence key={scene.title} from={index * SCENE_FRAMES} durationInFrames={SCENE_FRAMES}>
        <SceneTransition durationFrames={SCENE_FRAMES}>
          <SceneHeader title={scene.title} icon={scene.icon} tone={scene.tone} />
          <AnimationStage>{scene.render(SCENE_FRAMES)}</AnimationStage>
          {scene.note ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: REEL_STYLE.sourceNote.bottom,
                textAlign: 'center',
                fontFamily: FONT.body,
                fontSize: REEL_STYLE.sourceNote.fontSize,
                fontWeight: 600,
                color: C.gray,
              }}
            >
              {scene.note}
            </div>
          ) : null}
        </SceneTransition>
      </Sequence>
    ))}
  </AbsoluteFill>
);
