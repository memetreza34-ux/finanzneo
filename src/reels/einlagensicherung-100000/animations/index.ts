import type React from 'react';
import {PersonAndBankLimit} from './PersonAndBankLimit';
import {SameBankAggregation} from './SameBankAggregation';
import {StatutoryCoverageBoundary} from './StatutoryCoverageBoundary';
import {SeparateBankLimits} from './SeparateBankLimits';
import {JointAccountTwoHolders} from './JointAccountTwoHolders';
import {TemporaryHighBalanceWindow} from './TemporaryHighBalanceWindow';

export type AnimationComponent = React.FC<{durationFrames: number}>;

export const ANIMATION_BY_SCENE: Record<string, AnimationComponent> = {
  'scene-02': PersonAndBankLimit,
  'scene-04': SameBankAggregation,
  'scene-06': StatutoryCoverageBoundary,
  'scene-08': SeparateBankLimits,
  'scene-10': JointAccountTwoHolders,
  'scene-12': TemporaryHighBalanceWindow,
};
