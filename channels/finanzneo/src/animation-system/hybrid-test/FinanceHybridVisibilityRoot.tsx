import React from 'react';
import {Composition} from 'remotion';
import {
  FINANCE_HYBRID_VISIBILITY_DURATION,
  FinanceHybridVisibilityTest,
} from './FinanceHybridVisibilityTest';

export const FinanceHybridVisibilityRoot: React.FC = () => (
  <Composition
    id="FinanceHybridVisibilityTest"
    component={FinanceHybridVisibilityTest}
    durationInFrames={FINANCE_HYBRID_VISIBILITY_DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
);
