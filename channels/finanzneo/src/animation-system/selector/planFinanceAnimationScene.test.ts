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

  it('verwendet bei fehlendem Template den Bildmodus', () => {
    const result = planFinanceAnimationSceneFromDecision(compoundRequest, {
      mode: 'hybrid',
      confidence: 0.7,
      reason: 'Template fehlt absichtlich.',
    });

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues.map((issue) => issue.code)).toContain('missing-template');
  });

  it('verwendet bei unvollständigen Daten den Bildmodus', () => {
    const result = planFinanceAnimationSceneFromDecision({
      ...compoundRequest,
      data: {startCapital: 1000},
    }, compoundDecision);

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues.some((issue) => issue.message.includes('monthlyRate'))).toBe(true);
  });
});
