import {describe, expect, it} from 'vitest';
import {rankAnimationTemplates, selectAnimationTemplate} from './selectAnimationTemplate';

describe('selectAnimationTemplate', () => {
  it('selects compound growth for a Zinseszins explanation', () => {
    const decision = selectAnimationTemplate({
      message: 'Zinseszins lässt Rendite über Jahre wachsen.',
      voiceText: 'Deine Gewinne erzeugen neue Gewinne.',
      data: {startCapital: 1000, monthlyRate: 200, annualReturn: 7, years: 20},
    });

    expect(decision.template).toBe('compound-growth');
    expect(decision.mode).toBe('hybrid');
  });

  it('uses the preferred template as an explicit hint', () => {
    const candidates = rankAnimationTemplates({
      message: 'Zwei Möglichkeiten werden verglichen.',
      voiceText: 'Links sparen, rechts investieren.',
      preferredTemplate: 'before-after-comparison',
    });

    expect(candidates[0]?.template).toBe('before-after-comparison');
    expect(candidates[0]?.preferred).toBe(true);
  });

  it('can select a template from complete structured data', () => {
    const candidates = rankAnimationTemplates({
      message: 'Die Werte sollen strukturiert dargestellt werden.',
      voiceText: 'Zeige die vorhandenen Werte übersichtlich.',
      data: {income: 2500, needsPercent: 50, wantsPercent: 30, savingsPercent: 20},
    });

    expect(candidates[0]?.template).toBe('budget-split');
    expect(candidates[0]?.dataMatches).toEqual([
      'income',
      'needsPercent',
      'wantsPercent',
      'savingsPercent',
    ]);
  });

  it('uses structured data to resolve shared income and expense keywords', () => {
    const decision = selectAnimationTemplate({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
      data: {income: 2800, expenses: 2100},
    });

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('income-expense-balance');
  });

  it('falls back when shared keywords produce a true tie', () => {
    const decision = selectAnimationTemplate({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
    });

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
    expect(decision.reason).toContain('mehrdeutig');
    expect(decision.blockedReasons?.[0]).toContain('Gleichstand');
  });

  it('lets an explicit preferred template resolve a keyword tie', () => {
    const decision = selectAnimationTemplate({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
      preferredTemplate: 'income-expense-balance',
    });

    expect(decision.mode).toBe('hybrid');
    expect(decision.template).toBe('income-expense-balance');
  });

  it('does not match short keywords inside unrelated words', () => {
    const decision = selectAnimationTemplate({
      message: 'Ein Berater arbeitet weiter an einer Strategie.',
      voiceText: 'Die Person erklärt einen allgemeinen Ablauf.',
    });

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
  });

  it('falls back to image without a meaningful match', () => {
    const decision = selectAnimationTemplate({
      message: 'Eine Person steht nachdenklich in einer Wohnung.',
      voiceText: 'Diese Alltagssituation ist als Illustration verständlicher.',
    });

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
  });
});
