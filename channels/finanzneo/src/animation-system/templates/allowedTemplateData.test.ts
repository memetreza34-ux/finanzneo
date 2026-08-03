import {describe, expect, it} from 'vitest';
import type {FinanceAnimationTemplate} from '../contracts';
import {FINANCE_ANIMATION_TEMPLATES} from './registry';
import {
  FINANCE_ANIMATION_ALLOWED_DATA,
  FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS,
  getAllowedTemplateData,
} from './allowedTemplateData';
import {FINANCE_ANIMATION_REQUIRED_DATA} from './requiredTemplateData';

describe('FINANCE_ANIMATION_ALLOWED_DATA', () => {
  it('contains every registered template exactly once', () => {
    const registered = FINANCE_ANIMATION_TEMPLATES.map((definition) => definition.id);
    const allowed = Object.keys(FINANCE_ANIMATION_ALLOWED_DATA)
      .sort() as FinanceAnimationTemplate[];

    expect(allowed).toEqual([...registered].sort());
  });

  it('contains every required field for each template', () => {
    for (const definition of FINANCE_ANIMATION_TEMPLATES) {
      const allowed = new Set(getAllowedTemplateData(definition.id));
      for (const requiredKey of FINANCE_ANIMATION_REQUIRED_DATA[definition.id]) {
        expect(allowed.has(requiredKey)).toBe(true);
      }
    }
  });

  it('keeps annualReturn as the only optional monthly-investment field', () => {
    expect(FINANCE_ANIMATION_ALLOWED_DATA['monthly-investment']).toEqual([
      'monthlyRate',
      'months',
      'annualReturn',
    ]);
    expect(FINANCE_ANIMATION_REQUIRED_DATA['monthly-investment']).toEqual([
      'monthlyRate',
      'months',
    ]);
  });

  it('defines exact structured-entry keys', () => {
    expect(FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS).toEqual({
      'portfolio-allocation': ['label', 'percent', 'value'],
      'timeline-milestones': ['label', 'value'],
    });
  });

  it('does not contain duplicate fields', () => {
    for (const fields of Object.values(FINANCE_ANIMATION_ALLOWED_DATA)) {
      expect(new Set(fields).size).toBe(fields.length);
    }
  });
});
