import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';
import {
  FINANCE_ANIMATION_KEYWORDS,
  getFinanceAnimationKeywords,
} from './financeAnimationKeywords';

describe('financeAnimationKeywords', () => {
  it('defines keywords for every registered template', () => {
    for (const template of FINANCE_ANIMATION_TEMPLATES) {
      expect(FINANCE_ANIMATION_KEYWORDS[template.id].length).toBeGreaterThan(0);
    }
  });

  it('does not contain duplicate keywords inside one template', () => {
    for (const template of FINANCE_ANIMATION_TEMPLATES) {
      const keywords = FINANCE_ANIMATION_KEYWORDS[template.id];
      expect(new Set(keywords).size).toBe(keywords.length);
    }
  });

  it('returns the canonical keyword list by template', () => {
    expect(getFinanceAnimationKeywords('inflation-erosion')).toEqual([
      'inflation',
      'kaufkraft',
      'preise',
    ]);
  });

  it('does not use dangerously short generic fragments', () => {
    const allKeywords = Object.values(FINANCE_ANIMATION_KEYWORDS).flat();
    expect(allKeywords).not.toContain('ter');
    expect(allKeywords.every((keyword) => keyword.length >= 4)).toBe(true);
  });
});
