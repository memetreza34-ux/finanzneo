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
import {
  CashflowSurplusFunnelAnimation,
  CreditCardMinimumPaymentAnimation,
  DrawdownRecoveryAnimation,
  PortfolioRebalancingAnimation,
  RentVsBuyBreakEvenAnimation,
  SequenceRiskAnimation,
} from './FinanceAnimationLibraryBatchFour';
import {
  BondRatePriceSeesawAnimation,
  BusinessProfitCashflowAnimation,
  CapitalGainsTaxWaterfallAnimation,
  DiversificationShockAbsorberAnimation,
  LifestyleInflationAnimation,
  RentalYieldBreakdownAnimation,
} from './FinanceAnimationLibraryBatchFive';

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
  | 'insurance'
  | 'budget-cashflow'
  | 'bonds-interest'
  | 'business-self-employment';

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
  | 'wealth-distribution'
  | 'cashflow-surplus-funnel'
  | 'credit-card-minimum-payment'
  | 'portfolio-rebalancing'
  | 'rent-vs-buy-break-even'
  | 'drawdown-recovery-time'
  | 'sequence-of-returns-risk'
  | 'bond-rate-price-seesaw'
  | 'capital-gains-tax-waterfall'
  | 'business-profit-cashflow'
  | 'rental-yield-breakdown'
  | 'diversification-shock-absorber'
  | 'lifestyle-inflation';

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
  readonly batch: 1 | 2 | 3 | 4 | 5;
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
  {id: 'budget-cashflow', title: 'Budget & Cashflow', description: 'Monatliche Geldströme, Überschüsse und Budgetengpässe.', order: 120},
  {id: 'bonds-interest', title: 'Anleihen & Zinsen', description: 'Zinsänderungen, Duration und Kursreaktionen von Anleihen.', order: 130},
  {id: 'business-self-employment', title: 'Business & Selbstständigkeit', description: 'Umsatz, Gewinn, Liquidität und unternehmerische Kennzahlen.', order: 140},
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
  {id: 'cashflow-surplus-funnel', name: 'Cashflow-Trichter', category: 'budget-cashflow', purpose: 'Monatliches Einkommen auf Fixkosten verteilen und den freien Überschuss sichtbar machen.', keywords: ['cashflow', 'budget', 'überschuss', 'fixkosten', 'einkommen', 'ausgaben'], durationInFrames: 180, status: 'library-ready', batch: 4, renderDemo: () => <CashflowSurplusFunnelAnimation monthlyIncome={3200} expenses={[{label: 'Wohnen', amount: 1150}, {label: 'Lebensmittel', amount: 420}, {label: 'Mobilität', amount: 260}, {label: 'Verträge', amount: 190}, {label: 'Freizeit', amount: 310}]} />},
  {id: 'credit-card-minimum-payment', name: 'Mindestzahlungs-Falle', category: 'real-estate-credit', purpose: 'Lange Laufzeit und hohe Zinskosten bei kleinen Kreditkarten-Mindestzahlungen erklären.', keywords: ['kreditkarte', 'mindestzahlung', 'zinsen', 'schuldenfalle', 'restschuld', 'laufzeit'], durationInFrames: 180, status: 'library-ready', batch: 4, renderDemo: () => <CreditCardMinimumPaymentAnimation balance={5000} annualInterestPercent={19.9} minimumPaymentPercent={3} minimumPaymentFloor={50} />},
  {id: 'portfolio-rebalancing', name: 'Portfolio-Rebalancing', category: 'investing', purpose: 'Übergewichtete und untergewichtete Anlageklassen zurück auf die Zielverteilung verschieben.', keywords: ['rebalancing', 'portfolio', 'gewichtung', 'zielallokation', 'etf', 'risiko'], durationInFrames: 180, status: 'library-ready', batch: 4, renderDemo: () => <PortfolioRebalancingAnimation portfolioValue={100000} current={[{label: 'Aktien', percent: 78}, {label: 'Anleihen', percent: 14}, {label: 'Cash', percent: 8}]} target={[{label: 'Aktien', percent: 70}, {label: 'Anleihen', percent: 20}, {label: 'Cash', percent: 10}]} />},
  {id: 'rent-vs-buy-break-even', name: 'Mieten-gegen-Kaufen-Schnittpunkt', category: 'real-estate-credit', purpose: 'Kumulierte Miet- und Eigentümerkosten über mehrere Jahre gegenüberstellen.', keywords: ['mieten', 'kaufen', 'immobilie', 'break-even', 'wohnkosten', 'kaufnebenkosten'], durationInFrames: 180, status: 'library-ready', batch: 4, renderDemo: () => <RentVsBuyBreakEvenAnimation monthlyRent={1350} annualRentIncreasePercent={2.5} upfrontBuyingCosts={52000} monthlyOwnerCost={1050} />},
  {id: 'drawdown-recovery-time', name: 'Verlust-und-Erholung', category: 'markets', purpose: 'Den asymmetrischen Zusammenhang zwischen Kursverlust und benötigtem Erholungsgewinn zeigen.', keywords: ['drawdown', 'verlust', 'erholung', 'rendite', 'börsencrash', 'prozentrechnung'], durationInFrames: 180, status: 'library-ready', batch: 4, renderDemo: () => <DrawdownRecoveryAnimation startValue={10000} drawdownPercent={50} />},
  {id: 'sequence-of-returns-risk', name: 'Reihenfolge-Risiko', category: 'retirement', purpose: 'Unterschiedliche Ruhestandsverläufe trotz gleicher Renditebausteine sichtbar machen.', keywords: ['sequence risk', 'reihenfolgerisiko', 'ruhestand', 'entnahme', 'portfolio', 'rente'], durationInFrames: 180, status: 'library-ready', batch: 4, renderDemo: () => <SequenceRiskAnimation initialPortfolio={500000} annualWithdrawal={24000} returnsA={[12, 9, 7, 5, -4, -8, 6, 8]} returnsB={[-8, -4, 5, 7, 9, 12, 6, 8]} />},
  {id: 'bond-rate-price-seesaw', name: 'Zinswende bei Anleihen', category: 'bonds-interest', purpose: 'Den gegenläufigen Zusammenhang zwischen Marktzins und Kurs bestehender Anleihen erklären.', keywords: ['anleihe', 'zinswende', 'duration', 'marktzins', 'kursrisiko', 'rentenfonds'], durationInFrames: 180, status: 'library-ready', batch: 5, renderDemo: () => <BondRatePriceSeesawAnimation bondValue={10000} modifiedDuration={6.5} oldYieldPercent={2} newYieldPercent={4} />},
  {id: 'capital-gains-tax-waterfall', name: 'Kapitalertragsteuer-Abzug', category: 'taxes-payroll', purpose: 'Gewinn, Freibetrag, Steuer und Netto-Verkaufserlös einer Geldanlage auseinanderziehen.', keywords: ['kapitalertragsteuer', 'abgeltungsteuer', 'freibetrag', 'gewinn', 'verkauf', 'steuerabzug'], durationInFrames: 180, status: 'library-ready', batch: 5, renderDemo: () => <CapitalGainsTaxWaterfallAnimation saleValue={25000} costBasis={16000} allowance={1000} taxPercent={26.375} />},
  {id: 'business-profit-cashflow', name: 'Umsatz, Gewinn, Cashflow', category: 'business-self-employment', purpose: 'Umsatz, Kosten, Gewinn und operativen Cashflow eines Geschäfts klar voneinander trennen.', keywords: ['umsatz', 'gewinn', 'cashflow', 'selbstständigkeit', 'unternehmen', 'liquidität'], durationInFrames: 180, status: 'library-ready', batch: 5, renderDemo: () => <BusinessProfitCashflowAnimation revenue={48000} expenses={36000} depreciation={3500} receivablesIncrease={5200} />},
  {id: 'rental-yield-breakdown', name: 'Mietrendite-Aufschlüsselung', category: 'real-estate-credit', purpose: 'Brutto- und Nettomietrendite unter Berücksichtigung von Kaufnebenkosten und laufenden Kosten zeigen.', keywords: ['mietrendite', 'bruttorendite', 'nettorendite', 'kaltmiete', 'kaufpreis', 'immobilie'], durationInFrames: 180, status: 'library-ready', batch: 5, renderDemo: () => <RentalYieldBreakdownAnimation monthlyColdRent={1250} annualNonRecoverableCosts={2700} purchasePrice={310000} buyingCosts={34000} />},
  {id: 'diversification-shock-absorber', name: 'Diversifikations-Puffer', category: 'investing', purpose: 'Zeigen, wie mehrere Anlageklassen einen starken Einzelschock im Gesamtportfolio abfedern.', keywords: ['diversifikation', 'risikostreuung', 'portfolio', 'einzelschock', 'anlageklassen', 'verlust'], durationInFrames: 180, status: 'library-ready', batch: 5, renderDemo: () => <DiversificationShockAbsorberAnimation portfolioValue={100000} concentratedShockPercent={-35} positions={[{label: 'Aktien', weightPercent: 55, shockPercent: -18}, {label: 'Anleihen', weightPercent: 25, shockPercent: 4}, {label: 'Gold', weightPercent: 10, shockPercent: 8}, {label: 'Cash', weightPercent: 10, shockPercent: 0}]} />},
  {id: 'lifestyle-inflation', name: 'Lifestyle-Inflation', category: 'income-purchasing-power', purpose: 'Den Verlust zusätzlichen Sparpotenzials durch gleichzeitig wachsende Ausgaben sichtbar machen.', keywords: ['lifestyle-inflation', 'gehaltserhöhung', 'ausgaben', 'sparquote', 'konsum', 'vermögensaufbau'], durationInFrames: 180, status: 'library-ready', batch: 5, renderDemo: () => <LifestyleInflationAnimation oldIncome={2800} oldExpenses={2200} newIncome={3600} newExpenses={3050} />},
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
  batch: 1 | 2 | 3 | 4 | 5,
): readonly FinanceAnimationLibraryItem[] =>
  FINANCE_ANIMATION_LIBRARY_ITEMS.filter((item) => item.batch === batch);
