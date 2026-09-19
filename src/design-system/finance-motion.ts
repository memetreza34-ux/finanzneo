// Brücke zwischen Finanzmathematik und Animation.
//
// Anlass: die Probeszene „Kinetische Zahl" zeigte 47.320 € für 200 € monatlich
// über 15 Jahre bei 7 %. Die zentrale Rechnung in `src/finance/calculations.ts`
// ergibt 63.392 €. Die Zahl war frei erfunden, und niemand hat es gemerkt —
// `validate-finance.mjs` prüft die Formeln, aber keine Animationsdateien.
//
// CLAUDE.md §5 sagt: „Zahlen nur nach Prüfung; Beispielannahmen klar
// kennzeichnen." Eine Animation, die ihre Werte hier holt, kann das nicht mehr
// verletzen: sie bekommt die gerechneten Zahlen und den Offenlegungssatz im
// selben Objekt.

import {
  calculateFutureCost,
  calculateInflationAdjustedValue,
  calculateLoanSummary,
  calculatePurchasingPowerLossPercent,
  calculateSavingsPlanSeries,
} from '../finance/calculations';
import {FINANCE_EXAMPLES} from '../finance/examples';

/** Ein Jahr im Sparplan, aufgeteilt in die beiden Anteile, die man zeigt. */
export type SparjahrPunkt = {
  jahr: number;
  eingezahlt: number;
  zinsen: number;
  gesamt: number;
};

export type SparplanFuerAnimation = {
  jahre: SparjahrPunkt[];
  endwert: number;
  eingezahltGesamt: number;
  zinsenGesamt: number;
  /** Höchster Gesamtwert — der Bezug, auf den Balken skaliert werden. */
  maximum: number;
  /** Pflichtsatz für die Einblendung. Beispielrechnung, keine Zusage. */
  hinweis: string;
};

/**
 * Sparplan als Reihe, direkt für Balken oder Kurve verwendbar.
 *
 * Die Renditeannahme wird als Prozentzahl übergeben, weil in einer Szene
 * „7 %" steht und nicht „0.07" — die Umrechnung passiert hier, damit sie nicht
 * in jeder Animation erneut falsch gemacht wird.
 */
export const sparplanFuerAnimation = ({
  monatlich,
  renditeProzent,
  jahre,
}: {
  monatlich: number;
  renditeProzent: number;
  jahre: number;
}): SparplanFuerAnimation => {
  const reihe = calculateSavingsPlanSeries({
    contributionPerPeriod: monatlich,
    annualReturnRate: renditeProzent / 100,
    years: jahre,
    periodsPerYear: 12,
  });

  const punkte = reihe.map((p) => ({
    jahr: p.year,
    eingezahlt: p.contributions,
    zinsen: p.growth,
    gesamt: p.value,
  }));

  const letzter = punkte[punkte.length - 1];

  return {
    jahre: punkte,
    endwert: letzter.gesamt,
    eingezahltGesamt: letzter.eingezahlt,
    zinsenGesamt: letzter.zinsen,
    maximum: letzter.gesamt,
    hinweis: `Beispielrechnung: ${monatlich} € monatlich, ${renditeProzent} % p. a., Einzahlung am Monatsende, vor Kosten, Steuern und Inflation. Keine Renditegarantie.`,
  };
};

export type KaufkraftFuerAnimation = {
  heute: number;
  spaeter: number;
  verlustProzent: number;
  kostenSpaeter: number;
  hinweis: string;
};

/**
 * Was ein Betrag nach einigen Jahren noch wert ist.
 *
 * Für Inflationsszenen: `spaeter` ist die verbliebene Kaufkraft desselben
 * Betrags, `kostenSpaeter` der Preis, den dieselbe Ware dann hat.
 */
export const kaufkraftFuerAnimation = ({
  betrag,
  inflationProzent,
  jahre,
}: {
  betrag: number;
  inflationProzent: number;
  jahre: number;
}): KaufkraftFuerAnimation => {
  const eingabe = {amount: betrag, annualInflationRate: inflationProzent / 100, years: jahre};
  return {
    heute: betrag,
    spaeter: calculateInflationAdjustedValue(eingabe),
    verlustProzent: calculatePurchasingPowerLossPercent(eingabe),
    kostenSpaeter: calculateFutureCost(eingabe),
    hinweis: `Beispielrechnung mit konstant ${inflationProzent} % Inflation pro Jahr. Die tatsächliche Inflation schwankt.`,
  };
};

export type KreditFuerAnimation = {
  monatlich: number;
  gesamtkosten: number;
  zinskosten: number;
  hinweis: string;
};

/** Annuitätenkredit, aufgeteilt in das, was man in einer Szene gegenüberstellt. */
export const kreditFuerAnimation = ({
  summe,
  sollzinsProzent,
  monate,
}: {
  summe: number;
  sollzinsProzent: number;
  monate: number;
}): KreditFuerAnimation => {
  const zusammenfassung = calculateLoanSummary({
    principal: summe,
    annualInterestRate: sollzinsProzent / 100,
    termMonths: monate,
  });
  return {
    monatlich: zusammenfassung.monthlyPayment,
    gesamtkosten: zusammenfassung.totalPayment,
    zinskosten: zusammenfassung.totalInterest,
    hinweis: `Vereinfachte Annuitätenrechnung mit konstant ${sollzinsProzent} % Sollzins, ohne Gebühren, Versicherungen oder Sondertilgungen.`,
  };
};

/**
 * Höhe eines Balkens in Pixeln, bezogen auf den grössten Wert der Reihe.
 *
 * Vermeidet den häufigsten Darstellungsfehler: Balken, deren Höhen frei gewählt
 * sind und das Verhältnis der Zahlen nicht mehr abbilden.
 */
export const balkenHoehe = (wert: number, maximum: number, maxHoehe: number) => (
  maximum <= 0 ? 0 : (Math.max(0, wert) / maximum) * maxHoehe
);

/** Betrag in der Schreibweise des Kanals. */
export const euroText = (wert: number) => `${Math.round(wert).toLocaleString('de-DE')} €`;

export {FINANCE_EXAMPLES};
