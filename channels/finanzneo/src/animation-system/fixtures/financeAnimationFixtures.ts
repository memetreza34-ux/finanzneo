import type {
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import type {
  FinanceAnimationTemplateData,
} from '../templateDataContracts';

export type FinanceAnimationFixture = {
  readonly name: string;
  readonly scene: FinanceAnimationScene;
};

const createFixture = <TTemplate extends FinanceAnimationTemplate>(
  name: string,
  template: TTemplate,
  data: FinanceAnimationTemplateData<TTemplate>,
  labels: string[],
): FinanceAnimationFixture => ({
  name,
  scene: {
    mode: 'full-animation',
    template,
    message: `${name} verständlich darstellen.`,
    voiceText: `${name} wird mit strukturierten Finanzdaten erklärt.`,
    labels,
    data,
  },
});

/**
 * Kanonische, vollständig validierbare Beispielszenen für alle Templates.
 * Galerie, Tests und spätere Smoke-Checks verwenden damit dieselben Daten.
 * Der generische Fixture-Builder erzwingt dabei den passenden Datenvertrag
 * für die jeweils angegebene Template-ID.
 */
export const FINANCE_ANIMATION_FIXTURES: readonly FinanceAnimationFixture[] = [
  createFixture(
    'Geldfluss',
    'money-flow',
    {amount: 600, fromLabel: 'Gehalt', toLabel: 'Welt-ETF'},
    ['Gehalt', 'Welt-ETF'],
  ),
  createFixture(
    'Budget-Aufteilung',
    'budget-split',
    {income: 2500, needsPercent: 50, wantsPercent: 30, savingsPercent: 20},
    ['Fixkosten', 'Wünsche', 'Sparen'],
  ),
  createFixture(
    'Zinseszins',
    'compound-growth',
    {startCapital: 1000, monthlyRate: 200, annualReturn: 7, years: 20},
    ['Startkapital', 'Endkapital'],
  ),
  createFixture(
    'Portfolio',
    'portfolio-allocation',
    {
      total: 25000,
      allocations: [
        {label: 'Welt-ETF', percent: 70},
        {label: 'Anleihen', percent: 20},
        {label: 'Cash', percent: 10},
      ],
    },
    ['Welt-ETF', 'Anleihen', 'Cash'],
  ),
  createFixture(
    'Inflation',
    'inflation-erosion',
    {startingValue: 100, inflationPercent: 2.5, years: 10},
    ['Heute', 'In 10 Jahren'],
  ),
  createFixture(
    'Schuldenabbau',
    'debt-paydown',
    {
      originalDebt: 12000,
      remainingDebt: 4200,
      paidInstallments: 26,
      totalInstallments: 40,
    },
    ['Ausgangsschuld', 'Restschuld'],
  ),
  createFixture(
    'Sparplan',
    'monthly-investment',
    {monthlyRate: 250, months: 12, annualReturn: 6},
    ['Monatsrate', 'Endwert'],
  ),
  createFixture(
    'Vorher-Nachher',
    'before-after-comparison',
    {
      beforeLabel: 'Nur sparen',
      afterLabel: 'Sparen und investieren',
      beforeValue: 12000,
      afterValue: 17800,
    },
    ['Nur sparen', 'Sparen und investieren'],
  ),
  createFixture(
    'Risiko und Rendite',
    'risk-return-scale',
    {riskPercent: 45, returnPercent: 65},
    ['Risiko', 'Renditechance'],
  ),
  createFixture(
    'Meilensteine',
    'timeline-milestones',
    {
      milestones: [
        {label: 'Start', value: 0},
        {label: '5 Jahre', value: 18000},
        {label: '10 Jahre', value: 42000},
        {label: '20 Jahre', value: 118000},
      ],
    },
    ['Start', '5 Jahre', '10 Jahre', '20 Jahre'],
  ),
  createFixture(
    'Einnahmen und Ausgaben',
    'income-expense-balance',
    {income: 2800, expenses: 2100},
    ['Einnahmen', 'Ausgaben', 'Überschuss'],
  ),
  createFixture(
    'Steuern und Gebühren',
    'tax-fee-flow',
    {grossAmount: 3000, taxes: 620, fees: 30},
    ['Brutto', 'Steuern', 'Gebühren', 'Netto'],
  ),
] as const;

export const getFinanceAnimationFixture = (
  template: FinanceAnimationTemplate,
): FinanceAnimationFixture | undefined =>
  FINANCE_ANIMATION_FIXTURES.find((fixture) => fixture.scene.template === template);
