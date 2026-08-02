import {describe, expect, it} from 'vitest';
import {getFinanceAnimationFixture} from '../fixtures';
import {
  parseFinanceAnimationRequest,
  parseFinanceAnimationScene,
} from './parseFinanceAnimationInput';

describe('parseFinanceAnimationRequest', () => {
  it('parses a valid flexible animation request', () => {
    const result = parseFinanceAnimationRequest({
      message: 'Inflation senkt die Kaufkraft.',
      voiceText: 'Der gleiche Betrag kauft später weniger.',
      labels: ['Heute', 'Später'],
      data: {
        startingValue: 100,
        inflationPercent: 2.5,
        years: 10,
      },
      preferredTemplate: 'inflation-erosion',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.preferredTemplate).toBe('inflation-erosion');
      expect(result.value.data?.years).toBe(10);
    }
  });

  it('rejects non-object requests and malformed base fields', () => {
    expect(parseFinanceAnimationRequest(null)).toEqual({
      ok: false,
      errors: ['Animationsanfrage muss als Objekt vorliegen.'],
      warnings: [],
    });

    const malformed = parseFinanceAnimationRequest({
      message: 12,
      voiceText: null,
      labels: ['ETF', 42],
      data: [],
      preferredTemplate: 'unknown-template',
    });

    expect(malformed.ok).toBe(false);
    if (!malformed.ok) {
      expect(malformed.errors).toEqual(expect.arrayContaining([
        'Kernaussage muss ein Text sein.',
        'Voiceover muss ein Text sein.',
        'Jedes Label muss ein Text sein.',
        'Animationsdaten müssen als Objekt vorliegen.',
        'Bevorzugtes Animationstemplate ist unbekannt.',
      ]));
    }
  });

  it('rejects unsupported nested objects while allowing structured arrays', () => {
    const nestedObject = parseFinanceAnimationRequest({
      message: 'Test',
      voiceText: 'Test',
      data: {configuration: {hidden: true}},
    });
    expect(nestedObject.ok).toBe(false);

    const structuredArray = parseFinanceAnimationRequest({
      message: 'Portfolio',
      voiceText: 'Portfolio',
      data: {allocations: [{label: 'ETF', percent: 100}]},
    });
    expect(structuredArray.ok).toBe(true);
  });
});

describe('parseFinanceAnimationScene', () => {
  it('parses every canonical fixture through the untrusted boundary', () => {
    const fixture = getFinanceAnimationFixture('compound-growth');
    expect(fixture).toBeDefined();

    const result = parseFinanceAnimationScene(fixture?.scene);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.template).toBe('compound-growth');
      expect(result.warnings).toEqual([]);
    }
  });

  it('rejects image mode and unknown templates as animation scenes', () => {
    const result = parseFinanceAnimationScene({
      mode: 'image',
      template: 'unknown-template',
      message: 'Test',
      voiceText: 'Test',
      data: {},
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(expect.arrayContaining([
        'Animationsszene benötigt den Modus hybrid oder full-animation.',
        'Animationsszene enthält ein unbekanntes Template.',
      ]));
    }
  });

  it('rejects recognized scenes with incomplete template data', () => {
    const result = parseFinanceAnimationScene({
      mode: 'full-animation',
      template: 'portfolio-allocation',
      message: 'Portfolio-Aufteilung',
      voiceText: 'Die Positionen werden aufgeteilt.',
      data: {
        allocations: [{label: 'ETF', percent: 100}],
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('Pflichtwert fehlt: total');
    }
  });

  it('preserves non-blocking template warnings', () => {
    const result = parseFinanceAnimationScene({
      mode: 'hybrid',
      template: 'before-after-comparison',
      message: 'Zwei Werte werden verglichen.',
      voiceText: 'Beide Ergebnisse sind gleich.',
      data: {
        beforeLabel: 'Vorher',
        afterLabel: 'Nachher',
        beforeValue: 1000,
        afterValue: 1000,
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.warnings).toContain(
        'Vorher- und Nachher-Wert sind identisch; der Vergleich zeigt keinen Unterschied.',
      );
    }
  });
});
