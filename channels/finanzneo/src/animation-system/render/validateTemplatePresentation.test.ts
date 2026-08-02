import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {validateTemplatePresentation} from './validateTemplatePresentation';

const scene = (
  template: FinanceAnimationScene['template'],
  data: NonNullable<FinanceAnimationScene['data']>,
): FinanceAnimationScene => ({
  mode: 'full-animation',
  template,
  message: 'Testszene',
  voiceText: 'Testszene',
  data,
});

describe('validateTemplatePresentation', () => {
  it('rejects portfolios that exceed the supported card grid', () => {
    const result = validateTemplatePresentation(scene('portfolio-allocation', {
      allocations: Array.from({length: 7}, (_, index) => ({
        label: `Position ${index + 1}`,
        percent: 100 / 7,
      })),
    }));

    expect(result.errors).toContain(
      'Das Portfolio-Template unterstützt höchstens sechs Positionen.',
    );
  });

  it('rejects duplicate portfolio labels and incorrect percentage totals', () => {
    const result = validateTemplatePresentation(scene('portfolio-allocation', {
      allocations: [
        {label: 'ETF', percent: 60},
        {label: 'ETF', percent: 20},
      ],
    }));

    expect(result.errors).toContain(
      'Doppelte Portfolio-Labels sind nicht eindeutig darstellbar.',
    );
    expect(result.errors.some((error) => error.includes('statt 100 Prozent'))).toBe(true);
  });

  it('rejects timelines that exceed the horizontal layout', () => {
    const result = validateTemplatePresentation(scene('timeline-milestones', {
      milestones: Array.from({length: 6}, (_, index) => ({
        label: `Jahr ${index}`,
        value: index * 1000,
      })),
    }));

    expect(result.errors).toContain(
      'Das Zeitleisten-Template unterstützt höchstens fünf Meilensteine.',
    );
  });

  it('rejects duplicate timeline labels', () => {
    const result = validateTemplatePresentation(scene('timeline-milestones', {
      milestones: [
        {label: 'Start', value: 0},
        {label: 'Start', value: 1000},
      ],
    }));

    expect(result.errors).toContain(
      'Doppelte Meilenstein-Labels sind zeitlich nicht eindeutig.',
    );
  });

  it('warns when a before-after comparison has no numerical difference', () => {
    const result = validateTemplatePresentation(scene('before-after-comparison', {
      beforeLabel: 'Vorher',
      afterLabel: 'Nachher',
      beforeValue: 1000,
      afterValue: 1000,
    }));

    expect(result.warnings).toContain(
      'Vorher- und Nachher-Wert sind identisch; der Vergleich zeigt keinen Unterschied.',
    );
  });
});
