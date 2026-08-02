const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeFinanceText = (value: string): string =>
  value.toLocaleLowerCase('de-DE');

/**
 * Matches complete finance terms instead of arbitrary substrings.
 * This prevents false positives such as "rate" inside "Berater".
 */
export const containsFinanceKeyword = (
  normalizedText: string,
  keyword: string,
): boolean => {
  const escapedKeyword = escapeRegExp(normalizeFinanceText(keyword));
  const boundaryPattern = `(^|[^\\p{L}\\p{N}])${escapedKeyword}([^\\p{L}\\p{N}]|$)`;
  return new RegExp(boundaryPattern, 'u').test(normalizedText);
};
