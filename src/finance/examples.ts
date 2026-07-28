// Verbindliche, nachvollziehbare Beispielannahmen für Demos und Vorlagen.
// Diese Werte sind keine Empfehlungen. Jede veröffentlichte Nutzung muss als
// Beispiel gekennzeichnet und bei Bedarf an das konkrete Thema angepasst werden.

export const FINANCE_EXAMPLES = {
  savingsPlan: {
    contributionPerPeriod: 100,
    annualReturnRate: 0.07,
    years: 30,
    periodsPerYear: 12,
    disclosure: 'Beispielrechnung: 100 € monatlich, 7 % p. a., Einzahlung am Monatsende, vor Kosten, Steuern und Inflation. Keine Renditegarantie.',
  },
  inflation: {
    amount: 1000,
    annualInflationRate: 0.02,
    years: 10,
    disclosure: 'Beispielrechnung mit konstant 2 % Inflation pro Jahr. Die tatsächliche Inflation schwankt.',
  },
  loan: {
    principal: 10000,
    annualInterestRate: 0.06,
    termMonths: 60,
    disclosure: 'Vereinfachte Annuitätenrechnung mit konstant 6 % Sollzins, ohne Gebühren, Versicherungen oder Sondertilgungen.',
  },
  emergencyFund: {
    monthlyNecessaryExpenses: 1500,
    targetMonths: 3,
    disclosure: 'Der sinnvolle Notgroschen hängt von Lebenssituation, Arbeitsplatzsicherheit und Versicherungen ab.',
  },
} as const;

export const getEmergencyFundTarget = (): number =>
  FINANCE_EXAMPLES.emergencyFund.monthlyNecessaryExpenses *
  FINANCE_EXAMPLES.emergencyFund.targetMonths;
