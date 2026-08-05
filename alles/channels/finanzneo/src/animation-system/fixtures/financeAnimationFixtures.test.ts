import React from 'react';
import {describe, expect, it} from 'vitest';
import {FinanceAnimationRenderer} from '../render/FinanceAnimationRenderer';
import {validateTemplateData} from '../render/validateTemplateData';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';
import {
  FINANCE_ANIMATION_FIXTURES,
  getFinanceAnimationFixture,
} from './financeAnimationFixtures';

describe('financeAnimationFixtures', () => {
  it('contains exactly one fixture for every registered template', () => {
    const fixtureTemplates = FINANCE_ANIMATION_FIXTURES.map(
      (fixture) => fixture.scene.template,
    );
    const registeredTemplates = FINANCE_ANIMATION_TEMPLATES.map(
      (definition) => definition.id,
    );

    expect(fixtureTemplates).toEqual(registeredTemplates);
    expect(new Set(fixtureTemplates).size).toBe(fixtureTemplates.length);
  });

  it('keeps every canonical fixture fully valid', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      expect(validateTemplateData(fixture.scene)).toEqual({
        ok: true,
        template: fixture.scene.template,
        errors: [],
        warnings: [],
      });
    }
  });

  it('maps every canonical fixture through the central renderer', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const element = FinanceAnimationRenderer({scene: fixture.scene});
      expect(React.isValidElement(element)).toBe(true);
    }
  });

  it('returns fixtures by template id', () => {
    expect(getFinanceAnimationFixture('compound-growth')?.name).toBe('Zinseszins');
    expect(getFinanceAnimationFixture('tax-fee-flow')?.scene.data?.grossAmount).toBe(3000);
  });
});
