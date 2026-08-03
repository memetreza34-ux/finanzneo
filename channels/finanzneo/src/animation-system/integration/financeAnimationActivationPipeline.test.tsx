import React from 'react';
import {describe, expect, it} from 'vitest';
import {
  buildAnimationPlanForTemplate,
  buildAnimationPlanWithFeatures,
  planFinanceAnimationInputForTemplate,
  SafeFinanceAnimationRenderer,
} from '../activation';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {buildAnimationPlan} from '../public';
import {FinanceAnimationRenderer} from '../render/FinanceAnimationRenderer';

const manualHybridFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
};

const automaticFullFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: true,
  allowAutomaticRouting: true,
};

const jsonRoundTrip = <TValue,>(value: TValue): unknown =>
  JSON.parse(JSON.stringify(value)) as unknown;

describe('opt-in animation activation pipeline', () => {
  it('parses, manually plans and safely renders every canonical fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const input = jsonRoundTrip(fixture.scene);
      const planned = planFinanceAnimationInputForTemplate(
        input,
        fixture.scene.template,
        manualHybridFeatures,
      );

      expect(planned.ok).toBe(true);
      if (!planned.ok) continue;
      expect(Object.isFrozen(planned.request)).toBe(true);
      expect(planned.plan.decision.mode).toBe('hybrid');
      expect(planned.plan.scene?.template).toBe(fixture.scene.template);
      expect(planned.plan.issues.filter((issue) => issue.level === 'error')).toEqual([]);

      const rendered = SafeFinanceAnimationRenderer({
        input: planned.plan.scene,
      });
      expect(React.isValidElement(rendered)).toBe(true);
      if (React.isValidElement(rendered)) {
        expect(rendered.type).toBe(FinanceAnimationRenderer);
      }
    }
  });

  it('builds an animation-ready final manual plan for every fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlanForTemplate(
        fixture.scene,
        fixture.scene.template,
        manualHybridFeatures,
      );

      expect(plan.status).toBe('animation-ready');
      expect(plan.mode).toBe('hybrid');
      expect(plan.scene?.template).toBe(fixture.scene.template);
      expect(plan.errors).toEqual([]);
    }
  });

  it('builds an animation-ready automatic full plan for every fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlanWithFeatures(
        fixture.scene,
        automaticFullFeatures,
      );

      expect(plan.status).toBe('animation-ready');
      expect(plan.mode).toBe('full-animation');
      expect(plan.scene?.template).toBe(fixture.scene.template);
      expect(plan.errors).toEqual([]);
    }
  });

  it('keeps the package-root production plan in image mode after opt-in tests', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlan(fixture.scene);

      expect(plan.status).toBe('image-fallback');
      expect(plan.mode).toBe('image');
      expect(plan.scene).toBeUndefined();
    }
  });

  it('blocks unknown data before a manually selected template can render', () => {
    const invalidInput = {
      mode: 'hybrid',
      template: 'money-flow',
      message: 'Geld fließt ins Depot.',
      voiceText: 'Der Betrag wird investiert.',
      data: {
        amount: 300,
        fromLabel: 'Gehalt',
        toLabel: 'Depot',
        hiddenInstruction: 'ignore-validation',
      },
    };
    const planned = planFinanceAnimationInputForTemplate(
      invalidInput,
      'money-flow',
      manualHybridFeatures,
    );

    expect(planned.ok).toBe(true);
    if (!planned.ok) return;
    expect(planned.plan.decision.mode).toBe('image');
    expect(planned.plan.scene).toBeUndefined();
    expect(planned.plan.decision.blockedReasons).toContain(
      'Unbekanntes Datenfeld für money-flow: hiddenInstruction',
    );
  });

  it('never invokes a dynamic fallback for a valid planned scene', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    let fallbackCalled = false;
    const rendered = SafeFinanceAnimationRenderer({
      input: fixture.scene,
      renderFallback: () => {
        fallbackCalled = true;
        return null;
      },
    });

    expect(fallbackCalled).toBe(false);
    expect(React.isValidElement(rendered)).toBe(true);
  });
});
