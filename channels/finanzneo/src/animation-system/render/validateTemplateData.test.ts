import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {validateTemplateData} from './validateTemplateData';

const baseScene: FinanceAnimationScene = {
  mode: 'full-animation',
  template: 'money-flow',
  message: '300 Euro fließen jeden Monat in den ETF.',
  voiceText: 'Jeden Monat investierst du 300 Euro in einen ETF.',
  labels: ['Gehalt', 'ETF'],
  data: {
    amount: 300,
    fromLabel: 'Gehalt',
    toLabel: 'ETF',
  },
};

describe('validateTemplateData', () => {
  it('accepts complete template data', () => {
    expect(validateTemplateData(baseScene)).toEqual({
      ok: true,
      template: 'money-flow',
      errors: [],
      warnings: [],
    });
  });

  it('reports missing required data', () => {
    const result = validateTemplateData({...baseScene, data: {amount: 300}});
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Pflichtwert fehlt: fromLabel');
    expect(result.errors).toContain('Pflichtwert fehlt: toLabel');
  });

  it('warns about excessive labels', () => {
    const result = validateTemplateData({...baseScene, labels: ['1', '2', '3', '4', '5', '6']});
    expect(result.ok).toBe(true);
    expect(result.warnings).toHaveLength(1);
  });
});
