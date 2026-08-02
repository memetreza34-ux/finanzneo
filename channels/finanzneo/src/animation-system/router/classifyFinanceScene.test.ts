import {describe, expect, it} from 'vitest';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {
  classifyFinanceScene,
  classifyFinanceSceneWithFeatures,
  resolveFinanceAnimationMode,
} from './classifyFinanceScene';

const hybridFeatures: FinanceAnimationFeatureFlags = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: true,
};

describe('classifyFinanceScene', () => {
  it('always falls back to image while feature flags are disabled', () => {
    const decision = classifyFinanceScene({
      message: 'Zinseszins lässt dein Vermögen wachsen.',
      voiceText: 'Zinseszins lässt dein Vermögen wachsen.',
    });

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
    expect(decision.confidence).toBe(1);
  });

  it('does not route when no animation mode is released', () => {
    const mode = resolveFinanceAnimationMode({
      ...hybridFeatures,
      allowHybrid: false,
    });

    expect(mode).toBe('image');
  });

  it('chooses the strongest matching finance template', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Einkommen und Ausgaben bestimmen deinen Saldo.',
      voiceText: 'Vergleiche deine Einnahmen mit allen Ausgaben.',
    }, hybridFeatures);

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('income-expense-balance');
  });

  it('uses full animation only when that mode is explicitly released', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Inflation senkt deine Kaufkraft.',
      voiceText: 'Steigende Preise verringern den realen Wert deines Geldes.',
    }, {
      ...hybridFeatures,
      allowFullAnimation: true,
    });

    expect(decision.mode).toBe('full-animation');
    expect(decision.template).toBe('inflation-erosion');
  });

  it('does not match finance keywords inside unrelated words', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Ein Berater arbeitet weiter an einer Strategie.',
      voiceText: 'Die Person erklärt einen allgemeinen Ablauf.',
    }, hybridFeatures);

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
  });
});
