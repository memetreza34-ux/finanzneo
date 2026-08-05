import {describe, expect, it} from 'vitest';
import {resolveTimelineMilestoneState} from './TimelineMilestonesTemplate';

describe('resolveTimelineMilestoneState', () => {
  it('positions the first and last milestones at the timeline boundaries', () => {
    expect(resolveTimelineMilestoneState(0, 4, 1).position).toBe(0);
    expect(resolveTimelineMilestoneState(3, 4, 1).position).toBe(1);
  });

  it('reveals milestones progressively along the timeline', () => {
    expect(resolveTimelineMilestoneState(0, 4, 0).reveal).toBe(0);
    expect(resolveTimelineMilestoneState(0, 4, 0.02).reveal).toBe(1);
    expect(resolveTimelineMilestoneState(3, 4, 0.5).reveal).toBe(0);
    expect(resolveTimelineMilestoneState(3, 4, 1).reveal).toBe(1);
  });

  it('reduces milestone width when five items would overlap', () => {
    expect(resolveTimelineMilestoneState(0, 4, 1).width).toBe(190);
    expect(resolveTimelineMilestoneState(0, 5, 1).width).toBe(164);
  });

  it('handles a single milestone and malformed input safely', () => {
    expect(resolveTimelineMilestoneState(0, 1, 1)).toEqual({
      position: 0,
      reveal: 1,
      width: 190,
    });

    const malformed = resolveTimelineMilestoneState(
      Number.NaN,
      Number.NaN,
      Number.POSITIVE_INFINITY,
    );
    expect(malformed.position).toBe(0);
    expect(malformed.reveal).toBe(0);
    expect(malformed.width).toBe(190);
  });
});
