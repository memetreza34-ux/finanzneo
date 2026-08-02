import {describe, expect, it} from 'vitest';
import type {FinanceAnimationPlanResult} from '../selector/planFinanceAnimationScene';
import {
  buildAnimationPlan,
  buildAnimationPlanFromResult,
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
});
