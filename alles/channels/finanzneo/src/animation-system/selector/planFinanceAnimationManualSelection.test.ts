import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {planFinanceAnimationSceneForTemplate} from './planFinanceAnimationScene';

const manualHybridFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
};

const manualFullFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: true,
  allowAutomaticRouting: false,
};

describe('manual animation template activation', () => {
  it('builds a manually selected hybrid scene without automatic routing', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES.find(
      (candidate) => candidate.scene.template === 'compound-growth',
    );
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const result = planFinanceAnimationSceneForTemplate(
      fixture.scene,
      'compound-growth',
      manualHybridFeatures,
    );

    expect(result.decision.mode).toBe('hybrid');
    expect(result.decision.template).toBe('compound-growth');
    expect(result.decision.reason).toContain('manuell ausgewählt');
    expect(result.scene?.mode).toBe('hybrid');
    expect(result.scene?.template).toBe('compound-growth');
    expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
  });

  it('builds every canonical fixture through the manual hybrid stage', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = planFinanceAnimationSceneForTemplate(
        fixture.scene,
        fixture.scene.template,
        manualHybridFeatures,
      );

      expect(result.decision.mode).toBe('hybrid');
      expect(result.scene?.mode).toBe('hybrid');
      expect(result.scene?.template).toBe(fixture.scene.template);
      expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
    }
  });

  it('uses full animation only after hybrid and full mode are released', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES.find(
      (candidate) => candidate.scene.template === 'inflation-erosion',
    );
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const result = planFinanceAnimationSceneForTemplate(
      fixture.scene,
      fixture.scene.template,
      manualFullFeatures,
    );

    expect(result.decision.mode).toBe('full-animation');
    expect(result.scene?.mode).toBe('full-animation');
  });

  it('keeps manual selection in image mode while the system is disabled', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const result = planFinanceAnimationSceneForTemplate(
      fixture.scene,
      fixture.scene.template,
      {
        enabled: false,
        allowHybrid: false,
        allowFullAnimation: false,
        allowAutomaticRouting: false,
      },
    );

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.decision.reason).toContain('noch deaktiviert');
  });

  it('keeps manual selection in image mode when no animation mode is released', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const result = planFinanceAnimationSceneForTemplate(
      fixture.scene,
      fixture.scene.template,
      {
        enabled: true,
        allowHybrid: false,
        allowFullAnimation: false,
        allowAutomaticRouting: false,
      },
    );

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.decision.reason).toContain('noch kein Animationsmodus');
  });

  it('blocks invalid staged feature combinations', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES[0];
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const result = planFinanceAnimationSceneForTemplate(
      fixture.scene,
      fixture.scene.template,
      {
        enabled: true,
        allowHybrid: false,
        allowFullAnimation: true,
        allowAutomaticRouting: false,
      },
    );

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.decision.blockedReasons).toContain(
      'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    );
  });

  it('falls back when the manually selected template does not match the data', () => {
    const fixture = FINANCE_ANIMATION_FIXTURES.find(
      (candidate) => candidate.scene.template === 'money-flow',
    );
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const result = planFinanceAnimationSceneForTemplate(
      fixture.scene,
      'compound-growth',
      manualHybridFeatures,
    );

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.decision.blockedReasons).toEqual(expect.arrayContaining([
      'Pflichtwert fehlt: startCapital',
      'Unbekanntes Datenfeld für compound-growth: amount',
    ]));
  });
});
