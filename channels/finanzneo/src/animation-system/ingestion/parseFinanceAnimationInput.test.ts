import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import {
  FINANCE_ANIMATION_INPUT_LIMITS,
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
      errors: ['Animationsanfrage muss als einfaches Objekt vorliegen.'],
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
        'Animationsdaten müssen als einfaches Objekt vorliegen.',
        'Bevorzugtes Animationstemplate ist unbekannt.',
      ]));
    }
  });

  it('rejects unsupported nested objects while allowing flat structured arrays', () => {
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

  it('rejects nested arrays, nested objects and executable values inside arrays', () => {
    for (const allocations of [
      [[{label: 'ETF', percent: 100}]],
      [{label: 'ETF', metadata: {hidden: true}}],
      [{label: 'ETF', formatter: () => '100 %'}],
    ]) {
      const result = parseFinanceAnimationRequest({
        message: 'Portfolio',
        voiceText: 'Portfolio',
        data: {allocations},
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors).toContain(
          'Animationsdatenfeld allocations enthält verschachtelte oder nicht unterstützte Listenwerte.',
        );
      }
    }
  });

  it('enforces bounded text, label, field and structured-array input sizes', () => {
    const oversized = parseFinanceAnimationRequest({
      message: 'M'.repeat(FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength + 1),
      voiceText: 'V'.repeat(FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength + 1),
      labels: Array.from(
        {length: FINANCE_ANIMATION_INPUT_LIMITS.maxLabels + 1},
        (_, index) => index === 0
          ? 'L'.repeat(FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength + 1)
          : `Label ${index}`,
      ),
      data: {
        ...Object.fromEntries(
          Array.from(
            {length: FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields + 1},
            (_, index) => [`field${index}`, index],
          ),
        ),
        milestones: Array.from(
          {length: FINANCE_ANIMATION_INPUT_LIMITS.maxStructuredArrayItems + 1},
          (_, index) => ({label: `Jahr ${index}`, value: index}),
        ),
      },
    });

    expect(oversized.ok).toBe(false);
    if (!oversized.ok) {
      expect(oversized.errors).toEqual(expect.arrayContaining([
        `Kernaussage überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength} Zeichen.`,
        `Voiceover überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength} Zeichen.`,
        `Labels enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabels} Einträge.`,
        `Ein Label überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength} Zeichen.`,
        `Animationsdaten enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields} Felder.`,
        `Animationsdatenfeld milestones enthält mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxStructuredArrayItems} Listeneinträge.`,
      ]));
    }
  });
});

describe('parseFinanceAnimationScene', () => {
  it('parses every canonical fixture through the untrusted boundary', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = parseFinanceAnimationScene(fixture.scene);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.template).toBe(fixture.scene.template);
        expect(result.warnings).toEqual([]);
      }
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
