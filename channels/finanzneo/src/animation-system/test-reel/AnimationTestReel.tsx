import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {FinanceAnimationTemplate} from '../contracts';
import {getFinanceAnimationFixture} from '../fixtures';
import {
  type FinanceAnimationFallbackContext,
  SafeFinanceAnimationRenderer,
} from '../render';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';

export const FINANCE_ANIMATION_TEST_SCENE_DURATION = 150;

const fixtureScene = (template: FinanceAnimationTemplate) => {
  const fixture = getFinanceAnimationFixture(template);
  if (!fixture) throw new Error(`Test-Reel-Fixture fehlt: ${template}`);
  return fixture.scene;
};

export type FinanceAnimationTestReelScene = {
  readonly name: string;
  readonly input: unknown;
  readonly expectsFallback: boolean;
  readonly template?: FinanceAnimationTemplate;
  readonly fallbackKind?: 'missing-data' | 'unsafe-data' | 'invalid-mode';
};

const VALID_TEST_REEL_SCENES: readonly FinanceAnimationTestReelScene[] =
  FINANCE_ANIMATION_TEMPLATES.map((definition) => ({
    name: definition.title,
    input: fixtureScene(definition.id),
    expectsFallback: false,
    template: definition.id,
  }));

const FALLBACK_TEST_REEL_SCENES: readonly FinanceAnimationTestReelScene[] = [
  {
    name: 'Fallback · Pflichtdaten fehlen',
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
    fallbackKind: 'missing-data',
  },
  {
    name: 'Fallback · Unsichere Datenstruktur',
    input: {
      mode: 'full-animation',
      template: 'portfolio-allocation',
      message: 'Eine verschachtelte Konfiguration wird absichtlich blockiert.',
      voiceText: 'Nur flache und kontrollierbare Finanzdaten dürfen gerendert werden.',
      data: {
        total: 25000,
        allocations: [
          {
            label: 'ETF',
            percent: 100,
            metadata: {source: 'untrusted'},
          },
        ],
      },
    },
    expectsFallback: true,
    fallbackKind: 'unsafe-data',
  },
  {
    name: 'Fallback · Ungültiger Modus',
    input: {
      mode: 'image',
      template: 'inflation-erosion',
      message: 'Eine Bildszene darf nicht durch den Animationsrenderer laufen.',
      voiceText: 'Der sichere Renderer weist den unpassenden Modus zurück.',
      data: {
        startingValue: 100,
        inflationPercent: 2.5,
        years: 10,
      },
    },
    expectsFallback: true,
    fallbackKind: 'invalid-mode',
  },
];

export const FINANCE_ANIMATION_TEST_REEL_SCENES: readonly FinanceAnimationTestReelScene[] = [
  ...VALID_TEST_REEL_SCENES,
  ...FALLBACK_TEST_REEL_SCENES,
];

export const FINANCE_ANIMATION_TEST_REEL_DURATION =
  FINANCE_ANIMATION_TEST_REEL_SCENES.length * FINANCE_ANIMATION_TEST_SCENE_DURATION;

export const getFinanceAnimationTestSceneStartFrame = (index: number): number =>
  Math.max(0, Math.floor(index)) * FINANCE_ANIMATION_TEST_SCENE_DURATION;

export const getFinanceAnimationTestSceneMiddleFrame = (index: number): number =>
  getFinanceAnimationTestSceneStartFrame(index) +
  Math.floor(FINANCE_ANIMATION_TEST_SCENE_DURATION / 2);

const ImageFallbackCard: React.FC<{
  sceneName: string;
  context: FinanceAnimationFallbackContext;
}> = ({sceneName, context}) => (
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
    <div style={{fontSize: 28, fontWeight: 850, color: '#F2C14E', letterSpacing: 2}}>
      SICHERER BILDMODUS
    </div>
    <div style={{fontSize: 62, fontWeight: 950, marginTop: 24, maxWidth: 920}}>
      {sceneName}
    </div>
    <div style={{fontSize: 30, lineHeight: 1.4, color: '#AFC0B4', marginTop: 24, maxWidth: 860}}>
      Ungültige Animationsdaten wurden vor dem Renderer blockiert. In der späteren Produktion bleibt hier der bestehende Bild-Workflow aktiv.
    </div>
    <div
      style={{
        marginTop: 38,
        width: '100%',
        maxWidth: 900,
        borderRadius: 28,
        padding: '26px 30px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(242,193,78,0.25)',
        textAlign: 'left',
      }}
    >
      {context.errors.slice(0, 3).map((error) => (
        <div key={error} style={{fontSize: 24, lineHeight: 1.35, marginTop: 8}}>
          • {error}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

export const AnimationTestReel: React.FC = () => (
  <AbsoluteFill style={{background: '#06110A'}}>
    {FINANCE_ANIMATION_TEST_REEL_SCENES.map((scene, index) => (
      <Sequence
        key={scene.name}
        name={scene.name}
        from={getFinanceAnimationTestSceneStartFrame(index)}
        durationInFrames={FINANCE_ANIMATION_TEST_SCENE_DURATION}
      >
        <SafeFinanceAnimationRenderer
          input={scene.input}
          renderFallback={(context) => (
            <ImageFallbackCard sceneName={scene.name} context={context} />
          )}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);
