import React from 'react';
import type {FinanceHybridAnimationAssignments} from '../../engine/FinanceHybridAnimationLayer';
import {FinanceProductionLayer} from '../../engine/FinanceProductionLayer';
import type {
  FinanceAssetManifest,
  FinanceScene,
  FinanceScenePlan,
} from '../../engine/contracts';
import {getFinanceAnimationFixture} from '../fixtures';

const scene = (
  id: string,
  durationSec: number,
  voiceText: string,
  kicker: string,
  headline: string,
  layout: FinanceScene['layout'] = 'text-punch',
): FinanceScene => ({
  id,
  durationSec,
  voiceText,
  layout,
  variant: 'payoff',
  purpose: 'Sichtbarkeit und Ebenenreihenfolge im echten Reel-Aufbau prüfen.',
  visualAction: 'Bild- und Animationsszenen wechseln sich klar sichtbar ab.',
  visualPhases: [
    {at: 0, action: 'Hauptmotiv sofort sichtbar'},
    {at: 0.5, action: 'Erklärzustand vollständig zeigen'},
  ],
  semanticChanges: ['Hauptmotiv', 'Erklärzustand'],
  assetIds: [],
  content: {
    icon: 'chart',
    kicker,
    headline,
  },
  transition: 'cut',
  decorativeOnly: false,
});

export const FINANCE_HYBRID_VISIBILITY_PLAN: FinanceScenePlan = {
  version: 'finance-v1',
  slug: 'finanzneo-hybrid-visibility-test',
  title: 'FinanzNeo Hybrid-Sichtbarkeitstest',
  fps: 30,
  centralQuestion: 'Sind die neuen Finanzanimationen im echten Reel-Aufbau klar sichtbar?',
  payoff: 'Animationen liegen über dem Bild und unter Captions, ohne von alten Überschriften verdeckt zu werden.',
  sources: [],
  scriptText: [
    'Ein gutes Finanz-Reel braucht nicht in jeder Szene dieselbe Bewegung.',
    'Beim Zinseszins muss die Entwicklung über die Zeit sichtbar werden.',
    'Zwischen den Animationen bleiben normale Bildszenen erhalten.',
    'Inflation zeigt, wie Kaufkraft Schritt für Schritt sinkt.',
    'Ein Portfolio wird verständlich in mehrere Anteile aufgeteilt.',
    'So bleibt das Reel abwechslungsreich und trotzdem im selben Stil.',
  ].join(' '),
  voiceoverInstruction: 'Technischer Sichtbarkeitstest ohne finale Audiodatei.',
  voiceoverAssetId: 'audio-not-present-in-visibility-test',
  captionsAssetId: 'captions-not-present-in-visibility-test',
  scenes: [
    scene(
      'hook-image',
      4,
      'Ein gutes Finanz-Reel braucht nicht in jeder Szene dieselbe Bewegung.',
      'HYBRID-TEST',
      'Bild und Animation wechseln sich ab',
    ),
    scene(
      'compound-animation',
      6,
      'Beim Zinseszins muss die Entwicklung über die Zeit sichtbar werden.',
      'ANIMATION 1',
      'Zinseszins sichtbar erklärt',
      'chart',
    ),
    scene(
      'bridge-image',
      4,
      'Zwischen den Animationen bleiben normale Bildszenen erhalten.',
      'BILDSZENE',
      'Nicht jede Aussage braucht eine Animation',
    ),
    scene(
      'inflation-animation',
      6,
      'Inflation zeigt, wie Kaufkraft Schritt für Schritt sinkt.',
      'ANIMATION 2',
      'Kaufkraftverlust über Zeit',
      'chart',
    ),
    scene(
      'portfolio-animation',
      6,
      'Ein Portfolio wird verständlich in mehrere Anteile aufgeteilt.',
      'ANIMATION 3',
      'Portfolio klar aufgeteilt',
      'chart',
    ),
    scene(
      'payoff-image',
      4,
      'So bleibt das Reel abwechslungsreich und trotzdem im selben Stil.',
      'ERGEBNIS',
      'Abwechslungsreich, sichtbar und einheitlich',
    ),
  ],
};

export const FINANCE_HYBRID_VISIBILITY_MANIFEST: FinanceAssetManifest = {
  version: 'finance-v1',
  slug: FINANCE_HYBRID_VISIBILITY_PLAN.slug,
  root: '.',
  generatedAt: new Date(0).toISOString(),
  assets: [],
};

const requiredFixture = (template: Parameters<typeof getFinanceAnimationFixture>[0]) => {
  const fixture = getFinanceAnimationFixture(template);
  if (!fixture) throw new Error(`Hybrid-Sichtbarkeitstest benötigt Fixture ${template}.`);
  return fixture.scene;
};

export const FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS: FinanceHybridAnimationAssignments = {
  'compound-animation': {
    input: requiredFixture('compound-growth'),
    presentation: 'caption-safe',
    debugLabel: 'SICHTBAR · ZINSESZINS',
  },
  'inflation-animation': {
    input: requiredFixture('inflation-erosion'),
    presentation: 'caption-safe',
    debugLabel: 'SICHTBAR · INFLATION',
  },
  'portfolio-animation': {
    input: requiredFixture('portfolio-allocation'),
    presentation: 'caption-safe',
    debugLabel: 'SICHTBAR · PORTFOLIO',
  },
};

export const FINANCE_HYBRID_VISIBILITY_DURATION =
  FINANCE_HYBRID_VISIBILITY_PLAN.scenes.reduce(
    (total, current) => total + Math.round(
      current.durationSec * FINANCE_HYBRID_VISIBILITY_PLAN.fps,
    ),
    0,
  );

export const getFinanceHybridVisibilitySceneStart = (sceneId: string): number => {
  let cursor = 0;
  for (const current of FINANCE_HYBRID_VISIBILITY_PLAN.scenes) {
    if (current.id === sceneId) return cursor;
    cursor += Math.round(
      current.durationSec * FINANCE_HYBRID_VISIBILITY_PLAN.fps,
    );
  }
  throw new Error(`Unbekannte Hybrid-Testszene: ${sceneId}`);
};

export const FinanceHybridVisibilityTest: React.FC = () => (
  <FinanceProductionLayer
    plan={FINANCE_HYBRID_VISIBILITY_PLAN}
    manifest={FINANCE_HYBRID_VISIBILITY_MANIFEST}
    captions={[]}
    publicBasePath="reels/finanzneo-hybrid-visibility-test"
    hybridAnimations={FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS}
    showAnimationDebugLabels
  />
);
