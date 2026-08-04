import {describe, expect, it} from 'vitest';
import {
  ANNUAL_RETURN_PERCENT,
  EARLY_CONTRIBUTIONS,
  EARLY_FINAL,
  FIRST_FULL_ANIMATION_DURATION,
  FIRST_FULL_ANIMATION_SCENES,
  LATE_CONTRIBUTIONS,
  LATE_FINAL,
  balanceAtAge,
  getFirstFullAnimationSceneStart,
  getGrowthSeries,
  monthlyFutureValue,
} from './FirstFullAnimationReel';

describe('FirstFullAnimationReel', () => {
  it('uses seven distinct fully animated scenes over exactly forty seconds', () => {
    expect(FIRST_FULL_ANIMATION_SCENES).toHaveLength(7);
    expect(new Set(FIRST_FULL_ANIMATION_SCENES.map((scene) => scene.id)).size).toBe(7);
    expect(FIRST_FULL_ANIMATION_DURATION).toBe(1200);
    expect(FIRST_FULL_ANIMATION_SCENES.every((scene) => scene.caption.length > 20)).toBe(true);
  });

  it('calculates exact scene starts', () => {
    expect(getFirstFullAnimationSceneStart('early-vs-late-race')).toBe(0);
    expect(getFirstFullAnimationSceneStart('dual-contribution-timeline')).toBe(120);
    expect(getFirstFullAnimationSceneStart('contribution-result-flip')).toBe(270);
    expect(getFirstFullAnimationSceneStart('compound-engine')).toBe(420);
    expect(getFirstFullAnimationSceneStart('delayed-growth-race')).toBe(600);
    expect(getFirstFullAnimationSceneStart('capital-composition-reveal')).toBe(840);
    expect(getFirstFullAnimationSceneStart('time-advantage-finale')).toBe(1020);
  });

  it('matches the monthly contribution future-value example', () => {
    expect(ANNUAL_RETURN_PERCENT).toBe(7);
    expect(EARLY_CONTRIBUTIONS).toBe(48000);
    expect(LATE_CONTRIBUTIONS).toBe(72000);
    expect(EARLY_FINAL).toBeCloseTo(262481.3398, 3);
    expect(LATE_FINAL).toBeCloseTo(243994.1992, 3);
    expect(Math.round(EARLY_FINAL)).toBe(262481);
    expect(Math.round(LATE_FINAL)).toBe(243994);
  });

  it('shows that earlier investing wins despite lower contributions', () => {
    expect(EARLY_CONTRIBUTIONS).toBeLessThan(LATE_CONTRIBUTIONS);
    expect(EARLY_FINAL).toBeGreaterThan(LATE_FINAL);
    expect(EARLY_FINAL - EARLY_CONTRIBUTIONS).toBeGreaterThan(
      LATE_FINAL - LATE_CONTRIBUTIONS,
    );
  });

  it('keeps the early-start balance ahead from age thirty through sixty', () => {
    for (let age = 30; age <= 60; age += 1) {
      expect(balanceAtAge(100, 20, age)).toBeGreaterThan(
        balanceAtAge(200, 30, age),
      );
    }
  });

  it('creates deterministic age series and handles zero-rate inputs', () => {
    const early = getGrowthSeries(100, 20);
    const late = getGrowthSeries(200, 30);
    expect(early).toHaveLength(41);
    expect(late).toHaveLength(41);
    expect(early[0]).toEqual({age: 20, value: 0});
    expect(late[10]).toEqual({age: 30, value: 0});
    expect(early.at(-1)?.value).toBeCloseTo(EARLY_FINAL, 8);
    expect(late.at(-1)?.value).toBeCloseTo(LATE_FINAL, 8);
    expect(monthlyFutureValue(100, 0, 12)).toBe(1200);
    expect(monthlyFutureValue(0, 7, 120)).toBe(0);
  });
});
