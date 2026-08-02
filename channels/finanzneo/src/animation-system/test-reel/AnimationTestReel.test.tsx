import React from 'react';
import {describe, expect, it} from 'vitest';
import {parseFinanceAnimationScene} from '../ingestion';
import {
  AnimationTestReel,
  FINANCE_ANIMATION_TEST_REEL_DURATION,
  FINANCE_ANIMATION_TEST_REEL_SCENES,
  FINANCE_ANIMATION_TEST_SCENE_DURATION,
} from './AnimationTestReel';

describe('AnimationTestReel', () => {
  it('contains five valid animations and one intentional fallback', () => {
    expect(FINANCE_ANIMATION_TEST_REEL_SCENES).toHaveLength(6);
    expect(
      FINANCE_ANIMATION_TEST_REEL_SCENES.filter((scene) => scene.expectsFallback),
    ).toHaveLength(1);
  });

  it('keeps valid and invalid scene expectations aligned with the parser', () => {
    for (const scene of FINANCE_ANIMATION_TEST_REEL_SCENES) {
      const parsed = parseFinanceAnimationScene(scene.input);
      expect(parsed.ok).toBe(!scene.expectsFallback);
    }
  });

  it('derives total duration from scene count', () => {
    expect(FINANCE_ANIMATION_TEST_REEL_DURATION).toBe(
      FINANCE_ANIMATION_TEST_REEL_SCENES.length *
        FINANCE_ANIMATION_TEST_SCENE_DURATION,
    );
  });

  it('creates a renderable reel component', () => {
    expect(React.isValidElement(<AnimationTestReel />)).toBe(true);
  });
});
