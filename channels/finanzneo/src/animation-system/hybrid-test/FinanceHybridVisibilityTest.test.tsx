import React from 'react';
import {describe, expect, it} from 'vitest';
import {
  FinanceHybridAnimationLayer,
  getFinanceHybridAnimatedSceneIds,
  getFinanceHybridPresentationStyle,
  type FinanceHybridAnimationLayerProps,
} from '../../engine/FinanceHybridAnimationLayer';
import {FinanceImageFirstReel} from '../../engine/FinanceImageFirstReel';
import {FinanceProductionLayer} from '../../engine/FinanceProductionLayer';
import {parseFinanceAnimationScene} from '../ingestion';
import {
  FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
  FINANCE_HYBRID_VISIBILITY_DURATION,
  FINANCE_HYBRID_VISIBILITY_MANIFEST,
  FINANCE_HYBRID_VISIBILITY_PLAN,
  getFinanceHybridVisibilitySceneStart,
} from './FinanceHybridVisibilityTest';

describe('FinanceHybridVisibilityTest', () => {
  it('uses three different animation templates inside a reel-shaped plan', () => {
    const assignments = Object.values(
      FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
    ).filter(Boolean);
    const templates = assignments.map((assignment) => {
      const result = parseFinanceAnimationScene(assignment?.input);
      expect(result.ok).toBe(true);
      return result.ok ? result.value.template : undefined;
    });

    expect(templates).toEqual([
      'compound-growth',
      'inflation-erosion',
      'portfolio-allocation',
    ]);
    expect(new Set(templates).size).toBe(3);
  });

  it('alternates image and animation scenes instead of animating everything', () => {
    expect(FINANCE_HYBRID_VISIBILITY_PLAN.scenes.map((scene) => scene.id)).toEqual([
      'hook-image',
      'compound-animation',
      'bridge-image',
      'inflation-animation',
      'portfolio-animation',
      'payoff-image',
    ]);

    const animatedIds = getFinanceHybridAnimatedSceneIds(
      FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
    );
    expect([...animatedIds]).toEqual([
      'compound-animation',
      'inflation-animation',
      'portfolio-animation',
    ]);
  });

  it('uses caption-safe presentation for every animation scene', () => {
    for (const assignment of Object.values(FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS)) {
      expect(assignment?.presentation).toBe('caption-safe');
    }

    const style = getFinanceHybridPresentationStyle('caption-safe');
    expect(style.transform).toContain('translateY(-100px)');
    expect(style.transform).toContain('scale(0.78)');
    expect(style.overflow).toBe('hidden');
  });

  it('calculates exact local start frames for each visible animation', () => {
    expect(getFinanceHybridVisibilitySceneStart('compound-animation')).toBe(120);
    expect(getFinanceHybridVisibilitySceneStart('inflation-animation')).toBe(420);
    expect(getFinanceHybridVisibilitySceneStart('portfolio-animation')).toBe(600);
    expect(FINANCE_HYBRID_VISIBILITY_DURATION).toBe(900);
  });

  it('places the animation layer directly above the image layer', () => {
    const rendered = FinanceProductionLayer({
      plan: FINANCE_HYBRID_VISIBILITY_PLAN,
      manifest: FINANCE_HYBRID_VISIBILITY_MANIFEST,
      captions: [],
      publicBasePath: 'reels/test',
      hybridAnimations: FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
      showAnimationDebugLabels: true,
    });

    expect(React.isValidElement(rendered)).toBe(true);
    if (!React.isValidElement<{children?: React.ReactNode}>(rendered)) return;
    const children = React.Children.toArray(rendered.props.children);

    expect(React.isValidElement(children[0])).toBe(true);
    expect(React.isValidElement(children[1])).toBe(true);
    if (!React.isValidElement(children[0]) || !React.isValidElement(children[1])) return;
    expect(children[0].type).toBe(FinanceImageFirstReel);
    expect(children[1].type).toBe(FinanceHybridAnimationLayer);
  });

  it('forwards assignments and debug visibility to the animation layer', () => {
    const rendered = FinanceProductionLayer({
      plan: FINANCE_HYBRID_VISIBILITY_PLAN,
      manifest: FINANCE_HYBRID_VISIBILITY_MANIFEST,
      captions: [],
      publicBasePath: 'reels/test',
      hybridAnimations: FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
      showAnimationDebugLabels: true,
    });

    expect(React.isValidElement<{children?: React.ReactNode}>(rendered)).toBe(true);
    if (!React.isValidElement<{children?: React.ReactNode}>(rendered)) return;
    const animationLayer = React.Children.toArray(rendered.props.children).find(
      (child) => React.isValidElement(child) && child.type === FinanceHybridAnimationLayer,
    );

    expect(React.isValidElement<FinanceHybridAnimationLayerProps>(animationLayer)).toBe(true);
    if (!React.isValidElement<FinanceHybridAnimationLayerProps>(animationLayer)) return;
    expect(animationLayer.props.assignments).toBe(
      FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
    );
    expect(animationLayer.props.showDebugLabels).toBe(true);
    expect(animationLayer.props.plan).toBe(FINANCE_HYBRID_VISIBILITY_PLAN);
  });

  it('does not render old scene headers over animation-replacement scenes', () => {
    const rendered = FinanceProductionLayer({
      plan: FINANCE_HYBRID_VISIBILITY_PLAN,
      manifest: FINANCE_HYBRID_VISIBILITY_MANIFEST,
      captions: [],
      publicBasePath: 'reels/test',
      hybridAnimations: FINANCE_HYBRID_VISIBILITY_ASSIGNMENTS,
    });

    expect(React.isValidElement(rendered)).toBe(true);
    if (!React.isValidElement<{children?: React.ReactNode}>(rendered)) return;
    const children = React.Children.toArray(rendered.props.children);
    const overlaySequences = children.filter((child) =>
      React.isValidElement<{name?: string}>(child) &&
      child.props.name?.startsWith('Überschrift '),
    );

    expect(overlaySequences.map((element) =>
      React.isValidElement<{name?: string}>(element) ? element.props.name : undefined,
    )).toEqual([
      'Überschrift hook-image',
      'Überschrift bridge-image',
      'Überschrift payoff-image',
    ]);
  });
});
