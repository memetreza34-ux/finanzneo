import {describe, expect, it} from 'vitest';
import {planFinanceAnimationInput} from './planFinanceAnimationInput';

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
});
