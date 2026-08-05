import React from 'react';
import {describe, expect, it} from 'vitest';
import {
  FINANCE_ANIMATION_TEST_REEL_DURATION,
  FINANCE_ANIMATION_TEST_SCENE_DURATION,
} from './AnimationTestReel';
import {FinanceAnimationTestReelRoot} from './AnimationTestReelRoot';

describe('FinanceAnimationTestReelRoot', () => {
  it('registers the full reel and stable fallback preview only', () => {
    const root = FinanceAnimationTestReelRoot({});
    expect(React.isValidElement(root)).toBe(true);
    if (!React.isValidElement<{children: React.ReactNode}>(root)) return;

    const compositions = React.Children.toArray(root.props.children)
      .filter(React.isValidElement) as Array<React.ReactElement<{
        id: string;
        durationInFrames: number;
        width: number;
        height: number;
        fps: number;
      }>>;

    expect(compositions.map((composition) => composition.props.id)).toEqual([
      'FinanceAnimationTestReel',
      'FinanceAnimationFallbackPreview',
    ]);
    expect(compositions[0]?.props.durationInFrames).toBe(
      FINANCE_ANIMATION_TEST_REEL_DURATION,
    );
    expect(compositions[1]?.props.durationInFrames).toBe(
      FINANCE_ANIMATION_TEST_SCENE_DURATION,
    );
    for (const composition of compositions) {
      expect(composition.props.width).toBe(1080);
      expect(composition.props.height).toBe(1920);
      expect(composition.props.fps).toBe(30);
    }
  });
});
