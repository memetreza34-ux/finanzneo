import {describe, expect, it} from 'vitest';
import {
  haveAmbiguousTopCandidates,
  rankFinanceAnimationCandidates,
} from './rankFinanceAnimationCandidates';

describe('rankFinanceAnimationCandidates', () => {
  it('combines keyword, preferred-template and data signals', () => {
    const candidates = rankFinanceAnimationCandidates({
      message: 'Ein monatlicher Sparplan wächst über Jahre.',
      voiceText: 'Jeden Monat wird eine feste Rate eingezahlt.',
      preferredTemplate: 'monthly-investment',
      data: {
        monthlyRate: 250,
        months: 120,
      },
    });

    expect(candidates[0]?.template).toBe('monthly-investment');
    expect(candidates[0]?.preferred).toBe(true);
    expect(candidates[0]?.dataMatches).toEqual(['monthlyRate', 'months']);
    expect(candidates[0]?.keywordMatches).toEqual(
      expect.arrayContaining(['sparplan', 'monatlich', 'rate']),
    );
  });

  it('uses data coverage as a deterministic tie breaker', () => {
    const candidates = rankFinanceAnimationCandidates({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
      data: {income: 2800, expenses: 2100},
    });

    expect(candidates[0]?.template).toBe('income-expense-balance');
    expect(haveAmbiguousTopCandidates(candidates)).toBe(false);
  });

  it('detects a true unresolved tie between shared keywords', () => {
    const candidates = rankFinanceAnimationCandidates({
      message: 'Einnahmen und Ausgaben.',
      voiceText: 'Einnahmen und Ausgaben.',
    });

    expect(candidates[0]?.score).toBe(candidates[1]?.score);
    expect(haveAmbiguousTopCandidates(candidates)).toBe(true);
  });

  it('does not call a zero-score candidate ambiguous', () => {
    const candidates = rankFinanceAnimationCandidates({
      message: 'Eine Person steht in einer Wohnung.',
      voiceText: 'Die Illustration zeigt eine Alltagssituation.',
    });

    expect(candidates[0]?.score).toBe(0);
    expect(haveAmbiguousTopCandidates(candidates)).toBe(false);
  });
});
