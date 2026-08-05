import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {
  buildAnimationPlan,
  buildAnimationPlanForTemplate,
} from './buildAnimationPlan';

const manualHybridFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
};

describe('manual template final plans', () => {
  it('builds animation-ready hybrid plans for every canonical fixture', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const plan = buildAnimationPlanForTemplate(
        fixture.scene,
        fixture.scene.template,
        manualHybridFeatures,
      );

      expect(plan.status).toBe('animation-ready');
      expect(plan.mode).toBe('hybrid');
      expect(plan.template).toBe(fixture.scene.template);
      expect(plan.scene?.template).toBe(fixture.scene.template);
      expect(plan.errors).toEqual([]);
    }
  });

  it('does not alter the globally disabled production plan', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const manual = buildAnimationPlanForTemplate(
      fixture.scene,
      fixture.scene.template,
      manualHybridFeatures,
    );
    const production = buildAnimationPlan(fixture.scene);

    expect(manual.status).toBe('animation-ready');
    expect(manual.mode).toBe('hybrid');
    expect(production.status).toBe('image-fallback');
    expect(production.mode).toBe('image');
  });

  it('keeps the final plan in image fallback before any mode release', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const plan = buildAnimationPlanForTemplate(
      fixture.scene,
      fixture.scene.template,
      {
        enabled: true,
        allowHybrid: false,
        allowFullAnimation: false,
        allowAutomaticRouting: false,
      },
    );

    expect(plan.status).toBe('image-fallback');
    expect(plan.mode).toBe('image');
    expect(plan.scene).toBeUndefined();
  });

  it('preserves manual template mismatch diagnostics in the final plan', () => {
    const moneyFlow = FINANCE_ANIMATION_FIXTURES.find(
      (fixture) => fixture.scene.template === 'money-flow',
    );
    expect(moneyFlow).toBeDefined();
    if (!moneyFlow) return;

    const plan = buildAnimationPlanForTemplate(
      moneyFlow.scene,
      'compound-growth',
      manualHybridFeatures,
    );

    expect(plan.status).toBe('image-fallback');
    expect(plan.mode).toBe('image');
    expect(plan.scene).toBeUndefined();
    expect(plan.errors).toEqual(expect.arrayContaining([
      'Pflichtwert fehlt: startCapital',
      'Unbekanntes Datenfeld für compound-growth: amount',
    ]));
  });

  it('blocks unsafe feature ordering in the final manual plan', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const plan = buildAnimationPlanForTemplate(
      fixture.scene,
      fixture.scene.template,
      {
        enabled: true,
        allowHybrid: false,
        allowFullAnimation: true,
        allowAutomaticRouting: false,
      },
    );

    expect(plan.status).toBe('image-fallback');
    expect(plan.errors).toContain(
      'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    );
  });
});
