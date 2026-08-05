import {describe, expect, it} from 'vitest';
import {
  planFinanceAnimationInput,
  planFinanceAnimationInputForTemplate,
  planFinanceAnimationInputWithFeatures,
} from './planFinanceAnimationInput';

const hybridFeatures = {
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: true,
} as const;

const manualHybridFeatures = {
  ...hybridFeatures,
  allowAutomaticRouting: false,
} as const;

describe('planFinanceAnimationInput', () => {
  it('parses a valid request before planning it', () => {
    const result = planFinanceAnimationInput({
      message: 'Zinseszins lässt Vermögen wachsen.',
      voiceText: 'Erträge erwirtschaften neue Erträge.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.request.data?.startCapital).toBe(1000);
      expect(result.plan.decision.mode).toBe('image');
      expect(result.plan.scene).toBeUndefined();
      expect(result.warnings).toEqual([]);
    }
  });

  it('preserves non-blocking parser warnings for a valid request', () => {
    const result = planFinanceAnimationInput({
      message: 'Eine allgemeine Finanzsituation wird erklärt.',
      voiceText: 'Ohne strukturierte Zahlen bleibt der Bildmodus sicherer.',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.warnings).toContain(
        'Animationsszene enthält keine strukturierten Finanzdaten.',
      );
      expect(result.plan.decision.mode).toBe('image');
    }
  });

  it('stops malformed input before router and planner execution', () => {
    const result = planFinanceAnimationInput({
      message: 123,
      voiceText: null,
      data: [],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(expect.arrayContaining([
        'Kernaussage muss ein Text sein.',
        'Voiceover muss ein Text sein.',
        'Animationsdaten müssen als einfaches Objekt vorliegen.',
      ]));
    }
  });

  it('rejects unsupported direct nested data objects', () => {
    const result = planFinanceAnimationInput({
      message: 'Test',
      voiceText: 'Test',
      data: {configuration: {secret: true}},
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain(
        'Animationsdatenfeld configuration enthält ein nicht unterstütztes Objekt.',
      );
    }
  });

  it('runs valid untrusted input through parser, router, planner and validator', () => {
    const result = planFinanceAnimationInputWithFeatures({
      message: 'Zinseszins lässt Vermögen wachsen.',
      voiceText: 'Erträge erwirtschaften neue Erträge.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    }, hybridFeatures);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.decision.mode).toBe('hybrid');
      expect(result.plan.decision.template).toBe('compound-growth');
      expect(result.plan.scene?.template).toBe('compound-growth');
      expect(result.plan.issues.filter((issue) => issue.level === 'error')).toEqual([]);
    }
  });

  it('supports a manually selected template before automatic routing is released', () => {
    const result = planFinanceAnimationInputForTemplate({
      message: 'Zinseszins lässt Vermögen wachsen.',
      voiceText: 'Erträge erwirtschaften neue Erträge.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    }, 'compound-growth', manualHybridFeatures);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.decision.mode).toBe('hybrid');
      expect(result.plan.decision.template).toBe('compound-growth');
      expect(result.plan.decision.reason).toContain('manuell ausgewählt');
      expect(result.plan.scene?.template).toBe('compound-growth');
    }
  });

  it('validates a manually selected template against the supplied data', () => {
    const result = planFinanceAnimationInputForTemplate({
      message: 'Geld fließt vom Gehalt ins Depot.',
      voiceText: 'Der Betrag wird jeden Monat investiert.',
      data: {
        amount: 300,
        fromLabel: 'Gehalt',
        toLabel: 'Depot',
      },
    }, 'compound-growth', manualHybridFeatures);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.decision.mode).toBe('image');
      expect(result.plan.scene).toBeUndefined();
      expect(result.plan.decision.blockedReasons).toEqual(expect.arrayContaining([
        'Pflichtwert fehlt: startCapital',
        'Unbekanntes Datenfeld für compound-growth: amount',
      ]));
    }
  });

  it('stops malformed input before manual template selection', () => {
    const result = planFinanceAnimationInputForTemplate({
      message: 123,
      voiceText: null,
    }, 'money-flow', manualHybridFeatures);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(expect.arrayContaining([
        'Kernaussage muss ein Text sein.',
        'Voiceover muss ein Text sein.',
      ]));
    }
  });

  it('keeps global production planning disabled after feature simulation', () => {
    const input = {
      message: 'Inflation senkt die Kaufkraft.',
      voiceText: 'Steigende Preise verringern den realen Wert des Geldes.',
      data: {
        startingValue: 100,
        inflationPercent: 2.5,
        years: 10,
      },
    };

    const simulated = planFinanceAnimationInputWithFeatures(input, hybridFeatures);
    const production = planFinanceAnimationInput(input);

    expect(simulated.ok).toBe(true);
    expect(production.ok).toBe(true);
    if (simulated.ok && production.ok) {
      expect(simulated.plan.decision.mode).toBe('hybrid');
      expect(production.plan.decision.mode).toBe('image');
    }
  });

  it('returns a safe image fallback when exact data contracts fail', () => {
    const result = planFinanceAnimationInputWithFeatures({
      message: 'Portfolio wird aufgeteilt.',
      voiceText: 'Die Positionen sollen den gesamten Portfoliowert zeigen.',
      preferredTemplate: 'portfolio-allocation',
      data: {
        total: 10000,
        allocations: [
          {label: 'ETF', value: 6000},
          {label: 'Tagesgeld', value: 3000},
        ],
      },
    }, hybridFeatures);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.decision.mode).toBe('image');
      expect(result.plan.scene).toBeUndefined();
      expect(result.plan.decision.blockedReasons).toContain(
        'Portfolio-Werte ergeben 9000.00 statt 10000.00 Gesamtwert.',
      );
    }
  });

  it('blocks invalid feature configurations before any animation scene is built', () => {
    const result = planFinanceAnimationInputWithFeatures({
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.decision.mode).toBe('image');
      expect(result.plan.scene).toBeUndefined();
      expect(result.plan.decision.blockedReasons).toContain(
        'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
      );
    }
  });
});
