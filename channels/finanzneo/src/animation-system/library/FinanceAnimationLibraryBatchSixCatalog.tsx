import React from 'react';
import {
  FINANCE_ANIMATION_LIBRARY_CATEGORIES,
  FINANCE_ANIMATION_LIBRARY_ITEMS,
  type FinanceAnimationLibraryCategory,
  type FinanceAnimationLibraryCategoryId,
  type FinanceAnimationLibraryItem,
} from './catalog';
import {
  BnplInstallmentStackAnimation,
  CurrencyExchangeSpreadAnimation,
  DividendYieldTrapAnimation,
  LoanRefinanceBreakEvenAnimation,
  SavingsRateFreedomTimelineAnimation,
  SubscriptionCreepAnimation,
} from './FinanceAnimationLibraryBatchSix';

export type FinanceAnimationLibraryBatchSixCategoryId = FinanceAnimationLibraryCategoryId | 'consumer-contracts';

export type FinanceAnimationLibraryBatchSixItemId =
  | 'subscription-creep'
  | 'currency-exchange-spread'
  | 'loan-refinance-break-even'
  | 'dividend-yield-trap'
  | 'savings-rate-freedom-timeline'
  | 'bnpl-installment-stack';

export type FinanceAnimationLibraryBatchSixItem = {
  readonly id: FinanceAnimationLibraryBatchSixItemId;
  readonly name: string;
  readonly category: FinanceAnimationLibraryBatchSixCategoryId;
  readonly purpose: string;
  readonly keywords: readonly string[];
  readonly durationInFrames: 180;
  readonly status: 'library-ready';
  readonly batch: 6;
  readonly renderDemo: () => React.ReactNode;
};

export const FINANCE_ANIMATION_LIBRARY_BATCH_SIX_CATEGORIES = [
  ...FINANCE_ANIMATION_LIBRARY_CATEGORIES,
  {
    id: 'consumer-contracts',
    title: 'Konsum & Verträge',
    description: 'Abonnements, Ratenkäufe und langfristige Konsumverpflichtungen.',
    order: 150,
  },
] as const satisfies readonly (FinanceAnimationLibraryCategory | {
  readonly id: 'consumer-contracts';
  readonly title: string;
  readonly description: string;
  readonly order: number;
})[];

export const FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS = [
  {
    id: 'subscription-creep',
    name: 'Abo-Kosten wachsen leise',
    category: 'consumer-contracts',
    purpose: 'Mehrere kleine Monatsabos zu ihrer gesamten Jahresbelastung zusammenführen.',
    keywords: ['abo', 'abonnement', 'streaming', 'fixkosten', 'jahreskosten', 'verträge'],
    durationInFrames: 180,
    status: 'library-ready',
    batch: 6,
    renderDemo: () => (
      <SubscriptionCreepAnimation
        items={[
          {label: 'Streaming', monthlyCost: 17.99},
          {label: 'Musik', monthlyCost: 10.99},
          {label: 'Cloud', monthlyCost: 9.99},
          {label: 'Fitness', monthlyCost: 34.9},
          {label: 'Apps', monthlyCost: 18.5},
        ]}
      />
    ),
  },
  {
    id: 'currency-exchange-spread',
    name: 'Wechselkurs und Gebühren',
    category: 'costs-fees',
    purpose: 'Referenzkurs, schlechteren Anbieterkurs und zusätzliche Umtauschgebühren sichtbar trennen.',
    keywords: ['wechselkurs', 'währung', 'spread', 'auslandsgebühr', 'umtausch', 'devisen'],
    durationInFrames: 180,
    status: 'library-ready',
    batch: 6,
    renderDemo: () => (
      <CurrencyExchangeSpreadAnimation
        sourceAmount={1000}
        referenceRate={1.09}
        providerRate={1.055}
        feePercent={1.5}
        fixedFee={4.9}
      />
    ),
  },
  {
    id: 'loan-refinance-break-even',
    name: 'Umschuldungs-Schnittpunkt',
    category: 'real-estate-credit',
    purpose: 'Alte und neue Kreditrate vergleichen und den Break-even der Wechselkosten markieren.',
    keywords: ['umschuldung', 'refinanzierung', 'kredit', 'break-even', 'zinswechsel', 'monatsrate'],
    durationInFrames: 180,
    status: 'library-ready',
    batch: 6,
    renderDemo: () => (
      <LoanRefinanceBreakEvenAnimation
        balance={180000}
        currentRatePercent={5.4}
        newRatePercent={3.7}
        yearsRemaining={18}
        closingCosts={3900}
      />
    ),
  },
  {
    id: 'dividend-yield-trap',
    name: 'Dividendenrendite-Falle',
    category: 'investing',
    purpose: 'Hohe Dividendenrendite und negative Kursentwicklung zu einer Gesamtrendite verbinden.',
    keywords: ['dividende', 'dividendenrendite', 'yield trap', 'kursverlust', 'ausschüttung', 'gesamtrendite'],
    durationInFrames: 180,
    status: 'library-ready',
    batch: 6,
    renderDemo: () => (
      <DividendYieldTrapAnimation
        initialInvestment={10000}
        dividendYieldPercent={12}
        priceChangePercent={-35}
      />
    ),
  },
  {
    id: 'savings-rate-freedom-timeline',
    name: 'Sparquote gegen Zeit',
    category: 'financial-freedom',
    purpose: 'Mehrere Sparquoten und ihre modellierte Zeit bis zur finanziellen Freiheit vergleichen.',
    keywords: ['sparquote', 'finanzielle freiheit', 'fire', 'zeit', 'zielvermögen', 'sparrate'],
    durationInFrames: 180,
    status: 'library-ready',
    batch: 6,
    renderDemo: () => (
      <SavingsRateFreedomTimelineAnimation
        monthlyIncome={3200}
        savingsRates={[10, 25, 40, 55]}
        annualReturnPercent={6}
        withdrawalRatePercent={4}
      />
    ),
  },
  {
    id: 'bnpl-installment-stack',
    name: 'Ratenkauf-Stapel',
    category: 'consumer-contracts',
    purpose: 'Mehrere Buy-now-pay-later-Verträge als monatliche und gesamte Verpflichtung darstellen.',
    keywords: ['bnpl', 'ratenkauf', 'klarna', 'konsum', 'monatsrate', 'verpflichtung'],
    durationInFrames: 180,
    status: 'library-ready',
    batch: 6,
    renderDemo: () => (
      <BnplInstallmentStackAnimation
        monthlyIncome={2400}
        contracts={[
          {label: 'Smartphone', monthlyPayment: 79, remainingMonths: 18},
          {label: 'Möbel', monthlyPayment: 64, remainingMonths: 11},
          {label: 'Kleidung', monthlyPayment: 42, remainingMonths: 4},
          {label: 'Laptop', monthlyPayment: 119, remainingMonths: 15},
        ]}
      />
    ),
  },
] as const satisfies readonly FinanceAnimationLibraryBatchSixItem[];

export const FINANCE_ANIMATION_LIBRARY_COMBINED_ITEMS = [
  ...FINANCE_ANIMATION_LIBRARY_ITEMS,
  ...FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS,
] as const satisfies readonly (FinanceAnimationLibraryItem | FinanceAnimationLibraryBatchSixItem)[];

export const getFinanceAnimationLibraryBatchSixItems = (): readonly FinanceAnimationLibraryBatchSixItem[] =>
  FINANCE_ANIMATION_LIBRARY_BATCH_SIX_ITEMS;

export const getFinanceAnimationLibraryCombinedItemsByCategory = (
  category: FinanceAnimationLibraryBatchSixCategoryId,
): readonly (FinanceAnimationLibraryItem | FinanceAnimationLibraryBatchSixItem)[] =>
  FINANCE_ANIMATION_LIBRARY_COMBINED_ITEMS.filter((item) => item.category === category);

export const getFinanceAnimationLibraryBatchSixCategory = (
  id: FinanceAnimationLibraryBatchSixCategoryId,
) => FINANCE_ANIMATION_LIBRARY_BATCH_SIX_CATEGORIES.find((category) => category.id === id);
