import {describe, expect, it} from 'vitest';
import {
  containsFinanceKeyword,
  normalizeFinanceText,
} from './financeKeywordMatching';

describe('financeKeywordMatching', () => {
  it('normalizes German finance text consistently', () => {
    expect(normalizeFinanceText('GEBÜHR UND RENDITE')).toBe('gebühr und rendite');
  });

  it('matches a complete finance term', () => {
    const text = normalizeFinanceText('Die monatliche Rate beträgt 250 Euro.');
    expect(containsFinanceKeyword(text, 'rate')).toBe(true);
  });

  it('matches terms next to punctuation', () => {
    const text = normalizeFinanceText('Inflation: Kaufkraft sinkt.');
    expect(containsFinanceKeyword(text, 'inflation')).toBe(true);
    expect(containsFinanceKeyword(text, 'kaufkraft')).toBe(true);
  });

  it('does not match a term inside an unrelated word', () => {
    const text = normalizeFinanceText('Der Berater erklärt eine Strategie.');
    expect(containsFinanceKeyword(text, 'rate')).toBe(false);
  });

  it('escapes regular expression characters in supplied terms', () => {
    const text = normalizeFinanceText('Die Kennzahl A+B wird angezeigt.');
    expect(containsFinanceKeyword(text, 'a+b')).toBe(true);
  });
});
