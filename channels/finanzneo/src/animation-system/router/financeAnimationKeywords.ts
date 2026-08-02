import type {FinanceAnimationTemplate} from '../contracts';

/**
 * Kanonischer Begriffskatalog für Routing und Template-Auswahl.
 * Alle Begriffe werden über vollständige Wortgrenzen ausgewertet.
 */
export const FINANCE_ANIMATION_KEYWORDS: Readonly<
  Record<FinanceAnimationTemplate, readonly string[]>
> = {
  'money-flow': ['geldfluss', 'gehalt', 'einnahmen', 'ausgaben', 'fließt', 'fließen', 'verteilen'],
  'budget-split': ['budget', 'fixkosten', 'sparquote', 'aufteilen'],
  'compound-growth': ['zinseszins', 'rendite', 'wachstum', 'gewinn'],
  'portfolio-allocation': ['portfolio', 'diversifikation', 'etf', 'aufteilung'],
  'inflation-erosion': ['inflation', 'kaufkraft', 'preise'],
  'debt-paydown': ['schuld', 'schulden', 'tilgung', 'kredit', 'restschuld'],
  'monthly-investment': ['sparplan', 'monatlich', 'rate', 'einzahlen'],
  'before-after-comparison': ['vergleich', 'stattdessen', 'gegenüber', 'vorher', 'nachher'],
  'risk-return-scale': ['risiko', 'renditechance', 'schwankung'],
  'timeline-milestones': ['jahre', 'zeit', 'entwicklung', 'meilenstein'],
  'income-expense-balance': ['einkommen', 'einnahmen', 'ausgaben', 'saldo', 'überschuss', 'defizit'],
  'tax-fee-flow': ['steuer', 'steuern', 'gebühr', 'gebühren', 'fondskosten', 'kostenquote'],
};

export const getFinanceAnimationKeywords = (
  template: FinanceAnimationTemplate,
): readonly string[] => FINANCE_ANIMATION_KEYWORDS[template];
