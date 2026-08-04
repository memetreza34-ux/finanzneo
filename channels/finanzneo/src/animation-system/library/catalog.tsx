import React from 'react';
import {
  DividendSnowballAnimation,
  EmergencyFundAnimation,
  FireProgressAnimation,
  MarketCrashRecoveryAnimation,
  MortgageAmortizationAnimation,
  NetWorthStackAnimation,
} from './FinanceAnimationLibraryBatchOne';

export type FinanceAnimationLibraryCategoryId =
  | 'markets'
  | 'investing'
  | 'saving-security'
  | 'real-estate-credit'
  | 'wealth'
  | 'financial-freedom';

export type FinanceAnimationLibraryItemId =
  | 'market-crash-recovery'
  | 'dividend-snowball'
  | 'emergency-fund-progress'
  | 'mortgage-amortization'
  | 'net-worth-stack'
  | 'fire-progress';

export type FinanceAnimationLibraryCategory = {
  readonly id: FinanceAnimationLibraryCategoryId;
  readonly title: string;
  readonly description: string;
  readonly order: number;
};

export type FinanceAnimationLibraryItem = {
  readonly id: FinanceAnimationLibraryItemId;
  readonly name: string;
  readonly category: FinanceAnimationLibraryCategoryId;
  readonly purpose: string;
  readonly keywords: readonly string[];
  readonly durationInFrames: number;
  readonly status: 'library-ready';
  readonly renderDemo: () => React.ReactNode;
};

export const FINANCE_ANIMATION_LIBRARY_CATEGORIES = [
  {
    id: 'markets',
    title: 'Börse & Märkte',
    description: 'Kursbewegungen, Crashs, Erholungen und Marktphasen.',
    order: 10,
  },
  {
    id: 'investing',
    title: 'Investieren',
    description: 'Erträge, Ausschüttungen und langfristiger Vermögensaufbau.',
    order: 20,
  },
  {
    id: 'saving-security',
    title: 'Sparen & Sicherheit',
    description: 'Liquiditätsreserve, Sparziele und finanzielle Stabilität.',
    order: 30,
  },
  {
    id: 'real-estate-credit',
    title: 'Immobilien & Kredite',
    description: 'Finanzierung, Zinslast, Tilgung und Restschuld.',
    order: 40,
  },
  {
    id: 'wealth',
    title: 'Vermögen',
    description: 'Vermögenswerte, Schulden und Nettovermögen.',
    order: 50,
  },
  {
    id: 'financial-freedom',
    title: 'Finanzielle Freiheit',
    description: 'FIRE-Ziele, Entnahmeraten und langfristige Zielerreichung.',
    order: 60,
  },
] as const satisfies readonly FinanceAnimationLibraryCategory[];

export const FINANCE_ANIMATION_LIBRARY_ITEMS = [
  {
    id: 'market-crash-recovery',
    name: 'Crash und Erholung',
    category: 'markets',
    purpose: 'Einbruch, Tiefpunkt und Erholungsphase einer Geldanlage zeigen.',
    keywords: ['börsencrash', 'kurssturz', 'korrektur', 'erholung', 'marktzyklus'],
    durationInFrames: 180,
    status: 'library-ready',
    renderDemo: () => (
      <MarketCrashRecoveryAnimation
        startValue={10000}
        crashPercent={35}
        recoveryPercent={62}
        months={24}
      />
    ),
  },
  {
    id: 'dividend-snowball',
    name: 'Dividenden-Schneeball',
    category: 'investing',
    purpose: 'Ausschüttungen und Wiederanlage als wachsenden Ertragsstrom erklären.',
    keywords: ['dividende', 'ausschüttung', 'wiederanlage', 'passives einkommen'],
    durationInFrames: 180,
    status: 'library-ready',
    renderDemo: () => (
      <DividendSnowballAnimation
        portfolioValue={80000}
        annualYieldPercent={3.5}
        years={6}
      />
    ),
  },
  {
    id: 'emergency-fund-progress',
    name: 'Notgroschen-Fortschritt',
    category: 'saving-security',
    purpose: 'Rücklage in Monatsausgaben und abgesicherten Monaten darstellen.',
    keywords: ['notgroschen', 'reserve', 'rücklage', 'monatsausgaben', 'sicherheit'],
    durationInFrames: 180,
    status: 'library-ready',
    renderDemo: () => (
      <EmergencyFundAnimation
        monthlyExpenses={1800}
        targetMonths={6}
        savedAmount={7200}
      />
    ),
  },
  {
    id: 'mortgage-amortization',
    name: 'Baufinanzierung und Tilgung',
    category: 'real-estate-credit',
    purpose: 'Monatsrate, Tilgungsanteil und Restschuld eines Immobilienkredits zeigen.',
    keywords: ['baufinanzierung', 'immobilienkredit', 'tilgung', 'restschuld', 'zinsen'],
    durationInFrames: 180,
    status: 'library-ready',
    renderDemo: () => (
      <MortgageAmortizationAnimation
        principal={350000}
        annualInterestPercent={3.5}
        years={30}
        elapsedYears={10}
      />
    ),
  },
  {
    id: 'net-worth-stack',
    name: 'Nettovermögens-Stapel',
    category: 'wealth',
    purpose: 'Vermögenswerte und Schulden zu einem Nettovermögen zusammenführen.',
    keywords: ['nettovermögen', 'vermögenswerte', 'schulden', 'bilanz', 'assets'],
    durationInFrames: 180,
    status: 'library-ready',
    renderDemo: () => (
      <NetWorthStackAnimation
        cash={18000}
        investments={92000}
        property={280000}
        debts={210000}
      />
    ),
  },
  {
    id: 'fire-progress',
    name: 'FIRE-Fortschritt',
    category: 'financial-freedom',
    purpose: 'Finanzielle Freiheit aus Jahresausgaben und Entnahmerate berechnen.',
    keywords: ['fire', 'finanzielle freiheit', 'entnahmerate', '4-prozent-regel', 'zielvermögen'],
    durationInFrames: 180,
    status: 'library-ready',
    renderDemo: () => (
      <FireProgressAnimation
        annualExpenses={30000}
        currentPortfolio={320000}
        withdrawalRatePercent={4}
      />
    ),
  },
] as const satisfies readonly FinanceAnimationLibraryItem[];

const CATEGORY_BY_ID = new Map(
  FINANCE_ANIMATION_LIBRARY_CATEGORIES.map((category) => [category.id, category]),
);

export const getFinanceAnimationLibraryCategory = (
  id: FinanceAnimationLibraryCategoryId,
): FinanceAnimationLibraryCategory | undefined => CATEGORY_BY_ID.get(id);

export const getFinanceAnimationLibraryItemsByCategory = (
  category: FinanceAnimationLibraryCategoryId,
): readonly FinanceAnimationLibraryItem[] =>
  FINANCE_ANIMATION_LIBRARY_ITEMS.filter((item) => item.category === category);
