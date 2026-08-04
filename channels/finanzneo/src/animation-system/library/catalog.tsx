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
import {
  DcaVsLumpSumAnimation,
  GrossNetWaterfallAnimation,
  InsuranceCostStackAnimation,
  MarketBubbleCycleAnimation,
  TaxClassComparisonAnimation,
  WealthDistributionAnimation,
} from './FinanceAnimationLibraryBatchThree';

export type FinanceAnimationLibraryCategoryId =
  | 'markets'
  | 'investing'
  | 'saving-security'
  | 'real-estate-credit'
  | 'wealth'
  | 'financial-freedom'
  | 'income-purchasing-power'
  | 'retirement'
  | 'costs-fees'
  | 'taxes-payroll'
  | 'insurance';

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
  | 'etf-fee-drag'
  | 'gross-net-waterfall'
  | 'tax-class-comparison'
  | 'dca-vs-lump-sum'
  | 'market-bubble-cycle'
  | 'insurance-cost-stack'
  | 'wealth-distribution';

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
  readonly batch: 1 | 2 | 3;
  readonly renderDemo: () => React.ReactNode;
};

export const FINANCE_ANIMATION_LIBRARY_CATEGORIES = [
  {id: 'markets', title: 'Börse & Märkte', description: 'Kursbewegungen, Crashs, Erholungen und Marktphasen.', order: 10},
  {id: 'investing', title: 'Investieren', description: 'Erträge, Ausschüttungen und langfristiger Vermögensaufbau.', order: 20},
  {id: 'saving-security', title: 'Sparen & Sicherheit', description: 'Liquiditätsreserve, Sparziele und finanzielle Stabilität.', order: 30},
  {id: 'real-estate-credit', title: 'Immobilien & Kredite', description: 'Finanzierung, Zinslast, Tilgung und Restschuld.', order: 40},
  {id: 'wealth', title: 'Vermögen', description: 'Vermögenswerte, Schulden, Nettovermögen und Verteilung.', order: 50},
  {id: 'financial-freedom', title: 'Finanzielle Freiheit', description: 'FIRE-Ziele, Entnahmeraten und langfristige Zielerreichung.', order: 60},
  {id: 'income-purchasing-power', title: 'Einkommen & Kaufkraft', description: 'Gehalt, Inflation und reale Kaufkraft vergleichen.', order: 70},
  {id: 'retirement', title: 'Altersvorsorge', description: 'Rentenlücke, Ruhestandseinkommen und Vorsorgebedarf.', order: 80},
  {id: 'costs-fees', title: 'Kosten & Gebühren', description: 'Laufende Gebühren und ihre langfristige Vermögenswirkung.', order: 90},
  {id: 'taxes-payroll', title: 'Steuern & Gehalt', description: 'Brutto-Netto-Abzüge und unterschiedliche Auszahlungsvarianten.', order: 100},
  {id: 'insurance', title: 'Versicherungen', description: 'Beiträge, Absicherung und jährliche Gesamtkosten.', order: 110},
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
  {id: 'gross-net-waterfall', name: 'Brutto-Netto-Wasserfall', category: 'taxes-payroll', purpose: 'Steuern, Sozialabgaben und weitere Abzüge vom Bruttogehalt sichtbar abfließen lassen.', keywords: ['brutto', 'netto', 'gehalt', 'abzüge', 'sozialabgaben', 'lohnsteuer'], durationInFrames: 180, status: 'library-ready', batch: 3, renderDemo: () => <GrossNetWaterfallAnimation grossSalary={4200} incomeTax={620} socialContributions={840} otherDeductions={55} />},
  {id: 'tax-class-comparison', name: 'Steuerklassen-Vergleich', category: 'taxes-payroll', purpose: 'Mehrere beispielhafte Netto-Auszahlungen bei identischem Bruttogehalt vergleichen.', keywords: ['steuerklasse', 'nettovergleich', 'ehe', 'lohnsteuer', 'gehalt', 'abzüge'], durationInFrames: 180, status: 'library-ready', batch: 3, renderDemo: () => <TaxClassComparisonAnimation grossSalary={4200} variants={[{label: 'Klasse I', netSalary: 2685}, {label: 'Klasse III', netSalary: 3020}, {label: 'Klasse V', netSalary: 2250}]} />},
  {id: 'dca-vs-lump-sum', name: 'Sparplan gegen Einmalanlage', category: 'investing', purpose: 'Regelmäßige Käufe bei schwankenden Kursen einer sofortigen Einmalanlage gegenüberstellen.', keywords: ['sparplan', 'einmalanlage', 'dca', 'cost-average', 'kaufzeitpunkt', 'kurse'], durationInFrames: 180, status: 'library-ready', batch: 3, renderDemo: () => <DcaVsLumpSumAnimation totalCapital={12000} prices={[100, 80, 60, 90, 120, 140]} />},
  {id: 'market-bubble-cycle', name: 'Börsenblase und Absturz', category: 'markets', purpose: 'Hoffnung, Euphorie und den anschließenden Absturz einer spekulativen Blase zeigen.', keywords: ['börsenblase', 'euphorie', 'spekulation', 'absturz', 'panik', 'marktzyklus'], durationInFrames: 180, status: 'library-ready', batch: 3, renderDemo: () => <MarketBubbleCycleAnimation startValue={10000} peakIncreasePercent={180} crashFromPeakPercent={72} />},
  {id: 'insurance-cost-stack', name: 'Versicherungskosten-Stapel', category: 'insurance', purpose: 'Mehrere kleine Monatsbeiträge zu ihrer jährlichen Gesamtbelastung zusammenführen.', keywords: ['versicherung', 'beitrag', 'kosten', 'haftpflicht', 'berufsunfähigkeit', 'schutz'], durationInFrames: 180, status: 'library-ready', batch: 3, renderDemo: () => <InsuranceCostStackAnimation monthlyIncome={2800} policies={[{label: 'Haftpflicht', monthlyPremium: 8}, {label: 'Hausrat', monthlyPremium: 14}, {label: 'Rechtsschutz', monthlyPremium: 29}, {label: 'Berufsunfähigkeit', monthlyPremium: 96}, {label: 'Kfz', monthlyPremium: 74}]} />},
  {id: 'wealth-distribution', name: 'Vermögensverteilung', category: 'wealth', purpose: 'Bevölkerungsanteile und ihren jeweiligen Anteil am Gesamtvermögen gegenüberstellen.', keywords: ['vermögensverteilung', 'ungleichheit', 'reichste', 'bevölkerung', 'vermögen', 'anteil'], durationInFrames: 180, status: 'library-ready', batch: 3, renderDemo: () => <WealthDistributionAnimation groups={[{label: 'Untere 50 %', populationPercent: 50, wealthPercent: 3}, {label: 'Mittlere 40 %', populationPercent: 40, wealthPercent: 31}, {label: 'Obere 10 %', populationPercent: 10, wealthPercent: 66}]} />},
] as const satisfies readonly FinanceAnimationLibraryItem[];

const CATEGORY_BY_ID = new Map<FinanceAnimationLibraryCategoryId, FinanceAnimationLibraryCategory>(
  FINANCE_ANIMATION_LIBRARY_CATEGORIES.map((category) => [category.id, category]),
);

export const getFinanceAnimationLibraryCategory = (
  id: FinanceAnimationLibraryCategoryId,
): FinanceAnimationLibraryCategory | undefined => CATEGORY_BY_ID.get(id);

export const getFinanceAnimationLibraryItemsByCategory = (
  category: FinanceAnimationLibraryCategoryId,
): readonly FinanceAnimationLibraryItem[] =>
  FINANCE_ANIMATION_LIBRARY_ITEMS.filter((item) => item.category === category);

export const getFinanceAnimationLibraryItemsByBatch = (
  batch: 1 | 2 | 3,
): readonly FinanceAnimationLibraryItem[] =>
  FINANCE_ANIMATION_LIBRARY_ITEMS.filter((item) => item.batch === batch);
