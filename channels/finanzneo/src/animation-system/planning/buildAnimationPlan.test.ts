import {describe, expect, it} from 'vitest';
import {getFinanceAnimationFixture} from '../fixtures';
import type {FinanceAnimationPlanResult} from '../selector/planFinanceAnimationScene';
import {
  buildAnimationPlan,
  buildAnimationPlanFromResult,
  buildAnimationPlanWithFeatures,
} from './buildAnimationPlan';

const readyResult: FinanceAnimationPlanResult = {
  decision: {
    mode: 'full-animation',
    template: 'compound-growth',
    confidence: 0.9,
    reason: 'Vollständiger Testfall.',
  },
  scene: {
    mode: 'full-animation',
    template: 'compound-growth',
    message: 'Zinseszins lässt dein Vermögen wachsen.',
    voiceText: 'Deine Gewinne erwirtschaften neue Gewinne.',
    data: {
      startCapital: 1000,
      monthlyRate: 200,
      annualReturn: 7,
      years: 20,
    },
  },
  issues: [{
    level: 'warning',
    code: 'visual-review-required',
    message: 'Visuelle Prüfung steht noch aus.',
  }],
};

describe('buildAnimationPlan', () => {
  it('bleibt bei deaktiviertem System im Bild-Fallback', () => {
    const plan = buildAnimationPlan({
      message: 'Zinseszins lässt dein Vermögen wachsen.',
      voiceText: 'Deine Gewinne erwirtschaften mit der Zeit neue Gewinne.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    });

    expect(plan.status).toBe('image-fallback');
    expect(plan.mode).toBe('image');
    expect(plan.scene).toBeUndefined();
    expect(plan.errors).toEqual([]);
  });

  it('builds an animation-ready plan from a valid planned scene', () => {
    const plan = buildAnimationPlanFromResult(readyResult);

    expect(plan.status).toBe('animation-ready');
    expect(plan.mode).toBe('full-animation');
    expect(plan.template).toBe('compound-growth');
    expect(plan.warnings).toEqual(['Visuelle Prüfung steht noch aus.']);
    expect(plan.errors).toEqual([]);
  });

  it('keeps non-image decisions without scenes blocked', () => {
    const plan = buildAnimationPlanFromResult({
      decision: {
        mode: 'hybrid',
        template: 'money-flow',
        confidence: 0.7,
        reason: 'Szene konnte nicht gebaut werden.',
      },
      issues: [{
        level: 'error',
        code: 'missing-data',
        message: 'Template-Daten fehlen.',
      }],
    });

    expect(plan.status).toBe('blocked');
    expect(plan.mode).toBe('hybrid');
    expect(plan.scene).toBeUndefined();
    expect(plan.errors).toEqual(['Template-Daten fehlen.']);
  });

  it('simulates a complete hybrid plan without changing global flags', () => {
    const fixture = getFinanceAnimationFixture('compound-growth');
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const plan = buildAnimationPlanWithFeatures(fixture.scene, {
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: true,
    });

    expect(plan.status).toBe('animation-ready');
    expect(plan.mode).toBe('hybrid');
    expect(plan.template).toBe('compound-growth');
    expect(plan.scene?.mode).toBe('hybrid');
    expect(plan.errors).toEqual([]);
    expect(buildAnimationPlan(fixture.scene).mode).toBe('image');
  });

  it('simulates a complete full-animation plan when explicitly released', () => {
    const fixture = getFinanceAnimationFixture('tax-fee-flow');
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const plan = buildAnimationPlanWithFeatures(fixture.scene, {
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: true,
      allowAutomaticRouting: true,
    });

    expect(plan.status).toBe('animation-ready');
    expect(plan.mode).toBe('full-animation');
    expect(plan.template).toBe('tax-fee-flow');
    expect(plan.scene?.mode).toBe('full-animation');
    expect(plan.errors).toEqual([]);
  });

  it('returns an image fallback plan when exact data contracts are violated', () => {
    const plan = buildAnimationPlanWithFeatures({
      message: 'Portfolio-Aufteilung',
      voiceText: 'Die Positionen sollen den Gesamtwert vollständig abbilden.',
      preferredTemplate: 'portfolio-allocation',
      data: {
        total: 10000,
        allocations: [
          {label: 'ETF', value: 6000},
          {label: 'Tagesgeld', value: 3000},
        ],
      },
    }, {
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: true,
      allowAutomaticRouting: true,
    });

    expect(plan.status).toBe('image-fallback');
    expect(plan.mode).toBe('image');
    expect(plan.scene).toBeUndefined();
    expect(plan.errors).toContain(
      'Portfolio-Werte ergeben 9000.00 statt 10000.00 Gesamtwert.',
    );
    expect(plan.decision.blockedReasons).toContain(
      'Portfolio-Werte ergeben 9000.00 statt 10000.00 Gesamtwert.',
    );
    expect(plan.errors.filter((error) => error.includes('Portfolio-Werte ergeben'))).toHaveLength(1);
  });

  it('preserves invalid feature configuration reasons in the final plan', () => {
    const plan = buildAnimationPlanWithFeatures({
      message: 'Zinseszins lässt Vermögen wachsen.',
      voiceText: 'Erträge erwirtschaften neue Erträge.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    }, {
      enabled: true,
      allowHybrid: false,
      allowFullAnimation: true,
      allowAutomaticRouting: true,
    });

    expect(plan.status).toBe('image-fallback');
    expect(plan.errors).toContain(
      'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    );
  });

  it('preserves ambiguity reasons in the final plan', () => {
    const plan = buildAnimationPlanWithFeatures({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
    }, {
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: true,
    });

    expect(plan.status).toBe('image-fallback');
    expect(plan.decision.reason).toContain('Mehrdeutige Zuordnung');
    expect(plan.errors.some((error) => error.includes('Gleichstand bei Routing-Punktzahl'))).toBe(true);
  });
});
