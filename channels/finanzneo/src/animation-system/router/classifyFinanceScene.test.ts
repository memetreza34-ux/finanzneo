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

const financeRequest = {
  message: 'Zinseszins lässt dein Vermögen wachsen.',
  voiceText: 'Zinseszins lässt dein Vermögen wachsen.',
};

describe('classifyFinanceScene', () => {
  it('always falls back to image while production feature flags are disabled', () => {
    const decision = classifyFinanceScene(financeRequest);

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
    expect(decision.confidence).toBe(1);
    expect(decision.reason).toContain('noch deaktiviert');
  });

  it('does not resolve an animation mode when no mode is released', () => {
    const mode = resolveFinanceAnimationMode({
      enabled: true,
      allowHybrid: false,
      allowFullAnimation: false,
      allowAutomaticRouting: false,
    });

    expect(mode).toBe('image');
  });

  it('uses a precise image-fallback reason while automatic routing is disabled', () => {
    const decision = classifyFinanceSceneWithFeatures(financeRequest, {
      enabled: true,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: false,
    });

    expect(decision.mode).toBe('image');
    expect(decision.reason).toBe(
      'Automatische Animationsauswahl ist noch nicht freigegeben.',
    );
    expect(decision.blockedReasons).toBeUndefined();
  });

  it('blocks active modes behind a disabled master switch', () => {
    const decision = classifyFinanceSceneWithFeatures(financeRequest, {
      enabled: false,
      allowHybrid: true,
      allowFullAnimation: false,
      allowAutomaticRouting: false,
    });

    expect(decision.mode).toBe('image');
    expect(decision.reason).toContain('sichere Aktivierungsreihenfolge');
    expect(decision.blockedReasons).toContain(
      'Animationsmodi und automatisches Routing müssen deaktiviert bleiben, solange enabled false ist.',
    );
  });

  it('blocks full animation before hybrid mode', () => {
    const decision = classifyFinanceSceneWithFeatures(financeRequest, {
      enabled: true,
      allowHybrid: false,
      allowFullAnimation: true,
      allowAutomaticRouting: true,
    });

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
    expect(decision.blockedReasons).toContain(
      'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    );
  });

  it('blocks automatic routing without a released animation mode', () => {
    const decision = classifyFinanceSceneWithFeatures(financeRequest, {
      enabled: true,
      allowHybrid: false,
      allowFullAnimation: false,
      allowAutomaticRouting: true,
    });

    expect(decision.mode).toBe('image');
    expect(decision.blockedReasons).toContain(
      'Automatisches Routing benötigt mindestens einen freigegebenen Animationsmodus.',
    );
  });

  it('chooses the strongest matching finance template', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Einkommen und Ausgaben bestimmen deinen Saldo.',
      voiceText: 'Vergleiche deine Einnahmen mit allen Ausgaben.',
    }, hybridFeatures);

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('income-expense-balance');
  });

  it('uses matching data alone to resolve shared finance keywords', () => {
    const decision = classifyFinanceSceneWithFeatures({
      message: 'Einnahmen und Ausgaben werden gegenübergestellt.',
      voiceText: 'Beide Werte werden direkt verglichen.',
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

  it('uses full animation only when hybrid and full mode are released', () => {
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
