const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeFinanceText = (value: string): string =>
  value.toLocaleLowerCase('de-DE');

const keywordInflectionPattern = (normalizedKeyword: string): string =>
  normalizedKeyword.endsWith('lich')
    ? '(?:e|en|er|es|em)?'
    : '';

/**
 * Matches complete finance terms instead of arbitrary substrings.
 * This prevents false positives such as "rate" inside "Berater".
 * German adjectives ending in "-lich" may use their common grammatical
 * endings, so the canonical keyword "monatlich" also matches "monatlicher".
 */
export const containsFinanceKeyword = (
  normalizedText: string,
  keyword: string,
): boolean => {
  const normalizedKeyword = normalizeFinanceText(keyword);
  const escapedKeyword = escapeRegExp(normalizedKeyword);
  const inflection = keywordInflectionPattern(normalizedKeyword);
  const boundaryPattern = `(^|[^\\p{L}\\p{N}])${escapedKeyword}${inflection}([^\\p{L}\\p{N}]|$)`;
  return new RegExp(boundaryPattern, 'u').test(normalizedText);
};
