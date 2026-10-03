import {Easing, interpolate} from 'remotion';

export type FinanceMotionProfileId =
  | 'transfer'
  | 'growth'
  | 'drain'
  | 'rebalance'
  | 'comparison'
  | 'compound';

export type FinanceMotionProfile = {
  id: FinanceMotionProfileId;
  setupRatio: number;
  actionEndRatio: number;
  payoffRatio: number;
  character: string;
};

export const FINANCE_MOTION_PROFILES_V2: Record<FinanceMotionProfileId, FinanceMotionProfile> = {
  transfer: {
    id: 'transfer',
    setupRatio: 0.12,
    actionEndRatio: 0.55,
    payoffRatio: 0.7,
    character: 'fast launch, directional travel, clear destination impact',
  },
  growth: {
    id: 'growth',
    setupRatio: 0.12,
    actionEndRatio: 0.72,
    payoffRatio: 0.8,
    character: 'progressive build with visibly accelerating later stages',
  },
  drain: {
    id: 'drain',
    setupRatio: 0.14,
    actionEndRatio: 0.62,
    payoffRatio: 0.74,
    character: 'repeated sharp deductions followed by a reduced stable result',
  },
  rebalance: {
    id: 'rebalance',
    setupRatio: 0.14,
    actionEndRatio: 0.7,
    payoffRatio: 0.8,
    character: 'weight transfer, overshoot-free balance correction, settled target',
  },
  comparison: {
    id: 'comparison',
    setupRatio: 0.1,
    actionEndRatio: 0.7,
    payoffRatio: 0.8,
    character: 'shared start, synchronized development, then visible divergence',
  },
  compound: {
    id: 'compound',
    setupRatio: 0.1,
    actionEndRatio: 0.76,
    payoffRatio: 0.84,
    character: 'small early gains followed by increasingly strong period-to-period growth',
  },
};

const frameAt = (durationFrames: number, ratio: number): number =>
  Math.max(1, Math.round(durationFrames * ratio));

export const profileProgress = (
  frame: number,
  durationFrames: number,
  profileId: FinanceMotionProfileId,
): number => {
  const profile = FINANCE_MOTION_PROFILES_V2[profileId];
  return interpolate(
    frame,
    [frameAt(durationFrames, profile.setupRatio), frameAt(durationFrames, profile.actionEndRatio)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing:
        profileId === 'transfer'
          ? Easing.bezier(0.22, 0.78, 0.18, 1)
          : profileId === 'drain'
            ? Easing.bezier(0.3, 0.02, 0.2, 1)
            : profileId === 'comparison'
              ? Easing.bezier(0.18, 0.72, 0.24, 1)
              : Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
};

export const profilePayoff = (
  frame: number,
  durationFrames: number,
  profileId: FinanceMotionProfileId,
): number => {
  const profile = FINANCE_MOTION_PROFILES_V2[profileId];
  const start = frameAt(durationFrames, profile.payoffRatio);
  const end = Math.min(durationFrames - 1, start + Math.max(5, Math.round(durationFrames * 0.08)));
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};
