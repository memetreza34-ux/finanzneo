import {describe, expect, it} from 'vitest';
import type {FinanceAnimationDecision, FinanceAnimationRequest} from '../contracts';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {
  planFinanceAnimationScene,
  planFinanceAnimationSceneFromDecision,
  planFinanceAnimationSceneWithFeatures,
} from './planFinanceAnimationScene';

const compoundRequest: FinanceAnimationRequest = {
  message: 'Zinseszins lässt Vermögen wachsen.',
  voiceText: 'Durch Zinseszins entstehen auf frühere Erträge neue Erträge.',
  data: {
    startCapital: 1000,
    monthlyRate: 200,
    annualReturn: 7,
    years: 20,
  },
};

const compoundDecision: FinanceAnimationDecision = {
  mode: 'full-animation',
  template: 'compound-growth',
  confidence: 0.9,
  reason: 'Expliziter Testfall.',
};

const hybridFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: true,
};

describe('planFinanceAnimationScene', () => {
  it('bleibt im Bildmodus solange das System global deaktiviert ist', () => {
    const result = planFinanceAnimationScene(compoundRequest);

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues).toEqual([]);
  });

  it('simuliert den vollständigen Hybridpfad ohne globale Flags zu verändern', () => {
    const result = planFinanceAnimationSceneWithFeatures(
      compoundRequest,
      hybridFeatures,
    );

    expect(result.decision.mode).toBe('hybrid');
    expect(result.decision.template).toBe('compound-growth');
    expect(result.scene?.mode).toBe('hybrid');
    expect(result.scene?.template).toBe('compound-growth');
    expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);

    expect(planFinanceAnimationScene(compoundRequest).decision.mode).toBe('image');
  });

  it('simuliert Vollanimation nur bei expliziter Freigabe', () => {
    const result = planFinanceAnimationSceneWithFeatures(compoundRequest, {
      ...hybridFeatures,
      allowFullAnimation: true,
    });

    expect(result.decision.mode).toBe('full-animation');
    expect(result.scene?.mode).toBe('full-animation');
  });

  it('bleibt bei deaktiviertem automatischem Routing im Bildmodus', () => {
    const result = planFinanceAnimationSceneWithFeatures(compoundRequest, {
      ...hybridFeatures,
      allowAutomaticRouting: false,
    });

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
  });

  it('erstellt bei vollständigen Daten eine Animationsszene aus einer Entscheidung', () => {
    const result = planFinanceAnimationSceneFromDecision(compoundRequest, compoundDecision);

    expect(result.decision.mode).toBe('full-animation');
    expect(result.scene?.template).toBe('compound-growth');
    expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
  });

  it('verwendet bei fehlendem Template den Bildmodus mit verständlichem Grund', () => {
    const result = planFinanceAnimationSceneFromDecision(compoundRequest, {
      mode: 'hybrid',
      confidence: 0.7,
      reason: 'Template fehlt absichtlich.',
    });

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues.map((issue) => issue.code)).toContain('missing-template');
    expect(result.decision.blockedReasons).toContain(
      'Eine Animationsentscheidung benötigt ein Template.',
    );
    expect(result.decision.blockedReasons).not.toContain('missing-template');
  });

  it('verwendet bei unvollständigen Daten den Bildmodus mit konkreten Feldnamen', () => {
    const result = planFinanceAnimationSceneFromDecision({
      ...compoundRequest,
      data: {startCapital: 1000},
    }, compoundDecision);

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues.some((issue) => issue.message.includes('monthlyRate'))).toBe(true);
    expect(result.decision.blockedReasons?.some((reason) => reason.includes('monthlyRate'))).toBe(true);
    expect(result.decision.blockedReasons?.some((reason) => reason.startsWith('template-data-error-'))).toBe(false);
  });

  it('falls in der Feature-Simulation bei unvollständigen Daten sicher zurück', () => {
    const result = planFinanceAnimationSceneWithFeatures({
      ...compoundRequest,
      data: {startCapital: 1000},
      preferredTemplate: 'compound-growth',
    }, hybridFeatures);

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.decision.blockedReasons?.some((reason) => reason.includes('monthlyRate'))).toBe(true);
  });

  it('blocks visually inconsistent template data before rendering', () => {
    const result = planFinanceAnimationSceneFromDecision({
      message: 'Das Budget wird aufgeteilt.',
      voiceText: 'Die Anteile sollen zusammen ein vollständiges Budget ergeben.',
      data: {
        income: 2500,
        needsPercent: 50,
        wantsPercent: 20,
        savingsPercent: 10,
      },
    }, {
      mode: 'full-animation',
      template: 'budget-split',
      confidence: 0.9,
      reason: 'Expliziter Budget-Test.',
    });

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.decision.blockedReasons?.some((reason) => reason.includes('statt 100 Prozent'))).toBe(true);
  });
});
