import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import {getFinanceAnimationFixture} from '../fixtures';
import {FinanceAnimationRenderer} from './FinanceAnimationRenderer';
import {
  type FinanceAnimationFallbackContext,
  resolveFinanceAnimationFallbackContext,
  SafeFinanceAnimationRenderer,
} from './SafeFinanceAnimationRenderer';

const invalidMoneyFlowInput = {
  mode: 'full-animation',
  template: 'money-flow',
  message: 'Ungültige Szene',
  voiceText: 'Ziel fehlt.',
  data: {amount: 300, fromLabel: 'Gehalt'},
};

describe('SafeFinanceAnimationRenderer', () => {
  it('forwards a parsed canonical scene to the central renderer', () => {
    const fixture = getFinanceAnimationFixture('inflation-erosion');
    const element = SafeFinanceAnimationRenderer({input: fixture?.scene});

    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect(element.type).toBe(FinanceAnimationRenderer);
    }
  });

  it('returns the supplied static fallback for invalid untrusted input', () => {
    const fallback = <div>Bild-Fallback</div>;
    const element = SafeFinanceAnimationRenderer({
      input: invalidMoneyFlowInput,
      fallback,
    });

    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement<{children: React.ReactNode}>(element)) {
      expect(element.props.children).toBe(fallback);
    }
  });

  it('passes immutable normalized diagnostics without raw input', () => {
    const renderFallback = vi.fn((context: FinanceAnimationFallbackContext) => (
      <div>{context.errors.join(' | ')}</div>
    ));
    const element = SafeFinanceAnimationRenderer({
      input: invalidMoneyFlowInput,
      renderFallback,
    });

    expect(renderFallback).toHaveBeenCalledTimes(1);
    const [context] = renderFallback.mock.calls[0] ?? [];
    expect(context).toEqual({
      errors: expect.arrayContaining(['Pflichtwert fehlt: toLabel']),
      warnings: [],
    });
    expect(Object.keys(context ?? {})).toEqual(['errors', 'warnings']);
    expect(Object.isFrozen(context)).toBe(true);
    expect(Object.isFrozen(context?.errors)).toBe(true);
    expect(Object.isFrozen(context?.warnings)).toBe(true);
    expect(React.isValidElement(element)).toBe(true);
  });

  it('does not execute a fallback callback for a valid scene', () => {
    const fixture = getFinanceAnimationFixture('tax-fee-flow');
    const renderFallback = vi.fn(() => <div>Fallback</div>);

    SafeFinanceAnimationRenderer({
      input: fixture?.scene,
      renderFallback,
    });

    expect(renderFallback).not.toHaveBeenCalled();
  });

  it('renders an empty fragment when no fallback was supplied', () => {
    const element = SafeFinanceAnimationRenderer({input: null});

    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement<{children: React.ReactNode}>(element)) {
      expect(element.props.children).toBeNull();
    }
  });
});

describe('resolveFinanceAnimationFallbackContext', () => {
  it('copies parser errors and warnings without exposing input', () => {
    const sourceErrors = ['Fehler A'];
    const sourceWarnings = ['Warnung A'];
    const context = resolveFinanceAnimationFallbackContext({
      ok: false,
      errors: sourceErrors,
      warnings: sourceWarnings,
    });

    expect(context).toEqual({
      errors: ['Fehler A'],
      warnings: ['Warnung A'],
    });
    expect(context.errors).not.toBe(sourceErrors);
    expect(context.warnings).not.toBe(sourceWarnings);
    expect(Object.isFrozen(context)).toBe(true);
  });
});
