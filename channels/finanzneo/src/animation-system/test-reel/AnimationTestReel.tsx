import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {getFinanceAnimationFixture} from '../fixtures';
import {SafeFinanceAnimationRenderer} from '../render';

export const FINANCE_ANIMATION_TEST_SCENE_DURATION = 180;

const fixtureScene = (template: Parameters<typeof getFinanceAnimationFixture>[0]) => {
  const fixture = getFinanceAnimationFixture(template);
  if (!fixture) throw new Error(`Test-Reel-Fixture fehlt: ${template}`);
  return fixture.scene;
};

export type FinanceAnimationTestReelScene = {
  readonly name: string;
  readonly input: unknown;
  readonly expectsFallback: boolean;
};

export const FINANCE_ANIMATION_TEST_REEL_SCENES: readonly FinanceAnimationTestReelScene[] = [
  {
    name: 'Geldfluss',
    input: fixtureScene('money-flow'),
    expectsFallback: false,
  },
  {
    name: 'Zinseszins',
    input: fixtureScene('compound-growth'),
    expectsFallback: false,
  },
  {
    name: 'Inflation',
    input: fixtureScene('inflation-erosion'),
    expectsFallback: false,
  },
  {
    name: 'Schuldenabbau',
    input: fixtureScene('debt-paydown'),
    expectsFallback: false,
  },
  {
    name: 'Steuern und Gebühren',
    input: fixtureScene('tax-fee-flow'),
    expectsFallback: false,
  },
  {
    name: 'Absichtlicher Bild-Fallback',
    input: {
      mode: 'full-animation',
      template: 'money-flow',
      message: 'Diese Szene besitzt absichtlich unvollständige Daten.',
      voiceText: 'Ohne Ziel darf keine Animation gerendert werden.',
      data: {
        amount: 300,
        fromLabel: 'Gehalt',
      },
    },
    expectsFallback: true,
  },
] as const;

export const FINANCE_ANIMATION_TEST_REEL_DURATION =
  FINANCE_ANIMATION_TEST_REEL_SCENES.length * FINANCE_ANIMATION_TEST_SCENE_DURATION;

const ImageFallbackCard: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #101713 0%, #06110A 100%)',
      color: '#F5F7F4',
      padding: 72,
      boxSizing: 'border-box',
      fontFamily: 'Inter, Arial, sans-serif',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <div style={{fontSize: 30, fontWeight: 850, color: '#F2C14E', letterSpacing: 2}}>
      SICHERER BILDMODUS
    </div>
    <div style={{fontSize: 70, fontWeight: 950, marginTop: 28, maxWidth: 900}}>
      Ungültige Animationsdaten wurden blockiert
    </div>
    <div style={{fontSize: 32, lineHeight: 1.4, color: '#AFC0B4', marginTop: 30, maxWidth: 820}}>
      In der späteren Produktion bleibt an dieser Stelle der bestehende Bild-Workflow aktiv.
    </div>
  </AbsoluteFill>
);

export const AnimationTestReel: React.FC = () => (
  <AbsoluteFill style={{background: '#06110A'}}>
    {FINANCE_ANIMATION_TEST_REEL_SCENES.map((scene, index) => (
      <Sequence
        key={scene.name}
        name={scene.name}
        from={index * FINANCE_ANIMATION_TEST_SCENE_DURATION}
        durationInFrames={FINANCE_ANIMATION_TEST_SCENE_DURATION}
      >
        <SafeFinanceAnimationRenderer
          input={scene.input}
          fallback={<ImageFallbackCard />}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);
