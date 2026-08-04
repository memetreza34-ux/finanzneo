import React from 'react';
import {
  DividendSnowballAnimation,
  EmergencyFundAnimation,
  FireProgressAnimation,
  MarketCrashRecoveryAnimation,
  MortgageAmortizationAnimation,
  NetWorthStackAnimation,
} from './FinanceAnimationLibraryBatchOne';
import {
  DebtSnowballAnimation,
  EtfFeeDragAnimation,
  RetirementGapAnimation,
  SalaryVsInflationAnimation,
  SavingsGoalCountdownAnimation,
  StockVsEtfRaceAnimation,
} from './FinanceAnimationLibraryBatchTwo';

export type FinanceAnimationLibraryCategoryId =
  | 'markets'
  | 'investing'
  | 'saving-security'
  | 'real-estate-credit'
  | 'wealth'
  | 'financial-freedom'
  | 'income-purchasing-power'
  | 'retirement'
  | 'costs-fees';

export type FinanceAnimationLibraryItemId =
  | 'market-crash-recovery'
  | 'dividend-snowball'
  | 'emergency-fund-progress'
  | 'mortgage-amortization'
  | 'net-worth-stack'
  | 'fire-progress'
  | 'stock-vs-etf-race'
  | 'salary-vs-inflation'
  | 'debt-snowball'
  | 'savings-goal-countdown'
  | 'retirement-gap'
  | 'etf-fee-drag';

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
  readonly batch: 1 | 2;
  readonly renderDemo: () => React.ReactNode;
};

export const FINANCE_ANIMATION_LIBRARY_CATEGORIES = [
  {id: 'markets', title: 'Börse & Märkte', description: 'Kursbewegungen, Crashs, Erholungen und Marktphasen.', order: 10},
  {id: 'investing', title: 'Investieren', description: 'Erträge, Ausschüttungen und langfristiger Vermögensaufbau.', order: 20},
  {id: 'saving-security', title: 'Sparen & Sicherheit', description: 'Liquiditätsreserve, Sparziele und finanzielle Stabilität.', order: 30},
  {id: 'real-estate-credit', title: 'Immobilien & Kredite', description: 'Finanzierung, Zinslast, Tilgung und Restschuld.', order: 40},
  {id: 'wealth', title: 'Vermögen', description: 'Vermögenswerte, Schulden und Nettovermögen.', order: 50},
  {id: 'financial-freedom', title: 'Finanzielle Freiheit', description: 'FIRE-Ziele, Entnahmeraten und langfristige Zielerreichung.', order: 60},
  {id: 'income-purchasing-power', title: 'Einkommen & Kaufkraft', description: 'Gehalt, Inflation und reale Kaufkraft vergleichen.', order: 70},
  {id: 'retirement', title: 'Altersvorsorge', description: 'Rentenlücke, Ruhestandseinkommen und Vorsorgebedarf.', order: 80},
  {id: 'costs-fees', title: 'Kosten & Gebühren', description: 'Laufende Gebühren und ihre langfristige Vermögenswirkung.', order: 90},
] as const satisfies readonly FinanceAnimationLibraryCategory[];

export const FINANCE_ANIMATION_LIBRARY_ITEMS = [
  {id: 'market-crash-recovery', name: 'Crash und Erholung', category: 'markets', purpose: 'Einbruch, Tiefpunkt und Erholungsphase einer Geldanlage zeigen.', keywords: ['börsencrash', 'kurssturz', 'korrektur', 'erholung', 'marktzyklus'], durationInFrames: 180, status: 'library-ready', batch: 1, renderDemo: () => <MarketCrashRecoveryAnimation startValue={10000} crashPercent={35} recoveryPercent={62} months={24} />},
  {id: 'dividend-snowball', name: 'Dividenden-Schneeball', category: 'investing', purpose: 'Ausschüttungen und Wiederanlage als wachsenden Ertragsstrom erklären.', keywords: ['dividende', 'ausschüttung', 'wiederanlage', 'passives einkommen'], durationInFrames: 180, status: 'library-ready', batch: 1, renderDemo: () => <DividendSnowballAnimation portfolioValue={80000} annualYieldPercent={3.5} years={6} />},
  {id: 'emergency-fund-progress', name: 'Notgroschen-Fortschritt', category: 'saving-security', purpose: 'Rücklage in Monatsausgaben und abgesicherten Monaten darstellen.', keywords: ['notgroschen', 'reserve', 'rücklage', 'monatsausgaben', 'sicherheit'], durationInFrames: 180, status: 'library-ready', batch: 1, renderDemo: () => <EmergencyFundAnimation monthlyExpenses={1800} targetMonths={6} savedAmount={7200} />},
  {id: 'mortgage-amortization', name: 'Baufinanzierung und Tilgung', category: 'real-estate-credit', purpose: 'Monatsrate, Tilgungsanteil und Restschuld eines Immobilienkredits zeigen.', keywords: ['baufinanzierung', 'immobilienkredit', 'tilgung', 'restschuld', 'zinsen'], durationInFrames: 180, status: 'library-ready', batch: 1, renderDemo: () => <MortgageAmortizationAnimation principal={350000} annualInterestPercent={3.5} years={30} elapsedYears={10} />},
  {id: 'net-worth-stack', name: 'Nettovermögens-Stapel', category: 'wealth', purpose: 'Vermögenswerte und Schulden zu einem Nettovermögen zusammenführen.', keywords: ['nettovermögen', 'vermögenswerte', 'schulden', 'bilanz', 'assets'], durationInFrames: 180, status: 'library-ready', batch: 1, renderDemo: () => <NetWorthStackAnimation cash={18000} investments={92000} property={280000} debts={210000} />},
  {id: 'fire-progress', name: 'FIRE-Fortschritt', category: 'financial-freedom', purpose: 'Finanzielle Freiheit aus Jahresausgaben und Entnahmerate berechnen.', keywords: ['fire', 'finanzielle freiheit', 'entnahmerate', '4-prozent-regel', 'zielvermögen'], durationInFrames: 180, status: 'library-ready', batch: 1, renderDemo: () => <FireProgressAnimation annualExpenses={30000} currentPortfolio={320000} withdrawalRatePercent={4} />},
  {id: 'stock-vs-etf-race', name: 'Einzelaktie gegen ETF', category: 'markets', purpose: 'Schwankung und Endwert einer Einzelaktie mit einem breiten ETF vergleichen.', keywords: ['einzelaktie', 'etf', 'vergleich', 'volatilität', 'diversifikation'], durationInFrames: 180, status: 'library-ready', batch: 2, renderDemo: () => <StockVsEtfRaceAnimation stockStart={10000} stockEnd={14600} etfStart={10000} etfEnd={12800} months={24} />},
  {id: 'salary-vs-inflation', name: 'Gehalt gegen Inflation', category: 'income-purchasing-power', purpose: 'Nominales Gehaltswachstum und reale Kaufkraft gegenüberstellen.', keywords: ['gehalt', 'inflation', 'kaufkraft', 'lohnsteigerung', 'reallohn'], durationInFrames: 180, status: 'library-ready', batch: 2, renderDemo: () => <SalaryVsInflationAnimation startingSalary={3000} annualSalaryGrowthPercent={2} annualInflationPercent={3} years={10} />},
  {id: 'debt-snowball', name: 'Schulden-Schneeball', category: 'real-estate-credit', purpose: 'Mehrere Schulden nach kleiner Restschuld geordnet nacheinander abbauen.', keywords: ['schulden', 'schneeball', 'kredit', 'tilgung', 'rate'], durationInFrames: 180, status: 'library-ready', batch: 2, renderDemo: () => <DebtSnowballAnimation debts={[{label: 'Kreditkarte', balance: 1800, annualInterestPercent: 18.9}, {label: 'Konsumkredit', balance: 6200, annualInterestPercent: 7.4}, {label: 'Autokredit', balance: 12800, annualInterestPercent: 4.8}]} monthlyExtraPayment={350} />},
  {id: 'savings-goal-countdown', name: 'Sparziel-Countdown', category: 'saving-security', purpose: 'Zielbetrag, Fortschritt und verbleibende Monate gemeinsam zeigen.', keywords: ['sparziel', 'countdown', 'rate', 'zielbetrag', 'urlaub', 'auto'], durationInFrames: 180, status: 'library-ready', batch: 2, renderDemo: () => <SavingsGoalCountdownAnimation goalLabel="Eigenkapital" targetAmount={30000} currentAmount={12000} monthlyContribution={600} />},
  {id: 'retirement-gap', name: 'Rentenlücke', category: 'retirement', purpose: 'Gewünschtes Ruhestandseinkommen und offene monatliche Versorgungslücke zeigen.', keywords: ['rentenlücke', 'altersvorsorge', 'ruhestand', 'rente', 'vorsorge'], durationInFrames: 180, status: 'library-ready', batch: 2, renderDemo: () => <RetirementGapAnimation desiredMonthlyIncome={2800} statutoryMonthlyIncome={1450} privateMonthlyIncome={450} retirementYears={25} />},
  {id: 'etf-fee-drag', name: 'ETF-Kosten-Effekt', category: 'costs-fees', purpose: 'Langfristige Vermögensdifferenz durch unterschiedliche laufende Gebühren erklären.', keywords: ['etf-kosten', 'ter', 'gebühren', 'fonds', 'kostenquote'], durationInFrames: 180, status: 'library-ready', batch: 2, renderDemo: () => <EtfFeeDragAnimation initialInvestment={10000} monthlyContribution={250} annualReturnPercent={7} lowFeePercent={0.2} highFeePercent={1.8} years={30} />},
] as const satisfies readonly FinanceAnimationLibraryItem[];

const CATEGORY_BY_ID = new Map<FinanceAnimationLibraryCategoryId, FinanceAnimationLibraryCategory>(FINANCE_ANIMATION_LIBRARY_CATEGORIES.map((category) => [category.id, category]));

export const getFinanceAnimationLibraryCategory = (id: FinanceAnimationLibraryCategoryId): FinanceAnimationLibraryCategory | undefined => CATEGORY_BY_ID.get(id);
export const getFinanceAnimationLibraryItemsByCategory = (category: FinanceAnimationLibraryCategoryId): readonly FinanceAnimationLibraryItem[] => FINANCE_ANIMATION_LIBRARY_ITEMS.filter((item) => item.category === category);
export const getFinanceAnimationLibraryItemsByBatch = (batch: 1 | 2): readonly FinanceAnimationLibraryItem[] => FINANCE_ANIMATION_LIBRARY_ITEMS.filter((item) => item.batch === batch);
