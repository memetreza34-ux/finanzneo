import {interpolate} from 'remotion';
import {CLAMP, E} from '../brand/tokens';

/**
 * Canonical FinanzNeo motion timings at 30 fps.
 * Scenes may be longer, but should compose these rhythms instead of inventing
 * new timing values for every element.
 */
export const FN_MOTION = {
  timing: {
    micro: 8,
    enter: 14,
    action: 24,
    heavyAction: 30,
    resultHold: 18,
    exit: 10,
    stagger: 3,
  },
  springs: {
    precise: {damping: 24, stiffness: 180, mass: 0.75},
    physical: {damping: 18, stiffness: 140, mass: 0.9},
    heavy: {damping: 20, stiffness: 100, mass: 1.3},
  },
  density: {
    maxHeroObjects: 1,
    maxSupportGroups: 1,
    maxPrimaryMotions: 2,
    maxCameraActions: 1,
  },
} as const;

export const motionProgress = (
  frame: number,
  from: number,
  to: number,
  easing: (value: number) => number = E.out,
) =>
  interpolate(frame, [from, to], [0, 1], {
    ...CLAMP,
    easing,
  });

export const motionValue = (
  frame: number,
  from: number,
  to: number,
  startValue: number,
  endValue: number,
  easing: (value: number) => number = E.out,
) =>
  interpolate(frame, [from, to], [startValue, endValue], {
    ...CLAMP,
    easing,
  });

/** Keeps an action finished for the rest of the scene instead of reanimating it. */
export const resultProgress = (frame: number, from: number, to: number) =>
  motionProgress(frame, from, to, E.out);
