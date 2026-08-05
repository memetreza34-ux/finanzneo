import {describe, expect, it} from 'vitest';
import {
  parseFinanceAnimationRequest,
  parseFinanceAnimationScene,
} from './parseFinanceAnimationInput';

const portfolioInput = {
  mode: 'full-animation',
  template: 'portfolio-allocation',
  message: 'Portfolio-Aufteilung',
  voiceText: 'Das Portfolio wird aufgeteilt.',
  labels: ['Portfolio', 'Aufteilung'],
  data: {
    total: 10000,
    allocations: [
      {label: 'ETF', percent: 70},
      {label: 'Tagesgeld', percent: 30},
    ],
  },
};

describe('animation parser immutability', () => {
  it('freezes parsed request, labels, data arrays and structured entries', () => {
    const result = parseFinanceAnimationRequest(portfolioInput);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.labels)).toBe(true);
    expect(Object.isFrozen(result.value.data)).toBe(true);

    const allocations = result.value.data?.allocations as unknown[];
    expect(Object.isFrozen(allocations)).toBe(true);
    expect(Object.isFrozen(allocations[0])).toBe(true);
    expect(Object.isFrozen(allocations[1])).toBe(true);
  });

  it('freezes a fully validated animation scene', () => {
    const result = parseFinanceAnimationScene(portfolioInput);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.data)).toBe(true);
    expect(Object.isFrozen(result.value.labels)).toBe(true);
  });

  it('does not share mutable containers with the original input', () => {
    const result = parseFinanceAnimationRequest(portfolioInput);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const parsedAllocations = result.value.data?.allocations as Array<
      Record<string, unknown>
    >;
    expect(result.value.labels).not.toBe(portfolioInput.labels);
    expect(result.value.data).not.toBe(portfolioInput.data);
    expect(parsedAllocations).not.toBe(portfolioInput.data.allocations);
    expect(parsedAllocations[0]).not.toBe(portfolioInput.data.allocations[0]);
  });

  it('cannot be changed by mutating the original input after parsing', () => {
    const input = {
      ...portfolioInput,
      labels: [...portfolioInput.labels],
      data: {
        ...portfolioInput.data,
        allocations: portfolioInput.data.allocations.map((entry) => ({...entry})),
      },
    };
    const result = parseFinanceAnimationRequest(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    input.labels[0] = 'Manipuliert';
    input.data.total = 1;
    input.data.allocations[0]!.percent = 1;

    const parsedAllocations = result.value.data?.allocations as Array<
      Record<string, unknown>
    >;
    expect(result.value.labels?.[0]).toBe('Portfolio');
    expect(result.value.data?.total).toBe(10000);
    expect(parsedAllocations[0]?.percent).toBe(70);
  });
});
