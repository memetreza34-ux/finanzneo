import React from 'react';
import {describe, expect, it} from 'vitest';
import {getFinanceAnimationFixture} from '../fixtures';
import {FinanceAnimationRenderer} from './FinanceAnimationRenderer';
import {SafeFinanceAnimationRenderer} from './SafeFinanceAnimationRenderer';

describe('SafeFinanceAnimationRenderer', () => {
  it('forwards a parsed canonical scene to the central renderer', () => {
    const fixture = getFinanceAnimationFixture('inflation-erosion');
    const element = SafeFinanceAnimationRenderer({input: fixture?.scene});

    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect(element.type).toBe(FinanceAnimationRenderer);
    }
  });

  it('returns the supplied fallback for invalid untrusted input', () => {
    const fallback = <div>Bild-Fallback</div>;
    const element = SafeFinanceAnimationRenderer({
      input: {
        mode: 'full-animation',
        template: 'money-flow',
        message: 'Ungültige Szene',
        voiceText: 'Ziel fehlt.',
        data: {amount: 300, fromLabel: 'Gehalt'},
      },
      fallback,
    });

    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect(element.props.children).toBe(fallback);
    }
  });

  it('renders an empty fragment when no fallback was supplied', () => {
    const element = SafeFinanceAnimationRenderer({input: null});

    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect(element.props.children).toBeNull();
    }
  });
});
