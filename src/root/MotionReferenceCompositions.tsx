import React from 'react';
import {Composition} from 'remotion';
import {
  FinanzNeoMotionReferenceV1,
  FINANZNEO_MOTION_REFERENCE_FRAMES,
} from '../motion';
import {FORMAT} from '../brand/tokens';

/**
 * Canonical internal motion references.
 * These are design-system showcases, not publishable production videos.
 */
export const MotionReferenceCompositions: React.FC = () => (
  <>
    <Composition
      id="FinanzNeoMotionReferenceV1"
      component={FinanzNeoMotionReferenceV1}
      durationInFrames={FINANZNEO_MOTION_REFERENCE_FRAMES}
      fps={FORMAT.fps}
      {...FORMAT.vertical}
    />
  </>
);
