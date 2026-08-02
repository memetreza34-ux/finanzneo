import {describe, expect, it} from 'vitest';
import type {FinanceAnimationDecision, FinanceAnimationRequest} from '../contracts';
import {
  planFinanceAnimationScene,
  planFinanceAnimationSceneFromDecision,
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

describe('planFinanceAnimationScene', () => {
  it('bleibt im Bildmodus solange das System deaktiviert ist', () => {
    const result = planFinanceAnimationScene(compoundRequest);

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues).toEqual([]);
  });

  it('erstellt bei vollständigen Daten eine Animationsszene', () => {
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
