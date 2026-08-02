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

  it('uses matching data to resolve shared finance keywords', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Einnahmen und Ausgaben werden gegenübergestellt.',
      voiceText: 'So erkennst du den monatlichen Überschuss.',
      data: {
        income: 2800,
        expenses: 2100,
      },
    }, hybridFeatures);

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('income-expense-balance');
    expect(decision.reason).toContain('income');
    expect(decision.reason).toContain('expenses');
  });

  it('falls back safely when shared keywords remain tied', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
    }, hybridFeatures);

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
    expect(decision.reason).toContain('Mehrdeutige Zuordnung');
    expect(decision.blockedReasons?.[0]).toContain('Gleichstand');
  });

  it('recognizes an explicit money-flow verb', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Vom Gehalt fließen jeden Monat 300 Euro in den ETF.',
      voiceText: 'Das Geld fließt direkt vom Konto ins Depot.',
      data: {
        amount: 300,
        fromLabel: 'Gehalt',
        toLabel: 'ETF',
      },
    }, hybridFeatures);

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('money-flow');
  });

  it('uses an explicit preferred template to resolve ambiguity', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
      preferredTemplate: 'income-expense-balance',
    }, hybridFeatures);

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('income-expense-balance');
    expect(decision.reason).toContain('explizit bevorzugtes Template');
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
