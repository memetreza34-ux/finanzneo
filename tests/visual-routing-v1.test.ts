import assert from 'node:assert/strict';
import test from 'node:test';
import {
  VISUAL_ROUTING_ID,
  recommendVisualRoute,
  routeNeedsExactData,
  routeUsesGeneratedImage,
  routeUsesRemotion,
} from '../scripts/lib/visual-routing-v1.mjs';

test('routes exact market history to Remotion line visual', () => {
  assert.equal(VISUAL_ROUTING_ID, 'finanzneo-visual-routing-v1');
  assert.equal(recommendVisualRoute({text: 'S&P 500 über 10 Jahre'}), 'data-line-remotion');
  assert.equal(routeNeedsExactData('data-line-remotion'), true);
});

test('routes exact numeric comparison to Remotion bars', () => {
  assert.equal(
    recommendVisualRoute({text: 'TER Vergleich ETF A vs. ETF B', exactNumericComparison: true}),
    'data-bar-remotion',
  );
});

test('routes portfolio allocation to Remotion allocation visual', () => {
  assert.equal(recommendVisualRoute({text: '70/30 Portfolioaufteilung'}), 'data-allocation-remotion');
});

test('routes recurring money mechanism to image flow without forcing a person', () => {
  assert.equal(
    recommendVisualRoute({text: 'Vom Einkommen gehen Fixkosten ab, danach wandert Geld in die Rücklage'}),
    'money-flow-image',
  );
  assert.equal(routeUsesGeneratedImage('money-flow-image'), true);
});

test('human scene is chosen only when narrative value is explicit', () => {
  assert.equal(recommendVisualRoute({text: 'Eine Entscheidung im Alltag'}), 'concept-image');
  assert.equal(
    recommendVisualRoute({text: 'Eine Entscheidung im Alltag', humanNarrativeValue: true}),
    'human-context-image',
  );
});

test('data routes use Remotion and image routes do not', () => {
  assert.equal(routeUsesRemotion('timeline-remotion'), true);
  assert.equal(routeUsesRemotion('comparison-image'), false);
});
