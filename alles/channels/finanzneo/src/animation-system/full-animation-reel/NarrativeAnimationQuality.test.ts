import {describe, expect, it} from 'vitest';
import {
  assertNarrativeAnimationPlan,
  evaluateNarrativeAnimationPlan,
  type NarrativeScenePlan,
} from './NarrativeAnimationQuality';
import {
  NARRATIVE_REEL_REFERENCE_PLAN,
  REJECTED_EARLY_VS_LATE_PLAN,
} from './NarrativeAnimationPlans';

describe('NarrativeAnimationQuality', () => {
  it('rejects the first full-animation reel for the exact visual problems found in manual review', () => {
    const report = evaluateNarrativeAnimationPlan(REJECTED_EARLY_VS_LATE_PLAN);

    expect(report.passed).toBe(false);
    expect(report.metrics.sceneCount).toBe(7);
    expect(report.metrics.dataVizScenes).toBe(5);
    expect(report.metrics.dashboardScenes).toBe(7);
    expect(report.metrics.staticCameraScenes).toBe(7);
    expect(report.metrics.repeatedCoreComparisonScenes).toBe(6);
    expect(report.failures.join('\n')).toContain('Zu viele reine Datenvisualisierungen');
    expect(report.failures.join('\n')).toContain('Zu viele Dashboard-Szenen');
    expect(report.failures.join('\n')).toContain('Zu viele statische Kameraszenen');
    expect(report.failures.join('\n')).toContain('Kernvergleich');
  });

  it('accepts a narrative plan with different content beats, actions, metaphors and layouts', () => {
    const report = evaluateNarrativeAnimationPlan(NARRATIVE_REEL_REFERENCE_PLAN);

    expect(report.passed).toBe(true);
    expect(report.failures).toEqual([]);
    expect(report.metrics.sceneCount).toBe(7);
    expect(report.metrics.distinctContentBeats).toBe(7);
    expect(report.metrics.distinctActions).toBe(7);
    expect(report.metrics.distinctMetaphors).toBe(7);
    expect(report.metrics.dataVizScenes).toBe(1);
    expect(report.metrics.dashboardScenes).toBe(1);
    expect(report.metrics.staticCameraScenes).toBe(0);
    expect(report.score).toBeGreaterThanOrEqual(90);
    expect(() => assertNarrativeAnimationPlan(NARRATIVE_REEL_REFERENCE_PLAN)).not.toThrow();
  });

  it('rejects a technically renamed plan when the visual grammar is still repeated', () => {
    const repeated = Array.from({length: 6}, (_, index): NarrativeScenePlan => ({
      id: `renamed-scene-${index}`,
      contentBeat: `Behauptung ${index}`,
      primarySubject: `Objekt ${index}`,
      narrativeAction: `Balken ${index} wächst`,
      visualMetaphor: `Diagramm ${index}`,
      startState: 'leer',
      endState: 'gefüllt',
      visualMode: 'data-viz',
      layoutFamily: 'dashboard-card',
      cameraMove: 'static',
      transitionOut: 'fade',
      dataViz: true,
      dashboardFraming: true,
      repeatsCoreComparison: false,
    }));

    const report = evaluateNarrativeAnimationPlan(repeated);
    expect(report.passed).toBe(false);
    expect(report.failures.join('\n')).toContain('Layoutfamilie');
    expect(report.failures.join('\n')).toContain('Datenvisualisierungen');
    expect(report.failures.join('\n')).toContain('Dashboard-Szenen');
  });

  it('rejects scenes without a visible state change', () => {
    const broken: NarrativeScenePlan[] = NARRATIVE_REEL_REFERENCE_PLAN.map((scene, index) =>
      index === 2 ? {...scene, endState: scene.startState} : scene,
    );

    const report = evaluateNarrativeAnimationPlan(broken);
    expect(report.passed).toBe(false);
    expect(report.failures.join('\n')).toContain('verändert ihren Zustand nicht sichtbar');
  });
});
