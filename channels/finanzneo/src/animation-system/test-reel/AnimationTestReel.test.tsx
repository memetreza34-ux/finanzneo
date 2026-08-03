import React from 'react';
import {describe, expect, it} from 'vitest';
import {parseFinanceAnimationScene} from '../ingestion';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';
import {
  AnimationFallbackPreview,
  AnimationTestReel,
  FINANCE_ANIMATION_TEST_REEL_DURATION,
  FINANCE_ANIMATION_TEST_REEL_SCENES,
  FINANCE_ANIMATION_TEST_SCENE_DURATION,
  getFinanceAnimationTestSceneMiddleFrame,
  getFinanceAnimationTestSceneStartFrame,
  getFirstFinanceAnimationFallbackScene,
} from './AnimationTestReel';

describe('AnimationTestReel', () => {
  it('contains all twelve valid templates and three intentional fallbacks', () => {
    expect(FINANCE_ANIMATION_TEST_REEL_SCENES).toHaveLength(
      FINANCE_ANIMATION_TEMPLATES.length + 3,
    );
    expect(
      FINANCE_ANIMATION_TEST_REEL_SCENES.filter((scene) => scene.expectsFallback),
    ).toHaveLength(3);
  });

  it('contains every registered animation template exactly once', () => {
    const templates = FINANCE_ANIMATION_TEST_REEL_SCENES
      .filter((scene) => !scene.expectsFallback)
      .map((scene) => scene.template);

    expect(templates).toEqual(
      FINANCE_ANIMATION_TEMPLATES.map((definition) => definition.id),
    );
    expect(new Set(templates).size).toBe(FINANCE_ANIMATION_TEMPLATES.length);
  });

  it('keeps valid and invalid scene expectations aligned with the parser', () => {
    for (const scene of FINANCE_ANIMATION_TEST_REEL_SCENES) {
      const parsed = parseFinanceAnimationScene(scene.input);
      expect(parsed.ok, scene.name).toBe(!scene.expectsFallback);
    }
  });

  it('covers distinct fallback categories', () => {
    const fallbackKinds = FINANCE_ANIMATION_TEST_REEL_SCENES
      .filter((scene) => scene.expectsFallback)
      .map((scene) => scene.fallbackKind);

    expect(fallbackKinds).toEqual([
      'missing-data',
      'unsafe-data',
      'invalid-mode',
    ]);
  });

  it('selects the missing-data case for the stable fallback preview', () => {
    const fallback = getFirstFinanceAnimationFallbackScene();

    expect(fallback.expectsFallback).toBe(true);
    expect(fallback.fallbackKind).toBe('missing-data');
    expect(parseFinanceAnimationScene(fallback.input).ok).toBe(false);
    expect(React.isValidElement(<AnimationFallbackPreview />)).toBe(true);
  });

  it('derives total duration from scene count', () => {
    expect(FINANCE_ANIMATION_TEST_REEL_DURATION).toBe(
      FINANCE_ANIMATION_TEST_REEL_SCENES.length *
        FINANCE_ANIMATION_TEST_SCENE_DURATION,
    );
  });

  it('calculates deterministic scene start and middle frames', () => {
    expect(getFinanceAnimationTestSceneStartFrame(0)).toBe(0);
    expect(getFinanceAnimationTestSceneStartFrame(2)).toBe(
      FINANCE_ANIMATION_TEST_SCENE_DURATION * 2,
    );
    expect(getFinanceAnimationTestSceneMiddleFrame(2)).toBe(
      FINANCE_ANIMATION_TEST_SCENE_DURATION * 2 +
        Math.floor(FINANCE_ANIMATION_TEST_SCENE_DURATION / 2),
    );
    expect(getFinanceAnimationTestSceneStartFrame(-2)).toBe(0);
  });

  it('creates a renderable reel component', () => {
    expect(React.isValidElement(<AnimationTestReel />)).toBe(true);
  });
});
