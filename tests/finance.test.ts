import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateFutureCost,
  calculateInflationAdjustedValue,
  calculateLoanSchedule,
  calculateLoanSummary,
  calculateSavingsPlanFutureValue,
  calculateTotalContributions,
  roundMoney,
} from '../src/finance/calculations';

test('Sparplan nutzt nachvollziehbare Monatsend-Einzahlungen', () => {
  const input = {contributionPerPeriod: 100, annualReturnRate: 0.07, years: 30};

  assert.equal(roundMoney(calculateSavingsPlanFutureValue(input)), 121997.1);
  assert.equal(calculateTotalContributions(input), 36000);
});

test('Sparplan ohne Rendite entspricht den Einzahlungen', () => {
  assert.equal(calculateSavingsPlanFutureValue({
    contributionPerPeriod: 100,
    annualReturnRate: 0,
    years: 30,
  }), 36000);
});

test('Inflationsfunktionen sind zueinander konsistent', () => {
  const input = {amount: 1000, annualInflationRate: 0.02, years: 10};

  assert.equal(roundMoney(calculateInflationAdjustedValue(input)), 820.35);
  assert.equal(roundMoney(calculateFutureCost(input)), 1218.99);
});

test('Kreditplan endet vollständig getilgt', () => {
  const input = {principal: 10000, annualInterestRate: 0.06, termMonths: 60};
  const summary = calculateLoanSummary(input);
  const schedule = calculateLoanSchedule(input);

  assert.equal(roundMoney(summary.monthlyPayment), 193.33);
  assert.equal(roundMoney(summary.totalInterest), 1599.68);
  assert.equal(schedule.length, 60);
  assert.equal(schedule.at(-1)?.balance, 0);
});

test('Ungültige Finanzparameter werden abgewiesen', () => {
  assert.throws(() => calculateSavingsPlanFutureValue({
    contributionPerPeriod: -1,
    annualReturnRate: 0.07,
    years: 30,
  }), /größer oder gleich 0/);
});
