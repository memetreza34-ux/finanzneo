import {Easing, interpolate, spring} from 'remotion';

export const MOTION_V3 = {
  id: 'finanzneo-editorial-motion-v3',
  surface: {
    cream: '#F4EFE4',
    paper: '#FBF8F1',
    mist: '#ECEDEA',
    sage: '#E7EEE8',
    dark: '#26302B',
  },
  ink: '#24302A',
  inkSoft: '#657069',
  line: '#D3D7D1',
  green: '#5F8E70',
  greenDark: '#3F6D54',
  blue: '#68839B',
  orange: '#D77C5F',
  gold: '#BE9A50',
  white: '#FFFFFF',
} as const;

export const CLAMP = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const progress = (
  frame: number,
  from: number,
  to: number,
  easing = Easing.out(Easing.cubic),
) => interpolate(frame, [from, to], [0, 1], {...CLAMP, easing});

export const lerp = (
  frame: number,
  input: [number, number],
  output: [number, number],
) => interpolate(frame, input, output, CLAMP);

export const editorialSpring = (
  frame: number,
  from: number,
  fps: number,
  config: 'soft' | 'snappy' | 'heavy' = 'soft',
) => {
  const presets = {
    soft: {damping: 20, stiffness: 145, mass: 0.78},
    snappy: {damping: 17, stiffness: 180, mass: 0.68},
    heavy: {damping: 24, stiffness: 125, mass: 1.05},
  } as const;
  return spring({
    frame: Math.max(0, frame - from),
    fps,
    config: presets[config],
  });
};

export const MOTION_GRAMMAR = {
  DRAW: 'draw',
  FOLLOW: 'follow',
  REVEAL: 'reveal',
  SPLIT: 'split',
  MERGE: 'merge',
  STACK: 'stack',
  SHIFT: 'shift',
  SWAP: 'swap',
  EMPHASIZE: 'emphasize',
  COUNT: 'count',
} as const;

export type MotionGrammar = typeof MOTION_GRAMMAR[keyof typeof MOTION_GRAMMAR];

export const RESULT_HOLD_FRAMES = 24;
